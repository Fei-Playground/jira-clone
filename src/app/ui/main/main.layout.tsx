import { Outlet } from "react-router";
import { User } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { SidebarProvider } from "./sidebar.context";
import { Header } from "./header";

export const MainLayout = ({ user }: Props) => {
  return (
    <UserContextProvider user={user}>
      <SidebarProvider>
        <div className="flex h-full flex-col">
          <Header />
          <Outlet />
        </div>
      </SidebarProvider>
    </UserContextProvider>
  );
};

interface Props {
  user: User;
}
