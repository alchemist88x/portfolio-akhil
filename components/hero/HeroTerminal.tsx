"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, CornerDownLeft } from "lucide-react";

interface TerminalCommandData {
  command: string;
  description?: string;
  output?: string;
}

interface HeroTerminalProps {
  commands?: TerminalCommandData[];
  metadata?: {
    name: string;
    fullName?: string;
    title: string;
    experienceYears: string;
    location: string;
    contactEmail: string;
  };
  skills?: string[];
  projects?: { name: string; category?: string }[];
  experience?: { company: string; role: string; dates: string }[];
  visualSettings?: {
    technicalTypographyEnabled?: boolean;
    technicalDotPatternEnabled?: boolean;
    technicalMetadataEnabled?: boolean;
    technicalDecorationsEnabled?: boolean;
  };
}

interface TerminalLine {
  type: "input" | "output" | "system";
  content: string;
}

export default function HeroTerminal({
  commands = [],
  metadata,
  skills = [],
  projects = [],
  experience = [],
  visualSettings,
}: HeroTerminalProps) {
  const techType = visualSettings?.technicalTypographyEnabled ?? true;
  const techDots = visualSettings?.technicalDotPatternEnabled ?? true;
  const techMeta = visualSettings?.technicalMetadataEnabled ?? true;
  const techDeco = visualSettings?.technicalDecorationsEnabled ?? true;

  const fontClass = techType ? "font-mono" : "font-sans";

  const engineerName = (metadata?.fullName || metadata?.name || "AKHIL K ANIL").toUpperCase();
  const engineerRole = (metadata?.title || "SYSTEM ENGINEER / DEVOPS ENGINEER").toUpperCase();
  const engineerExp = (metadata?.experienceYears || "10+ YEARS EXPERIENCE").toUpperCase();

  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "system", content: "AKHIL CONTROL PLANE // BUILD 2026.09 [SYS-INIT OK]" },
    { type: "input", content: "whoami" },
    {
      type: "output",
      content: `${engineerName}\n${engineerRole}\n\n${engineerExp}`,
    },
    { type: "input", content: "status" },
    {
      type: "output",
      content: `PORTFOLIO.SERVICE      ● ONLINE\nINFRASTRUCTURE         ● OPERATIONAL\nAUTOMATION             ● ACTIVE\nCI/CD                  ● READY\nSECURITY               ● ENFORCED\nOBSERVABILITY          ● ACTIVE`,
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>(["whoami", "status"]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmdRaw: string) => {
    const trimmed = cmdRaw.trim().toLowerCase();
    if (!trimmed) return;

    // Add to command history
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Record user command
    const newLines: TerminalLine[] = [{ type: "input", content: trimmed }];

    if (trimmed === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    }

    // Check if custom command in database has static output
    const customCmd = commands.find((c) => c.command.toLowerCase() === trimmed);
    if (customCmd && customCmd.output) {
      newLines.push({ type: "output", content: customCmd.output });
      setHistory((prev) => [...prev, ...newLines]);
      setInputVal("");
      return;
    }

    // Dynamic Database Resolution
    switch (trimmed) {
      case "help":
        newLines.push({
          type: "output",
          content: `AVAILABLE SYSTEM COMMANDS:\n  whoami      - Print technical identity\n  status      - Display system diagnostics\n  skills      - Query verified technical matrix\n  projects    - List active infrastructure case studies\n  experience  - View chronological timeline of roles\n  about       - Display engineering philosophy\n  contact     - Display direct reachability channels\n  clear       - Clear terminal buffer`,
        });
        break;

      case "whoami":
        newLines.push({
          type: "output",
          content: `${engineerName}\n${engineerRole}\n\n${engineerExp}`,
        });
        break;

      case "status":
        newLines.push({
          type: "output",
          content: `PORTFOLIO.SERVICE      ● ONLINE\nINFRASTRUCTURE         ● OPERATIONAL\nAUTOMATION             ● ACTIVE\nCI/CD                  ● READY\nSECURITY               ● ENFORCED\nOBSERVABILITY          ● ACTIVE\nREGION                 ● ${metadata?.location?.toUpperCase() || "KOCHI, INDIA"}`,
        });
        break;

      case "skills":
      case "stack":
        newLines.push({
          type: "output",
          content: `VERIFIED SKILLS MATRIX:\n${
            skills.length > 0
              ? skills.map((s) => `  ● ${s}`).join("\n")
              : "  ● AWS, Azure, Google Cloud\n  ● Terraform, CloudFormation, Ansible\n  ● Docker, Kubernetes, Jenkins, GitLab CI\n  ● Prometheus, ELK Stack, CloudWatch"
          }`,
        });
        break;

      case "projects":
        newLines.push({
          type: "output",
          content: `FEATURED PRODUCTION CASE STUDIES:\n${
            projects.length > 0
              ? projects.map((p) => `  [+] ${p.name.padEnd(16)} | ${p.category || "Cloud Infrastructure"}`).join("\n")
              : "  [+] VARVY CLOUD      | Cloud Infrastructure\n  [+] ALPHAUNIVERSE    | Web Application / Platform\n  [+] SVADHAN          | Cloud Infrastructure\n  [+] EASY STORE       | E-Commerce Infrastructure"
          }`,
        });
        break;

      case "experience":
        newLines.push({
          type: "output",
          content: `CAREER TIMELINE:\n${
            experience.length > 0
              ? experience.map((e) => `  ● ${e.role} @ ${e.company} (${e.dates})`).join("\n")
              : "  ● System Engineer / DevOps Engineer @ Varvy Innovations Pvt. Ltd. (Aug 2026 — Present)\n  ● Server/System Administrator @ Iroid Technologies (2021 — 2026)"
          }`,
        });
        break;

      case "about":
        newLines.push({
          type: "output",
          content:
            "\"Infrastructure is invisible when it works. My job is to make sure it keeps working.\"\n\nDevOps & Cloud Engineer with 10+ years of production experience across Linux, automated cloud pipelines, and multi-tier systems.",
        });
        break;

      case "contact":
        newLines.push({
          type: "output",
          content: `COMMUNICATION CHANNELS:\n  EMAIL:    ${metadata?.contactEmail || "akhilkanil99@gmail.com"}\n  LOCATION: ${
            metadata?.location?.toUpperCase() || "KOCHI, KERALA, INDIA"
          }\n  STATUS:   Open to enterprise infrastructure & DevOps engagements.`,
        });
        break;

      default:
        newLines.push({
          type: "output",
          content: `sh: command not found: ${trimmed}. Type 'help' for available system commands.`,
        });
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const available = [
        "help",
        "whoami",
        "status",
        "skills",
        "stack",
        "projects",
        "experience",
        "about",
        "contact",
        "clear",
      ];
      const match = available.find((cmd) => cmd.startsWith(inputVal.toLowerCase().trim()));
      if (match) setInputVal(match);
    }
  };

  const quickCommands = ["whoami", "status", "skills", "projects", "experience", "clear"];

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`w-full bg-[#0A0A0A]/95 border border-zinc-800/90 rounded-lg shadow-xl ${fontClass} text-xs overflow-hidden flex flex-col cursor-text transition-all hover:border-zinc-700 relative`}
    >
      {/* Subtle Dot Grid Background in Terminal */}
      {techDots && (
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
          aria-hidden="true"
        />
      )}

      {/* Minimal Industrial Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800/80 select-none relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Minimal circular dot indicators */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-700 inline-block" />
            <span className="w-2 h-2 rounded-full bg-zinc-700 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          </div>
          <span className="text-[11px] text-zinc-400 pl-2 tracking-wider font-nothing">
            AKHIL@PORTFOLIO // SH
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
          {techMeta && (
            <span className="hidden sm:inline text-zinc-500 font-mono">
              VT-100 · UTF-8
            </span>
          )}
          <div className="flex items-center gap-1 text-emerald-400 font-bold font-nothing text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>READY</span>
          </div>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollRef}
        className="p-4 sm:p-5 space-y-2.5 max-h-[320px] min-h-[220px] overflow-y-auto leading-relaxed relative z-10"
      >
        {history.map((line, idx) => (
          <div key={idx} className="space-y-1">
            {line.type === "input" && (
              <div className="flex items-center gap-2 text-zinc-100">
                <span className="text-emerald-400 font-bold tracking-wider font-nothing text-[11px]">AKHIL@PORTFOLIO:~$</span>
                <span className="font-semibold font-mono">{line.content}</span>
              </div>
            )}
            {line.type === "output" && (
              <pre className="text-zinc-300 text-xs whitespace-pre-wrap pl-0 sm:pl-2 font-mono leading-relaxed">
                {line.content}
              </pre>
            )}
            {line.type === "system" && (
              <div className="text-zinc-500 text-[11px] tracking-wide font-mono">{line.content}</div>
            )}
          </div>
        ))}

        {/* Input prompt line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold tracking-wider flex-shrink-0 font-nothing text-[11px]">AKHIL@PORTFOLIO:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Terminal command input"
            className="flex-1 bg-transparent text-zinc-100 focus:outline-none caret-emerald-400 font-medium font-mono"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="button"
            onClick={() => executeCommand(inputVal)}
            className="text-zinc-600 hover:text-zinc-400 p-0.5 sm:hidden"
            aria-label="Execute command"
          >
            <CornerDownLeft size={13} />
          </button>
        </div>
      </div>

      {/* Compact Command Quick-Bar */}
      <div className="px-4 py-2 bg-zinc-950/90 border-t border-zinc-800/70 flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500 select-none relative z-10">
        <span className="text-zinc-600 uppercase tracking-widest mr-1 font-nothing text-[9px]">HINT:</span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              setInputVal(cmd);
              executeCommand(cmd);
            }}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-300 text-zinc-400 border border-zinc-800/80 transition-colors font-nothing text-[9px]"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
