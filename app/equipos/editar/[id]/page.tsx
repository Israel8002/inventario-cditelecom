import EquipoForm from '@/components/EquipoForm'

interface PageProps {
  params: {
    id: string
  }
}

export default function EditarEquipoPage({ params }: PageProps) {
  return <EquipoForm equipoId={params.id} />
}
