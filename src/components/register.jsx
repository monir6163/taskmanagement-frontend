/* eslint-disable @next/next/no-img-element */
"use client";
import LoadingButton from "@/components/loadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registrationSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "./ui/button";
const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobile: "",
      photo: "",
    },
  });

  async function onSubmit(values) {
    values.photo = imageUrl;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://taskmanament-backend.vercel.app/api/v1/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIsSubmitting(false);
        toast.success("Account created successfully");
        router.push("/");
      } else {
        setIsSubmitting(false);
        toast.error(data.message);
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="border rounded-lg p-4">
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
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
      <div>
        {imageUrl && (
          <img src={imageUrl} alt="profile" className="w-full h-20 mx-auto" />
        )}
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="************"
                    {...field}
                  />
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
            Register
          </LoadingButton>
        </form>
      </Form>
      <div>
        <p>
          you have an account?{" "}
          <Link
            href="/"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
