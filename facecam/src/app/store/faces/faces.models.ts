export interface ExpressionMap { [k: string]: number; }

export interface BoxAndInfo {
  id: string;
  box: { x: number; y: number; width: number; height: number; };
  age?: number;
  gender?: string;
  expressions?: ExpressionMap;
  name?: string;
}
