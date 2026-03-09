import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("UI primitives", () => {
  it("renders input with expected slot attribute", () => {
    render(<Input aria-label="Name" value="Rose" readOnly />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("data-slot", "input");
  });

  it("renders textarea with expected slot attribute", () => {
    render(<Textarea aria-label="Comments" defaultValue="Looks good" />);
    expect(screen.getByLabelText("Comments")).toHaveAttribute(
      "data-slot",
      "textarea",
    );
  });

  it("renders radix label text", () => {
    render(<Label htmlFor="x">Store Name</Label>);
    expect(screen.getByText("Store Name")).toHaveAttribute(
      "data-slot",
      "label",
    );
  });

  it("renders composed card sections", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Latest store visit</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Summary")).toHaveAttribute(
      "data-slot",
      "card-title",
    );
    expect(screen.getByText("Latest store visit")).toHaveAttribute(
      "data-slot",
      "card-description",
    );
    expect(screen.getByText("Body")).toHaveAttribute(
      "data-slot",
      "card-content",
    );
    expect(screen.getByText("Footer")).toHaveAttribute(
      "data-slot",
      "card-footer",
    );
  });
});
