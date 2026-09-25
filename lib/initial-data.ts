export const defaultSiteSettings = {
  name: "Akhil",
  fullName: "Akhil K Anil",
  title: "DevOps Engineer & Cloud Infrastructure Engineer",
  altTitle: "System Engineer",
  experienceYears: "10+ Years",
  location: "Kochi, Kerala, India",
  contactEmail: "akhilkanil99@gmail.com",
  heroLabel: "SYSTEM / 001",
  heroHeadline: "10 years of building infrastructure that keeps applications alive.",
  heroDescription:
    "DevOps and Cloud Engineer focused on cloud infrastructure, automation, Linux systems, CI/CD, security, monitoring and production environments.",
  primaryCtaText: "VIEW WORK →",
  primaryCtaLink: "#work",
  secondaryCtaText: "CONTACT →",
  secondaryCtaLink: "#contact",
  systemStatusLabel: "ONLINE",
  statusInfrastructure: "Operational",
  statusAutomation: "Active",
  statusMonitoring: "Active",
  statusDeployment: "Ready",
  technicalTypographyEnabled: true,
  technicalDotPatternEnabled: true,
  technicalMetadataEnabled: true,
  technicalDecorationsEnabled: true,
};

export const defaultAboutSection = {
  title: "Behind the infrastructure",
  statementHeadline: "Infrastructure is invisible when it works.",
  statementSubheadline: "My job is to make sure it keeps working.",
  paragraphs: [
    "I'm Akhil, a DevOps and Cloud Infrastructure Engineer with 10+ years of experience working with servers, cloud platforms, automation and production systems.",
    "I enjoy turning complicated infrastructure into systems that are predictable, automated and easier to operate.",
    "My work sits between application development and infrastructure — making sure software doesn't just work during development, but continues working reliably in production.",
  ],
};

export const defaultExperiences = [
  {
    company: "Varvy Innovations Pvt. Ltd.",
    website: "https://varvyinnovations.com/",
    role: "System Engineer / DevOps Engineer",
    startDate: "2026-08",
    endDate: "",
    current: true,
    employmentType: "Full-time",
    description:
      "Lead systems engineering and DevOps operations across cloud platforms, specializing in Generative AI model deployment infrastructure, real-time gaming backends, and crypto/Web3 node networks. Architect high-availability Linux clusters, GPU-accelerated compute pipelines, automated CI/CD releases, and end-to-end cloud security.",
    responsibilities: [
      "Architect and maintain high-throughput cloud infrastructure for Generative AI models, LLM inference pipelines, and AI agent workloads.",
      "Orchestrate GPU-accelerated compute clusters (Kubernetes, Docker) for AI model serving, model evaluation, and low-latency API delivery.",
      "Design and deploy resilient, scalable backend infrastructure for real-time multiplayer gaming services and high-concurrency player sessions.",
      "Manage and secure decentralized crypto / Web3 validator nodes, blockchain RPC infrastructure, and cold/hot wallet network security.",
      "Implement automated GitOps and multi-environment CI/CD deployment pipelines ensuring zero-downtime rolling updates.",
      "Enforce infrastructure-wide cloud security, access control policies, WAF protection, and proactive 24/7 observability.",
    ],
    technologies: [
      "AWS",
      "Linux",
      "DevOps",
      "Docker",
      "Kubernetes",
      "Gen AI",
      "LLM Infrastructure",
      "PyTorch Inference",
      "GPU Orchestration",
      "Gaming Infrastructure",
      "Web3 / Crypto Nodes",
      "CI/CD",
      "Terraform",
      "Prometheus",
      "Automation",
    ],
    location: "Kochi, Kerala, India",
    sortOrder: 0,
    published: true,
  },
  {
    company: "Iroid Technologies",
    role: "DevOps / System Administrator",
    startDate: "2021-07-11",
    endDate: "2026-07",
    current: false,
    description:
      "Develop and oversee all aspects of a complex system to solve a problem, from initial creation of the system to production and management through the end product or solution.",
    responsibilities: [
      "Develop and oversee all aspects of complex production systems from architecture through production operations.",
      "Provision and manage high-availability cloud infrastructure across AWS and Azure environments.",
      "Implement GitOps and automated CI/CD pipelines to streamline deployment velocity across services.",
      "Deploy, orchestrate and maintain containerized workloads using Docker and Kubernetes clusters.",
      "Maintain multi-layer cloud security, firewalls, compliance controls, and comprehensive logging/monitoring.",
    ],
    technologies: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Terraform",
      "CloudFormation",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "Travis CI",
      "GitOps",
      "ELK Stack",
      "Prometheus",
      "VPC",
      "VPN",
      "Load Balancers",
      "WAF",
      "Azure Security",
      "SonicWall",
      "Sophos",
      "Cisco",
      "AWS Cloud Security",
      "RDS",
      "DynamoDB",
      "SQL Server",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Oracle",
      "EC2",
      "ECS",
      "Lambda",
      "Secret Manager",
      "AWS Signature",
      "CloudWatch",
      "S3",
      "Certificate Manager",
      "Azure Virtual Machines",
      "Azure SQL Database",
      "Azure Functions",
      "CosmosDB",
      "Azure DevOps",
      "App Service",
      "Azure AD",
      "Key Vault",
      "Azure Arc",
    ],
    location: "Kochi, Kerala, India",
    sortOrder: 1,
    published: true,
  },
  {
    company: "a2solutions",
    role: "Server/System Administrator",
    startDate: "2018-05-22",
    endDate: "2021-06-17",
    current: false,
    description:
      "Administered Linux servers, cloud infrastructure, automated deployments, and hardware/network operations across client solutions.",
    responsibilities: [
      "Troubleshoot and repair desktops and laptops.",
      "Configure and backup operating systems.",
      "Handle WHM and cPanel, including managing and troubleshooting tasks.",
      "Create and configure cloud servers on AWS.",
      "Troubleshoot and resolve issues related to cloud servers on AWS.",
      "Utilize AWS services such as EC2, S3 and RDS to support various projects.",
      "Familiar with DevOps tools including Jenkins, GitLab CI/CD, Ansible, Docker and Kubernetes.",
      "Implement and manage CI/CD pipelines for automated deployments.",
      "Use Terraform to provision and manage infrastructure as code.",
    ],
    technologies: [
      "AWS",
      "EC2",
      "S3",
      "RDS",
      "Terraform",
      "Ansible",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitLab CI/CD",
      "WHM/cPanel",
      "Linux",
    ],
    location: "Kochi, Kerala, India",
    sortOrder: 2,
    published: true,
  },
];

export const defaultSkillCategories = [
  {
    name: "CLOUD PLATFORMS",
    slug: "cloud-platforms",
    description: "Multi-cloud architecture, migration, and infrastructure management",
    icon: "Cloud",
    sortOrder: 1,
    published: true,
    skills: ["AWS", "Azure", "Google Cloud"],
  },
  {
    name: "INFRASTRUCTURE AS CODE",
    slug: "infrastructure-as-code",
    description: "Declarative infrastructure provisioning and configuration management",
    icon: "Code",
    sortOrder: 2,
    published: true,
    skills: ["Terraform", "CloudFormation", "Ansible"],
  },
  {
    name: "CONTAINERIZATION & ORCHESTRATION",
    slug: "containerization-orchestration",
    description: "Microservice packaging, scheduling, and lifecycle management",
    icon: "Layers",
    sortOrder: 3,
    published: true,
    skills: ["Docker", "Kubernetes"],
  },
  {
    name: "CI/CD",
    slug: "ci-cd",
    description: "Continuous integration, deployment automation, and GitOps workflows",
    icon: "GitBranch",
    sortOrder: 4,
    published: true,
    skills: ["Jenkins", "Travis CI", "GitLab CI/CD", "GitHub Actions", "GitOps"],
  },
  {
    name: "MONITORING & LOGGING",
    slug: "monitoring-logging",
    description: "Centralized observability, metric gathering, alerting, and telemetry",
    icon: "Activity",
    sortOrder: 5,
    published: true,
    skills: ["ELK Stack", "Prometheus", "Grafana", "Grafana Cloud", "Grafana Alloy", "CloudWatch"],
  },
  {
    name: "NETWORKING",
    slug: "networking",
    description: "Virtual networks, secure interconnects, traffic balancing, and DNS",
    icon: "Network",
    sortOrder: 6,
    published: true,
    skills: ["VPC", "VPN", "Load Balancers"],
  },
  {
    name: "SECURITY",
    slug: "security",
    description: "Application firewalling, cloud hardening, identity, and network defense",
    icon: "Shield",
    sortOrder: 7,
    published: true,
    skills: ["WAF", "Azure Security", "SonicWall", "Sophos", "Cisco", "AWS Cloud Security"],
  },
  {
    name: "DATABASES",
    slug: "databases",
    description: "Relational, NoSQL, and high-availability database administration",
    icon: "Database",
    sortOrder: 8,
    published: true,
    skills: ["RDS", "DynamoDB", "SQL Server", "MongoDB", "PostgreSQL", "MySQL", "Oracle"],
  },
  {
    name: "AWS SERVICES",
    slug: "aws-services",
    description: "Amazon Web Services compute, storage, serverless, and identity services",
    icon: "Server",
    sortOrder: 9,
    published: true,
    skills: [
      "EC2",
      "ECS",
      "Lambda",
      "Secret Manager",
      "AWS Signature",
      "CloudWatch",
      "S3",
      "Certificate Manager",
    ],
  },
  {
    name: "AZURE",
    slug: "azure",
    description: "Microsoft Azure enterprise compute, hybrid cloud, and management services",
    icon: "Cpu",
    sortOrder: 10,
    published: true,
    skills: [
      "Virtual Machines",
      "SQL Database",
      "Functions",
      "CosmosDB",
      "DevOps",
      "App Service",
      "Azure AD",
      "Key Vault",
      "Azure Arc",
    ],
  },
];

export const defaultProjects = [
  {
    name: "AlphaUniverse",
    slug: "alphauniverse",
    category: "Cloud Infrastructure",
    projectType: "Web Application / Platform",
    environment: "Production",
    frontend: "AWS Amplify",
    backend: "Amazon EC2",
    webServer: "Apache2",
    description:
      "Production web application and platform infrastructure engineered with AWS Amplify frontend hosting, Amazon EC2 compute instances, and Apache2 web servers handling live high-concurrency traffic.",
    cloudPlatforms: ["AWS"],
    awsServices: [
      "Amplify",
      "EC2",
      "CloudWatch",
      "Certificate Manager",
    ],
    azureServices: [],
    databases: [],
    cicdTools: ["AWS Amplify Console"],
    technologies: [
      "AWS Amplify",
      "Amazon EC2",
      "Apache2",
      "Linux",
      "SSL/TLS",
      "REST API",
    ],
    responsibilities: [
      "Configured and maintained AWS Amplify frontend hosting with automated continuous deployment and global CDN distribution.",
      "Provisioned, configured, and hardened Amazon EC2 backend Linux servers running Apache2 web server.",
      "Architected secure API routing and reverse proxy rules connecting the Amplify frontend to backend application endpoints.",
      "Configured custom domains, SSL/TLS certificates, and DNS records for www.alphauniverse-mea.com.",
      "Monitored server health, Apache request logs, CPU/Memory telemetry, and system uptime in production.",
    ],
    architectureDiagram: `                    INTERNET
                       │
                       ▼
          www.alphauniverse-mea.com
                       │
                       ▼
                 AWS AMPLIFY
                       │
                       │ API Requests
                       ▼
                 BACKEND / API
                       │
                       ▼
                 AMAZON EC2
                       │
                       ▼
                    APACHE2
                       │
                       ▼
              BACKEND APPLICATION`,
    githubUrl: "",
    liveUrl: "https://www.alphauniverse-mea.com",
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    name: "SVADHAN",
    slug: "svadhan",
    category: "Cloud Infrastructure",
    projectType: "Java Based Web Mobile Application",
    environment: "Production",
    frontend: "Web & Mobile App",
    backend: "AWS ECS Containers",
    webServer: "Application Gateway",
    description:
      "Enterprise cloud infrastructure provisioning, WAF security architecture, and high-availability ECS container configuration for a Java-based web and mobile financial platform on AWS.",
    cloudPlatforms: ["AWS"],
    awsServices: [
      "ECS",
      "WAF",
      "S3",
      "Secret Manager",
      "Application Gateway",
      "CloudWatch",
      "Amplify",
      "CloudFront",
    ],
    azureServices: [],
    databases: ["Oracle DB"],
    cicdTools: ["Terraform"],
    technologies: ["Java", "Docker", "AWS ECS", "Oracle DB", "Terraform", "CloudFront"],
    responsibilities: [
      "Architected secure AWS infrastructure utilizing Amazon ECS for container orchestration.",
      "Configured AWS WAF rules and CloudFront distribution for low-latency, edge-protected traffic.",
      "Administered Oracle DB database instance with automated backup strategies and disaster recovery.",
      "Integrated AWS Secrets Manager and Application Gateway for secure API management.",
    ],
    githubUrl: "",
    liveUrl: "",
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    name: "Easy Store",
    slug: "easy-store",
    category: "E-Commerce Infrastructure",
    projectType: "PHP Based Website / Admin Panel / Mobile Apps",
    description:
      "Multi-tier scalable infrastructure on AWS for an e-commerce platform with automated GitLab CI pipelines, MySQL Aurora clustering, and SNS event notifications.",
    cloudPlatforms: ["AWS"],
    awsServices: [
      "EC2",
      "WAF",
      "S3",
      "Secret Manager",
      "Application Gateway",
      "CloudWatch",
      "Amplify",
      "CloudFront",
      "Load Balancer",
      "SNS",
    ],
    azureServices: [],
    databases: ["MySQL Aurora"],
    cicdTools: ["GitLab CI"],
    technologies: ["PHP", "AWS EC2", "MySQL Aurora", "Application Load Balancer", "GitLab CI", "SNS"],
    responsibilities: [
      "Provisioned EC2 autoscaling pools behind Application Load Balancers for peak commerce traffic.",
      "Deployed MySQL Aurora database clusters with read replicas for high-throughput transactional queries.",
      "Built automated deployment pipelines via GitLab CI to stage and production environments.",
      "Configured Amazon SNS notifications and CloudWatch alert thresholds for real-time monitoring.",
    ],
    githubUrl: "",
    liveUrl: "",
    featured: true,
    published: true,
    sortOrder: 3,
  },
  {
    name: "Dent Care",
    slug: "dent-care",
    category: "Healthcare Infrastructure",
    projectType: "Healthcare Management Platform",
    description:
      "Secure AWS infrastructure with automated GitHub Actions CI/CD workflows, encrypted storage, and high-availability MySQL Aurora databases for healthcare operations.",
    cloudPlatforms: ["AWS"],
    awsServices: [
      "EC2",
      "WAF",
      "S3",
      "Secret Manager",
      "Application Gateway",
      "CloudWatch",
      "Amplify",
      "CloudFront",
      "Load Balancer",
      "SNS",
    ],
    azureServices: [],
    databases: ["MySQL Aurora"],
    cicdTools: ["GitHub Actions"],
    technologies: ["AWS EC2", "MySQL Aurora", "GitHub Actions", "WAF", "CloudFront"],
    responsibilities: [
      "Enforced compliance and security benchmarks across AWS VPC and EC2 environments.",
      "Automated continuous integration and release delivery with GitHub Actions.",
      "Configured S3 lifecycle policies and encryption at rest for patient records and asset storage.",
    ],
    githubUrl: "",
    liveUrl: "",
    featured: true,
    published: true,
    sortOrder: 4,
  },
  {
    name: "BBT",
    slug: "bbt",
    category: "Enterprise Retail",
    projectType: "PHP & Magento Based Admin Panel / Mobile Apps / Website",
    description:
      "Hybrid cloud setup spanning AWS and Cloudways with GitHub Actions and GitLab CI, managing Magento storefronts and mobile application backends.",
    cloudPlatforms: ["AWS", "Cloudways"],
    awsServices: [
      "EC2",
      "WAF",
      "S3",
      "Secret Manager",
      "Application Gateway",
      "CloudWatch",
      "Amplify",
      "CloudFront",
      "Load Balancer",
      "SNS",
    ],
    azureServices: [],
    databases: ["MySQL Aurora"],
    cicdTools: ["GitHub Actions", "GitLab CI"],
    technologies: ["Magento", "PHP", "AWS EC2", "Cloudways", "MySQL Aurora", "WAF"],
    responsibilities: [
      "Integrated hybrid hosting between AWS services and Cloudways managed infrastructure.",
      "Optimized Magento caching layers, CDN distribution, and media asset delivery via S3.",
      "Maintained dual deployment pipelines utilizing both GitHub Actions and GitLab CI.",
    ],
    githubUrl: "",
    liveUrl: "",
    featured: true,
    published: true,
    sortOrder: 5,
  },
  {
    name: "Bazar One",
    slug: "bazar-one",
    category: "Marketplace Operations",
    projectType: "PHP Based Admin Panel / Mobile Apps",
    description:
      "Marketplace cloud infrastructure and automated delivery pipeline for administrative controls and mobile application APIs.",
    cloudPlatforms: ["AWS"],
    awsServices: ["EC2", "S3", "CloudWatch"],
    azureServices: [],
    databases: ["MySQL Aurora"],
    cicdTools: ["GitHub Actions"],
    technologies: ["PHP", "AWS", "MySQL Aurora", "GitHub Actions"],
    responsibilities: [
      "Deployed and configured AWS servers and Aurora database instances.",
      "Established automated build and deployment pipelines using GitHub Actions.",
    ],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    published: true,
    sortOrder: 6,
  },
  {
    name: "Alba Clothing",
    slug: "alba-clothing",
    category: "Apparel & Retail",
    projectType: "Web Platform & Infrastructure",
    description:
      "Cloud infrastructure and production operations supporting web platform reliability and domain management.",
    cloudPlatforms: ["AWS"],
    awsServices: ["EC2", "S3"],
    azureServices: [],
    databases: [],
    cicdTools: [],
    technologies: ["AWS", "Linux"],
    responsibilities: [
      "Configured cloud servers and DNS routing for web applications.",
    ],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    published: true,
    sortOrder: 7,
  },
];

export const defaultArchitecture = {
  name: "AWS Enterprise Cloud Infrastructure",
  title: "Multi-Region High-Availability Enterprise Architecture",
  description:
    "Production-grade distributed cloud topology featuring global Anycast edge routing, CloudFront CDN, AWS Shield/WAF security inspection, dual-layer ALB/Envoy API gateways, autoscaling EKS Kubernetes microservices, Kafka event streaming, Redis ElastiCache, Aurora Multi-AZ database clustering, S3 data lake, and centralized Prometheus observability.",
  published: true,
  nodes: [
    { name: "ROUTE 53 / ANYCAST DNS", type: "edge", description: "Global Anycast DNS routing with latency-based and geo-proximity failover policies across international points of presence.", icon: "Globe", x: 60, y: 150, sortOrder: 1 },
    { name: "CLOUDFRONT CDN", type: "edge", description: "Global edge caching network terminating TLS with HTTP/3 support and accelerating dynamic API requests.", icon: "Cloud", x: 180, y: 150, sortOrder: 2 },
    { name: "AWS SHIELD & WAF", type: "security", description: "Layer 3/4 automated DDoS mitigation and Layer 7 Web Application Firewall inspecting SQL injection, XSS, and rate limits.", icon: "Shield", x: 300, y: 150, sortOrder: 3 },
    { name: "ALB / NLB INGRESS", type: "network", description: "High-throughput redundant load balancing tier with SSL offloading, target health checks, and path-based routing.", icon: "Share2", x: 420, y: 150, sortOrder: 4 },
    { name: "ENVOY API GATEWAY", type: "network", description: "Service mesh ingress gateway handling JWT token validation, mTLS enforcement, rate limiting, and canary routing.", icon: "Lock", x: 540, y: 150, sortOrder: 5 },
    { name: "EKS KUBERNETES MESH", type: "compute", description: "Autoscaling container clusters across 3 Availability Zones running microservices with horizontal pod autoscalers (HPA).", icon: "Layers", x: 660, y: 150, sortOrder: 6 },
    { name: "LAMBDA WORKERS", type: "compute", description: "Event-driven serverless compute executing async tasks, webhook processing, and background document pipelines.", icon: "Server", x: 660, y: 240, sortOrder: 7 },
    { name: "APACHE KAFKA / EVENTBRIDGE", type: "queue", description: "High-throughput distributed event streaming bus with partition replicas and consumer group offsets for decoupling services.", icon: "Zap", x: 780, y: 150, sortOrder: 8 },
    { name: "REDIS ELASTICACHE", type: "cache", description: "In-memory multi-node Redis cluster with sub-millisecond read times, automated failover, and session state persistence.", icon: "Cpu", x: 900, y: 90, sortOrder: 9 },
    { name: "AURORA MULTI-AZ DB", type: "database", description: "PostgreSQL/MySQL compatible relational database engine with automated storage replication across 3 AZs and read replicas.", icon: "Database", x: 900, y: 180, sortOrder: 10 },
    { name: "DYNAMODB NOSQL", type: "database", description: "Fully managed, serverless, key-value NoSQL database delivering single-digit millisecond latency at any scale.", icon: "Box", x: 900, y: 270, sortOrder: 11 },
    { name: "S3 SECURE DATA LAKE", type: "storage", description: "Object storage with 99.999999999% (11 9's) durability, KMS client-side encryption, and intelligent tiering policies.", icon: "HardDrive", x: 1020, y: 90, sortOrder: 12 },
    { name: "AWS KMS & SECRETS", type: "security", description: "Hardware security modules managing cryptographic envelope encryption and automated database credential rotation.", icon: "Key", x: 1020, y: 180, sortOrder: 13 },
    { name: "PROMETHEUS & SRE SENSORS", type: "telemetry", description: "Centralized observability pipeline collecting OpenTelemetry traces, Prometheus metrics, and automated alert paging.", icon: "Activity", x: 1020, y: 270, sortOrder: 14 },
  ],
  connections: [
    { sourceIndex: 0, targetIndex: 1, label: "Anycast Ingress" },
    { sourceIndex: 1, targetIndex: 2, label: "Edge Security" },
    { sourceIndex: 2, targetIndex: 3, label: "Filtered HTTP/S" },
    { sourceIndex: 3, targetIndex: 4, label: "Reverse Proxy" },
    { sourceIndex: 4, targetIndex: 5, label: "mTLS Pod Traffic" },
    { sourceIndex: 4, targetIndex: 6, label: "Async Triggers" },
    { sourceIndex: 5, targetIndex: 7, label: "Domain Events" },
    { sourceIndex: 5, targetIndex: 8, label: "Sub-ms Query" },
    { sourceIndex: 5, targetIndex: 9, label: "ACID Transactions" },
    { sourceIndex: 5, targetIndex: 10, label: "Key-Value State" },
    { sourceIndex: 6, targetIndex: 11, label: "Blob Write" },
    { sourceIndex: 5, targetIndex: 12, label: "Key Decryption" },
    { sourceIndex: 5, targetIndex: 13, label: "OTel Traces" },
  ],
};

export const defaultPipeline = {
  name: "Enterprise GitOps & SecDevOps CI/CD Lifecycle",
  description:
    "Zero-trust continuous integration and progressive delivery pipeline featuring shift-left secret detection, static code analysis (SAST), automated vulnerability scanning (SCA), cryptographic container image signing, infrastructure-as-code policy compliance, and automated canary rollouts with instant error-rate rollbacks.",
  published: true,
  stages: [
    { name: "CODE & PRE-COMMIT", description: "Linting, strict TypeScript checks, and pre-commit secret detection preventing credential leaks into Git history.", icon: "Code", sortOrder: 1 },
    { name: "PULL REQUEST & REVIEW", description: "Protected branch enforcement, automated reviewer assignment, linear Git history, and semantic commit verification.", icon: "GitPullRequest", sortOrder: 2 },
    { name: "SAST & QUALITY GATE", description: "Deep static application security testing (SonarQube & Semgrep) enforcing zero critical hotspots and >85% code coverage.", icon: "CheckCircle", sortOrder: 3 },
    { name: "CONTAINERIZED TESTS", description: "High-concurrency unit and integration test suites using ephemeral Docker containers with mock cloud endpoints.", icon: "Hammer", sortOrder: 4 },
    { name: "SCA & CVE AUDIT", description: "Software composition analysis and base image vulnerability auditing using Trivy and Snyk to block unpatched packages.", icon: "Shield", sortOrder: 5 },
    { name: "BUILD & COSIGN SIGNING", description: "Multi-stage minimal distroless Docker compilation and cryptographic container signing using Sigstore/Cosign for supply-chain provenance.", icon: "Package", sortOrder: 6 },
    { name: "IAC PLAN & POLICIES", description: "Declarative Terraform validation, CIS AWS Benchmark compliance scanning via Checkov, and monthly cloud cost estimation via Infracost.", icon: "Cloud", sortOrder: 7 },
    { name: "GITOPS ARGO CD SYNC", description: "Declarative GitOps reconciliation syncing desired repository state directly to EKS Kubernetes clusters via ArgoCD controllers.", icon: "Layers", sortOrder: 8 },
    { name: "PROGRESSIVE CANARY", description: "Automated canary deployment using Argo Rollouts (10% -> 50% -> 100%) with real-time error-rate baselining and auto-rollback.", icon: "Rocket", sortOrder: 9 },
    { name: "SRE TELEMETRY & APM", description: "Automated post-deployment synthetic verification, Prometheus SLO validation, and alert notification to Slack and PagerDuty.", icon: "Activity", sortOrder: 10 },
  ],
};

export const defaultEngineeringPrinciples = [
  {
    number: "01",
    title: "AUTOMATE THE REPEATABLE",
    description: "If an operational task must be performed more than once, it belongs in code, Terraform, or an automated pipeline.",
    sortOrder: 1,
    published: true,
  },
  {
    number: "02",
    title: "OBSERVE EVERYTHING",
    description: "Systems without telemetry are blind spots. Metrics, centralized logs, and actionable alerts must precede production deployment.",
    sortOrder: 2,
    published: true,
  },
  {
    number: "03",
    title: "KEEP IT BORING",
    description: "Reliability beats novelty. Battle-tested primitives, proven architectures, and predictable failure modes ensure continuous uptime.",
    sortOrder: 3,
    published: true,
  },
  {
    number: "04",
    title: "SECURITY BY DEFAULT",
    description: "Least privilege access, zero-trust network policies, automated secrets rotation, and encryption in-transit and at-rest.",
    sortOrder: 4,
    published: true,
  },
];

export const defaultHobbies = [
  {
    name: "Building Hackintosh Machines",
    description: "Architecting custom hardware configurations, patching ACPI tables, and fine-tuning OpenCore bootloaders to run macOS natively on x86 hardware.",
    icon: "Cpu",
    sortOrder: 1,
    published: true,
  },
  {
    name: "Working with Arduino",
    description: "Designing embedded circuits, micro-controller firmware, telemetry sensors, and IoT automation projects with low-level C++.",
    icon: "Radio",
    sortOrder: 2,
    published: true,
  },
];

export const defaultSocialLinks = [
  { platform: "GitHub", label: "github.com/akhil", url: "https://github.com", icon: "Github", sortOrder: 1, published: true },
  { platform: "LinkedIn", label: "linkedin.com/in/akhil", url: "https://linkedin.com", icon: "Linkedin", sortOrder: 2, published: true },
  { platform: "Email", label: "akhilkanil99@gmail.com", url: "mailto:akhilkanil99@gmail.com", icon: "Mail", sortOrder: 3, published: true },
];

export const defaultNavigationItems = [
  { label: "WORK", sectionId: "work", sortOrder: 1, published: true },
  { label: "STACK", sectionId: "stack", sortOrder: 2, published: true },
  { label: "EXPERIENCE", sectionId: "experience", sortOrder: 3, published: true },
  { label: "BLOG", sectionId: "blog", sortOrder: 4, published: true },
  { label: "ABOUT", sectionId: "about", sortOrder: 5, published: true },
  { label: "CONTACT", sectionId: "contact", sortOrder: 6, published: true },
];

export const defaultTerminalCommands = [
  {
    command: "help",
    description: "List available terminal commands",
    output: `AVAILABLE COMMANDS:
  help        - Display this command manual
  whoami      - Print engineer identity and credentials
  status      - Inspect personal system status
  about       - Display background and engineering philosophy
  skills      - Query verified technical skill matrix
  stack       - Overview of cloud and automation stacks
  projects    - List production projects and infrastructure case studies
  experience  - View timeline of professional roles
  contact     - Display communication channels and direct reachability
  clear       - Clear the terminal screen`,
    sortOrder: 1,
    published: true,
  },
  {
    command: "whoami",
    description: "Print technical profile metadata",
    output: "", // Dynamically generated if blank
    sortOrder: 2,
    published: true,
  },
  {
    command: "status",
    description: "Inspect system status",
    output: `SYSTEM DIAGNOSTICS:
portfolio.service      ● ONLINE
infrastructure         ● READY
deployment             ● READY
monitoring             ● ACTIVE
uptime                 ● 99.99%`,
    sortOrder: 3,
    published: true,
  },
  {
    command: "about",
    description: "Display engineer profile",
    output: "", // Dynamically generated if blank
    sortOrder: 4,
    published: true,
  },
  {
    command: "skills",
    description: "Query skills matrix",
    output: "", // Dynamically generated from DB
    sortOrder: 5,
    published: true,
  },
  {
    command: "stack",
    description: "View primary technology stack",
    output: `PRIMARY INFRASTRUCTURE STACK:
  • Cloud: AWS, Azure, Google Cloud
  • IaC: Terraform, CloudFormation, Ansible
  • Containers: Docker, Kubernetes
  • CI/CD: Jenkins, GitLab CI, GitHub Actions
  • Observability: Prometheus, ELK Stack, CloudWatch`,
    sortOrder: 6,
    published: true,
  },
  {
    command: "projects",
    description: "List published projects",
    output: "", // Dynamically generated
    sortOrder: 7,
    published: true,
  },
  {
    command: "experience",
    description: "View professional experience",
    output: "", // Dynamically generated
    sortOrder: 8,
    published: true,
  },
  {
    command: "contact",
    description: "Display contact methods",
    output: "", // Dynamically generated
    sortOrder: 9,
    published: true,
  },
  {
    command: "clear",
    description: "Clear terminal buffer",
    output: "",
    sortOrder: 10,
    published: true,
  },
];

export const defaultSEOSettings = {
  title: "Akhil — DevOps Engineer & Cloud Infrastructure Engineer",
  description:
    "DevOps and Cloud Infrastructure Engineer with 10+ years of experience in cloud platforms, Linux, automation, CI/CD, infrastructure and production systems.",
  keywords: [
    "DevOps",
    "Cloud Infrastructure",
    "AWS",
    "Azure",
    "Terraform",
    "Kubernetes",
    "Docker",
    "CI/CD",
    "Linux",
    "Production Systems",
  ],
  ogTitle: "Akhil — DevOps Engineer & Cloud Infrastructure Engineer",
  ogDescription:
    "10+ Years of experience building, automating, and operating resilient cloud infrastructure.",
  ogImage: "",
  canonicalUrl: "",
};

export const defaultBlogPosts = [
  {
    title: "Architecting Zero-Downtime Blue/Green Deployments with AWS ECS & Terraform",
    slug: "zero-downtime-ecs-blue-green-terraform",
    summary:
      "A field-tested production blueprint for deploying containerized microservices using AWS Application Load Balancers, CodeDeploy automated rollback hooks, and immutable Terraform modules.",
    category: "Cloud Infrastructure",
    tags: ["AWS", "ECS", "Terraform", "Docker", "DevOps", "CI/CD"],
    readTime: "6 min read",
    featured: true,
    published: true,
    sortOrder: 1,
    publishedAt: new Date("2026-08-15").toISOString(),
    content: `## The Imperative for Zero-Downtime Deployments

In high-concurrency production architectures, even a 30-second restart window or dropped TCP socket can result in thousands of severed user connections and transaction failures. Traditional rolling updates, while simple, often introduce subtle transient errors during API schema migrations or dependency mismatch periods.

To eliminate this volatility, we architected an automated **Blue/Green deployment topology** on AWS Elastic Container Service (Amazon ECS) managed entirely via declarative Terraform modules.

---

### Architectural Design: The Two-Target-Group Model

The core of our immutable deployment strategy relies on AWS Application Load Balancer (ALB) paired with AWS CodeDeploy for container traffic shifting:

\`\`\`
[ Global Clients ]
        │ (HTTPS / TLS 1.3)
        ▼
[ Application Load Balancer (Port 443) ]
        │
   ┌────┴─────────────────────────┐
   │ Production Listener          │ Test / Verification Listener
   ▼ (Port 443)                   ▼ (Port 8443)
[ Blue Target Group (Active) ]  [ Green Target Group (Candidate) ]
   │ (Tasks v1.4.0)               │ (Tasks v1.4.1)
   ▼                              ▼
[ ECS Fargate Tasks ]           [ ECS Fargate Tasks ]
\`\`\`

1. **Active Traffic (Blue)**: Handles 100% of live production traffic through the primary HTTPS listener (port 443).
2. **Candidate Deployment (Green)**: CodeDeploy provisions the updated container task revision and links it to a dedicated verification test listener (port 8443).
3. **Automated Health & Synthetic Validation**: Synthetic test suites probe port 8443. Only when consecutive health checks and canary requests pass does traffic shifting begin.
4. **Linear / Canary Shifting**: Traffic moves from Blue to Green at 10% per minute or via a fast 5-minute linear ramp.
5. **Instant Rollback Hook**: If CloudWatch alarms register an increase in HTTP 5xx rates (> 0.05%) or latency spikes beyond 120ms P95, CodeDeploy immediately shifts 100% traffic back to Blue with zero user impact.

---

### Terraform Implementation Snippet

Below is the core Terraform configuration establishing the ECS service with the \`CODE_DEPLOY\` deployment controller:

\`\`\`hcl
resource "aws_ecs_service" "api_service" {
  name            = "production-core-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 6
  launch_type     = "FARGATE"

  deployment_controller {
    type = "CODE_DEPLOY"
  }

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.blue.arn
    container_name   = "core-api"
    container_port   = 8080
  }

  lifecycle {
    ignore_changes = [
      task_definition,
      load_balancer
    ]
  }
}
\`\`\`

---

### Key Operational Lessons Learned

- **Database Backward Compatibility**: Always ensure database migrations follow the expand-and-contract pattern. The database schema must simultaneously support both the Blue (v1.4.0) and Green (v1.4.1) codebases during the 10-minute transition window.
- **Connection Draining (Deregistration Delay)**: Set the deregistration delay on the Blue target group to at least 30–60 seconds so ongoing HTTP Keep-Alive requests gracefully terminate before tasks receive the \`SIGTERM\` signal.
- **Zero Drift Automation**: By parameterizing task definitions and deployment group ARNs in reusable CI/CD pipeline stages, developers can push code with full confidence that infrastructure never drifts between staging and production.`,
  },
  {
    title: "High-Throughput Generative AI: Orchestrating LLM Serving on Kubernetes with GPU Slicing",
    slug: "orchestrating-llm-serving-kubernetes-gpu",
    summary:
      "A comprehensive engineering guide to hosting and auto-scaling open-source LLM inference endpoints with vLLM, NVIDIA Multi-Instance GPU (MIG) partitioning, and custom Prometheus queue telemetry.",
    category: "AI Infrastructure",
    tags: ["Kubernetes", "GenAI", "GPU", "NVIDIA", "vLLM", "Prometheus", "Python"],
    readTime: "8 min read",
    featured: true,
    published: true,
    sortOrder: 2,
    publishedAt: new Date("2026-08-28").toISOString(),
    content: `## The GPU Utilization Dilemma in Enterprise AI

Self-hosting Large Language Models (LLMs) like Llama 3, Mistral, and DeepSeek in production presents a significant operational challenge: GPU resources (such as NVIDIA A100s or H100s) are costly, while token generation workloads fluctuate drastically throughout the day. 

Running dedicated full-card GPU allocations for small or asynchronous inference requests leads to severe underutilization (often 15–25% compute utilization) and massive cloud bills.

In this deep dive, we detail the multi-tenant GPU orchestration architecture we built using **NVIDIA Multi-Instance GPU (MIG)**, **vLLM Continuous PagedAttention**, and **Kubernetes Custom Metrics HPA**.

---

### Multi-Instance GPU (MIG) Slicing Topology

By leveraging NVIDIA Multi-Instance GPU technology on 80GB A100 nodes, we partition each physical accelerator into isolated hardware instances with dedicated high-bandwidth memory (HBM), compute SMs, and memory crossbars:

\`\`\`
┌────────────────────────────────────────────────────────┐
│           PHYSICAL NVIDIA A100 (80GB VRAM)             │
├────────────────────┬──────────────────┬────────────────┤
│ MIG Profile: 3g.40gb│ MIG Profile: 2g.20gb│ MIG Profile: 1g.10gb│
│ (Heavy 70B Model)  │ (14B Agent Flow) │ (Embedding Svc)│
│ Dedicated 40GB HBM │ Dedicated 20GB HBM│ Dedicated 10GB HBM│
└────────────────────┴──────────────────┴────────────────┘
\`\`\`

Each MIG instance appears as an independent, deterministic GPU device to the Kubernetes \`k8s-device-plugin\`, providing complete hardware memory isolation so that an Out-Of-Memory (OOM) error in one model never cascades to affect adjacent workloads.

---

### vLLM Engine Configuration

We deploy inference pods using **vLLM**, which utilizes **PagedAttention** to eliminate KV-cache memory fragmentation and enables dynamic request batching:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-llama-serving
  namespace: ai-workloads
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: vllm-engine
        image: vllm/vllm-openai:latest
        args:
        - "--model=/models/llama-3-8b-instruct"
        - "--tensor-parallel-size=1"
        - "--gpu-memory-utilization=0.92"
        - "--max-model-len=8192"
        - "--enforce-eager"
        - "--disable-log-requests"
        resources:
          limits:
            nvidia.com/mig-3g.40gb: 1
            cpu: "8"
            memory: "32Gi"
          requests:
            nvidia.com/mig-3g.40gb: 1
            cpu: "4"
            memory: "16Gi"
\`\`\`

---

### Queue-Based Autoscaling with Prometheus KEDA

Standard CPU/Memory metrics are useless for autoscaling Generative AI workloads because GPU memory is allocated statically up front by the model weights and KV-cache.

Instead, we expose real-time vLLM engine metrics directly to Prometheus:
- \`vllm:num_requests_waiting\`: The number of requests pending in the iteration queue.
- \`vllm:avg_generation_throughput_tok_per_s\`: Instantaneous generation speed.
- \`vllm:time_to_first_token_seconds\`: P95 latency before prompt prefill returns.

We configure **KEDA (Kubernetes Event-driven Autoscaling)** to scale our pod replicas dynamically whenever \`num_requests_waiting > 4\` over a 45-second sliding window, ensuring prompt responses remain sub-second even during traffic bursts.`,
  },
  {
    title: "Enterprise Multi-Region Failover: Route 53, Aurora Global Database & Active-Active Resiliency",
    slug: "enterprise-multi-region-failover-active-active",
    summary:
      "A complete guide to engineering sub-30-second disaster recovery failover architectures across AWS us-east-1 and eu-central-1 with Aurora Global Database and Cloudflare Anycast edge routing.",
    category: "Distributed Systems",
    tags: ["AWS", "Aurora", "Route 53", "Cloudflare", "Disaster Recovery", "High Availability"],
    readTime: "7 min read",
    featured: false,
    published: true,
    sortOrder: 3,
    publishedAt: new Date("2026-09-05").toISOString(),
    content: `## Surviving Single-Region Cloud Outages

Major cloud provider outages have demonstrated that relying on a single AWS availability zone or even a single geographic region is an unacceptable risk for mission-critical platforms. Achieving high reliability requires an active-active or fast automated active-passive multi-region topology.

This architecture overview details how we designed an enterprise-grade cross-region disaster recovery system between **AWS us-east-1 (N. Virginia)** and **eu-central-1 (Frankfurt)** with an RTO (Recovery Time Objective) under 30 seconds and an RPO (Recovery Point Objective) under 1 second.

---

### Global Data Replication Architecture

\`\`\`
[ Cloudflare Global Edge ]
         │ (Anycast BGP Ingress)
         ▼
[ AWS Route 53 Traffic Flow Policy ]
   ├── (Primary: Health Check PASS) ──► us-east-1 [ Primary Region ]
   │                                       ├── ALB Ingress
   │                                       ├── ECS Microservice Mesh
   │                                       └── Aurora Global DB (Writer)
   │                                                 │
   │                                                 │ (Cross-Region Storage Replication < 1s)
   │                                                 ▼
   └── (Secondary: Automated Failover) ─► eu-central-1 [ Disaster Recovery Region ]
                                           ├── Standby ALB Ingress
                                           ├── ECS Microservice Mesh (Warm Pool)
                                           └── Aurora Global DB (Read Replica)
\`\`\`

---

### 1. Storage Tier: Amazon Aurora Global Database

Amazon Aurora Global Database uses dedicated storage-layer replication rather than traditional database logical replication:
- Dedicated AWS infrastructure handles storage block replication with typical replication latencies under **800 milliseconds**.
- The secondary region in Frankfurt maintains 3 warm reader instances that serve read-heavy analytical and catalog queries during normal operations.
- In the event of a regional disaster in Virginia, a Lambda-based orchestration function invokes \`aws rds failover-global-cluster\`, promoting Frankfurt to primary writer in under 20 seconds with **zero data loss**.

---

### 2. Edge Routing: Dual Health Probing

To prevent DNS "flapping" during transient network blips:
1. **Route 53 Calculated Health Checks**: We combine 3 independent regional endpoint probes across North America, Europe, and Asia.
2. **Synthetic Payload Validation**: The health endpoint doesn't merely return HTTP 200; it executes a round-trip database read check to verify storage layer health.
3. **Cloudflare Zero-Downtime Origin Shield**: Origin shield caching ensures that static assets and cached API responses continue serving seamlessly during the 20-second regional DNS TTL propagation interval.

---

### Verification and Chaos Testing

A disaster recovery plan that isn't tested regularly is an illusion. We execute automated **Game Day chaos simulations** quarterly:
- Simulating a synthetic AWS us-east-1 outage by triggering simulated transit gateway packet drop rules.
- Validating automated promotion of the Frankfurt writer.
- Confirming that CI/CD pipelines switch target endpoints automatically without manual intervention.

The result is true peace of mind: resilient, enterprise-grade cloud architecture that guarantees business continuity regardless of infrastructure conditions.`,
  },
];

