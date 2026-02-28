export type Locale = "en" | "id" | "ja";

export const LOCALES: Locale[] = ["en", "id", "ja"];

export const DICTIONARIES: Record<
  Locale,
  Record<string, string>
> = {
  en: {
    login: "Login",
    email: "Email",
    roleHint: "Role (hint)",
    admin: "Admin",
    client: "Client",
    sendMagicLink: "Send magic link",
    checkEmail: "Check your email for the login link.",
    reports: "Reports",
    clients: "Clients",
    templates: "Templates",
    reportTypes: "Report Types",
    analytics: "Analytics",
    logout: "Logout",
    rating: "Rating",
    submit: "Submit",
    save: "Save",
    published: "Published",
    draft: "Draft",
  },
  id: {
    login: "Masuk",
    email: "Email",
    roleHint: "Peran (petunjuk)",
    admin: "Admin",
    client: "Klien",
    sendMagicLink: "Kirim tautan masuk",
    checkEmail: "Periksa email Anda untuk tautan masuk.",
    reports: "Laporan",
    clients: "Klien",
    templates: "Templat",
    reportTypes: "Jenis Laporan",
    analytics: "Analitik",
    logout: "Keluar",
    rating: "Penilaian",
    submit: "Kirim",
    save: "Simpan",
    published: "Dipublikasikan",
    draft: "Draf",
  },
  ja: {
    login: "ログイン",
    email: "メール",
    roleHint: "ロール（ヒント）",
    admin: "管理者",
    client: "クライアント",
    sendMagicLink: "マジックリンク送信",
    checkEmail: "ログインリンクをメールで確認してください。",
    reports: "レポート",
    clients: "クライアント",
    templates: "テンプレート",
    reportTypes: "レポートタイプ",
    analytics: "分析",
    logout: "ログアウト",
    rating: "評価",
    submit: "送信",
    save: "保存",
    published: "公開済み",
    draft: "下書き",
  },
};

export function toLocale(value?: string | null): Locale {
  if (value === "id" || value === "ja" || value === "en") return value;
  return "en";
}

export function t(locale: Locale, key: string): string {
  return DICTIONARIES[locale][key] ?? DICTIONARIES.en[key] ?? key;
}
