import { SuccessAlert } from "@/components/ui/success-alert";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("SuccessAlert", () => {
  it("shows success message text", () => {
    render(<SuccessAlert show={true} />);

    expect(screen.getByText("Completed successfully!")).toBeInTheDocument();
  });

  it("applies visible classes when show is true", () => {
    const { container } = render(<SuccessAlert show={true} />);

    expect(container.firstElementChild).toHaveClass("opacity-100");
    expect(container.firstElementChild).toHaveClass("translate-y-0");
  });

  it("applies hidden classes when show is false", () => {
    const { container } = render(<SuccessAlert show={false} />);

    expect(container.firstElementChild).toHaveClass("opacity-0");
    expect(container.firstElementChild).toHaveClass("-translate-y-8");
    expect(container.firstElementChild).toHaveClass("pointer-events-none");
  });
});
