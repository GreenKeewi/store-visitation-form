import { Button, buttonVariants } from "@/components/ui/button";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Button", () => {
  it("renders button text and data-slot", () => {
    render(<Button>Submit</Button>);

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("applies variant classes via buttonVariants helper", () => {
    const destructive = buttonVariants({ variant: "destructive" });
    expect(destructive).toContain("bg-destructive");
  });

  it("supports disabled state", () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });
});
