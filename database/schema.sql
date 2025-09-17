-- Crear tabla de usuarios
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de equipos
CREATE TABLE equipos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_serie VARCHAR(255) UNIQUE NOT NULL,
  tipo_equipo VARCHAR(100) NOT NULL,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Mantenimiento', 'Dañado', 'Retirado')),
  ubicacion VARCHAR(255) NOT NULL,
  unidad VARCHAR(255) NOT NULL,
  fecha_ingreso DATE NOT NULL,
  fecha_ultima_revision DATE,
  responsable VARCHAR(255) NOT NULL,
  observaciones TEXT,
  user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reportes
CREATE TABLE reportes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  tipo_reporte VARCHAR(50) NOT NULL,
  filtros JSONB,
  datos JSONB NOT NULL,
  user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_equipos_numero_serie ON equipos(numero_serie);
CREATE INDEX idx_equipos_tipo ON equipos(tipo_equipo);
CREATE INDEX idx_equipos_estado ON equipos(estado);
CREATE INDEX idx_equipos_user_id ON equipos(user_id);
CREATE INDEX idx_reportes_user_id ON reportes(user_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_equipos_updated_at 
    BEFORE UPDATE ON equipos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (email, nombre, rol) 
VALUES ('admin@telecom.com', 'Administrador', 'admin');

-- Habilitar RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Políticas de seguridad para equipos
CREATE POLICY "Los usuarios pueden ver sus propios equipos" ON equipos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los administradores pueden ver todos los equipos" ON equipos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Los usuarios pueden insertar sus propios equipos" ON equipos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios equipos" ON equipos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios equipos" ON equipos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para reportes
CREATE POLICY "Los usuarios pueden ver sus propios reportes" ON reportes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los administradores pueden ver todos los reportes" ON reportes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Los usuarios pueden insertar sus propios reportes" ON reportes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios reportes" ON reportes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios reportes" ON reportes
  FOR DELETE USING (auth.uid() = user_id);
