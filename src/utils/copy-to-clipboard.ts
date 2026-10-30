import { toast } from "react-toastify";

export const copyToClipboard = (text: string, label: string): void => {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`${label} copied`))
    .catch(() => toast.error(`Could not copy the ${label.toLowerCase()}`));
};
