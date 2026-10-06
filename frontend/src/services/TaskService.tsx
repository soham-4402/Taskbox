import axios from "axios";

import type {
  CreateTaskData,
  Task,
  TaskStatus,
  UpdateTaskData,
} from "../types/Task";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Create Task
export const createTask = async (
  taskData: CreateTaskData
): Promise<Task> => {
  const response = await api.post<Task>("/tasks", taskData);

  return response.data;
};

// 2. Get All Tasks
export const getTasks = async (
  status?: TaskStatus
): Promise<Task[]> => {
  const response = await api.get<Task[]>("/tasks", {
    params: status ? { status } : undefined,
  });

  return response.data;
};

// 3. Get Single Task
export const getTask = async (
  taskId: number
): Promise<Task> => {
  const response = await api.get<Task>(`/tasks/${taskId}`);

  return response.data;
};

// 4. Update Task
export const updateTask = async (
  taskId: number,
  taskData: UpdateTaskData
): Promise<Task> => {
  const response = await api.put<Task>(
    `/tasks/${taskId}`,
    taskData
  );

  return response.data;
};

// 5. Delete Task
export const deleteTask = async (
  taskId: number
): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};