'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QRScanner from '@/components/QRScanner'
import Layout from '@/components/Layout'
import { useAuth } from '@/components/AuthProvider'

export default function EscanearPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

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
