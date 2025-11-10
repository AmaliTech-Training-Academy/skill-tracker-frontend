import { McqQuestion } from '@app/core/models/mcq-model';

export interface McqGenerationState {
  questions: McqQuestion[] | null;
  loading: boolean;
  error: string | null;
}

export const initialMcqGenerationState: McqGenerationState = {
  questions: null,
  loading: false,
  error: null,
};
