import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { LeadStage, Temperature } from "@prisma/client";

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

/* =====================================================
   HEALTH
===================================================== */

app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    service: "tivra-ai-api",
  });
});

/* =====================================================
   MODULES
===================================================== */

app.get("/api/modules", (_, res) => {
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
  });
});

/* =====================================================
   REGISTER
===================================================== */

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
    } = req.body;

    // Validation
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and company name are required.",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
      String(password),
      12
    );

    // Create tenant + user
    const result = await prisma.$transaction(
      async (tx) => {
        const tenant = await tx.tenant.create({
          data: {
            name: String(companyName).trim(),
          },
        });

        const user = await tx.user.create({
          data: {
            tenantId: tenant.id,
            name: String(name).trim(),
            email: normalizedEmail,
            passwordHash,
            role: "SUPER_ADMIN",
          },
        });

        return {
          tenant,
          user,
        };
      }
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful.",

      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        tenantId: result.user.tenantId,
      },

      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong during registration.",
    });
  }
});

/* =====================================================
   LOGIN
===================================================== */

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      String(password),
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Successful login
    return res.status(200).json({
      success: true,
      message: "Login successful.",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },

      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong during login.",
    });
  }
});

/* =====================================================
   SERVER
===================================================== */
/* =====================================================
   LEADS
===================================================== */

function normalizeLeadPayload(body: any) {
  const allowedStages = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "DEMO",
    "QUOTATION",
    "NEGOTIATION",
    "WON",
    "LOST",
  ];

  const allowedTemperatures = ["HOT", "WARM", "COLD"];

  const stage = String(body.stage || "NEW").toUpperCase();
  const temperature = String(body.temperature || "COLD").toUpperCase();

  if (!allowedStages.includes(stage)) {
    throw new Error("Invalid lead stage.");
  }

  if (!allowedTemperatures.includes(temperature)) {
    throw new Error("Invalid lead temperature.");
  }

  return {
    name: String(body.name || "").trim(),
    company: body.company ? String(body.company).trim() : null,
    phone: body.phone ? String(body.phone).trim() : null,
    email: body.email ? String(body.email).trim().toLowerCase() : null,
    location: body.location ? String(body.location).trim() : null,
    businessType: body.businessType
      ? String(body.businessType).trim()
      : null,
    product: body.product ? String(body.product).trim() : null,
    quantity: body.quantity ? String(body.quantity).trim() : null,
    budget: body.budget ? String(body.budget).trim() : null,
    timeline: body.timeline ? String(body.timeline).trim() : null,
    requirements: body.requirements
      ? String(body.requirements).trim()
      : null,
    source: body.source ? String(body.source).trim() : null,
    campaign: body.campaign ? String(body.campaign).trim() : null,
    score: Math.max(
      0,
      Math.min(100, Number.isFinite(Number(body.score)) ? Number(body.score) : 0)
    ),
    temperature: temperature as Temperature,
    stage: stage as LeadStage,
  };
}

/* =====================================================
   EMPLOYEES / USERS
===================================================== */

/* GET USERS / EMPLOYEES FOR CURRENT TENANT */
app.get("/api/users", async (req, res) => {
  try {
    const tenantId = String(req.query.tenantId || "").trim();

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    const users = await prisma.user.findMany({
      where: {
        tenantId,
      },
      select: {
        id: true,
        tenantId: true,
        name: true,
        email: true,
        role: true,
        jobTitle: true,
        employeeCode: true,
        phone: true,
        department: true,
        status: true,
        joiningDate: true,
        location: true,
        notes: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get employees error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch employees.",
    });
  }
});

// CREATE EMPLOYEE
app.post("/api/users", async (req, res) => {
  try {
    const {
      tenantId,
      name,
      email,
      passwordHash,
      role,
       jobTitle,
      employeeCode,
      phone,
      department,
      status,
      joiningDate,
      location,
      notes,
    } = req.body;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Employee name is required.",
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: "Employee email is required.",
      });
    }

    if (!department || !String(department).trim()) {
      return res.status(400).json({
        success: false,
        message: "Department is required.",
      });
    }

    if (!role || !String(role).trim()) {
      return res.status(400).json({
        success: false,
        message: "Role is required.",
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: String(email).trim(),
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An employee with this email already exists.",
      });
    }

    const user = await prisma.user.create({
      data: {
        tenantId,
        name: String(name).trim(),
        email: String(email).trim(),
        jobTitle: jobTitle ? String(jobTitle).trim() : null,
        passwordHash:
          passwordHash && String(passwordHash).trim()
            ? String(passwordHash)
            : await bcrypt.hash("Welcome@123", 10),

        role,

        employeeCode: employeeCode
          ? String(employeeCode).trim()
          : null,

        phone: phone
          ? String(phone).trim()
          : null,

        department: department
          ? String(department).trim()
          : null,

        status: status === "INACTIVE" ? "INACTIVE" : "ACTIVE",

        joiningDate: joiningDate
          ? new Date(`${joiningDate}T00:00:00`)
          : null,

        location: location
          ? String(location).trim()
          : null,

        notes: notes
          ? String(notes).trim()
          : null,
      },

      select: {
        id: true,
        tenantId: true,
        name: true,
        email: true,
        role: true,
        employeeCode: true,
        phone: true,
        department: true,
        status: true,
        joiningDate: true,
        location: true,
        notes: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      user,
    });
  } catch (error) {
    console.error("Create employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create employee.",
    });
  }
});

// UPDATE EMPLOYEE
app.patch("/api/users/:id", async (req, res) => {
  try {
    const userId = String(req.params.id || "").trim();

    const {
      tenantId,
      name,
      email,
      role,
      jobTitle,
      employeeCode,
      phone,
      department,
      status,
      joiningDate,
      location,
      notes,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
    }

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Employee name is required.",
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: "Employee email is required.",
      });
    }

    const duplicateEmail = await prisma.user.findFirst({
      where: {
        email: String(email).trim(),
        NOT: {
          id: userId,
        },
      },
    });

    if (duplicateEmail) {
      return res.status(409).json({
        success: false,
        message: "Another employee already uses this email.",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        jobTitle: jobTitle ? String(jobTitle).trim() : null,
        role,

        employeeCode: employeeCode
          ? String(employeeCode).trim()
          : null,

        phone: phone
          ? String(phone).trim()
          : null,

        department: department
          ? String(department).trim()
          : null,

        status: status === "INACTIVE" ? "INACTIVE" : "ACTIVE",

        joiningDate: joiningDate
          ? new Date(`${joiningDate}T00:00:00`)
          : null,

        location: location
          ? String(location).trim()
          : null,

        notes: notes
          ? String(notes).trim()
          : null,
      },

      select: {
  id: true,
  tenantId: true,
  name: true,
  email: true,
  role: true,
  jobTitle: true,
  employeeCode: true,
  phone: true,
  department: true,
  status: true,
  joiningDate: true,
  location: true,
  notes: true,
  createdAt: true,
},
    });

    return res.json({
      success: true,
      message: "Employee updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update employee.",
    });
  }
});


// DELETE EMPLOYEE
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = String(req.params.id || "").trim();
    const tenantId = String(req.query.tenantId || "").trim();

    if (!userId || !tenantId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and Tenant ID are required.",
      });
    }

    const employee = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const assignedLeadCount = await prisma.lead.count({
      where: {
        ownerId: userId,
      },
    });

    if (assignedLeadCount > 0) {
      return res.status(409).json({
        success: false,
        message: `This employee cannot be deleted because ${assignedLeadCount} lead(s) are assigned to them. Reassign the leads first.`,
      });
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    console.error("Delete employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete employee.",
    });
  }
});


/* GET ALL LEADS */
app.get("/api/leads", async (req, res) => {
  try {
    const tenantId = String(req.query.tenantId || "").trim();

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    const leads = await prisma.lead.findMany({
      where: { tenantId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, leads });
  } catch (error) {
    console.error("Get leads error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch leads.",
    });
  }
});

/* CREATE LEAD */
app.post("/api/leads", async (req, res) => {
  try {
    const tenantId = String(req.body.tenantId || "").trim();
    const ownerId = req.body.ownerId
      ? String(req.body.ownerId).trim()
      : null;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    const data = normalizeLeadPayload(req.body);

    if (!data.name) {
      return res.status(400).json({
        success: false,
        message: "Lead name is required.",
      });
    }

    if (ownerId) {
      const owner = await prisma.user.findFirst({
        where: { id: ownerId, tenantId },
      });

      if (!owner) {
        return res.status(400).json({
          success: false,
          message: "Lead owner does not belong to this workspace.",
        });
      }
    }

    const lead = await prisma.lead.create({
      data: {
        tenantId,
        ownerId,
        ...data,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create lead.",
    });
  }
});

/* UPDATE LEAD */
app.patch("/api/leads/:id", async (req, res) => {
  try {
    const id = String(req.params.id);
    const tenantId = String(req.body.tenantId || "").trim();

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    const existing = await prisma.lead.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    const ownerId =
      req.body.ownerId === undefined
        ? existing.ownerId
        : req.body.ownerId
          ? String(req.body.ownerId).trim()
          : null;

    if (ownerId) {
      const owner = await prisma.user.findFirst({
        where: { id: ownerId, tenantId },
      });

      if (!owner) {
        return res.status(400).json({
          success: false,
          message: "Lead owner does not belong to this workspace.",
        });
      }
    }

    const data = normalizeLeadPayload({
      ...existing,
      ...req.body,
    });

    if (!data.name) {
      return res.status(400).json({
        success: false,
        message: "Lead name is required.",
      });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update lead.",
    });
  }
});

/* DELETE LEAD */
app.delete("/api/leads/:id", async (req, res) => {
  try {
    const id = String(req.params.id);
    const tenantId = String(req.query.tenantId || "").trim();

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    const existing = await prisma.lead.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error("Delete lead error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete lead.",
    });
  }
});

/* =====================================================
   QUOTATIONS
===================================================== */

app.get("/api/quotations", async (req, res) => {
  try {
    const tenantId = String(req.query.tenantId || "").trim();

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    const quotations = await prisma.quotation.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      quotations,
    });
  } catch (error) {
    console.error("Get quotations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch quotations.",
    });
  }
});

/* =====================================================
   FOLLOW-UPS
===================================================== */

app.get("/api/follow-ups", async (req, res) => {
  try {
    const tenantId = String(req.query.tenantId || "").trim();

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required.",
      });
    }

    const followUps = await prisma.followUp.findMany({
      where: {
          leadId: {
            in: (
              await prisma.lead.findMany({
                where: { tenantId },
                select: { id: true },
              })
            ).map((lead) => lead.id),
          },
        },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    return res.json({
      success: true,
      followUps,
    });
  } catch (error) {
    console.error("Get follow-ups error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch follow-ups.",
    });
  }
});


/* =====================================================
   SERVER
===================================================== */
const PORT = Number(
  process.env.PORT || 5000
);



app.listen(PORT, () => {
  console.log(
    `TIVRA API running on ${PORT}`
  );
});