'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QRScanner from '@/components/QRScanner'
import Layout from '@/components/Layout'
import { useAuth } from '@/components/AuthProvider'

export default function EscanearPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Cargando escáner...
          </p>
        </div>
      </Layout>
    )
  }

  if (!user) {
    router.push('/')
    return null
  }

  const handleScan = (code: string) => {
    setScannedCode(code)
    // Redirigir al formulario de nuevo equipo con el código escaneado
    router.push(`/equipos/nuevo?serie=${encodeURIComponent(code)}`)
  }

  return (
    <Layout>
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            Escanear Código QR
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)'
          }}>
            Escanea el código QR del equipo para agregarlo al inventario
          </p>
        </div>

        <QRScanner onScan={handleScan} />
      </div>
    </Layout>
  )
}
