import { useEffect, useState } from 'react';
import { getContentCards, dismissContentCard } from '@/services/contentCardService';
import { useToast } from '@/app/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';

export function useContentCards() {
    const [cards, setCards] = useState([]);
    const { accessToken } = useAuth();

    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    const load = async () => {
        try {
            setLoading(true);
            const result = await getContentCards(accessToken);
            console.log('Content cards loaded:', result);
            setCards(result || []);
        } catch (err) {
            showError('Error cargando mensajes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const dismiss = async (id: string) => {
        try {
            await dismissContentCard(id, accessToken);
            setCards(prev => prev.filter(card => card.id !== id));
        } catch {
            showError('Error al ocultar tarjeta');
        }
    };

    return {
        cards,
        loading,
        dismissCard: dismiss,
        refresh: load,
    };
}
