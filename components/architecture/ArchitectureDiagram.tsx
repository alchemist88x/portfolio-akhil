"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Shield,
  Lock,
  Share2,
  Server,
  Box,
  Database,
  Zap,
  Cloud,
  HardDrive,
  Layers,
  Cpu,
  Key,
  Activity,
  Info,
  Play,
  RotateCcw,
} from "lucide-react";

interface NodeData {
  _id: string;
  name: string;
  type: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  tier?: string;
  protocol?: string;
  latency?: string;
  resiliency?: string;
}

interface ConnectionData {
  _id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

interface ArchitectureProps {
  architecture?: {
    name: string;
    title: string;
    description?: string;
  };
  nodes: NodeData[];
  connections: ConnectionData[];
}

// Meta / Facebook Hyper-Scale Architecture Dataset
const metaArchitectureData = {
  name: "Meta / Facebook Scale Distributed Architecture",
  title: "Hyper-Scale Graph & Distributed Microservice Topology",
  description:
    "Production-scale distributed architecture modeling Meta's multi-tier global infrastructure: BGP Anycast edge routing, Proxygen HTTP/3 reverse proxies, GraphQL/Thrift federated gateways, Tupperware container orchestration, TAO social graph caching, Sharded MySQL with RocksDB (MyRocks), Scribe/Kafka event logging, Haystack media blob stores, and real-time Scuba telemetry.",
  nodes: [
    {
      _id: "meta-0",
      name: "GLOBAL ANYCAST EDGE",
      type: "edge",
      tier: "EDGE & INGRESS",
      description: "Global BGP Anycast edge routing directing global internet traffic to nearest Meta edge point of presence (PoP).",
      icon: "Globe",
      sortOrder: 1,
      protocol: "BGP / Anycast DNS",
      latency: "< 5ms",
      resiliency: "Global PoP Failover",
    },
    {
      _id: "meta-1",
      name: "PROXYGEN L7 PROXY",
      type: "edge",
      tier: "EDGE & INGRESS",
      description: "High-performance C++ HTTP/3 and QUIC reverse proxy terminating TLS with Zero-RTT resumption and connection pooling.",
      icon: "Cloud",
      sortOrder: 2,
      protocol: "HTTP/3, QUIC, TLS 1.3",
      latency: "8-18ms",
      resiliency: "Automated L4/L7 Failover",
    },
    {
      _id: "meta-2",
      name: "DDOS & TRAFFIC SCRUBBING",
      type: "security",
      tier: "EDGE & INGRESS",
      description: "Edge layer filtering multi-terabit volumetric DDoS attacks and Layer 7 malicious bot behavior with behavioral machine learning.",
      icon: "Shield",
      sortOrder: 3,
      protocol: "eBPF / XDP Filtering",
      latency: "< 1ms",
      resiliency: "Terabit Scrubbing Capacity",
    },
    {
      _id: "meta-3",
      name: "GRAPHQL / THRIFT GATEWAY",
      type: "network",
      tier: "ROUTING & GATEWAY",
      description: "Federated API aggregator converting client GraphQL queries into internal low-latency Apache Thrift RPC calls.",
      icon: "Share2",
      sortOrder: 4,
      protocol: "GraphQL / Thrift RPC",
      latency: "2-4ms",
      resiliency: "Active-Active Multi-Cluster",
    },
    {
      _id: "meta-4",
      name: "TUPPERWARE CONTAINER MESH",
      type: "compute",
      tier: "COMPUTE & SERVICES",
      description: "Meta's global container management platform running millions of microservice tasks across multi-megawatt data centers.",
      icon: "Layers",
      sortOrder: 5,
      protocol: "Internal mTLS / gRPC",
      latency: "< 1ms inter-service",
      resiliency: "Automated Task Rescheduling",
    },
    {
      _id: "meta-5",
      name: "ASYNC TASK EXECUTION",
      type: "compute",
      tier: "COMPUTE & SERVICES",
      description: "Distributed background compute workers executing feed ranking, notifications, image transforms, and video encoding.",
      icon: "Server",
      sortOrder: 6,
      protocol: "Thrift Worker Pools",
      latency: "10-250ms async",
      resiliency: "At-Least-Once Delivery",
    },
    {
      _id: "meta-6",
      name: "SCRIBE & KAFKA STREAMING",
      type: "queue",
      tier: "EVENT STREAMING",
      description: "Exabyte-scale distributed logging and real-time streaming pipeline processing trillions of telemetry events daily.",
      icon: "Zap",
      sortOrder: 7,
      protocol: "Distributed Stream Log",
      latency: "< 5ms write ingest",
      resiliency: "Multi-Datacenter Replication",
    },
    {
      _id: "meta-7",
      name: "TAO GRAPH CACHE",
      type: "cache",
      tier: "CACHE & MEMORY",
      description: "Geographically distributed read-through cache optimized for social graph data (nodes & associations) backed by Memcached clusters.",
      icon: "Cpu",
      sortOrder: 8,
      protocol: "TAO Wire Protocol",
      latency: "< 0.8ms P99",
      resiliency: "Multi-Region Read Caches",
    },
    {
      _id: "meta-8",
      name: "SHARDED MYSQL (MYROCKS)",
      type: "database",
      tier: "PERSISTENCE & STORAGE",
      description: "Massively sharded MySQL database clusters utilizing RocksDB storage engine for extreme NVMe flash compression and write throughput.",
      icon: "Database",
      sortOrder: 9,
      protocol: "MySQL Native / Raft Consensus",
      latency: "2-6ms P95",
      resiliency: "Cross-DC Raft Replication",
    },
    {
      _id: "meta-9",
      name: "HAYSTACK & F4 BLOB STORE",
      type: "storage",
      tier: "PERSISTENCE & STORAGE",
      description: "Custom object storage architecture specifically engineered for high-concurrency photo and video retrieval with warm-data tiering.",
      icon: "HardDrive",
      sortOrder: 10,
      protocol: "Haystack Custom Store",
      latency: "15-50ms",
      resiliency: "Reed-Solomon Erasure Coding",
    },
    {
      _id: "meta-10",
      name: "SCUBA REAL-TIME TELEMETRY",
      type: "telemetry",
      tier: "OBSERVABILITY",
      description: "In-memory distributed real-time log analysis and SRE debugging engine aggregating billions of metrics per second.",
      icon: "Activity",
      sortOrder: 11,
      protocol: "Scuba Stream Ingest",
      latency: "Sub-second Query Time",
      resiliency: "Highly Distributed In-Memory",
    },
  ],
  connections: [
    { _id: "m-0-1", sourceNodeId: "meta-0", targetNodeId: "meta-1", label: "Anycast BGP" },
    { _id: "m-1-2", sourceNodeId: "meta-1", targetNodeId: "meta-2", label: "L7 Inspection" },
    { _id: "m-2-3", sourceNodeId: "meta-2", targetNodeId: "meta-3", label: "Thrift Ingress" },
    { _id: "m-3-4", sourceNodeId: "meta-3", targetNodeId: "meta-4", label: "Internal RPC" },
    { _id: "m-4-5", sourceNodeId: "meta-4", targetNodeId: "meta-5", label: "Async Tasks" },
    { _id: "m-4-6", sourceNodeId: "meta-4", targetNodeId: "meta-6", label: "Scribe Events" },
    { _id: "m-4-7", sourceNodeId: "meta-4", targetNodeId: "meta-7", label: "Graph Traversal" },
    { _id: "m-7-8", sourceNodeId: "meta-7", targetNodeId: "meta-8", label: "Cache Miss Fallback" },
    { _id: "m-4-9", sourceNodeId: "meta-4", targetNodeId: "meta-9", label: "Media Assets" },
    { _id: "m-4-10", sourceNodeId: "meta-4", targetNodeId: "meta-10", label: "Telemetry Stream" },
  ],
};

export default function ArchitectureDiagram({
  architecture,
  nodes = [],
  connections = [],
}: ArchitectureProps) {
  // Preset Selection: 'aws' or 'meta'
  const [activePreset, setActivePreset] = useState<"aws" | "meta">("aws");
  const [activeTier, setActiveTier] = useState<string>("ALL");

  // Current active data set
  const currentArchTitle =
    activePreset === "aws"
      ? architecture?.title || "AWS Multi-Region High-Availability Enterprise Architecture"
      : metaArchitectureData.title;

  const currentArchDesc =
    activePreset === "aws"
      ? architecture?.description ||
        "Production-grade distributed cloud topology featuring global Anycast edge routing, CloudFront CDN, AWS Shield/WAF security inspection, dual-layer ALB/Envoy API gateways, autoscaling EKS Kubernetes microservices, Kafka event streaming, Redis ElastiCache, Aurora Multi-AZ database clustering, S3 data lake, and centralized Prometheus observability."
      : metaArchitectureData.description;

  const currentNodes: NodeData[] =
    activePreset === "aws"
      ? nodes.length > 0
        ? nodes
        : metaArchitectureData.nodes
      : metaArchitectureData.nodes;

  const currentConnections: ConnectionData[] =
    activePreset === "aws"
      ? connections.length > 0
        ? connections
        : metaArchitectureData.connections
      : metaArchitectureData.connections;

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(currentNodes[0] || null);

  // Live Traffic Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedNode(currentNodes[0] || null);
  }, [activePreset, currentNodes]);

  // Handle Simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      setActiveStepIndex(0);
      let step = 0;
      timer = setInterval(() => {
        step += 1;
        if (step >= currentNodes.length) {
          setIsSimulating(false);
          setActiveStepIndex(null);
        } else {
          setActiveStepIndex(step);
          setSelectedNode(currentNodes[step]);
        }
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isSimulating, currentNodes]);

  const getIcon = (name: string, type: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("globe") || lower.includes("dns") || lower.includes("route 53") || lower.includes("anycast"))
      return Globe;
    if (lower.includes("cloudflare") || lower.includes("shield") || lower.includes("ddos"))
      return Shield;
    if (lower.includes("waf") || lower.includes("security") || lower.includes("envoy") || lower.includes("lock"))
      return Lock;
    if (lower.includes("alb") || lower.includes("gateway") || lower.includes("proxygen") || lower.includes("graphql"))
      return Share2;
    if (lower.includes("eks") || lower.includes("tupperware") || lower.includes("kubernetes") || lower.includes("mesh"))
      return Layers;
    if (lower.includes("lambda") || lower.includes("worker") || lower.includes("ec2") || lower.includes("compute"))
      return Server;
    if (lower.includes("kafka") || lower.includes("scribe") || lower.includes("stream") || lower.includes("event"))
      return Zap;
    if (lower.includes("redis") || lower.includes("tao") || lower.includes("cache") || lower.includes("memcached"))
      return Cpu;
    if (lower.includes("aurora") || lower.includes("mysql") || lower.includes("sql") || lower.includes("database"))
      return Database;
    if (lower.includes("dynamodb") || lower.includes("nosql") || lower.includes("box"))
      return Box;
    if (lower.includes("s3") || lower.includes("haystack") || lower.includes("storage") || lower.includes("blob"))
      return HardDrive;
    if (lower.includes("kms") || lower.includes("secret") || lower.includes("key"))
      return Key;
    if (lower.includes("prometheus") || lower.includes("scuba") || lower.includes("telemetry") || lower.includes("cloudwatch"))
      return Activity;
    return Server;
  };

  const isConnected = (nodeId: string) => {
    if (!hoveredNodeId) return false;
    return currentConnections.some(
      (c) =>
        (c.sourceNodeId === hoveredNodeId && c.targetNodeId === nodeId) ||
        (c.targetNodeId === hoveredNodeId && c.sourceNodeId === nodeId)
    );
  };

  const tiers = [
    "ALL",
    "EDGE & INGRESS",
    "ROUTING & GATEWAY",
    "COMPUTE & SERVICES",
    "EVENT STREAMING",
    "CACHE & MEMORY",
    "PERSISTENCE & STORAGE",
    "OBSERVABILITY",
  ];

  const filteredNodes = currentNodes.filter((n) => {
    if (activeTier === "ALL") return true;
    if (n.tier) return n.tier === activeTier;
    if (activeTier === "EDGE & INGRESS") return n.type === "edge" || n.type === "security";
    if (activeTier === "ROUTING & GATEWAY") return n.type === "network";
    if (activeTier === "COMPUTE & SERVICES") return n.type === "compute";
    if (activeTier === "EVENT STREAMING") return n.type === "queue";
    if (activeTier === "CACHE & MEMORY") return n.type === "cache";
    if (activeTier === "PERSISTENCE & STORAGE") return n.type === "database" || n.type === "storage";
    if (activeTier === "OBSERVABILITY") return n.type === "telemetry";
    return true;
  });

  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/40 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 font-bold font-nothing">06</span>
            <span className="text-zinc-600">/</span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 uppercase">
              INFRASTRUCTURE ARCHITECTURE
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-nothing">
            ENTERPRISE DISTRIBUTED SYSTEMS TOPOLOGY
          </span>
        </div>

        {/* Architecture Mode Toggle & Simulation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActivePreset("aws");
                setIsSimulating(false);
              }}
              className={`px-4 py-2 rounded text-xs font-bold tracking-wider transition-all uppercase flex items-center gap-2 border ${
                activePreset === "aws"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/60 shadow-lg shadow-emerald-950/30"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Cloud size={14} className="text-sky-400" />
              <span className="font-nothing tracking-wider">AWS ENTERPRISE MULTI-REGION</span>
            </button>

            <button
              onClick={() => {
                setActivePreset("meta");
                setIsSimulating(false);
              }}
              className={`px-4 py-2 rounded text-xs font-bold tracking-wider transition-all uppercase flex items-center gap-2 border ${
                activePreset === "meta"
                  ? "bg-sky-500/10 text-sky-400 border-sky-500/60 shadow-lg shadow-sky-950/30"
                  : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Layers size={14} className="text-emerald-400" />
              <span className="font-nothing tracking-wider">META / FACEBOOK HYPER-SCALE</span>
            </button>
          </div>

          {/* Traffic Simulator Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2 rounded text-xs font-bold tracking-wider transition-all flex items-center gap-2 border ${
                isSimulating
                  ? "bg-amber-500/20 text-amber-300 border-amber-500 animate-pulse"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white"
              }`}
            >
              {isSimulating ? (
                <>
                  <RotateCcw size={13} className="animate-spin" />
                  <span className="font-nothing tracking-wider">SIMULATING PACKET TRAVERSAL...</span>
                </>
              ) : (
                <>
                  <Play size={13} className="fill-emerald-400 text-emerald-400" />
                  <span className="font-nothing tracking-wider">SIMULATE LIVE REQUEST TRAFFIC</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live System Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-zinc-950 border border-zinc-800/90 rounded-lg text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">GLOBAL THROUGHPUT</span>
            <span className="text-emerald-400 font-bold text-sm font-nothing">
              {activePreset === "aws" ? "142,500 REQ/SEC" : "2,450,000 REQ/SEC"}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">EDGE P95 LATENCY</span>
            <span className="text-sky-400 font-bold text-sm font-nothing">
              {activePreset === "aws" ? "14.2 MS" : "8.6 MS"}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">CACHE HIT RATIO</span>
            <span className="text-amber-400 font-bold text-sm font-nothing">
              {activePreset === "aws" ? "96.4%" : "98.7%"}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">FAILOVER RTO</span>
            <span className="text-emerald-400 font-bold text-sm font-nothing">
              {activePreset === "aws" ? "< 30 SECONDS" : "< 5 SECONDS"}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 space-y-0.5">
            <span className="text-[10px] text-zinc-500 block font-nothing">AVAILABILITY SLA</span>
            <span className="text-zinc-200 font-bold text-sm flex items-center gap-1.5 font-nothing">
              <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
              99.999% SLA
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-zinc-100 uppercase tracking-tight">
            {currentArchTitle}
          </h3>
          <p className="text-xs text-zinc-400 max-w-4xl leading-relaxed">
            {currentArchDesc}
          </p>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-900 text-xs">
          <span className="text-[10px] text-zinc-500 uppercase mr-1 font-nothing">FILTER TIER:</span>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors uppercase font-nothing ${
                activeTier === tier
                  ? "bg-zinc-100 text-zinc-950"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Interactive Topology Graph Container */}
        <div className="p-6 sm:p-8 bg-[#070707] border border-zinc-800 rounded-lg space-y-8 relative overflow-hidden">
          {/* Header Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 border-b border-zinc-900 pb-3">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
              TOPOLOGY GRAPH · CLICK OR HOVER NODE TO INSPECT ACTIVE PROTOCOLS &amp; DATAFLOWS
            </span>
            <span className="text-emerald-400 font-bold text-[11px] font-nothing">
              DATA FLOW: INGRESS ──► GATEWAY ──► WORKLOAD ──► STORAGE
            </span>
          </div>

          {/* Node Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 relative">
            {filteredNodes.map((node, index) => {
              const Icon = getIcon(node.name, node.type);
              const isHovered = hoveredNodeId === node._id;
              const isLinked = isConnected(node._id);
              const isCurrentSelected = selectedNode?._id === node._id;
              const isSimActive =
                activeStepIndex !== null && currentNodes[activeStepIndex]?._id === node._id;

              return (
                <div
                  key={node._id}
                  onMouseEnter={() => {
                    setHoveredNodeId(node._id);
                    setSelectedNode(node);
                  }}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setSelectedNode(node)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all flex flex-col items-center text-center gap-2 relative ${
                    isSimActive
                      ? "bg-amber-950/60 border-amber-400 scale-105 z-30 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/50"
                      : isHovered || isCurrentSelected
                      ? "bg-zinc-900 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-105 z-20"
                      : isLinked
                      ? "bg-zinc-900/90 border-sky-500 scale-100 z-10"
                      : "bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700"
                  }`}
                >
                  {/* Step Indicator */}
                  <div className="w-full flex items-center justify-between text-[10px] text-zinc-600 font-bold">
                    <span className="font-nothing">0{index + 1}</span>
                    {node.latency && (
                      <span className="text-[9px] text-emerald-400/80 font-nothing">{node.latency}</span>
                    )}
                  </div>

                  {/* Icon */}
                  <div
                    className={`p-3 rounded-full transition-colors ${
                      isSimActive
                        ? "bg-amber-400 text-black shadow-md shadow-amber-400/40"
                        : isHovered || isCurrentSelected
                        ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/80"
                        : isLinked
                        ? "bg-sky-950/70 text-sky-400 border border-sky-800/80"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Node Name */}
                  <span className="text-xs font-bold text-zinc-100 tracking-wider line-clamp-2">
                    {node.name}
                  </span>

                  {/* Node Type Badge */}
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/60 font-nothing">
                    {node.type}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Deep Node Inspector Drawer */}
          {selectedNode && (
            <div className="p-5 sm:p-6 rounded-lg bg-zinc-950 border border-zinc-800 space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-400">
                    <Info size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                      {selectedNode.name}
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-semibold uppercase font-nothing">
                      {selectedNode.tier || selectedNode.type}
                    </span>
                  </div>
                </div>

                {/* Connection Count */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 text-[11px] text-zinc-400 font-nothing">
                    PROTOCOL:{" "}
                    <span className="text-sky-400 font-bold">
                      {selectedNode.protocol || "HTTPS / TLS 1.3"}
                    </span>
                  </div>
                  <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 text-[11px] text-zinc-400 font-nothing">
                    RESILIENCY:{" "}
                    <span className="text-emerald-400 font-bold">
                      {selectedNode.resiliency || "Multi-AZ Active-Active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-nothing">
                    PRODUCTION ARCHITECTURE ROLE &amp; SPECS:
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {selectedNode.description ||
                      "Critical production infrastructure component designed to ensure low-latency delivery, zero-downtime failover, and extreme horizontal scalability."}
                  </p>
                </div>

                {/* Connected Flow Paths */}
                <div className="space-y-2 bg-zinc-900/60 p-3 rounded border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-nothing">
                    CONNECTED DATA FLOWS:
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {currentConnections
                      .filter(
                        (c) =>
                          c.sourceNodeId === selectedNode._id ||
                          c.targetNodeId === selectedNode._id
                      )
                      .slice(0, 3)
                      .map((conn) => (
                        <div
                          key={conn._id}
                          className="flex items-center gap-1.5 text-zinc-300 text-[11px]"
                        >
                          <span className="text-emerald-400">▸</span>
                          <span className="text-zinc-400">{conn.label || "Direct Data Link"}</span>
                        </div>
                      ))}
                    {currentConnections.filter(
                      (c) =>
                        c.sourceNodeId === selectedNode._id ||
                        c.targetNodeId === selectedNode._id
                    ).length === 0 && (
                      <span className="text-zinc-500 text-[11px]">Primary Ingress Origin</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
