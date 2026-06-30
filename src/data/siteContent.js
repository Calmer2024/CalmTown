import { siGithub, siNeteasecloudmusic, siTiktok, siXiaohongshu } from "simple-icons";
import asenImage from "../../docs/Interests/Music/音乐人/ASEN.jpg";
import drakeImage from "../../docs/Interests/Music/音乐人/Drake.jpg";
import galiImage from "../../docs/Interests/Music/音乐人/GALI.jpg";
import jvkeImage from "../../docs/Interests/Music/音乐人/JVKE.jpg";
import kanyeImage from "../../docs/Interests/Music/音乐人/Kanye.png";
import laufeyImage from "../../docs/Interests/Music/音乐人/Laufey.jpg";
import travisImage from "../../docs/Interests/Music/音乐人/Travis Scott.png";
import vansdaddyImage from "../../docs/Interests/Music/音乐人/Vansdaddy.jpg";
import lijialongImage from "../../docs/Interests/Music/音乐人/李佳隆.jpg";
import joyceCover from "../../docs/Interests/Music/播放器/你说话的声音好细.jpg";
import heartbreakCover from "../../docs/Interests/Music/播放器/this is what heartbreak feels like.jpeg";
import horizonImage from "../../docs/Interests/Game/地平线.jpg";
import minecraftImage from "../../docs/Interests/Game/我的世界.png";
import valorantImage from "../../docs/Interests/Game/无畏契约.jpg";
import aotuPodcastImage from "../../docs/Interests/Podcast/凹凸电波.jpg";
import banlattePodcastImage from "../../docs/Interests/Podcast/半拿铁.jpg";
import feihuaPodcastImage from "../../docs/Interests/Podcast/肥话连篇.jpg";
import yilePodcastImage from "../../docs/Interests/Podcast/怡楽播客.jpg";

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Design", href: "#design" },
  { label: "Interests", href: "#interests" },
  { label: "Blog", href: "#blog" },
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
    summary: "从旋律、节奏到封面气质，音乐一直是 CalmTown 的情绪底色。",
    items: [
      { title: "Drake", text: "冷感叙事和城市夜色，适合深夜循环。", image: drakeImage },
      { title: "Kanye", text: "制作、采样和结构感，总有新的听法。", image: kanyeImage },
      { title: "JVKE", text: "明亮旋律下藏着一点破碎的青春感。", image: jvkeImage },
      { title: "ASEN", text: "松弛、直接，也有很强的个人纹理。", image: asenImage },
      { title: "GALI", text: "中文说唱里很稳的律动和审美。", image: galiImage },
      { title: "李佳隆", text: "旋律说唱和烟火气的结合。", image: lijialongImage },
      { title: "Vansdaddy", text: "轻盈、游离，适合散步时听。", image: vansdaddyImage },
      { title: "Laufey", text: "爵士、复古和温柔的叙述。", image: laufeyImage },
      { title: "Travis Scott", text: "空间感、低频和舞台氛围。", image: travisImage },
    ],
  },
  {
    title: "Podcast",
    summary: "通勤和休息时的背景声，像把世界调成更容易进入的频道。",
    items: [
      { title: "怡楽播客", text: "轻松、细碎，也常常有点治愈。", image: yilePodcastImage },
      { title: "凹凸电波", text: "聊天像朋友围坐，话题很有现场感。", image: aotuPodcastImage },
      { title: "半拿铁", text: "商业故事和人物脉络讲得很顺。", image: banlattePodcastImage },
      { title: "肥话连篇", text: "日常、观点和生活观察混在一起。", image: feihuaPodcastImage },
    ],
  },
  {
    title: "Games",
    summary: "喜欢那些能把反馈、节奏和世界感做得很清楚的游戏。",
    items: [
      { title: "无畏契约", text: "瞄准、配合和瞬间判断的紧张感。", image: valorantImage },
      { title: "我的世界", text: "自由建造，也像一个可保存的想象力空间。", image: minecraftImage },
      { title: "地平线4", text: "速度、天气和公路风景的混合。", image: horizonImage },
    ],
  },
  {
    title: "Sleep",
    summary: "把休息也当成一种认真对待的能力。",
    items: [
      { title: "睡 8 个小时", text: "给第二天留一点清醒。", image: heartbreakCover },
      { title: "睡 10 个小时", text: "把疲惫慢慢修补回来。", image: joyceCover },
      { title: "睡 12 个小时", text: "偶尔允许自己彻底暂停。", image: drakeImage },
    ],
  },
  {
    title: "Travel",
    summary: "想去更远的地方看看，把注意力交给路和风景。",
    items: [
      { title: "好想去旅游", text: "希望下一次出发不是收藏夹里的计划。", image: horizonImage },
    ],
  },
];
