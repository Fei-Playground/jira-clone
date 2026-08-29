import { NavLink } from "react-router";

export const BottomNav = (): JSX.Element => {
  const navItems = [
    {
      to: "/invopk/dashboard",
      icon: "📊",
      label: "Dashboard",
    },
    {
      to: "/invopk/invoices",
      icon: "📄",
      label: "Invoices",
    },
    {
      to: "/invopk/clients",
      icon: "👤",
      label: "Clients",
    },
    {
      to: "/invopk/settings",
      icon: "⚙️",
      label: "Settings",
    },
  ];

  return (
    <nav className="fixed bottom-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-[#c5c5d3] bg-white px-4 py-3 shadow-[0px_-4px_16px_rgba(0,0,0,0.04)] md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-full px-4 py-1 transition-all active:scale-90 ${
              isActive
                ? "bg-[#1e3a8a] text-white"
                : "text-[#606365] hover:opacity-80"
            }`
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-wider">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};
