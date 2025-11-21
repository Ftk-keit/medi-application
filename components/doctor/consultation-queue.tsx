"use client"
import { Clock, User, CheckCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Patient } from "@/types"

interface ConsultationQueueProps {
  waitingPatients: Patient[]
  department: string
  onStartConsultation: (patientId: string) => void
  onViewPatient: (patient: Patient) => void
}

export function ConsultationQueue({
  waitingPatients,
  department,
  onStartConsultation,
  onViewPatient,
}: ConsultationQueueProps) {
  const departmentPatients = waitingPatients.filter(
    (p) => p.department === department && p.status === "waiting_consultation",
  )

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "emergency":
        return <Badge className="bg-red-100 text-red-800">Urgence</Badge>
      case "urgent":
        return <Badge className="bg-orange-100 text-orange-800">Urgent</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getWaitingTime = (registrationDate: string) => {
    const now = new Date()
    const registration = new Date(registrationDate)
    const diffMinutes = Math.floor((now.getTime() - registration.getTime()) / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes} min`
    } else {
      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60
      return `${hours}h ${minutes}min`
    }
  }

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
        <h2 className="text-2xl font-bold text-gray-900">File d'attente - {getDepartmentName(department)}</h2>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-medical-blue" />
          <Badge className="bg-gradient-medical text-white">{departmentPatients.length} patients en attente</Badge>
        </div>
      </div>

      {departmentPatients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun patient en attente</h3>
            <p className="text-gray-600">Tous les patients ont été consultés.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-medical-blue" />
              Patients en attente de consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Âge</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Temps d'attente</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentPatients
                  .sort((a, b) => {
                    // Trier par priorité puis par heure d'arrivée
                    const priorityOrder = { emergency: 0, urgent: 1, normal: 2 }
                    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder]
                    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder]

                    if (aPriority !== bPriority) {
                      return aPriority - bPriority
                    }

                    return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
                  })
                  .map((patient, index) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 bg-medical-blue text-white rounded-full font-bold">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{patient.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} ans
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {patient.consultationType === "first-visit"
                            ? "Première visite"
                            : patient.consultationType === "follow-up"
                              ? "Suivi"
                              : patient.consultationType === "emergency"
                                ? "Urgence"
                                : patient.consultationType === "control"
                                  ? "Contrôle"
                                  : patient.consultationType}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPriorityBadge(patient.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{getWaitingTime(patient.registrationDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => onViewPatient(patient)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => onStartConsultation(patient.id)}
                            className="bg-gradient-medical hover:opacity-90"
                            size="sm"
                          >
                            Consulter
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
