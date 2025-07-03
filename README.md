# Solution Hub 🚀

> Sistema SaaS completo para gestão de licitações e processos de licitação para Solution Assessoria em Licitações.

## 📋 Visão Geral

O **Solution Hub** é uma plataforma SaaS abrangente que oferece uma solução completa para gerenciamento de licitações públicas e processos de licitação. Desenvolvido com tecnologias modernas, oferece uma interface intuitiva e recursos avançados para otimizar todo o ciclo de vida das licitações.

## 🏗️ Arquitetura

```
SolutionsHub/
├── apps/
│   ├── frontend/          # React + TypeScript + Tailwind CSS
│   └── backend/           # NestJS + TypeScript + PostgreSQL
├── packages/              # Bibliotecas compartilhadas (futuro)
└── docs/                  # Documentação (futuro)
```

### 🎯 Stack Tecnológica

**Frontend:**
- React 19 com TypeScript
- Tailwind CSS para estilização
- React Router para roteamento
- React Hook Form + Zod para formulários
- Axios para requisições HTTP
- Lucide React para ícones

**Backend:**
- NestJS com TypeScript
- PostgreSQL com TypeORM
- JWT para autenticação
- WebSockets para notificações em tempo real
- bcryptjs para segurança

## 🔧 Módulos Principais

### 1. 👥 CRM (Cliente 360°)
- Gestão completa de clientes
- Planos e contratos
- Histórico de interações
- Segmentação avançada

### 2. 🧠 Inteligência de Mercado
- Integração com API PNCP
- Monitoramento de licitações em tempo real
- Análise de tendências
- Alertas personalizados

### 3. 🎯 Gestão de Oportunidades
- Atribuição inteligente de licitações
- Tracking de oportunidades
- Funil de vendas
- Relatórios de conversão

### 4. 📢 Central de Alertas
- Notificações multi-canal (email, WhatsApp)
- Alertas personalizáveis
- Histórico de notificações
- Templates de mensagens

### 5. 💰 Financeiro
- Gestão de contratos
- Controle de comissões
- Faturamento automático
- Relatórios financeiros

### 6. 📄 Gestão Documental
- Templates de documentos
- Assinatura digital
- Versionamento
- Armazenamento seguro

### 7. 📊 Dashboard Analítico
- KPIs em tempo real
- Métricas de performance
- Relatórios customizáveis
- Visualizações interativas

### 8. ⚡ Produtividade
- Kanban boards
- Gestão de tarefas
- Calendário integrado
- Colaboração em equipe

## 🎨 Design System

### Paleta de Cores
- **Primária**: `#FFC107` (Amarelo) - Botões, destaques, gráficos
- **Secundária**: `#212121` (Cinza escuro) - Textos, backgrounds de menu
- **Background**: `#FFFFFF` (Branco) e `#F5F5F5` (Cinza claro)

### Tipografia
- **Fonte principal**: Inter
- **Estilo**: Interface moderna e limpa com bastante espaço em branco

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Instalação das Dependências

```bash
# Instalar dependências do projeto
npm install

# Ou instalar dependências de cada app separadamente
cd apps/frontend && npm install
cd ../backend && npm install
```

### 2. Configuração do Ambiente

**Backend:**
```bash
# Copiar arquivo de ambiente
cd apps/backend
cp .env.example .env

# Editar as configurações necessárias
# - Configurar banco de dados PostgreSQL
# - Definir secrets JWT
# - Configurar APIs externas (PNCP, WhatsApp, etc.)
```

**Frontend:**
```bash
# O frontend já está configurado com Tailwind CSS
cd apps/frontend
```

### 3. Executando o Projeto

**Opção 1: Usando VS Code Tasks**
- Abrir o VS Code na pasta raiz
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Full Stack"

**Opção 2: Terminal Manual**
```bash
# Terminal 1 - Backend
cd apps/backend
npm run start:dev

# Terminal 2 - Frontend
cd apps/frontend
npm start
```

### 4. Acessando a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Documentação da API**: http://localhost:3001/api/v1/docs (em breve)

## 🔐 Segurança e Conformidade

### Recursos de Segurança
- ✅ Autenticação JWT com refresh tokens
- ✅ Criptografia HTTPS
- ✅ Criptografia de dados em repouso
- ✅ Logs de auditoria
- ✅ Controle de acesso baseado em funções (RBAC)

### LGPD Compliance
- ✅ Consentimento explícito para coleta de dados
- ✅ Direito ao esquecimento
- ✅ Portabilidade de dados
- ✅ Anonimização de dados sensíveis

## 🔌 Integrações Externas

### APIs Integradas
- **PNCP**: Dados de licitações em tempo real
- **WhatsApp Business**: Notificações via WhatsApp
- **SendGrid/Amazon SES**: Envio de emails
- **Clicksign/D4Sign**: Assinatura digital
- **AWS S3/Google Cloud**: Armazenamento de arquivos

## 📈 Desenvolvimento

### Comandos Úteis

```bash
# Instalar dependências
npm run install:all

# Desenvolvimento
npm run dev              # Ambos frontend + backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend

# Build
npm run build:all        # Build completo
npm run build:frontend   # Build do frontend
npm run build:backend    # Build do backend

# Testes
npm run test:all         # Todos os testes
npm run test:frontend    # Testes do frontend
npm run test:backend     # Testes do backend

# Linting
npm run lint:all         # Linting completo
npm run lint:fix         # Corrigir issues de linting
```

### Estrutura de Commits
```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

## 📱 Responsividade

O Solution Hub é totalmente responsivo e otimizado para:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1024px - 1919px)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da **Solution Assessoria em Licitações** e está sob licença proprietária.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- 📧 Email: suporte@solutionhub.com.br
- 📱 WhatsApp: +55 (11) 99999-9999
- 🌐 Website: https://solutionhub.com.br

---

**Desenvolvido com ❤️ pela equipe Solution Hub** 🚀
