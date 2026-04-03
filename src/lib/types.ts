export interface Profile {
  id: string;
  full_name: string;
  company: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  client_name: string;
  budget: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  created_at: string;
}
