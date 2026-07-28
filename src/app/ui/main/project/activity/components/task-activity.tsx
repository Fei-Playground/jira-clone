import { BsCalendar3 } from "react-icons/bs";
import { TaskDetail } from "@domain/activity";
import { UserAvatar } from "@app/components/user-avatar";
import { PriorityIcon } from "@app/components/priority-icon";
import { formatShortDate } from "@utils/formatRelativeTime";
import { PRIORITY_LABEL, TASK_STATUS_CONFIG } from "../activity-timeline.const";
import { Badge } from "./activity-type-badge";
import { MetaRow, ViewDetailButton } from "./activity-parts";

const TASK_ACTION_LABEL = {
  created: "Created",
  updated: "Updated",
  completed: "Completed",
} as const;

export const TaskActivity = ({
  task,
  onViewDetail,
}: TaskActivityProps): JSX.Element => {
  const status = TASK_STATUS_CONFIG[task.status];

  return (
    <div className="flex flex-col gap-2">
      <p className="font-primary-bold text-sm text-font">
        <span className="text-font-subtle">
          {TASK_ACTION_LABEL[task.action]}{" "}
        </span>
        {task.title}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-background-neutral text-font-subtle">
          {task.taskId}
        </Badge>
        <Badge className={status.className}>{status.label}</Badge>
        <Badge className="bg-background-neutral text-font-subtle">
          <PriorityIcon priority={task.priority} size={12} />
          {PRIORITY_LABEL[task.priority]}
        </Badge>
      </div>

      <MetaRow>
        {task.asignee && (
          <span className="flex items-center gap-1.5">
            <UserAvatar {...task.asignee} size={20} />
            {task.asignee.name}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <BsCalendar3 size={12} />
            Due {formatShortDate(task.dueDate)}
          </span>
        )}
      </MetaRow>

      <ViewDetailButton label="View Task" onClick={onViewDetail} />
    </div>
  );
};

interface TaskActivityProps {
  task: TaskDetail;
  onViewDetail: () => void;
}
