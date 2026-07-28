import { HiOutlineUser } from "react-icons/hi";
import { User } from "@domain/user";
import { UserEventDetail } from "@domain/activity";

export const UserActivity = ({
  userEvent,
  user,
}: UserActivityProps): JSX.Element => (
  <div className="flex items-center gap-2">
    <span className="flex items-center text-icon-subtle">
      <HiOutlineUser size={16} />
    </span>
    <p className="text-sm text-font">
      <span className="font-primary-bold">
        {userEvent.targetUser ? userEvent.targetUser.name : user.name}
      </span>{" "}
      <span className="text-font-subtle">{userEvent.action}</span>
    </p>
  </div>
);

interface UserActivityProps {
  userEvent: UserEventDetail;
  user: User;
}
