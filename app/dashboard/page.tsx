"use client"

import { useEffect, useState } from "react"
import { KpiCard } from "@/components/kpi-card"
import { PatientSearch } from "@/components/patient-search"
import { FacilityTabs } from "@/components/facility-tabs"
import { ErrorMessagesTable } from "@/components/error-messages-table"
import {
  fetchKpiData,
  fetchMessages,
  fetchPatientSummaries,
  type KpiData,
  type Message,
  type PatientSummary,
} from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PatientSummaryTable } from "@/components/patient-summary-table" // Yeni bileşeni import et

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KpiData | null>(null)
  const [errorMessages, setErrorMessages] = useState<Message[]>([]) // Sadece hata mesajlarını tut
  const [patientSummaries, setPatientSummaries] = useState<PatientSummary[]>([]) // Hasta özetlerini tut
  const [loadingKpi, setLoadingKpi] = useState(true)
  const [loadingErrorMessages, setLoadingErrorMessages] = useState(true)
  const [loadingPatientSummaries, setLoadingPatientSummaries] = useState(true)
  const [activeFacility, setActiveFacility] = useState("Facility A")

  useEffect(() => {
    const loadKpiAndErrorMessages = async () => {
      setLoadingKpi(true)
      setLoadingErrorMessages(true)
      try {
        const kpi = await fetchKpiData()
        setKpiData(kpi)
        const msgs = await fetchMessages({ status: "error" }) // Sadece hata mesajlarını çek
        setErrorMessages(msgs)
      } catch (error) {
        console.error("Failed to fetch KPI or error messages:", error)
      } finally {
        setLoadingKpi(false)
        setLoadingErrorMessages(false)
      }
    }
    loadKpiAndErrorMessages()
  }, [])

  useEffect(() => {
    const loadPatientSummariesForFacility = async () => {
      setLoadingPatientSummaries(true)
      try {
        const summaries = await fetchPatientSummaries(activeFacility)
        setPatientSummaries(summaries)
      } catch (error) {
        console.error(`Failed to fetch patient summaries for ${activeFacility}:`, error)
      } finally {
        setLoadingPatientSummaries(false)
      }
    }
    loadPatientSummariesForFacility()
  }, [activeFacility]) // Tesis değiştiğinde hasta özetlerini yeniden yükle

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* KPI Card Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingKpi ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="w-[200px] h-[120px] flex flex-col">
              <Skeleton className="h-full w-full" />
            </Card>
          ))
        ) : (
          <>
            <KpiCard title="Total Messages" value={kpiData?.totalMessages || 0} isAnimated />
            <KpiCard title="Error Messages" value={kpiData?.errorMessages || 0} />
            <KpiCard title="Critical Errors" value={kpiData?.criticalErrors || 0} isCritical />
            <KpiCard
              title="Success Rate"
              value={kpiData?.successRate || 0}
              unit="%"
              sparklineData={kpiData?.successRateSparkline}
            />
          </>
        )}
      </div>

      {/* Patient Search Bar */}
      <PatientSearch />

      {/* Facility Tabs and Patient Summary Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Hasta Özetleri</h2> {/* Başlığı güncelledik */}
          <FacilityTabs facilities={["Facility A", "Facility B", "Facility C"]} onSelectFacility={setActiveFacility} />
          <Card className="p-4 min-h-[400px]">
            {loadingPatientSummaries ? (
              <Skeleton className="h-[360px] w-full" />
            ) : (
              <PatientSummaryTable data={patientSummaries} /> // Yeni bileşeni kullandık
            )}
          </Card>
        </div>

        {/* Error Messages Table */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Hata Mesajları</h2>
          <Card className="p-4">
            {loadingErrorMessages ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <ErrorMessagesTable data={errorMessages} />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
