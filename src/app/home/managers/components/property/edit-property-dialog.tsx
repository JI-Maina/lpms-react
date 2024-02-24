"use client";

import { z } from "zod";
import { useState } from "react";
import { FileEdit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Property } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const EditSchema = z.object({
  property_name: z.string().min(3).max(20),
  property_lrl: z.string().min(3).max(10),
  number_of_units: z.number(),
  number_of_floors: z.number(),
  water_rate_per_unit: z
    .string()
    .refine((value) => /^\d+(\.\d+)?$/.test(value), {
      message: "Invalid decimal format for water_rate_per_unit",
    }),
});

type EditInput = z.infer<typeof EditSchema>;

const EditPropertyDialog = ({ property }: { property: Property }) => {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<EditInput>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      property_name: property.property_name,
      property_lrl: property.property_lrl,
      number_of_units: property.number_of_units,
      water_rate_per_unit: property.water_rate_per_unit,
      number_of_floors:
        property.number_of_floors === null ? 0 : property.number_of_floors,
    },
  });

  const onSubmit = async (data: EditInput) => {
    try {
      const res = await axiosAuth.patch(
        `/property/properties/${property.id}/`,
        { ...property, ...data }
      );

      if (res.status === 200) {
        toast({ description: `${property.property_name} details updated` });
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onOpenChange = (value: boolean) => {
    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <FileEdit color="#25f609" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Make changes to your property here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="property_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABC apartments"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_lrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LRL</FormLabel>
                  <FormControl>
                    <Input placeholder="D0064" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="water_rate_per_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Rate per Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="27.00" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number_of_floors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floors</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number_of_units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyDialog;
