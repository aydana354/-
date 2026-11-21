import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';
import { ElementData, Language } from '../types/chemistry';
import { UI_TEXT } from '../data/uiTranslations';

interface Atom3DViewerProps {
  element: ElementData;
  lang: Language;
}

interface ElectronHandle {
  mesh: THREE.Mesh;
  ringGroup: THREE.Group;
  radius: number;
  angle: number;
  angularSpeed: number;
}

export const Atom3DViewer: React.FC<Atom3DViewerProps> = ({ element, lang }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [webglError, setWebglError] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speedMultiplier);
  const resetFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL detection per Three.js skill protocol
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1120);
    scene.fog = new THREE.FogExp2(0x0b1120, 0.018);

    // Studio environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 200);
    camera.position.set(0, 7.5, 19.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 8;
    controls.maxDistance = 36;
    controls.enablePan = false;

    resetFnRef.current = () => {
      camera.position.set(0, 7.5, 19.5);
      controls.target.set(0, 0, 0);
      controls.update();
    };

    // 3-point lighting rig
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0f172a, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(10, 14, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(element.theme.orbitColorHex), 1.4);
    rimLight.position.set(-12, -8, -10);
    scene.add(rimLight);

    // Composite Atom Group
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // 1. Composite Nucleus (Protons + Neutrons InstancedMeshes)
    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    const nucleonGeo = new THREE.SphereGeometry(0.19, 14, 12);
    const protonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(element.theme.accentHex),
      emissive: new THREE.Color(element.theme.accentHex),
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.35,
      clearcoat: 0.7,
    });
    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.55,
      metalness: 0.75,
    });

    const totalProtons = element.atomicStructure.featuredIsotope.protons;
    const totalNeutrons = element.atomicStructure.featuredIsotope.neutrons;
    const totalNucleons = totalProtons + totalNeutrons;

    const protonInstances = new THREE.InstancedMesh(nucleonGeo, protonMat, totalProtons);
    const neutronInstances = new THREE.InstancedMesh(nucleonGeo, neutronMat, totalNeutrons);

    const dummy = new THREE.Object3D();
    let pIdx = 0;
    let nIdx = 0;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < totalNucleons; i++) {
      // Fibonacci sphere packing with layered shells for realistic spherical cluster
      const frac = (i + 0.5) / totalNucleons;
      const r = 0.28 + 0.78 * Math.cbrt(frac);
      const y = 1 - 2 * frac;
      const radAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      dummy.position.set(
        Math.cos(theta) * radAtY * r,
        y * r,
        Math.sin(theta) * radAtY * r
      );
      dummy.scale.setScalar(0.92 + ((i % 5) * 0.03));
      dummy.updateMatrix();

      // Interleave protons and neutrons evenly
      const assignProton = pIdx < totalProtons && (nIdx >= totalNeutrons || i % 2 === 0);
      if (assignProton) {
        protonInstances.setMatrixAt(pIdx++, dummy.matrix);
      } else {
        neutronInstances.setMatrixAt(nIdx++, dummy.matrix);
      }
    }
    protonInstances.instanceMatrix.needsUpdate = true;
    neutronInstances.instanceMatrix.needsUpdate = true;
    protonInstances.computeBoundingSphere();
    neutronInstances.computeBoundingSphere();
    nucleusGroup.add(protonInstances, neutronInstances);

    // Subtle glowing core aura around nucleus
    const coreGlowGeo = new THREE.SphereGeometry(1.38, 24, 24);
    const coreGlowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(element.theme.orbitColorHex),
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const coreGlowMesh = new THREE.Mesh(coreGlowGeo, coreGlowMat);
    nucleusGroup.add(coreGlowMesh);

    // 2. Orbital Shells (6 shells for Period 6 elements)
    const shells = element.atomicStructure.shells;
    const shellRadii = [2.2, 3.3, 4.5, 5.8, 7.1, 8.4];
    const shellTilts: [number, number, number][] = [
      [0.35, 0.2, 0.0],
      [-0.45, 0.5, 0.3],
      [0.65, -0.35, 0.6],
      [-0.25, -0.65, -0.4],
      [0.52, 0.45, -0.55],
      [0.18, -0.22, 0.25],
    ];

    const ringGeometries: THREE.TorusGeometry[] = [];
    const ringMatInner = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.8,
      transparent: true,
      opacity: 0.55,
    });
    const ringMatOuter = new THREE.MeshStandardMaterial({
      color: new THREE.Color(element.theme.orbitColorHex),
      emissive: new THREE.Color(element.theme.accentHex),
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.72,
    });

    const electronGeo = new THREE.SphereGeometry(0.145, 14, 12);
    const electronCoreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.5,
    });
    const electronValenceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(element.theme.orbitColorHex),
      emissive: new THREE.Color(element.theme.accentHex),
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.6,
    });

    const electronHandles: ElectronHandle[] = [];
    const ringGroups: { group: THREE.Group; wobbleSpeed: number }[] = [];

    shells.forEach((count, shellIndex) => {
      const radius = shellRadii[shellIndex] ?? 2.2 + shellIndex * 1.25;
      const isOuterOrActive = shellIndex >= 3;

      const ringGroup = new THREE.Group();
      const tilt = shellTilts[shellIndex % shellTilts.length];
      ringGroup.rotation.set(tilt[0], tilt[1], tilt[2]);
      atomGroup.add(ringGroup);
      ringGroups.push({ group: ringGroup, wobbleSpeed: 0.04 + shellIndex * 0.01 });

      const torusGeo = new THREE.TorusGeometry(radius, isOuterOrActive ? 0.028 : 0.02, 10, 96);
      ringGeometries.push(torusGeo);
      const ringMesh = new THREE.Mesh(torusGeo, isOuterOrActive ? ringMatOuter : ringMatInner);
      ringMesh.rotation.x = Math.PI / 2;
      ringGroup.add(ringMesh);

      const baseAngularSpeed = 1.45 / (1 + shellIndex * 0.42);
      const electronMat = shellIndex === shells.length - 1 || (element.block === 'f' && shellIndex === 3)
        ? electronValenceMat
        : electronCoreMat;

      for (let e = 0; e < count; e++) {
        const angle = (e / count) * Math.PI * 2;
        const eMesh = new THREE.Mesh(electronGeo, electronMat);
        eMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        ringGroup.add(eMesh);
        electronHandles.push({
          mesh: eMesh,
          ringGroup,
          radius,
          angle,
          angularSpeed: baseAngularSpeed * (shellIndex % 2 === 0 ? 1 : -1),
        });
      }
    });

    // Animation loop with software WebGL pacing
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (isPlayingRef.current) {
        const spd = speedRef.current;
        atomGroup.rotation.y += dt * 0.14 * spd;
        nucleusGroup.rotation.y -= dt * 0.35 * spd;
        nucleusGroup.rotation.x += dt * 0.18 * spd;

        for (let i = 0; i < electronHandles.length; i++) {
          const h = electronHandles[i];
          h.angle += h.angularSpeed * dt * spd;
          h.mesh.position.set(
            Math.cos(h.angle) * h.radius,
            0,
            Math.sin(h.angle) * h.radius
          );
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      nucleonGeo.dispose();
      protonMat.dispose();
      neutronMat.dispose();
      coreGlowGeo.dispose();
      coreGlowMat.dispose();
      ringGeometries.forEach((g) => g.dispose());
      ringMatInner.dispose();
      ringMatOuter.dispose();
      electronGeo.dispose();
      electronCoreMat.dispose();
      electronValenceMat.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, [element]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
      {/* Main 3D Viewport */}
      <div className="relative w-full h-[380px] sm:h-[460px]">
        {webglError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <p className="font-medium text-white mb-2">
              {element.atomicNumber} {element.symbol} — {element.names[lang]}
            </p>
            <p className="text-sm text-slate-400 max-w-md">
              {lang === 'kz'
                ? 'Бұл құрылғыда WebGL 3D-графикасы қолжетімсіз. Төмендегі 2D электрондық қабықшалар анимациясын пайдаланыңыз.'
                : 'Аппаратный WebGL недоступен в текущем браузере. Используйте интерактивную 2D-модель электронных оболочек.'}
            </p>
          </div>
        ) : (
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        )}

        {/* Top-left concise legend */}
        <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap items-center gap-3 rounded-lg bg-slate-900/90 border border-slate-700/80 px-3 py-2 text-xs text-slate-200">
          <span className="font-mono font-semibold text-white">
            Z={element.atomicNumber} ({element.symbol})
          </span>
          <span className="text-slate-500">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: element.theme.accentHex }} />
            <span>{element.atomicStructure.protons} p⁺</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            <span>{element.atomicStructure.featuredIsotope.neutrons} n⁰</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span>{element.atomicStructure.electrons} e⁻</span>
          </span>
        </div>

        {/* Unified Bottom Control Dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-3 rounded-xl bg-slate-900/95 border border-slate-700 px-4 py-2.5 text-xs text-slate-200 w-[92%] max-w-xl">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-white transition-colors whitespace-nowrap shrink-0"
            style={{ backgroundColor: element.theme.accentHex }}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? UI_TEXT.atomModel.pause[lang] : UI_TEXT.atomModel.play[lang]}</span>
          </button>

          <label className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-400">{UI_TEXT.atomModel.speedLabel[lang]}:</span>
            <input
              type="range"
              min={0.25}
              max={2.5}
              step={0.25}
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
              className="w-24 accent-sky-400 cursor-pointer"
              aria-label={UI_TEXT.atomModel.speedLabel[lang]}
            />
            <span className="font-mono tabular-nums text-white w-9">{speedMultiplier}×</span>
          </label>

          <button
            type="button"
            onClick={() => resetFnRef.current?.()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{UI_TEXT.atomModel.resetView[lang]}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Scientific Model Disclaimer */}
      <div className="border-t border-slate-800 bg-slate-900/90 px-5 py-3.5 flex items-start gap-3 text-xs leading-relaxed text-slate-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-400" aria-hidden="true" />
        <div>
          <span className="font-semibold text-white">{UI_TEXT.atomModel.disclaimerTitle[lang]}: </span>
          <span>{UI_TEXT.atomModel.disclaimerText[lang]}</span>
        </div>
      </div>
    </div>
  );
};
