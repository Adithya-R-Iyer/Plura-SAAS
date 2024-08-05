"use client";

import React from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { createMedia, saveActivityLogsNotification } from "@/lib/queries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";
import { useModal } from "@/providers/model-provider";

type Props = {
  subAccountId: string;
};

const formSchema = z.object({
  link: z.string().min(1, { message: "Media file is required!" }),
  name: z.string().min(1, { message: "Name is required!" }),
});

const UploadMediaForm = ({ subAccountId }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const { setClose } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await createMedia(subAccountId, values);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Uploaded a new media file | ${response.name}`,
        subAccountId: subAccountId,
      });
      toast({
        title: "Success",
        description: "Successfully uploaded your media file.",
      });
      setClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not upload your media file.",
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Media File</CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
        <CardContent className="pt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter file name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndPoint="subAccountLogo"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 w-[40%]"
              >
                Upload Media
              </Button>
            </form>
          </Form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default UploadMediaForm;
