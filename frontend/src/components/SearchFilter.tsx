import type { TaskPriority, TaskStatus } from "../types/Task";

interface SearchFilterProps {
  search: string;
  status: TaskStatus | "All";
  priority: TaskPriority | "All";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "All") => void;
  onPriorityChange: (value: TaskPriority | "All") => void;
}

function SearchFilter({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: SearchFilterProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {/* Search */}
      <div className="md:col-span-1">
        <label
          htmlFor="search"
          className="sr-only"
        >
          Search tasks
        </label>

        <input
          id="search"
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status-filter"
          className="sr-only"
        >
          Filter by status
        </label>

        <select
          id="status-filter"
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as TaskStatus | "All"
            )
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        >
          <option value="All">Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label
          htmlFor="priority-filter"
          className="sr-only"
        >
          Filter by priority
        </label>

        <select
          id="priority-filter"
          value={priority}
          onChange={(event) =>
            onPriorityChange(
              event.target.value as TaskPriority | "All"
            )
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        >
          <option value="All">Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;