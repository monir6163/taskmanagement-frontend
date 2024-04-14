import BreadCrumb from "@/components/BreadCrumb";
import ChangePassword from "@/components/changePassword";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
const breadcrumbItems = [
  { title: "Change Password", link: "/dashboard/profile" },
];

const page = () => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title="Change Password"
            description="Add a new task to your list."
          />
        </div>
        <Separator />
        <ChangePassword />
      </div>
    </ScrollArea>
  );
};

export default page;
