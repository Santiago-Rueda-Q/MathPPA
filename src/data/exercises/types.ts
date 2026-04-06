export interface Exercise {
  id: string;
  level: number;
  title: string;
  expression: string;
  a: number;
  b: number;
  n: number;
  description: string;
  solution: number;
  difficulty: 'fácil' | 'medio' | 'difícil';
}

export interface LearningPath {
  methodId: string;
  methodName: string;
  exercises: Exercise[];
}
