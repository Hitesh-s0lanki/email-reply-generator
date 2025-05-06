import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Copy } from "lucide-react";

import { PropagateLoader } from "react-spinners";

const FormSchema = z.object({
  emailContent: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
  tone: z.string(),
});

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emailContent: "",
      tone: "professional",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        data
      );
      setOutput(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong try after sometime.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col justify-center items-center gap-6 py-10 px-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full  md:w-2/3 lg:w-2/3 space-y-6">
          <h1 className=" text-center md:text-start lg:text-start text-2xl md:text-3xl lg:text-3xl font-semibold">
            Email Reply Generator
          </h1>

          <FormField
            control={form.control}
            name="emailContent"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Original Email Content"
                    className="h-64"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select tone of reply" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-10" disabled={loading}>
            Submit
          </Button>

          {loading && (
            <div className="w-full flex justify-center items-center">
              <PropagateLoader />
            </div>
          )}
        </form>
      </Form>
      {output !== "" && (
        <div className="w-full  md:w-2/3 lg:w-2/3 space-y-4 pt-5">
          <div className="text-center gap-2 flex items-center justify-center">
            <h1 className=" text-xl font-semibold ">Generated Reply</h1>
            <Button
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Text copied");
              }}>
              <Copy className="size-4" />
            </Button>
          </div>
          <Textarea value={output} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
