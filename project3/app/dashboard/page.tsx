import DashboardClient from "./DashboardClient";

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { role?: string };
}) {
  const role = searchParams?.role || "student";

  return <DashboardClient role={role} />;
}
