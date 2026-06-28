import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useAppStore } from '../store/useAppStore';
import { Trash2, RefreshCw } from 'lucide-react';

interface CircuitCanvasProps {
  components: string[];
  current: number;
  circuitState: 'CONNECTED' | 'DISCONNECTED' | 'SHORT_CIRCUIT';
}

interface ComponentInstance {
  id: string;
  type: 'BATTERY' | 'RESISTOR' | 'LED';
  position: THREE.Vector3;
}

interface ConnectionInstance {
  id: string;
  from: { componentId: string; terminalId: string };
  to: { componentId: string; terminalId: string };
}

// Direct mesh reference for raycasting -- stores the actual mesh object, not just a UUID
interface TerminalEntry {
  mesh: THREE.Mesh;
  componentId: string;
  terminalId: string;
}

interface ComponentEntry {
  mesh: THREE.Mesh;
  componentId: string;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  components,
  current,
  circuitState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [connectionsCount, setConnectionsCount] = useState<number>(0);
  const [isWiringMode, setIsWiringMode] = useState<boolean>(false);

  const componentsRef = useRef<ComponentInstance[]>([]);
  const connectionsRef = useRef<ConnectionInstance[]>([]);
  const sceneMeshesRef = useRef<THREE.Object3D[]>([]);
  const electronParticlesRef = useRef<{ mesh: THREE.Mesh; progress: number; path: THREE.Vector3[] }[]>([]);

  // Direct mesh object references — stable across clicks, rebuilt only on redrawScene()
  const terminalEntriesRef = useRef<TerminalEntry[]>([]);
  const componentEntriesRef = useRef<ComponentEntry[]>([]);

  const currentRef = useRef(current);
  const circuitStateRef = useRef(circuitState);

  // Wiring state — stored in refs for access inside closures without stale values
  const tempLineRef = useRef<THREE.Line | null>(null);
  const activeWiringStartRef = useRef<{ componentId: string; terminalId: string } | null>(null);
  const selectedComponentIdRef = useRef<string | null>(null);

  useEffect(() => {
    currentRef.current = current;
    circuitStateRef.current = circuitState;
  }, [current, circuitState]);

  const getTerminalWorldPosition = (comp: ComponentInstance, terminalId: string): THREE.Vector3 => {
    const offset = new THREE.Vector3();
    if (comp.type === 'BATTERY') {
      if (terminalId === 'POS') offset.set(-0.4, 0.7, 0);
      else if (terminalId === 'NEG') offset.set(0.4, 0.7, 0);
    } else if (comp.type === 'RESISTOR') {
      if (terminalId === 'T1') offset.set(-0.8, 0.5, 0);
      else if (terminalId === 'T2') offset.set(0.8, 0.5, 0);
    } else if (comp.type === 'LED') {
      if (terminalId === 'POS') offset.set(-0.3, 0.5, 0);
      else if (terminalId === 'NEG') offset.set(0.3, 0.5, 0);
    }
    return new THREE.Vector3().copy(comp.position).add(offset);
  };

  const findClosedLoop = (componentsList: ComponentInstance[], connectionsList: ConnectionInstance[]) => {
    const battery = componentsList.find(c => c.type === 'BATTERY');
    if (!battery) return { hasLoop: false, componentsInLoop: ['BATTERY'] };

    const adj = new Map<string, string[]>();
    const addEdge = (u: string, v: string) => {
      if (!adj.has(u)) adj.set(u, []);
      if (!adj.has(v)) adj.set(v, []);
      adj.get(u)!.push(v);
      adj.get(v)!.push(u);
    };

    componentsList.forEach(comp => {
      if (comp.type === 'RESISTOR') addEdge(`${comp.id}:T1`, `${comp.id}:T2`);
      else if (comp.type === 'LED') addEdge(`${comp.id}:POS`, `${comp.id}:NEG`);
    });

    connectionsList.forEach(conn => {
      addEdge(`${conn.from.componentId}:${conn.from.terminalId}`, `${conn.to.componentId}:${conn.to.terminalId}`);
    });

    const start = `${battery.id}:POS`;
    const target = `${battery.id}:NEG`;
    const visited = new Set<string>([start]);
    const parent = new Map<string, string>();
    const queue = [start];
    let reached = false;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === target) { reached = true; break; }
      for (const neighbor of (adj.get(curr) || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, curr);
          queue.push(neighbor);
        }
      }
    }

    if (!reached) return { hasLoop: false, componentsInLoop: ['BATTERY'] };

    const loopComponents = new Set<string>();
    let curr = target;
    while (curr) {
      loopComponents.add(curr.split(':')[0]);
      curr = parent.get(curr)!;
    }

    const componentsInLoop = Array.from(loopComponents)
      .map(id => componentsList.find(c => c.id === id)?.type || '')
      .filter(Boolean);

    return { hasLoop: true, componentsInLoop };
  };

  const checkAndSyncCircuit = () => {
    const { hasLoop, componentsInLoop } = findClosedLoop(componentsRef.current, connectionsRef.current);
    const state: 'CONNECTED' | 'SHORT_CIRCUIT' =
      hasLoop && componentsInLoop.length === 1 && componentsInLoop.includes('BATTERY')
        ? 'SHORT_CIRCUIT'
        : 'CONNECTED';

    const socket = useAppStore.getState().socket;
    if (socket) {
      if (hasLoop) {
        useAppStore.getState().updateCircuitStateInHardware(state, componentsInLoop);
      } else {
        useAppStore.getState().updateCircuitStateInHardware('CONNECTED', ['BATTERY']);
      }
    }
  };

  // Draw the preview wire following the mouse cursor during wiring mode
  const drawTempWire = (targetPoint: THREE.Vector3) => {
    const scene = sceneRef.current;
    if (!scene || !activeWiringStartRef.current) return;

    // Dispose old temp line before creating a new one each frame
    if (tempLineRef.current) {
      scene.remove(tempLineRef.current);
      tempLineRef.current.geometry.dispose();
      (tempLineRef.current.material as THREE.Material).dispose();
      tempLineRef.current = null;
    }

    const startData = activeWiringStartRef.current;
    const startComp = componentsRef.current.find(c => c.id === startData.componentId);
    if (!startComp) return;

    const startWorldPos = getTerminalWorldPosition(startComp, startData.terminalId);
    const mid = new THREE.Vector3().addVectors(startWorldPos, targetPoint).multiplyScalar(0.5);
    mid.y += 1.5;

    const curve = new THREE.CatmullRomCurve3([startWorldPos, mid, targetPoint]);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
    const mat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    tempLineRef.current = line;
  };

  // Clear the temp wire from scene and memory
  const clearTempWire = () => {
    const scene = sceneRef.current;
    if (scene && tempLineRef.current) {
      scene.remove(tempLineRef.current);
      tempLineRef.current.geometry.dispose();
      (tempLineRef.current.material as THREE.Material).dispose();
      tempLineRef.current = null;
    }
  };

  /**
   * Full scene rebuild: clears all dynamic meshes and recreates them from state.
   * Also repopulates terminalEntriesRef and componentEntriesRef with fresh mesh object references.
   * Why: UUIDs are per-instance and change every creation, so we store direct mesh references
   * instead to make raycasting stable and accurate.
   */
  const redrawScene = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    // 1. Dispose old scene meshes
    sceneMeshesRef.current.forEach(m => {
      scene.remove(m);
      m.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) child.material.forEach(mat => mat.dispose());
          else child.material?.dispose();
        }
      });
    });
    sceneMeshesRef.current = [];
    terminalEntriesRef.current = [];
    componentEntriesRef.current = [];

    electronParticlesRef.current.forEach(p => {
      scene.remove(p.mesh);
      p.mesh.geometry?.dispose();
      if (Array.isArray(p.mesh.material)) p.mesh.material.forEach(m => m.dispose());
      else p.mesh.material?.dispose();
    });
    electronParticlesRef.current = [];

    const isShort = circuitStateRef.current === 'SHORT_CIRCUIT';
    const isFlowing = currentRef.current > 0;

    const colors = {
      BATTERY: 0x10375C,
      RESISTOR: 0xd2a679,
      LED: isShort ? 0xff3b30 : (isFlowing ? 0x00ffd8 : 0x777777),
      WIRE: isShort ? 0xff3b30 : (isFlowing ? 0x00A29A : 0x173A5E),
      ELECTRON: isShort ? 0xff5533 : 0x00ffd8
    };

    const addTerminalSphere = (
      parent: THREE.Group,
      position: THREE.Vector3,
      color: number,
      componentId: string,
      terminalId: string
    ) => {
      const geo = new THREE.SphereGeometry(0.18, 16, 16);
      const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.7 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(position);
      parent.add(mesh);
      // Store direct reference for raycasting
      terminalEntriesRef.current.push({ mesh, componentId, terminalId });
    };

    // 2. Build component meshes
    componentsRef.current.forEach(comp => {
      const group = new THREE.Group();
      group.position.copy(comp.position);
      group.name = comp.id;

      const isSelected = comp.id === selectedComponentIdRef.current;
      const emissiveVal = isSelected ? 0.25 : 0;

      if (comp.type === 'BATTERY') {
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 1.2, 1),
          new THREE.MeshStandardMaterial({ color: colors.BATTERY, roughness: 0.2, emissive: 0xffffff, emissiveIntensity: emissiveVal })
        );
        body.castShadow = true;
        group.add(body);
        componentEntriesRef.current.push({ mesh: body, componentId: comp.id });

        addTerminalSphere(group, new THREE.Vector3(-0.4, 0.7, 0), 0xff3333, comp.id, 'POS');
        addTerminalSphere(group, new THREE.Vector3(0.4, 0.7, 0), 0x3333ff, comp.id, 'NEG');

      } else if (comp.type === 'RESISTOR') {
        const bodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.6, 16);
        bodyGeo.rotateZ(Math.PI / 2);
        const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({
          color: colors.RESISTOR, roughness: 0.4, emissive: 0xffffff, emissiveIntensity: emissiveVal
        }));
        group.add(body);
        componentEntriesRef.current.push({ mesh: body, componentId: comp.id });

        const stripeGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 16);
        stripeGeo.rotateZ(Math.PI / 2);
        [0x8b5a2b, 0x000000, 0xff0000].forEach((color, idx) => {
          const stripe = new THREE.Mesh(stripeGeo, new THREE.MeshBasicMaterial({ color }));
          stripe.position.x = -0.4 + idx * 0.4;
          group.add(stripe);
        });

        addTerminalSphere(group, new THREE.Vector3(-0.8, 0.5, 0), 0x00a29a, comp.id, 'T1');
        addTerminalSphere(group, new THREE.Vector3(0.8, 0.5, 0), 0x00a29a, comp.id, 'T2');

      } else if (comp.type === 'LED') {
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16),
          new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffffff, emissiveIntensity: emissiveVal })
        );
        group.add(base);
        componentEntriesRef.current.push({ mesh: base, componentId: comp.id });

        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshStandardMaterial({
            color: colors.LED, emissive: colors.LED,
            emissiveIntensity: isFlowing ? 1.5 : 0.1,
            transparent: true, opacity: 0.8
          })
        );
        bulb.position.y = 0.15;
        group.add(bulb);

        if (isFlowing) {
          const light = new THREE.PointLight(colors.LED, 1.5, 5);
          light.position.y = 0.5;
          group.add(light);
        }

        addTerminalSphere(group, new THREE.Vector3(-0.3, 0.5, 0), 0xff3333, comp.id, 'POS');
        addTerminalSphere(group, new THREE.Vector3(0.3, 0.5, 0), 0x3333ff, comp.id, 'NEG');
      }

      scene.add(group);
      sceneMeshesRef.current.push(group);
    });

    // 3. Draw wires for confirmed connections
    connectionsRef.current.forEach(conn => {
      const fromComp = componentsRef.current.find(c => c.id === conn.from.componentId);
      const toComp = componentsRef.current.find(c => c.id === conn.to.componentId);
      if (!fromComp || !toComp) return;

      const pStart = getTerminalWorldPosition(fromComp, conn.from.terminalId);
      const pEnd = getTerminalWorldPosition(toComp, conn.to.terminalId);
      const mid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
      mid.y += 1.2;

      const curve = new THREE.CatmullRomCurve3([pStart, mid, pEnd]);
      const points = curve.getPoints(50);
      const wire = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: colors.WIRE, linewidth: 3 })
      );
      scene.add(wire);
      sceneMeshesRef.current.push(wire);

      if (isFlowing) {
        const electronCount = isShort ? 8 : 4;
        const pGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: colors.ELECTRON });
        for (let i = 0; i < electronCount; i++) {
          const pMesh = new THREE.Mesh(pGeo, pMat);
          scene.add(pMesh);
          electronParticlesRef.current.push({ mesh: pMesh, progress: i / electronCount, path: points });
        }
      }
    });
  };

  // Sync component list state to internal refs when parent component list changes
  useEffect(() => {
    componentsRef.current = componentsRef.current.filter(localComp => {
      if (!components.includes(localComp.type)) {
        connectionsRef.current = connectionsRef.current.filter(
          c => c.from.componentId !== localComp.id && c.to.componentId !== localComp.id
        );
        return false;
      }
      return true;
    });

    components.forEach((type, idx) => {
      const localCount = componentsRef.current.filter(c => c.type === type).length;
      const propCount = components.filter(t => t === type).length;
      if (localCount < propCount) {
        componentsRef.current.push({
          id: Math.random().toString(36).slice(2),
          type: type as any,
          position: new THREE.Vector3(-3 + idx * 2.2, 0.5, idx % 2 === 0 ? 1 : -1)
        });
      }
    });

    setConnectionsCount(connectionsRef.current.length);
    checkAndSyncCircuit();
    redrawScene();
  }, [components]);

  // Main Three.js scene lifecycle and event binding
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A1929);
    scene.fog = new THREE.FogExp2(0x0A1929, 0.015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 8, 12);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 15, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const grid = new THREE.GridHelper(30, 30, 0x173A5E, 0x132F4C);
    grid.position.y = -0.05;
    scene.add(grid);

    redrawScene();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let draggedComponentId: string | null = null;
    const dragOffset = new THREE.Vector3();
    const dragIntersect = new THREE.Vector3();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5);

    const getMouseNDC = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onMouseDown = (event: MouseEvent) => {
      getMouseNDC(event);
      raycaster.setFromCamera(mouse, camera);

      // --- Priority 1: Terminal hit detection (always, wiring or not) ---
      const terminalMeshes = terminalEntriesRef.current.map(e => e.mesh);
      const termHits = raycaster.intersectObjects(terminalMeshes, false);

      if (termHits.length > 0) {
        const hitMesh = termHits[0].object as THREE.Mesh;
        const entry = terminalEntriesRef.current.find(e => e.mesh === hitMesh);

        if (entry) {
          const startData = activeWiringStartRef.current;

          if (!startData) {
            // First click: enter wiring mode
            activeWiringStartRef.current = { componentId: entry.componentId, terminalId: entry.terminalId };
            controls.enabled = false;
            setIsWiringMode(true);
            // Do NOT call redrawScene here — keeps terminal mesh refs stable
          } else {
            // Second click: complete wire if different component
            if (entry.componentId !== startData.componentId) {
              const duplicate = connectionsRef.current.some(c =>
                (c.from.componentId === startData.componentId && c.from.terminalId === startData.terminalId &&
                  c.to.componentId === entry.componentId && c.to.terminalId === entry.terminalId) ||
                (c.from.componentId === entry.componentId && c.from.terminalId === entry.terminalId &&
                  c.to.componentId === startData.componentId && c.to.terminalId === startData.terminalId)
              );

              if (!duplicate) {
                connectionsRef.current.push({
                  id: Math.random().toString(36).slice(2),
                  from: { ...startData },
                  to: { componentId: entry.componentId, terminalId: entry.terminalId }
                });
                setConnectionsCount(connectionsRef.current.length);
                checkAndSyncCircuit();
              }
            }

            // Exit wiring mode and redraw with the new connection
            clearTempWire();
            activeWiringStartRef.current = null;
            controls.enabled = true;
            setIsWiringMode(false);
            redrawScene();
          }
          return;
        }
      }

      // --- Priority 2: Component drag (only when NOT in wiring mode) ---
      if (!activeWiringStartRef.current) {
        const componentMeshes = componentEntriesRef.current.map(e => e.mesh);
        const compHits = raycaster.intersectObjects(componentMeshes, false);

        if (compHits.length > 0) {
          const hitMesh = compHits[0].object as THREE.Mesh;
          const entry = componentEntriesRef.current.find(e => e.mesh === hitMesh);

          if (entry) {
            selectedComponentIdRef.current = entry.componentId;
            setSelectedComponentId(entry.componentId);
            draggedComponentId = entry.componentId;
            isDragging = true;
            controls.enabled = false;

            const comp = componentsRef.current.find(c => c.id === entry.componentId);
            if (comp) {
              raycaster.ray.intersectPlane(dragPlane, dragIntersect);
              dragOffset.copy(comp.position).sub(dragIntersect);
            }
            redrawScene();
            return;
          }
        }

        // Clicked empty space — deselect
        selectedComponentIdRef.current = null;
        setSelectedComponentId(null);
        redrawScene();
        return;
      }

      // --- Priority 3: Click on empty space while in wiring mode → cancel ---
      clearTempWire();
      activeWiringStartRef.current = null;
      controls.enabled = true;
      setIsWiringMode(false);
    };

    const onMouseMove = (event: MouseEvent) => {
      getMouseNDC(event);
      raycaster.setFromCamera(mouse, camera);

      if (isDragging && draggedComponentId) {
        const intersect = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(dragPlane, intersect)) {
          const comp = componentsRef.current.find(c => c.id === draggedComponentId);
          if (comp) {
            comp.position.copy(intersect).add(dragOffset);
            comp.position.x = Math.max(-12, Math.min(12, comp.position.x));
            comp.position.z = Math.max(-12, Math.min(12, comp.position.z));
            comp.position.y = 0.5;
            redrawScene();
          }
        }
      } else if (activeWiringStartRef.current) {
        // Draw preview wire to ground plane intersection
        const intersect = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(dragPlane, intersect)) {
          drawTempWire(intersect);
        }
      }
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        draggedComponentId = null;
        if (!activeWiringStartRef.current) {
          controls.enabled = true;
        }
        redrawScene();
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const currentVal = currentRef.current;
      const isShort = circuitStateRef.current === 'SHORT_CIRCUIT';

      let flowSpeed = 0;
      if (isShort) flowSpeed = 2.0;
      else if (currentVal > 0) flowSpeed = 0.2 + currentVal / 50;

      electronParticlesRef.current.forEach(p => {
        if (flowSpeed > 0 && p.path.length > 1) {
          p.progress += delta * flowSpeed;
          if (p.progress >= 1.0) p.progress -= 1.0;

          const pathIndex = Math.floor(p.progress * (p.path.length - 1));
          const nextIndex = Math.min(pathIndex + 1, p.path.length - 1);
          const ratio = (p.progress * (p.path.length - 1)) % 1.0;

          const a = p.path[pathIndex];
          const b = p.path[nextIndex];
          if (a && b) p.mesh.position.lerpVectors(a, b, ratio);
        }
      });

      // Subtle hover animation on component groups
      sceneMeshesRef.current.forEach(mesh => {
        if (mesh instanceof THREE.Group) {
          const comp = componentsRef.current.find(c => c.id === mesh.name);
          if (comp) {
            mesh.position.y = comp.position.y + Math.sin(elapsed * 2 + comp.position.x) * 0.06;
          }
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      try { containerRef.current?.removeChild(renderer.domElement); } catch (_) {}
      scene.clear();
    };
  }, []);

  const deleteSelectedComponent = () => {
    if (!selectedComponentId) return;
    const comp = componentsRef.current.find(c => c.id === selectedComponentId);
    if (comp && comp.type !== 'BATTERY') {
      connectionsRef.current = connectionsRef.current.filter(
        c => c.from.componentId !== selectedComponentId && c.to.componentId !== selectedComponentId
      );
      setConnectionsCount(connectionsRef.current.length);
      componentsRef.current = componentsRef.current.filter(c => c.id !== selectedComponentId);
      useAppStore.getState().updateCircuitStateInHardware('CONNECTED', componentsRef.current.map(c => c.type));
      selectedComponentIdRef.current = null;
      setSelectedComponentId(null);
      redrawScene();
    }
  };

  const clearAllWires = () => {
    connectionsRef.current = [];
    setConnectionsCount(0);
    checkAndSyncCircuit();
    redrawScene();
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden' }} />

      {/* HUD Overlay */}
      <div style={{
        position: 'absolute', top: '20px', left: '20px', right: '20px',
        pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '8px'
      }}>
        <div style={{
          alignSelf: 'flex-start',
          background: 'rgba(10, 25, 41, 0.85)', backdropFilter: 'blur(10px)',
          border: `1px solid ${circuitState === 'SHORT_CIRCUIT' ? 'var(--red-neon, #ff3b30)' : 'rgba(255,255,255,0.12)'}`,
          padding: '8px 16px', borderRadius: '24px',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '13px', fontWeight: '600', pointerEvents: 'auto'
        }}>
          <span style={{
            width: '9px', height: '9px', borderRadius: '50%', display: 'inline-block',
            backgroundColor: circuitState === 'SHORT_CIRCUIT' ? '#ff3b30' : (current > 0 ? '#00ffd8' : '#555'),
            boxShadow: circuitState === 'SHORT_CIRCUIT' ? '0 0 10px #ff3b30' : (current > 0 ? '0 0 10px #00ffd8' : 'none')
          }} />
          <span style={{ color: 'white' }}>
            {circuitState === 'SHORT_CIRCUIT' ? 'SHORT CIRCUIT!'
              : isWiringMode ? 'Mode Wiring — Klik terminal tujuan'
              : (current > 0 ? 'Sirkuit Aktif' : 'Rangkaian Terbuka')}
          </span>
        </div>

        <div style={{
          alignSelf: 'flex-start',
          background: 'rgba(10, 25, 41, 0.85)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '10px 16px', borderRadius: '12px',
          color: 'rgba(255,255,255,0.5)', fontSize: '12px', maxWidth: '520px', lineHeight: '1.6'
        }}>
          <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Cara pakai:</strong> Klik terminal bulat (+/-) untuk mulai kabel &rarr; klik terminal lain untuk sambungkan. Seret badan komponen untuk memindahkan.
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '12px', zIndex: 10 }}>
        {selectedComponentId && componentsRef.current.find(c => c.id === selectedComponentId)?.type !== 'BATTERY' && (
          <button
            onClick={deleteSelectedComponent}
            style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
              color: '#ff6b6b', padding: '8px 16px', borderRadius: '8px',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          >
            <Trash2 size={14} /> Hapus Komponen
          </button>
        )}
        {connectionsCount > 0 && (
          <button
            onClick={clearAllWires}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'white', padding: '8px 16px', borderRadius: '8px',
              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <RefreshCw size={14} /> Reset Kabel ({connectionsCount})
          </button>
        )}
      </div>
    </div>
  );
};
