"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Code,
  GitPullRequest,
  Hammer,
  CheckCircle,
  Package,
  Rocket,
  Cloud,
  Activity,
  Shield,
  Layers,
  Play,
  RotateCcw,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Info,
  Square,
} from "lucide-react";

interface PipelineStage {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  tools?: string[];
  duration?: string;
  gatePolicy?: string;
  logSnippet?: string;
}

interface CicdPipelineProps {
  pipeline?: {
    name: string;
    description?: string;
  };
  stages: PipelineStage[];
}

// 10-Stage High-Trust Enterprise GitOps Pipeline Preset
const gitopsStages: PipelineStage[] = [
  {
    _id: "gitops-1",
    name: "LINT & SECRETS",
    description: "ESLint static rules, TypeScript strict compilation, and TruffleHog git hook scanning to reject exposed API credentials.",
    icon: "Code",
    sortOrder: 1,
    tools: ["ESLint", "TypeScript", "TruffleHog", "Husky"],
    duration: "18s",
    gatePolicy: "Zero Secret Leaks Allowed (Exit 1 on match)",
    logSnippet: "$ trufflehog git file://. --fail\n✓ Scanned 52 commits\n✓ 0 secrets detected. Branch clean.",
  },
  {
    _id: "gitops-2",
    name: "PR QUALITY GATE",
    description: "Automated GitHub Actions branch protection, linear Git history rebase check, and mandatory peer approvals.",
    icon: "GitPullRequest",
    sortOrder: 2,
    tools: ["GitHub Actions", "CodeOwners", "Branch Rules"],
    duration: "25s",
    gatePolicy: "2 Approvals & All Required Checks Passing",
    logSnippet: "$ gh pr checks\n✓ 4/4 mandatory checks passed\n✓ Peer reviews validated: 2/2 approvals.",
  },
  {
    _id: "gitops-3",
    name: "SAST & SEMGREP",
    description: "SonarQube quality gate and Semgrep AST pattern analysis scanning for injection vulnerabilities and memory leaks.",
    icon: "CheckCircle",
    sortOrder: 3,
    tools: ["SonarQube", "Semgrep", "OWASP Rules"],
    duration: "42s",
    gatePolicy: "Grade A Rating, 0 Critical Security Hotspots",
    logSnippet: "$ sonarqube-scanner -Dsonar.qualitygate.wait=true\n✓ Quality Gate Passed: 0 Bugs, 0 Vulnerabilities.\n✓ Code Coverage: 92.4% (Threshold: 85%).",
  },
  {
    _id: "gitops-4",
    name: "PARALLEL TESTS",
    description: "Distributed unit and integration test suites executing across ephemeral Testcontainers with mock databases.",
    icon: "Hammer",
    sortOrder: 4,
    tools: ["Jest", "Vitest", "Testcontainers"],
    duration: "1m 12s",
    gatePolicy: "100% Tests Passing, Minimum 85% Code Coverage",
    logSnippet: "$ vitest run --coverage --threads=4\n✓ 418/418 test suites passed in 14.2s.\n✓ Total assertions evaluated: 1,940.",
  },
  {
    _id: "gitops-5",
    name: "SCA & TRIVY SCAN",
    description: "Software composition analysis scanning npm/pip dependencies and base container layers against CVE databases.",
    icon: "Shield",
    sortOrder: 5,
    tools: ["Trivy", "Snyk", "NVD Database"],
    duration: "34s",
    gatePolicy: "Zero High / Critical CVEs Permitted",
    logSnippet: "$ trivy image --severity HIGH,CRITICAL app:latest\n✓ Scanned 348 OS packages, 512 application dependencies\n✓ 0 High / 0 Critical CVEs detected.",
  },
  {
    _id: "gitops-6",
    name: "BUILD & COSIGN",
    description: "Multi-stage distroless container compilation and cryptographic image signing via Sigstore Cosign before pushing to registry.",
    icon: "Package",
    sortOrder: 6,
    tools: ["Docker Buildx", "Cosign", "AWS ECR"],
    duration: "1m 45s",
    gatePolicy: "Cryptographic Digest Attestation Verified",
    logSnippet: "$ cosign sign --key aws-kms://alias/cosign-key 123456.dkr.ecr.aws/app:sha-9f2\n✓ Digest: sha256:9f2b841a0...\n✓ Cryptographic signature stored in ECR.",
  },
  {
    _id: "gitops-7",
    name: "TERRAFORM & CHECKOV",
    description: "Infrastructure as code dry-run, CIS AWS compliance audit via Checkov, and cost estimation via Infracost.",
    icon: "Cloud",
    sortOrder: 7,
    tools: ["Terraform", "Checkov", "Infracost"],
    duration: "48s",
    gatePolicy: "CIS Benchmark Passing, Cost Delta < $50/mo",
    logSnippet: "$ checkov -d ./terraform --framework terraform\n✓ Passed: 142 compliance checks, 0 failed\n✓ Infracost: Monthly infrastructure cost delta: +$0.00.",
  },
  {
    _id: "gitops-8",
    name: "GITOPS ARGO CD",
    description: "Declarative GitOps reconciliation syncing desired repository commit state into Kubernetes production namespaces.",
    icon: "Layers",
    sortOrder: 8,
    tools: ["ArgoCD", "Kubernetes EKS", "Kustomize"],
    duration: "28s",
    gatePolicy: "Zero Drift Reconciliation Verified",
    logSnippet: "$ argocd app sync production-api --prune\n✓ OutOfSync -> Synced in 8.4s\n✓ 18 Kubernetes resources synchronized successfully.",
  },
  {
    _id: "gitops-9",
    name: "CANARY DEPLOYMENT",
    description: "Progressive traffic shifting with Argo Rollouts incrementally routing 10% -> 50% -> 100% traffic with automated rollback.",
    icon: "Rocket",
    sortOrder: 9,
    tools: ["Argo Rollouts", "AWS ALB", "Prometheus Metrics"],
    duration: "3m 15s",
    gatePolicy: "Error Rate < 0.05% Over 5 Min Window",
    logSnippet: "$ argo rollouts status rollout api-service\n✓ Step 1 (10%): Error rate 0.001%. OK.\n✓ Step 2 (50%): Latency 14ms. OK.\n✓ Step 3 (100%): Rollout complete. Zero downtime.",
  },
  {
    _id: "gitops-10",
    name: "SYNTHETICS & APM",
    description: "Automated post-deployment synthetic curl probes, Prometheus SLO baseline validation, and deployment audit dispatch.",
    icon: "Activity",
    sortOrder: 10,
    tools: ["Prometheus", "Datadog", "PagerDuty", "Slack"],
    duration: "20s",
    gatePolicy: "HTTP 200 OK & P95 Latency < 50ms",
    logSnippet: "$ curl -sfI https://api.service/healthz\n✓ HTTP/2 200 OK (latency: 11ms)\n✓ PagerDuty & Slack deployment notification posted.",
  },
];

// Secondary Preset: AWS Multi-Account SecDevOps Pipeline
const awsSecDevOpsStages: PipelineStage[] = [
  {
    _id: "sec-1",
    name: "LINT & SECRETS",
    description: "ESLint, TypeScript verification, and TruffleHog secrets scanning blocking committed AWS keys or API credentials.",
    icon: "Code",
    sortOrder: 1,
    tools: ["ESLint", "TypeScript", "TruffleHog", "Husky"],
    duration: "18s",
    gatePolicy: "Zero Secret Leaks Allowed (Exit 1)",
    logSnippet: "$ trufflehog git file://. --fail\n✓ Scanned 48 commits\n✓ 0 secrets detected. Branch clean.",
  },
  {
    _id: "sec-2",
    name: "PR QUALITY GATE",
    description: "GitHub Actions automated branch protection checks, linear Git rebase requirement, and 2-approver policy.",
    icon: "GitPullRequest",
    sortOrder: 2,
    tools: ["GitHub Actions", "CodeOwners", "Branch Rules"],
    duration: "25s",
    gatePolicy: "2 Approvals & All Checks Green",
    logSnippet: "$ gh pr checks\n✓ 4/4 mandatory checks passed\n✓ 2 approved peer reviews registered.",
  },
  {
    _id: "sec-3",
    name: "SAST & SEMGREP",
    description: "SonarQube quality gate and Semgrep AST rules scanning for injection flaws, memory leaks, and insecure cryptos.",
    icon: "CheckCircle",
    sortOrder: 3,
    tools: ["SonarQube", "Semgrep", "OWASP Rules"],
    duration: "42s",
    gatePolicy: "Grade A Rating, 0 Critical Hotspots",
    logSnippet: "$ sonarqube-scanner -Dsonar.qualitygate.wait=true\n✓ Quality Gate Passed: 0 Bugs, 0 Vulnerabilities.\n✓ Coverage: 91.8% (threshold: 85%).",
  },
  {
    _id: "sec-4",
    name: "PARALLEL TESTS",
    description: "High-throughput unit and integration tests executing across parallel runners with ephemeral local container mocks.",
    icon: "Hammer",
    sortOrder: 4,
    tools: ["Jest", "Vitest", "Testcontainers"],
    duration: "1m 12s",
    gatePolicy: "100% Tests Passing (>85% Coverage)",
    logSnippet: "$ vitest run --coverage --threads=4\n✓ 412/412 test suites passed in 14.2s.\n✓ Total assertions: 1,840.",
  },
  {
    _id: "sec-5",
    name: "SCA & TRIVY SCAN",
    description: "Software composition analysis scanning npm/pip dependencies and base Docker images against national CVE registries.",
    icon: "Shield",
    sortOrder: 5,
    tools: ["Trivy", "Snyk", "NVD Database"],
    duration: "34s",
    gatePolicy: "Zero High/Critical CVEs Permitted",
    logSnippet: "$ trivy image --severity HIGH,CRITICAL backend:latest\n✓ Scanned 348 OS packages, 512 npm packages\n✓ 0 High / 0 Critical CVEs detected.",
  },
  {
    _id: "sec-6",
    name: "BUILD & COSIGN",
    description: "Multi-stage distroless container compilation and cryptographic image signing via Sigstore Cosign before pushing to AWS ECR.",
    icon: "Package",
    sortOrder: 6,
    tools: ["Docker Buildx", "Cosign", "AWS ECR"],
    duration: "1m 45s",
    gatePolicy: "Cryptographic Digest Attestation",
    logSnippet: "$ cosign sign --key aws-kms://alias/cosign-key 123456.dkr.ecr.aws/app:sha-9f2\n✓ Digest: sha256:9f2b8...\n✓ Signature stored in ECR.",
  },
  {
    _id: "sec-7",
    name: "TERRAFORM & CHECKOV",
    description: "Infrastructure as code dry-run, CIS AWS Foundation compliance scan with Checkov, and cost estimation via Infracost.",
    icon: "Cloud",
    sortOrder: 7,
    tools: ["Terraform", "Checkov", "Infracost"],
    duration: "48s",
    gatePolicy: "CIS Benchmark Passing, Cost Delta < $50/mo",
    logSnippet: "$ checkov -d ./terraform --framework terraform\n✓ Passed: 142 checks, 0 failed\n✓ Infracost: Monthly cost delta +$0.00.",
  },
  {
    _id: "sec-8",
    name: "GITOPS ARGO CD",
    description: "Declarative GitOps reconciliation syncing desired repository commit directly into Amazon EKS cluster namespaces.",
    icon: "Layers",
    sortOrder: 8,
    tools: ["ArgoCD", "Kubernetes EKS", "Kustomize"],
    duration: "28s",
    gatePolicy: "Zero Drift Reconciliation",
    logSnippet: "$ argocd app sync production-api --prune\n✓ OutOfSync -> Synced in 8.4s\n✓ 18 resources synchronized successfully.",
  },
  {
    _id: "sec-9",
    name: "CANARY DEPLOYMENT",
    description: "Progressive delivery with Argo Rollouts incrementally routing 10% -> 50% -> 100% traffic with automated error rollback.",
    icon: "Rocket",
    sortOrder: 9,
    tools: ["Argo Rollouts", "AWS ALB", "Prometheus Metrics"],
    duration: "3m 15s",
    gatePolicy: "Error Rate < 0.05% Over 5 Min Window",
    logSnippet: "$ argo rollouts status rollout api-service\n✓ Step 1 (10%): Error rate 0.001%. OK.\n✓ Step 2 (50%): Latency 14ms. OK.\n✓ Step 3 (100%): Rollout complete. Zero downtime.",
  },
  {
    _id: "sec-10",
    name: "SYNTHETICS & APM",
    description: "Automated post-deployment synthetic curl probes, Prometheus SLO baseline validation, and deployment audit dispatch.",
    icon: "Activity",
    sortOrder: 10,
    tools: ["Prometheus", "Datadog", "PagerDuty", "Slack"],
    duration: "20s",
    gatePolicy: "HTTP 200 OK & P95 < 50ms",
    logSnippet: "$ curl -sfI https://api.service/healthz\n✓ HTTP/2 200 OK (latency: 11ms)\n✓ PagerDuty & Slack deployment notification posted.",
  },
];

export default function CicdPipeline({ pipeline, stages = [] }: CicdPipelineProps) {
  // Preset Selection: 'gitops' or 'secdevops'
  const [activePreset, setActivePreset] = useState<"gitops" | "secdevops">("gitops");

  // Stable stage list selection
  const currentStages: PipelineStage[] = useMemo(() => {
    if (activePreset === "secdevops") return awsSecDevOpsStages;
    if (stages && stages.length >= 8) {
      return stages.map((s, idx) => ({
        ...s,
        tools: gitopsStages[idx]?.tools || ["GitOps Tool", "Automation"],
        duration: gitopsStages[idx]?.duration || "30s",
        gatePolicy: gitopsStages[idx]?.gatePolicy || "Automated Pass Required",
        logSnippet: gitopsStages[idx]?.logSnippet || `$ execute stage ${s.name}\n✓ Stage completed with exit code 0.`,
      }));
    }
    return gitopsStages;
  }, [activePreset, stages]);

  const [activeStage, setActiveStage] = useState<PipelineStage | null>(currentStages[0] || null);

  // Live Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [runningStageIdx, setRunningStageIdx] = useState<number | null>(null);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Reset state whenever user explicitly changes the preset
  const handlePresetChange = (preset: "gitops" | "secdevops") => {
    if (preset === activePreset) return;
    setIsSimulating(false);
    setRunningStageIdx(null);
    setCompletedStages([]);
    setLiveLogs([]);
    setActivePreset(preset);
  };

  // Keep activeStage in sync when switching preset
  useEffect(() => {
    setActiveStage(currentStages[0] || null);
  }, [activePreset, currentStages]);

  // Auto-scroll the live telemetry log console
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [liveLogs]);

  // Robust, reliable step-by-step pipeline execution simulation
  useEffect(() => {
    if (!isSimulating) {
      setRunningStageIdx(null);
      return;
    }

    const stagesToRun = currentStages;
    const total = stagesToRun.length;

    // Initialize simulation state
    setCompletedStages([]);
    setLiveLogs([
      "==================================================",
      `[PIPELINE INITIALIZED] Commit #a8f29d9 (refs/heads/main) by Akhil K Anil`,
      `[TRIGGER] Automated push event to production branch`,
      `[RUNNER] Ephemeral CI/CD Kubernetes Runner #runner-us-east-1a allocated`,
      "==================================================",
    ]);

    let step = 0;

    // Start with the first stage running
    setRunningStageIdx(0);
    setActiveStage(stagesToRun[0]);
    setLiveLogs((prev) => [
      ...prev,
      `\n[STAGE 01/${String(total).padStart(2, "0")}: ${stagesToRun[0].name}] Executing automated gate...`,
      ...(stagesToRun[0].logSnippet ? stagesToRun[0].logSnippet.split("\n") : []),
    ]);

    const timer = setInterval(() => {
      // Step just finished: mark current step as completed
      const finishedIdx = step;
      setCompletedStages((prev) => (prev.includes(finishedIdx) ? prev : [...prev, finishedIdx]));
      const finishedStage = stagesToRun[finishedIdx];
      
      setLiveLogs((prev) => [
        ...prev,
        `✓ STAGE 0${finishedIdx + 1} PASSED (${finishedStage?.duration || "24s"})`,
      ]);

      // Move to next step
      step += 1;

      if (step < total) {
        const nextStage = stagesToRun[step];
        setRunningStageIdx(step);
        setActiveStage(nextStage);
        setLiveLogs((prev) => [
          ...prev,
          `\n[STAGE 0${step + 1}/${String(total).padStart(2, "0")}: ${nextStage.name}] Executing automated gate...`,
          ...(nextStage.logSnippet ? nextStage.logSnippet.split("\n") : []),
        ]);
      } else {
        // All stages complete!
        clearInterval(timer);
        setIsSimulating(false);
        setRunningStageIdx(null);
        setLiveLogs((prev) => [
          ...prev,
          "\n==================================================",
          "🚀 PIPELINE EXECUTION SUCCESSFUL — ALL 10 GATES VERIFIED",
          "✓ Production Canary: 100% Traffic Healthy (Error Rate < 0.01%)",
          "✓ Deployment Audit Recorded: Zero-Downtime Deployment Verified",
          "==================================================",
        ]);
      }
    }, 1100);

    return () => {
      clearInterval(timer);
    };
  }, [isSimulating, currentStages]);

  const getStageIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("code") || lower.includes("lint")) return Code;
    if (lower.includes("git") || lower.includes("pull") || lower.includes("review")) return GitPullRequest;
    if (lower.includes("sast") || lower.includes("quality")) return CheckCircle;
    if (lower.includes("build") || lower.includes("test")) return Hammer;
    if (lower.includes("sca") || lower.includes("cve") || lower.includes("sec")) return Shield;
    if (lower.includes("package") || lower.includes("cosign")) return Package;
    if (lower.includes("iac") || lower.includes("terraform") || lower.includes("cloud")) return Cloud;
    if (lower.includes("argo") || lower.includes("sync") || lower.includes("mesh")) return Layers;
    if (lower.includes("canary") || lower.includes("deploy") || lower.includes("rollout")) return Rocket;
    if (lower.includes("telemetry") || lower.includes("monitor") || lower.includes("apm")) return Activity;
    return Rocket;
  };

  return (
    <section id="pipeline" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 font-bold font-nothing">07</span>
            <span className="text-zinc-600">/</span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 uppercase">
              CI/CD PIPELINE
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-nothing text-[11px]">
            ENTERPRISE GITOPS &amp; SECDEVOPS LIFECYCLE
          </span>
        </div>

        {/* Pipeline Preset Switcher & Simulation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handlePresetChange("gitops")}
              className={`px-4 py-2 rounded text-xs font-bold tracking-wider transition-all uppercase flex items-center gap-2 border cursor-pointer select-none ${
                activePreset === "gitops"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/60 shadow-lg shadow-emerald-950/30"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Layers size={14} className="text-emerald-400" />
              <span>GITOPS ARGO CD &amp; KUBERNETES</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetChange("secdevops")}
              className={`px-4 py-2 rounded text-xs font-bold tracking-wider transition-all uppercase flex items-center gap-2 border cursor-pointer select-none ${
                activePreset === "secdevops"
                  ? "bg-sky-500/10 text-sky-400 border-sky-500/60 shadow-lg shadow-sky-950/30"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Shield size={14} className="text-sky-400" />
              <span>SECDEVOPS &amp; GITHUB ACTIONS / AWS</span>
            </button>
          </div>

          {/* Trigger Simulation Button / Reset Button */}
          <div className="flex items-center gap-2">
            {completedStages.length > 0 && !isSimulating && (
              <button
                type="button"
                onClick={() => {
                  setCompletedStages([]);
                  setLiveLogs([]);
                  setRunningStageIdx(null);
                  setActiveStage(currentStages[0]);
                }}
                className="px-3 py-2 rounded text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 border bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer"
                title="Reset simulation state"
              >
                <RotateCcw size={12} />
                <span>RESET</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSimulating((prev) => !prev)}
              className={`px-4 py-2 rounded text-xs font-bold tracking-wider transition-all flex items-center gap-2 border cursor-pointer select-none ${
                isSimulating
                  ? "bg-amber-950/80 text-amber-300 border-amber-500 shadow-lg shadow-amber-950/50"
                  : "bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-lg shadow-emerald-950/40"
              }`}
            >
              {isSimulating ? (
                <>
                  <Square size={13} className="fill-amber-400 text-amber-400" />
                  <span>STOP SIMULATION</span>
                </>
              ) : (
                <>
                  <Play size={13} className="fill-black text-black" />
                  <span>RUN PIPELINE SIMULATION</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* DORA Metrics Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-zinc-950 border border-zinc-800/90 rounded-lg text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">DEPLOYMENT FREQUENCY</span>
            <span className="text-emerald-400 font-bold text-sm font-nothing">18 / DAY</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">LEAD TIME FOR CHANGES</span>
            <span className="text-sky-400 font-bold text-sm font-nothing">12.4 MINUTES</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">CHANGE FAILURE RATE</span>
            <span className="text-emerald-400 font-bold text-sm font-nothing">&lt; 0.2%</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">TIME TO RESTORE (MTTR)</span>
            <span className="text-amber-400 font-bold text-sm font-nothing">2.8 MINUTES</span>
          </div>
          <div className="col-span-2 sm:col-span-1 space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">TEST COVERAGE</span>
            <span className="text-zinc-200 font-bold text-sm flex items-center gap-1.5 font-nothing">
              <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
              94.2% PASS
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-zinc-400 max-w-4xl leading-relaxed font-sans">
          {pipeline?.description ||
            "Zero-trust continuous integration and progressive delivery pipeline featuring shift-left secret detection, static code analysis (SAST), automated vulnerability scanning (SCA), cryptographic container image signing, infrastructure-as-code policy compliance, and automated canary rollouts with instant error-rate rollbacks."}
        </p>

        {/* Pipeline Sequence Grid */}
        <div className="p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 border-b border-zinc-900 pb-3">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
              10-STAGE AUTOMATED PIPELINE FLOW · CLICK STAGE TO INSPECT POLICY GATES
            </span>
            <span className="text-emerald-400 font-bold text-[11px] font-nothing">
              COMMIT ──► SECURITY SCAN ──► RECONCILE ──► CANARY
            </span>
          </div>

          {/* Stages Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2.5 relative">
            {currentStages.map((stage, idx) => {
              const Icon = getStageIcon(stage.name);
              const isSelected = activeStage?._id === stage._id;
              const isCurrentlyRunning = runningStageIdx === idx;
              const isPassed = completedStages.includes(idx);

              return (
                <div
                  key={stage._id}
                  onClick={() => setActiveStage(stage)}
                  className={`cursor-pointer p-3.5 rounded-lg border transition-all flex flex-col items-center text-center gap-2 relative ${
                    isCurrentlyRunning
                      ? "bg-amber-950/60 border-amber-400 text-amber-300 scale-105 z-20 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50"
                      : isSelected
                      ? "bg-zinc-900 border-emerald-500 text-emerald-400 shadow-lg scale-105 z-10"
                      : isPassed
                      ? "bg-zinc-950 border-emerald-500/50 text-zinc-300"
                      : "bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {/* Stage Number & Status Badge */}
                  <div className="w-full flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500 font-bold font-nothing">0{idx + 1}</span>
                    {isPassed ? (
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    ) : isCurrentlyRunning ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={`p-2.5 rounded-full transition-colors ${
                      isCurrentlyRunning
                        ? "bg-amber-400 text-black shadow-md shadow-amber-400/30"
                        : isSelected
                        ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/80"
                        : isPassed
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    <Icon size={17} />
                  </div>

                  {/* Stage Name */}
                  <span className="text-[11px] font-bold uppercase tracking-wider line-clamp-2">
                    {stage.name}
                  </span>

                  {/* Stage Duration Chip */}
                  <span className="text-[9px] text-zinc-500 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-zinc-800 font-nothing">
                    {stage.duration || "30s"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Stage Inspector Drawer */}
          {activeStage && (
            <div className="p-5 sm:p-6 rounded-lg bg-zinc-950 border border-zinc-800 space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-400">
                    <Info size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                      STAGE: {activeStage.name}
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-semibold uppercase font-nothing">
                      VERIFIED GITOPS PHASE
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 text-[11px] text-zinc-400">
                    EST. DURATION:{" "}
                    <span className="text-sky-400 font-bold font-nothing">{activeStage.duration || "45s"}</span>
                  </div>
                  <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 text-[11px] text-zinc-400">
                    GATE STATUS:{" "}
                    <span className="text-emerald-400 font-bold font-nothing">100% AUTOMATED PASS</span>
                  </div>
                </div>
              </div>

              {/* Stage Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Description & Gate Policy */}
                <div className="md:col-span-2 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                      ENGINEERING IMPLEMENTATION &amp; SCOPE:
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {activeStage.description ||
                        "Automated gate verifying software quality, compliance, and zero-downtime deployment."}
                    </p>
                  </div>

                  {activeStage.gatePolicy && (
                    <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                        <AlertTriangle size={12} />
                        QUALITY GATE &amp; FAILURE REJECTION POLICY:
                      </span>
                      <p className="text-xs text-zinc-300 font-semibold font-mono">
                        {activeStage.gatePolicy}
                      </p>
                    </div>
                  )}

                  {/* Tooling Chips */}
                  {activeStage.tools && activeStage.tools.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
                        INTEGRATED DEVOPS UTILITIES:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeStage.tools.map((tool, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] font-semibold"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Shell Execution Command Snippet */}
                <div className="space-y-2 bg-[#050505] p-3.5 rounded border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal size={12} className="text-emerald-400" />
                    SHELL EXECUTION LOG:
                  </span>
                  <pre className="text-[11px] text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap select-all">
                    {activeStage.logSnippet ||
                      `$ run-stage ${activeStage.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}\n✓ Gate evaluated: PASS`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Live Pipeline Execution Stream Console */}
          {liveLogs.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#050505] rounded-lg border border-zinc-800/90 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2 text-xs">
                <span className="text-zinc-400 font-bold flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400" />
                  REAL-TIME PIPELINE RUNNER TELEMETRY CONSOLE
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50 font-nothing">
                  {isSimulating ? "● LIVE STREAMING" : "✓ EXECUTION COMPLETED"}
                </span>
              </div>
              <div
                ref={logContainerRef}
                className="max-h-56 overflow-y-auto space-y-1 text-xs text-zinc-300 font-mono scrollbar-thin scroll-smooth"
              >
                {liveLogs.map((log, index) => (
                  <div
                    key={index}
                    className={
                      log.startsWith("✓") || log.startsWith("🚀")
                        ? "text-emerald-400 font-bold"
                        : log.startsWith("[STAGE")
                        ? "text-sky-300 font-semibold pt-1"
                        : log.startsWith("=")
                        ? "text-zinc-600"
                        : "text-zinc-400"
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
