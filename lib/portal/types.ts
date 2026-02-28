import type { Locale } from "@/lib/i18n/dictionaries";

export type AppRole = "admin" | "client";

export type Profile = {
  user_id: string;
  role: AppRole;
  client_id: string | null;
  locale: Locale;
};

export type ReportListItem = {
  id: string;
  status: "draft" | "published";
  thumbnail_url: string | null;
  entity_id: string;
  report_type_template_id: string;
  published_at: string | null;
};
