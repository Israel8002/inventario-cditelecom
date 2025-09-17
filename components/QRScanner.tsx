'use client'

import { useState, useRef, useEffect } from 'react'
import { QrCode, Camera, CameraOff, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// Importar jsQR dinámicamente para evitar problemas de SSR
let jsQR: any = null

interface QRScannerProps {
  onScan: (result: string) => void
  onClose?: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Cargar jsQR dinámicamente
    const loadJsQR = async () => {
      try {
        const jsQRModule = await import('jsqr')
        jsQR = jsQRModule.default
      } catch (error) {
        console.error('Error loading jsQR:', error)
        setError('Error al cargar la librería de detección QR')
      }
    }
    
    loadJsQR()
    
    return () => {
      stopScanning()
    }
  }, [])

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)

      // Solicitar acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Cámara trasera en móviles
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      setHasPermission(true)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Simular detección de QR (en una implementación real usarías una librería como jsQR)
      startQRDetection()
      
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
      setHasPermission(false)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startQRDetection = () => {
    if (!jsQR) {
      setError('Librería de detección QR no cargada')
      return
    }
    
    // Detección QR REAL con jsQR
    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && !isDetecting) {
        detectQRCode()
      }
    }, 100) // Frecuencia alta para detección en tiempo real
  }

  const detectQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !jsQR) return
    
    setIsDetecting(true)
    
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (!context) return
      
      // Configurar canvas con el tamaño del video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Dibujar frame del video en el canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Obtener datos de imagen
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      
      // DETECCIÓN QR REAL con jsQR
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      })
      
      if (code && code.data) {
        // Solo procesar si realmente se detectó un código QR
        const detectedCode = code.data.trim()
        
        // Validar que el código no esté vacío
        if (detectedCode.length > 0) {
          console.log('Código QR detectado:', detectedCode)
          handleQRDetected(detectedCode)
        }
      }
    } catch (error) {
      console.error('Error detecting QR:', error)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleQRDetected = (code: string) => {
    setScannedCode(code)
    stopScanning()
    toast.success('Código QR escaneado correctamente')
    onScan(code)
  }

  const handleManualInput = () => {
    const input = prompt('Ingresa el número de serie manualmente:')
    if (input && input.trim()) {
      handleQRDetected(input.trim())
    }
  }

  const handleRetry = () => {
    setScannedCode(null)
    setError(null)
    startScanning()
  }

  if (scannedCode) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <CheckCircle size={64} style={{ color: 'var(--success-color)', margin: '0 auto 1rem' }} />
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Código Escaneado
        </h3>
        <div style={{
          backgroundColor: 'var(--background-color)',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1.5rem',
          fontFamily: 'monospace',
          fontSize: '1.125rem',
          fontWeight: 'bold'
        }}>
          {scannedCode}
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={handleRetry} className="btn btn-outline">
            Escanear Otro
          </button>
          {onClose && (
            <button onClick={onClose} className="btn btn-primary">
              Continuar
            </button>
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <XCircle size={64} style={{ color: 'var(--error-color)', margin: '0 auto 1rem' }} />
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Error de Cámara
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {error}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={handleManualInput} className="btn btn-outline">
            Ingresar Manualmente
          </button>
          <button onClick={handleRetry} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!isScanning) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <QrCode size={64} style={{ color: 'var(--primary-color)', margin: '0 auto 1rem' }} />
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Escanear Código QR
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Apunta la cámara a un código QR REAL del equipo para escanearlo automáticamente
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={handleManualInput} className="btn btn-outline">
            Ingresar Manualmente
          </button>
          <button onClick={startScanning} className="btn btn-primary">
            <Camera size={20} />
            Iniciar Escaneo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
          Escaneando Código QR
        </h3>
        <button
          onClick={stopScanning}
          className="btn btn-outline"
          style={{ padding: '0.5rem' }}
        >
          <CameraOff size={20} />
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '400px', // Aumentar altura
            objectFit: 'cover',
            borderRadius: '0.5rem',
            backgroundColor: '#000'
          }}
          playsInline
          muted
        />
        
        {/* Canvas oculto para detección */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
        
        {/* Overlay de escaneo más grande */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '250px', // Área más grande
          height: '250px',
          border: '3px solid var(--primary-color)',
          borderRadius: '1rem',
          backgroundColor: 'transparent',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none'
        }}>
          {/* Esquinas del marco */}
          <div style={{
            position: 'absolute',
            top: '-3px',
            left: '-3px',
            width: '30px',
            height: '30px',
            borderTop: '4px solid var(--primary-color)',
            borderLeft: '4px solid var(--primary-color)',
            borderRadius: '0.5rem 0 0 0'
          }} />
          <div style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '30px',
            height: '30px',
            borderTop: '4px solid var(--primary-color)',
            borderRight: '4px solid var(--primary-color)',
            borderRadius: '0 0.5rem 0 0'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-3px',
            left: '-3px',
            width: '30px',
            height: '30px',
            borderBottom: '4px solid var(--primary-color)',
            borderLeft: '4px solid var(--primary-color)',
            borderRadius: '0 0 0 0.5rem'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-3px',
            right: '-3px',
            width: '30px',
            height: '30px',
            borderBottom: '4px solid var(--primary-color)',
            borderRight: '4px solid var(--primary-color)',
            borderRadius: '0 0 0.5rem 0'
          }} />
        </div>
        
        {/* Instrucciones */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ margin: 0, fontWeight: '500' }}>
            📱 Apunta a un código QR REAL
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
            Solo detecta códigos QR existentes, no genera códigos falsos
          </p>
        </div>

        {/* Indicador de detección */}
        {isDetecting && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            fontSize: '0.8rem',
            fontWeight: '500',
            animation: 'pulse 1s infinite'
          }}>
            🔍 Detectando...
          </div>
        )}
      </div>

      <div style={{ 
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
        marginBottom: '1rem'
      }}>
        <p style={{ margin: 0 }}>
          Solo detecta códigos QR reales, no genera códigos falsos
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        marginTop: '1rem'
      }}>
        <button onClick={handleManualInput} className="btn btn-outline">
          Ingresar Manualmente
        </button>
        <button onClick={handleRetry} className="btn btn-secondary">
          Reintentar
        </button>
      </div>
    </div>
  )
}
