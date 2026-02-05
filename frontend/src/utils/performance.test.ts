import { describe, it, expect, vi, beforeEach } from 'vitest'
import { measureAPICall, checkBundleSize } from './performance'

describe('Performance Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('measureAPICall', () => {
    it('measures successful API call duration', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'test' })
      
      const result = await measureAPICall('test-api', mockApiCall)
      
      expect(result).toEqual({ data: 'test' })
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('⚡ API Call [test-api]:')
      )
      
      consoleSpy.mockRestore()
    })

    it('warns on slow API calls (>1000ms)', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      // Mock a slow API call
      const slowApiCall = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: 'slow' }), 1100))
      )
      
      await measureAPICall('slow-api', slowApiCall)
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('⚠️ Slow API call detected')
      )
      
      consoleLogSpy.mockRestore()
      consoleWarnSpy.mockRestore()
    })

    it('logs errors when API call fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const failingApiCall = vi.fn().mockRejectedValue(new Error('API Error'))
      
      await expect(measureAPICall('failing-api', failingApiCall)).rejects.toThrow('API Error')
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ API Call [failing-api] failed')
      )
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('checkBundleSize', () => {
    it('logs message in development mode', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      checkBundleSize()
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('💾 Check bundle size')
      )
      
      consoleSpy.mockRestore()
    })
  })
})
