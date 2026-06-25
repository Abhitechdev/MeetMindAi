export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
}

export interface ProcessingResponse {
  id: string;
  title: string;
  transcript: string;
  segments: TranscriptionSegment[];
  executiveSummary: string;
  decisions: string[];
  actionItems: string[];
  nextSteps: string[];
  tags: string[];
  language: string;
  sentiment?: string;
  priority?: string;
}

export type ProcessingStatus =
  | "idle"
  | "uploading"
  | "transcribing"
  | "summarizing"
  | "complete"
  | "error";
