import { theme } from '../../theme';

export const highlightTex = (tex: string | number) => `\\textcolor{${theme.colors.success}}{${tex}}`;
