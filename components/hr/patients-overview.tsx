"use client"

import { useState } from "react"
import { Search, Filter, FileText, Calendar, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PatientDetail } from "@/components/patients/patient-detail"
import type { Patient } from "@/types"

interface PatientsOverviewProps {
  patients: Patient[]
  onViewPatient?: (patient: Patient) => void
}

export function PatientsOverview({ patients, onViewPatient }: PatientsOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "lastName",
    direction: "ascending",
  })

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    if (onViewPatient) {
      onViewPatient(patient)
    }
  }

  const handleBackToList = () => {
    setSelectedPatient(null)
  }

  // Filtrer les patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)

    const matchesDepartment = departmentFilter === "all" || patient.department === departmentFilter
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Trier les patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortConfig.key === "lastName") {
      return sortConfig.direction === "ascending"
        ? a.lastName.localeCompare(b.lastName)
        : b.lastName.localeCompare(a.lastName)
    }
    if (sortConfig.key === "department") {
      return sortConfig.direction === "ascending"
        ? (a.department || "").localeCompare(b.department || "")
        : (b.department || "").localeCompare(a.department || "")
    }
    if (sortConfig.key === "status") {
      return sortConfig.direction === "ascending"
        ? (a.status || "").localeCompare(b.status || "")
        : (b.status || "").localeCompare(a.status || "")
    }
    return 0
  })

  // Statistiques
  const totalPatients = patients.length
  const hospitalizedCount = patients.filter((p) => p.isHospitalized).length
  const waitingConsultationCount = patients.filter((p) => p.status === "waiting_consultation").length
  const inConsultationCount = patients.filter((p) => p.status === "in_consultation").length

  // Traduire les départements
  const getDepartmentName = (dept: string) => {
    const deptNames: { [key: string]: string } = {
      cardiology: "Cardiologie",
      neurology: "Neurologie",
      pediatrics: "Pédiatrie",
      orthopedics: "Orthopédie",
      dermatology: "Dermatologie",
      emergency: "Urgences",
      maternity: "Maternité",
    }
    return deptNames[dept] || dept
  }

  // Traduire les statuts
  const getStatusName = (status: string) => {
    const statusNames: { [key: string]: string } = {
      waiting_payment: "En attente de paiement",
      waiting_consultation: "En attente de consultation",
      in_consultation: "En consultation",
      hospitalized: "Hospitalisé",
      completed: "Terminé",
    }
    return statusNames[status] || status
  }

  // Obtenir la couleur du badge de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting_payment":
        return "bg-amber-500"
      case "waiting_consultation":
        return "bg-blue-500"
      case "in_consultation":
        return "bg-green-500"
      case "hospitalized":
        return "bg-red-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  if (selectedPatient) {
    return <PatientDetail patient={selectedPatient} onBack={handleBackToList} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dossiers Patients</h2>
        <Badge className="bg-gradient-medical text-white">Accès RH</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <FileText className="h-4 w-4 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">Patients enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitalisés</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalizedCount}</div>
            <p className="text-xs text-muted-foreground">Patients hospitalisés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingConsultationCount}</div>
            <p className="text-xs text-muted-foreground">En attente de consultation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En consultation</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inConsultationCount}</div>
            <p className="text-xs text-muted-foreground">Consultations en cours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, QR code, téléphone..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-48">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    <SelectItem value="cardiology">Cardiologie</SelectItem>
                    <SelectItem value="neurology">Neurologie</SelectItem>
                    <SelectItem value="pediatrics">Pédiatrie</SelectItem>
                    <SelectItem value="orthopedics">Orthopédie</SelectItem>
                    <SelectItem value="dermatology">Dermatologie</SelectItem>
                    <SelectItem value="emergency">Urgences</SelectItem>
                    <SelectItem value="maternity">Maternité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="waiting_payment">En attente de paiement</SelectItem>
                    <SelectItem value="waiting_consultation">En attente de consultation</SelectItem>
                    <SelectItem value="in_consultation">En consultation</SelectItem>
                    <SelectItem value="hospitalized">Hospitalisé</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] cursor-pointer" onClick={() => handleSort("lastName")}>
                    Nom
                    {sortConfig.key === "lastName" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="inline w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("department")}>
                    Département
                    {sortConfig.key === "department" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="inline w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    Statut
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="inline w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="inline w-4 h-4 ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Aucun patient ne correspond à votre recherche
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.lastName} {patient.firstName}
                        <div className="text-xs text-gray-500">
                          {patient.qrCode} • {new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.phone}
                        <div className="text-xs text-gray-500">{patient.email}</div>
                      </TableCell>
                      <TableCell>
                        {patient.department && (
                          <Badge variant="outline" className="bg-gray-100">
                            {getDepartmentName(patient.department)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>{getStatusName(patient.status)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient)}>
                          Voir dossier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
