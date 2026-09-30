import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const modules = [
  "auth",
  "dashboard",
  "leads",
  "lead-scoring",
  "ai-agent",
  "whatsapp",
  "follow-ups",
  "pipeline",
  "quotations",
  "appointments",
  "payments",
  "billing-invoices",
  "campaigns",
  "analytics",
  "ask-tivra",
  "knowledge-base",
  "project-handover",
  "projects",
  "tasks",
  "sales-team",
  "employees-roles",
  "notifications",
  "admin",
  "settings",
  "audit-logs",
];

app.get("/api/health", (_, res) =>
  res.json({ ok: true, service: "tivra-ai-api" })
);

app.get("/api/modules", (_, res) =>
  res.json({
    modules,
    workflow: [
      "Lead CRM",
      "Sales Pipeline",
      "Quotation",
      "Payment",
      "Invoice",
      "Project Handover",
      "Project",
      "Task",
      "QA / Review",
      "Completed / Closed",
    ],
  })
);

app.listen(Number(process.env.PORT || 5000), () =>
  console.log(`TIVRA API running on ${process.env.PORT || 5000}`)
);
