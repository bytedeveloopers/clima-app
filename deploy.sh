#!/bin/bash

# Script de deployment para GitHub Pages
# Ejecutar desde la raíz del proyecto: ./deploy.sh

echo "🚀 Iniciando deployment a GitHub Pages..."

# Verificar que estamos en la rama main
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    echo "❌ Error: Debes estar en la rama main o master para hacer deployment"
    exit 1
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Hay cambios sin commitear. Por favor, commitea todos los cambios primero."
    git status
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Ejecutar build
echo "🔨 Compilando aplicación..."
npm run build

# Verificar que el build fue exitoso
if [ $? -ne 0 ]; then
    echo "❌ Error en el build"
    exit 1
fi

# Hacer commit de los cambios (si los hay)
git add .
if [ -n "$(git status --porcelain)" ]; then
    git commit -m "chore: update build for deployment"
fi

# Push a GitHub
echo "📤 Subiendo cambios a GitHub..."
git push origin $current_branch

echo "✅ Deployment iniciado! El sitio estará disponible en unos minutos en:"
echo "   https://bytedeveloopers.github.io/clima-app/"
echo ""
echo "💡 Para ver el progreso del deployment:"
echo "   https://github.com/bytedeveloopers/clima-app/actions"