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

export default function OnboardingSpecialityScreen() {
  const { isWorker, getToken } = useAuth();
  const navigation = useNavigation();
  const { getSpecialitiesByHospital, addSpecialityToWorker } = useSpecialityApi();
  const { showError, showSuccess } = useToast();

  const [specialities, setSpecialities] = useState<any[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useOnboardingGuard({ currentStep: 'OnboardingSpeciality' });

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
      showSuccess('Especialidad guardada correctamente');
      navigation.navigate('OnboardingName');
    } catch (err: any) {
      showError('Error guardando la especialidad.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AppLoader />;

  return (
    <SimpleLayout title="Especialidad" showBackButton>
      <View style={styles.wrapper}>
        <AppText variant="p" style={styles.intro}>
          Selecciona el servicio en el que trabajas
        </AppText>

        <SearchFilterInput value={query} onChange={setQuery} />

        <SpecialitiesGrid
          specialities={filteredSpecialities}
          selectedSpeciality={selectedSpeciality}
          setSelectedSpeciality={setSelectedSpeciality}
        />

        <Button
          label="Continuar"
          size="lg"
          variant="primary"
          onPress={handleConfirm}
          loading={saving}
          disabled={!selectedSpeciality || saving}
          style={{ marginTop: 24 }}
        />
      </View>
    </SimpleLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    gap: 12,
  },
  intro: {
    marginBottom: 8,
  },
});
