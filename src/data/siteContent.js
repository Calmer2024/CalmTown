import {
  BookOpenText,
  Camera,
  Code,
  Compass,
  Images,
  PenNib,
  PlayCircle,
  Sparkle,
  Waveform,
} from "@phosphor-icons/react";
import { siGithub, siNeteasecloudmusic, siTiktok, siXiaohongshu } from "simple-icons";

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Interests", href: "#interests" },
  { label: "Blog", href: "#blog" },
  { label: "Music", href: "#music" },
];

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/Calmer2024",
    icon: siGithub,
  },
  {
    label: "Douyin",
    href: "https://www.douyin.com/user/MS4wLjABAAAAfxDhbWJp0rRmshs0gwNZw6p_3CabBn9KefZMb0xmszk?from_tab_name=main",
    icon: siTiktok,
  },
  {
    label: "Xiaohongshu",
    href: "https://xhslink.com/m/7KIlylG9BQD",
    icon: siXiaohongshu,
  },
  {
    label: "NetEase Cloud",
    href: "https://music.163.com/#/search/m/?s=Calmer&type=1002",
    icon: siNeteasecloudmusic,
  },
];

export const heroTags = [
  "WUHer",
  "AIGC",
  "INFP",
  "Software Engineering",
  "Design",
  "Music",
];

export const heroFluidColors = ["#fff7df", "#f2a565", "#87bed4", "#ffffff"];

export const skillGroups = [
  {
    title: "Language",
    summary: "把想法变成可运行的东西",
    items: ["Python", "C++", "JS/TS"],
  },
  {
    title: "Interface",
    summary: "界面、动效、叙事和细节",
    items: ["React", "Design System", "Visual Design"],
  },
  {
    title: "Backend",
    summary: "让产品能稳定交付",
    items: ["FastAPI", "MySQL", "Docker"],
  },
  {
    title: "Agent",
    summary: "和模型一起搭建工作流",
    items: ["Claude", "Codex", "LangChain"],
  },
  {
    title: "System",
    summary: "从本地到部署的工程习惯",
    items: ["Ubuntu", "CLI", "Automation"],
  },
  {
    title: "Creative",
    summary: "把技术放进影像和声音",
    items: ["UE5", "AIGC", "Music"],
  },
];

export const workCategories = [
  {
    title: "Development",
    deck: "Agent workflows, web apps, and tools that stay understandable after the demo.",
    icon: Code,
    image: "https://picsum.photos/seed/calmtown-development-console/1120/760",
    items: ["AI agent prototypes", "React interfaces", "FastAPI services"],
  },
  {
    title: "Design",
    deck: "Poster systems, interface rhythm, and visual experiments with a practical center.",
    icon: PenNib,
    image: "https://picsum.photos/seed/calmtown-editorial-design/1120/760",
    items: ["Personal identity", "Editorial layouts", "Interaction sketches"],
  },
  {
    title: "AIGC",
    deck: "Explorations where models become teammates for visual, audio, and product ideas.",
    icon: Sparkle,
    image: "https://picsum.photos/seed/calmtown-aigc-studio/1120/760",
    items: ["Image workflows", "Prompt systems", "Creative automation"],
  },
  {
    title: "Writing",
    deck: "Notes about agents, frontends, tools, and how creative systems change daily work.",
    icon: BookOpenText,
    image: "https://picsum.photos/seed/calmtown-writing-desk/1120/760",
    items: ["Technical notes", "Builder logs", "Idea fragments"],
  },
];

export const testimonials = [
  {
    quote: "Calmer can make a prototype feel like a real place, not just a screen.",
    name: "Lin Zhou",
    role: "Product builder",
  },
  {
    quote: "He notices the tiny interaction that makes people trust the whole system.",
    name: "Yuxin Chen",
    role: "Frontend friend",
  },
  {
    quote: "The rare mix is code, image, sound, and patience in the same person.",
    name: "Minghao Wu",
    role: "Creative teammate",
  },
];

export const interests = [
  {
    title: "Music",
    text: "Beats, texture, loops, and small midnight arrangements.",
    icon: Waveform,
    image: "https://picsum.photos/seed/calmtown-music-gear/900/1200",
  },
  {
    title: "Editing",
    text: "Rhythm before effects. Cut points as emotional punctuation.",
    icon: PlayCircle,
    image: "https://picsum.photos/seed/calmtown-video-editing/900/1200",
  },
  {
    title: "Photography",
    text: "Light, street corners, quiet frames, imperfect timing.",
    icon: Camera,
    image: "https://picsum.photos/seed/calmtown-photography-walk/900/1200",
  },
  {
    title: "Films",
    text: "Narrative structure, atmosphere, and how a shot holds memory.",
    icon: Images,
    image: "https://picsum.photos/seed/calmtown-cinema-room/900/1200",
  },
  {
    title: "Games",
    text: "Systems that teach through play, feedback, and world feel.",
    icon: Compass,
    image: "https://picsum.photos/seed/calmtown-game-world/900/1200",
  },
];
