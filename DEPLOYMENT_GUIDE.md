# 🚀 Guía de Deployment en GitHub Pages

## 📋 **Preparación Completada** ✅

Tu aplicación **Clima App** ya está lista para ser desplegada en GitHub Pages con todas las configuraciones necesarias:

### ✅ **Archivos de Configuración Creados:**
- `.github/workflows/deploy.yml` - GitHub Actions para deployment automático
- `vite.config.ts` - Configurado con base URL para GitHub Pages
- `.gitignore` - Optimizado para el proyecto
- `LICENSE` - Licencia MIT
- `package.json` - Actualizado con información del repositorio
- `deploy.sh` y `deploy.bat` - Scripts de deployment manual

---

## 🐙 **Pasos para Subir a GitHub:**

### 1️⃣ **Crear Repositorio en GitHub**
1. Ve a [github.com](https://github.com) y inicia sesión
2. Haz clic en **"New repository"** (botón verde)
3. Nombre del repositorio: `clima-app`
4. Descripción: `Aplicación PWA del clima con React, TypeScript y Vite`
5. Repositorio **Público** (para GitHub Pages gratuito)
6. **NO** inicializar con README (ya lo tienes)
7. Haz clic en **"Create repository"**

### 2️⃣ **Conectar tu Proyecto Local con GitHub**
Abre PowerShell en la carpeta del proyecto y ejecuta:

```bash
# Inicializar git (si no está inicializado)
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "feat: initial commit - Clima App PWA completa"

# Conectar con tu repositorio (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/clima-app.git

# Subir al repositorio
git branch -M main
git push -u origin main
```

### 3️⃣ **Configurar GitHub Pages**
1. En tu repositorio de GitHub, ve a **Settings** (pestaña superior)
2. En el menú izquierdo, busca **"Pages"**
3. En **"Source"**, selecciona **"GitHub Actions"**
4. ¡Ya está! El deployment se ejecutará automáticamente

### 4️⃣ **Actualizar URLs en el Código**
Después de crear el repositorio, actualiza estas URLs en los archivos:

**En `package.json`:**
```json
"repository": {
  "url": "https://github.com/TU_USUARIO/clima-app.git"
},
"homepage": "https://TU_USUARIO.github.io/clima-app/"
```

**En `deploy.sh` y `deploy.bat`:**
Reemplaza `TU_USUARIO` con tu usuario real de GitHub.

---

## 🌐 **Deployment Automático**

### ✨ **Cómo Funciona:**
- Cada vez que hagas `git push` a la rama `main`, se ejecutará automáticamente el deployment
- GitHub Actions compilará tu aplicación y la publicará en GitHub Pages
- En 2-5 minutos estará disponible en: `https://TU_USUARIO.github.io/clima-app/`

### 📊 **Monitorear el Deployment:**
- Ve a tu repositorio → pestaña **"Actions"**
- Ahí verás el progreso de cada deployment
- Si hay errores, aparecerán ahí para que puedas solucionarlos

---

## 🛠️ **Comandos Útiles para el Futuro:**

### **Subir Cambios:**
```bash
git add .
git commit -m "descripción de los cambios"
git push
```

### **Deployment Manual (si es necesario):**
```bash
# En Windows:
./deploy.bat

# En Linux/Mac:
./deploy.sh
```

### **Compilar Localmente:**
```bash
npm run build
npm run preview  # Para probar la versión de producción
```

---

## 🎯 **Ventajas de GitHub Pages:**

✅ **Gratuito** para repositorios públicos  
✅ **HTTPS automático** con certificado SSL  
✅ **CDN global** para carga rápida mundial  
✅ **Deployment automático** con cada push  
✅ **Compatible con PWA** - tu aplicación será instalable  
✅ **Dominio personalizado** (opcional)  

---

## 🏆 **Tu Aplicación Incluye:**

🌤️ **Datos meteorológicos reales** con Open-Meteo API  
🌍 **Multiidioma** (Español/Inglés)  
📱 **PWA instalable** en móviles y desktop  
🎨 **Diseño moderno** con gradientes y glassmorphism  
⚡ **Rendimiento optimizado** con Vite  
🔄 **Geolocalización** automática  
📊 **Pronósticos detallados** por horas y días  

---

## 🚨 **Importante:**

- Reemplaza `TU_USUARIO` con tu usuario real de GitHub en todos los archivos
- Tu repositorio debe ser **público** para usar GitHub Pages gratuito
- La primera vez puede tardar 5-10 minutos en estar disponible
- El dominio será: `https://TU_USUARIO.github.io/clima-app/`

**¡Tu aplicación estará disponible mundialmente una vez completados estos pasos!** 🌍✨