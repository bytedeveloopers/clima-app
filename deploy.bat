@echo off
echo 🚀 Iniciando deployment a GitHub Pages...

:: Verificar que no hay cambios sin commitear
git status --porcelain > temp_status.txt
set /p git_status=<temp_status.txt
del temp_status.txt

if not "%git_status%"=="" (
    echo ❌ Error: Hay cambios sin commitear. Por favor, commitea todos los cambios primero.
    git status
    pause
    exit /b 1
)

:: Instalar dependencias
echo 📦 Instalando dependencias...
call npm ci

:: Ejecutar build
echo 🔨 Compilando aplicación...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Error en el build
    pause
    exit /b 1
)

:: Hacer commit de los cambios (si los hay)
git add .
git status --porcelain > temp_status2.txt
set /p git_status2=<temp_status2.txt
del temp_status2.txt

if not "%git_status2%"=="" (
    git commit -m "chore: update build for deployment"
)

:: Push a GitHub
echo 📤 Subiendo cambios a GitHub...
git push origin main

echo ✅ Deployment iniciado! El sitio estará disponible en unos minutos en:
echo    https://bytedeveloopers.github.io/clima-app/
echo.
echo 💡 Para ver el progreso del deployment:
echo    https://github.com/bytedeveloopers/clima-app/actions
pause