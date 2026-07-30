import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* Shared scroll progress (0..1) written by one passive listener */
const scrollRef = { current: 0 };
if (typeof window !== "undefined") {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollRef.current = max > 0 ? window.scrollY / max : 0;
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );
}

/* ── Aurora volumetric backdrop ─────────────────────── */
function Aurora() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          uniform float uTime; uniform float uScroll; uniform vec2 uMouse;

          vec3 hash3(vec2 p){
            vec3 q = vec3(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)));
            return fract(sin(q)*43758.5453);
          }
          float noise(vec2 p){
            vec2 i = floor(p); vec2 f = fract(p);
            vec2 u = f*f*(3.0-2.0*f);
            float a = hash3(i).x, b = hash3(i+vec2(1.0,0.0)).x;
            float c = hash3(i+vec2(0.0,1.0)).x, d = hash3(i+vec2(1.0,1.0)).x;
            return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
          }
          float fbm(vec2 p){
            float v = 0.0, a = 0.5;
            for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
            return v;
          }

          void main(){
            vec2 uv = vUv;
            vec2 p = uv * vec2(2.6, 1.6);
            p.y -= uScroll * 0.55;
            float t = uTime * 0.024;

            float n1 = fbm(p + vec2(t, -t*0.6) + uMouse*0.06);
            float n2 = fbm(p*1.7 + vec2(-t*0.8, t*0.4) + 4.2);

            vec3 deep   = vec3(0.012, 0.024, 0.055);
            vec3 blue   = vec3(0.055, 0.196, 0.541);
            vec3 cyan   = vec3(0.086, 0.541, 0.694);
            vec3 violet = vec3(0.157, 0.098, 0.400);

            float band = smoothstep(0.28, 0.92, n1);
            float band2 = smoothstep(0.42, 0.98, n2);

            vec3 col = deep;
            col = mix(col, blue, band * 0.72);
            col = mix(col, cyan, band2 * 0.30);
            col = mix(col, violet, pow(1.0-uv.y, 2.4) * 0.35);

            // volumetric light shaft from upper centre
            vec2 lp = vec2(0.5 + uMouse.x*0.05, 1.06);
            float d = distance(uv*vec2(1.5,1.0), lp*vec2(1.5,1.0));
            col += vec3(0.10,0.28,0.60) * smoothstep(1.15, 0.0, d) * 0.55;

            // vignette
            float vig = smoothstep(1.25, 0.25, distance(uv, vec2(0.5)));
            col *= mix(0.35, 1.0, vig);

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );

  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uScroll.value +=
      (scrollRef.current - mat.uniforms.uScroll.value) * 0.05;
    mat.uniforms.uMouse.value.set(pointer.x, pointer.y);
  });

  const { viewport } = useThree();
  return (
    <mesh position={[0, 0, -26]} material={mat}>
      <planeGeometry args={[viewport.width * 6, viewport.height * 6]} />
    </mesh>
  );
}

/* ── Drifting particle field ────────────────────────── */
function Particles({ count }: { count: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4;
      seed[i] = Math.random() * 6.28;
      size[i] = Math.random() * 2.4 + 0.6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPixel: { value: 1 } },
        vertexShader: /* glsl */ `
          attribute float aSeed; attribute float aSize;
          uniform float uTime; uniform float uPixel;
          varying float vAlpha;
          void main(){
            vec3 p = position;
            p.y += sin(uTime*0.10 + aSeed) * 0.9 + mod(uTime*0.22 + aSeed, 20.0) - 10.0;
            p.x += cos(uTime*0.08 + aSeed*1.7) * 0.7;
            vec4 mv = modelViewMatrix * vec4(p,1.0);
            gl_Position = projectionMatrix * mv;
            float twinkle = 0.45 + 0.55 * sin(uTime*0.9 + aSeed*3.1);
            vAlpha = twinkle * smoothstep(28.0, 4.0, -mv.z);
            gl_PointSize = aSize * uPixel * (110.0 / -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          void main(){
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float a = smoothstep(0.5, 0.0, d);
            vec3 col = mix(vec3(0.42,0.72,1.0), vec3(0.62,0.94,1.0), smoothstep(0.0,0.35,d));
            gl_FragColor = vec4(col, a * vAlpha * 0.72);
          }
        `,
      }),
    []
  );

  const { gl } = useThree();
  useEffect(() => {
    mat.uniforms.uPixel.value = gl.getPixelRatio();
  }, [gl, mat]);

  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
  });

  return <points geometry={geo} material={mat} />;
}

/* ── Neural network: nodes + living synapses ────────── */
function NeuralNet({ nodes: nodeCount }: { nodes: number }) {
  const group = useRef<THREE.Group>(null);

  const { basePos, phases, nodeGeo, nodeMat, lineGeo, lineMat, pairs } = useMemo(() => {
    const basePos: THREE.Vector3[] = [];
    const phases: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const r = 5 + Math.random() * 6.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      basePos.push(
        new THREE.Vector3(
          r * Math.sin(ph) * Math.cos(th),
          r * Math.cos(ph) * 0.62,
          r * Math.sin(ph) * Math.sin(th) * 0.7 - 3
        )
      );
      phases.push(Math.random() * 6.28);
    }

    const pairs: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (basePos[i].distanceTo(basePos[j]) < 3.6 && pairs.length < 220) {
          pairs.push([i, j]);
        }
      }
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(nodeCount * 3), 3)
    );
    const nodeMat = new THREE.PointsMaterial({
      size: 0.13,
      color: new THREE.Color("#7dd3fc"),
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(pairs.length * 6), 3)
    );
    lineGeo.setAttribute(
      "aOpacity",
      new THREE.BufferAttribute(new Float32Array(pairs.length * 2), 1)
    );
    const lineMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color("#3b82f6") } },
      vertexShader: /* glsl */ `
        attribute float aOpacity; varying float vO;
        void main(){ vO = aOpacity; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; varying float vO;
        void main(){ gl_FragColor = vec4(uColor, vO); }
      `,
    });

    return { basePos, phases, nodeGeo, nodeMat, lineGeo, lineMat, pairs };
  }, [nodeCount]);

  const live = useRef(basePos.map((v) => v.clone()));
  const t = useRef(0);

  useFrame((_, dt) => {
    t.current += dt;
    const time = t.current;
    const np = nodeGeo.attributes.position.array as Float32Array;

    for (let i = 0; i < basePos.length; i++) {
      const b = basePos[i];
      const p = live.current[i];
      p.set(
        b.x + Math.sin(time * 0.22 + phases[i]) * 0.42,
        b.y + Math.cos(time * 0.18 + phases[i] * 1.4) * 0.42,
        b.z + Math.sin(time * 0.15 + phases[i] * 0.7) * 0.32
      );
      np[i * 3] = p.x;
      np[i * 3 + 1] = p.y;
      np[i * 3 + 2] = p.z;
    }
    nodeGeo.attributes.position.needsUpdate = true;

    const lp = lineGeo.attributes.position.array as Float32Array;
    const lo = lineGeo.attributes.aOpacity.array as Float32Array;
    for (let k = 0; k < pairs.length; k++) {
      const [a, b] = pairs[k];
      const pa = live.current[a];
      const pb = live.current[b];
      lp[k * 6] = pa.x;
      lp[k * 6 + 1] = pa.y;
      lp[k * 6 + 2] = pa.z;
      lp[k * 6 + 3] = pb.x;
      lp[k * 6 + 4] = pb.y;
      lp[k * 6 + 5] = pb.z;
      const d = pa.distanceTo(pb);
      const pulse = 0.5 + 0.5 * Math.sin(time * 1.1 + k * 0.55);
      const o = Math.max(0, 1 - d / 3.8) * (0.10 + pulse * 0.22);
      lo[k * 2] = o;
      lo[k * 2 + 1] = o;
    }
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.aOpacity.needsUpdate = true;

    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.045) * 0.28 + pointer.x * 0.12;
      group.current.rotation.x = pointer.y * 0.06;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo} material={lineMat} />
      <points geometry={nodeGeo} material={nodeMat} />
    </group>
  );
}

/* ── Floating molecules ─────────────────────────────── */
function Molecule({
  position,
  scale,
  speed,
  color,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const atoms = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 0);
    const pts: THREE.Vector3[] = [];
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      if (!pts.some((p) => p.distanceTo(v) < 0.05)) pts.push(v);
    }
    return pts;
  }, []);

  const t = useRef(Math.random() * 100);
  useFrame((_, dt) => {
    t.current += dt;
    if (!ref.current) return;
    ref.current.rotation.y += dt * speed;
    ref.current.rotation.x += dt * speed * 0.55;
    ref.current.position.y = position[1] + Math.sin(t.current * 0.35) * 0.55;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
      </mesh>
      {atoms.map((p, i) => (
        <mesh key={i} position={p.toArray()}>
          <sphereGeometry args={[0.075, 10, 10]} />
          <meshBasicMaterial color={color} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Holographic ground grid ────────────────────────── */
function HoloGrid() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv; uniform float uTime;
          float line(float x, float w){ return smoothstep(w, 0.0, abs(fract(x)-0.5)-0.5+w); }
          void main(){
            vec2 uv = vUv * 42.0;
            uv.y += uTime * 0.42;
            float g = max(line(uv.x, 0.03), line(uv.y, 0.03));
            float fade = smoothstep(0.0, 0.42, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
            float side = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
            vec3 col = mix(vec3(0.13,0.43,0.95), vec3(0.20,0.85,0.99), vUv.y);
            gl_FragColor = vec4(col, g * fade * side * 0.34);
          }
        `,
      }),
    []
  );
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation={[-Math.PI / 2.05, 0, 0]} position={[0, -7.4, -6]} material={mat}>
      <planeGeometry args={[70, 60, 1, 1]} />
    </mesh>
  );
}

/* ── Camera rig — depth from mouse + scroll dolly ───── */
function Rig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 14));
  useFrame(() => {
    target.current.set(
      pointer.x * 1.35,
      -pointer.y * 0.85 - scrollRef.current * 1.6,
      14 - scrollRef.current * 2.2
    );
    camera.position.lerp(target.current, 0.035);
    camera.lookAt(0, -scrollRef.current * 0.8, -4);
  });
  return null;
}

export default function Background() {
  const isSmall = typeof window !== "undefined" && window.innerWidth < 820;
  const particleCount = isSmall ? 500 : 1500;
  const nodeCount = isSmall ? 40 : 78;

  return (
    <Canvas
      className="!fixed inset-0"
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.6]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 0, 14], fov: 52, near: 0.1, far: 120 }}
    >
      <fog attach="fog" args={["#04070f", 14, 44]} />
      <Aurora />
      <HoloGrid />
      <NeuralNet nodes={nodeCount} />
      <Particles count={particleCount} />
      {!isSmall && (
        <>
          <Molecule position={[-7.2, 2.4, -2]} scale={1.15} speed={0.14} color="#60a5fa" />
          <Molecule position={[7.6, -1.6, -3.5]} scale={1.5} speed={0.1} color="#22d3ee" />
          <Molecule position={[4.4, 4.2, -6]} scale={0.9} speed={0.18} color="#818cf8" />
          <Molecule position={[-5.6, -3.8, -5]} scale={1.05} speed={0.12} color="#38bdf8" />
        </>
      )}
      <Rig />
    </Canvas>
  );
}
