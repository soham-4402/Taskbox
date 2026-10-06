import { useEffect, useState } from "react";

import type {
  CreateTaskData,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskData,
} from "../types/Task";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (
    taskData: CreateTaskData | UpdateTaskData
  ) => Promise<void>;
  onCancel: () => void;
}

const statuses: TaskStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
];

const priorities: TaskPriority[] = [
  "Low",
  "Medium",
  "High",
];

function TaskForm({
  task,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const isEditing = Boolean(task);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [priority, setPriority] =
    useState<TaskPriority>("Medium");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
      setPriority(task.priority);
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriority("Medium");
    }

    setError("");
  }, [task]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Title must be 200 characters or less.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() || undefined,
        status,
        priority,
      });
    } catch {
      setError("Unable to save the task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit Task" : "Create Task"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEditing
            ? "Update the task details."
            : "Add a new task to your list."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter task title"
            maxLength={200}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter task description"
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TaskStatus)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as TaskPriority
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            >
              {priorities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Task"
                : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;