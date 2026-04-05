import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.lg,
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  exerciseHeader: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  exerciseLimits: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginTop: 10,
  },
  exerciseMethod: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 5,
  },
  stepCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepCardActive: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  stepCardDisabled: {
    opacity: 0.5,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  stepNumberActive: {
    color: theme.colors.accent,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    fontSize: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  inputCorrect: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + '10',
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.error + '10',
  },
  feedbackCorrect: {
    color: theme.colors.success,
    marginTop: 8,
    fontWeight: '700',
  },
  feedbackError: {
    color: theme.colors.error,
    marginTop: 8,
    fontWeight: '600',
  },
  congratsCard: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    marginBottom: 150,
  },
  congratsTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: theme.spacing.sm,
  },
  congratsBody: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});
