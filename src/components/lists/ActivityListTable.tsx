import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ActivityCardContent from '@/components/ui/cards/ActivityCardContent';
import { USER_EVENT_CONFIG } from '@/utils/userEvents';
import { spacing } from '@/styles';


export default function ActivityListTable({ events }: { events: any[] }) {

    return (
        <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
                const config = USER_EVENT_CONFIG[item.type] || {};
                const IconComponent = config.icon;
                const title = config.title || item.type;
                const description = config.getDescription?.(item.metadata) || '';

                return (
                    <View style={styles.cardWrapper}>
                        <ActivityCardContent
                            icon={<IconComponent size={20} color="white" backgroundColor='black'/>}
                            title={title}
                            description={description}
                            date={item.created_at}
                        />
                    </View>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        gap: spacing.md,
        padding: spacing.md,
    },
    cardWrapper: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#eee',
    },
});
