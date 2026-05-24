/**
 * Ideal customer profile & positioning — source of truth for marketing copy.
 */

export const idealCustomer = {
  headline: "Enterprise operations teams running multi-branch logistics",
  oneLiner:
    "We help operations leaders at African and emerging-market enterprises unify procurement, dispatch, and inventory — without spreadsheets, WhatsApp chaos, or legacy ERP delays.",
  primarySegments: [
    {
      id: "ops-lead",
      title: "Operations & supply chain leads",
      pain: "No single view of requests in flight, trucks on the road, or stock by branch.",
      outcome: "Morning dashboards with KPIs, SLA awareness, and activity that matches reality.",
      triggers: [
        "3+ branches or warehouses",
        "Weekly leadership asks for status you compile manually",
        "Missed deliveries blamed on \"no one knew\"",
      ],
    },
    {
      id: "procurement",
      title: "Procurement & internal supply teams",
      pain: "Approvals stuck in email, priorities unclear, finance asking for audit trails.",
      outcome: "Request → approve → dispatch in one system with status history.",
      triggers: [
        "Duplicate orders across branches",
        "No priority field when everything is \"urgent\"",
        "Auditors want traceability you cannot produce quickly",
      ],
    },
    {
      id: "dispatcher",
      title: "Dispatchers & fleet coordinators",
      pain: "Driver assignments on calls, status updates lost in chat, customers calling for ETA.",
      outcome: "Assign loads, update in-transit status from mobile, close with delivery proof.",
      triggers: [
        "Field teams resist desktop-only tools",
        "In-transit exceptions discovered too late",
        "Inventory not updated when deliveries complete",
      ],
    },
  ],
  industries: [
    "FMCG & distribution",
    "Pharmaceuticals & medical supply",
    "Construction materials",
    "NGO & humanitarian logistics",
    "Retail chains with central warehousing",
    "Manufacturing with internal transfers",
  ],
  geographies: [
    "Democratic Republic of Congo",
    "Kenya, Uganda, Tanzania",
    "Nigeria, Ghana, Côte d'Ivoire",
    "South Africa",
    "Broader Sub-Saharan Africa and diaspora HQs",
  ],
  notFor: [
    "Consumer last-mile marketplaces (Uber-style)",
    "Single-location shops with no internal transfers",
    "Teams that only need a simple shared spreadsheet",
  ],
} as const;

export const positioning = {
  enemy: "Scattered spreadsheets, WhatsApp threads, and legacy ERPs your team never adopted",
  problem:
    "Operations scale faster than your tools. Branches submit requests differently, dispatchers work from memory, and leadership gets numbers days late.",
  mechanism:
    "One calm platform: procurement requests, dispatch control, and inventory — role-based, mobile-ready, secured with Postgres RLS per organization.",
  outcome:
    "Request. Track. Deliver. — with the same UI your operators use daily and dashboards leadership trusts every morning.",
} as const;
