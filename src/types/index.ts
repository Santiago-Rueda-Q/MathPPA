export type Method = 'trapecio' | 'simpson' | 'romberg';

export interface CalculationResult {
  value: number;
  steps: CalculationStep[];
  method: Method;
  expression: string;
  bounds: {
    a: number;
    b: number;
  };
  iterations?: number;
}

export interface CalculationStep {
  title: string;
  content: string;
  latex?: string;
}

export interface CalculatorState {
  expression: string;
  a: string;
  b: string;
  n: string;
  method: Method;
  result: CalculationResult | null;
  loading: boolean;
  error: string | null;
}
