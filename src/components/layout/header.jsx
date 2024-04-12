import { authOptions } from "@/lib/authOptions";
import { cn, url } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle/themetoggle";
import { MobileSidebar } from "./mobilesidebar";
import { UserNav } from "./usernav";
async function getUserData(session) {
  const res = await fetch(`${url}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + session?.user?.token,
    },
  });
  const userData = await res.json();
  return userData["data"];
}
const Header = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userData = await getUserData(session);
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={"/dashboard"} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav userData={userData} />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export default Header;
