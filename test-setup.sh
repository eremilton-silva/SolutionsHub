#!/bin/bash

echo "🚀 Solution Hub - Teste de Inicialização"
echo "========================================"

# Teste do Backend
echo "📊 Testando Backend (NestJS)..."
cd apps/backend
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Backend compilado com sucesso!"
else
    echo "❌ Erro na compilação do backend"
    exit 1
fi

# Teste do Frontend
echo "🎨 Testando Frontend (React)..."
cd ../frontend
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend compilado com sucesso!"
else
    echo "❌ Erro na compilação do frontend"
    exit 1
fi

echo ""
echo "🎉 Solution Hub está pronto para uso!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "1. Backend: cd apps/backend && npm run start:dev"
echo "2. Frontend: cd apps/frontend && npm start"
echo ""
echo "Ou use as tasks do VS Code: Ctrl+Shift+P -> 'Start Full Stack'"
