---
title: "Email procurement archaeology: what buried approvals cost multi-branch teams"
slug: "email-procurement-archaeology-cost"
description: "When purchase requests live in inboxes, approvals stall, priorities vanish, and branches invent workarounds. How to stop paying for email archaeology every week."
date: 2026-10-18
author: "DispatchFlow Team"
category: "Procurement"
readingTimeMinutes: 11
app: "dispatchflow"
primaryKeyword: "email procurement approval process"
secondaryKeywords:
  - "purchase request email chaos"
  - "procurement approval cycle time"
  - "multi-branch purchasing workflow"
score: 92
ctaLabel: "Explore DispatchFlow"
ctaUrl: "https://dispatch-flow-one.vercel.app"
---

# Email procurement archaeology: what buried approvals cost multi-branch teams

A branch manager in Nairobi forwards a purchase need to "the usual thread." The attachment is a photo of a handwritten list. Two managers reply "ok" without quoting quantities. A week later finance asks for the approved budget line. Nobody can find the original message because it sat in a personal inbox while someone was on leave. Dispatch waits. The branch buys locally at a worse price. That is not a one-off. That is email procurement as a system — and you already pay for it.

## What email procurement archaeology means

**Email procurement archaeology** is reconstructing who requested what, who approved it, and at which priority by digging through inboxes, forwards, and CC chains after the fact.

Email is a fine notification channel. It is a poor request object. Messages do not have durable IDs that inventory and dispatch can close against. "Ok" is not a structured approval with a timestamp, role, and budget code.

## The costs you already recognize

### 1. Cycle time you cannot see

If median approval time is invisible, you only notice when a branch screams. Silent stalls do not appear in monthly packs until stockouts force expensive spot buys.

### 2. Priority inversion

The loudest email wins. A critical spare for a revenue line waits behind a polite request for office chairs because the chair thread had more executives CC'd.

### 3. Duplicate buys

Two branches escalate the same shortage in different threads. Both get approved. Both receive stock. Working capital sits in the wrong place.

### 4. Audit pain

Internal audit asks for the approval chain. You produce screenshots. Screenshots are not controls.

| Leak | How it shows up | What it costs |
|------|-----------------|---------------|
| Buried approval | Leave + inbox | Days of stall |
| Vague "ok" | No qty / SKU | Wrong shipment |
| CC politics | Priority by volume | Criticals wait |
| Personal threads | Staff exit | Lost history |

## Framework: turn mail into a request object

1. **Capture once** — requester submits SKU, qty, priority, need-by date, and reason in a form, not a paragraph.
2. **Route by rules** — category and amount pick the approver; backup approver when primary is offline.
3. **Notify in email** — mail can alert; the decision happens on the request record.
4. **Hand to dispatch** — approved requests become dispatch work with the same ID.
5. **Close the loop** — delivery confirmation and inventory movement reference that ID.

If step 3 is "reply all with ok," you are still doing archaeology.

## Believable scenario (multi-branch DRC / Kenya)

A retail group runs five branches. Procurement sits in HQ. Branches email needs throughout the day. One buyer filters by subject lines that include "URGENT." A Limete branch that writes clear subjects gets faster service than a quieter branch with older stockouts. After three months, leadership believes Limete "has higher demand." Demand was never measured — only email skill.

## Mistakes that keep the leak open

- Approving in the body of a forward with no structured fields
- Letting each branch invent SKU nicknames
- Using personal Gmail for "speed" on company spend
- Mixing supplier negotiation threads with internal approval threads
- Measuring procurement by emails answered instead of requests closed on time

## How AI changes procurement (honestly)

AI can draft purchase descriptions, suggest similar past SKUs, and flag unusual quantities. It cannot invent an approval that never happened on a durable record. Put the object first. Then automate the chasing.

## Tools and checklist

**Tools that help:** request forms with priority, SLA clocks on approvals, backup routing, link from approved request to dispatch, export for finance.

**Weekly procurement health checklist**

- [ ] Median and P90 approval times visible by category
- [ ] Critical requests older than 48h have named owners
- [ ] No approvals living only in personal inboxes
- [ ] Duplicate SKU requests across branches are detectable
- [ ] Last month's disputed buy has a reconstructable chain in under five minutes

## FAQ

**Can we keep email for suppliers?** Yes. Keep supplier negotiation in mail if you must. Keep internal request and approval on the record.

**What if requesters refuse forms?** Make the form faster than writing a clear email. If the form is slower, they will bypass it — and they will be right.

**Is a shared mailbox enough?** Better than personal inboxes. Still not a request ID, priority queue, or inventory link.

## What "ok" actually fails to capture

A useful approval answers: who, when, which lines, which budget, which priority, and under which policy. Email "ok" answers none of those reliably when the thread has been forwarded three times and the attachment was replaced.

### The leave problem

Every mid-size ops team has a story about the buyer who went on leave with approvals trapped in their inbox. Shared mailboxes help. Structured queues help more. Backup approvers help most when the SLA clock is visible and red.

## Side-by-side request quality

| Field | Email habit | Structured request |
|-------|-------------|--------------------|
| SKU | Nickname | Code + name |
| Qty | "a few" / photo | Number |
| Priority | URGENT in caps | Enum + SLA |
| Need-by | "ASAP" | Date |
| Approver | Whoever is CC'd | Routed role |
| Link to dispatch | None | Same ID |

## Implementation steps (one category pilot)

1. Pick the category with the most disputes.
2. Ban email approval for that category for two weeks (notify-only mail is fine).
3. Publish the backup approver list.
4. Measure median cycle time before and after.
5. Show finance the export of approvals for that category.

If cycle time does not drop, your form is too slow or routing is wrong — fix that before expanding.

A practical exercise: take last month's most painful delayed buy and reconstruct the chain in fifteen minutes. If you cannot, that buy is your pilot category.



Readers evaluating platforms should ask vendors to show these controls on sample data in the first call — not after contract. Curiosity here is cheaper than cleanup later.

## Soft pillar (Operations Coverage)

Stopping people from being the glue between inbox, approval, and dispatch is core **Operations Coverage**. DispatchFlow treats procurement requests as first-class objects that flow into dispatch and inventory.

## Next step

Another month of digging for "who approved this?" — or one queue where priority, owner, and age are visible before lunch.

**[Explore DispatchFlow](https://dispatch-flow-one.vercel.app)** — see approvals by priority without rebuilding the trail from email.
