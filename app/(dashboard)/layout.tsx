import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-(--bg-base)">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-14">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}