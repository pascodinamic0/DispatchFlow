import { z } from "zod";

export const createInventoryItemSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(64),
  name: z.string().min(2, "Name is required").max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  category: z.string().max(100).optional().or(z.literal("")),
  unit: z.string().max(32).default("ea"),
  quantityOnHand: z.coerce.number().min(0).default(0),
  reorderLevel: z.coerce.number().min(0).default(0),
  location: z.string().max(200).optional().or(z.literal("")),
});

export const stockMovementSchema = z.object({
  itemId: z.string().uuid(),
  movementType: z.enum(["in", "out", "adjustment"]),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  notes: z.string().max(500).optional().or(z.literal("")),
});
