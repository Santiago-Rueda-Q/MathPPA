import { StyleSheet } from 'react-native';
import { theme } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.grey[850],
    borderRadius: 12,
    marginTop: 15,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grey[500],
    padding: 5,
  }
});
