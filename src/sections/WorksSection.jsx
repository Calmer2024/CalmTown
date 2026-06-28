import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

const projects = [
  {
    name: "AgentHub",
    category: "三端互通",
    description: "三端互通的 Agent 工作台，把桌面、移动端和网页端任务流合并到一个连续体验里。",
    tags: ["Agent workflow", "React", "Cross-device"],
    images: [
      "https://picsum.photos/seed/calmtown-agenthub-console/900/620",
      "https://picsum.photos/seed/calmtown-agenthub-mobile/900/620",
      "https://picsum.photos/seed/calmtown-agenthub-dashboard/1400/900",
    ],
  },
  {
    name: "MuseLens",
    category: "移动端",
    description: "移动端灵感采集应用，用轻量浏览、收藏和整理流程连接图像、音乐与设计片段。",
    tags: ["Mobile UI", "Media", "Inspiration"],
    images: [
      "https://picsum.photos/seed/calmtown-muselens-feed/900/620",
      "https://picsum.photos/seed/calmtown-muselens-detail/900/620",
      "https://picsum.photos/seed/calmtown-muselens-gallery/1400/900",
    ],
  },
  {
    name: "Thryve",
    category: "桌面端",
    description: "桌面端效率工具，围绕计划、复盘和持续行动设计一个更安静的工作环境。",
    tags: ["Desktop app", "Productivity", "Planning"],
    images: [
      "https://picsum.photos/seed/calmtown-thryve-timeline/900/620",
      "https://picsum.photos/seed/calmtown-thryve-focus/900/620",
      "https://picsum.photos/seed/calmtown-thryve-desktop/1400/900",
    ],
  },
  {
    name: "InsureSpar",
    category: "网页端",
    description: "网页端保险信息梳理工具，把复杂条款、风险提示和决策路径整理成可读界面。",
    tags: ["Web app", "Insurance", "Decision flow"],
    images: [
      "https://picsum.photos/seed/calmtown-insurespar-cards/900/620",
      "https://picsum.photos/seed/calmtown-insurespar-risk/900/620",
      "https://picsum.photos/seed/calmtown-insurespar-web/1400/900",
    ],
  },
  {
    name: "RiversToMountains 山河图鉴",
    category: "网页设计",
    description: "山河图鉴网页设计，用地图、图像和条目化信息呈现自然地理与地方记忆。",
    tags: ["山河图鉴", "Web design", "Editorial"],
    images: [
      "https://picsum.photos/seed/calmtown-rivers-map/900/620",
      "https://picsum.photos/seed/calmtown-mountains-index/900/620",
      "https://picsum.photos/seed/calmtown-rivers-to-mountains/1400/900",
    ],
  },
];

function ProjectCard({ project, index }) {
  return (
    <ScrollStackItem itemClassName="jack-project-card">
      <div className="jack-project-top">
        <span className="jack-project-number">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <p>{project.category}</p>
          <h3>{project.name}</h3>
          <p className="jack-project-description">{project.description}</p>
          <div className="jack-project-tags" aria-label={`${project.name} tags`}>
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <a className="jack-live-button" href="#contact">
          Live Project
        </a>
      </div>
      <div className="jack-project-images">
        <div>
          <img src={project.images[0]} alt={`${project.name} preview one`} loading="lazy" />
          <img src={project.images[1]} alt={`${project.name} preview two`} loading="lazy" />
        </div>
        <img src={project.images[2]} alt={`${project.name} main preview`} loading="lazy" />
      </div>
    </ScrollStackItem>
  );
}

export default function WorksSection() {
  const projectBaseScale = 1 - (projects.length - 1) * 0.03;

  return (
    <section className="portfolio-section jack-projects" id="works">
      <FadeIn>
        <SectionHeading className="jack-section-heading jack-project-heading" id="works-title" number="01" title="Works" />
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
