import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CircuitCanvasProps {
  components: string[];
  current: number;
  circuitState: 'CONNECTED' | 'DISCONNECTED' | 'SHORT_CIRCUIT';
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  components,
  current,
  circuitState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A1929); // Dark blue canvas background
    scene.fog = new THREE.FogExp2(0x0A1929, 0.015);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 8, 12);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls Setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below ground
    controls.minDistance = 3;
    controls.maxDistance = 20;

    // 5. Lights Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 15, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const gridHelper = new THREE.GridHelper(30, 30, 0x173A5E, 0x132F4C);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // 6. Meshes Storage
    const meshes: THREE.Object3D[] = [];
    const connectionLines: THREE.Line[] = [];
    const electronParticles: { mesh: THREE.Mesh; progress: number; path: THREE.Vector3[] }[] = [];

    // Positions of circuit components in 3D space
    // Ranged in a loop: Battery (Left), Resistor (Top/Middle), LED (Right)
    const positions = {
      BATTERY: new THREE.Vector3(-4, 0.5, 0),
      RESISTOR: new THREE.Vector3(0, 0.5, 2),
      LED: new THREE.Vector3(4, 0.5, 0),
      NEG_NODE: new THREE.Vector3(0, 0.5, -2) // Completes loop
    };

    // Component Styles & Colors
    const colors = {
      BATTERY: 0x10375C, // Dark Blue
      RESISTOR: 0xd2a679, // Resistor Brown
      LED: circuitState === 'SHORT_CIRCUIT' ? 0xff3b30 : (current > 0 ? 0x00ffd8 : 0x777777),
      WIRE: circuitState === 'SHORT_CIRCUIT' ? 0xff3b30 : 0x00A29A,
      ELECTRON: circuitState === 'SHORT_CIRCUIT' ? 0xff5533 : 0x00ffd8
    };

    // Render Components
    const createCircuit = () => {
      // Clean up previous meshes
      meshes.forEach(m => scene.remove(m));
      connectionLines.forEach(l => scene.remove(l));
      electronParticles.forEach(p => scene.remove(p.mesh));
      meshes.length = 0;
      connectionLines.length = 0;
      electronParticles.length = 0;

      // 1. BATTERY (Always present)
      const batteryGroup = new THREE.Group();
      batteryGroup.position.copy(positions.BATTERY);
      
      const batGeo = new THREE.BoxGeometry(1.5, 1.2, 1);
      const batMat = new THREE.MeshStandardMaterial({ color: colors.BATTERY, roughness: 0.2 });
      const batMesh = new THREE.Mesh(batGeo, batMat);
      batteryGroup.add(batMesh);

      // Battery Terminals (+ and - indicators)
      const termGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
      const posTermMat = new THREE.MeshStandardMaterial({ color: 0xff3333 }); // Red positive
      const negTermMat = new THREE.MeshStandardMaterial({ color: 0x3333ff }); // Blue negative

      const posTerm = new THREE.Mesh(termGeo, posTermMat);
      posTerm.position.set(-0.4, 0.7, 0);
      const negTerm = new THREE.Mesh(termGeo, negTermMat);
      negTerm.position.set(0.4, 0.7, 0);

      batteryGroup.add(posTerm, negTerm);
      scene.add(batteryGroup);
      meshes.push(batteryGroup);

      // 2. RESISTOR (If connected)
      if (components.includes('RESISTOR')) {
        const resistorGroup = new THREE.Group();
        resistorGroup.position.copy(positions.RESISTOR);

        // Resistor body
        const resBodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.6, 16);
        resBodyGeo.rotateZ(Math.PI / 2);
        const resBodyMat = new THREE.MeshStandardMaterial({ color: colors.RESISTOR, roughness: 0.4 });
        const resBody = new THREE.Mesh(resBodyGeo, resBodyMat);
        resistorGroup.add(resBody);

        // Color stripes (Ohm representation)
        const stripeGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 16);
        stripeGeo.rotateZ(Math.PI / 2);
        const stripeColors = [0x8b5a2b, 0x000000, 0xff0000]; // Brown, Black, Red stripes
        stripeColors.forEach((color, idx) => {
          const stripeMat = new THREE.MeshBasicMaterial({ color });
          const stripe = new THREE.Mesh(stripeGeo, stripeMat);
          stripe.position.x = -0.4 + idx * 0.4;
          resistorGroup.add(stripe);
        });

        scene.add(resistorGroup);
        meshes.push(resistorGroup);
      }

      // 3. LED (If connected)
      if (components.includes('LED')) {
        const ledGroup = new THREE.Group();
        ledGroup.position.copy(positions.LED);

        // Base/holder
        const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        ledGroup.add(base);

        // LED Bulb
        const bulbGeo = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: colors.LED,
          emissive: colors.LED,
          emissiveIntensity: current > 0 ? 1.5 : 0.1,
          transparent: true,
          opacity: 0.8
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.y = 0.15;
        ledGroup.add(bulb);

        // Aura light source when glowing
        if (current > 0) {
          const pointLight = new THREE.PointLight(colors.LED, 1.5, 5);
          pointLight.position.y = 0.5;
          ledGroup.add(pointLight);
        }

        scene.add(ledGroup);
        meshes.push(ledGroup);
      }

      // 4. WIRES (Neon Paths)
      // Path 1: Battery POS to Resistor
      // Path 2: Resistor to LED
      // Path 3: LED to Battery NEG
      const wirePaths: THREE.Vector3[][] = [];

      if (components.includes('RESISTOR') && components.includes('LED')) {
        // Full loop
        wirePaths.push([positions.BATTERY, positions.RESISTOR]);
        wirePaths.push([positions.RESISTOR, positions.LED]);
        wirePaths.push([positions.LED, positions.NEG_NODE, positions.BATTERY]);
      } else if (components.includes('RESISTOR')) {
        wirePaths.push([positions.BATTERY, positions.RESISTOR]);
      } else if (components.includes('LED')) {
        // Hook directly
        wirePaths.push([positions.BATTERY, positions.LED]);
        wirePaths.push([positions.LED, positions.NEG_NODE, positions.BATTERY]);
      }

      // Render wire lines
      wirePaths.forEach(pathPoints => {
        const curve = new THREE.CatmullRomCurve3(pathPoints);
        const points = curve.getPoints(50);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: colors.WIRE,
          linewidth: 3 // Note: WebGL standard ignores linewidth, but good practice
        });
        const wire = new THREE.Line(lineGeo, lineMat);
        scene.add(wire);
        connectionLines.push(wire);
      });

      // 5. ELECTRON PARTICLES (Flow animation)
      if (current > 0 && wirePaths.length > 0) {
        // Collect all points into one loop
        const fullLoopPoints: THREE.Vector3[] = [];
        wirePaths.forEach((pathPoints, pIdx) => {
          const curve = new THREE.CatmullRomCurve3(pathPoints);
          const points = curve.getPoints(30);
          // Avoid duplicating end points
          if (pIdx > 0) points.shift();
          fullLoopPoints.push(...points);
        });

        // Add electron meshes along path
        const electronCount = circuitState === 'SHORT_CIRCUIT' ? 25 : 12;
        const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const particleMat = new THREE.MeshBasicMaterial({
          color: colors.ELECTRON,
        });

        for (let i = 0; i < electronCount; i++) {
          const pMesh = new THREE.Mesh(particleGeo, particleMat);
          scene.add(pMesh);
          electronParticles.push({
            mesh: pMesh,
            progress: i / electronCount,
            path: fullLoopPoints
          });
        }
      }
    };

    createCircuit();

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Electron Flow Speed logic
      // Short circuit flows insanely fast
      let flowSpeed = 0.5;
      if (circuitState === 'SHORT_CIRCUIT') {
        flowSpeed = 2.0;
      } else if (current > 0) {
        flowSpeed = 0.2 + (current / 50); // scales with mA
      } else {
        flowSpeed = 0;
      }

      // Animate particles
      electronParticles.forEach(p => {
        if (flowSpeed > 0 && p.path.length > 0) {
          p.progress += delta * flowSpeed;
          if (p.progress >= 1.0) p.progress -= 1.0;

          // Find index on path
          const pathIndex = Math.floor(p.progress * (p.path.length - 1));
          const nextIndex = (pathIndex + 1) % p.path.length;
          const ratio = (p.progress * (p.path.length - 1)) % 1.0;

          const currentPoint = p.path[pathIndex];
          const nextPoint = p.path[nextIndex];

          if (currentPoint && nextPoint) {
            p.mesh.position.lerpVectors(currentPoint, nextPoint, ratio);
          }
        }
      });

      // Subtle rotation/hover on component blocks
      meshes.forEach((mesh, idx) => {
        mesh.position.y = positions[idx === 0 ? 'BATTERY' : (idx === 1 ? 'RESISTOR' : 'LED')].y + Math.sin(clock.getElapsedTime() * 2 + idx) * 0.08;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose geometries & materials
      scene.clear();
    };
  }, [components, current, circuitState]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden' }} />
      
      {/* Dynamic connection indicator badge */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(10, 25, 41, 0.85)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${circuitState === 'SHORT_CIRCUIT' ? 'var(--red-neon)' : 'var(--border-glass)'}`,
        padding: '8px 16px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: circuitState === 'SHORT_CIRCUIT' ? 'var(--red-neon)' : (current > 0 ? 'var(--cyan-neon)' : '#777777'),
          boxShadow: circuitState === 'SHORT_CIRCUIT' 
            ? '0 0 10px var(--red-neon)' 
            : (current > 0 ? '0 0 10px var(--cyan-neon)' : 'none')
        }} />
        <span>
          {circuitState === 'SHORT_CIRCUIT' 
            ? 'SHORT CIRCUIT!' 
            : (current > 0 ? 'ESP32 Sirkuit Aktif' : 'Menunggu Koneksi Sirkuit...')}
        </span>
      </div>
    </div>
  );
};
