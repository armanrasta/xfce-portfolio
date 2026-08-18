export type Project = {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  url?: string;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
};

export const portfolio = {
  name: "Arman Rostami",
  username: "armanrasta",
  hostname: "debian",
  title: "Platform Engineer | Distributed Systems Specialist",
  location: "Tehran, Iran",
  siteUrl: "https://armanrostami.ir",
  seoTitle: "Arman Rostami — Platform Engineer",
  seoDescription:
    "Arman Rostami is a Platform Engineer and Distributed Systems Specialist in Tehran. Backend platforms, Kubernetes, Pulsar, computer vision, OpenCV, and production AI systems — portfolio and resume.",
  seoKeywords: [
    "Arman Rostami",
    "Arman Rostami Platform Engineer",
    "Arman Rostami Distributed Systems",
    "Platform Engineer Tehran",
    "Distributed Systems Specialist",
    "OpenCV developer",
    "Kubernetes engineer",
  ],
  blurb: "I design backend platforms, distributed systems, and computer-vision pipelines that run in production.",
  bullets: [
    "Backend platforms & APIs (Python, Go, FastAPI, Django)",
    "Distributed systems (Kafka, Pulsar, Kubernetes)",
    "Computer vision & applied AI (OpenCV, YOLO, PyTorch)",
  ],
  showcase: {
    title: "NeoSafe + OpenCV",
    metric: "75% faster incident response",
    latency: "Sub-200ms camera-to-alert",
    opencv: "OpenCV 5.x ColorHashTSDF — PR #27823",
    stack: ["FastAPI", "Pulsar", "ScyllaDB", "Kubernetes", "YOLO", "OpenCV"],
  },
  about: `Software engineer specializing in backend platforms, distributed systems, computer vision, and applied AI.

3+ years designing and building production systems across backend services, real-time processing, AI/CV pipelines, and edge infrastructure. Hands-on with Python, Go, Django, FastAPI, PostgreSQL, Kafka, Pulsar, Docker, and Kubernetes.

Previously CTO at Gam Energy — owned system architecture and technical delivery across backend, AI, computer vision, IoT, and embedded systems. Secured Knowledge-Based Company certification through the Innohelment smart safety platform.`,
  skills: [
    "Python",
    "Go",
    "C/C++",
    "Rust",
    "TypeScript",
    "Django",
    "FastAPI",
    "gRPC",
    "PostgreSQL",
    "Kafka",
    "Pulsar",
    "Kubernetes",
    "Docker",
    "PyTorch",
    "OpenCV",
    "YOLO",
  ],
  skillGroups: [
    {
      label: "Languages",
      items: ["Python", "Go", "C/C++", "Rust", "TypeScript"],
    },
    {
      label: "Backend & APIs",
      items: [
        "Django",
        "DRF",
        "Django Ninja",
        "FastAPI",
        "REST",
        "gRPC",
        "WebSockets",
      ],
    },
    {
      label: "Data & Messaging",
      items: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "ScyllaDB",
        "Kafka",
        "Pulsar",
        "RabbitMQ",
      ],
    },
    {
      label: "Infrastructure",
      items: [
        "Linux",
        "Docker",
        "Kubernetes",
        "Jenkins",
        "Ansible",
        "Prometheus",
        "Grafana",
      ],
    },
    {
      label: "AI / Computer Vision",
      items: [
        "PyTorch",
        "TensorFlow",
        "YOLO",
        "OpenCV",
        "Transformers",
        "XGBoost",
      ],
    },
    {
      label: "Edge / Embedded",
      items: ["ESP32", "STM32", "Raspberry Pi", "TFLite", "IoT"],
    },
  ],
  experience: [
    {
      role: "CTO",
      company: "Gam Energy",
      period: "Jan 2025 – Jul 2026",
      location: "Tehran, Iran",
      highlights: [
        "Architected systems across four product lines: backend, distributed processing, computer vision, IoT, and applied ML.",
        "NeoSafe industrial safety platform (FastAPI, Pulsar, ScyllaDB, Kubernetes, PyTorch, OpenCV) — 75% reduction in incident response time.",
        "Dentissor dental intelligence (SaMD) with Next.js, Django Ninja, and gRPC; DICOM/PACS, Dental Twin, clinician-gated AI, PHI audit logs (PIPEDA/Alberta HIA).",
        "Innohelment smart hardhat with embedded AI on ESP32/STM32; 60% reduction in near-miss events. Secured Knowledge-Based Company certification.",
        "SenioSentry health monitoring: BiLSTM-CNN, MoveNet Lightning TFLite on Raspberry Pi, Wear OS (Galaxy Watch). MIMIC-IV PhysioNet credentialed.",
        "Opty Poultry edge CV: YOLO detection, behavioral analytics, and IoT sensor fusion for poultry health monitoring.",
      ],
    },
    {
      role: "Backend Engineer",
      company: "Rastak S.V.",
      period: "Jun 2024 – Jan 2025",
      location: "Tehran, Iran",
      highlights: [
        "Enterprise document automation with FastAPI, BPMN, WebDAV, MinIO, and Odoo — 60% faster processing.",
        "AI classification and semantic search (Transformers, PyTorch, LangChain, FAISS) at 95% accuracy.",
        "Custom Python/Odoo supply-chain modules — 30% better order accuracy, 25% lower costs.",
        "Dockerized services and Jenkins CI/CD.",
      ],
    },
    {
      role: "Backend Engineer",
      company: "Nexus Bin",
      period: "Jan 2023 – Jan 2024",
      location: "Tehran, Iran",
      highlights: [
        "Backend services with Python, Django Ninja, DRF, WebSockets, RabbitMQ, PostgreSQL — 10,000+ daily transactions at 99.9% uptime.",
        "Centralized auth in Go (gRPC, connection pooling, MongoDB) — 80% latency reduction for 50,000+ users.",
        "Event-driven fraud detection with Kafka, XGBoost, PyTorch, Prometheus, Grafana — 45% fraud reduction at 99.2% precision.",
      ],
    },
  ] satisfies Experience[],
  education: {
    degree: "B.S. in Statistics",
    school: "University of Science & Culture",
    period: "2022 – 2026",
    notes:
      "Coursework: Statistical Modeling, Machine Learning, Data Mining, Probability Theory. Adv. Python & Django Bootcamp — Maktab Sharif (400+ hrs). ML & NLP Track — DataCamp.",
  },
  languages: ["Persian (Native)", "English (Fluent)", "German (A2)"],
  projects: [
    {
      id: "opencv-tsdf",
      name: "OpenCV 5.x — ColorHashTSDF",
      summary:
        "Contributed 3D colorHashTSDF (ColorHashTSDFVolume) to OpenCV core: memory-efficient spatial hashing with color for RGB-D fusion, raycasting, and CPU parallel processing. PR #27823.",
      tags: ["C++", "Python", "OpenCV", "Computer Vision"],
      url: "https://github.com/opencv/opencv/pull/27823",
    },
    {
      id: "neosafe",
      name: "NeoSafe",
      summary:
        "Real-time industrial safety platform: Pulsar video ingestion, ScyllaDB telemetry, FastAPI on Kubernetes, YOLO PPE detection. 75% faster incident response, sub-200ms alert latency.",
      tags: ["FastAPI", "Pulsar", "ScyllaDB", "Kubernetes", "PyTorch", "OpenCV"],
    },
    {
      id: "dentissor",
      name: "Dentissor",
      summary:
        "Dental intelligence SaMD with Next.js, Django Ninja, and gRPC. DICOM/PACS, Dental Twin, clinician-gated AI inference, and PHI audit logs compliant with PIPEDA/Alberta HIA.",
      tags: ["Next.js", "Django Ninja", "gRPC", "SaMD"],
    },
    {
      id: "innohelment",
      name: "Innohelment",
      summary:
        "Smart hardhat with embedded AI on ESP32/STM32 (C/Arduino). Field tests: 60% fewer near-miss events. Drove Gam Energy’s Knowledge-Based Company certification.",
      tags: ["ESP32", "STM32", "C", "IoT", "Edge AI"],
    },
    {
      id: "voidvox",
      name: "VoidVox Hypermarket",
      summary:
        "Freelance end-to-end real-time inventory tracking for 10k+ SKUs using computer vision and an event-driven FastAPI backend. Owned the full lifecycle from requirements to deployment.",
      tags: ["Python", "YOLO", "FastAPI", "Computer Vision"],
    },
    {
      id: "moonwalk",
      name: "MoonWalk",
      summary:
        "Open-source Android music player with clean architecture and modern Kotlin practices.",
      tags: ["Kotlin", "Android"],
      url: "https://github.com/armanrasta/moon_walk",
    },
    {
      id: "snakers",
      name: "Snakers",
      summary:
        "Python learning tool on PyPI with Ruff linting integration.",
      tags: ["Python", "PyPI"],
      url: "https://pypi.org/project/snakers",
    },
    {
      id: "seniosentry",
      name: "SenioSentry",
      summary:
        "Health monitoring architecture combining BiLSTM-CNN, MoveNet Lightning TFLite on Raspberry Pi, and a Java Wear OS app (Galaxy Watch). MIMIC-IV PhysioNet credentialed.",
      tags: ["TFLite", "Raspberry Pi", "Wear OS", "ML"],
    },
    {
      id: "opty-poultry",
      name: "Opty Poultry",
      summary:
        "Edge-based CV platform integrating YOLO detection, behavioral analytics, and IoT sensor fusion for automated poultry health monitoring.",
      tags: ["YOLO", "IoT", "Edge", "Computer Vision"],
    },
  ] satisfies Project[],
  contact: {
    email: "armanrostami1382@gmail.com",
    phone: "+98 996 637 3239",
    location: "Tehran, Iran",
    github: "https://github.com/armanrasta",
    linkedin: "https://www.linkedin.com/in/arman--rostami",
  },
};

export type Portfolio = typeof portfolio;
