# Sistema de Inventarios de Equipos de Telecomunicaciones

Una aplicación web moderna desarrollada para la gestión eficiente de inventarios de equipos de telecomunicaciones con funcionalidades de escaneo QR, generación de reportes e impresión.

## 🚀 Características Principales

### 📱 Multiplataforma
- Compatible con cualquier dispositivo (móvil, tablet, desktop)
- Diseño responsive que se adapta a diferentes tamaños de pantalla
- Interfaz intuitiva y moderna

### 📷 Escaneo de Códigos QR
- Escaneo automático de números de serie mediante la cámara del dispositivo
- Interfaz intuitiva con guías visuales para el escaneo
- Validación automática de códigos QR escaneados
- Opción de entrada manual como respaldo

### 📊 Gestión de Inventario
- Registro completo de equipos con información detallada:
  - Número de serie (escaneable por QR)
  - Tipo de equipo (Router, Switch, Modem, Antena, etc.)
  - Marca y modelo
  - Estado (Activo, Mantenimiento, Dañado, Retirado)
  - Ubicación física
  - Unidad (Hospital, UMF, Subdelegación, etc.)
  - Fechas de ingreso y última revisión
  - Responsable asignado
  - Observaciones adicionales

### 🔍 Búsqueda y Filtros
- Búsqueda en tiempo real por número de serie, tipo, marca, modelo o ubicación
- Filtros avanzados para reportes
- Navegación intuitiva entre pantallas

### 📋 Generación de Reportes
- Múltiples tipos de reportes:
  - Inventario general
  - Equipos por estado
  - Equipos por tipo
  - Equipos por marca
- Filtros personalizables para reportes específicos
- Resúmenes estadísticos automáticos

### 🖨️ Impresión y Compartir
- Generación de reportes en formato HTML
- Funcionalidad de impresión nativa del navegador
- Descarga de reportes en formato HTML
- Almacenamiento local de reportes generados

### 👥 Sistema de Usuarios
- Registro y autenticación de usuarios
- Roles de usuario (Administrador y Usuario)
- Usuarios pueden gestionar sus propios equipos
- Administradores pueden ver todos los equipos
- Seguridad basada en Row Level Security (RLS)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Base de Datos**: PostgreSQL con Supabase
- **Autenticación**: Supabase Auth
- **Estilos**: CSS personalizado con variables CSS
- **Escaneo QR**: WebRTC API para cámara
- **Deployment**: Vercel

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18.x o superior
- Cuenta de Supabase
- Cuenta de Vercel

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd sistema-inventarios-telecom
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Copia el archivo `env.example` a `.env.local` y configura las variables:

```bash
cp env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Base de Datos
1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ve a la sección SQL Editor
3. Ejecuta el script SQL del archivo `database/schema.sql`
4. Esto creará las tablas necesarias y configurará la seguridad RLS

### 5. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🚀 Deployment en Vercel

### 1. Preparar el Proyecto
Asegúrate de que tu proyecto esté en un repositorio de Git (GitHub, GitLab, o Bitbucket).

### 2. Conectar con Vercel
1. Ve a [Vercel](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Haz clic en "New Project"
4. Importa tu repositorio de Git

### 3. Configurar Variables de Entorno
En el dashboard de Vercel, ve a tu proyecto y configura las variables de entorno:

- `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de proyecto de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Tu clave de servicio de Supabase
- `NEXT_PUBLIC_APP_URL`: La URL de tu aplicación (se configurará automáticamente)

### 4. Deploy
1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu aplicación automáticamente
3. Recibirás una URL donde estará disponible tu aplicación

### 5. Configurar Dominio Personalizado (Opcional)
En la configuración del proyecto en Vercel, puedes agregar un dominio personalizado.

## 📁 Estructura del Proyecto

```
sistema-inventarios-telecom/
├── app/                          # Páginas de Next.js 14 (App Router)
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   ├── equipos/                 # Gestión de equipos
│   │   ├── page.tsx            # Lista de equipos
│   │   ├── nuevo/              # Crear nuevo equipo
│   │   └── editar/[id]/        # Editar equipo
│   ├── escanear/               # Escáner QR
│   │   └── page.tsx
│   └── reportes/               # Reportes e impresión
│       └── page.tsx
├── components/                  # Componentes React
│   ├── AuthProvider.tsx        # Contexto de autenticación
│   ├── Layout.tsx              # Layout con sidebar
│   ├── LoginForm.tsx           # Formulario de login/registro
│   ├── EquiposList.tsx         # Lista de equipos
│   ├── EquipoForm.tsx          # Formulario de equipos
│   ├── QRScanner.tsx           # Escáner QR
│   └── ReportesList.tsx        # Gestión de reportes
├── lib/                        # Utilidades
│   └── supabase.ts             # Configuración de Supabase
├── database/                   # Scripts de base de datos
│   └── schema.sql              # Esquema de la base de datos
├── public/                     # Archivos estáticos
├── package.json                # Dependencias del proyecto
├── next.config.js              # Configuración de Next.js
├── tsconfig.json               # Configuración de TypeScript
├── vercel.json                 # Configuración de Vercel
└── README.md                   # Este archivo
```

## 🗄️ Base de Datos

### Tablas Principales

#### `usuarios`
- `id`: UUID (Primary Key)
- `email`: VARCHAR (Unique)
- `nombre`: VARCHAR
- `rol`: ENUM ('admin', 'usuario')
- `created_at`: TIMESTAMP

#### `equipos`
- `id`: UUID (Primary Key)
- `numero_serie`: VARCHAR (Unique)
- `tipo_equipo`: VARCHAR
- `marca`: VARCHAR
- `modelo`: VARCHAR
- `estado`: ENUM ('Activo', 'Mantenimiento', 'Dañado', 'Retirado')
- `ubicacion`: VARCHAR
- `unidad`: VARCHAR
- `fecha_ingreso`: DATE
- `fecha_ultima_revision`: DATE
- `responsable`: VARCHAR
- `observaciones`: TEXT
- `user_id`: UUID (Foreign Key)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### `reportes`
- `id`: UUID (Primary Key)
- `titulo`: VARCHAR
- `tipo_reporte`: VARCHAR
- `filtros`: JSONB
- `datos`: JSONB
- `user_id`: UUID (Foreign Key)
- `created_at`: TIMESTAMP

### Seguridad
- Row Level Security (RLS) habilitado en todas las tablas
- Políticas de seguridad para controlar acceso a datos
- Usuarios solo pueden ver/editar sus propios equipos
- Administradores pueden ver todos los equipos

## 🔐 Permisos y Roles

### Usuario Regular
- Puede crear, editar y eliminar sus propios equipos
- Puede generar reportes de sus equipos
- Puede escanear códigos QR
- No puede ver equipos de otros usuarios

### Administrador
- Todas las funcionalidades de usuario regular
- Puede ver todos los equipos de todos los usuarios
- Puede ver todos los reportes generados
- Acceso completo al sistema

## 📱 Características Responsive

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños de pantalla
- **Orientación**: Soporte para portrait y landscape
- **Componentes Flexibles**: Se ajustan dinámicamente al contenido
- **Navegación Optimizada**: Sidebar colapsable en móviles

## 🎨 Diseño y UX

- **Tema Moderno**: Colores y tipografía profesionales
- **Iconografía**: Iconos de Lucide React para mejor UX
- **Feedback Visual**: Notificaciones toast para acciones del usuario
- **Estados de Carga**: Indicadores de progreso en operaciones
- **Validación**: Formularios con validación en tiempo real

## 🔧 Funcionalidades Técnicas

### Escaneo QR
- Utiliza WebRTC API para acceso a la cámara
- Detección automática de códigos QR
- Fallback a entrada manual
- Optimizado para dispositivos móviles

### Reportes
- Generación dinámica de reportes HTML
- Impresión nativa del navegador
- Descarga de archivos HTML
- Filtros avanzados y personalizables

### Autenticación
- Integración con Supabase Auth
- Manejo de sesiones persistente
- Protección de rutas
- Contexto de autenticación global

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a Supabase**
   - Verifica que las variables de entorno estén configuradas correctamente
   - Asegúrate de que la URL y las claves sean correctas

2. **Problemas con la cámara**
   - Verifica que el navegador tenga permisos de cámara
   - Asegúrate de usar HTTPS en producción

3. **Errores de permisos**
   - Verifica que las políticas RLS estén configuradas correctamente
   - Asegúrate de que el usuario esté autenticado

## 📞 Soporte

Para soporte técnico o preguntas sobre la aplicación:

- **Desarrollador**: LSC. Israel Díaz
- **Email**: [tu-email@ejemplo.com]
- **Sistema**: Sistema de Inventarios de Telecomunicaciones

## 📄 Licencia

Este proyecto está desarrollado para uso interno de la organización.

---

**Desarrollado por LSC. Israel Díaz para la gestión eficiente de inventarios de telecomunicaciones**
