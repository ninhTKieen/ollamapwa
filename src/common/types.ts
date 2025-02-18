export type TChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[] | readonly string[];
  timestamp: Date;
  model?: string | null;
  aborted?: boolean;
  metadata?: any;
};
