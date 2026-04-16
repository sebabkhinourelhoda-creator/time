import React, { useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LoadingFallback } from "@/components/3d/LoadingFallback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RotateCcw, ZoomIn } from "lucide-react";

// Simple error boundary for 3D models
class ModelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('3D Model Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

type OrganData = {
  id: string;
  name: string;
  modelUrl: string;
  cancerType: string;
  description: string;
  detailedInfo: {
    symptoms: string[];
    riskFactors: string[];
    prevention: string[];
    earlyDetection: string;
  };
  position: [number, number, number];
  color: string;
};

const organsData: OrganData[] = [
  {
    id: "brain",
    name: "Brain",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/brain.glb",
    cancerType: "Brain Cancer",
    description: "Brain cancer involves malignant tumors in brain tissue affecting cognitive and motor functions.",
    detailedInfo: {
      symptoms: ["Persistent headaches", "Seizures", "Memory problems", "Vision changes", "Balance issues"],
      riskFactors: ["Age", "Family history", "Radiation exposure", "Genetic disorders"],
      prevention: ["Aconsole.log radiation exposure", "Healthy lifestyle", "Regular check-ups"],
      earlyDetection: "MRI and CT scans can detect brain tumors early"
    },
    position: [-3, 2, 0],
    color: "#8B5CF6"
  },
  {
    id: "lungs",
    name: "Lungs",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/lungs.glb",
    cancerType: "Lung Cancer",
    description: "Lung cancer is one of the most common cancers, often linked to smoking and environmental factors.",
    detailedInfo: {
      symptoms: ["Persistent cough", "Chest pain", "Shortness of breath", "Blood in sputum", "Weight loss"],
      riskFactors: ["Smoking", "Air pollution", "Asbestos exposure", "Family history"],
      prevention: ["Quit smoking", "Aconsole.log secondhand smoke", "Test home for radon"],
      earlyDetection: "Low-dose CT screening for high-risk individuals"
    },
    position: [-1, 1, 0],
    color: "#EF4444"
  },
  {
    id: "liver",
    name: "Liver",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/liver.glb",
    cancerType: "Liver Cancer",
    description: "Liver cancer often develops in people with chronic liver diseases like hepatitis or cirrhosis.",
    detailedInfo: {
      symptoms: ["Abdominal pain", "Swelling", "Weight loss", "Fatigue", "Jaundice"],
      riskFactors: ["Hepatitis B/C", "Cirrhosis", "Alcohol abuse", "Diabetes"],
      prevention: ["Hepatitis vaccination", "Limit alcohol", "Maintain healthy weight"],
      earlyDetection: "Alpha-fetoprotein blood test and imaging"
    },
    position: [1, 0, 0],
    color: "#F59E0B"
  },
  {
    id: "stomach",
    name: "Stomach",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/stomach.glb",
    cancerType: "Stomach Cancer",
    description: "Stomach cancer typically develops slowly over many years, often starting in the inner lining.",
    detailedInfo: {
      symptoms: ["Stomach pain", "Nausea", "Loss of appetite", "Feeling full quickly", "Weight loss"],
      riskFactors: ["H. pylori infection", "Diet high in salted foods", "Smoking", "Family history"],
      prevention: ["Treat H. pylori", "Eat fresh fruits/vegetables", "Aconsole.log processed foods"],
      earlyDetection: "Endoscopy for high-risk individuals"
    },
    position: [3, 0, 0],
    color: "#10B981"
  },
  {
    id: "colon",
    name: "Colon",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/colon.glb",
    cancerType: "Colorectal Cancer",
    description: "Colorectal cancer usually starts as small growths called polyps in the colon or rectum.",
    detailedInfo: {
      symptoms: ["Changes in bowel habits", "Blood in stool", "Abdominal pain", "Weight loss", "Fatigue"],
      riskFactors: ["Age over 50", "Diet high in red meat", "Smoking", "Inflammatory bowel disease"],
      prevention: ["Regular screening", "High-fiber diet", "Exercise", "Limit red meat"],
      earlyDetection: "Colonoscopy starting at age 45-50"
    },
    position: [-3, -1, 0],
    color: "#F97316"
  },
  {
    id: "breast",
    name: "Breast",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/breast.glb",
    cancerType: "Breast Cancer",
    description: "Breast cancer occurs when cells in breast tissue grow uncontrollably, affecting mostly women.",
    detailedInfo: {
      symptoms: ["Breast lump", "Breast pain", "Skin changes", "Nipple discharge", "Breast swelling"],
      riskFactors: ["Age", "Gender", "Family history", "BRCA mutations", "Hormone therapy"],
      prevention: ["Regular exercise", "Maintain healthy weight", "Limit alcohol", "Breastfeeding"],
      earlyDetection: "Mammograms starting at age 40-50"
    },
    position: [-1, -1, 0],
    color: "#EC4899"
  },
  {
    id: "prostate",
    name: "Prostate",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/prostate.glb",
    cancerType: "Prostate Cancer",
    description: "Prostate cancer is one of the most common cancers in men, usually growing slowly.",
    detailedInfo: {
      symptoms: ["Urination problems", "Blood in urine", "Pelvic pain", "Bone pain", "Erectile dysfunction"],
      riskFactors: ["Age", "Race", "Family history", "Diet high in fat"],
      prevention: ["Healthy diet", "Regular exercise", "Maintain healthy weight"],
      earlyDetection: "PSA blood test and digital rectal exam"
    },
    position: [1, -2, 0],
    color: "#3B82F6"
  },
  {
    id: "kidney",
    name: "Kidney",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/kidney.glb",
    cancerType: "Kidney Cancer",
    description: "Kidney cancer typically starts in the lining of small tubes inside the kidneys.",
    detailedInfo: {
      symptoms: ["Blood in urine", "Lower back pain", "Abdominal lump", "Weight loss", "Fatigue"],
      riskFactors: ["Smoking", "Obesity", "High blood pressure", "Family history"],
      prevention: ["Don't smoke", "Maintain healthy weight", "Control blood pressure"],
      earlyDetection: "Imaging tests for those at high risk"
    },
    position: [3, -1, 0],
    color: "#DC2626"
  },
  {
    id: "pancreas",
    name: "Pancreas",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/pancreas.glb",
    cancerType: "Pancreatic Cancer",
    description: "Pancreatic cancer is often called a 'silent disease' due to lack of early symptoms.",
    detailedInfo: {
      symptoms: ["Abdominal pain", "Weight loss", "Jaundice", "New diabetes", "Blood clots"],
      riskFactors: ["Smoking", "Diabetes", "Chronic pancreatitis", "Family history"],
      prevention: ["Don't smoke", "Maintain healthy weight", "Limit alcohol"],
      earlyDetection: "Genetic testing for those with family history"
    },
    position: [-1, -2, 0],
    color: "#7C3AED"
  },
  {
    id: "thyroid",
    name: "Thyroid",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/thyroid.glb",
    cancerType: "Thyroid Cancer",
    description: "Thyroid cancer affects the butterfly-shaped gland in the neck that produces hormones.",
    detailedInfo: {
      symptoms: ["Neck lump", "Voice changes", "Difficulty swallowing", "Neck pain", "Swollen lymph nodes"],
      riskFactors: ["Gender (more common in women)", "Radiation exposure", "Family history", "Iodine deficiency"],
      prevention: ["Aconsole.log radiation exposure", "Regular check-ups"],
      earlyDetection: "Physical exam and ultrasound"
    },
    position: [-3, 1, 0],
    color: "#06B6D4"
  },
  {
    id: "bladder",
    name: "Bladder",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/bladder.glb",
    cancerType: "Bladder Cancer",
    description: "Bladder cancer typically begins in the cells lining the inside of the bladder.",
    detailedInfo: {
      symptoms: ["Blood in urine", "Frequent urination", "Painful urination", "Lower back pain"],
      riskFactors: ["Smoking", "Chemical exposure", "Age", "Gender (more common in men)"],
      prevention: ["Don't smoke", "Drink plenty of water", "Eat fruits and vegetables"],
      earlyDetection: "Urine tests and cystoscopy"
    },
    position: [3, -2, 0],
    color: "#84CC16"
  },
  {
    id: "cervical",
    name: "Cervix",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/cervical.glb",
    cancerType: "Cervical Cancer",
    description: "Cervical cancer is usually caused by HPV infection and is highly preventable with screening.",
    detailedInfo: {
      symptoms: ["Abnormal bleeding", "Pelvic pain", "Pain during intercourse", "Unusual discharge"],
      riskFactors: ["HPV infection", "Multiple sexual partners", "Smoking", "Weakened immune system"],
      prevention: ["HPV vaccination", "Regular Pap tests", "Safe sex practices"],
      earlyDetection: "Pap smears and HPV testing"
    },
    position: [1, -1, 0],
    color: "#F472B6"
  },
  {
    id: "skin",
    name: "Skin",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/skin.glb",
    cancerType: "Skin Cancer",
    description: "Skin cancer is the most common type of cancer, often caused by UV radiation exposure.",
    detailedInfo: {
      symptoms: ["New moles", "Changes in existing moles", "Sores that don't heal", "Itchy patches"],
      riskFactors: ["UV exposure", "Fair skin", "Family history", "Many moles"],
      prevention: ["Use sunscreen", "Aconsole.log peak sun hours", "Wear protective clothing"],
      earlyDetection: "Regular skin self-exams and dermatologist visits"
    },
    position: [-1, 0, 0],
    color: "#F59E0B"
  },
  {
    id: "lymphatic",
    name: "Lymphatic System",
    modelUrl: "https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/lymphatic.glb",
    cancerType: "Lymphoma",
    description: "Lymphoma affects the lymphatic system, part of the body's immune system.",
    detailedInfo: {
      symptoms: ["Swollen lymph nodes", "Fever", "Night sweats", "Weight loss", "Fatigue"],
      riskFactors: ["Age", "Weakened immune system", "Infections", "Family history"],
      prevention: ["Maintain healthy immune system", "Aconsole.log infections"],
      earlyDetection: "Physical exam and blood tests"
    },
    position: [3, 1, 0],
    color: "#8B5CF6"
  }
];

function OrganModel({ organ, isSelected, onSelect, shouldLoad }: { 
  organ: OrganData; 
  isSelected: boolean; 
  onSelect: () => void;
  shouldLoad: boolean;
}) {
  const [loadingState, setLoadingState] = useState<'not-loaded' | 'loading' | 'success' | 'error'>('not-loaded');
  
  // Only load GLB when shouldLoad is true (when selected)
  const gltfData = shouldLoad ? useGLTF(organ.modelUrl) : null;
  
  // Handle loading states
  React.useEffect(() => {
    if (!shouldLoad) {
      setLoadingState('not-loaded');
      return;
    }
    
    if (!gltfData) {
      setLoadingState('loading');
      return;
    }
    
    console.log(`🔍 Loading state check for ${organ.name}:`, { scene: !!gltfData.scene });
    
    if (gltfData.scene) {
      console.log(`✅ GLB loaded successfully for ${organ.name}:`, gltfData.scene);
      setLoadingState('success');
    } else {
      console.log(`⏳ Still loading ${organ.name}...`);
      setLoadingState('loading');
    }
  }, [gltfData, organ.name, shouldLoad]);
  
  // Show placeholder for unloaded models
  if (loadingState === 'not-loaded') {
    return (
      <group position={[0, 0, 0]} onClick={onSelect}>
        <mesh>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color={organ.color} transparent opacity={0.8} />
        </mesh>
      </group>
    );
  }
  
  // Show loading state
  if (loadingState === 'loading') {
    return (
      <group position={[0, 0, 0]} onClick={onSelect}>
        <mesh>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color="#cccccc" transparent opacity={0.7} />
        </mesh>
      </group>
    );
  }
  
  // Show error state
  if (loadingState === 'error' || !gltfData?.scene) {
    console.warn(`🔴 Showing error fallback for ${organ.name}`);
    return (
      <group position={[0, 0, 0]} onClick={onSelect}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff4444" />
        </mesh>
      </group>
    );
  }
  
  // Render successful model
  console.log(`🎉 Rendering successful GLB model for ${organ.name}`);
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={[0, 0, 0]} rotation={[0, 0, 0]} onClick={onSelect}>
        <primitive 
          object={gltfData.scene.clone()} 
          scale={1}
          position={[0, 0, 0]}
        />
      </group>
    </Float>
  );
}

const BodyMap = () => {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(organsData.find(organ => organ.id === 'brain') || null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 1.25]);
  const [storageError, setStorageError] = useState<boolean>(false);

  const resetCamera = () => {
    setCameraPosition([0, 0, 1.25]);
    setSelectedOrgan(organsData.find(organ => organ.id === 'brain') || null);
  };

  const selectOrgan = (organ: OrganData) => {
    console.log(`🎯 Selecting organ: ${organ.name}`);
    setSelectedOrgan(organ);
    // Reset camera to front view for all organs
    setCameraPosition([0, 0, 1.25]);
  };

  // Reset camera position when organ changes
  React.useEffect(() => {
    if (selectedOrgan) {
      setCameraPosition([0, 0, 1.25]);
    }
  }, [selectedOrgan]);

  // Test storage access with detailed logging
  const testStorageAccess = async () => {
    console.log('🔍 Testing Supabase storage access...');
    try {
      const testUrl = 'https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/brain.glb';
      console.log('🔗 Testing URL:', testUrl);
      
      const response = await fetch(testUrl, { method: 'HEAD' });
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        console.log('✅ Storage access successful');
        setStorageError(false);
      } else {
        console.error('❌ Storage access failed:', response.status, response.statusText);
        setStorageError(true);
      }
    } catch (error) {
      console.error('❌ Storage access error:', error);
      setStorageError(true);
    }
  };

  // Test storage access on component mount
  React.useEffect(() => {
    testStorageAccess();
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">3D Interactive Organ Map</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore human organs in 3D and learn about cancer prevention, symptoms, and early detection
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
            {/* 3D Visualization */}
            <div className="xl:col-span-2 order-2 xl:order-1">
              <Card className="bg-card h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden shadow-xl">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <Button onClick={resetCamera} variant="outline" size="sm" className="bg-background hover:bg-secondary/10">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Brain
                  </Button>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    Explore brain or select other organs below
                  </Badge>
                </div>
                
                <Suspense fallback={<LoadingFallback loading={true} />}>
                  <Canvas 
                    camera={{ 
                      position: cameraPosition, 
                      fov: 75,
                      up: [0, 1, 0]
                    }}
                    gl={{ preserveDrawingBuffer: true, alpha: false }}
                    onCreated={({ gl, camera }) => {
                      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                      // Ensure camera looks at center from front
                      camera.lookAt(0, 0, 0);
                    }}
                  >
                    <ambientLight intensity={1.6} />
                    <pointLight position={[10, 10, 10]} intensity={3} />
                    <pointLight position={[-10, -10, -10]} intensity={2} />
                    <directionalLight position={[0, 10, 5]} intensity={2} />
                    
                    {selectedOrgan ? (
                      <ModelErrorBoundary key={selectedOrgan.id}>
                        <OrganModel
                          organ={selectedOrgan}
                          isSelected={true}
                          onSelect={() => {}}
                          shouldLoad={true}
                        />
                      </ModelErrorBoundary>
                    ) : (
                      <group>
                        <mesh position={[0, 0, 0]}>
                          <sphereGeometry args={[0.5]} />
                          <meshStandardMaterial color="#4A90E2" transparent opacity={0.8} />
                        </mesh>
                      </group>
                    )}
                    
                    <OrbitControls 
                      enablePan 
                      enableZoom 
                      enableRotate 
                      autoRotate={!selectedOrgan}
                      autoRotateSpeed={0.5}
                      minDistance={0.5}
                      maxDistance={5}
                      target={[0, 0, 0]}
                      minPolarAngle={Math.PI * 0.1}
                      maxPolarAngle={Math.PI * 0.9}
                      enableDamping={true}
                      dampingFactor={0.05}
                    />
                  </Canvas>
                  
                  {/* Show selected organ name overlay */}
                  {selectedOrgan && (
                    <div className="absolute top-16 left-4 z-10">
                      <div 
                        className="px-4 py-2 rounded-lg text-white font-semibold shadow-lg"
                        style={{ backgroundColor: selectedOrgan.color }}
                      >
                        {selectedOrgan.name}
                      </div>
                    </div>
                  )}
                </Suspense>
              </Card>
            </div>

            {/* Information Panel */}
            <div className="space-y-4 md:space-y-6 order-1 xl:order-2">
              {selectedOrgan ? (
                <Card className="bg-card shadow-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: selectedOrgan.color }}
                      ></div>
                      <CardTitle className="text-primary text-lg md:text-xl">{selectedOrgan.name}</CardTitle>
                    </div>
                    <Badge 
                      className="w-fit text-white text-xs md:text-sm" 
                      style={{ backgroundColor: selectedOrgan.color }}
                    >
                      {selectedOrgan.cancerType}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4 text-sm md:text-base">
                    <p className="text-muted-foreground">{selectedOrgan.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-primary mb-2">Common Symptoms:</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                          {selectedOrgan.detailedInfo.symptoms.map((symptom, index) => (
                            <li key={index}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-primary mb-2">Risk Factors:</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                          {selectedOrgan.detailedInfo.riskFactors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-secondary mb-2">Prevention:</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                          {selectedOrgan.detailedInfo.prevention.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-secondary mb-2">Early Detection:</h4>
                        <p className="text-sm text-muted-foreground">{selectedOrgan.detailedInfo.earlyDetection}</p>
                      </div>
                    </div>
                    
                    <Link to={`/cancer/${selectedOrgan.cancerType.toLowerCase().replace(/\s+/g, "-")}`}>
                      <Button className="w-full mt-4" style={{ backgroundColor: selectedOrgan.color }}>
                        Learn More About {selectedOrgan.cancerType}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card shadow-xl">
                  <CardContent className="flex items-center justify-center h-64 text-center">
                    <div>
                      <ZoomIn className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2 text-primary">Select an Organ to Explore</h3>
                      <p className="text-muted-foreground">
                        Choose any organ from the list below to view its 3D model and learn about related cancers, symptoms, and prevention
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Organ List */}
              <Card className="bg-card shadow-xl">
                <CardHeader>
                  <CardTitle className="text-primary">Available Organs</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Click to focus on specific organs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2">
                    {organsData.map((organ) => (
                      <Button
                        key={organ.id}
                        variant={selectedOrgan?.id === organ.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => selectOrgan(organ)}
                        className={`text-xs justify-start ${
                          selectedOrgan?.id === organ.id 
                            ? "text-white" 
                            : "text-muted-foreground hover:bg-secondary/10"
                        }`}
                        style={selectedOrgan?.id === organ.id ? { backgroundColor: organ.color } : {}}
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-2" 
                          style={{ backgroundColor: organ.color }}
                        ></div>
                        {organ.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BodyMap;
