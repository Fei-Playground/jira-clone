import { Outlet } from "react-router";
import { User } from "@domain/user";
import { UserContextProvider } from "@app/store/user.store";
import { Header } from "./header";
import { Footer } from "./footer";

export const MainLayout = ({ user }: Props) => {
  return (
    <UserContextProvider user={user}>
      <div className="flex h-full flex-col">
        <Header />
        <div className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </div>
        <Footer />
      </div>
    </UserContextProvider>
  );
};

interface Props {
  user: User;
}
