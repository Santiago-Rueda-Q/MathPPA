export const sanitizeExpression = (expression: string): string =>
  expression
    .replace(/e\^\{([^}]*)\}/g, 'exp($1)')
    .replace(/\^\{([^}]*)\}/g, '^($1)')
    .replace(/\\pi/g, 'pi')
    .replace(/\\cdot/g, '*')
    .replace(/\\div/g, '/')
    .replace(/sen \(/g, 'sin(')
    .replace(/sen\(/g, 'sin(');               
