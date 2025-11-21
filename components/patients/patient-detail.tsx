"use client"

import { useState } from "react"
import {
  ArrowLeft,
  QrCode,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Pill,
  FileText,
  Calendar,
  Hospital,
  FileBarChart,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Patient, LabResult } from "@/types"
import { getDepartmentName, getDepartmentColor } from "@/config/departments"

interface PatientDetailProps {
  patient: Patient
  onBack: () => void
}

export function PatientDetail({ patient, onBack }: PatientDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()

  // Trier l'historique médical par date (le plus récent d'abord)
  const sortedMedicalHistory = [...(patient.medicalHistory || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  // Regrouper l'historique par type
  const consultations = sortedMedicalHistory.filter(
    (record) => record.type === "consultation" || record.type === "follow-up",
  )

  const hospitalizations = sortedMedicalHistory.filter((record) => record.type === "hospitalization")

  const labTests = patient.labResults || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderElectrophoresisResults = (labResult: LabResult) => {
    const electrophoresisValues = labResult.results.filter((r) =>
      ["Albumine", "Alpha-1", "Alpha-2", "Beta", "Gamma"].includes(r.name),
    )

    if (electrophoresisValues.length === 0) return null

    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Résultats d'électrophorèse</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protéine</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead>Plage normale</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {electrophoresisValues.map((value, idx) => (
              <TableRow key={idx}>
                <TableCell>{value.name}</TableCell>
                <TableCell>{value.value}</TableCell>
                <TableCell>{value.unit || "g/L"}</TableCell>
                <TableCell>{value.normalRange || "-"}</TableCell>
                <TableCell>
                  {value.isAbnormal ? (
                    <Badge variant="destructive">Anormal</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Normal
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">
          Dossier Patient - {patient.firstName} {patient.lastName}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-medical rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>
            <CardTitle className="text-xl">
              {patient.firstName} {patient.lastName}
            </CardTitle>
            <div className="flex justify-center gap-2">
              <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                {patient.status === "active" ? "Actif" : "Inactif"}
              </Badge>
              {patient.isHospitalized && (
                <Badge className="bg-red-100 text-red-800">
                  <Hospital className="w-3 h-3 mr-1" />
                  Hospitalisé
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-medical-blue" />
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">{patient.qrCode}</code>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>
                  {age} ans ({new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{patient.address}</span>
              </div>
            </div>

            {patient.isHospitalized && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-800 font-medium">
                  <Hospital className="w-4 h-4" />
                  Hospitalisation
                </div>
                <div className="text-sm text-red-700 mt-1">
                  Chambre: {patient.hospitalRoom}
                  <br />
                  Depuis: {formatDate(patient.admissionDate || "")}
                </div>
              </div>
            )}

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-orange-800 font-medium">
                <Phone className="w-4 h-4" />
                Contacts d'urgence
              </div>
              {patient.emergencyContacts
                ? patient.emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="text-sm text-orange-700 mt-2 pb-2 border-b border-orange-200 last:border-0"
                    >
                      {contact.name}
                      <br />
                      {contact.phone}
                      <br />
                      <span className="text-xs">({contact.relationship})</span>
                    </div>
                  ))
                : // Compatibilité avec l'ancien format
                  patient.emergencyContact && (
                    <div className="text-sm text-orange-700 mt-1">
                      {patient.emergencyContact.name}
                      <br />
                      {patient.emergencyContact.phone}
                      <br />
                      <span className="text-xs">({patient.emergencyContact.relationship})</span>
                    </div>
                  )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="lab-results">Analyses</TabsTrigger>
              <TabsTrigger value="prescriptions">Ordonnances</TabsTrigger>
              <TabsTrigger value="hospitalization">Hospitalisation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Allergies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune allergie connue</p>
                  )}
                </CardContent>
              </Card>

              {/* Chronic Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-medical-blue" />
                    Conditions Chroniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.chronicConditions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.chronicConditions.map((condition, index) => (
                        <Badge key={index} variant="outline">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucune condition chronique</p>
                  )}
                </CardContent>
              </Card>

              {/* Current Medications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-medical-green" />
                    Médicaments Actuels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.currentMedications.length > 0 ? (
                    <div className="space-y-2">
                      {patient.currentMedications.map((medication, index) => (
                        <div key={index} className="p-2 bg-green-50 rounded border border-green-200">
                          {medication}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun médicament actuel</p>
                  )}
                </CardContent>
              </Card>

              {/* Résumé des activités récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-medical-blue" />
                    Activités Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sortedMedicalHistory.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{record.diagnosis || "Consultation"}</p>
                          <p className="text-sm text-gray-500">
                            {record.type === "consultation"
                              ? "Consultation"
                              : record.type === "hospitalization"
                                ? "Hospitalisation"
                                : record.type === "follow-up"
                                  ? "Suivi"
                                  : record.type === "emergency"
                                    ? "Urgence"
                                    : "Autre"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Dr. {record.doctorName}</p>
                          <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                        </div>
                      </div>
                    ))}
                    {sortedMedicalHistory.length === 0 && <p className="text-gray-500">Aucune activité récente</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consultations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Historique des Consultations</span>
                    <Badge>{consultations.length} consultations</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {consultations.map((record, index) => (
                      <AccordionItem key={record.id} value={record.id}>
                        <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg">
                          <div className="flex flex-1 items-center justify-between pr-4">
                            <div className="flex items-center gap-2">
                              <Badge
                                style={{
                                  backgroundColor: getDepartmentColor(record.department),
                                  color: "white",
                                }}
                                className="mr-2"
                              >
                                {getDepartmentName(record.department)}
                              </Badge>
                              <span className="font-medium">{record.diagnosis}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(record.date)} - Dr. {record.doctorName}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Symptômes</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {record.symptoms.map((symptom, idx) => (
                                    <Badge key={idx} variant="outline">
                                      {symptom}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Traitement</h4>
                                <p className="mt-1">{record.treatment}</p>
                              </div>
                            </div>

                            {record.vitalSigns && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Constantes vitales</h4>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                  {record.vitalSigns.temperature && (
                                    <div className="p-2 bg-blue-50 rounded">
                                      <span className="font-medium">Température:</span> {record.vitalSigns.temperature}
                                      °C
                                    </div>
                                  )}
                                  {record.vitalSigns.bloodPressure && (
                                    <div className="p-2 bg-blue-50 rounded">
                                      <span className="font-medium">Tension:</span> {record.vitalSigns.bloodPressure}
                                    </div>
                                  )}
                                  {record.vitalSigns.heartRate && (
                                    <div className="p-2 bg-blue-50 rounded">
                                      <span className="font-medium">Pouls:</span> {record.vitalSigns.heartRate} bpm
                                    </div>
                                  )}
                                  {record.vitalSigns.oxygenSaturation && (
                                    <div className="p-2 bg-blue-50 rounded">
                                      <span className="font-medium">SpO2:</span> {record.vitalSigns.oxygenSaturation}%
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {record.prescription && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Médicaments prescrits</h4>
                                <div className="space-y-2">
                                  {record.prescription.medications.map((med, idx) => (
                                    <div key={idx} className="p-2 bg-green-50 rounded border border-green-200">
                                      <div className="font-medium">
                                        {med.name} - {med.dosage}
                                      </div>
                                      <div className="text-sm">
                                        {med.frequency} - Durée: {med.duration}
                                      </div>
                                      {med.instructions && (
                                        <div className="text-sm text-gray-600 mt-1">{med.instructions}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {record.notes && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                                <p className="mt-1 text-sm">{record.notes}</p>
                              </div>
                            )}

                            {record.followUpDate && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>
                                  Prochain rendez-vous: {new Date(record.followUpDate).toLocaleDateString("fr-FR")}
                                </span>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {consultations.length === 0 && <p className="text-gray-500 p-4">Aucune consultation enregistrée</p>}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lab-results" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileBarChart className="w-5 h-5 text-medical-blue" />
                    Résultats d'Analyses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {labTests.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {labTests.map((labResult) => (
                        <AccordionItem key={labResult.id} value={labResult.id}>
                          <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg">
                            <div className="flex flex-1 items-center justify-between pr-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`${
                                    labResult.type === "electrophoresis"
                                      ? "bg-purple-100 text-purple-800"
                                      : labResult.type === "blood_test"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {labResult.type === "electrophoresis"
                                    ? "Électrophorèse"
                                    : labResult.type === "blood_test"
                                      ? "Analyse sanguine"
                                      : labResult.type === "urine_test"
                                        ? "Analyse urinaire"
                                        : labResult.type === "imaging"
                                          ? "Imagerie"
                                          : "Autre"}
                                </Badge>
                                <span className="font-medium">{labResult.name}</span>
                              </div>
                              <div className="text-sm text-gray-500">{formatDate(labResult.date)}</div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm text-gray-500">Demandé par: {labResult.requestedBy}</p>
                                  {labResult.reviewedBy && (
                                    <p className="text-sm text-gray-500">Vérifié par: {labResult.reviewedBy}</p>
                                  )}
                                </div>
                                <Badge
                                  className={`${
                                    labResult.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : labResult.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {labResult.status === "completed"
                                    ? "Complété"
                                    : labResult.status === "pending"
                                      ? "En attente"
                                      : "Vérifié"}
                                </Badge>
                              </div>

                              {labResult.type === "electrophoresis" && renderElectrophoresisResults(labResult)}

                              {labResult.type !== "electrophoresis" && labResult.results.length > 0 && (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Test</TableHead>
                                      <TableHead>Résultat</TableHead>
                                      <TableHead>Unité</TableHead>
                                      <TableHead>Plage normale</TableHead>
                                      <TableHead>Statut</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {labResult.results.map((result, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell>{result.name}</TableCell>
                                        <TableCell>{result.value}</TableCell>
                                        <TableCell>{result.unit || "-"}</TableCell>
                                        <TableCell>{result.normalRange || "-"}</TableCell>
                                        <TableCell>
                                          {result.isAbnormal ? (
                                            <Badge variant="destructive">Anormal</Badge>
                                          ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                              Normal
                                            </Badge>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}

                              {labResult.notes && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                                  <p className="mt-1 text-sm">{labResult.notes}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <FileBarChart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Aucun résultat d'analyse disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Ordonnances</CardTitle>
                </CardHeader>
                <CardContent>
                  {sortedMedicalHistory.filter((record) => record.prescription).length > 0 ? (
                    <div className="space-y-4">
                      {sortedMedicalHistory
                        .filter((record) => record.prescription)
                        .map((record) => (
                          <div key={record.id} className="border rounded-lg overflow-hidden">
                            <div className="flex justify-between items-center p-4 bg-gray-50">
                              <div>
                                <p className="font-medium">Dr. {record.doctorName}</p>
                                <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
                              </div>
                              <Badge>{getDepartmentName(record.department)}</Badge>
                            </div>
                            <div className="p-4 space-y-3">
                              {record.prescription?.medications.map((med, idx) => (
                                <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="font-medium">
                                    {med.name} - {med.dosage}
                                  </p>
                                  <p className="text-sm">
                                    {med.frequency} - Durée: {med.duration}
                                  </p>
                                  {med.instructions && <p className="text-sm text-gray-600 mt-1">{med.instructions}</p>}
                                </div>
                              ))}
                              {record.prescription?.instructions && (
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="font-medium">Instructions</p>
                                  <p className="text-sm">{record.prescription.instructions}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Aucune ordonnance enregistrée</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hospitalization">
              <Card>
                <CardHeader>
                  <CardTitle>Historique d'Hospitalisation</CardTitle>
                </CardHeader>
                <CardContent>
                  {hospitalizations.length > 0 ? (
                    <div className="space-y-4">
                      {hospitalizations.map((record) => (
                        <div key={record.id} className="border-l-4 border-red-500 pl-4 py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{record.diagnosis}</h4>
                              <p className="text-sm text-gray-600">Dr. {record.doctorName}</p>
                              <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
                            </div>
                            <Badge className="bg-red-100 text-red-800">Hospitalisation</Badge>
                          </div>
                          <p className="text-sm mt-2">{record.notes}</p>

                          {patient.isHospitalized && record === hospitalizations[0] && (
                            <div className="mt-4 p-3 bg-red-50 rounded-lg">
                              <div className="flex items-center gap-2 text-red-800 font-medium">
                                <Hospital className="w-4 h-4" />
                                <span>Hospitalisation en cours</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                  <p className="text-sm text-red-700">Chambre: {patient.hospitalRoom}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-red-700">
                                    Depuis: {formatDate(patient.admissionDate || "")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Hospital className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Le patient n'a pas d'historique d'hospitalisation</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
