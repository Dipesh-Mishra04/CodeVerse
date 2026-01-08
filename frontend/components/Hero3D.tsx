"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Floating code bracket symbol component
function CodeBracket({ position, speed, rotationSpeed, offset }: { position: THREE.Vector3; speed: number; rotationSpeed: number; offset: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position.y + Math.sin(clock.getElapsedTime() * speed + offset) * 0.5;
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.z += rotationSpeed * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <mesh>
        <boxGeometry args={[0.15, 0.6, 0.05]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.05]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Floating code brace symbol component
function CodeBrace({ position, speed, rotationSpeed, offset }: { position: THREE.Vector3; speed: number; rotationSpeed: number; offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = position.y + Math.sin(clock.getElapsedTime() * speed + offset) * 0.5;
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.z += rotationSpeed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <torusGeometry args={[0.2, 0.05, 8, 16, Math.PI]} />
      <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} transparent opacity={0.7} />
    </mesh>
  );
}

// Floating code operator symbol component
function CodeOperator({ position, speed, rotationSpeed, offset }: { position: THREE.Vector3; speed: number; rotationSpeed: number; offset: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position.y + Math.sin(clock.getElapsedTime() * speed + offset) * 0.5;
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <mesh>
        <boxGeometry args={[0.4, 0.08, 0.05]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.4, 0.08, 0.05]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Floating code brackets and symbols (using geometric shapes)
function FloatingCodeSymbols() {
  const symbols = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      type: Math.floor(Math.random() * 3), // 0: bracket, 1: brace, 2: operator
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      ),
      speed: 0.2 + Math.random() * 0.3,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {symbols.map((item, idx) => {
        if (item.type === 0) {
          return <CodeBracket key={idx} position={item.position} speed={item.speed} rotationSpeed={item.rotationSpeed} offset={item.offset} />;
        }
        if (item.type === 1) {
          return <CodeBrace key={idx} position={item.position} speed={item.speed} rotationSpeed={item.rotationSpeed} offset={item.offset} />;
        }
        return <CodeOperator key={idx} position={item.position} speed={item.speed} rotationSpeed={item.rotationSpeed} offset={item.offset} />;
      })}
    </>
  );
}

// Code structure nodes (like algorithm nodes)
function CodeStructureNodes() {
  const nodesRef = useRef<THREE.Group>(null!);

  const nodes = useMemo(() => {
    const nodePositions: THREE.Vector3[] = [];
    const connections: [THREE.Vector3, THREE.Vector3][] = [];
    
    // Create a tree-like structure
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 3 + (i % 3) * 2;
      nodePositions.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 0.5) * 2,
          (Math.random() - 0.5) * 4
        )
      );
    }

    // Create connections between nodes
    for (let i = 0; i < nodePositions.length - 1; i++) {
      if (Math.random() > 0.5) {
        connections.push([nodePositions[i], nodePositions[(i + 1) % nodePositions.length]]);
      }
    }

    return { nodes: nodePositions, connections };
  }, []);

  useFrame(({ clock }) => {
    if (nodesRef.current) {
      nodesRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={nodesRef}>
      {/* Draw nodes as spheres */}
      {nodes.nodes.map((pos, idx) => (
        <mesh key={`node-${idx}`} position={pos}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      {/* Draw connections */}
      {nodes.connections.map((line, idx) => (
        <Line
          key={`conn-${idx}`}
          points={[line[0], line[1]]}
          color="#22c55e"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}

// Binary/data stream particles
function BinaryStream() {
  const pointsRef = useRef<THREE.Points>(null!);

  const points = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 400; i++) {
      temp.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );
    }
    return new Float32Array(temp);
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.02;
        if (positions[i] < -6) {
          positions[i] = 6;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#22c55e"
        size={0.08}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Code grid lines (like code editor lines)
function CodeGrid() {
  const linesRef = useRef<THREE.Group>(null!);

  const gridLines = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    
    // Horizontal lines (like code lines)
    for (let i = 0; i < 20; i++) {
      const y = -6 + (i / 20) * 12;
      lines.push(
        [new THREE.Vector3(-10, y, -5), new THREE.Vector3(10, y, -5)]
      );
    }
    
    return lines;
  }, []);

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.position.z = -5 + Math.sin(clock.getElapsedTime() * 0.2) * 2;
    }
  });

  return (
    <group ref={linesRef}>
      {gridLines.map((line, idx) => (
        <Line
          key={`grid-${idx}`}
          points={[line[0], line[1]]}
          color="#22c55e"
          lineWidth={0.5}
          transparent
          opacity={0.1}
        />
      ))}
    </group>
  );
}

// Animated code block component
function CodeBlock({ position, size, speed, rotationSpeed, offset }: { position: THREE.Vector3; size: number; speed: number; rotationSpeed: number; offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.x = position.x + Math.cos(clock.getElapsedTime() * speed + offset) * 0.3;
      meshRef.current.position.y = position.y + Math.sin(clock.getElapsedTime() * speed * 1.5 + offset) * 0.3;
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <boxGeometry args={[size, size * 0.6, size * 0.2]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.4}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// Animated code blocks/cubes (representing code chunks)
function FloatingCodeBlocks() {
  const blocks = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      ),
      size: 0.3 + Math.random() * 0.4,
      speed: 0.1 + Math.random() * 0.2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {blocks.map((block, idx) => (
        <CodeBlock
          key={idx}
          position={block.position}
          size={block.size}
          speed={block.speed}
          rotationSpeed={block.rotationSpeed}
          offset={block.offset}
        />
      ))}
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ height: '100%', width: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color="#22c55e" />

        {/* Coding-themed animated elements */}
        <CodeGrid />
        <BinaryStream />
        <FloatingCodeSymbols />
        <CodeStructureNodes />
        <FloatingCodeBlocks />
      </Canvas>
    </div>
  );
}
