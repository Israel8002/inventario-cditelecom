# Guía de Deployment en Vercel

Esta guía te ayudará a desplegar el Sistema de Inventarios de Equipos de Telecomunicaciones en Vercel paso a paso.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener:

1. ✅ Una cuenta de [Vercel](https://vercel.com)
2. ✅ Una cuenta de [Supabase](https://supabase.com)
3. ✅ El código del proyecto en un repositorio de Git (GitHub, GitLab, o Bitbucket)
4. ✅ Node.js 18.x o superior instalado localmente

## 🗄️ Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase
1. Ve a [Supabase](https://supabase.com) e inicia sesión
2. Haz clic en "New Project"
3. Completa la información del proyecto:
   - **Name**: `sistema-inventarios-telecom`
   - **Database Password**: Genera una contraseña segura
   - **Region**: Selecciona la región más cercana
4. Haz clic en "Create new project"

### 1.2 Configurar Base de Datos
1. Una vez creado el proyecto, ve a la sección **SQL Editor**
2. Copia y pega el contenido completo del archivo `database/schema.sql`
3. Haz clic en **Run** para ejecutar el script
4. Esto creará todas las tablas y configurará la seguridad

### 1.3 Obtener Credenciales
1. Ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

## 🚀 Paso 2: Desplegar en Vercel

### 2.1 Conectar Repositorio
1. Ve a [Vercel](https://vercel.com) e inicia sesión
2. Haz clic en **"New Project"**
3. Conecta tu repositorio de Git:
   - Si usas GitHub: Haz clic en "Import Git Repository"
   - Selecciona el repositorio del proyecto
   - Haz clic en **"Import"**

### 2.2 Configurar el Proyecto
1. **Framework Preset**: Vercel debería detectar automáticamente Next.js
2. **Root Directory**: Deja vacío (usar raíz del proyecto)
3. **Build Command**: `npm run build` (automático)
4. **Output Directory**: `.next` (automático)
5. Haz clic en **"Deploy"**

### 2.3 Configurar Variables de Entorno
Después del primer deploy, configura las variables de entorno:

1. Ve a tu proyecto en Vercel
2. Haz clic en **Settings** > **Environment Variables**
3. Agrega las siguientes variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `tu_supabase_project_url` | URL del proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `tu_supabase_anon_key` | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `tu_supabase_service_role_key` | Clave de servicio de Supabase |
| `NEXT_PUBLIC_APP_URL` | `https://tu-dominio.vercel.app` | URL de tu aplicación (se actualiza automáticamente) |

4. Haz clic en **"Save"** para cada variable

### 2.4 Redesplegar
1. Ve a la pestaña **Deployments**
2. Haz clic en los tres puntos del último deployment
3. Selecciona **"Redeploy"**
4. Esto aplicará las nuevas variables de entorno

## 🔧 Paso 3: Configuración Adicional

### 3.1 Dominio Personalizado (Opcional)
1. Ve a **Settings** > **Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Vercel

### 3.2 Configurar HTTPS
Vercel maneja automáticamente los certificados SSL, no necesitas configuración adicional.

### 3.3 Configurar Webhooks (Opcional)
Si necesitas webhooks para integraciones:
1. Ve a **Settings** > **Git**
2. Configura los webhooks según tus necesidades

## ✅ Paso 4: Verificar el Deployment

### 4.1 Probar la Aplicación
1. Visita la URL de tu aplicación
2. Verifica que la página de login se cargue correctamente
3. Prueba el registro de un nuevo usuario
4. Verifica que puedas crear equipos

### 4.2 Probar Funcionalidades
- ✅ Login/Registro de usuarios
- ✅ Crear, editar y eliminar equipos
- ✅ Escaneo QR (requiere HTTPS)
- ✅ Generación de reportes
- ✅ Impresión de reportes

## 🔍 Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que las claves de Supabase sean correctas

### Error: "Database connection failed"
- Verifica que el script SQL se haya ejecutado correctamente en Supabase
- Revisa que las políticas RLS estén configuradas

### Error: "Camera not accessible"
- Asegúrate de que la aplicación esté en HTTPS
- Verifica que el navegador tenga permisos de cámara

### Error: "Build failed"
- Revisa los logs de build en Vercel
- Verifica que todas las dependencias estén en package.json

## 📊 Monitoreo y Mantenimiento

### 4.1 Logs de Aplicación
1. Ve a **Functions** > **Logs** en Vercel
2. Monitorea los logs para errores

### 4.2 Analytics
1. Ve a **Analytics** en Vercel
2. Monitorea el rendimiento de la aplicación

### 4.3 Actualizaciones
Para actualizar la aplicación:
1. Haz push de los cambios a tu repositorio
2. Vercel desplegará automáticamente la nueva versión

## 🔐 Seguridad

### 5.1 Variables de Entorno
- Nunca expongas las claves de Supabase en el código
- Usa variables de entorno para toda la configuración sensible

### 5.2 HTTPS
- Vercel maneja automáticamente HTTPS
- Asegúrate de que todas las conexiones sean seguras

### 5.3 Base de Datos
- Las políticas RLS protegen los datos
- Cada usuario solo puede acceder a sus propios datos

## 📱 Configuración para Producción

### 6.1 Optimizaciones
- Vercel optimiza automáticamente las imágenes
- Next.js optimiza el código para producción

### 6.2 CDN
- Vercel usa su CDN global para mejor rendimiento
- Los archivos estáticos se sirven desde la ubicación más cercana

### 6.3 Escalabilidad
- Vercel escala automáticamente según la demanda
- No necesitas configuración adicional

## 🆘 Soporte

Si encuentras problemas durante el deployment:

1. **Revisa los logs** en Vercel Dashboard
2. **Verifica las variables de entorno**
3. **Consulta la documentación** de Vercel y Supabase
4. **Contacta al desarrollador** para soporte técnico

---

**¡Tu Sistema de Inventarios de Telecomunicaciones estará listo para usar en producción!** 🎉
