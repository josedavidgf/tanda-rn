import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    View,
    Pressable,
    StyleSheet,
    Linking,
} from 'react-native';
import SimpleLayout from '@/components/layout/SimpleLayout';
import ChatBox from '@/components/chat/Chatbox';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { getMessagesBySwap, sendMessage } from '@/services/messagesService';
import { useSwapApi } from '@/api/useSwapApi';
import { useAuth } from '@/contexts/AuthContext';
import AppText from '@/components/ui/AppText';
import { spacing, colors } from '@/styles';
import { shiftTypeLabels } from '@/utils/useLabelMap';
import { formatFriendlyDate } from '@/utils/useFormatFriendlyDate';
import { PaperPlaneTilt } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkerApi } from '@/api/useWorkerApi';
import { markMessagesAsRead } from '@/api/useMessagesApi';
import { useUnreadMessages } from '@/app/hooks/useUnreadMessages';
import { Phone } from 'phosphor-react-native';


export default function ChatPageScreen() {
    const route = useRoute();
    const { accessToken } = useAuth();
    const { swapId } = route.params as { swapId: string };
    const { session } = useAuth();
    const scrollRef = useRef<ScrollView>(null);
    const inputRef = useRef<TextInput>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [swapContext, setSwapContext] = useState<any>(null);
    const { getSwapById } = useSwapApi();
    const [myWorkerId, setMyWorkerId] = useState<string | null>(null);
    const [otherWorkerId, setOtherWorkerId] = useState<string | null>(null);
    const { getMyWorkerProfile } = useWorkerApi();
    const { refreshUnreadMessages } = useUnreadMessages();


    useEffect(() => {
        async function loadMessages() {
            const msgs = await getMessagesBySwap(swapId, accessToken);
            setMessages(msgs);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
        }

        async function loadSwap() {
            const swap = await getSwapById(swapId, accessToken);
            setSwapContext(swap);
            const worker = await getMyWorkerProfile(accessToken);
            setMyWorkerId(worker.worker_id);
            const otherId = swap.requester_id === worker.worker_id
                ? swap.shift.worker.worker_id
                : swap.requester.worker_id;

            setOtherWorkerId(otherId);

        }

        loadMessages();
        loadSwap();
        inputRef.current?.focus();
    }, [swapId]);

    useFocusEffect(
        React.useCallback(() => {
            const markAsSeen = async () => {
                await markMessagesAsRead(accessToken, swapId);
                await refreshUnreadMessages(); // 🔁 actualiza BottomNav

            };
            markAsSeen();
        }, [swapId])
    );

    const handleSend = async () => {
        if (!input.trim()) return;
        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            message_id: tempId, // ✅ necesario para React key
            id: tempId,
            swap_id: swapId,
            sender_id: myWorkerId,
            recipient_id: otherWorkerId,
            content: input,
            created_at: new Date().toISOString(),
            status: 'sending',
        };
        setMessages((prev) => [...prev, tempMessage]);
        setInput('');
        setSending(true);

        const { data, error } = await sendMessage({
            token: accessToken,
            swap_id: swapId,
            sender_id: myWorkerId,
            recipient_id: otherWorkerId,
            content: input,
        });
        if (!error && data) {
            setMessages((prev) => [...prev.filter((m) => m.message_id !== tempId), data]);
        } else {
            setMessages((prev) =>
                prev.map((m) => (m.message_id === tempId ? { ...m, status: 'failed' } : m))
            );
        }
        setSending(false);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const renderSwapContext = () => {
        if (!swapContext) return null;

        const isNoReturn = swapContext.swap_type === 'no_return';
        const isMine = swapContext.requester_id === session.user.id;

        const myDate = isMine
            ? swapContext.offered_date
            : swapContext.shift.date;
        const myType = isMine
            ? swapContext.offered_type
            : swapContext.shift.shift_type;
        const otherDate = isMine
            ? swapContext.shift.date
            : swapContext.offered_date;
        const otherType = isMine
            ? swapContext.shift.shift_type
            : swapContext.offered_type;

        if (isNoReturn) {
            return (
                <AppText variant="p" style={styles.contextText}>
                    Has ofrecido tu turno del {formatFriendlyDate(myDate)} de {shiftTypeLabels[myType]} sin esperar devolución.
                </AppText>
            );
        }

        return (
            <AppText variant="p" style={styles.contextText}>
                Tú haces el {formatFriendlyDate(otherDate)} de {shiftTypeLabels[otherType]} por el {formatFriendlyDate(myDate)} de {shiftTypeLabels[myType]}
            </AppText>
        );
    };

    // 🔁 Extrae datos del contexto del swap
    let fullPhone = '';
    let phoneLink = null;

    if (swapContext && session) {
        const isMine = swapContext.requester_id === session.user.id;
        const otherPersonMobileCountryCode = isMine
            ? swapContext.shift.worker.mobile_country_code
            : swapContext.requester.mobile_country_code;
        const otherPersonMobilePhone = isMine
            ? swapContext.shift.worker.mobile_phone
            : swapContext.requester.mobile_phone;

        fullPhone = `${otherPersonMobileCountryCode ?? ''}${otherPersonMobilePhone ?? ''}`.replace(/\s+/g, '');
        phoneLink = fullPhone.length >= 10 ? `tel:${fullPhone}` : null;
    }





    return (
        <SimpleLayout
            title="Conversación"
            showBackButton
            rightAction={
                phoneLink
                    ? {
                        label: 'Llamar',
                        icon: <Phone size={20} />, // Ajusta color si es necesario
                        onPress: () => {
                            //trackEvent(EVENTS.CHAT_CALL_BUTTON_CLICKED, { swapId, phone: fullPhone });
                            Linking.openURL(phoneLink);
                        },
                    }
                    : undefined
            }
        >
            <SafeAreaView style={styles.safeArea}>
                {renderSwapContext()}
                <KeyboardAvoidingView
                    style={styles.wrapper}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
                >
                    <View style={{ padding: spacing.sm }}>
                    </View>
                    <View style={styles.chatContainer}>
                        <ScrollView
                            ref={scrollRef}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >


                            {messages.map((msg) => (
                                <ChatBox
                                    key={msg.message_id}
                                    text={msg.content}
                                    isMine={msg.sender_id === myWorkerId}
                                    timestamp={msg.created_at}
                                    status={msg.status}
                                />
                            ))}
                        </ScrollView>

                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                value={input}
                                onChangeText={setInput}
                                placeholder="Escribe un mensaje..."
                                editable={!sending}
                            />
                            <Pressable
                                onPress={handleSend}
                                disabled={sending || !input.trim()}
                                style={styles.sendButton}
                            >
                                <PaperPlaneTilt size={24} color={sending ? '#ccc' : '#007AFF'} />
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

        </SimpleLayout>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white,
    },
    wrapper: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollContent: {
        padding: spacing.md,
        gap: spacing.sm,
    },
    contextText: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomColor: colors.gray[200],
        borderBottomWidth: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: spacing.sm,
        gap: spacing.sm,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.gray[200],
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 8,
        padding: 10,
        minHeight: 40,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
