---
title: Why your ops platform needs database-level isolation (RLS)
description: App-level permissions are not enough when one database serves many organizations. Row Level Security explained for operations leaders.
date: 2025-05-18
author: DispatchFlow Team
category: Security
readingTimeMinutes: 5
---

## The question IT will ask

"We are evaluating DispatchFlow. How do you make sure Organization A never sees Organization B's data?"

The answer should be one sentence: **Postgres Row Level Security, scoped to your organization on every table.**

If the vendor only mentions "we have roles in the app," dig deeper.

## What RLS does

Row Level Security is a **database rule**: when a user queries data, Postgres automatically filters rows to those their session is allowed to see.

That means even if application code has a bug, the database still enforces isolation — for requests, dispatches, inventory, and notifications.

## Roles vs RLS (you need both)

- **Roles** (admin, dispatcher, procurement, requester) define *what workflows* someone can perform
- **RLS** defines *which organization's rows* they can ever touch

DispatchFlow uses Supabase Auth for identity and RLS policies tied to `organization_id` — so a dispatcher at Company A cannot list shipments for Company B.

## Why this matters for African enterprise deployments

Many teams run:

- Multiple branches under one legal entity
- Sometimes pilot partners or subsidiaries in the same technical environment during rollout

You need **hard boundaries**, not trust in a shared admin panel.

## What you control

With your own Supabase project:

- You choose **region** and backup policy
- You own **migrations** and audit exports
- You can review policies with your security team

DispatchFlow is built to respect that — your data in your Postgres, not ours in an opaque multitenant silo.

## Checklist for any vendor

- Is isolation enforced in the database, not only the UI?
- Are policies tested per role in CI?
- Can you export audit logs for procurement and dispatch events?

[Read our Privacy Policy](/privacy) and [start a workspace](/signup) on your Supabase project.
