import { evaluate } from 'mathjs';
import { Exercise } from '../../../data/exercises/types';

export interface Answers { h: number; fa: number; fb: number; sum: number; result: number; }

export const calculateAnswers = (exercise: Exercise, methodId: string): Answers => {
  try {
    const f = (x: number) => evaluate(exercise.expression, { x });
    const h = (exercise.b - exercise.a) / exercise.n;
    const fa = f(exercise.a);
    const fb = f(exercise.b);
    let sum = 0;

    if (methodId === 'simpson') {
      let sumOdd = 0, sumEven = 0;
      for (let i = 1; i < exercise.n; i++) {
        const val = f(exercise.a + i * h);
        i % 2 === 0 ? (sumEven += val) : (sumOdd += val);
      }
      return { h, fa, fb, sum: 4 * sumOdd + 2 * sumEven, result: (h / 3) * (fa + fb + 4 * sumOdd + 2 * sumEven) };
    }

    for (let i = 1; i < exercise.n; i++) sum += f(exercise.a + i * h);
    return { h, fa, fb, sum, result: (h / 2) * (fa + fb + 2 * sum) };
  } catch {
    return { h: 0, fa: 0, fb: 0, sum: 0, result: 0 };
  }
};
