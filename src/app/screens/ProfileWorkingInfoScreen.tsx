import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessCodeApi } from '@/api/useAccessCodeApi';
import { useHospitalApi } from '@/api/useHospitalApi';
import { useWorkerApi } from '@/api/useWorkerApi';
import { useSpecialityApi } from '@/api/useSpecialityApi';
import { useUserApi } from '@/api/useUserApi';
import { useToast } from '@/app/hooks/useToast';
import { translateWorkerType } from '@/utils/useTranslateServices';
import { EVENTS } from '@/utils/amplitudeEvents';
import { trackEvent } from '../hooks/useTrackPageView';
import SimpleLayout from '@/components/layout/SimpleLayout';
import ViewStep from '@/components/workInfoSteps/ViewStep';
import CodeStep from '@/components/workInfoSteps/CodeStep';
import SpecialityStep from '@/components/workInfoSteps/SpecialityStep';
import ConfirmStep from '@/components/workInfoSteps/ConfirmStep';

export default function ProfileWorkingInfoScreen() {
    const [step, setStep] = useState<'view' | 'code' | 'confirm' | 'speciality'>('view');
    const [code, setCode] = useState('');
    const [hospitalId, setHospitalId] = useState<string | null>(null);
    const [workerTypeId, setWorkerTypeId] = useState<string | null>(null);
    const [hospitalName, setHospitalName] = useState('');
    const [workerTypeName, setWorkerTypeName] = useState('');
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState('');

    const { accessToken, isWorker, setIsWorker } = useAuth();
    const { validateAccessCode } = useAccessCodeApi();
    const { getHospitals } = useHospitalApi();
    const { getWorkerTypes } = useWorkerApi();
    const { getSpecialitiesByHospital } = useSpecialityApi();
    const { updateWorkerHospital, updateWorkerSpeciality } = useUserApi();
    const { showError, showSuccess } = useToast();
    const navigation = useNavigation();

    useEffect(() => {
        if (!isWorker) {
            showError('No tienes permisos para acceder a esta sección.');
            navigation.goBack();
        }
    }, [isWorker]);

    const handleLoadSpecialities = async () => {
        try {
            trackEvent(EVENTS.WORK_SETTINGS_EDIT_SPECIALITY_CLICKED);
            const effectiveHospitalId = hospitalId || isWorker?.workers_hospitals?.[0]?.hospital_id;
            const data = await getSpecialitiesByHospital(effectiveHospitalId, accessToken);
            setSpecialities(data);
            setStep('speciality');
        } catch (err) {
            showError('Error cargando especialidades.');
        }
    };

    const handleValidateCode = async () => {
        try {
            trackEvent(EVENTS.WORK_SETTINGS_CODE_SUBMITTED, { code });
            const response = await validateAccessCode(code);
            setHospitalId(response.hospital_id);
            setWorkerTypeId(response.worker_type_id);

            const hospitals = await getHospitals(accessToken);
            const workerTypes = await getWorkerTypes(accessToken);

            const hospital = hospitals.find(h => h.hospital_id === response.hospital_id);
            const workerType = workerTypes.find(w => w.worker_type_id === response.worker_type_id);

            if (code.length !== 4) {
                showError('El código debe tener exactamente 4 caracteres.');
                return;
            }

            setHospitalName(hospital?.name || '');
            setWorkerTypeName(translateWorkerType[workerType?.worker_type_name] || '');
            setStep('confirm');
            trackEvent(EVENTS.WORK_SETTINGS_CONFIRM_CODE_ACCEPTED, { code });
        } catch (err) {
            //trackEvent(EVENTS.WORK_SETTINGS_CODE_FAILED, { code, error: err.message });
            showError('Código inválido. Verifica e inténtalo de nuevo.');
        }
    };
    const handleConfirmChanges = async () => {
        try {
            trackEvent(EVENTS.WORK_SETTINGS_SAVE_CHANGES_SUBMITTED, {
                hospitalId,
                specialityId: selectedSpeciality,
            });
            const effectiveHospitalId = hospitalId || isWorker?.workers_hospitals?.[0]?.hospital_id;

            if (!effectiveHospitalId || !selectedSpeciality) {
                showError('Selecciona una especialidad antes de continuar.');
                return;
            }

            await updateWorkerHospital({ hospital_id: effectiveHospitalId }, accessToken);
            await updateWorkerSpeciality({ speciality_id: selectedSpeciality }, accessToken);
            const updated = await getHospitals(accessToken);
            setIsWorker(updated);
            showSuccess('Cambios guardados');
            setStep('view');
            trackEvent(EVENTS.WORK_SETTINGS_SAVE_CHANGES_SUCCESS, {
                hospitalId: effectiveHospitalId,
                specialityId: selectedSpeciality,
            });
        } catch (err) {
            showError('Error guardando los cambios.');
            trackEvent(EVENTS.WORK_SETTINGS_SAVE_CHANGES_FAILED, {
                hospitalId,
                specialityId: selectedSpeciality,
                error: err?.message,
            });
        }
    };


    return (
        <SimpleLayout title="Situación profesional" showBackButton>
            {step === 'view' && (
                <ViewStep
                    worker={isWorker}
                    onChangeSpeciality={() => {
                        trackEvent(EVENTS.WORK_SETTINGS_EDIT_SPECIALITY_CLICKED);
                        handleLoadSpecialities();
                    }}
                    onChangeHospital={() => {
                        trackEvent(EVENTS.WORK_SETTINGS_EDIT_HOSPITAL_CLICKED);
                        setStep('code');
                        setSelectedSpeciality('');
                    }}
                />
            )}

            {step === 'code' && (
                <CodeStep
                    code={code}
                    setCode={setCode}
                    onValidate={handleValidateCode}
                />
            )}
            {step === 'speciality' && (
                <SpecialityStep
                    specialities={specialities}
                    selectedSpeciality={selectedSpeciality}
                    setSelectedSpeciality={setSelectedSpeciality}
                    onConfirm={handleConfirmChanges}
                    loading={false}
                />
            )}
            {step === 'confirm' && (
                <ConfirmStep
                    hospitalName={hospitalName}
                    workerTypeName={workerTypeName}
                    onConfirm={handleLoadSpecialities} // ✅ solo pasa a specialities
                />
            )}
        </SimpleLayout>
    );
}
