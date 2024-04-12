"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Icons } from "./icon";
import LoadingButton from "./loadingButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const NewTaskCard = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [newTaskData, setNewTaskData] = useState({}); // [1]
  const data = props?.newTaskData?.result;
  const handleopen = (i) => {
    const newData = data.find((task) => task.id === i);
    setNewTaskData(newData);
  };
  const [deleteIndex, setDeleteIndex] = useState(null); // [2]
  const handleDelete = async (id, i) => {
    setDeleteIndex(i);
    try {
      const response = await fetch(
        `https://taskmanament-backend.vercel.app/api/v1/task/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session?.user?.token,
          },
        }
      );

      if (response.ok) {
        toast.success("Task deleted successfully.");

        router.refresh();
      } else {
        toast.error("An error occurred, please try again.");
      }
    } catch (error) {
      toast.error("An error occurred, please try again.");
    } finally {
      setDeleteIndex(null);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      userId: session?.user?.id,
      status: newTaskData?.status,
    },
  });

  async function onSubmit(values) {
    values.userId = session?.user?.id;
    values.status === undefined
      ? (values.status = newTaskData?.status)
      : (values.status = values.status);

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://taskmanament-backend.vercel.app/api/v1/task/${newTaskData?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session?.user?.token,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        toast.success("Task updated successfully.");
        setIsSubmitting(false);
        router.refresh();
        values.status = newTaskData?.status;
        form.reset();
      } else {
        toast.error("An error occurred, please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An error occurred, please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Toaster />
      {data?.length === 0 && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <h6 className="tracking-tight text-sx font-light text-center">
            No task available
          </h6>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data?.map((task, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card text-card-foreground shadow-sm hover:border-red-100"
          >
            <div className="p-2 flex flex-row items-center justify-between space-y-0 pb-2">
              <h6 className="tracking-tight text-sx font-light">
                {task.title}
              </h6>
              <div className="flex flex-row items-center space-x-4">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <span className="text-xs text-muted-foreground cursor-pointer hover:text-red-500">
                      {deleteIndex === i ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Icons.trash className="h-4 w-4" />
                      )}
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(task.id, i)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Dialog>
                  <DialogTrigger>
                    <span
                      className="text-xs text-muted-foreground"
                      onClick={() => handleopen(task.id)}
                    >
                      {
                        <Icons.edit className="h-4 w-4 cursor-pointer hover:text-yellow-500" />
                      }
                    </span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Task Status Changes</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Task Status</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={
                                          newTaskData?.status || "Select Status"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="progress">
                                      Progress
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      Completed
                                    </SelectItem>
                                    <SelectItem value="canceled">
                                      Canceled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <LoadingButton
                            loading={isSubmitting}
                            type="submit"
                            className="w-full mt-5"
                          >
                            Save Task
                          </LoadingButton>
                        </form>
                      </Form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="p-2 pt-0">
              <p className="text-xs text-muted-foreground">
                {task.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewTaskCard;
