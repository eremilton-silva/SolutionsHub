# Solution Hub - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is the **Solution Hub** - a comprehensive SaaS platform for managing public tenders and bidding processes for Solution Assessoria em Licitações.

## Architecture
- **Monorepo structure** with separate frontend and backend
- **Frontend**: React with TypeScript, Tailwind CSS, modern UI components
- **Backend**: NestJS with TypeScript, PostgreSQL database
- **Authentication**: JWT with refresh tokens
- **Real-time**: WebSocket integration for live notifications

## Key Modules
1. **CRM (Cliente 360°)** - Complete client management with plans and contracts
2. **Inteligência de Mercado** - PNCP API integration for tender monitoring
3. **Gestão de Oportunidades** - Smart tender assignment and tracking
4. **Central de Alertas** - Multi-channel notifications (email, WhatsApp)
5. **Financeiro** - Contract and commission management
6. **Gestão Documental** - Document templates and digital signatures
7. **Dashboard Analítico** - KPIs and performance metrics
8. **Produtividade** - Kanban boards and task management

## Design System
- **Primary Color**: Yellow `#FFC107` (buttons, highlights, charts)
- **Secondary Color**: Dark Gray `#212121` (text, menu backgrounds)
- **Background**: White `#FFFFFF` and Light Gray `#F5F5F5`
- **Typography**: Inter or Poppins fonts
- **Modern, clean interface** with plenty of whitespace

## Code Standards
- Use **TypeScript** everywhere for type safety
- Follow **clean architecture** principles
- Implement **SOLID** design patterns
- Use **React hooks** and functional components
- Apply **responsive design** for desktop/tablet/mobile
- Include **error handling** and **loading states**
- Write **comprehensive tests**
- Follow **LGPD compliance** for data privacy

## API Integration
- **PNCP API** for real-time tender data
- **WhatsApp Business API** for notifications
- **Email services** (SendGrid/Amazon SES)
- **Digital signature** platforms (Clicksign/D4Sign)
- **Cloud storage** (AWS S3/Google Cloud)

## Security
- JWT authentication with secure token management
- HTTPS encryption for all communications
- Data encryption at rest and in transit
- Audit logs for critical actions
- Role-based access control (RBAC)
- LGPD compliance implementation
