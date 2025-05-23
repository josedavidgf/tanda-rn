import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/components/ui/AppText';
import { colors, spacing, typography } from '@/styles';
import { WarningCircle, ClockClockwise } from 'phosphor-react-native';

type Props = {
  text: string;
  isMine: boolean;
  timestamp: string;
  status?: 'sending' | 'failed';
};

export default function ChatBox({ text, isMine, timestamp, status }: Props) {
  return (
    <View style={[styles.messageRow, isMine ? styles.alignRight : styles.alignLeft]}>
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleOwn : styles.bubbleOther,
          status === 'sending' && styles.sending,
        ]}
      >
        <View style={styles.contentRow}>
          <AppText style={styles.messageText}>{text}</AppText>
          {status === 'sending' && (
            <ClockClockwise size={14} color={colors.gray[600]} style={{ marginLeft: 4 }} />
          )}
          {status === 'failed' && (
            <WarningCircle size={14} color={colors.danger} weight="fill" style={{ marginLeft: 4 }} />
          )}
        </View>
      </View>
      <AppText style={styles.timeText}>
        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 12,
    padding: spacing.sm,
  },
  bubbleOwn: {
    backgroundColor: colors.blue[100],
  },
  bubbleOther: {
    backgroundColor: colors.gray[200],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: typography.md,
    color: colors.text,
    flexShrink: 1,
  },
  sending: {
    opacity: 0.6,
  },
  timeText: {
    fontSize: typography.xs,
    color: colors.gray[500],
    marginTop: 2,
    alignSelf: 'flex-end',
  },
});
