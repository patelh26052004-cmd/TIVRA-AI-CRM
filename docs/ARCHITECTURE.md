# TIVRA AI Architecture

Public Landing Page -> Next.js -> CRM UI
CRM UI -> Node.js API -> PostgreSQL/Prisma
                         -> Redis/background workers (ready)
                         -> AI provider abstraction (ready)
                         -> Official WhatsApp API integration (ready for credentials)

Tenant isolation is represented in the Prisma schema through Tenant and tenantId fields.
Production security, authentication, RBAC enforcement, webhook idempotency, encryption, backups and monitoring must be implemented/configured before production deployment.
