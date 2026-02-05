/**
 * Performance monitoring utilities
 * Phase 1: Basic API call measurement
 * Later phases: Full page metrics, analytics integration
 */

export const measureAPICall = async <T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    console.log(`⚡ API Call [${name}]: ${duration.toFixed(2)}ms`);
    
    // Warn if slow
    if (duration > 1000) {
      console.warn(`⚠️ Slow API call detected: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`❌ API Call [${name}] failed after ${duration.toFixed(2)}ms`);
    throw error;
  }
};

// Bundle size checker (run in dev mode)
export const checkBundleSize = () => {
  if (import.meta.env.DEV) {
    console.log('💾 Check bundle size: npm run build');
  }
};
