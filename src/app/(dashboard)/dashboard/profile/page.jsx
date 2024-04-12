import BreadCrumb from "@/components/BreadCrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UserProfile from "@/components/userProfie";
import { authOptions } from "@/lib/authOptions";
import { url } from "@/lib/utils";
import { getServerSession } from "next-auth";
const breadcrumbItems = [{ title: "Profile", link: "/dashboard" }];
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
const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const userData = await getUserData(session);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Separator />
        <UserProfile userData={userData} />
      </div>
    </ScrollArea>
  );
};

export default ProfilePage;
