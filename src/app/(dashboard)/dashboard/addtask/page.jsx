import BreadCrumb from "@/components/BreadCrumb";
import AddNewTask from "@/components/addNewTask";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
const breadcrumbItems = [{ title: "Add Task", link: "/dashboard/addtask" }];

const page = () => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title="Add Task"
            description="Add a new task to your list."
          />
          {/* <Button variant="outline" asChild>
            <Link href="/dashboard/new">View All Tasks</Link>
          </Button> */}
        </div>
        <Separator />
        <div className="">
          <AddNewTask />
        </div>
      </div>
    </ScrollArea>
  );
};

export default page;
