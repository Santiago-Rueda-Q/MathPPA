import { evaluate } from 'mathjs';
import { Exercise } from '../../../data/exercises/types';

export interface Answers {
  h: number;
  fa: number;
  fb: number;
  sum: number;
  result: number;
  // Romberg-specific
  r00?: number;
  r10?: number;
  r11?: number;
}

export const calculateAnswers = (exercise: Exercise, methodId: string): Answers => {
  try {
    const f = (x: number) => evaluate(exercise.expression, { x });

    if (methodId === 'romberg') {
      const a = exercise.a;
      const b = exercise.b;
      const n = exercise.n;

      // Build the full Romberg table R[i][j]
      const R: number[][] = [];
      for (let i = 0; i < n; i++) {
        R.push(new Array(i + 1).fill(0));
      }

      // First column: trapezoidal approximations
      // R[0][0] = (h/2) * (f(a) + f(b))  with h = b - a
      const h0 = b - a;
      R[0][0] = (h0 / 2) * (f(a) + f(b));

      for (let i = 1; i < n; i++) {
        const hi = (b - a) / Math.pow(2, i);
        const numPoints = Math.pow(2, i - 1);
        let midSum = 0;
        for (let k = 1; k <= numPoints; k++) {
          midSum += f(a + (2 * k - 1) * hi);
        }
        R[i][0] = 0.5 * R[i - 1][0] + hi * midSum;
      }

      // Richardson extrapolation columns
      for (let j = 1; j < n; j++) {
        for (let i = j; i < n; i++) {
          const factor = Math.pow(4, j);
          R[i][j] = (factor * R[i][j - 1] - R[i - 1][j - 1]) / (factor - 1);
        }
      }

      // Expose the first three Romberg values for the quiz steps
      const r00 = R[0][0];
      const r10 = n > 1 ? R[1][0] : R[0][0];
      const r11 = n > 1 ? R[1][1] : R[0][0];

      // h used in step 1 (h = b - a for R[0,0])
      const h = b - a;
      const fa = f(a);
      const fb = f(b);

      return { h, fa, fb, sum: r11, result: R[n - 1][n - 1], r00, r10, r11 };
    }

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
