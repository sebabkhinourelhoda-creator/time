import React, { useState } from 'react';
import SimpleGLBTest from '@/components/SimpleGLBTest';

const TestGLB = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [directTestResult, setDirectTestResult] = useState<string>('');

  const glbUrls = [
    'brain.glb',
    'bladder.glb', 
    'breast.glb',
    'cervical.glb',
    'colon.glb',
    'kidney.glb',
    'liver.glb',
    'lungs.glb',
    'lymphatic.glb',
    'pancreas.glb',
    'prostate.glb',
    'skin.glb',
    'stomach.glb',
    'thyroid.glb'
  ];

  const testDirectAccess = async () => {
    const testUrl = 'https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/brain.glb';
    
    try {
      console.log('🔍 Testing direct access to:', testUrl);
      
      // Test with fetch
      const response = await fetch(testUrl);
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      if (response.ok) {
        const blob = await response.blob();
        setDirectTestResult(`✅ Direct access successful: ${response.status} | Type: ${contentType} | Size: ${contentLength} bytes | Blob size: ${blob.size}`);
      } else {
        setDirectTestResult(`❌ Direct access failed: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setDirectTestResult(`❌ Direct access error: ${error}`);
    }
  };

  const testGLBAccess = async () => {
    const results: string[] = [];
    
    for (const filename of glbUrls) {
      const fullUrl = `https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/${filename}`;
      
      try {
        const response = await fetch(fullUrl, { method: 'HEAD' });
        if (response.ok) {
          results.push(`✅ ${filename}: ${response.status} - ${response.headers.get('content-type')} (${response.headers.get('content-length')} bytes)`);
        } else {
          results.push(`❌ ${filename}: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        results.push(`❌ ${filename}: Network error - ${error}`);
      }
    }
    
    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">GLB Model URL Testing</h1>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={testGLBAccess}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Test GLB Model URLs
          </button>
          
          <button 
            onClick={testDirectAccess}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Test Direct Access
          </button>
        </div>

        {directTestResult && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Direct Access Test:</h2>
            <p className={`font-mono text-sm ${directTestResult.startsWith('✅') ? 'text-green-700' : 'text-red-700'}`}>
              {directTestResult}
            </p>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <ul className="space-y-2 font-mono text-sm">
              {testResults.map((result, index) => (
                <li key={index} className={result.startsWith('✅') ? 'text-green-700' : 'text-red-700'}>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Expected GLB Files:</h2>
          <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
            {glbUrls.map((filename, index) => (
              <li key={index} className="text-gray-700">
                • {filename}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Storage Base URL:</h2>
          <p className="font-mono text-sm text-blue-800 break-all">
            https://tkhmmwrbtyofzhrilxqj.supabase.co/storage/v1/object/public/T2T/3d-models/
          </p>
        </div>

        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Simple GLB Test (Brain Model):</h2>
          <SimpleGLBTest />
        </div>
      </div>
    </div>
  );
};

export default TestGLB;