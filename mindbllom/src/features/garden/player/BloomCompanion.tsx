'use client';

// BloomCompanion: Living, autonomous 3D AI botanical companion.
// Lives in the Garden, wanders to waypoints, reacts to player proximity,
// displays thinking and speaking visual states during conversations.

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTerrainHeight } from '../utils/terrainMath';
import type { BloomState, InteractiveObjectConfig } from '../types/garden.types';

interface BloomCompanionProps {
  bloomState: BloomState;
  onOpenChat: () => void;
  onRegisterObject: (obj: InteractiveObjectConfig) => void;
  playerPositionRef?: React.RefObject<THREE.Vector3>;
}

// Bloom's favorite waypoints across the garden
const BLOOM_WAYPOINTS: { pos: [number, number]; state: BloomState; waitTime: number }[] = [
  { pos: [2.2, -1.8], state: 'idle', waitTime: 12 }, // Bloom's Haven (under blossom tree)
  { pos: [-4.2, -8.5], state: 'looking_at_pond', waitTime: 9 }, // Pond shore
  { pos: [-6.5, 2.5], state: 'inspecting_flower', waitTime: 10 }, // Wildflower meadow
  { pos: [5.2, 5.0], state: 'inspecting_flower', waitTime: 8 }, // Botanical nursery
  { pos: [1.8, -2.2], state: 'idle', waitTime: 14 }, // Back to Haven
];

export function BloomCompanion({
  bloomState,
  onOpenChat,
  onRegisterObject,
  playerPositionRef,
}: BloomCompanionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leafLeftRef = useRef<THREE.Mesh>(null);
  const leafRightRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  // Position & autonomous AI wander state
  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3(2.2, getTerrainHeight(2.2, -1.8), -1.8));
  const currentWaypointIdx = useRef(0);
  const waypointTimer = useRef(0);
  const [internalState, setInternalState] = useState<BloomState>('idle');
  const [isWandering, setIsWandering] = useState(false);

  // Active state combines external (e.g. thinking/speaking during chat) and internal (wandering/inspecting)
  const activeState = bloomState !== 'idle' ? bloomState : internalState;

  // Register interactive object for proximity system
  useEffect(() => {
    const obj: InteractiveObjectConfig = {
      id: 'bloom_companion',
      type: 'bloom',
      position: [currentPosRef.current.x, currentPosRef.current.y, currentPosRef.current.z],
      interactionRadius: 3.2,
      promptLabel: 'Talk with Bloom',
      actionKey: 'E',
      onInteract: () => onOpenChat(),
    };
    onRegisterObject(obj);
  }, [onOpenChat, onRegisterObject]);

  useFrame((_state, delta) => {
    const t = _state.clock.getElapsedTime();
    const pos = currentPosRef.current;
    const playerPos = playerPositionRef?.current;

    // Check proximity to player
    const distToPlayer = playerPos ? pos.distanceTo(playerPos) : 99;
    const isPlayerClose = distToPlayer < 4.0;

    // Autonomous wandering logic when not locked in conversation
    if (bloomState === 'idle' && !isPlayerClose) {
      waypointTimer.current += delta;
      const targetWaypoint = BLOOM_WAYPOINTS[currentWaypointIdx.current];

      if (isWandering) {
        // Move towards target
        const targetX = targetWaypoint.pos[0];
        const targetZ = targetWaypoint.pos[1];
        const dx = targetX - pos.x;
        const dz = targetZ - pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 0.3) {
          // Arrived
          setIsWandering(false);
          setInternalState(targetWaypoint.state);
          waypointTimer.current = 0;
        } else {
          const moveSpeed = 1.2 * delta;
          pos.x += (dx / dist) * moveSpeed;
          pos.z += (dz / dist) * moveSpeed;
          pos.y = getTerrainHeight(pos.x, pos.z);

          if (groupRef.current) {
            const moveAngle = Math.atan2(dx, dz);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, moveAngle, 0.1);
          }
        }
      } else {
        // Waiting at waypoint
        if (waypointTimer.current >= targetWaypoint.waitTime) {
          currentWaypointIdx.current = (currentWaypointIdx.current + 1) % BLOOM_WAYPOINTS.length;
          setIsWandering(true);
          setInternalState('wandering');
          waypointTimer.current = 0;
        }
      }
    } else if (isPlayerClose && bloomState === 'idle') {
      // Turn to face player warmly
      if (playerPos && groupRef.current) {
        const dx = playerPos.x - pos.x;
        const dz = playerPos.z - pos.z;
        const lookAngle = Math.atan2(dx, dz);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, lookAngle, 0.12);
      }
    }

    // Keep Bloom perfectly grounded on terrain
    pos.y = getTerrainHeight(pos.x, pos.z);
    if (groupRef.current) {
      groupRef.current.position.copy(pos);
    }

    // ==================== ARTICULATED ANIMATION ====================
    if (bodyRef.current) {
      if (activeState === 'thinking') {
        // Gentle floating & thoughtful tilt
        bodyRef.current.position.y = 0.52 + Math.sin(t * 4) * 0.06;
        bodyRef.current.rotation.z = Math.sin(t * 2) * 0.12;
        bodyRef.current.rotation.x = 0.08;
      } else if (activeState === 'speaking') {
        // Cheerful speaking bounce
        bodyRef.current.position.y = 0.46 + Math.abs(Math.sin(t * 6)) * 0.08;
        bodyRef.current.rotation.z = Math.sin(t * 5) * 0.06;
        bodyRef.current.rotation.x = 0;
      } else if (isWandering || activeState === 'wandering') {
        // Hopping walk
        bodyRef.current.position.y = 0.45 + Math.abs(Math.sin(t * 7)) * 0.09;
        bodyRef.current.rotation.z = Math.sin(t * 7) * 0.05;
        bodyRef.current.rotation.x = 0.06;
      } else if (activeState === 'inspecting_flower') {
        // Inquisitive forward lean
        bodyRef.current.position.y = 0.38 + Math.sin(t * 2) * 0.02;
        bodyRef.current.rotation.x = 0.22;
        bodyRef.current.rotation.z = Math.sin(t * 1.5) * 0.04;
      } else {
        // Calm serene breathing
        bodyRef.current.position.y = 0.45 + Math.sin(t * 2.2) * 0.035;
        bodyRef.current.scale.set(
          1 + Math.sin(t * 2.2) * 0.02,
          1 + Math.cos(t * 2.2) * 0.03,
          1 + Math.sin(t * 2.2) * 0.02
        );
        bodyRef.current.rotation.set(0, 0, 0);
      }
    }

    // Leaf Flutter
    if (leafLeftRef.current && leafRightRef.current) {
      const flutterSpeed = activeState === 'speaking' || activeState === 'thinking' ? 9 : isWandering ? 8 : 3;
      leafLeftRef.current.rotation.z = 0.4 + Math.sin(t * flutterSpeed) * 0.18;
      leafRightRef.current.rotation.z = -0.4 - Math.sin(t * flutterSpeed + 0.4) * 0.18;
    }

    // Blinking
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkCycle = t % 3.8;
      const isBlinking = blinkCycle > 3.65;
      eyeLeftRef.current.scale.y = isBlinking ? 0.1 : 1;
      eyeRightRef.current.scale.y = isBlinking ? 0.1 : 1;
    }

    // Thinking Halo / Glow
    if (haloRef.current) {
      haloRef.current.visible = activeState === 'thinking';
      if (activeState === 'thinking') {
        haloRef.current.rotation.y = t * 2;
        haloRef.current.scale.setScalar(1 + Math.sin(t * 6) * 0.15);
      }
    }
  });

  return (
    <group ref={groupRef} position={[2.2, 0, -1.8]}>
      {/* Ground Contact Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 16]} />
        <meshBasicMaterial color="#1B2B1E" opacity={0.35} transparent />
      </mesh>

      {/* Main Articulated Body Group */}
      <group ref={bodyRef} position={[0, 0.45, 0]}>
        {/* Soft Botanical Head/Body (Pear-like friendly shape) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.38, 20, 20]} />
          <meshStandardMaterial
            color="#FDFBF7" // Warm artisan porcelain / soft cream
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        {/* Muted Sage Botanical Body Cape/Vest */}
        <mesh position={[0, -0.12, 0]} scale={[1.04, 0.65, 1.04]} castShadow>
          <sphereGeometry args={[0.36, 18, 18]} />
          <meshStandardMaterial
            color="#7E9F83" // Muted Sage
            roughness={0.75}
            metalness={0.02}
          />
        </mesh>

        {/* Expressive Soft Charcoal Eyes */}
        <mesh ref={eyeLeftRef} position={[-0.11, 0.06, 0.32]} castShadow>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#2B2B28" roughness={0.3} />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.11, 0.06, 0.32]} castShadow>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#2B2B28" roughness={0.3} />
        </mesh>

        {/* Rosy Cheeks (Soft Dusty Pink) */}
        <mesh position={[-0.18, -0.02, 0.31]}>
          <circleGeometry args={[0.04, 12]} />
          <meshBasicMaterial color="#E8A598" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0.18, -0.02, 0.31]}>
          <circleGeometry args={[0.04, 12]} />
          <meshBasicMaterial color="#E8A598" opacity={0.6} transparent />
        </mesh>

        {/* Botanical Sprout on Head */}
        <group position={[0, 0.36, 0]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 0.12, 6]} />
            <meshStandardMaterial color="#5E8362" roughness={0.8} />
          </mesh>
          <mesh ref={leafLeftRef} position={[-0.07, 0.13, 0]} rotation={[0, 0, 0.4]} castShadow>
            <coneGeometry args={[0.06, 0.16, 6]} />
            <meshStandardMaterial color="#709F75" roughness={0.7} />
          </mesh>
          <mesh ref={leafRightRef} position={[0.07, 0.13, 0]} rotation={[0, 0, -0.4]} castShadow>
            <coneGeometry args={[0.06, 0.16, 6]} />
            <meshStandardMaterial color="#88B88E" roughness={0.7} />
          </mesh>
        </group>

        {/* Thinking Pulsing Halo */}
        <mesh ref={haloRef} position={[0, 0.52, 0]} visible={false}>
          <torusGeometry args={[0.26, 0.03, 8, 24]} />
          <meshBasicMaterial color="#FFD166" transparent opacity={0.75} />
        </mesh>
      </group>
    </group>
  );
}
