@echo off
echo 🚀 Solution Hub - Teste de Inicialização
echo ========================================

echo 📊 Testando Backend (NestJS)...
cd apps\backend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro na compilação do backend
    pause
    exit /b 1
)
echo ✅ Backend compilado com sucesso!

echo 🎨 Testando Frontend (React)...
cd ..\frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro na compilação do frontend
    pause
    exit /b 1
)
echo ✅ Frontend compilado com sucesso!

echo.
echo 🎉 Solution Hub está pronto para uso!
echo.
echo Para iniciar o desenvolvimento:
echo 1. Backend: cd apps\backend ^&^& npm run start:dev
echo 2. Frontend: cd apps\frontend ^&^& npm start
echo.
echo Ou use as tasks do VS Code: Ctrl+Shift+P -^> 'Start Full Stack'
pause
