/* Original Big Hawk geometry, rendered locally. A static SVG is always available. */
import * as THREE from "three";
import { SVGLoader } from "./vendor/SVGLoader.js";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";

const holder = document.querySelector("[data-hero-scene]");
const canvas = document.querySelector("#hawk-canvas");
const frame = canvas?.parentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
if (holder && canvas) {
  let renderer, scene, camera, sculpture, ring, pmrem, env, geometry;
  let animation = 0,
    visible = true,
    paused = false,
    lastFrame = 0;
  let pointerX = 0,
    pointerY = 0;
  let rotationX = -0.09,
    rotationY = -0.28;
  let ready = false;
  const dynamic = () =>
    !reduced.matches && !paused && !document.hidden && visible;
  const stop = () => {
    cancelAnimationFrame(animation);
    animation = 0;
  };
  const render = (time) => {
    if (!ready) return;
    const animate = dynamic();
    const t = (time || performance.now()) * 0.001;
    const targetY = -0.28 + (animate ? pointerX * 0.15 : 0);
    const targetX = -0.09 + (animate ? pointerY * 0.08 : 0);
    rotationY += (targetY - rotationY) * 0.08;
    rotationX += (targetX - rotationX) * 0.08;
    sculpture.rotation.set(rotationX, rotationY, -0.1);
    sculpture.position.y = 0.25;
    ring.rotation.z = -0.3;
    renderer.render(scene, camera);
  };
  const tick = (time) => {
    animation = 0;
    if (!dynamic()) return;
    if (time - lastFrame > 1000 / 30) {
      lastFrame = time;
      render(time);
    }
    const unsettled =
      Math.abs(rotationY - (-0.28 + pointerX * 0.15)) +
        Math.abs(rotationX - (-0.09 + pointerY * 0.08)) >
      0.0008;
    if (unsettled) animation = requestAnimationFrame(tick);
  };
  const refresh = () => {
    stop();
    if (!ready || document.hidden || !visible) return;
    render(performance.now());
    if (dynamic()) animation = requestAnimationFrame(tick);
  };
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setClearColor(0x08090b, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(31, 1, 0.1, 50);
    camera.position.set(0.1, 0.2, 11.1);
    camera.lookAt(0, 0.1, 0);
    pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment(renderer);
    env = pmrem.fromScene(room, 0.05);
    scene.environment = env.texture;
    room.dispose();
    pmrem.dispose();
    const svg = await fetch(new URL("./hawk.svg", import.meta.url));
    if (!svg.ok) throw new Error("Emblem unavailable");
    const parsed = new SVGLoader().parse(await svg.text());
    const shapes = parsed.paths.flatMap((path) => SVGLoader.createShapes(path));
    geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 52,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 5,
      bevelSegments: 3,
      curveSegments: 6,
      steps: 1,
    });
    geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    geometry.center();
    const scale = 4.3 / Math.max(size.x, size.y);
    geometry.scale(scale, -scale, scale);
    geometry.computeVertexNormals();
    const face = new THREE.MeshPhysicalMaterial({
      color: 0xb69a60,
      metalness: 1,
      roughness: 0.24,
      clearcoat: 0.4,
      clearcoatRoughness: 0.22,
      envMapIntensity: 1.15,
      side: THREE.DoubleSide,
    });
    const edge = new THREE.MeshPhysicalMaterial({
      color: 0xd3b776,
      metalness: 1,
      roughness: 0.19,
      clearcoat: 0.5,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide,
    });
    sculpture = new THREE.Mesh(geometry, [face, edge]);
    sculpture.rotation.set(-0.09, -0.28, -0.1);
    sculpture.position.set(0, 0.25, 0);
    scene.add(sculpture);
    ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.008, 5, 160),
      new THREE.MeshStandardMaterial({
        color: 0x8b7344,
        metalness: 1,
        roughness: 0.35,
        transparent: true,
        opacity: 0.6,
      }),
    );
    ring.position.set(0, -0.05, -0.9);
    ring.rotation.set(0.85, 0.45, -0.3);
    scene.add(ring);
    const key = new THREE.DirectionalLight(0xffedd0, 4.2);
    key.position.set(-4, 6, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd6e1ff, 2.8);
    rim.position.set(4, 2, -2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xf6d695, 2.1);
    fill.position.set(4, -2, 5);
    scene.add(fill);
    const resize = () => {
      const width = frame.clientWidth,
        height = frame.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      refresh();
    };
    ready = true;
    new ResizeObserver(resize).observe(frame);
    resize();
    render(performance.now());
    frame.classList.add("has-webgl");
    holder.dataset.render = "webgl";
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        refresh();
      },
      { rootMargin: "50px", threshold: 0 },
    );
    observer.observe(holder);
    holder.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse" || reduced.matches || paused) return;
        const bounds = holder.getBoundingClientRect();
        pointerX = Math.max(
          -1,
          Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2),
        );
        pointerY = Math.max(
          -1,
          Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2),
        );
        if (!animation && dynamic()) animation = requestAnimationFrame(tick);
      },
      { passive: true },
    );
    holder.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
      if (!animation && dynamic()) animation = requestAnimationFrame(tick);
    });
    reduced.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    addEventListener("bht-motion-change", (event) => {
      paused = event.detail.paused;
      refresh();
    });
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      stop();
      ready = false;
      frame.classList.remove("has-webgl");
      holder.dataset.render = "fallback";
    });
    addEventListener("pagehide", stop);
    addEventListener("pageshow", refresh);
    refresh();
  } catch (error) {
    stop();
    frame?.classList.remove("has-webgl");
    holder.dataset.render = "fallback";
    renderer?.dispose();
    env?.dispose();
    geometry?.dispose();
  }
}
