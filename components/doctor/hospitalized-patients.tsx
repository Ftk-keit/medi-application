"use client"

import { useState } from "react"
import { Hospital, Calendar, Clock, FileText, Clipboard, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Patient } from "@/types"

interface HospitalizedPatientsProps {
  patients: Patient[]
  onViewPatient: (patient: Patient) => void
}

export function HospitalizedPatients({ patients, onViewPatient }: HospitalizedPatientsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [activeTab, setActiveTab] = useState("patients")
  const [dailyNote, setDailyNote] = useState("")

  const hospitalizedPatients = patients.filter(
    (p) =>
      p.isHospitalized &&
      (p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.hospitalRoom?.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setActiveTab("patient-details")
  }

  const handleBackToList = () => {
    setSelectedPatient(null)
    setActiveTab("patients")
  }

  const getDaysHospitalized = (admissionDate?: string) => {
    if (!admissionDate) return "N/A"

    const admission = new Date(admissionDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - admission.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays === 1 ? "1 jour" : `${diffDays} jours`
  }

  const renderPatientList = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher par nom ou chambre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge className="bg-gradient-medical text-white">{hospitalizedPatients.length} patients hospitalisés</Badge>
      </div>

      {hospitalizedPatients.length === 0 ? (
        <div className="text-center py-12">
          <Hospital className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun patient hospitalisé</h3>
          <p className="text-gray-500">Il n'y a actuellement aucun patient hospitalisé.</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="w-5 h-5 text-medical-blue" />
              Patients hospitalisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Date d'admission</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Diagnostic</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitalizedPatients.map((patient) => {
                  const lastRecord = patient.medicalHistory?.[patient.medicalHistory.length - 1]

                  return (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} ans
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.hospitalRoom}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(patient.admissionDate || "").toLocaleDateString("fr-FR")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{getDaysHospitalized(patient.admissionDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{lastRecord?.diagnosis || "Non spécifié"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handlePatientSelect(patient)}>
                            Suivi
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onViewPatient(patient)}>
                            Dossier
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderPatientDetails = () => {
    if (!selectedPatient) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToList}>
            Retour à la liste
          </Button>
          <h3 className="text-xl font-bold">
            Suivi d'hospitalisation - {selectedPatient.firstName} {selectedPatient.lastName}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Chambre</p>
                <p className="font-medium">{selectedPatient.hospitalRoom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date d'admission</p>
                <p className="font-medium">
                  {new Date(selectedPatient.admissionDate || "").toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Durée d'hospitalisation</p>
                <p className="font-medium">{getDaysHospitalized(selectedPatient.admissionDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Diagnostic</p>
                <p className="font-medium">
                  {selectedPatient.medicalHistory?.[selectedPatient.medicalHistory.length - 1]?.diagnosis ||
                    "Non spécifié"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Suivi quotidien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dailyNote">Note du jour</Label>
                  <Textarea
                    id="dailyNote"
                    value={dailyNote}
                    onChange={(e) => setDailyNote(e.target.value)}
                    placeholder="Entrez vos observations pour aujourd'hui..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-gradient-medical hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une note
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Historique des notes</h4>

                <div className="space-y-4">
                  {/* Notes de démonstration */}
                  <div className="border-l-4 border-medical-blue pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">Dr. Mamadou Sarr</p>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                    <p className="text-sm mt-2">
                      Patient stable. Signes vitaux normaux. Poursuite du traitement antibiotique.
                    </p>
                  </div>

                  <div className="border-l-4 border-medical-blue pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">Dr. Aïssatou Diallo</p>
                        <p className="text-sm text-gray-500">
                          {new Date(Date.now() - 86400000).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mt-2">
                      Légère amélioration. Fièvre en baisse. Patient se plaint encore de douleurs thoraciques.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Constantes vitales</span>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Température</TableHead>
                  <TableHead>Pression artérielle</TableHead>
                  <TableHead>Fréquence cardiaque</TableHead>
                  <TableHead>Saturation O2</TableHead>
                  <TableHead>Remarques</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{new Date().toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>08:30</TableCell>
                  <TableCell>37.2°C</TableCell>
                  <TableCell>120/80 mmHg</TableCell>
                  <TableCell>72 bpm</TableCell>
                  <TableCell>98%</TableCell>
                  <TableCell>Normal</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{new Date(Date.now() - 86400000).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>18:00</TableCell>
                  <TableCell>37.8°C</TableCell>
                  <TableCell>130/85 mmHg</TableCell>
                  <TableCell>78 bpm</TableCell>
                  <TableCell>97%</TableCell>
                  <TableCell>Légère fièvre</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">
            <Clipboard className="w-4 h-4 mr-2" />
            Rapport complet
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Ordonnance
          </Button>
          <Button className="bg-gradient-medical hover:opacity-90">Planifier sortie</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Patients Hospitalisés</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patients">Liste des patients</TabsTrigger>
          <TabsTrigger value="patient-details" disabled={!selectedPatient}>
            Suivi du patient
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">{renderPatientList()}</TabsContent>

        <TabsContent value="patient-details">{renderPatientDetails()}</TabsContent>
      </Tabs>
    </div>
  )
}
