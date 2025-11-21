"use client"

import { useState } from "react"
import { CreditCard, Clock, CheckCircle, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Patient, Payment } from "@/types"

interface PaymentProcessingProps {
  waitingPayments: Patient[]
  onPaymentProcessed: (patientId: string, payment: Payment) => void
}

export function PaymentProcessing({ waitingPayments, onPaymentProcessed }: PaymentProcessingProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{ [key: string]: string }>({})

  const handlePayment = (patient: Patient, method: string) => {
    const payment: Payment = {
      id: Date.now().toString(),
      patientId: patient.id,
      amount: patient.paymentAmount || 0,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      type: "consultation",
      status: "paid",
      method: method as "cash" | "card" | "insurance",
      cashierId: "current-user",
      department: patient.department || "",
    }

    onPaymentProcessed(patient.id, payment)
  }

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
        <h2 className="text-2xl font-bold text-gray-900">Traitement des Paiements</h2>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-medical-blue" />
          <Badge className="bg-gradient-medical text-white">{waitingPayments.length} en attente</Badge>
        </div>
      </div>

      {waitingPayments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun paiement en attente</h3>
            <p className="text-gray-600">Tous les paiements ont été traités.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-medical-blue" />
              File d'attente des paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Heure d'arrivée</TableHead>
                  <TableHead>Mode de paiement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingPayments
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
                  .map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{patient.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getDepartmentName(patient.department || "")}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Euro className="w-4 h-4 text-medical-green" />
                          <span className="font-semibold">{patient.paymentAmount}€</span>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(patient.priority)}</TableCell>
                      <TableCell>
                        {new Date(patient.registrationDate).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={selectedPaymentMethod[patient.id] || ""}
                          onValueChange={(value) =>
                            setSelectedPaymentMethod({
                              ...selectedPaymentMethod,
                              [patient.id]: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Choisir" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Espèces</SelectItem>
                            <SelectItem value="card">Carte</SelectItem>
                            <SelectItem value="insurance">Assurance</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handlePayment(patient, selectedPaymentMethod[patient.id])}
                          disabled={!selectedPaymentMethod[patient.id]}
                          className="bg-gradient-medical hover:opacity-90"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Valider
                        </Button>
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
