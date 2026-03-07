import { PowerBiEmbed } from "@/components/power-bi-embed"
import { UserBar } from "@/components/user-bar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

// URL do relatório Power BI (variável privada, só disponível no servidor). Ver README.md da pasta.
const POWER_BI_DASHBOARD_URL = process.env.POWER_BI_DASHBOARD_URL

export default async function DashboardWriBrasilPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  if (!POWER_BI_DASHBOARD_URL) {
    throw new Error("POWER_BI_DASHBOARD_URL não está definida em .env.local")
  }

  return (
    <div className="min-h-screen bg-[#eaedf5]">
      <div className="px-4 2xl:px-16 pt-6">
        <UserBar />
        <PowerBiEmbed
          embedUrl={POWER_BI_DASHBOARD_URL}
          title="Dashboard QualiÔnibus - WRI Brasil"
          className="w-full"
        />
      </div>
    </div>
  )
}
