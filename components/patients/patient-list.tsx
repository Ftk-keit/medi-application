"use client"

import { useState } from "react"
import { Search, Plus, QrCode, Eye, Edit, Hospital } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Patient } from "@/types"

interface PatientListProps {
  patients: Patient[]
  onPatientSelect: (patient: Patient) => void
  onAddPatient: () => void
}

export function PatientList({ patients, onPatientSelect, onAddPatient }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hospitalized">("all")

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.qrCode.includes(searchTerm)

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && patient.status === "active") ||
      (filterStatus === "hospitalized" && patient.isHospitalized)

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (patient: Patient) => {
    if (patient.isHospitalized) {
      return <Badge className="bg-red-100 text-red-800">Hospitalisé</Badge>
    }
    if (patient.status === "active") {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>
    }
    return <Badge variant="secondary">Inactif</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Patients</h2>
        <Button onClick={onAddPatient} className="bg-gradient-medical hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom ou code QR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                Tous
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
              >
                Actifs
              </Button>
              <Button
                variant={filterStatus === "hospitalized" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("hospitalized")}
              >
                Hospitalisés
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code QR</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Chambre</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-medical-blue" />
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{patient.qrCode}</code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} ans</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{getStatusBadge(patient)}</TableCell>
                  <TableCell>
                    {patient.isHospitalized ? (
                      <div className="flex items-center gap-1">
                        <Hospital className="w-4 h-4 text-red-500" />
                        <span>{patient.hospitalRoom}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onPatientSelect(patient)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
