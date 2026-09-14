import * as React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@app/components/button";

export type Teammate = {
  id: number;
  name: string;
  onCall: boolean;
};

const initialTeammates: Teammate[] = [
  { id: 1, name: "Alice Chen", onCall: true },
  { id: 2, name: "Bruno Costa", onCall: false },
  { id: 3, name: "Chloe Nguyen", onCall: false },
  { id: 4, name: "Dima Petrov", onCall: true },
];

export const TeamView = (): JSX.Element => {
  const [teammates, setTeammates] = React.useState<Teammate[]>(initialTeammates);
  const [newName, setNewName] = React.useState("");

  const toggleOnCall = (id: number) => {
    setTeammates((prev) =>
      prev.map((tm) => (tm.id === id ? { ...tm, onCall: !tm.onCall } : tm)),
    );
  };

  const addRow = () => {
    const name = newName.trim();
    if (!name) return;
    setTeammates((prev) => {
      const nextId = prev.reduce((max, tm) => Math.max(max, tm.id), 0) + 1;
      return [...prev, { id: nextId, name, onCall: false }];
    });
    setNewName("");
  };

  return (
    <div className="p-6">
      <h1 className="font-primary-black text-2xl">TEAM</h1>
      <p className="mt-2 text-font-subtle">
        Keep track of who is on call. Tick the checkbox to mark them.
      </p>

      <div className="mt-6 w-full max-w-xl">
        <div className="overflow-hidden rounded-md border border-border bg-elevation-surface-raised shadow-sm">
          <div className="flex items-center border-b border-border bg-background-subtle px-4 py-2 text-sm font-bold text-font-subtle">
            <span className="w-16">On call</span>
            <span>Name</span>
          </div>
          {teammates.map((tm) => (
            <div
              key={tm.id}
              className={`flex items-center px-4 py-3 ${
                tm.onCall ? "bg-background-brand-subtlest" : ""
              }`}
            >
              <span className="w-16">
                <input
                  type="checkbox"
                  checked={tm.onCall}
                  onChange={() => toggleOnCall(tm.id)}
                  aria-label={`Mark ${tm.name} as on call`}
                  className="h-4 w-4 accent-[var(--color-background-brand-bold)]"
                />
              </span>
              <span className="text-font">{tm.name}</span>
              {tm.onCall && (
                <span className="ml-3 rounded bg-background-brand-bold px-2 py-0.5 text-xs font-bold text-font-inverse">
                  ON CALL
                </span>
              )}
            </div>
          ))}
          {teammates.length === 0 && (
            <div className="px-4 py-6 text-center text-font-subtle">
              No one on the team yet — add a row below.
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRow()}
            placeholder="Add a teammate…"
            aria-label="New teammate name"
            className="flex-1 rounded-md border border-border bg-elevation-surface-raised px-3 py-2 text-font focus:outline-background-brand-bold"
          />
          <Button
            color="neutral"
            variant="subtlest"
            onClick={addRow}
            className="py-3 pl-3 pr-4"
          >
            <span>
              <AiOutlinePlus size={18} />
            </span>
            <span className="leading-4">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
