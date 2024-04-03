import Image from "next/image";
import Dashboard from "@/components/Dashboard"

export default async function Home() {

  return (
    <main className="dashboard-wrapper">
      <Dashboard />
    </main>
  );
}
