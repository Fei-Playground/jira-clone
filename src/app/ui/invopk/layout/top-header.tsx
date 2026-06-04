import { useInvoPkAuth } from "@app/store/invopk-auth.store";
import { getInitials } from "../utils/format";

export const TopHeader = (): JSX.Element => {
  const { invoPkUser } = useInvoPkAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#1e3a8a]">
            {invoPkUser && (
              <span className="font-bold text-white">
                {getInitials(invoPkUser.name)}
              </span>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#00236f]">
          InvoPk
        </h1>
        <div className="flex items-center">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#00236f] transition-colors hover:bg-[#e2e8f8] active:scale-95">
            <span className="text-2xl">🔔</span>
          </button>
        </div>
      </div>
    </header>
  );
};
