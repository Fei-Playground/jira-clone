import { VscNewFile, VscTrash, VscReplace } from "react-icons/vsc";
import { FileDetail } from "@domain/activity";
import { MetaRow, ViewDetailButton } from "./activity-parts";

const OPERATION_LABEL = {
  created: "Created",
  deleted: "Deleted",
  renamed: "Renamed",
} as const;

const OPERATION_ICON = {
  created: <VscNewFile size={14} />,
  deleted: <VscTrash size={14} />,
  renamed: <VscReplace size={14} />,
} as const;

export const FileActivity = ({
  file,
  onViewDetail,
}: FileActivityProps): JSX.Element => (
  <div className="flex flex-col gap-2">
    <p className="flex items-center gap-2 font-primary-bold text-sm text-font">
      <span className="flex items-center text-icon-subtle">
        {OPERATION_ICON[file.operation]}
      </span>
      {OPERATION_LABEL[file.operation]} {file.fileName}
    </p>

    <MetaRow>
      <span className="font-primary-light text-font-subtle">
        {file.path}
        {file.fileName}
      </span>
      {file.previousName && <span>was {file.previousName}</span>}
      {file.size && <span>{file.size}</span>}
    </MetaRow>

    <ViewDetailButton label="View File" onClick={onViewDetail} />
  </div>
);

interface FileActivityProps {
  file: FileDetail;
  onViewDetail: () => void;
}
