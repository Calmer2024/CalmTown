import { Bed, CloudMoon, MapTrifold, MoonStars } from "@phosphor-icons/react";
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
    subtitle: "职业音乐人，业余写代码",
    description: "“卡老师的世界总是充满色彩。”",
    image: "/friends/cmr.jpg",
    alt: "长木日",
  },
  {
    title: "kk34",
    subtitle: "我不当Curfur好久了",
    description: "“那些打不死我的一直在打我。”",
    image: "/friends/curfur.jpg",
    alt: "kk34",
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
    subtitle: "形而上学不行退学",
    description: "“跟你八竿子打不着的人出现在你的生活中就是为了打你八竿子。”",
    image: "/friends/xjh.jpg",
    alt: "豆乳玉麒麟",
  },
  {
    title: "Calmer",
    subtitle: "Author",
    description: "“更冷静一点。”",
    image: "/friends/calmer.jpg",
    alt: "夏屿留言的灰度照片",
  },
  {
    title: "ShadowK",
    subtitle: "唯神",
    description: "“你见过神吗？”",
    image: "/friends/shadowk.jpg",
    alt: "夏屿留言的灰度照片",
  },
];

export const interests = [
  {
    title: "Music",
    summary: "如果没有音乐，不知道要怎么面对这个世界。",
    items: [
      { title: "Drake", text: "Iceman, Freeze the world , freeze the world.", image: drakeImage },
      { title: "Kanye", text: "And it'll be a long time before you ever see me again me again", image: kanyeImage },
      { title: "JVKE", text: "I hope you leave and don't come back.", image: jvkeImage },
      { title: "ASEN", text: "Wakin up today , I be feelin loved.", image: asenImage },
      { title: "GALI", text: "他们想窥视我，用显微镜看我现在多体面。", image: galiImage },
      { title: "李佳隆", text: "我不是说唱歌手，说唱需要戴起K金。", image: lijialongImage },
      { title: "Vansdaddy", text: "我不用去猜，你喜欢的我也全部都会喜欢。", image: vansdaddyImage },
      { title: "Laufey", text: "Don't you notice how I get quiet when there's no one else around?", image: laufeyImage },
      { title: "Travis Scott", text: "Sun is down, freezin' cold . That's how we already know.", image: travisImage },
    ],
  },
  {
    title: "Podcast",
    summary: "喜欢在耳机里听到有人在和你聊天，或者讲故事。",
    items: [
      { title: "怡楽播客", text: "一直在听老北京唠嗑......有点上头。", image: yilePodcastImage },
      { title: "凹凸电波", text: "焦虑的时候听听凹凸真的会轻松不少。", image: aotuPodcastImage },
      { title: "半拿铁", text: "不容易，不容易。喜欢听刘飞讲互联网故事。", image: banlattePodcastImage },
      { title: "肥话连篇", text: "很治愈的日常、观点和生活观察。", image: feihuaPodcastImage },
    ],
  },
  {
    title: "Games",
    summary: "又菜又爱玩。",
    items: [
      { title: "无畏契约", text: "康神开播了？真的假的？我靠真开播啦。", image: valorantImage },
      { title: "我的世界", text: "什么时候能把机械动力玩完啊。", image: minecraftImage },
      { title: "地平线4", text: "纯观赏风景旅游团玩家，纯手残。", image: horizonImage },
    ],
  },
  {
    title: "Sleep",
    summary: "REST型人格，DeepSleep代言人。",
    items: [
      { title: "睡 8 个小时", text: "8个小时是基础。", icon: MoonStars },
      { title: "睡 10 个小时", text: "10个小时是小康。", icon: Bed },
      { title: "睡 12 个小时", text: "12个小时彻底睡眠自由。", icon: CloudMoon },
    ],
  },
  {
    title: "Travel",
    summary: "还想和好朋友去更多、更远的地方。",
    items: [
      { title: "好想去旅游", text: "好像再来一次说走就走的旅行啊>_<", icon: MapTrifold },
    ],
  },
];
