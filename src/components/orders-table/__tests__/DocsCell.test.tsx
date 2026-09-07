import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocsCell } from "../cells";

describe("DocsCell", () => {
  it("renders three stacked statuses for ID, Full Photo, and Video", () => {
    render(
      <DocsCell
        uploaded={false}
        documentItemsStatus={{ id: true, fullPhoto: false, video: true }}
      />,
    );

    expect(screen.getByText("ID:")).toBeInTheDocument();
    expect(screen.getByText("Full Photo:")).toBeInTheDocument();
    expect(screen.getByText("Video:")).toBeInTheDocument();

    expect(screen.getAllByText("Uploaded")).toHaveLength(2);
    expect(screen.getAllByText("Not Uploaded")).toHaveLength(1);
  });

  it("falls back to legacy uploaded boolean when item statuses are missing", () => {
    render(<DocsCell uploaded={true} />);

    expect(screen.getAllByText("Uploaded")).toHaveLength(2);
    expect(screen.getAllByText("Not Uploaded")).toHaveLength(1);
  });
});
