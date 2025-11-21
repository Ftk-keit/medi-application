"use client"

import { useState } from "react"
import { TrendingUp, Euro, CreditCard, Banknote, Shield, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Payment } from "@/types"

interface DailySummaryProps {
  payments: Payment[]
}

export function DailySummary({ payments }: DailySummaryProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const todayPayments = payments.filter((p) => p.date === selectedDate)

  const totalAmount = todayPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const cashAmount = todayPayments.filter((p) => p.method === "cash").reduce((sum, p) => sum + p.amount, 0)
  const cardAmount = todayPayments.filter((p) => p.method === "card").reduce((sum, p) => sum + p.amount, 0)
  const insuranceAmount = todayPayments.filter((p) => p.method === "insurance").reduce((sum, p) => sum + p.amount, 0)

  const departmentStats = todayPayments.reduce(
    (acc, payment) => {
      if (!acc[payment.department]) {
        acc[payment.department] = { count: 0, amount: 0 }
      }
      acc[payment.department].count++
      acc[payment.department].amount += payment.amount
      return acc
    },
    {} as { [key: string]: { count: number; amount: number } },
  )

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Résumé Journalier</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={new Date().toISOString().split("T")[0]}>Aujourd'hui</SelectItem>
              <SelectItem value={new Date(Date.now() - 86400000).toISOString().split("T")[0]}>Hier</SelectItem>
              <SelectItem value={new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0]}>
                Avant-hier
              </SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-gradient-medical text-white">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(selectedDate).toLocaleDateString("fr-FR")}
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Journalier</CardTitle>
            <Euro className="h-4 w-4 text-medical-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-green">{totalAmount.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">{todayPayments.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espèces</CardTitle>
            <Banknote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cashAmount.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">
              {todayPayments.filter((p) => p.method === "cash").length} paiements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carte Bancaire</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cardAmount.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">
              {todayPayments.filter((p) => p.method === "card").length} paiements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assurance</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insuranceAmount.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">
              {todayPayments.filter((p) => p.method === "insurance").length} paiements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-medical-blue" />
            Répartition par Département
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(departmentStats).map(([deptId, stats]) => (
              <div key={deptId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{getDepartmentName(deptId)}</h4>
                  <p className="text-sm text-gray-600">{stats.count} consultations</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-medical-green">{stats.amount.toLocaleString()}€</div>
                  <div className="text-sm text-gray-500">Moy: {Math.round(stats.amount / stats.count)}€</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayPayments
              .sort((a, b) => b.time.localeCompare(a.time))
              .slice(0, 10)
              .map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-medical rounded-full flex items-center justify-center">
                      {payment.method === "cash" ? (
                        <Banknote className="w-4 h-4 text-white" />
                      ) : payment.method === "card" ? (
                        <CreditCard className="w-4 h-4 text-white" />
                      ) : (
                        <Shield className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{getDepartmentName(payment.department)}</p>
                      <p className="text-sm text-gray-500">{payment.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{payment.amount}€</div>
                    <Badge variant="outline" className="text-xs">
                      {payment.method === "cash" ? "Espèces" : payment.method === "card" ? "Carte" : "Assurance"}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
