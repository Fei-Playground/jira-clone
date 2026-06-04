import { useState } from "react";
import { Link } from "react-router";
import { TopHeader } from "../layout/top-header";
import { BottomNav } from "../layout/bottom-nav";
import type { Client } from "@domain/invopk";

interface ClientsListViewProps {
  clients: Client[];
  onDelete: (clientId: string) => void;
}

export const ClientsListView = ({
  clients,
  onDelete,
}: ClientsListViewProps): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClientInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-['Plus_Jakarta_Sans']">
      <TopHeader />

      <main className="mx-auto max-w-screen-xl px-5 pb-32 pt-6">
        {/* Header */}
        <section className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-[#00236f]">Clients</h2>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-lg border border-[#c5c5d3] px-4 pr-10 text-[#151c27] transition-colors focus:border-[#00236f] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
              placeholder="Search clients..."
            />
            <span className="pointer-events-none absolute right-3 top-3 text-xl text-[#606365]">
              🔍
            </span>
          </div>

          {/* Add Client Button */}
          <Link
            to="/invopk/clients/new"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00236f] text-xl font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <span>➕</span>
            Add New Client
          </Link>
        </section>

        {/* Clients List */}
        <section>
          {filteredClients.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
              <p className="text-sm text-[#606365]">
                {searchQuery
                  ? "No clients found matching your search."
                  : "No clients yet. Add your first client to get started!"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredClients.map((client) => (
                <div
                  key={client.clientId}
                  className="rounded-xl bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f8] font-bold text-[#00236f]">
                        {getClientInitials(client.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#151c27]">
                          {client.name}
                        </p>
                        <p className="text-sm text-[#606365]">{client.email}</p>
                        {client.country && (
                          <p className="text-xs text-[#757682]">
                            {client.country}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/invopk/clients/${client.clientId}/edit`}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[#00236f] transition-colors hover:bg-[#e2e8f8]"
                      >
                        <span className="text-xl">✏️</span>
                      </Link>
                      <button
                        onClick={() => onDelete(client.clientId)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]"
                      >
                        <span className="text-xl">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
