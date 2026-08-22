'use client';

// PlayerCharacter: Stylized mindful student/gardener avatar with full animation state machine.
// Supports IDLE, WALK, PICK, WATER (with watering can prop and water stream), SIT, and TOUCH_WATER.

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type PlayerActionState = 'idle' | 'walk' | 'pick' | 'water' | 'sit' | 'touch_water';

interface PlayerCharacterProps {
  isMoving: boolean;
  isSitting?: boolean;
  actionState?: PlayerActionState;
}

export function PlayerCharacter({
  isMoving,
  isSitting = false,
  actionState = 'idle',
}: PlayerCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const wateringCanRef = useRef<THREE.Group>(null);
  const waterStreamRef = useRef<THREE.Points>(null);

  // Water droplet stream particles during watering action
  const dropletData = useMemo(() => {
    const count = 18;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = -Math.random() * 0.6;
      pos[i * 3 + 2] = 0.2 + Math.random() * 0.3;
    }
    return { count, pos };
  }, []);

  const currentAction = isSitting ? 'sit' : actionState !== 'idle' ? actionState : isMoving ? 'walk' : 'idle';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Reset watering can visibility
    if (wateringCanRef.current) {
      wateringCanRef.current.visible = currentAction === 'water';
    }

    // ==================== SITTING STATE ====================
    if (currentAction === 'sit') {
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.35 + Math.sin(t * 1.5) * 0.015;
        torsoRef.current.rotation.x = 0.04;
        torsoRef.current.rotation.z = 0;
      }
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2.2;
        rightLegRef.current.rotation.x = -Math.PI / 2.2;
        leftLegRef.current.position.set(-0.13, 0.32, 0.1);
        rightLegRef.current.position.set(0.13, 0.32, 0.1);
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -0.3;
        rightArmRef.current.rotation.x = -0.3;
      }
      return;
    }

    // ==================== PICKING FLOWER ACTION ====================
    if (currentAction === 'pick') {
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.32 + Math.sin(t * 4) * 0.02;
        torsoRef.current.rotation.x = 0.45; // Lean forward down to flower
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.2; // Reach down
        rightArmRef.current.rotation.z = -0.2;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.2;
      }
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.position.set(-0.13, 0.28, 0);
        rightLegRef.current.position.set(0.13, 0.28, 0);
        leftLegRef.current.rotation.x = 0.2;
        rightLegRef.current.rotation.x = -0.1;
      }
      return;
    }

    // ==================== WATERING PLANT ACTION ====================
    if (currentAction === 'water') {
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.54 + Math.sin(t * 3) * 0.015;
        torsoRef.current.rotation.x = 0.18; // Slight bow
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.9 + Math.sin(t * 5) * 0.08; // Holding & tilting watering can
        rightArmRef.current.rotation.z = -0.3;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.2;
      }
      // Animate water stream droplets
      if (waterStreamRef.current) {
        const arr = waterStreamRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < dropletData.count; i++) {
          arr[i * 3 + 1] -= 0.035;
          if (arr[i * 3 + 1] < -0.7) {
            arr[i * 3 + 1] = -0.05;
          }
        }
        waterStreamRef.current.geometry.attributes.position.needsUpdate = true;
      }
      return;
    }

    // ==================== WALKING STATE ====================
    if (currentAction === 'walk') {
      const walkCycle = t * 9.5;
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.58 + Math.abs(Math.sin(walkCycle)) * 0.06;
        torsoRef.current.rotation.z = Math.sin(walkCycle * 0.5) * 0.04;
        torsoRef.current.rotation.x = 0.08;
      }
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.position.set(-0.13, 0.38, 0);
        rightLegRef.current.position.set(0.13, 0.38, 0);
        leftLegRef.current.rotation.x = Math.sin(walkCycle) * 0.68;
        rightLegRef.current.rotation.x = -Math.sin(walkCycle) * 0.68;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(walkCycle) * 0.58;
        rightArmRef.current.rotation.x = Math.sin(walkCycle) * 0.58;
      }
      return;
    }

    // ==================== IDLE STATE ====================
    if (torsoRef.current) {
      torsoRef.current.position.y = 0.56 + Math.sin(t * 2.2) * 0.02;
      torsoRef.current.rotation.set(0, 0, 0);
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.06;
    }
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.position.set(-0.13, 0.36, 0);
      rightLegRef.current.position.set(0.13, 0.36, 0);
      leftLegRef.current.rotation.set(0, 0, 0);
      rightLegRef.current.rotation.set(0, 0, 0);
    }
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 2) * 0.05;
      rightArmRef.current.rotation.x = -Math.sin(t * 2) * 0.05;
      rightArmRef.current.rotation.z = 0;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground Contact Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.34, 16]} />
        <meshBasicMaterial color="#19281B" opacity={0.35} transparent />
      </mesh>

      {/* Main Torso & Body */}
      <group ref={torsoRef} position={[0, 0.56, 0]}>
        {/* Soft Knit Sweater */}
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.42, 0.26]} />
          <meshStandardMaterial color="#E07A5F" roughness={0.85} />
        </mesh>

        {/* Gardener Apron / Waistband */}
        <mesh position={[0, 0.02, 0.01]} castShadow>
          <boxGeometry args={[0.39, 0.16, 0.27]} />
          <meshStandardMaterial color="#3D5A80" roughness={0.9} />
        </mesh>

        {/* Satchel Bag across shoulder */}
        <mesh position={[0.18, 0.08, 0.08]} rotation={[0.2, 0.3, -0.2]} castShadow>
          <boxGeometry args={[0.12, 0.18, 0.2]} />
          <meshStandardMaterial color="#6A4E38" roughness={0.8} />
        </mesh>

        {/* Head & Hair */}
        <group ref={headRef} position={[0, 0.48, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.19, 16, 16]} />
            <meshStandardMaterial color="#F8D3B3" roughness={0.6} />
          </mesh>

          {/* Stylized Hair */}
          <mesh position={[0, 0.08, -0.03]} scale={[1.05, 0.95, 1.1]} castShadow>
            <sphereGeometry args={[0.19, 16, 16]} />
            <meshStandardMaterial color="#2B2118" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.22, -0.06]} castShadow>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#2B2118" roughness={0.9} />
          </mesh>

          {/* Gentle Eyes */}
          <mesh position={[-0.06, 0.02, 0.17]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#1E1E1E" roughness={0.3} />
          </mesh>
          <mesh position={[0.06, 0.02, 0.17]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#1E1E1E" roughness={0.3} />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.24, 0.24, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.34, 8]} />
            <meshStandardMaterial color="#E07A5F" roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#F8D3B3" />
          </mesh>
        </group>

        {/* Right Arm (holds watering can when watering) */}
        <group ref={rightArmRef} position={[0.24, 0.24, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.34, 8]} />
            <meshStandardMaterial color="#E07A5F" roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#F8D3B3" />
          </mesh>

          {/* Equipped Watering Can Prop */}
          <group ref={wateringCanRef} position={[0, -0.36, 0.18]} rotation={[0.4, 0.2, 0]} visible={false}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.13, 0.22, 10]} />
              <meshStandardMaterial color="#52B788" roughness={0.5} metalness={0.25} />
            </mesh>
            <mesh position={[0.12, 0.06, 0]} rotation={[0, 0, -0.6]} castShadow>
              <cylinderGeometry args={[0.025, 0.035, 0.2, 8]} />
              <meshStandardMaterial color="#52B788" roughness={0.5} metalness={0.25} />
            </mesh>

            {/* Spray Particles */}
            <points ref={waterStreamRef} position={[0.22, -0.05, 0]}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[dropletData.pos, 3]}
                />
              </bufferGeometry>
              <pointsMaterial size={0.04} color="#80ED99" transparent opacity={0.8} />
            </points>
          </group>
        </group>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.13, 0.36, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.36, 8]} />
          <meshStandardMaterial color="#293241" roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.34, 0.04]} castShadow>
          <boxGeometry args={[0.11, 0.09, 0.18]} />
          <meshStandardMaterial color="#4A3B32" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.13, 0.36, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.36, 8]} />
          <meshStandardMaterial color="#293241" roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.34, 0.04]} castShadow>
          <boxGeometry args={[0.11, 0.09, 0.18]} />
          <meshStandardMaterial color="#4A3B32" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
