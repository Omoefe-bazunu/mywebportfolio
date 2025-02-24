import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="flex justify-between flex-col bg-primary">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};
