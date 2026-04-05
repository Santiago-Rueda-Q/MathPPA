export interface TheoryItem {
  type: 'text' | 'latex' | 'point' | 'tip' | 'warning';
  content: string;
  icon?: string;
}

export interface TheoryLevel {
  title: string;
  subTitle?: string;
  items: TheoryItem[];
}

export interface MethodTheory {
  id: string;
  name: string;
  levels: TheoryLevel[];
}
