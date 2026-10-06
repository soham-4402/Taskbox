import { useEffect, useMemo, useState } from "react";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import SearchFilter from "./components/SearchFilter";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/TaskService";

import type {
  CreateTaskData,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskData,
} from "./types/Task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TaskStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriority | "All">("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------------------------------
  // Load tasks
  // -------------------------------------------------------

  const loadTasks = async () => {
    try {
      setError("");

      const status =
        statusFilter === "All" ? undefined : statusFilter;

      const data = await getTasks(status);

      setTasks(data);
    } catch {
      setError(
        "Unable to load tasks. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  // -------------------------------------------------------
  // Search + Priority filtering
  // -------------------------------------------------------

  const filteredTasks = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchValue ||
        task.title.toLowerCase().includes(searchValue) ||
        (task.description ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priorityFilter]);

  // -------------------------------------------------------
  // Create / Update
  // -------------------------------------------------------

  const handleSubmit = async (
    taskData: CreateTaskData | UpdateTaskData
  ) => {
    try {
      setError("");

      if (editingTask) {
        await updateTask(editingTask.task_id, taskData);
      } else {
        await createTask(taskData as CreateTaskData);
      }

      setEditingTask(null);
      setShowForm(false);

      await loadTasks();
    } catch {
      throw new Error("Unable to save task.");
    }
  };

  // -------------------------------------------------------
  // Edit
  // -------------------------------------------------------

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // -------------------------------------------------------
  // Delete
  // -------------------------------------------------------

  const handleDelete = async (taskId: number) => {
    try {
      setError("");

      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.task_id !== taskId
        )
      );
    } catch {
      setError("Unable to delete the task. Please try again.");
    }
  };

  // -------------------------------------------------------
  // Status Change
  // -------------------------------------------------------

  const handleStatusChange = async (
    taskId: number,
    status: TaskStatus
  ) => {
    try {
      setError("");

      const updatedTask = await updateTask(taskId, {
        status,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.task_id === taskId ? updatedTask : task
        )
      );
    } catch {
      setError("Unable to update the task status.");
    }
  };

  // -------------------------------------------------------
  // Form close
  // -------------------------------------------------------

  const handleCancelForm = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Taskbox
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your tasks simply.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add Task
            </button>
          )}
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {/* Filters */}
        {!showForm && (
          <div className="mb-6">
            <SearchFilter
              search={search}
              status={statusFilter}
              priority={priorityFilter}
              onSearchChange={setSearch}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
            />
          </div>
        )}

        {/* Task count */}
        {!showForm && !loading && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              Loading tasks...
            </p>
          </div>
        )}

        {/* Tasks */}
        {!loading && !showForm && (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;