import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, Pressable, View, StyleSheet } from 'react-native';
import AppLayout from '@/components/layout/AppLayout';
import AppLoader from '@/components/ui/AppLoader';
//import EmptyState from '@/components/ui/EmptyState';
import ChatCardContent from '@/components/ui/cards/ChatCardContent';
import SearchFilterInput from '@/components/forms/SearchFilterInput';
import { useNavigation } from '@react-navigation/native';
import { useSwapApi } from '@/api/useSwapApi';
import { useWorkerApi } from '@/api/useWorkerApi';
import { useAuth } from '@/contexts/AuthContext';
import { spacing } from '@/styles';
import AppText from '@/components/ui/AppText';
import FadeInView from '@/components/animations/FadeInView';
import { useUnreadMessages } from '@/app/hooks/useUnreadMessages';
import EmptyState from '@/components/ui/EmptyState';



export default function ChatListScreen() {
    const [swaps, setSwaps] = useState([]);
    const [filteredSwaps, setFilteredSwaps] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [workerId, setWorkerId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { getToken } = useAuth();
    const { getAcceptedSwaps } = useSwapApi();
    const { getMyWorkerProfile } = useWorkerApi();
    const { unreadSwapIds } = useUnreadMessages();


    useEffect(() => {
        async function loadChats() {
            try {
                setLoading(true);
                const token = await getToken();
                const worker = await getMyWorkerProfile(token);
                setWorkerId(worker.worker_id);

                const allSwaps = await getAcceptedSwaps(token);
                const active = allSwaps
                    .filter((swap) => {
                        const d1 = new Date(swap.shift.date);
                        const d2 = new Date(swap.offered_date);
                        return new Date() <= (d1 > d2 ? d1 : d2);
                    })
                    .sort((a, b) => new Date(a.shift.date) - new Date(b.shift.date));

                setSwaps(active);
                setFilteredSwaps(active);
            } catch (e) {
                Alert.alert('Error', 'No se pudieron cargar tus chats activos.');
            } finally {
                setLoading(false);
            }
        }

        loadChats();
    }, []);

    useEffect(() => {
        if (searchQuery.length === 0) {
            setFilteredSwaps(swaps);
            return;
        }

        if (searchQuery.length < 3) return; // 👈 nueva condición

        const lower = searchQuery.toLowerCase();
        const filtered = swaps.filter((swap) => {
            const iAmRequester = swap.requester_id === workerId;
            const otherPerson = iAmRequester ? swap.shift.worker : swap.requester;
            const name = `${otherPerson.name} ${otherPerson.surname}`.toLowerCase();
            return name.includes(lower);
        });

        setFilteredSwaps(filtered);
    }, [searchQuery, swaps, workerId]);


    return (
        <FadeInView>
            <AppLayout title="Tus mensajes">
                {loading ? (
                    <AppLoader message="Cargando chats..." onFinish={() => setLoading(false)} />
                ) : swaps.length === 0 ? (

                    <EmptyState
                        title="Sin intercambios aún"
                        description="Aquí verás los cambios de turno propuestos o recibidos"
                        ctaLabel="Proponer uno nuevo"
                        onCtaClick={() => navigation.navigate('MySwaps')}
                    />
                ) : (
                    <ScrollView contentContainerStyle={{ gap: 12, padding: 16 }}>
                        <SearchFilterInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Buscar por nombre..."
                        />

                        {filteredSwaps.length === 0 && searchQuery.length >= 3 ? (
                            <EmptyState
                                title="No hay resultados"
                                description="No se encontraron resultados para tu búsqueda."
                            />
                        ) : (
                            filteredSwaps.map((swap) => {
                                const iAmRequester = swap.requester_id === workerId;
                                const myDate = iAmRequester ? swap.offered_date : swap.shift.date;
                                const myType = iAmRequester ? swap.offered_type : swap.shift.shift_type;
                                const otherDate = iAmRequester ? swap.shift.date : swap.offered_date;
                                const otherType = iAmRequester ? swap.shift.shift_type : swap.offered_type;
                                const otherPerson = iAmRequester ? swap.shift.worker : swap.requester;
                                const hasUnread = unreadSwapIds.includes(swap.swap_id);

                                return (
                                    <Pressable
                                        key={swap.swap_id}
                                        onPress={() => navigation.navigate('ChatPage', { swapId: swap.swap_id })}
                                        style={styles.cardWrapper}
                                    >
                                        <ChatCardContent
                                            otherPersonName={`${otherPerson.name} ${otherPerson.surname}`}
                                            myDate={myDate}
                                            myType={myType}
                                            otherDate={otherDate}
                                            otherType={otherType}
                                            statusLabel={swap.status}
                                        />
                                        {hasUnread && <View style={styles.dot} />}
                                    </Pressable>
                                );
                            })
                        )}
                    </ScrollView>
                )}
            </AppLayout>
        </FadeInView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    empty: {
        padding: spacing.md,
        alignItems: 'center',
    },
    cardWrapper: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#eee',
        position: 'relative',
        marginBottom: spacing.sm,
    },

    dot: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        borderWidth: 1,
        borderColor: 'white',
        zIndex: 10,
    },
});