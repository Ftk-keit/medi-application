"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Hospital, CreditCard, TrendingUp, AlertTriangle } from "lucide-react"

interface DashboardProps {
  userRole: string
}

export function Dashboard({ userRole }: DashboardProps) {
  const stats = {
    totalPatients: 1247,
    todayAppointments: 23,
    hospitalizedPatients: 45,
    pendingPayments: 12,
    emergencyCases: 3,
    revenue: 45670,
  }

  const recentActivities = [
    { id: 1, type: "admission", patient: "Aïssatou Sow", time: "14:30", status: "urgent" },
    { id: 2, type: "discharge", patient: "Amadou Ndiaye", time: "13:15", status: "completed" },
    { id: 3, type: "consultation", patient: "Fatou Ba", time: "12:45", status: "in-progress" },
    { id: 4, type: "emergency", patient: "Ousmane Diop", time: "11:20", status: "urgent" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord</h2>
        <Badge className="bg-gradient-medical text-white">
          {userRole === "admin"
            ? "Administrateur"
            : userRole === "doctor"
              ? "Médecin"
              : userRole === "nurse"
                ? "Infirmier"
                : "Réceptionniste"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RDV Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-medical-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">8 en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitalisés</CardTitle>
            <Hospital className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hospitalizedPatients}</div>
            <p className="text-xs text-muted-foreground">Capacité: 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgences</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.emergencyCases}</div>
            <p className="text-xs text-muted-foreground">Attention requise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements</CardTitle>
            <CreditCard className="h-4 w-4 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <TrendingUp className="h-4 w-4 text-medical-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenue.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.patient}</p>
                    <p className="text-sm text-gray-500 capitalize">{activity.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.time}</p>
                    <Badge
                      variant={
                        activity.status === "urgent"
                          ? "destructive"
                          : activity.status === "completed"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {activity.status === "urgent"
                        ? "Urgent"
                        : activity.status === "completed"
                          ? "Terminé"
                          : "En cours"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Patient en urgence</p>
                  <p className="text-sm text-red-600">Ousmane Diop - Salle 3</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-800">Médicament en rupture</p>
                  <p className="text-sm text-orange-600">Paracétamol 500mg</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Hospital className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Nouvelle admission</p>
                  <p className="text-sm text-blue-600">Aïssatou Sow - Chambre 205</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
