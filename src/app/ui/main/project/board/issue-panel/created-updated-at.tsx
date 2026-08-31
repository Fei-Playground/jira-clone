import { Issue } from "@domain/issue";
import { formatDateTime } from "@utils/formatDateTime";

export const CreatedUpdatedAt = ({ issue }: Props): JSX.Element => {
  const latestActivity = issue?.activities?.[0];
  const updatedLabel = latestActivity
    ? `Updated ${formatRelative(latestActivity.createdAt)} by ${latestActivity.user.name}`
    : issue?.updatedAt
      ? formatDateTime(issue.updatedAt)
      : "Just now";

  const updatedDetail = latestActivity ? latestActivity.message : undefined;

  const values = [
    {
      label: "Created at:",
      value: issue?.createdAt ? formatDateTime(issue.createdAt) : "Just now",
      detail: issue?.reporter ? `by ${issue.reporter.name}` : undefined,
    },
    {
      label: "Updated:",
      value: updatedLabel,
      detail: updatedDetail,
    },
  ];

  return (
    <table>
      <tbody className="text-xs text-font-subtlest">
        {values.map(({ label, value, detail }) => (
          <tr key={label}>
            <td className="pr-4 align-top">
              <p className="mb-2">{label}</p>
            </td>
            <td>
              <p className="mb-0">{value}</p>
              {detail && (
                <p className="mb-2 mt-0.5 text-2xs text-font-subtlest text-opacity-80">
                  {detail}
                </p>
              )}
              {!detail && <div className="mb-2" />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const formatRelative = (timestamp: number): string => {
  const deltaMs = Date.now() - timestamp;
  const minutes = Math.floor(deltaMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDateTime(timestamp);
};

interface Props {
  issue?: Issue;
}
