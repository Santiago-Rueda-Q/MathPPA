import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 40) / 5;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#333',
    ...Platform.select({
      ios: { paddingBottom: 35 },
      android: { paddingBottom: 15 },
      web: { paddingBottom: 15 }
    })
  },
  previewContainer: {
    backgroundColor: '#252525',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
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
    backgroundColor: '#333',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  numButton: {
    backgroundColor: '#E0E0E0',
  },
  numText: {
    color: '#333',
    fontWeight: '700',
  },
  opButton: {
    backgroundColor: '#424242',
  },
  delButton: {
    backgroundColor: '#FFB300', // Yellow/Gold
  },
  acButton: {
    backgroundColor: '#E53935', // Red
  },
  equalButton: {
    backgroundColor: '#1E88E5', // Blue
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
