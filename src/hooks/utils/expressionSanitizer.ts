export const sanitizeExpression = (expression: string): string =>
  expression
    .replace(/sen\(/g, 'sin(')
    .replace(/sen \(/g, 'sin(')
    .replace(/\^{([^}]*)}/g, '^($1)')
    .replace(/\\pi/g, 'pi')
    .replace(/\\cdot/g, '*')
    .replace(/\\div/g, '/')
    .replace(/e\^\{/g, 'exp(')         
    .replace(/}/g, ')');               
