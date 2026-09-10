import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/** Owns model loading, camera interaction, scheduling, and GPU resource cleanup. */
export function createMaterialViewer(host, { onReady, onError }) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false; // Page scrolling stays available; explicit buttons zoom the model.
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = Math.PI * 0.53;
  controls.rotateSpeed = 0.65;
  const studio = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.75;
  studio.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xfaf4dd, 0x485340, 2.0));
  const key = new THREE.DirectionalLight(0xfff3da, 3.2);
  key.position.set(-3, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, {
    left: -4,
    right: 4,
    top: 4,
    bottom: -4,
    near: 0.1,
    far: 20,
  });
  key.shadow.normalBias = 0.035;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdbedff, 1.8);
  fill.position.set(4, 3, -2);
  scene.add(fill);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.28 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const loader = new GLTFLoader();
  const cache = new Map();
  let active = null;
  let disposed = false;
  let requestId = 0;
  let enabled = false;
  let inView = false;
  let interacted = false;
  let frame = null;
  let lastRender = 0;
  let dirty = true;

  function reset() {
    camera.position.set(3.7, 2.6, 6.1);
    controls.target.set(0, 0, 0);
    if (active) active.rotation.y = 0;
    interacted = false;
    controls.update();
    invalidate();
  }
  function schedule() {
    if (!disposed && inView && !document.hidden && frame === null)
      frame = requestAnimationFrame(draw);
  }
  function invalidate() {
    dirty = true;
    schedule();
  }
  function draw(time) {
    frame = null;
    if (disposed || !inView || document.hidden) return;
    const moving = enabled && !interacted && active;
    if (time - lastRender < 33 && moving) {
      schedule();
      return;
    }
    if (moving) {
      active.rotation.y = Math.sin(time * 0.00035) * 0.035;
      dirty = true;
    }
    if (dirty) {
      renderer.render(scene, camera);
      dirty = false;
      lastRender = time;
    }
    if (moving) schedule();
  }
  const change = () => invalidate();
  const interact = () => {
    interacted = true;
  };
  controls.addEventListener("change", change);
  controls.addEventListener("start", interact);
  const resize = new ResizeObserver(() => {
    const width = Math.max(host.clientWidth, 1),
      height = Math.max(host.clientHeight, 1);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    invalidate();
  });
  resize.observe(host);
  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    invalidate();
  });
  visibility.observe(host);
  document.addEventListener("visibilitychange", invalidate);
  const contextLost = (event) => {
    event.preventDefault();
    onError();
  };
  renderer.domElement.addEventListener("webglcontextlost", contextLost);

  function release(model) {
    const geometries = new Set(),
      materials = new Set(),
      textures = new Set();
    model.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      const list = Array.isArray(object.material)
        ? object.material
        : [object.material];
      list.filter(Boolean).forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value?.isTexture) textures.add(value);
        });
      });
    });
    geometries.forEach((item) => item.dispose());
    materials.forEach((item) => item.dispose());
    textures.forEach((item) => {
      item.dispose();
      item.source?.data?.close?.();
    });
  }

  return {
    async setModel(url) {
      const ticket = ++requestId;
      onReady(false);
      if (active) active.visible = false;
      invalidate();
      try {
        if (!cache.has(url)) {
          const pending = loader.loadAsync(url).then((gltf) => {
            const model = gltf.scene;
            if (disposed) {
              release(model);
              return null;
            }
            const bounds = new THREE.Box3().setFromObject(model);
            const size = bounds.getSize(new THREE.Vector3());
            const scale = 3.2 / Math.max(size.x, size.y, size.z);
            const center = bounds.getCenter(new THREE.Vector3());
            model.position.copy(center).multiplyScalar(-scale);
            model.scale.setScalar(scale);
            const group = new THREE.Group();
            group.add(model);
            group.visible = false;
            group.traverse((object) => {
              if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
              }
            });
            scene.add(group);
            return group;
          });
          cache.set(url, pending);
        }
        const model = await cache.get(url);
        if (disposed || ticket !== requestId || !model) return;
        active = model;
        active.visible = true;
        floor.position.y = new THREE.Box3().setFromObject(active).min.y - 0.025;
        reset();
        onReady(true);
      } catch {
        cache.delete(url);
        if (!disposed && ticket === requestId) onError();
      }
    },
    setMotion(value) {
      enabled = value;
      invalidate();
    },
    reset,
    rotate(direction) {
      interacted = true;
      camera.position.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        (direction * Math.PI) / 12,
      );
      controls.update();
      invalidate();
    },
    zoom(direction) {
      interacted = true;
      const distance = THREE.MathUtils.clamp(
        camera.position.length() * (direction > 0 ? 0.85 : 1.18),
        4.4,
        10,
      );
      camera.position.setLength(distance);
      controls.update();
      invalidate();
    },
    dispose() {
      disposed = true;
      requestId++;
      if (frame !== null) cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", invalidate);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      controls.removeEventListener("change", change);
      controls.removeEventListener("start", interact);
      controls.dispose();
      cache.forEach((promise) =>
        promise
          .then((model) => {
            if (model) release(model);
          })
          .catch(() => {}),
      );
      cache.clear();
      floor.geometry.dispose();
      floor.material.dispose();
      key.shadow.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
