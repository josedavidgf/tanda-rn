import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { useSpecialityApi } from '@/api/useSpecialityApi';
import { useToast } from '@/app/hooks/useToast';
import { useOnboardingGuard } from '@/app/hooks/useOnboardingGuard';
import AppLoader from '@/components/ui/AppLoader';
import SimpleLayout from '@/components/layout/SimpleLayout';
import Button from '@/components/ui/Button';
import AppText from '@/components/ui/AppText';
import SearchFilterInput from '@/components/forms/SearchFilterInput';
import SpecialitiesGrid from '@/components/lists/SpecialitiesListTable'; // nuevo
import { useWorkerApi } from '@/api/useWorkerApi'; // nuevo
import { useOnboardingContext } from '@/contexts/OnboardingContext'; // nuevo


export default function OnboardingSpecialityScreen() {
  const { isWorker, getToken, setIsWorker } = useAuth();
  const navigation = useNavigation();
  const { getSpecialitiesByHospital, addSpecialityToWorker } = useSpecialityApi();
  const { showError, showSuccess } = useToast();
  const { getMyWorkerProfile } = useWorkerApi(); // nuevo
  const { setOnboardingData } = useOnboardingContext(); // nuevo


  const [specialities, setSpecialities] = useState<any[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useOnboardingGuard('speciality');

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getToken();
        const hospitalId = isWorker?.workers_hospitals?.[0]?.hospital_id;
        if (!hospitalId) throw new Error('No hospital asociado al trabajador');
        const result = await getSpecialitiesByHospital(hospitalId, token);
        setSpecialities(result);
      } catch (err: any) {
        console.error('Error cargando especialidades:', err.message);
        showError('No se han podido cargar las especialidades.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredSpecialities = useMemo(() => {
    if (query.length < 3) return specialities;
    return specialities.filter((s) =>
      s.speciality_category.toLowerCase().includes(query.toLowerCase())
    );
  }, [specialities, query]);

  const handleConfirm = async () => {
    try {
      if (!selectedSpeciality) {
        Alert.alert('Selecciona una especialidad antes de continuar');
        return;
      }
      setSaving(true);
      const token = await getToken();

      await addSpecialityToWorker(isWorker?.worker_id, selectedSpeciality, token);

      setOnboardingData({ specialityId: selectedSpeciality }); // ✅ coherencia con contexto

      const updated = await getMyWorkerProfile(token);
      setIsWorker(updated);

      showSuccess('Especialidad guardada correctamente');
      navigation.navigate('OnboardingName');
    } catch (err: any) {
      showError('Error guardando la especialidad.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <AppLoader onFinish={() => setLoading(false)} message='Cargando especialidades...' />;

  return (
    <SimpleLayout title="Especialidad" showBackButton>
      <View style={styles.wrapper}>
        <View style={styles.scrollContent}>
          <AppText variant="p" style={styles.intro}>
            Selecciona el servicio en el que trabajas
          </AppText>

          <SearchFilterInput value={query} onChange={setQuery} />

          <View style={styles.scrollContainer}>
            <SpecialitiesGrid
              specialities={filteredSpecialities}
              selectedSpeciality={selectedSpeciality}
              setSelectedSpeciality={setSelectedSpeciality}
            />
          </View>
        </View>

        <Button
          label="Continuar"
          size="lg"
          variant="primary"
          onPress={handleConfirm}
          loading={saving}
          disabled={!selectedSpeciality || saving}
        />
      </View>
    </SimpleLayout>
  );

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  intro: {
    marginBottom: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 12,
  },
});
