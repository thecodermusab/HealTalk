import { redirect } from "next/navigation";

export default function LegacyPatientDashboardRedirect() {
  redirect("/patient/dashboard");
}
