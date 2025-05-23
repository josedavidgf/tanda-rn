// theme/spacing.ts

export const spacing = {
  xs: 4,      // 0.25rem
  sm: 8,      // 0.5rem
  md: 16,     // 1rem
  lg: 24,     // 1.5rem
  xl: 32,     // 2rem
};

export const padding = {
  p1: { padding: spacing.sm },
  p2: { padding: spacing.md },
  p3: { padding: spacing.lg },
  px2: { paddingHorizontal: spacing.md },
  py2: { paddingVertical: spacing.md },
};

export const margin = {
  mt1: { marginTop: spacing.xs },
  mt2: { marginTop: spacing.sm },
  mt3: { marginTop: spacing.md },
  mt4: { marginTop: spacing.lg },
  mb1: { marginBottom: spacing.xs },
  mb2: { marginBottom: spacing.sm },
  mb3: { marginBottom: spacing.md },
  mb4: { marginBottom: spacing.lg },
};
