export interface UserAction {
  id: string;
  user_id: string;
  match_id: string;
  action_type: 'like' | 'pass' | 'super_like' | 'maybe';
  created_at: string;
}

export interface PendingAction {
  user_id: string;
  match_id: string;
  action_type: 'like' | 'pass' | 'super_like' | 'maybe';
  created_at: string;
}
