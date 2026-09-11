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
        <div className="flex flex-grow flex-col overflow-hidden">
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
