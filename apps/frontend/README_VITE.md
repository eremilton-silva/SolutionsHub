# Solution Hub - Frontend

Frontend da aplicação Solution Hub desenvolvido com **React** + **TypeScript** + **Vite**.

## 🚀 Tecnologias

- **React 19** - Biblioteca para interface de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Vitest** - Framework de testes
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Criar arquivo de variáveis de ambiente
cp .env.example .env.local
```

## 🔧 Configuração

Configure as variáveis de ambiente no arquivo `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_NODE_ENV=development
VITE_APP_NAME="Solution Hub"
VITE_APP_VERSION="1.0.0"
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_ANALYTICS=false
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Executar testes
npm run test

# Testes com interface gráfica
npm run test:ui

# Testes com coverage
npm run test:coverage
```

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes reutilizáveis
│   └── Layout/         # Layout da aplicação
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── services/           # Serviços e APIs
├── types/              # Definições de tipos TypeScript
└── utils/              # Utilitários e helpers
```

## 🎨 Design System

- **Cor Primária**: Amarelo `#FFC107`
- **Cor Secundária**: Cinza Escuro `#212121`
- **Fundo**: Branco `#FFFFFF` e Cinza Claro `#F5F5F5`
- **Tipografia**: Inter
- **Interface moderna e limpa** com muito espaço em branco

## 🔗 Integração com Backend

O frontend consome APIs REST do backend NestJS através do serviço `ApiService`.

### Endpoints principais:
- `/auth` - Autenticação
- `/crm` - Gestão de clientes
- `/market-intelligence` - Inteligência de mercado
- `/opportunities` - Gestão de oportunidades
- `/notifications` - Central de alertas

## 🧪 Testes

Os testes são executados com **Vitest** e **Testing Library**:

```bash
# Executar todos os testes
npm run test

# Executar testes específicos
npm run test -- src/components/Layout.test.tsx

# Executar testes em modo watch
npm run test -- --watch

# Gerar relatório de coverage
npm run test:coverage
```

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🔐 Autenticação

Sistema de autenticação JWT com:
- Login/logout
- Refresh tokens automático
- Proteção de rotas
- Persistência de sessão

## 🎯 Features Principais

### 1. **CRM (Cliente 360°)**
- Gestão completa de clientes
- Contratos e planos
- Histórico de interações

### 2. **Inteligência de Mercado**
- Integração com PNCP API
- Monitoramento de licitações
- Filtros avançados

### 3. **Gestão de Oportunidades**
- Pipeline de vendas
- Atribuição inteligente
- Acompanhamento de propostas

### 4. **Central de Alertas**
- Notificações em tempo real
- Multi-canal (email, WhatsApp)
- Configurações personalizadas

### 5. **Dashboard Analítico**
- KPIs em tempo real
- Gráficos interativos
- Relatórios customizados

## 🛠️ Desenvolvimento

### Estrutura de Componentes

```tsx
// Exemplo de componente
import { FC } from 'react'
import clsx from 'clsx'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: () => void
}

export const Button: FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        {
          'bg-yellow-400 hover:bg-yellow-500 text-gray-900': variant === 'primary',
          'bg-gray-200 hover:bg-gray-300 text-gray-700': variant === 'secondary',
        }
      )}
    >
      {children}
    </button>
  )
}
```

### API Service

```tsx
// Exemplo de uso do API Service
import { apiService } from '@/services/api.service'

const getClients = async () => {
  try {
    const response = await apiService.get('/crm/clients')
    return response.data
  } catch (error) {
    console.error('Error fetching clients:', error)
    throw error
  }
}
```

## 🚢 Deploy

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Preview do build
npm run preview
```

### Variáveis de Ambiente de Produção

```env
VITE_API_BASE_URL=https://api.solutionhub.com
VITE_NODE_ENV=production
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_ANALYTICS=true
```

## 📄 Licença

Este projeto é propriedade da Solution Assessoria em Licitações.
