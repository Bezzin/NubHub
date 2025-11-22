export interface PredictionResult {
  gender: 'Boy' | 'Girl' | 'Unclear';
  confidence: number;
  reasoning: string;
  tips: string[];
}

export interface NubTheoryInfo {
  summary: string;
  accuracy: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
}

export enum AppState {
  LANDING = 'LANDING',
  UPLOADING = 'UPLOADING',
  PAYMENT = 'PAYMENT',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ERROR = 'ERROR',
}

// API Response Types
export interface UploadResponse {
  submissionId: string;
  checkoutUrl: string;
}

export interface SubmissionStatus {
  id: string;
  status: 'pending_payment' | 'processing' | 'completed' | 'pending_review' | 'reviewed' | 'refunded';
  final_result?: 'Boy' | 'Girl' | null;
  ai_confidence?: number;
  ai_reasoning?: string;
  ai_tips?: string[];
}

// Admin Dashboard Types
export interface PendingSubmission {
  id: string;
  email: string;
  imageUrl: string;
  aiResult: 'Boy' | 'Girl' | 'Unclear' | null;
  aiConfidence: number | null;
  aiReasoning: string | null;
  createdAt: Date;
}
