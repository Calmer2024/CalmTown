import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef, useState } from "react";
import "./CircularGallery.css";

function debounce(fn, wait) {
  let timeout;
  return (...args) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => fn(...args), wait);
  };
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

async function resolveFont(font) {
  if (document.fonts?.load) {
    try {
      await document.fonts.load(font);
      await document.fonts.ready;
    } catch {
      return font;
    }
  }

  return font;
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? Number.parseInt(match[1], 10) : 30;
}

function createTextTexture(gl, text, font = "bold 30px sans-serif", color = "#ffffff") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(getFontSize(font) * 1.2);

  canvas.width = textWidth + 26;
  canvas.height = textHeight + 22;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

function getTextureResource(cache, gl, image) {
  const cached = cache.get(image);
  if (cached) {
    return cached;
  }

  const resource = {
    texture: new Texture(gl, { generateMipmaps: false }),
    imageSizes: [1, 1],
    programs: new Set(),
  };

  resource.attach = (program) => {
    resource.programs.add(program);
    program.uniforms.uImageSizes.value = resource.imageSizes;
  };

  const img = new Image();
  img.decoding = "async";
  img.draggable = false;
  img.onload = () => {
    resource.texture.image = img;
    resource.imageSizes = [img.naturalWidth, img.naturalHeight];
    resource.programs.forEach((program) => {
      program.uniforms.uImageSizes.value = resource.imageSizes;
    });
  };
  img.src = image;

  cache.set(image, resource);
  return resource;
}

function warmImages(items) {
  const urls = [...new Set(items.map((item) => item.image).filter(Boolean))];

  return Promise.all(
    urls.map((url) => new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (img.decode) {
          img.decode().then(resolve).catch(resolve);
          return;
        }
        resolve();
      };
      img.onerror = resolve;
      img.src = url;
    })),
  );
}

class Title {
  constructor({ gl, plane, text, textColor, font }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.13;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.08;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius,
    font,
    showText,
    distortion,
    textureCache,
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.showText = showText;
    this.distortion = distortion;
    this.textureCache = textureCache;
    this.createShader();
    this.createMesh();
    if (this.showText && this.text) {
      this.createTitle();
    }
    this.onResize();
  }

  createShader() {
    const textureResource = getTextureResource(this.textureCache, this.gl, this.image);
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uDistortion;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.08 + uSpeed * 0.46) * uDistortion;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      uniforms: {
        tMap: { value: textureResource.texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: textureResource.imageSizes },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uDistortion: { value: this.distortion ? 1 : 0 },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    textureResource.attach(this.program);
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const halfViewport = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const bendAbs = Math.abs(this.bend);
      const radius = (halfViewport * halfViewport + bendAbs * bendAbs) / (2 * bendAbs);
      const effectiveX = Math.min(Math.abs(x), halfViewport);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);

      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / radius);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / radius);
      }
    }

    this.speed = scroll.current - scroll.last;
    if (this.distortion) {
      this.program.uniforms.uTime.value += 0.04;
      this.program.uniforms.uSpeed.value = this.speed;
    } else {
      this.program.uniforms.uSpeed.value = 0;
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = false;
      this.isAfter = false;
    }

    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = false;
      this.isAfter = false;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) {
      this.screen = screen;
    }

    if (viewport) {
      this.viewport = viewport;
    }

    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class CircularGalleryApp {
  constructor(container, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, showText, distortion, enableDrag }) {
    autoBind(this);
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.enableDrag = enableDrag;
    this.hasDistortion = distortion;
    this.textureCache = new Map();
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font, showText, distortion);
    this.addEventListeners();
    this.requestRender();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: false,
      dpr: 1,
      powerPreference: "high-performance",
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    const widthSegments = this.hasDistortion ? 48 : 1;
    const heightSegments = this.hasDistortion ? 24 : 1;

    this.planeGeometry = new Plane(this.gl, {
      heightSegments,
      widthSegments,
    });
  }

  createMedias(items, bend, textColor, borderRadius, font, showText, distortion) {
    const galleryItems = items.length ? items : [];
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => (
      new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        showText,
        distortion,
        textureCache: this.textureCache,
      })
    ));
  }

  onPointerDown(event) {
    if (!this.enableDrag || (event.pointerType === "mouse" && event.button !== 0)) {
      return;
    }

    this.isDown = true;
    this.activePointerId = event.pointerId;
    this.scroll.position = this.scroll.current;
    this.start = event.clientX;
    this.container.setPointerCapture?.(event.pointerId);
  }

  onPointerMove(event) {
    if (!this.enableDrag || !this.isDown || event.pointerId !== this.activePointerId) {
      return;
    }

    const distance = (this.start - event.clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
    this.requestRender();
  }

  onPointerUp(event) {
    if (!this.enableDrag || event.pointerId !== this.activePointerId) {
      return;
    }

    this.isDown = false;
    this.activePointerId = null;
    this.container.releasePointerCapture?.(event.pointerId);
    this.onCheck();
  }

  onWheel(event) {
    const delta = event.deltaY || event.wheelDelta || event.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.requestRender();
    this.onCheckDebounce();
  }

  onKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.scroll.target += this.scrollSpeed * 5;
      this.requestRender();
      this.onCheckDebounce();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.scroll.target -= this.scrollSpeed * 5;
      this.requestRender();
      this.onCheckDebounce();
    }
  }

  onCheck() {
    if (!this.medias?.[0]) {
      return;
    }

    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
    this.requestRender();
  }

  onResize() {
    this.screen = {
      width: Math.max(this.container.clientWidth, 1),
      height: Math.max(this.container.clientHeight, 1),
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }

    this.requestRender();
  }

  requestRender() {
    if (!this.raf) {
      this.raf = window.requestAnimationFrame(this.update);
    }
  }

  update() {
    this.raf = null;
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";

    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;

    const isSettling = Math.abs(this.scroll.target - this.scroll.current) > 0.001;
    if (this.hasDistortion || this.isDown || isSettling) {
      this.requestRender();
    }
  }

  addEventListeners() {
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.container);

    window.addEventListener("resize", this.onResize);

    this.container.addEventListener("wheel", this.onWheel, { passive: true });
    this.container.addEventListener("keydown", this.onKeyDown);

    if (this.enableDrag) {
      this.container.addEventListener("pointerdown", this.onPointerDown);
      this.container.addEventListener("pointermove", this.onPointerMove);
      this.container.addEventListener("pointerup", this.onPointerUp);
      this.container.addEventListener("pointercancel", this.onPointerUp);
    }
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();

    window.removeEventListener("resize", this.onResize);

    this.container.removeEventListener("wheel", this.onWheel);
    this.container.removeEventListener("keydown", this.onKeyDown);

    if (this.enableDrag) {
      this.container.removeEventListener("pointerdown", this.onPointerDown);
      this.container.removeEventListener("pointermove", this.onPointerMove);
      this.container.removeEventListener("pointerup", this.onPointerUp);
      this.container.removeEventListener("pointercancel", this.onPointerUp);
    }

    if (this.gl?.canvas?.parentNode) {
      this.gl.canvas.parentNode.removeChild(this.gl.canvas);
    }

    this.textureCache?.clear();
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

export default function CircularGallery({
  items = [],
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.03,
  font = "bold 30px Kanit",
  scrollSpeed = 2,
  scrollEase = 0.05,
  showText = true,
  distortion = true,
  enableDrag = true,
  label = "Circular image gallery",
}) {
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const runWarmup = () => {
      warmImages(items).finally(() => {
        if (!cancelled && !("IntersectionObserver" in window)) {
          setShouldRender(true);
        }
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(runWarmup, { timeout: 1500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(idleId);
      };
    }

    const timeout = window.setTimeout(runWarmup, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldRender(entry.isIntersecting);
      },
      { rootMargin: "1400px 0px", threshold: 0.01 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let app;
    let mounted = true;

    if (!shouldRender) {
      return () => {
        mounted = false;
      };
    }

    resolveFont(font).then((resolvedFont) => {
      if (!mounted || !containerRef.current) {
        return;
      }

      app = new CircularGalleryApp(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font: resolvedFont,
        scrollSpeed,
        scrollEase,
        showText,
        distortion,
        enableDrag,
      });
    });

    return () => {
      mounted = false;
      app?.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, showText, distortion, enableDrag, shouldRender]);

  return (
    <div
      className="rb-circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label={label}
      data-enable-drag={enableDrag ? "true" : "false"}
    />
  );
}
