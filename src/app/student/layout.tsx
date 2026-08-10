import Sidebar from "@/components/student/Sidebar";
import Topbar from "@/components/student/Topbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAF5] dark:bg-black transition-colors duration-500">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
        <Topbar />

        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            bg-[#F8FAF5]
            dark:bg-black
            p-8
            transition-colors
            duration-500
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}