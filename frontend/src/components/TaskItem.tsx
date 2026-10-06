import type { Task, TaskPriority, TaskStatus } from "../types/Task";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => Promise<void>;
  onStatusChange: (
    taskId: number,
    status: TaskStatus
  ) => Promise<void>;
}

const priorityStyles: Record<TaskPriority, string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

const statusStyles: Record<TaskStatus, string> = {
  Pending: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

function TaskItem({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskItemProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    await onDelete(task.task_id);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-base font-semibold text-gray-900">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-2 break-words text-sm leading-6 text-gray-500">
              {task.description}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Status */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}
        >
          {task.status}
        </span>

        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(
              task.task_id,
              event.target.value as TaskStatus
            )
          }
          className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-xs text-gray-400">
          Updated{" "}
          {new Date(task.updated_date).toLocaleDateString()}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;