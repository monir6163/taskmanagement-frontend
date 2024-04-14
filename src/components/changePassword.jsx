"use client";
import { updatePasswordSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import LoadingButton from "./loadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const ChangePassword = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      id: session?.user?.id,
      oldPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit(values) {
    values.id = session?.user?.id;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://taskmanament-backend.vercel.app/api/v1/user/update/pass`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session?.user?.token,
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIsSubmitting(false);
        form.reset();
        toast.success(data.message);
        router.refresh();
      } else {
        setIsSubmitting(false);
        toast.error("Invalid Password");
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.message);
    }
  }
  return (
    <div className="flex-1 space-y-4 border rounded-lg p-4 md:p-8 pt-6">
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Old Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            loading={isSubmitting}
            type="submit"
            className="w-full mt-5"
          >
            Change Password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default ChangePassword;
