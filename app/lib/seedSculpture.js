import * as THREE from "three";

/** A seed arrangement that transitions between a gathered form and planted rows. */
export function createSeedSculpture(host) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0, 9.5);
  scene.add(new THREE.HemisphereLight(0xfff4d9, 0x634728, 3));
  const light = new THREE.DirectionalLight(0xffefd4, 4);
  light.position.set(-3, 4, 6);
  scene.add(light);
  const fill = new THREE.DirectionalLight(0xffffff, 2);
  fill.position.set(4, -2, 2);
  scene.add(fill);
  const group = new THREE.Group();
  scene.add(group);
  // Lathed teardrop profile gives each seed a rounded base and pointed tip.
  const profile = [
    new THREE.Vector2(0, -0.32),
    new THREE.Vector2(0.16, -0.27),
    new THREE.Vector2(0.235, -0.1),
    new THREE.Vector2(0.2, 0.12),
    new THREE.Vector2(0.1, 0.31),
    new THREE.Vector2(0, 0.42),
  ];
  const curve = new THREE.SplineCurve(profile);
  const geometry = new THREE.LatheGeometry(curve.getPoints(28), 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xc59450,
    roughness: 0.43,
    metalness: 0.1,
  });
  const creaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x795132,
    roughness: 0.8,
  });
  const creaseGeometry = new THREE.CapsuleGeometry(0.014, 0.39, 3, 5);
  const seeds = [];
  for (let index = 0; index < 34; index++) {
    const seed = new THREE.Group();
    const shell = new THREE.Mesh(geometry, material);
    shell.scale.z = 0.55;
    seed.add(shell);
    const crease = new THREE.Mesh(creaseGeometry, creaseMaterial);
    crease.position.set(0, 0.025, 0.126);
    crease.rotation.z = -0.1;
    seed.add(crease);
    const angle = index * 2.39996;
    const radius = Math.sqrt(index / 34) * 1.7;
    const gathered = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      Math.sin(index * 1.7) * 0.5,
    );
    const planted = new THREE.Vector3(
      ((index % 6) - 2.5) * 0.64,
      (Math.floor(index / 6) - 2.5) * 0.64,
      Math.sin(index) * 0.12,
    );
    seed.position.copy(gathered);
    const rotation = (index * 1.37) % (Math.PI * 2);
    seed.rotation.set(0.3, -0.3, rotation);
    const scale = 0.67 + (index % 4) * 0.07;
    seed.scale.setScalar(scale);
    group.add(seed);
    seeds.push({ seed, gathered, planted, rotation });
  }
  let motion = false,
    planted = false,
    visible = true,
    frame = null,
    disposed = false;
  let blend = 0,
    targetX = 0,
    targetY = 0,
    phase = 0,
    previous = 0;
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    wake();
  };
  function render(now) {
    frame = null;
    if (disposed || !visible || document.hidden) return;
    const delta = Math.min((now - previous) / 1000 || 0, 0.04);
    previous = now;
    if (motion) phase += delta;
    const target = planted ? 1 : 0;
    blend = motion ? THREE.MathUtils.lerp(blend, target, 0.055) : target;
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      motion ? targetY * 0.3 : 0,
      0.07,
    );
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      motion ? targetX * 0.35 : 0,
      0.07,
    );
    seeds.forEach(
      ({ seed, gathered, planted: destination, rotation }, index) => {
        seed.position.lerpVectors(gathered, destination, blend);
        seed.position.z += motion ? Math.sin(phase * 0.65 + index) * 0.065 : 0;
        seed.rotation.z = rotation * (1 - blend) + 0.22 * blend;
        seed.rotation.y = motion
          ? Math.sin(phase * 0.35 + index) * 0.25
          : -0.15;
      },
    );
    renderer.render(scene, camera);
    if (motion) frame = requestAnimationFrame(render);
  }
  function wake() {
    if (!disposed && visible && !document.hidden && frame === null)
      frame = requestAnimationFrame(render);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  });
  intersection.observe(host);
  const pointer = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = host.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width - 0.5;
    targetY = (event.clientY - rect.top) / rect.height - 0.5;
    wake();
  };
  const leave = () => {
    targetX = 0;
    targetY = 0;
    wake();
  };
  host.addEventListener("pointermove", pointer);
  host.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", wake);
  return {
    setMotion(value) {
      motion = value;
      wake();
    },
    setPlanted(value) {
      planted = value;
      wake();
    },
    dispose() {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", pointer);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", wake);
      geometry.dispose();
      creaseGeometry.dispose();
      material.dispose();
      creaseMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
