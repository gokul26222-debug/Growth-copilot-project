export interface MetricRow {
  date: string;
  users: number;
  signups: number;
  activated_users: number;
  paid_users: number;
  retained_users: number;
  cancelled_users: number;
}

export interface Metrics {
  activation_rate: number;
  conversion_rate: number;
  retention_rate: number;
  churn_rate: number;
  growth_rate: number;
}

export interface Problem {
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  metric: string;
}

export interface Experiment {
  title: string;
  problem: string;
  hypothesis: string;
  expected_impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'P0' | 'P1' | 'P2';
  metric_to_track: string;
  owner: 'PM' | 'Engineering' | 'Design' | 'Marketing';
  timeline: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  file_name: string;
  row_count: number;
  growth_score: number;
  metrics: Metrics;
  problems: Problem[];
  experiments: Experiment[];
  raw_data: MetricRow[];
  status: 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role?: 'product_manager' | 'growth_manager' | 'founder' | 'other';
  onboarded: boolean;
}

export type UploadStep =
  | 'idle'
  | 'uploading'
  | 'parsing'
  | 'calculating'
  | 'analyzing'
  | 'generating'
  | 'saving'
  | 'completed'
  | 'error';

export interface ErrorMessage {
  key: string;
  message: string;
}
