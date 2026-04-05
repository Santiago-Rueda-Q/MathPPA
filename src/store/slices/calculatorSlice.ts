import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalculatorState, Method, CalculationResult } from '../../types';

const initialState: CalculatorState = {
  expression: 'x^2',
  a: '0',
  b: '1',
  n: '10',
  method: 'trapecio',
  result: null,
  loading: false,
  error: null,
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<Partial<CalculatorState>>) => {
      return { ...state, ...action.payload };
    },
    setResult: (state, action: PayloadAction<CalculationResult | null>) => {
      state.result = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetCalculator: () => initialState,
  },
});

export const { setParams, setResult, setLoading, setError, resetCalculator } = calculatorSlice.actions;
export default calculatorSlice.reducer;
