import Login from "@/components/login";
import PageTitle from "@/components/pageTitle";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  PageTitle("Sign In");
  return (
    <main className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full m-auto my-10 space-y-10">
        <div>
          <Login />
        </div>
      </div>
    </main>
  );
}
