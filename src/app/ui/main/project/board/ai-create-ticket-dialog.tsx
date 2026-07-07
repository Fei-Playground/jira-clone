import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import cx from "classix";
import { LuSparkles } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import { CategoryType } from "@domain/category";
import { PriorityId } from "@domain/priority";
import { Button } from "@app/components/button";
import { Spinner } from "./issue-panel/spinner";
import { useSortBy } from "@app/hooks/useSortBy";

interface ParsedTicket {
  title: string;
  description: string;
  priority: PriorityId;
  status: CategoryType;
}

/** Simple client-side mock AI parser — no backend needed */
function parseTicketFromText(text: string): ParsedTicket {
  const lower = text.toLowerCase();

  // Priority detection
  let priority: PriorityId = "medium";
  if (lower.includes("critical") || lower.includes("urgent") || lower.includes("asap") || lower.includes("blocker") || lower.includes("high priority")) {
    priority = "high";
  } else if (lower.includes("low priority") || lower.includes("minor") || lower.includes("nice to have") || lower.includes("whenever")) {
    priority = "low";
  }

  // Status detection
  let status: CategoryType = "TODO";
  if (lower.includes("in progress") || lower.includes("working on") || lower.includes("started") || lower.includes("wip")) {
    status = "IN_PROGRESS";
  } else if (lower.includes("done") || lower.includes("completed") || lower.includes("finished") || lower.includes("resolved")) {
    status = "DONE";
  }

  // Title: use first sentence or first 80 chars, strip trailing punctuation
  const firstSentence = text.split(/[.!?\n]/)[0].trim();
  const title = firstSentence.length > 80
    ? firstSentence.slice(0, 77) + "..."
    : firstSentence;

  // Description: rest of the text (after the first sentence)
  const rest = text.slice(firstSentence.length).replace(/^[.!?\n\s]+/, "").trim();
  const description = rest || text;

  return { title, description, priority, status };
}

interface AiCreateTicketDialogProps {
  onClose: () => void;
}

export const AiCreateTicketDialog = ({ onClose }: AiCreateTicketDialogProps): JSX.Element => {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const sortBy = useSortBy();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleGenerate = useCallback(() => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Please describe the ticket first.");
      return;
    }
    if (trimmed.length < 5) {
      setError("Please give a bit more detail.");
      return;
    }
    setError("");
    setIsProcessing(true);

    // Simulate a brief "AI thinking" delay for UX
    setTimeout(() => {
      const parsed = parseTicketFromText(trimmed);
      const params = new URLSearchParams();
      params.set("ai_title", parsed.title);
      params.set("ai_description", parsed.description);
      params.set("ai_priority", parsed.priority);
      params.set("category", parsed.status);
      if (sortBy) params.set("sortBy", sortBy);

      setIsProcessing(false);
      navigate(`issue/new?${params.toString()}`);
      onClose();
    }, 700);
  }, [prompt, navigate, onClose, sortBy]);

  const handleSubmitOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-elevation-surface p-6 shadow-lg"
        role="dialog"
        aria-label="Create ticket with AI"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-brand-subtlest text-font-brand">
              <LuSparkles size={18} />
            </span>
            <h2 className="font-primary-black text-xl text-font">Create ticket with AI</h2>
          </div>
          <button
            onClick={handleClose}
            className="flex cursor-pointer items-center justify-center rounded border-none p-0.5 text-icon hover:bg-background-neutral"
            aria-label="Close AI dialog"
          >
            <IoCloseOutline size={28} />
          </button>
        </div>

        {/* Instruction */}
        <p className="mb-3 font-primary-light text-sm text-font-subtle">
          Describe the ticket in plain language — the title, what needs to be done, priority, and any other details. AI will fill in the form for you.
        </p>

        {/* Prompt textarea */}
        <div className="relative">
          <textarea
            className={cx(
              "box-border w-full resize-none rounded-lg border-none bg-background-input p-3 font-primary-light text-sm text-font",
              "min-h-[130px] outline outline-2 hover:bg-background-input-hovered",
              "focus-visible:bg-background-input-pressed focus-visible:shadow-blue focus-visible:outline-border-brand",
              error ? "outline-border-danger" : "outline-border-input",
            )}
            placeholder={`e.g. "Add a dark mode toggle to the settings page — high priority, it's blocking several users from using the app at night"`}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleSubmitOnEnter}
            autoFocus
          />
          {error && (
            <p className="mt-1 font-primary-light text-xs text-font-danger">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-primary-light text-2xs text-font-subtlest">
            Press{" "}
            <kbd className="rounded bg-background-neutral px-1 py-0.5 font-primary-light text-icon">
              ⌘
            </kbd>{" "}
            +{" "}
            <kbd className="rounded bg-background-neutral px-1 py-0.5 font-primary-light text-icon">
              Enter
            </kbd>{" "}
            to generate
          </span>
          <div className="flex gap-2">
            <Button
              color="neutral"
              variant="subtlest"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleGenerate}
              disabled={isProcessing}
              type="button"
            >
              {isProcessing ? (
                <>
                  Generating…
                  <Spinner />
                </>
              ) : (
                <>
                  <LuSparkles size={15} />
                  Generate ticket
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
