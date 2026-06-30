import { useRef, useState } from "react";
import ChromaGrid from "../components/ChromaGrid";
import CircularGallery from "../components/CircularGallery";
import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";
import Stack from "../components/Stack";
import TiltedCard from "../components/TiltedCard";

const designImageModules = import.meta.glob("../../docs/Design/**/*.{png,PNG,jpg,JPG,jpeg,JPEG}", {
  eager: true,
  import: "default",
});

const bluePainCharacterMap = {
  B1: "Agni",
  B2: "Zenitsu",
  B3: "Reze",
  B4: "Makima",
  B5: "Ken Kaneki",
  B6: "Chainsaw Man",
};

const bluePainMoodWords = ["RAW", "TERRIFIED", "TENDER", "COLD", "HOLLOW", "FURIOUS"];

const bluePainStyles = [
  { borderColor: "#e7eef2", gradient: "linear-gradient(145deg, #0d2736, #050505 64%)" },
  { borderColor: "#f2d06d", gradient: "linear-gradient(145deg, #3b2508, #050505 64%)" },
  { borderColor: "#ee8aa9", gradient: "linear-gradient(145deg, #3a1422, #050505 66%)" },
  { borderColor: "#d9d9d9", gradient: "linear-gradient(145deg, #2b1518, #050505 64%)" },
  { borderColor: "#c0b2d9", gradient: "linear-gradient(145deg, #1d1832, #050505 66%)" },
  { borderColor: "#f18b61", gradient: "linear-gradient(145deg, #361409, #050505 64%)" },
];

const mcLabels = ["City", "Bamboo", "Dicey", "Bank", "Hotel", "Alley", "Canyon"];

const tldoeLabels = ["失重房间", "漂浮动物园", "地球花园", "下一站天空", "冲向花园", "来一场老派约会"];

const posterYearMap = {
  "新春海报-2023": 2023,
  "change-歌曲封面": 2023,
  "定向越野-2024": 2024,
  "信韵春歌-2024": 2024,
  "缘来是你-2024": 2024,
  "新年封面-2026": 2026,
};

function filenameFromPath(path) {
  return path.split("/").pop() ?? path;
}

function labelFromPath(path) {
  return filenameFromPath(path).replace(/\.[^.]+$/, "");
}

function collectImages(folderMarker, preferredOrder = []) {
  const orderMap = new Map(preferredOrder.map((name, index) => [name.toLowerCase(), index]));

  return Object.entries(designImageModules)
    .filter(([path]) => path.includes(folderMarker))
    .sort(([pathA], [pathB]) => {
      const labelA = labelFromPath(pathA).toLowerCase();
      const labelB = labelFromPath(pathB).toLowerCase();
      const orderA = orderMap.get(labelA) ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap.get(labelB) ?? Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return pathA.localeCompare(pathB, "zh-Hans-CN", { numeric: true });
    })
    .map(([path, src]) => ({
      src,
      label: labelFromPath(path),
      path,
    }));
}

function yearForPoster(label) {
  if (posterYearMap[label]) {
    return posterYearMap[label];
  }

  const match = label.match(/20\d{2}/);
  return match ? Number.parseInt(match[0], 10) : 2024;
}

const blueComicImages = collectImages("AIGC作品集/BLUECOMIC/", ["B1", "B2", "B3", "B4", "B5", "B6"]);
const mcImages = collectImages("AIGC作品集/MC/");
const tldoeImages = collectImages("AIGC作品集/TLDOE/");
const creativeDesignImages = collectImages("设计作品集/创意设计/", ["三叶草-专辑封面", "change-歌曲封面"]).filter(
  (item) => !item.path.includes("追梦合伙人音乐卡片"),
);
const dreamPartnerCards = collectImages("设计作品集/创意设计/追梦合伙人音乐卡片/", [
  "calmer",
  "长木日",
  "青苹果",
  "波罗的海海王",
  "channel",
  "cher",
  "curfur",
  "hammer",
  "Shadowk",
]);
const albumCovers = creativeDesignImages.filter((item) => item.label === "三叶草-专辑封面");
const changeCover = creativeDesignImages.find((item) => item.label === "change-歌曲封面");
const posterImages = collectImages("设计作品集/海报设计/");

const blueComicItems = blueComicImages.map((image, index) => ({
  id: image.label,
  image: image.src,
  title: bluePainCharacterMap[image.label] ?? image.label,
  subtitle: bluePainMoodWords[index] ?? "RESTLESS",
  borderColor: bluePainStyles[index]?.borderColor,
  gradient: bluePainStyles[index]?.gradient,
}));

const tldoeGalleryItems = tldoeImages.map((image, index) => ({
  image: image.src,
  text: tldoeLabels[index] ?? `TLDOE${index + 1}`,
}));

const mcGalleryItems = mcImages.map((image, index) => ({
  image: image.src,
  text: mcLabels[index] ?? `MC${index + 1}`,
}));

const posterTimelineItems = [...posterImages, ...(changeCover ? [changeCover] : [])]
  .map((image) => ({
    ...image,
    year: yearForPoster(image.label),
  }))
  .sort((a, b) => a.year - b.year || a.label.localeCompare(b.label, "zh-Hans-CN", { numeric: true }));

function DesignStackCards() {
  const cards = dreamPartnerCards.map((image, index) => (
    <img src={image.src} alt={`Dream partner card ${index + 1}`} loading="lazy" key={image.path} />
  ));

  return (
    <div className="design-stack-stage">
      <Stack
        randomRotation
        sensitivity={180}
        sendToBackOnClick
        cards={cards}
        animationConfig={{ stiffness: 260, damping: 22 }}
      />
    </div>
  );
}

function AigcCircularRow({ title, subtitle, items, bend, font, distortion = true, enableDrag = true, className = "" }) {
  return (
    <FadeIn className={`design-aigc-work design-circular-row ${className}`.trim()} delay={0.1} y={30}>
      <div className="design-work-heading">
        <h4 className="design-work-title">{title}</h4>
        <p className="design-work-subtitle">{subtitle}</p>
      </div>
      <div className="design-circular-stage">
        <CircularGallery
          items={items}
          bend={bend}
          textColor="#f7f7f2"
          borderRadius={0.02}
          font={font}
          scrollSpeed={2}
          scrollEase={0.045}
          showText={false}
          distortion={distortion}
          enableDrag={enableDrag}
          label={`${title} gallery`}
        />
      </div>
    </FadeIn>
  );
}

function PosterTimeline({ items }) {
  const trackRef = useRef(null);
  const [activePosterIndex, setActivePosterIndex] = useState(0);

  const playPosterMove = (index) => {
    const track = trackRef.current;
    const nextIndex = index === activePosterIndex ? (index + 1) % items.length : index;
    const nextSlide = track?.querySelectorAll(".design-poster-slide")[nextIndex];

    setActivePosterIndex(nextIndex);
    track?.scrollTo({
      left: nextSlide?.offsetLeft ?? 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div
      className="design-poster-timeline"
      aria-label="Poster timeline carousel"
      ref={trackRef}
    >
      {items.map((image, index) => (
        <FadeIn
          className={`design-poster-slide${index === activePosterIndex ? " is-active" : ""}`}
          delay={index * 0.04}
          y={28}
          key={image.path}
        >
          <button className="design-poster-button" type="button" onClick={() => playPosterMove(index)}>
            <span>{image.year}</span>
            <img src={image.src} alt={`${image.label} poster`} loading="lazy" draggable="false" />
          </button>
        </FadeIn>
      ))}
    </div>
  );
}

export default function DesignSection() {
  return (
    <section className="portfolio-section jack-design" id="design">
      <FadeIn>
        <SectionHeading className="jack-section-heading jack-design-heading" id="design-title" number="02" title="Design" />
      </FadeIn>

      <div className="design-shell">
        <div className="design-aigc-block">
          <FadeIn className="design-block-heading" delay={0.08} y={26}>
            <h3>#AIGC</h3>
          </FadeIn>

          <FadeIn className="design-aigc-work design-bluepain-showcase" delay={0.12} y={34}>
            <div className="design-work-heading">
              <h4 className="design-work-title">BLUE PAIN</h4>
              <p className="design-work-subtitle">“蓝色”</p>
            </div>
            <ChromaGrid className="design-bluecomic-grid" items={blueComicItems} radius={420} columns={3} />
          </FadeIn>

          <AigcCircularRow
            title="The Last Day On Earth"
            subtitle="“地球上的最后一天”"
            items={tldoeGalleryItems}
            bend={3.1}
            font={'400 28px "Microsoft YaHei", "PingFang SC", sans-serif'}
            className="design-circular-row-spaced"
          />
          <AigcCircularRow
            title="BUT I'VE REALLY COME A LONG WAY"
            subtitle="“可是我真的走了很远”"
            items={mcGalleryItems}
            bend={-2.8}
            font={'500 28px "Google Sans Flex"'}
            distortion={false}
          />
        </div>

        <div className="design-creative-block">
          <FadeIn className="design-block-heading" delay={0.08} y={26}>
            <h3>#MUSIC DESIGN</h3>
          </FadeIn>

          <div className="design-creative-grid">
            <FadeIn className="design-music-card-panel" delay={0.12} y={30}>
              <div className="design-panel-copy">
                <h4>Dream partner cards</h4>
              </div>
              <DesignStackCards />
            </FadeIn>

            <div className="design-clover-row">
              {albumCovers.map((image) => (
                <FadeIn className="design-clover-cover-wrap" delay={0.14} y={28} key={image.path}>
                  <TiltedCard
                    imageSrc={image.src}
                    altText="Calmer-Clover album cover"
                    captionText="Calmer-Clover"
                    containerHeight="390px"
                    containerWidth="390px"
                    imageHeight="350px"
                    imageWidth="350px"
                    rotateAmplitude={12}
                    scaleOnHover={1.06}
                    showTooltip
                    displayOverlayContent
                    overlayContent={<p className="design-clover-card-text">Calmer-Clover</p>}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        <div className="design-poster-block">
          <FadeIn className="design-block-heading" delay={0.08} y={26}>
            <h3>#POSTER</h3>
          </FadeIn>

          <PosterTimeline items={posterTimelineItems} />
        </div>
      </div>
    </section>
  );
}
