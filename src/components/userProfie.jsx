/* eslint-disable @next/next/no-img-element */
"use client";
import { updateUserSchema, url } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import LoadingButton from "./loadingButton";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const UserProfile = ({ userData }) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: userData?.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobile: userData.mobile,
      photo: userData.photo,
    },
  });

  async function onSubmit(values) {
    values.photo = imageUrl || userData.photo;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${url}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session?.user?.token,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSubmitting(false);
        toast.success("Profile updated successfully");
        router.refresh();
      } else {
        setIsSubmitting(false);
        toast.error("An error occurred");
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <Toaster />
      <CldUploadWidget
        cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
        onSuccess={(response) => {
          const url = response.info.secure_url;
          setImageUrl(url);
        }}
        uploadPreset="nextjs_cloudinary"
      >
        {({ open }) => {
          return (
            <Button variant="outline" onClick={() => open()} className="w-full">
              Upload Profile Picture
            </Button>
          );
        }}
      </CldUploadWidget>
      <div>
        <img
          src={imageUrl || userData.photo}
          alt="profile"
          className="w-20 h-20 rounded-full mx-auto"
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel disabled className="opacity-50 cursor-not-allowed">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled
                    className="opacity-50 cursor-not-allowed"
                    readOnly
                    placeholder="Valid email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="08012345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            loading={isSubmitting}
            // disabled={imageUrl === null}
            type="submit"
            className="w-full mt-5"
          >
            Update Profile
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default UserProfile;
