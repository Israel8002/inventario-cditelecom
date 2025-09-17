'use client'

import { useState, useRef, useEffect } from 'react'
import { QrCode, Camera, CameraOff, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface QRScannerProps {
  onScan: (result: string) => void
  onClose?: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
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
    // Simulación de detección QR
    // En una implementación real, usarías jsQR o similar
    scanIntervalRef.current = setInterval(() => {
      // Simular detección aleatoria para demo
      if (Math.random() < 0.1) {
        const mockQRCode = `TELECOM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        handleQRDetected(mockQRCode)
      }
    }, 1000)
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
          Coloca el código QR del equipo dentro del marco para escanearlo automáticamente
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
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
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

      <div className="qr-scanner">
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '0.5rem',
            backgroundColor: '#000'
          }}
          playsInline
          muted
        />
        <div className="qr-overlay" />
        
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            📱 Apunta la cámara al código QR del equipo
          </p>
        </div>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        <p>El escaneo se realizará automáticamente cuando detecte un código QR válido</p>
      </div>
    </div>
  )
}
