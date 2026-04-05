import { MethodTheory } from './types';
import { trapecioTheory } from './trapecio';
import { simpsonTheory } from './simpson';
import { rombergTheory } from './romberg';

export * from './types';

export const theoryData: MethodTheory[] = [
  trapecioTheory,
  simpsonTheory,
  rombergTheory
];
