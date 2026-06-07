export type UserRole =
  | "admin"
  | "dispatcher"
  | "procurement"
  | "requester"
  | "viewer";

export type RequestStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "in_dispatch"
  | "delivered"
  | "cancelled";

export type DispatchStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "failed"
  | "cancelled";

export type InventoryMovementType = "in" | "out" | "adjustment";
export type InviteStatus = "pending" | "accepted" | "revoked";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string;
          full_name: string;
          role: UserRole;
          department: string | null;
          phone: string | null;
          avatar_url: string | null;
          email_notifications_enabled: boolean;
          push_notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id: string;
          full_name: string;
          role?: UserRole;
          department?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          email_notifications_enabled?: boolean;
          push_notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          full_name?: string;
          role?: UserRole;
          department?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          email_notifications_enabled?: boolean;
          push_notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      procurement_requests: {
        Row: {
          id: string;
          organization_id: string;
          requester_id: string;
          title: string;
          description: string | null;
          status: RequestStatus;
          priority: "low" | "normal" | "high" | "urgent";
          destination: string | null;
          needed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          requester_id: string;
          title: string;
          description?: string | null;
          status?: RequestStatus;
          priority?: "low" | "normal" | "high" | "urgent";
          destination?: string | null;
          needed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          requester_id?: string;
          title?: string;
          description?: string | null;
          status?: RequestStatus;
          priority?: "low" | "normal" | "high" | "urgent";
          destination?: string | null;
          needed_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "procurement_requests_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "procurement_requests_requester_id_fkey";
            columns: ["requester_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dispatches: {
        Row: {
          id: string;
          organization_id: string;
          request_id: string | null;
          reference_code: string;
          status: DispatchStatus;
          assignee_name: string | null;
          origin: string | null;
          destination: string | null;
          scheduled_at: string | null;
          delivered_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          request_id?: string | null;
          reference_code: string;
          status?: DispatchStatus;
          assignee_name?: string | null;
          origin?: string | null;
          destination?: string | null;
          scheduled_at?: string | null;
          delivered_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          request_id?: string | null;
          reference_code?: string;
          status?: DispatchStatus;
          assignee_name?: string | null;
          origin?: string | null;
          destination?: string | null;
          scheduled_at?: string | null;
          delivered_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dispatches_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dispatches_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "procurement_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_items: {
        Row: {
          id: string;
          organization_id: string;
          sku: string;
          name: string;
          description: string | null;
          category: string | null;
          unit: string;
          quantity_on_hand: number;
          reorder_level: number;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          sku: string;
          name: string;
          description?: string | null;
          category?: string | null;
          unit?: string;
          quantity_on_hand?: number;
          reorder_level?: number;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          sku?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          unit?: string;
          quantity_on_hand?: number;
          reorder_level?: number;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_items_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_movements: {
        Row: {
          id: string;
          organization_id: string;
          item_id: string;
          movement_type: InventoryMovementType;
          quantity: number;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          item_id: string;
          movement_type: InventoryMovementType;
          quantity: number;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          item_id?: string;
          movement_type?: InventoryMovementType;
          quantity?: number;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_movements_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_movements_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          href: string | null;
          read_at: string | null;
          email_sent_at: string | null;
          push_sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          href?: string | null;
          read_at?: string | null;
          email_sent_at?: string | null;
          push_sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string;
          href?: string | null;
          read_at?: string | null;
          email_sent_at?: string | null;
          push_sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      organization_invites: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          role: UserRole;
          invited_by: string;
          status: InviteStatus;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          email: string;
          role?: UserRole;
          invited_by: string;
          status?: InviteStatus;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          email?: string;
          role?: UserRole;
          invited_by?: string;
          status?: InviteStatus;
          created_at?: string;
          expires_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organization_invites_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organization_invites_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      request_line_items: {
        Row: {
          id: string;
          organization_id: string;
          request_id: string;
          inventory_item_id: string;
          quantity: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          request_id: string;
          inventory_item_id: string;
          quantity: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          request_id?: string;
          inventory_item_id?: string;
          quantity?: number;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "request_line_items_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "request_line_items_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "procurement_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "request_line_items_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_organization: {
        Args: { p_name: string; p_slug: string };
        Returns: string;
      };
      auth_user_organization_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      auth_user_role: {
        Args: Record<string, never>;
        Returns: UserRole | null;
      };
      mark_notification_delivery_sent: {
        Args: {
          p_notification_id: string;
          p_email_sent?: boolean;
          p_push_sent?: boolean;
        };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: UserRole;
      request_status: RequestStatus;
      dispatch_status: DispatchStatus;
      inventory_movement_type: InventoryMovementType;
      invite_status: InviteStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
