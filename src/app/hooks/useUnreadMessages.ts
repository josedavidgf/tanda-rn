import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { getUnreadMessagesPerChat } from '@/api/useMessagesApi';

export function useUnreadMessages() {
    const { getToken } = useAuth();
    const [unreadSwapIds, setUnreadSwapIds] = useState<string[]>([]);

    const fetchUnread = useCallback(async () => {
        try {
            const token = await getToken();
            const res = await getUnreadMessagesPerChat(token);
            console.log('Unread messages response:', res);
            setUnreadSwapIds(res.map((r) => r.swap_id));
            console.log('Unread swap IDs:', res.map((r) => r.swap_id));
        } catch (error) {
            console.error('Error fetching unread messages:', error);
            setUnreadSwapIds([]);
        }
    }, [getToken]);

    useFocusEffect(
        useCallback(() => {
            fetchUnread();
        }, [fetchUnread])
    );

    return {
        hasUnreadMessages: unreadSwapIds.length > 0,
        unreadSwapIds,
        refreshUnreadMessages: fetchUnread,
    };
}
