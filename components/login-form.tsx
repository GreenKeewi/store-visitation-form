"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";
const tms = [
  {
    value: "Tom Scott",
    label: "Tom Scott",
  },
  {
    value: "John Smith",
    label: "John Smith",
  },
  {
    value: "Tim Horton",
    label: "Tim Horton",
  },
  {
    value: "Mason Anderson",
    label: "Mason Anderson",
  },
  {
    value: "Liam Miller",
    label: "Liam Miller",
  },
];

const stores = [
  {
    value: "Cambridge Heating and Cooling",
    label: "Cambridge Heating and Cooling",
  },
  {
    value: "Others",
    label: "Others",
  },
  {
    value: "Others 2",
    label: "Others 2",
  },
  {
    value: "Others 3",
    label: "Others 3",
  },
  {
    value: "Others 4",
    label: "Others 4",
  },
];

const sps = [
  {
    value: "Cambridge Heating and Cooling",
    label: "Cambridge Heating and Cooling",
  },
  {
    value: "Others",
    label: "Others",
  },
  {
    value: "Others 2",
    label: "Others 2",
  },
  {
    value: "Others 3",
    label: "Others 3",
  },
  {
    value: "Others 4",
    label: "Others 4",
  },
];

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Territory Manager state
  const [tmOpen, setTmOpen] = React.useState(false);
  const [tmValue, setTmValue] = React.useState("");

  // Store state
  const [storeOpen, setStoreOpen] = React.useState(false);
  const [storeValue, setStoreValue] = React.useState("");

  // Service Provider state
  const [spOpen, setSpOpen] = React.useState(false);
  const [spValue, setSpValue] = React.useState("");
  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Enter your Info</CardTitle>
          <CardDescription>Enter your Info</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="">Teritory Manager</Label>
                <Popover open={tmOpen} onOpenChange={setTmOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={tmOpen}
                      className="w-full justify-between"
                    >
                      {tmValue
                        ? tms.find((framework) => framework.value === tmValue)
                            ?.label
                        : "Select TM..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search TM..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No TM found.</CommandEmpty>
                        <CommandGroup>
                          {tms.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setTmValue(
                                  currentValue === tmValue ? "" : currentValue
                                );
                                setTmOpen(false);
                              }}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  tmValue === framework.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="">Store Name and Number</Label>
                </div>
                <Popover open={storeOpen} onOpenChange={setStoreOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={storeOpen}
                      className="w-full justify-between"
                    >
                      {storeValue
                        ? stores.find(
                            (framework) => framework.value === storeValue
                          )?.label
                        : "Select Store..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Store..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No Store found.</CommandEmpty>
                        <CommandGroup>
                          {stores.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setStoreValue(
                                  currentValue === storeValue
                                    ? ""
                                    : currentValue
                                );
                                setStoreOpen(false);
                              }}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  storeValue === framework.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="">Service Provider Assigned to Store</Label>
                <Popover open={spOpen} onOpenChange={setSpOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={spOpen}
                      className="w-full justify-between"
                    >
                      {spValue
                        ? sps.find((framework) => framework.value === spValue)
                            ?.label
                        : "Select Service Provider..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Service Provider..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No Service Provider found.</CommandEmpty>
                        <CommandGroup>
                          {sps.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setSpValue(
                                  currentValue === spValue ? "" : currentValue
                                );
                                setSpOpen(false);
                              }}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  spValue === framework.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
