"use client"

import { useState } from "react"
import { TrendingUp, Users, Building2, Activity, Calendar, Euro } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Patient, Payment } from "@/types"

interface HospitalStatsProps {
  patients: Patient[]
  payments: Payment[]
}

export function HospitalStats({ patients, payments }: HospitalStatsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  const getFilteredData = () => {
    const now = new Date()
    let startDate: Date

    switch (selectedPeriod) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    const filteredPatients = patients.filter((p) => new Date(p.registrationDate) >= startDate)
    const filteredPayments = payments.filter((p) => new Date(p.date) >= startDate)

    return { filteredPatients, filteredPayments }
  }

  const { filteredPatients, filteredPayments } = getFilteredData()

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPatients = filteredPatients.length
  const hospitalizedPatients = filteredPatients.filter((p) => p.isHospitalized).length
  const completedConsultations = filteredPatients.filter((p) => p.status === "completed").length

  const departmentStats = filteredPatients.reduce(
    (acc, patient) => {
      if (patient.department) {
        if (!acc[patient.department]) {
          acc[patient.department] = { patients: 0, revenue: 0, consultations: 0 }
        }
        acc[patient.department].patients++
        if (patient.status === "completed") {
          acc[patient.department].consultations++
        }
      }
      return acc
    },
    {} as { [key: string]: { patients: number; revenue: number; consultations: number } },
  )

  // Ajouter les revenus par département
  filteredPayments.forEach((payment) => {
    if (departmentStats[payment.department]) {
      departmentStats[payment.department].revenue += payment.amount
    }
  })

  const getDepartmentName = (deptId: string) => {
    const departments: { [key: string]: string } = {
      cardiology: "Cardiologie",
      neurology: "Neurologie",
      pediatrics: "Pédiatrie",
      orthopedics: "Orthopédie",
      dermatology: "Dermatologie",
      emergency: "Urgences",
    }
    return departments[deptId] || deptId
  }

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "today":
        return "Aujourd'hui"
      case "week":
        return "Cette semaine"
      case "month":
        return "Ce mois"
      default:
        return "Aujourd'hui"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Statistiques Hôpital</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-gradient-medical text-white">
            <Calendar className="w-4 h-4 mr-1" />
            {getPeriodLabel()}
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">Nouveaux enregistrements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Activity className="h-4 w-4 text-medical-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedConsultations}</div>
            <p className="text-xs text-muted-foreground">Consultations terminées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitalisés</CardTitle>
            <Building2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalizedPatients}</div>
            <p className="text-xs text-muted-foreground">Patients hospitalisés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <Euro className="h-4 w-4 text-medical-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">Revenus générés</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-medical-blue" />
            Performance par Département
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(departmentStats)
              .sort(([, a], [, b]) => b.revenue - a.revenue)
              .map(([deptId, stats]) => (
                <div
                  key={deptId}
                  className="flex items-center justify-between p-4 bg-gradient-medical-light rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-lg">{getDepartmentName(deptId)}</h4>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span>{stats.patients} patients</span>
                      <span>{stats.consultations} consultations</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-medical-green">{stats.revenue.toLocaleString()}€</div>
                    <div className="text-sm text-gray-500">
                      {stats.consultations > 0
                        ? `Moy: ${Math.round(stats.revenue / stats.consultations)}€`
                        : "Aucune consultation"}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Flux de Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">En attente de paiement</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {patients.filter((p) => p.status === "waiting_payment").length}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium">En attente de consultation</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {patients.filter((p) => p.status === "waiting_consultation").length}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">En consultation</span>
                <Badge className="bg-green-100 text-green-800">
                  {patients.filter((p) => p.status === "in_consultation").length}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Consultations terminées</span>
                <Badge variant="outline">{patients.filter((p) => p.status === "completed").length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Méthodes de Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["cash", "card", "insurance"].map((method) => {
                const methodPayments = filteredPayments.filter((p) => p.method === method)
                const amount = methodPayments.reduce((sum, p) => sum + p.amount, 0)
                const count = methodPayments.length
                const percentage = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0

                return (
                  <div key={method} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">
                        {method === "cash" ? "Espèces" : method === "card" ? "Carte bancaire" : "Assurance"}
                      </span>
                      <div className="text-sm text-gray-600">{count} transactions</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{amount.toLocaleString()}€</div>
                      <div className="text-sm text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
