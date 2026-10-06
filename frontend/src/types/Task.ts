export type TaskStatus = "Pending" | "In Progress" | "Completed";

export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  task_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_date: string;
  updated_date: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}