import { PowerBiEmbed } from "@/components/power-bi-embed"

// URL do relatório Power BI no formato view?r=... (link de compartilhamento do dashboard).
// Segurança: manter origem confiável; não construir a partir de input do usuário. Ver README.md da pasta.
const POWER_BI_DASHBOARD_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiYmU1Y2JkYWMtM2EyNC00NjA4LTk5M2EtOWEyOTQyYTIwNzJhIiwidCI6IjQ3NmJhYzFmLTM2YjItNGFkOS04Njk5LWNkYTZiYWQxZjg2MiIsImMiOjF9&pageName=ReportSection26f94f5792e9bf5b8f33"

export default function DashboardWriBrasilPage() {
  return (
    <div className="min-h-screen bg-[#eaedf5]">
      <div className="px-4 2xl:px-16 py-8">
        {/* <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
          Dashboard - WRI Brasil
        </h1>
        <p className="text-gray-600 mb-2">
          Parceria ONMS &amp; WRI Brasil — Dashboard dos dados do QualiÔnibus.
        </p> */}
        <PowerBiEmbed
          embedUrl={POWER_BI_DASHBOARD_URL}
          title="Dashboard QualiÔnibus - WRI Brasil"
          className="w-full"
        />
      </div>
    </div>
  )
}
