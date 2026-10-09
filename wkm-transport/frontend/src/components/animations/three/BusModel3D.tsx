import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import { Group } from 'three';

// Stylized 3D bus using Three.js primitives - no framer-motion-3d dependency
export const BusModel3D: React.FC = () => {
  const groupRef = useRef<Group>(null);
  const [hovered, setHover] = React.useState(false);
  useCursor(hovered);

  // Gentle rotation animation using useFrame
  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    if (hovered) {
      groupRef.current.rotation.y += delta * 0.5;
    } else {
      // Slow idle bob
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.05;
    }
  });

  const bodyColor = hovered ? '#fb923c' : '#f59e0b';

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Bus Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1.5, 1.5]} />
        <meshPhysicalMaterial
          color={bodyColor}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Windows */}
      <mesh position={[0.2, 0.4, 0.76]}>
        <boxGeometry args={[3.2, 0.6, 0.05]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} roughness={0} metalness={0} />
      </mesh>
      <mesh position={[0.2, 0.4, -0.76]}>
        <boxGeometry args={[3.2, 0.6, 0.05]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} roughness={0} metalness={0} />
      </mesh>

      {/* Wheels */}
      <mesh position={[-1.2, -0.7, 0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[1.2, -0.7, 0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-1.2, -0.7, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[1.2, -0.7, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};
