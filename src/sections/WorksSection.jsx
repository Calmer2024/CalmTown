import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";
import ElectricBorder from "../components/ElectricBorder";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import agentHubLogo from "../../docs/Projects/AgentHub/agenthub-logo.png";
import insureSparLogo from "../../docs/Projects/InsureSpar/insurespar_logo.png";
import museLensLogo from "../../docs/Projects/MuseLens/MuseLens_logo.png";
import riversToMountainsLogo from "../../docs/Projects/RiversToMountains/RiversToMountains_logo.png";

const projects = [
  {
    name: "AgentHub",
    category: "Multi-Agent Workspace",
    description:
      "以 IM 聊天为核心交互的多 Agent 协作平台。用户在 Project 中创建单聊或群聊，由 Orchestrator 拆解任务、调度真实 CLI Agent，并把代码、网页、文档和部署产物回流到消息流。",
    stack: ["React", "Vite", "Tailwind CSS", "FastAPI", "Python","WebSocket/SSE", "SQLAlchemy", "Tauri", "Capacitor"],
    preview: ["Project chats", "CLI agents", "Artifact stream", "Code workspace"],
    logo: agentHubLogo,
    github: "https://github.com/Calmer2024/AgentHub",
    theme: {
      accent: "#ff5ed8",
      bg: "#14051f",
      bg2: "#271051",
      panel: "#fff5fc",
      text: "#fff7fd",
      ink: "#1c0b2a",
      chip: "#ffe1f5",
    },
  },
  {
    name: "MuseLens",
    category: "AI Image Lens App",
    description:
      "面向移动端的 AI 图像修图应用，让用户无需学习复杂的提示词工程或编程范式，仅通过自然语言对话，就能精确调用复杂的AI能力，实现“所想即所得”的高效创作体验。",
    stack: ["Flutter", "FastAPI", "PostgreSQL", "pgvector", "MinIO", "Python", "ComfyUI","Riverpod", "Dio"],
    preview: ["Prompt editing", "Image pipeline", "Mobile flow", "Creative history"],
    logo: museLensLogo,
    github: "https://github.com/Calmer2024/MuseLens",
    theme: {
      accent: "#5366ff",
      bg: "#050b2c",
      bg2: "#1727a8",
      panel: "#f3f5ff",
      text: "#f8f9ff",
      ink: "#080d2d",
      chip: "#e7ebff",
    },
  },
  {
    name: "InsureSpar",
    category: "Insurance Training System",
    description:
      "基于 LLM 与多智能体的保险销售对练和评测平台。系统提供人机对练、自动对战、SSE 流式输出、规则检索和异步考官打分，帮助销售话术训练贴近真实业务。",
    stack: ["FastAPI", "LangChain", "LangGraph", "SSE", "SentenceTransformer", "BM25", "Python", "MySQL", "SQLAlchemy", "Vue 3", "Vite"],
    preview: ["Sales practice", "Exam scoring", "Rule retrieval", "SSE review"],
    logo: insureSparLogo,
    github: "https://github.com/Calmer2024/InsureSpar",
    theme: {
      accent: "#b8f17c",
      bg: "#071b12",
      bg2: "#244931",
      panel: "#f5fff0",
      text: "#f7fff2",
      ink: "#102313",
      chip: "#e7f9d8",
    },
  },
  {
    name: "RiversToMountains",
    category: "Immersive Web Experience",
    description:
      "基于 React 和 GSAP 的沉浸式数字体验网站。山河画卷用横向滚动叙事呈现自然地理，世外模式则把视频背景、白噪音、番茄钟和诗歌阅读组合成专注空间。",
    stack: ["React", "TypeScript", "GSAP",  "React Router", "SCSS", "Vite"],
    preview: ["Scroll story", "Focus mode", "Ambient sound", "Poem reader"],
    logo: riversToMountainsLogo,
    github: "https://github.com/Calmer2024/RiversToMountains",
    theme: {
      accent: "#ff332a",
      bg: "#210604",
      bg2: "#5f120d",
      panel: "#fff1ec",
      text: "#fff8f4",
      ink: "#2d0705",
      chip: "#ffd8cf",
    },
  },
];

function ProjectMedia({ project }) {
  const featuredStack = project.stack.slice(0, 5);

  return (
    <div className="jack-project-media jack-project-media-static" aria-label={`${project.name} project preview`}>
      <div className="jack-project-preview-grid" aria-hidden="true" />
      <div className="jack-project-preview-mark">
        <span className="jack-project-preview-ring" aria-hidden="true" />
        <img src={project.logo} alt={`${project.name} logo`} loading="lazy" draggable="false" />
      </div>
      <div className="jack-project-preview-panel jack-project-preview-panel-main">
        <p>{project.category}</p>
        <strong>{project.name}</strong>
      </div>
      <div className="jack-project-preview-panel jack-project-preview-panel-list">
        {project.preview.map((item, index) => (
          <span key={item}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            {item}
          </span>
        ))}
      </div>
      <div className="jack-project-preview-stack" aria-label={`${project.name} featured stack`}>
        {featuredStack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const projectStyle = {
    "--project-accent": project.theme.accent,
    "--project-bg": project.theme.bg,
    "--project-bg-2": project.theme.bg2,
    "--project-panel": project.theme.panel,
    "--project-text": project.theme.text,
    "--project-ink": project.theme.ink,
    "--project-chip": project.theme.chip,
  };

  return (
    <ScrollStackItem itemClassName="jack-project-card">
      <ElectricBorder
        className="jack-project-electric"
        color={project.theme.accent}
        speed={0.75 + index * 0.08}
        chaos={0.1}
        thickness={2}
        borderRadius={34}
        style={projectStyle}
      >
        <article className="jack-project-card-inner">
          <div className="jack-project-copy">
            <div className="jack-project-brand-row">
              <div className="jack-project-logo-frame">
                <img src={project.logo} alt={`${project.name} logo`} loading="lazy" />
              </div>
              <div className="jack-project-kicker">
                <span className="jack-project-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{project.category}</span>
              </div>
            </div>
            <h3>{project.name}</h3>
            <p className="jack-project-description">{project.description}</p>
            <div className="jack-project-stack-list">
              <p>Tech stack</p>
              <div className="jack-project-tags" aria-label={`${project.name} technology stack`}>
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
            <a className="jack-live-button" href={project.github} target="_blank" rel="noreferrer">
              <GithubLogo size={20} weight="fill" aria-hidden="true" />
              <span>Go To Github</span>
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </a>
          </div>
          <ProjectMedia project={project} />
        </article>
      </ElectricBorder>
    </ScrollStackItem>
  );
}

export default function WorksSection() {
  const projectBaseScale = 1 - (projects.length - 1) * 0.03;

  return (
    <section className="portfolio-section jack-projects" id="works">
      <FadeIn>
        <SectionHeading className="jack-section-heading jack-project-heading" id="works-title" number="02" title="Works" />
      </FadeIn>
      <ScrollStack
        className="jack-project-stack"
        itemDistance={110}
        itemScale={0.03}
        itemStackDistance={30}
        stackPosition="20%"
        scaleEndPosition="10%"
        baseScale={projectBaseScale}
        scaleDuration={0.5}
        useWindowScroll
      >
        {projects.map((project, index) => (
          <ProjectCard index={index} project={project} key={project.name} />
        ))}
      </ScrollStack>
    </section>
  );
}
