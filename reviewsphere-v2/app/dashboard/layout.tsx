import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}