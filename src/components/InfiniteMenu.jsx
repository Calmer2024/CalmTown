import { useEffect, useMemo, useRef, useState } from "react";
import { mat4, quat, vec2, vec3 } from "gl-matrix";
import "./InfiniteMenu.css";

const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;
    float scale = max(imageAspect / containerAspect, containerAspect / imageAspect);

    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;
    st = clamp(st, 0.0, 1.0);
    st = st * cellSize + cellOffset;

    vec4 tex = texture(uTex, st);
    outColor = vec4(tex.rgb, tex.a * vAlpha);
}
`;

const EMPTY_ITEMS = [];

const defaultItems = [
  {
    image: "https://picsum.photos/seed/calmtown-friend-default/900/900",
    title: "Friend",
    description: "A quiet note from CalmTown.",
    alt: "Friend avatar",
  },
];

class Face {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Vertex {
  constructor(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  constructor() {
    this.vertices = [];
    this.faces = [];
  }

  addVertex(...args) {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  addFace(...args) {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  get lastVertex() {
    return this.vertices[this.vertices.length - 1];
  }

  subdivide(divisions = 1) {
    const midPointCache = {};
    let faces = this.faces;

    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array(faces.length * 4);

      faces.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);

        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });

      faces = newFaces;
    }

    this.faces = faces;
    return this;
  }

  spherize(radius = 1) {
    this.vertices.forEach((vertex) => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  get data() {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData,
    };
  }

  get vertexData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.position)));
  }

  get normalData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.normal)));
  }

  get uvData() {
    return new Float32Array(this.vertices.flatMap((v) => Array.from(v.uv)));
  }

  get indexData() {
    return new Uint16Array(this.faces.flatMap((f) => [f.a, f.b, f.c]));
  }

  getMidPoint(ndxA, ndxB, cache) {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }

    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex((a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5);
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      0,
      0,
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      t,
      0,
      -1,
      t,
      0,
      1,
      -t,
      0,
      -1,
      -t,
      0,
      1,
    ).addFace(
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      1,
      5,
      9,
      5,
      11,
      4,
      11,
      10,
      2,
      10,
      7,
      6,
      7,
      1,
      8,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7,
      9,
      8,
      1,
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    const safeSteps = Math.max(4, steps);
    const alpha = (2 * Math.PI) / safeSteps;

    this.addVertex(0, 0, 0);
    this.lastVertex.uv[0] = 0.5;
    this.lastVertex.uv[1] = 0.5;

    for (let i = 0; i < safeSteps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv[0] = x * 0.5 + 0.5;
      this.lastVertex.uv[1] = y * 0.5 + 0.5;

      if (i > 0) {
        this.addFace(0, i, i + 1);
      }
    }
    this.addFace(0, safeSteps, 1);
  }
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Unable to create WebGL shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  const info = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error(info || "WebGL shader compilation failed.");
}

function createProgram(gl, shaderSources, transformFeedbackVaryings, attribLocations) {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Unable to create WebGL program.");
  }

  const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].map((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    gl.attachShader(program, shader);
    return shader;
  });

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
  }

  if (attribLocations) {
    Object.entries(attribLocations).forEach(([attrib, location]) => {
      gl.bindAttribLocation(program, location, attrib);
    });
  }

  gl.linkProgram(program);
  shaders.forEach((shader) => gl.deleteShader(shader));

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }

  const info = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw new Error(info || "WebGL program linking failed.");
}

function makeBuffer(gl, sizeOrData, usage) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function makeVertexArray(gl, bufLocNumElmPairs, indices) {
  const va = gl.createVertexArray();
  gl.bindVertexArray(va);

  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }

  if (indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const displayWidth = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const displayHeight = Math.max(1, Math.round(canvas.clientHeight * dpr));
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

function createAndSetupTexture(gl, minFilter, magFilter, wrapS, wrapT) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([21, 29, 26, 255]),
  );
  return texture;
}

function drawFallbackCell(ctx, x, y, cellSize, index) {
  const fills = ["#d8e4db", "#c7d7df", "#e8d6c1", "#d6d0e4", "#cfdcc8", "#e0caca"];
  ctx.fillStyle = fills[index % fills.length];
  ctx.fillRect(x, y, cellSize, cellSize);
  ctx.fillStyle = "rgba(20, 28, 25, 0.2)";
  ctx.beginPath();
  ctx.arc(x + cellSize * 0.5, y + cellSize * 0.5, cellSize * 0.32, 0, Math.PI * 2);
  ctx.fill();
}

class ArcballControl {
  isPointerDown = false;
  orientation = quat.create();
  pointerRotation = quat.create();
  rotationVelocity = 0;
  rotationAxis = vec3.fromValues(1, 0, 0);
  snapDirection = vec3.fromValues(0, 0, -1);
  snapTargetDirection;
  EPSILON = 0.1;
  IDENTITY_QUAT = quat.create();

  constructor(canvas, updateCallback) {
    this.canvas = canvas;
    this.updateCallback = updateCallback || (() => null);
    this.pointerPos = vec2.create();
    this.previousPointerPos = vec2.create();
    this._rotationVelocity = 0;
    this._combinedQuat = quat.create();
    this.previousTouchAction = canvas.style.touchAction;

    this.handlePointerDown = (event) => {
      vec2.set(this.pointerPos, event.clientX, event.clientY);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.isPointerDown = true;
      canvas.setPointerCapture?.(event.pointerId);
    };

    this.handlePointerUp = (event) => {
      this.isPointerDown = false;
      canvas.releasePointerCapture?.(event.pointerId);
    };

    this.handlePointerLeave = () => {
      this.isPointerDown = false;
    };

    this.handlePointerMove = (event) => {
      if (this.isPointerDown) {
        vec2.set(this.pointerPos, event.clientX, event.clientY);
      }
    };

    canvas.addEventListener("pointerdown", this.handlePointerDown);
    canvas.addEventListener("pointerup", this.handlePointerUp);
    canvas.addEventListener("pointerleave", this.handlePointerLeave);
    canvas.addEventListener("pointermove", this.handlePointerMove);
    canvas.style.touchAction = "none";
  }

  update(deltaTime, targetFrameDuration = 16) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = quat.create();

    if (this.isPointerDown) {
      const intensity = 0.3 * timeScale;
      const angleAmplification = 5 / timeScale;
      const midPointerPos = vec2.sub(vec2.create(), this.pointerPos, this.previousPointerPos);
      vec2.scale(midPointerPos, midPointerPos, intensity);

      if (vec2.sqrLen(midPointerPos) > this.EPSILON) {
        vec2.add(midPointerPos, this.previousPointerPos, midPointerPos);

        const p = this.#project(midPointerPos);
        const q = this.#project(this.previousPointerPos);
        const a = vec3.normalize(vec3.create(), p);
        const b = vec3.normalize(vec3.create(), q);

        vec2.copy(this.previousPointerPos, midPointerPos);
        angleFactor *= angleAmplification;
        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, intensity);
      }
    } else {
      const intensity = 0.1 * timeScale;
      quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, intensity);

      if (this.snapTargetDirection) {
        const snappingIntensity = 0.2;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = vec3.squaredDistance(a, b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= snappingIntensity * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = quat.multiply(quat.create(), snapRotation, this.pointerRotation);
    this.orientation = quat.multiply(quat.create(), combinedQuat, this.orientation);
    quat.normalize(this.orientation, this.orientation);

    const rotationAxisIntensity = 0.8 * timeScale;
    quat.slerp(this._combinedQuat, this._combinedQuat, combinedQuat, rotationAxisIntensity);
    quat.normalize(this._combinedQuat, this._combinedQuat);

    const rad = Math.acos(Math.max(-1, Math.min(1, this._combinedQuat[3]))) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;

    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis[0] = this._combinedQuat[0] / s;
      this.rotationAxis[1] = this._combinedQuat[1] / s;
      this.rotationAxis[2] = this._combinedQuat[2] / s;
    }

    const rotationVelocityIntensity = 0.5 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * rotationVelocityIntensity;
    this.rotationVelocity = this._rotationVelocity / timeScale;

    this.updateCallback(deltaTime);
  }

  quatFromVectors(a, b, out, angleFactor = 1) {
    const axis = vec3.cross(vec3.create(), a, b);
    if (vec3.sqrLen(axis) < 0.000001) {
      quat.identity(out);
      return { q: out, axis, angle: 0 };
    }

    vec3.normalize(axis, axis);
    const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    const angle = Math.acos(d) * angleFactor;
    quat.setAxisAngle(out, axis, angle);
    return { q: out, axis, angle };
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointerleave", this.handlePointerLeave);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.style.touchAction = this.previousTouchAction;
  }

  #project(pos) {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;
    const x = (2 * pos[0] - w - 1) / s;
    const y = (2 * pos[1] - h - 1) / s;
    const xySq = x * x + y * y;
    const rSq = r * r;
    const z = xySq <= rSq / 2.0 ? Math.sqrt(rSq - xySq) : rSq / Math.sqrt(xySq);
    return vec3.fromValues(-x, y, z);
  }
}

class InfiniteGridMenu {
  TARGET_FRAME_DURATION = 1000 / 60;
  SPHERE_RADIUS = 2;

  #time = 0;
  #deltaTime = 0;

  camera = {
    matrix: mat4.create(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: vec3.fromValues(0, 0, 3),
    up: vec3.fromValues(0, 1, 0),
    matrices: {
      view: mat4.create(),
      projection: mat4.create(),
      inversProjection: mat4.create(),
    },
  };

  nearestVertexIndex = null;
  nearestItemIndex = null;
  smoothRotationVelocity = 0;
  scaleFactor = 1.0;
  movementActive = false;
  disposed = false;
  animationFrameId = null;

  constructor(canvas, items, onActiveItemChange, onMovementChange, onInit = null, scale = 1.0) {
    this.canvas = canvas;
    this.items = items.length ? items : defaultItems;
    this.onActiveItemChange = onActiveItemChange || (() => {});
    this.onMovementChange = onMovementChange || (() => {});
    this.scaleFactor = scale;
    this.camera.position[2] = 3 * scale;
    this.#init(onInit);
  }

  resize() {
    if (this.disposed || !this.gl) return;

    this.viewportSize = vec2.set(this.viewportSize || vec2.create(), this.canvas.clientWidth, this.canvas.clientHeight);
    const needsResize = resizeCanvasToDisplaySize(this.gl.canvas);

    if (needsResize) {
      this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    }

    this.#updateProjectionMatrix(this.gl);
  }

  run(time = 0) {
    if (this.disposed) return;

    this.#deltaTime = Math.min(32, time - this.#time);
    this.#time = time;

    this.#animate(this.#deltaTime);
    this.#render();

    this.animationFrameId = requestAnimationFrame((t) => this.run(t));
  }

  destroy() {
    this.disposed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.control?.destroy();
  }

  #init(onInit) {
    this.gl = this.canvas.getContext("webgl2", { antialias: true, alpha: false });
    const gl = this.gl;

    if (!gl) {
      throw new Error("WebGL 2 is not available.");
    }

    this.viewportSize = vec2.fromValues(this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawBufferSize = vec2.clone(this.viewportSize);
    this.discProgram = createProgram(gl, [discVertShaderSource, discFragShaderSource], null, {
      aModelPosition: 0,
      aModelUvs: 2,
      aInstanceMatrix: 3,
    });

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram, "aModelPosition"),
      aModelUvs: gl.getAttribLocation(this.discProgram, "aModelUvs"),
      aInstanceMatrix: gl.getAttribLocation(this.discProgram, "aInstanceMatrix"),
      uWorldMatrix: gl.getUniformLocation(this.discProgram, "uWorldMatrix"),
      uViewMatrix: gl.getUniformLocation(this.discProgram, "uViewMatrix"),
      uProjectionMatrix: gl.getUniformLocation(this.discProgram, "uProjectionMatrix"),
      uRotationAxisVelocity: gl.getUniformLocation(this.discProgram, "uRotationAxisVelocity"),
      uTex: gl.getUniformLocation(this.discProgram, "uTex"),
      uItemCount: gl.getUniformLocation(this.discProgram, "uItemCount"),
      uAtlasSize: gl.getUniformLocation(this.discProgram, "uAtlasSize"),
    };

    this.discGeo = new DiscGeometry(56, 1);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      gl,
      [
        [makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW), this.discLocations.aModelPosition, 3],
        [makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW), this.discLocations.aModelUvs, 2],
      ],
      this.discBuffers.indices,
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map((v) => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this.#initDiscInstances(this.DISC_INSTANCE_COUNT);
    this.worldMatrix = mat4.create();
    this.#initTexture();
    this.control = new ArcballControl(this.canvas, (deltaTime) => this.#onControlUpdate(deltaTime));
    this.#updateCameraMatrix();
    this.#updateProjectionMatrix(gl);
    this.resize();
    onInit?.(this);
  }

  #initTexture() {
    const gl = this.gl;
    this.tex = createAndSetupTexture(gl, gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const cellSize = 512;

    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    if (!ctx) return;

    Promise.all(
      this.items.map(
        (item) =>
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = item.image;
          }),
      ),
    ).then((images) => {
      if (this.disposed) return;

      images.forEach((img, i) => {
        const x = (i % this.atlasSize) * cellSize;
        const y = Math.floor(i / this.atlasSize) * cellSize;

        if (img) {
          ctx.drawImage(img, x, y, cellSize, cellSize);
        } else {
          drawFallbackCell(ctx, x, y, cellSize, i);
        }
      });

      try {
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.generateMipmap(gl.TEXTURE_2D);
      } catch {
        const fallbackCanvas = document.createElement("canvas");
        const fallbackCtx = fallbackCanvas.getContext("2d");
        fallbackCanvas.width = canvas.width;
        fallbackCanvas.height = canvas.height;

        if (!fallbackCtx) return;

        for (let i = 0; i < this.items.length; i += 1) {
          const x = (i % this.atlasSize) * cellSize;
          const y = Math.floor(i / this.atlasSize) * cellSize;
          drawFallbackCell(fallbackCtx, x, y, cellSize, i);
        }

        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fallbackCanvas);
        gl.generateMipmap(gl.TEXTURE_2D);
      }
    });
  }

  #initDiscInstances(count) {
    const gl = this.gl;
    this.discInstances = {
      matricesArray: new Float32Array(count * 16),
      matrices: [],
      buffer: gl.createBuffer(),
    };

    for (let i = 0; i < count; ++i) {
      const instanceMatrixArray = new Float32Array(this.discInstances.matricesArray.buffer, i * 16 * 4, 16);
      instanceMatrixArray.set(mat4.create());
      this.discInstances.matrices.push(instanceMatrixArray);
    }

    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, gl.DYNAMIC_DRAW);

    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = this.discLocations.aInstanceMatrix + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
      gl.vertexAttribDivisor(loc, 1);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  #animate(deltaTime) {
    const gl = this.gl;
    this.control.update(deltaTime, this.TARGET_FRAME_DURATION);

    const positions = this.instancePositions.map((p) => vec3.transformQuat(vec3.create(), p, this.control.orientation));
    const scale = 0.25;
    const scaleIntensity = 0.6;

    positions.forEach((p, ndx) => {
      const s = (Math.abs(p[2]) / this.SPHERE_RADIUS) * scaleIntensity + (1 - scaleIntensity);
      const finalScale = s * scale;
      const matrix = mat4.create();

      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), vec3.negate(vec3.create(), p)));
      mat4.multiply(matrix, matrix, mat4.targetTo(mat4.create(), [0, 0, 0], p, [0, 1, 0]));
      mat4.multiply(matrix, matrix, mat4.fromScaling(mat4.create(), [finalScale, finalScale, finalScale]));
      mat4.multiply(matrix, matrix, mat4.fromTranslation(mat4.create(), [0, 0, -this.SPHERE_RADIUS]));

      mat4.copy(this.discInstances.matrices[ndx], matrix);
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.smoothRotationVelocity = this.control.rotationVelocity;
    this.#updateOverlayMetrics();
  }

  #updateOverlayMetrics() {
    const host = this.canvas.parentElement;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const activeIndex = this.nearestVertexIndex ?? this.#findNearestVertexIndex();
    const instanceMatrix = this.discInstances?.matrices?.[activeIndex];

    if (!host || !instanceMatrix || width <= 0 || height <= 0) return;

    const centerWorld = vec3.transformMat4(vec3.create(), [0, 0, 0], instanceMatrix);
    vec3.transformMat4(centerWorld, centerWorld, this.worldMatrix);
    const sphereRadius = vec3.length(centerWorld);

    const projectModelPoint = (modelPosition) => {
      const worldPosition = vec3.transformMat4(vec3.create(), modelPosition, instanceMatrix);
      vec3.transformMat4(worldPosition, worldPosition, this.worldMatrix);

      if (vec3.sqrLen(worldPosition) > 0.000001) {
        vec3.normalize(worldPosition, worldPosition);
        vec3.scale(worldPosition, worldPosition, sphereRadius);
      }

      const viewPosition = vec3.transformMat4(vec3.create(), worldPosition, this.camera.matrices.view);
      const projected = vec3.transformMat4(vec3.create(), viewPosition, this.camera.matrices.projection);

      return {
        x: (projected[0] * 0.5 + 0.5) * width,
        y: (0.5 - projected[1] * 0.5) * height,
      };
    };

    const center = projectModelPoint([0, 0, 0]);
    let minY = Infinity;
    let maxY = -Infinity;

    this.discGeo.vertices.forEach((vertex) => {
      const point = projectModelPoint(vertex.position);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });

    if (![center.x, center.y, minY, maxY].every(Number.isFinite)) return;

    host.style.setProperty("--friend-active-center-x", `${center.x.toFixed(2)}px`);
    host.style.setProperty("--friend-active-center-y", `${center.y.toFixed(2)}px`);
    host.style.setProperty("--friend-active-top-y", `${minY.toFixed(2)}px`);
    host.style.setProperty("--friend-active-bottom-y", `${maxY.toFixed(2)}px`);
  }

  #render() {
    const gl = this.gl;
    gl.useProgram(this.discProgram);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(this.discLocations.uWorldMatrix, false, this.worldMatrix);
    gl.uniformMatrix4fv(this.discLocations.uViewMatrix, false, this.camera.matrices.view);
    gl.uniformMatrix4fv(this.discLocations.uProjectionMatrix, false, this.camera.matrices.projection);
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity,
      this.control.rotationAxis[0],
      this.control.rotationAxis[1],
      this.control.rotationAxis[2],
      this.smoothRotationVelocity * 1.1,
    );

    gl.uniform1i(this.discLocations.uItemCount, this.items.length);
    gl.uniform1i(this.discLocations.uAtlasSize, this.atlasSize);
    gl.uniform1i(this.discLocations.uTex, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.discBuffers.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.DISC_INSTANCE_COUNT,
    );
  }

  #updateCameraMatrix() {
    mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  #updateProjectionMatrix(gl) {
    this.camera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const height = this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position[2];
    const safeAspect = Math.max(0.001, this.camera.aspect);

    if (safeAspect > 1) {
      this.camera.fov = 2 * Math.atan(height / distance);
    } else {
      this.camera.fov = 2 * Math.atan(height / safeAspect / distance);
    }

    mat4.perspective(
      this.camera.matrices.projection,
      this.camera.fov,
      safeAspect,
      this.camera.near,
      this.camera.far,
    );
    mat4.invert(this.camera.matrices.inversProjection, this.camera.matrices.projection);
  }

  #onControlUpdate(deltaTime) {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3 * this.scaleFactor;
    const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;

    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this.#findNearestVertexIndex();
      this.nearestVertexIndex = nearestVertexIndex;
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);

      if (itemIndex !== this.nearestItemIndex) {
        this.nearestItemIndex = itemIndex;
        this.onActiveItemChange(itemIndex);
      }

      const snapDirection = vec3.normalize(vec3.create(), this.#getVertexWorldPosition(nearestVertexIndex));
      this.control.snapTargetDirection = snapDirection;
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }

    this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
    this.#updateCameraMatrix();
  }

  #findNearestVertexIndex() {
    const n = this.control.snapDirection;
    const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
    const nt = vec3.transformQuat(vec3.create(), n, inversOrientation);
    let maxD = -1;
    let nearestVertexIndex = 0;

    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = vec3.dot(nt, this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }

    return nearestVertexIndex;
  }

  #getVertexWorldPosition(index) {
    const nearestVertexPos = this.instancePositions[index];
    return vec3.transformQuat(vec3.create(), nearestVertexPos, this.control.orientation);
  }
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(media.matches);
    handleChange();
    media.addEventListener?.("change", handleChange);

    return () => {
      media.removeEventListener?.("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

export default function InfiniteMenu({ items = EMPTY_ITEMS, scale = 1.0 }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const renderItems = useMemo(() => (items.length ? items : defaultItems), [items]);
  const [activeItem, setActiveItem] = useState(renderItems[0]);
  const [isMoving, setIsMoving] = useState(false);
  const [hasWebglError, setHasWebglError] = useState(false);

  useEffect(() => {
    setActiveItem(renderItems[0]);
  }, [renderItems]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let sketch;
    const handleActiveItem = (index) => {
      const itemIndex = index % renderItems.length;
      setActiveItem(renderItems[itemIndex]);
    };

    try {
      sketch = new InfiniteGridMenu(
        canvas,
        renderItems,
        handleActiveItem,
        setIsMoving,
        (instance) => instance.run(),
        scale,
      );
      setHasWebglError(false);
    } catch {
      setHasWebglError(true);
    }

    const handleResize = () => {
      sketch?.resize();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sketch?.destroy();
    };
  }, [prefersReducedMotion, renderItems, scale]);

  const shouldUseStaticFallback = prefersReducedMotion || hasWebglError;
  const itemTitle = activeItem?.title || activeItem?.name || "";
  const itemSubtitle = activeItem?.subtitle || activeItem?.role || "Friend note";
  const itemDescription = activeItem?.description || activeItem?.message || "";

  return (
    <div className="infinite-menu-root" aria-label={`${itemTitle}: ${itemDescription}`}>
      <div className="friend-menu-title" aria-hidden="true">
        FRIEND SAYS
      </div>
      <p className="friend-menu-note" aria-hidden="true">
        SMALL WORDS FROM PEOPLE WHO PASSED THROUGH CALMTOWN, SAVED HERE LIKE LIGHT ON QUIET GLASS.
      </p>

      {!shouldUseStaticFallback && (
        <canvas id="infinite-grid-menu-canvas" ref={canvasRef} aria-hidden="true" />
      )}

      {shouldUseStaticFallback && activeItem && (
        <div className="infinite-menu-static" aria-hidden="true">
          <img src={activeItem.image} alt="" loading="lazy" />
        </div>
      )}

      {activeItem && (
        <>
          <div className={`friend-face-heading ${isMoving ? "inactive" : "active"}`}>
            <p className="friend-face-name">{itemTitle}</p>
            <p className="friend-face-subtitle">{itemSubtitle}</p>
          </div>
          <p className={`friend-face-message ${isMoving ? "inactive" : "active"}`}>{itemDescription}</p>
        </>
      )}
    </div>
  );
}
