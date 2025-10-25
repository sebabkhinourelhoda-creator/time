import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function SimpleModel() {
  console.log('🔄 SimpleModel component rendering...');
  
  try {
    const gltf = useGLTF('https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/brain.glb');
    console.log('📦 GLTF loaded:', gltf);
    
    if (gltf && gltf.scene) {
      console.log('✅ GLTF scene found:', gltf.scene);
      return <primitive object={gltf.scene} scale={1} />;
    } else {
      console.warn('⚠️ GLTF loaded but no scene');
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      );
    }
  } catch (error) {
    console.error('❌ Error loading GLTF:', error);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
}

export default function SimpleGLBTest() {
  return (
    <div className="w-full h-96 bg-gray-100">
      <Canvas camera={{ 
        position: [0, 0, 1.25], 
        fov: 75,
        up: [0, 1, 0] 
      }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1.5} />
        <directionalLight position={[0, 10, 5]} intensity={1.5} />
        <Suspense fallback={
          <mesh>
            <sphereGeometry args={[0.5]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        }>
          <SimpleModel />
        </Suspense>
        <OrbitControls 
          minDistance={0.5}
          maxDistance={5}
          target={[0, 0, 0]}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.9}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}