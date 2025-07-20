"use client";
import { Button } from "@/components/ui/button";
import { SuccessAlert } from "@/components/ui/success-alert";
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
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
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

  // Store Engagement state
  const [modName, setModName] = React.useState("");
  const [associateNames, setAssociateNames] = React.useState("");
  const [visitPurpose, setVisitPurpose] = React.useState("");
  const [timeSpent, setTimeSpent] = React.useState("");

  // Store Display state
  const [cleanliness, setCleanliness] = React.useState("");
  const [pamphlets, setPamphlets] = React.useState("");
  const [unitsCondition, setUnitsCondition] = React.useState("");
  const [unitsVisible, setUnitsVisible] = React.useState("");
  const [displayCondition, setDisplayCondition] = React.useState("");
  const [cleanedDisplay, setCleanedDisplay] = React.useState("");

  // Promo Execution state
  const [promoDisplayed, setPromoDisplayed] = React.useState("");
  const [promoSetup, setPromoSetup] = React.useState("");

  // Comments state
  const [comments, setComments] = React.useState("");

  // Success alert state
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Automatic date state - initialized with current date only
  const [visitDate, setVisitDate] = React.useState<Date>(() => {
    return new Date(); // Current date as Date object
  });

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug: Log all current form values
    console.log("Form submission started");
    console.log("Current form values:", {
      visitDate: visitDate.toISOString().slice(0, 10),
      tmValue,
      storeValue,
      spValue,
      modName,
      associateNames,
      visitPurpose,
      timeSpent,
      cleanliness,
      pamphlets,
      unitsCondition,
      unitsVisible,
      displayCondition,
      cleanedDisplay,
      promoDisplayed,
      promoSetup,
      comments,
    });

    // Validate all required fields (temporarily simplified for testing)
    const requiredFields = [];

    // Only check the most basic required fields for now
    if (!tmValue) requiredFields.push("Territory Manager");
    if (!storeValue) requiredFields.push("Store Name");
    if (!spValue) requiredFields.push("Service Provider");

    // Temporarily comment out other validations for testing
    /*
    // Store Engagement fields
    if (!modName.trim()) requiredFields.push("MOD/Store Manager Name");
    if (!associateNames.trim()) requiredFields.push("Store Associates Names");
    if (!visitPurpose.trim()) requiredFields.push("Purpose of Visit");
    if (!timeSpent.trim()) requiredFields.push("Time Spent in Store");

    // Store Display fields
    if (!cleanliness) requiredFields.push("Cleanliness");
    if (!pamphlets) requiredFields.push("Pamphlets and Business Cards");
    if (!unitsCondition) requiredFields.push("Units Condition");
    if (!unitsVisible) requiredFields.push("Units Visibility");
    if (!displayCondition) requiredFields.push("Display Condition");
    if (!cleanedDisplay) requiredFields.push("Display Cleaning");

    // Promo Execution fields
    if (!promoDisplayed) requiredFields.push("Promo Display Status");
    if (promoDisplayed === "no" && !promoSetup)
      requiredFields.push("Promo Setup");

    // Comments field
    if (!comments.trim()) requiredFields.push("Comments");
    */

    console.log("Required fields missing:", requiredFields);

    if (requiredFields.length > 0) {
      alert(
        `Please fill in all required fields:\n\n• ${requiredFields.join(
          "\n• "
        )}`
      );
      return;
    }

    const formData = {
      territoryManager: tmValue,
      storeName: storeValue,
      serviceProvider: spValue,
      visitDate: visitDate.toISOString().slice(0, 10), // Convert Date to YYYY-MM-DD format
      storeEngagement: {
        modName,
        associateNames,
        visitPurpose,
        timeSpent,
      },
      storeDisplay: {
        cleanliness,
        pamphlets,
        unitsCondition,
        unitsVisible,
        displayCondition,
        cleanedDisplay,
      },
      promoExecution: {
        promoDisplayed,
        promoSetup,
      },
      comments,
      submittedAt: new Date().toISOString(),
    };

    try {
      console.log("Submitting form data:", formData);

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      let result;
      try {
        result = await response.json();
        console.log("Response result:", result);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        const responseText = await response.text();
        console.log("Raw response text:", responseText);
        alert(
          "Error: Invalid response from server. Please check console for details."
        );
        return;
      }

      if (response.ok) {
        // Show success alert with fade-in effect
        setShowSuccess(true);

        console.log("Form submitted:", result);

        // Reset form
        setTmValue("");
        setStoreValue("");
        setSpValue("");
        setModName("");
        setAssociateNames("");
        setVisitPurpose("");
        setTimeSpent("");
        setCleanliness("");
        setPamphlets("");
        setUnitsCondition("");
        setUnitsVisible("");
        setDisplayCondition("");
        setCleanedDisplay("");
        setPromoDisplayed("");
        setPromoSetup("");
        setComments("");

        // Reset visit date to current date
        setVisitDate(new Date());

        // Hide success alert after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        console.error("Form submission error:", result);
        console.error("Response status:", response.status);
        console.error("Response statusText:", response.statusText);

        // Better error message handling
        let errorMessage = "Please try again.";
        if (result && typeof result === "object") {
          errorMessage =
            result.error || result.details || result.message || errorMessage;
        } else if (response.statusText) {
          errorMessage = response.statusText;
        }

        alert(`Error submitting form (${response.status}): ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error details:", {
        message: errorMessage,
        error: error,
      });
      alert(`Error submitting form: ${errorMessage}`);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      {/* Fixed positioned success alert */}
      <SuccessAlert show={showSuccess} />

      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Enter your Info</CardTitle>
          <CardDescription>Enter your Info</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Automatic Date Field */}
              <div className="grid gap-3">
                <Label htmlFor="visit-date">Visit Date</Label>
                <DatePicker
                  date={visitDate}
                  onDateChange={(date) => setVisitDate(date || new Date())}
                  placeholder="Select visit date"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Automatically set to current date (editable)
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="">Territory Manager *</Label>
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
                  <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[--radix-popover-trigger-width] p-0">
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
                  <Label htmlFor="">Store Name and Number *</Label>
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
                  <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[--radix-popover-trigger-width] p-0">
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
                <Label htmlFor="">Service Provider Assigned to Store *</Label>
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
                  <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[--radix-popover-trigger-width] p-0">
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

              {/* Store Engagement Section */}
              <div className="grid gap-6 border-t pt-6">
                <h3 className="text-lg font-semibold">Store Engagement</h3>

                <div className="grid gap-3">
                  <Label htmlFor="mod-name">
                    Met with MOD or Store Manager (name) *
                  </Label>
                  <Input
                    id="mod-name"
                    placeholder="Enter manager name..."
                    value={modName}
                    onChange={(e) => setModName(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="associate-names">
                    Met with store associates (names) *
                  </Label>
                  <Textarea
                    id="associate-names"
                    placeholder="Enter associate names..."
                    value={associateNames}
                    onChange={(e) => setAssociateNames(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="visit-purpose">
                    Purpose of the Store visit *
                  </Label>
                  <Input
                    id="visit-purpose"
                    placeholder="training / validation / support / etc"
                    value={visitPurpose}
                    onChange={(e) => setVisitPurpose(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="time-spent">
                    How much time was spent in the store *
                  </Label>
                  <Input
                    id="time-spent"
                    placeholder="min / hours"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                  />
                </div>
              </div>

              {/* Store Display Section */}
              <div className="grid gap-6 border-t pt-6">
                <h3 className="text-lg font-semibold">Store Display</h3>
                <p className="text-sm text-muted-foreground">
                  Look and Feel (is it show room ready)
                </p>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Cleanliness *</Label>
                    <RadioGroup
                      value={cleanliness}
                      onValueChange={setCleanliness}
                      className="flex flex-row"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="cleanliness-yes" />
                        <Label htmlFor="cleanliness-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="cleanliness-no" />
                        <Label htmlFor="cleanliness-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Pamphlets and business cards *</Label>
                    <RadioGroup
                      value={pamphlets}
                      onValueChange={setPamphlets}
                      className="flex flex-row"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pamphlets-yes" />
                        <Label htmlFor="pamphlets-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pamphlets-no" />
                        <Label htmlFor="pamphlets-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Units are in good condition *</Label>
                    <RadioGroup
                      value={unitsCondition}
                      onValueChange={setUnitsCondition}
                      className="flex flex-row"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="units-condition-yes" />
                        <Label htmlFor="units-condition-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="units-condition-no" />
                        <Label htmlFor="units-condition-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>
                      Units are clear and visible, no stickers or posters on
                      equipment *
                    </Label>
                    <RadioGroup
                      value={unitsVisible}
                      onValueChange={setUnitsVisible}
                      className="flex flex-row"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="units-visible-yes" />
                        <Label htmlFor="units-visible-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="units-visible-no" />
                        <Label htmlFor="units-visible-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Display is in good condition *</Label>
                    <RadioGroup
                      value={displayCondition}
                      onValueChange={setDisplayCondition}
                      className="flex flex-row"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="yes"
                          id="display-condition-yes"
                        />
                        <Label htmlFor="display-condition-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="display-condition-no" />
                        <Label htmlFor="display-condition-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>
                      I have taken the time to clean it and make it look good *
                    </Label>
                    <RadioGroup
                      value={cleanedDisplay}
                      onValueChange={setCleanedDisplay}
                      className="flex flex-row"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="cleaned-display-yes" />
                        <Label htmlFor="cleaned-display-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="cleaned-display-no" />
                        <Label htmlFor="cleaned-display-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="na" id="cleaned-display-na" />
                        <Label htmlFor="cleaned-display-na">N/A</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Promo Execution Section */}
              <div className="grid gap-6 border-t pt-6">
                <h3 className="text-lg font-semibold">Promo Execution</h3>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Promo is displayed *</Label>
                    <RadioGroup
                      value={promoDisplayed}
                      onValueChange={setPromoDisplayed}
                      className="flex flex-row"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="promo-displayed-yes" />
                        <Label htmlFor="promo-displayed-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="promo-displayed-no" />
                        <Label htmlFor="promo-displayed-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {promoDisplayed === "no" && (
                    <div className="flex items-center justify-between">
                      <Label>If no, ask for the promo and set it up</Label>
                      <RadioGroup
                        value={promoSetup}
                        onValueChange={setPromoSetup}
                        className="flex flex-row"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="done" id="promo-setup-done" />
                          <Label htmlFor="promo-setup-done">Done</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="grid gap-6 border-t pt-6">
                <h3 className="text-lg font-semibold">
                  Comments on Overall Store Visitation *
                </h3>
                <p className="text-sm text-muted-foreground">
                  (Good, Bad, Ugly)
                </p>

                <div className="grid gap-3">
                  <Textarea
                    id="comments"
                    placeholder="Enter your comments about the overall store visitation..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                  />
                </div>
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
