# TIVRA AI CRM

TIVRA AI is a CRM / AI Sales Engine frontend foundation built with Next.js, TypeScript and Tailwind CSS, with an Express + Prisma backend foundation.

## Current application modules

### Sales
- Lead CRM
- AI Lead Scoring
- AI Sales Agent
- WhatsApp AI
- Smart Follow-ups
- Sales Pipeline
- Quotations
- Appointments
- Payments
- Billing / Invoices

### Marketing & Intelligence
- Campaigns
- AI Analytics
- Ask TIVRA AI
- Knowledge Base

### Management
- Project Handover
- Projects
- Tasks
- Sales Team
- Employees & Roles
- Notifications
- Admin Panel
- Settings

## Core business workflow

```text
Lead CRM
   ↓
Sales Pipeline
   ↓
Quotation
   ↓
Payment
   ↓
Invoice
   ↓
Project Handover
   ↓
Project
   ↓
Development
   ↓
QA
   ↓
Client Review
   ↓
Completed
   ↓
Closed
```

### Project workflow data

The Projects UI includes:
- Project code and project name
- Client/company and contact details
- Handover, quotation, payment and invoice references
- Project manager and development lead
- Department / team
- Start date and expected completion date
- Project status and overall progress
- Development / QA / client-review progress
- Requirements
- Deliverables
- Technology / stack
- Demo project records
- Search and status filtering
- View, edit and delete project actions
- Status update workflow

### Project Handover

The Project Handover UI includes:
- Handover code
- Client/contact details
- Quotation, payment and invoice references
- Project manager / development lead
- Timeline
- Requirements, deliverables and technology
- Payment and invoice verification
- Handover checklist
- Handover status workflow

### Employees & Roles

The Employees & Roles UI includes:
- Employee management
- Role management
- Role description
- Employee count per role
- 14 permission types
- Enable / disable permissions
- View / edit roles
- Delete role with employee-assignment protection

## Tech stack

- Frontend: Next.js 14 + React + TypeScript + Tailwind CSS
- Icons: Lucide React
- Backend: Node.js + Express + TypeScript
- Database foundation: PostgreSQL + Prisma
- Theme: TIVRA orange + navy with Dark / Light mode

## Run locally

Requirements:
- Node.js 20 LTS recommended
- PostgreSQL if database features are enabled

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend: http://localhost:5000

## Important

The current dashboard modules contain demo/local UI data. Production multi-company persistence, authentication, PostgreSQL CRUD APIs, WhatsApp credentials, AI provider credentials and other external integrations still need to be connected before production deployment.

External credentials must be supplied by the deploying company; the project does not contain fake production credentials.
