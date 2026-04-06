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
    paddingBottom: 120,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  methodCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  methodHeader: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
  },
  methodTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  diamondBtn: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.primary,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  diamondIcon: {
    transform: [{ rotate: '-45deg' }],
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  theoryBody: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  levelSection: {
    marginBottom: theme.spacing.xl,
  },
  levelHeader: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFB300', // Gold/Warning color for level header
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  levelSubTitle: {
     fontSize: 16,
     fontWeight: '800',
     color: '#FFFFFF',
     marginBottom: theme.spacing.md,
     backgroundColor: theme.colors.glass,
     padding: 8,
     borderRadius: 4,
  },
  textItem: {
    fontSize: 15,
    color: theme.colors.text.primary,
    lineHeight: 22,
    marginBottom: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 15,
  },
  pointText: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    marginLeft: 10,
    lineHeight: 22,
    flex: 1,
  },
  tipItem: {
    backgroundColor: theme.colors.primary + '15',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
    marginVertical: 10,
  },
  tipText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  warningItem: {
    backgroundColor: theme.colors.error + '10',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error + '40',
    marginVertical: 8,
  },
  warningText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: '600',
  }
});
