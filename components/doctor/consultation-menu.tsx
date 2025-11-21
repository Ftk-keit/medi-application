"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Hospital, FileText, Activity, Calendar, Stethoscope, UserCheck } from "lucide-react"
import { ConsultationQueue } from "./consultation-queue"
import { HospitalizedPatients } from "./hospitalized-patients"
import type { Patient, User } from "@/types"

interface ConsultationMenuProps {
  waitingPatients: Patient[]
  hospitalizedPatients: Patient[]
  allPatients: Patient[]
  currentUser: User
  onStartConsultation: (patientId: string) => void
  onViewPatient: (patient: Patient) => void
}

export function ConsultationMenu({
  waitingPatients,
  hospitalizedPatients,
  allPatients,
  currentUser,
  onStartConsultation,
  onViewPatient,
}: ConsultationMenuProps) {
  const [activeTab, setActiveTab] = useState("queue")

  // Filtrer les patients par département du médecin
  const departmentWaitingPatients = waitingPatients.filter((p) => p.department === currentUser.department)
  const departmentHospitalizedPatients = hospitalizedPatients.filter((p) => p.department === currentUser.department)

  // Patients en consultation actuellement
  const inConsultationPatients = allPatients.filter(
    (p) => p.status === "in_consultation" && p.department === currentUser.department,
  )

  // Consultations terminées aujourd'hui
  const today = new Date().toISOString().split("T")[0]
  const todayConsultations = allPatients.filter((p) =>
    p.medicalHistory?.some((record) => record.date.startsWith(today) && record.doctorId === currentUser.id),
  )

  // Mes patients (patients suivis régulièrement)
  const myPatients = allPatients.filter(
    (p) => p.medicalHistory?.some((record) => record.doctorId === currentUser.id) && !p.isHospitalized,
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting_consultation: { label: "En attente", variant: "secondary" as const },
      in_consultation: { label: "En consultation", variant: "default" as const },
      waiting_payment: { label: "Attente paiement", variant: "outline" as const },
      completed: { label: "Terminé", variant: "secondary" as const },
      hospitalized: { label: "Hospitalisé", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: { label: "Urgent", variant: "destructive" as const },
      high: { label: "Élevée", variant: "default" as const },
      normal: { label: "Normal", variant: "secondary" as const },
      low: { label: "Faible", variant: "outline" as const },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || {
      label: priority,
      variant: "outline" as const,
    }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centre de Consultation</h1>
          <p className="text-gray-600">
            Département: <span className="font-semibold capitalize">{currentUser.department}</span> - Dr.{" "}
            {currentUser.firstName} {currentUser.lastName}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{departmentWaitingPatients.length}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{inConsultationPatients.length}</div>
                <div className="text-sm text-gray-600">En consultation</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Hospital className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-600">{departmentHospitalizedPatients.length}</div>
                <div className="text-sm text-gray-600">Hospitalisés</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{todayConsultations.length}</div>
                <div className="text-sm text-gray-600">Aujourd'hui</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            File d'attente
          </TabsTrigger>
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            En cours
          </TabsTrigger>
          <TabsTrigger value="hospitalized" className="flex items-center gap-2">
            <Hospital className="w-4 h-4" />
            Hospitalisés
          </TabsTrigger>
          <TabsTrigger value="my-patients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Mes patients
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                File d'attente - {currentUser.department}
              </CardTitle>
              <CardDescription>Patients en attente de consultation dans votre département</CardDescription>
            </CardHeader>
            <CardContent>
              <ConsultationQueue
                waitingPatients={departmentWaitingPatients}
                department={currentUser.department || ""}
                onStartConsultation={onStartConsultation}
                onViewPatient={onViewPatient}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Consultations en cours
              </CardTitle>
              <CardDescription>Patients actuellement en consultation</CardDescription>
            </CardHeader>
            <CardContent>
              {inConsultationPatients.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune consultation en cours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inConsultationPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {patient.consultationType} - {patient.qrCode}
                          </p>
                          <div className="flex gap-2 mt-1">
                            {getStatusBadge(patient.status)}
                            {getPriorityBadge(patient.priority)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onViewPatient(patient)}>
                          Voir dossier
                        </Button>
                        <Button onClick={() => onStartConsultation(patient.id)}>Continuer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hospitalized" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hospital className="w-5 h-5" />
                Patients hospitalisés
              </CardTitle>
              <CardDescription>Patients hospitalisés dans votre département</CardDescription>
            </CardHeader>
            <CardContent>
              <HospitalizedPatients patients={departmentHospitalizedPatients} onViewPatient={onViewPatient} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Mes patients
              </CardTitle>
              <CardDescription>Patients que vous suivez régulièrement</CardDescription>
            </CardHeader>
            <CardContent>
              {myPatients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun patient suivi actuellement</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myPatients.map((patient) => (
                    <div key={patient.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        {getStatusBadge(patient.status)}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>📞 {patient.phone}</p>
                        <p>🎂 {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                        <p>📋 {patient.chronicConditions.length} conditions chroniques</p>
                        <p>💊 {patient.currentMedications.length} médicaments</p>
                        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                          <p>
                            🏥 Dernière consultation:{" "}
                            {new Date(
                              patient.medicalHistory[patient.medicalHistory.length - 1].date,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" className="w-full mt-3" onClick={() => onViewPatient(patient)}>
                        Voir dossier complet
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Historique des consultations
              </CardTitle>
              <CardDescription>Consultations terminées aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              {todayConsultations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune consultation terminée aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayConsultations.map((patient) => {
                    const todayRecords =
                      patient.medicalHistory?.filter(
                        (record) => record.date.startsWith(today) && record.doctorId === currentUser.id,
                      ) || []

                    return todayRecords.map((record) => (
                      <div key={`${patient.id}-${record.id}`} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <span className="text-sm text-gray-500">{new Date(record.date).toLocaleTimeString()}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Diagnostic:</strong> {record.diagnosis}
                          </p>
                          <p>
                            <strong>Type:</strong> {record.type}
                          </p>
                          <p>
                            <strong>Département:</strong> {record.department}
                          </p>
                          {record.notes && (
                            <p>
                              <strong>Notes:</strong> {record.notes}
                            </p>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => onViewPatient(patient)}>
                          Voir dossier complet
                        </Button>
                      </div>
                    ))
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
