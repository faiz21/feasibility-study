import { redirect } from "next/navigation";

export default async function DeprecatedReportTypePage() {
  redirect("/reports");
}
