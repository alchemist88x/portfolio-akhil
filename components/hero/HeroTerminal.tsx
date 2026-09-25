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
    title: string;
    experienceYears: string;
    location: string;
    contactEmail: string;
  };
  skills?: string[];
  projects?: { name: string; category?: string }[];
  experience?: { company: string; role: string; dates: string }[];
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
}: HeroTerminalProps) {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "system", content: "AKHIL INFRASTRUCTURE CONTROL PLANE v10.4 [x86_64-linux]" },
    { type: "system", content: "Type 'help' or 'status' to inspect cluster capabilities." },
    { type: "input", content: "whoami" },
    {
      type: "output",
      content: `${metadata?.name || "Akhil"}\n${metadata?.title || "DevOps Engineer & Cloud Infrastructure Engineer"}\nExperience: ${
        metadata?.experienceYears || "10+ Years"
      }\nRegion: ${metadata?.location || "Kochi, Kerala, India"}`,
    },
    { type: "input", content: "status" },
    {
      type: "output",
      content: `portfolio.service      ● ONLINE\ninfrastructure         ● OPERATIONAL\ndeployment             ● READY\nmonitoring             ● ACTIVE\nuptime                 ● 99.99%`,
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
          content: `AVAILABLE COMMANDS:\n  help        - Display command manual\n  whoami      - Print technical identity\n  status      - Display system diagnostics\n  skills      - Query verified technical matrix\n  projects    - List active infrastructure case studies\n  experience  - View timeline of professional roles\n  about       - Display background and philosophy\n  contact     - Display direct reachability channels\n  clear       - Clear terminal buffer`,
        });
        break;

      case "whoami":
        newLines.push({
          type: "output",
          content: `${metadata?.name || "Akhil"}\n${metadata?.title || "DevOps Engineer & Cloud Infrastructure Engineer"}\n${
            metadata?.experienceYears || "10+ Years"
          } experience\nLocation: ${metadata?.location || "Kochi, Kerala, India"}`,
        });
        break;

      case "status":
        newLines.push({
          type: "output",
          content: `portfolio.service      ● ONLINE\ninfrastructure         ● OPERATIONAL\nautomation             ● ACTIVE\nmonitoring             ● ACTIVE\ndeployment             ● READY\nuptime                 ● 99.99%`,
        });
        break;

      case "skills":
      case "stack":
        newLines.push({
          type: "output",
          content: `VERIFIED SKILLS MATRIX:\n${
            skills.length > 0
              ? skills.map((s) => `  • ${s}`).join("\n")
              : "  • AWS, Azure, Google Cloud\n  • Terraform, CloudFormation, Ansible\n  • Docker, Kubernetes, Jenkins, GitLab CI\n  • Prometheus, ELK Stack, CloudWatch"
          }`,
        });
        break;

      case "projects":
        newLines.push({
          type: "output",
          content: `FEATURED PRODUCTION CASE STUDIES:\n${
            projects.length > 0
              ? projects.map((p) => `  [+] ${p.name.padEnd(16)} | ${p.category || "Cloud Infrastructure"}`).join("\n")
              : "  [+] SVADHAN          | Cloud Infrastructure\n  [+] Easy Store       | E-Commerce Infrastructure\n  [+] Dent Care        | Healthcare Infrastructure\n  [+] BBT              | Enterprise Retail"
          }`,
        });
        break;

      case "experience":
        newLines.push({
          type: "output",
          content: `CAREER TIMELINE:\n${
            experience.length > 0
              ? experience.map((e) => `  • ${e.role} @ ${e.company} (${e.dates})`).join("\n")
              : "  • Server/System Administrator @ Iroid Technologies (2021 — Present)\n  • Server/System Administrator @ a2solutions (2018 — 2021)"
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
          content: `COMMUNICATION CHANNELS:\n  Email:    ${metadata?.contactEmail || "akhilkanil99@gmail.com"}\n  Location: ${
            metadata?.location || "Kochi, Kerala, India"
          }\n  Status:   Open to enterprise infrastructure & DevOps engagements.`,
        });
        break;

      default:
        newLines.push({
          type: "output",
          content: `zsh: command not found: ${trimmed}. Type 'help' for available system commands.`,
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

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full bg-[#0A0A0A]/95 border border-zinc-800 rounded-lg shadow-2xl font-mono text-xs overflow-hidden flex flex-col cursor-text transition-all hover:border-zinc-700"
    >
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-mono text-zinc-400 pl-2">
            akhil@infrastructure-node-01: ~
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <Terminal size={12} />
          <span>zsh · 80x24</span>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollRef}
        className="p-4 sm:p-5 space-y-2.5 max-h-[340px] min-h-[220px] overflow-y-auto leading-relaxed"
      >
        {history.map((line, idx) => (
          <div key={idx}>
            {line.type === "input" && (
              <div className="flex items-center gap-2 text-zinc-100">
                <span className="text-emerald-400">akhil@portfolio:~$</span>
                <span>{line.content}</span>
              </div>
            )}
            {line.type === "output" && (
              <pre className="text-zinc-300 font-mono text-xs whitespace-pre-wrap pl-0 sm:pl-2">
                {line.content}
              </pre>
            )}
            {line.type === "system" && (
              <div className="text-zinc-500 text-[11px]">{line.content}</div>
            )}
          </div>
        ))}

        {/* Input prompt line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 flex-shrink-0">akhil@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Terminal command input"
            className="flex-1 bg-transparent text-zinc-100 focus:outline-none font-mono caret-emerald-400"
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
    </div>
  );
}
