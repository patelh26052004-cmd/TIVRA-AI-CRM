# TIVRA AI — Development Workflow

This document is the quick reference for the project workflow.

## 1. Sales workflow

Lead is created in **Lead CRM**.

```text
Lead CRM
  → AI Lead Scoring
  → Sales Pipeline
  → Follow-up / Appointment / WhatsApp
  → Quotation
  → Payment
  → Billing / Invoice
```

## 2. Delivery workflow

After the commercial process is complete:

```text
Quotation
  → Payment verification
  → Invoice
  → Project Handover
  → Project
  → Development
  → QA
  → Client Review
  → Completed
  → Closed
```

## 3. Project information

Each project should keep:
- Client and contact information
- Quotation / payment / invoice references
- Handover reference
- Project manager
- Development lead
- Team / department
- Start and expected completion dates
- Requirements
- Deliverables
- Technology
- Development progress
- QA progress
- Client review progress
- Overall status and progress

## 4. Role and permission workflow

```text
Admin Panel
  → Employees & Roles
  → Create / Edit Role
  → Enable / Disable permissions
  → Assign employees
  → Protect roles that still have employees
```

The current role UI contains 14 permission types and shows employee count and role description.

## 5. Current implementation note

The UI is prepared as a working frontend demonstration using local component state and demo records. Backend/database persistence should be connected module-by-module after the UI workflow is approved.
