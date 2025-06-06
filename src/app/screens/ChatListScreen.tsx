import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, Pressable, View, StyleSheet } from 'react-native';
import AppLayout from '@/components/layout/AppLayout';
import AppLoader from '@/components/ui/AppLoader';
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
import { trackEvent } from '@/app/hooks/useTrackPageView';
import { EVENTS } from '@/utils/amplitudeEvents';


export default function ChatListScreen() {
    const [swaps, setSwaps] = useState([]);
    const [filteredSwaps, setFilteredSwaps] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [workerId, setWorkerId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { getAcceptedSwaps } = useSwapApi();
    const { getMyWorkerProfile } = useWorkerApi();
    const { unreadSwapIds } = useUnreadMessages();
    const { accessToken } = useAuth();


    useEffect(() => {
        async function loadChats() {
            try {
                setLoading(true);
                const worker = await getMyWorkerProfile(accessToken);
                setWorkerId(worker.worker_id);

                const allSwaps = await getAcceptedSwaps(accessToken);
                console.log('All swaps:', allSwaps);
                const active = allSwaps
                    .filter((swap) => {
                        const now = new Date().toISOString().split('T')[0];
                        console.log('Current date:', now);

                        const hasOfferedDate = !!swap.offered_date;
                        const hasShiftDate = !!swap.shift?.date;

                        // Para swaps normales (return)
                        if (hasOfferedDate && hasShiftDate) {
                            console.log('Checking swap:', swap);
                            const d1 = swap.shift.date;
                            const d2 = swap.offered_date;
                            return now <= (d1 > d2 ? d1 : d2);
                        }

                        // Para swaps no_return
                        if (swap.swap_type === 'no_return' && hasShiftDate) {
                            console.log('Checking no_return swap:', swap);
                            const d1 = swap.shift.date;
                            console.log('No return swap date d1:', d1);
                            console.log('No return swap date:', now <= d1);
                            return now <= d1;
                        }

                        return false;
                    })
                    .sort((a, b) =>
                        new Date(a.shift?.date || 0).getTime() - new Date(b.shift?.date || 0).getTime()
                    );
                console.log('Active swaps:', active);

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
                            onChange={text => {
                              if (searchQuery.length === 0 && text.length > 0) {
                                trackEvent(EVENTS.CHAT_SEARCH_STARTED);
                              }
                              if (searchQuery.length > 0 && text.length === 0) {
                                trackEvent(EVENTS.CHAT_FILTER_CLEARED);
                              }
                              setSearchQuery(text);
                            }}
                            placeholder="Buscar por nombre..."
                            label="Buscar por nombre"
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
                                const otherPersonMobileCountryCode = iAmRequester
                                    ? swap.shift.worker.mobile_country_code
                                    : swap.requester.mobile_country_code;
                                const otherPersonMobilePhone = iAmRequester
                                    ? swap.shift.worker.mobile_phone
                                    : swap.requester.mobile_phone;
                                const hasUnread = unreadSwapIds.includes(swap.swap_id);

                                const swapType = swap.swap_type;

                                return (
                                    <Pressable
                                      key={swap.swap_id}
                                      onPress={() => {
                                        trackEvent(EVENTS.CHAT_CARD_CLICKED, { swapId: swap.swap_id });
                                        navigation.navigate('ChatPage', { swapId: swap.swap_id });
                                      }}
                                      style={styles.cardWrapper}
                                    >
                                        <ChatCardContent
                                            otherPersonName={`${otherPerson.name} ${otherPerson.surname}`}
                                            myDate={myDate}
                                            myType={myType}
                                            otherDate={otherDate}
                                            otherType={otherType}
                                            otherPersonMobileCountryCode={otherPersonMobileCountryCode}
                                            otherPersonMobilePhone={otherPersonMobilePhone}
                                            swapType={swapType}
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