
export interface ObfuscationResult {
  output: string;
  filename: string;
  counter: number;
}

export enum ProcessStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface LogEntry {
  message: string;
  timestamp: string;
}
