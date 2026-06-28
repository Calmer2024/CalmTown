import {
  Camera,
  Compass,
  Images,
  PlayCircle,
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

export const friendMenuItems = [
  {
    title: "bjHH",
    subtitle: "Design witness",
    description: "“你总能把混乱的想法整理成一个能被触摸的界面。”",
    image: "/friends/bjhh.jpg",
    alt: "小野留言的灰度照片",
  },
  {
    title: "长木日",
    subtitle: "Motion friend",
    description: "看你做页面像看一段小电影，细节会慢慢亮起来。",
    image: "/friends/cmr.jpg",
    alt: "迟一留言的灰度照片",
  },
  {
    title: "kk34",
    subtitle: "Quiet reviewer",
    description: "和你聊需求很舒服，复杂的事会被你一点点理顺。",
    image: "/friends/curfur.jpg",
    alt: "洛北留言的灰度照片",
  },
  {
    title: "Ratiocc",
    subtitle: "Visual neighbor",
    description: "你的作品不像模板，更像一个可以暂时住进去的地方。",
    image: "/friends/czh.jpg",
    alt: "山眠留言的灰度照片",
  },
  {
    title: "hammer",
    subtitle: "Code companion",
    description: "你写代码的时候很安静，但最后总能把气氛做出来。",
    image: "/friends/hammer.jpg",
    alt: "阿澈留言的灰度照片",
  },
  {
    title: "豆乳玉麒麟",
    subtitle: "Rest reminder",
    description: "别忘了休息。灵感也需要一点空白。",
    image: "/friends/xjh.jpg",
    alt: "夏屿留言的灰度照片",
  },
  {
    title: "Calmer",
    subtitle: "Author",
    description: "“更冷静一点。”",
    image: "/friends/calmer.jpg",
    alt: "夏屿留言的灰度照片",
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
