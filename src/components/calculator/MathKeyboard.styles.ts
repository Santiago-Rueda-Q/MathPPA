import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 40) / 5;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.grey[750],
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey[500],
    ...Platform.select({
      ios: { paddingBottom: 35 },
      android: { paddingBottom: 15 },
      web: { paddingBottom: 15 }
    })
  },
  previewContainer: {
    backgroundColor: theme.colors.grey[650],
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey[500],
    minHeight: 80,
    justifyContent: 'center',
  },
  latexPreview: {
    height: 45,
    justifyContent: 'center',
  },
  rawPreview: {
    color: theme.colors.text.muted,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  button: {
    width: BUTTON_WIDTH - 6,
    height: 48,
    backgroundColor: theme.colors.grey[500],
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  numButton: {
    backgroundColor: theme.colors.grey[50],
  },
  numText: {
    color: theme.colors.grey[500],
    fontWeight: '700',
  },
  opButton: {
    backgroundColor: theme.colors.grey[400],
  },
  delButton: {
    backgroundColor: theme.colors.warning,
  },
  acButton: {
    backgroundColor: theme.colors.error,
  },
  equalButton: {
    backgroundColor: theme.colors.info,
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 5,
  },
  fnText: {
    fontSize: 13,
    fontWeight: '800',
  }
});
