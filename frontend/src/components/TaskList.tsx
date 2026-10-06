import type { Task, TaskStatus } from "../types/Task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => Promise<void>;
  onStatusChange: (
    taskId: number,
    status: TaskStatus
  ) => Promise<void>;
}

function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <h3 className="text-base font-medium text-gray-900">
          No tasks found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Create a task or change your search/filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.task_id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

export default TaskList;