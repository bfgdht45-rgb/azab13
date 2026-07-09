// Types for the Math Solver Application

export interface MathProblem {
  id: string;
  input: string;
  inputType: 'text' | 'image' | 'handwriting';
  latex: string;
  subject: MathSubject;
  language: 'ar' | 'en';
  createdAt: Date;
}

export type MathSubject = 
  | 'algebra' 
  | 'calculus' 
  | 'geometry' 
  | 'linear-algebra'
  | 'differential-equations'
  | 'statistics'
  | 'statics'
  | 'dynamics'
  | 'trigonometry'
  | 'complex-analysis'
  | 'discrete-math'
  | 'number-theory'
  | 'general';

export interface SolutionStep {
  stepNumber: number;
  explanation: string;
  equation: string;
  rule?: string;
  isImportant?: boolean;
}

export interface MathSolution {
  id: string;
  problemId: string;
  steps: SolutionStep[];
  finalAnswer: string;
  verification?: string;
  graphData?: GraphData;
  language: 'ar' | 'en';
  solvedAt: Date;
}

export interface GraphData {
  type: '2d' | '3d' | 'vector' | 'none';
  equations: string[];
  bounds?: { xMin: number; xMax: number; yMin: number; yMax: number };
}

export interface OCRResult {
  success: boolean;
  latex: string;
  confidence: number;
  rawText?: string;
  error?: string;
}

export interface SolverRequest {
  problem: string;
  subject: MathSubject;
  language: 'ar' | 'en';
  includeGraph: boolean;
  detailLevel: 'brief' | 'detailed' | 'step-by-step';
}

export interface SolverResponse {
  success: boolean;
  solution?: MathSolution;
  error?: string;
  processingTime: number;
}

export interface SymbolCategory {
  id: string;
  name: string;
  nameAr: string;
  symbols: MathSymbol[];
}

export interface MathSymbol {
  latex: string;
  display: string;
  description: string;
  descriptionAr: string;
}

export type InputMode = 'editor' | 'text' | 'image' | 'camera';

export interface AppState {
  currentProblem: MathProblem | null;
  currentSolution: MathSolution | null;
  isLoading: boolean;
  error: string | null;
  history: MathProblem[];
}
