export interface McqGenerationRequest {
  userId: string;
  interest: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  no_of_questions: number;
}

export interface McqQuestion {
  question_number: string;
  question_duration: number;
  question_text: string;
  options: string[];
  hint: string;
  correct_answer: string;
  explanation: string;
}

export interface McqResponse {
  success: boolean;
  message: string;
  data: {
    mcqQuestion: McqQuestion[];
  };
  metadata: {
    timestamp: string;
    traceId: string;
  };
}
