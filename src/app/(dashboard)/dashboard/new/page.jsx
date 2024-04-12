import BreadCrumb from "@/components/BreadCrumb";
import { Icons } from "@/components/icon";
import NewTaskCard from "@/components/newTaskCard";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/authOptions";
import { url } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
const breadcrumbItems = [{ title: "New Task", link: "/dashboard/new" }];
async function getNewTaskData(session) {
  const res = await fetch(`${url}/task/new`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + session?.user?.token,
    },
  });
  const newTaskData = await res.json();
  return newTaskData;
}
const NewTask = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const newTaskData = await getNewTaskData(session);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`New Task (${newTaskData?.result?.length || 0})`}
            description="See all your new tasks here."
          />
          <Button variant="outline" className="text-xs md:text-sm" asChild>
            <Link href="/dashboard/addtask">
              <Icons.add className="h-4 w-4" />
              Add New
            </Link>
          </Button>
        </div>
        <Separator />
        <NewTaskCard newTaskData={newTaskData} />
      </div>
    </ScrollArea>
  );
};

export default NewTask;
