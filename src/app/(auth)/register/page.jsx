import Register from "@/components/register";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <main className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full m-auto my-10 space-y-10">
        <div>
          <Register />
        </div>
      </div>
    </main>
  );
}
