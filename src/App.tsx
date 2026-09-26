import { useState } from "react";
import { MorphDropdown } from "./components/MorphDropdown";
import { SparkIcon } from "./components/icons";
import { commands, destinations, disciplines, nestedLibrary } from "./data/demo";
import { variantCopy, type DemoVariant } from "./lib/types";

const variants: DemoVariant[] = ["default", "multi", "nested", "keyboard"];

export default function App() {
  const [workspace, setWorkspace] = useState<string | null>("atlas");
  const [picked, setPicked] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>(["motion", "a11y"]);
  const [nested, setNested] = useState<string | null>("gallery");
  const [command, setCommand] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <a
        href="#playground"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--ink)] focus:px-3 focus:py-2 focus:text-[var(--paper)]"
      >
        Skip to playground
      </a>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
            <SparkIcon />
          </span>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em]">
            THEWHATIF.COMPANY
          </p>
        </div>
        <nav className="flex items-center gap-5 text-[13px] text-[var(--mute)]">
          <a className="transition-colors hover:text-[var(--ink)]" href="#playground">
            Playground
          </a>
          <a className="transition-colors hover:text-[var(--ink)]" href="#usage">
            Usage
          </a>
          <a
            className="transition-colors hover:text-[var(--ink)]"
            href="https://github.com/ardjo-s/morphing-dropdown"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-20 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--mute)]">
              Public interface study · 001
            </p>
            <h1 className="display mt-4 max-w-[14ch] text-[64px] leading-[0.92] text-[var(--ink)] sm:text-[84px]">
              The trigger becomes the panel.
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-7 text-[var(--mute)]">
              A morphing dropdown for THEWHATIF.COMPANY — inspired by the vault study from{" "}
              <a
                className="text-[var(--ink)] underline decoration-[var(--accent)] decoration-2 underline-offset-4"
                href="https://x.com/koppkev/status/2103378630797595109"
              >
                @koppkev
              </a>
              . Same surface. Spring physics. Nothing pops; it unfolds.
            </p>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--rule)] pt-6 text-[13px]">
              <div>
                <dt className="text-[var(--mute)]">Motion</dt>
                <dd className="mt-1 font-medium">Shared shell</dd>
              </div>
              <div>
                <dt className="text-[var(--mute)]">Access</dt>
                <dd className="mt-1 font-medium">Focus trap</dd>
              </div>
              <div>
                <dt className="text-[var(--mute)]">Keys</dt>
                <dd className="mt-1 font-medium">↓ ↑ Esc ⏎</dd>
              </div>
            </dl>
          </div>

          <div className="relative isolate flex min-h-[420px] items-center justify-center rounded-[32px] border border-[var(--rule)] bg-[linear-gradient(180deg,#1c1914,60%,#0e0c0a)] p-10 shadow-[0_40px_80px_-40px_rgba(20,18,14,0.55)]">
            <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_50%_0%,rgba(214,255,74,0.16),transparent_46%)]" />
            <div className="relative">
              <p className="mb-4 text-center text-[11px] uppercase tracking-[0.2em] text-white/40">
                Live artifact
              </p>
              <MorphDropdown
                label="Workspace"
                placeholder="Choose a desk"
                options={destinations}
                value={workspace}
                onChange={setWorkspace}
                panelWidth={340}
              />
            </div>
          </div>
        </section>

        <section id="playground" className="border-t border-[var(--rule)] bg-[rgba(255,255,255,0.28)]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--mute)]">Playground</p>
                <h2 className="display mt-2 text-[40px] leading-none">Four ways it opens.</h2>
              </div>
              <p className="max-w-sm text-[14px] leading-6 text-[var(--mute)]">
                Default, multi-select, nested sections, and a keyboard-first command list. Each uses
                the same morphing shell.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {variants.map((variant) => {
                const copy = variantCopy(variant);
                return (
                  <article
                    key={variant}
                    className="min-h-[320px] rounded-[28px] border border-[var(--rule)] bg-[rgba(255,255,255,0.45)] p-6"
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--mute)]">
                      {copy.eyebrow}
                    </p>
                    <h3 className="display mt-2 text-[28px]">{copy.title}</h3>
                    <p className="mt-2 max-w-sm text-[14px] leading-6 text-[var(--mute)]">{copy.body}</p>
                    <div className="mt-8 flex min-h-[180px] items-start">
                      {variant === "default" ? (
                        <MorphDropdown
                          label="Destination"
                          placeholder="Pick a studio"
                          options={destinations}
                          value={picked}
                          onChange={setPicked}
                        />
                      ) : null}
                      {variant === "multi" ? (
                        <MorphDropdown
                          multiple
                          label="Disciplines"
                          placeholder="Add interests"
                          options={disciplines}
                          value={skills}
                          onChange={setSkills}
                        />
                      ) : null}
                      {variant === "nested" ? (
                        <MorphDropdown
                          label="Library"
                          placeholder="Browse spaces"
                          sections={nestedLibrary}
                          value={nested}
                          onChange={setNested}
                        />
                      ) : null}
                      {variant === "keyboard" ? (
                        <MorphDropdown
                          searchable
                          label="Command"
                          placeholder="Open the vault"
                          options={commands}
                          value={command}
                          onChange={setCommand}
                        />
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="display text-[36px]">Keyboard map</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["↓ / Enter / Space", "Open from the trigger"],
              ["↑ ↓ Home End", "Move the active option"],
              ["Type a letter", "Seek by first character"],
              ["Esc", "Close and restore focus"],
            ].map(([keys, meaning]) => (
              <li
                key={keys}
                className="rounded-2xl border border-[var(--rule)] bg-white/40 px-4 py-4 text-[14px]"
              >
                <p className="font-medium">{keys}</p>
                <p className="mt-1 text-[var(--mute)]">{meaning}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="usage" className="border-t border-[var(--rule)]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="display text-[36px]">Use it</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[var(--mute)]">
              Drop <code className="text-[var(--ink)]">MorphDropdown</code> into any React tree.
              Single-select takes a string; multi-select takes a string array. Pass{" "}
              <code className="text-[var(--ink)]">sections</code> for grouped lists.
            </p>
            <pre className="mt-8 overflow-auto rounded-[24px] bg-[var(--ink)] p-6 text-[13px] leading-6 text-[var(--paper-2)]">
              <code>{`import { MorphDropdown } from "./components/MorphDropdown";

<MorphDropdown
  label="Workspace"
  options={[{ id: "atlas", label: "Atlas Studio" }]}
  value={value}
  onChange={setValue}
/>

<MorphDropdown
  multiple
  label="Disciplines"
  options={disciplines}
  value={selected}
  onChange={setSelected}
/>`}</code>
            </pre>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--rule)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-[13px] text-[var(--mute)]">
          <p>THEWHATIF.COMPANY · morphing dropdown study</p>
          <p>
            Inspired by{" "}
            <a className="text-[var(--ink)]" href="https://x.com/koppkev/status/2103378630797595109">
              koppkev / vault
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
