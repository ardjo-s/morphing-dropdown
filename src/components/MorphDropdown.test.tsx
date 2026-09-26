import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { MorphDropdown } from "./MorphDropdown";

const options = [
  { id: "atlas", label: "Atlas Studio" },
  { id: "lumen", label: "Lumen Archive" },
  { id: "north", label: "Northwind Lab" },
];

function SingleHarness() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <MorphDropdown label="Workspace" options={options} value={value} onChange={setValue} />
  );
}

function MultiHarness() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MorphDropdown
      multiple
      label="Disciplines"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}

describe("MorphDropdown", () => {
  it("exposes combobox semantics on the trigger", () => {
    render(<SingleHarness />);
    const trigger = screen.getByRole("button", { name: "Workspace" });
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens with ArrowDown and lists options", async () => {
    const user = userEvent.setup();
    render(<SingleHarness />);
    const trigger = screen.getByRole("button", { name: "Workspace" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("selects with Enter and closes in single-select", async () => {
    const user = userEvent.setup();
    render(<SingleHarness />);
    const trigger = screen.getByRole("button", { name: "Workspace" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Atlas Studio")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<SingleHarness />);
    const trigger = screen.getByRole("button", { name: "Workspace" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("keeps the panel open for multi-select", async () => {
    const user = userEvent.setup();
    render(<MultiHarness />);
    await user.click(screen.getByRole("button", { name: "Disciplines" }));
    await user.click(screen.getByRole("option", { name: /Atlas Studio/ }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Atlas Studio/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
