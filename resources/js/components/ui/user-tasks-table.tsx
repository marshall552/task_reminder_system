import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '@/types';

// Enable timezone support in dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

// Extend Task interface for display purposes
interface TaskWithAssignee extends Task {
  assignee: string | null; // Added for display
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface UserTasksTableProps {
  tasks: TaskWithAssignee[];
  onPageChange?: (page: number) => void;
  pagination?: Pagination;
}

export default function UserTasksTable({ tasks, onPageChange, pagination }: UserTasksTableProps) {
  const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).tz(dayjs.tz.guess()).format('MMM D, YYYY, h:mm A');
  };

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= (pagination?.last_page || 1)) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="divide-y divide-border rounded-lg overflow-hidden shadow-sm mb-3">
        {/* Header Row */}
        <div className="flex px-4 py-3 font-medium text-sm uppercase text-foreground bg-chart-2/20 min-h-[48px] w-full">
          <div className="flex-1 pl-4 min-w-[200px] flex items-center">Task</div>
          <div className="flex-1 pl-4 min-w-[250px] flex items-center">Description</div>
          <div className="flex-1 pl-4 min-w-[120px] flex items-center">Status</div>
          <div className="flex-1 pl-4 min-w-[180px] flex items-center">Due Date</div>
        </div>
        {/* Task Rows */}
        {tasks.length === 0 ? (
          <div className="px-4 py-4 text-center text-md text-muted-foreground bg-white">
            No tasks available.
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className={`flex px-4 py-3 min-h-[48px] w-full ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <div className="flex-1 pl-4 pr-6 text-sm text-foreground font-medium min-w-[200px] flex items-center shrink-0">
                <div
                  className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={task.title}
                >
                  {task.title.trim().replace(/\u00A0/g, ' ')}
                </div>
              </div>
              <div className="flex-1 pl-4 pr-4 text-sm text-foreground min-w-[250px] flex items-center">
                <div
                  className="truncate max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    maxWidth: '250px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={task.description}
                >
                  {task.description}
                </div>
              </div>
              <div className="flex-1 pl-4 pr-4 text-sm text-foreground min-w-[120px] flex items-center">
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium min-h-[24px] ${
                    task.status === 'done'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : task.status === 'on progress'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      : task.status === 'overdue'
                      ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex-1 pl-4 pr-4 text-sm text-foreground min-w-[180px] flex items-center">
                {formatDateTime(task.due_date_time)}
              </div>
            </div>
          ))
        )}
      </div>
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between px-4 py-2">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.per_page} of {pagination.total} tasks
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-primary">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}