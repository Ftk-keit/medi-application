"use client"

import type React from "react"

import { useState } from "react"
import { Save, Printer, Plus, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Patient, MedicalRecord, Medication } from "@/types"

interface ConsultationFormProps {
  patient: Patient
  onBack: () => void
  onConsultationComplete: (patient: Patient, record: MedicalRecord) => void
}

export function ConsultationForm({ patient, onBack, onConsultationComplete }: ConsultationFormProps) {
  const [activeTab, setActiveTab] = useState("consultation")
  const [consultationData, setConsultationData] = useState({
    symptoms: "",
    diagnosis: "",
    notes: "",
    treatment: "",
    followUpDate: "",
    hospitalize: false,
    hospitalRoom: "",
  })

  const [medications, setMedications] = useState<Medication[]>([])
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  })

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setMedications([...medications, { ...newMedication }])
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      })
    }
  }

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      patientId: patient.id,
      doctorId: "current-doctor", // Normalement, ce serait l'ID du médecin connecté
      doctorName: "Dr. Mamadou Sarr", // Remplacer le nom du médecin français par un sénégalais
      date: new Date().toISOString(),
      type: "consultation",
      diagnosis: consultationData.diagnosis,
      symptoms: consultationData.symptoms.split(",").map((s) => s.trim()),
      treatment: consultationData.treatment,
      notes: consultationData.notes,
      department: patient.department || "general",
      prescription:
        medications.length > 0
          ? {
              id: `PRESC-${Date.now()}`,
              patientId: patient.id,
              doctorId: "current-doctor",
              date: new Date().toISOString(),
              medications: medications,
              instructions: consultationData.treatment,
            }
          : undefined,
    }

    // Mise à jour du patient
    const updatedPatient = {
      ...patient,
      status: consultationData.hospitalize ? "hospitalized" : "completed",
      isHospitalized: consultationData.hospitalize,
      hospitalRoom: consultationData.hospitalize ? consultationData.hospitalRoom : undefined,
      admissionDate: consultationData.hospitalize ? new Date().toISOString() : undefined,
      medicalHistory: [...(patient.medicalHistory || []), newRecord],
    }

    onConsultationComplete(updatedPatient, newRecord)
  }

  const handlePrintPrescription = () => {
    // Dans une application réelle, cela ouvrirait une fenêtre d'impression
    // ou générerait un PDF
    window.alert("Fonctionnalité d'impression en cours de développement")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">
          Consultation - {patient.firstName} {patient.lastName}
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
          <TabsTrigger value="prescription">Ordonnance</TabsTrigger>
          <TabsTrigger value="hospitalization">Hospitalisation</TabsTrigger>
        </TabsList>

        <TabsContent value="consultation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informations de consultation</span>
                <Badge className="bg-gradient-medical text-white">{new Date().toLocaleDateString("fr-FR")}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="symptoms">Symptômes (séparés par des virgules)</Label>
                  <Textarea
                    id="symptoms"
                    value={consultationData.symptoms}
                    onChange={(e) => setConsultationData({ ...consultationData, symptoms: e.target.value })}
                    placeholder="Ex: Fièvre, Maux de tête, Fatigue"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="diagnosis">Diagnostic</Label>
                  <Input
                    id="diagnosis"
                    value={consultationData.diagnosis}
                    onChange={(e) => setConsultationData({ ...consultationData, diagnosis: e.target.value })}
                    placeholder="Ex: Grippe saisonnière"
                  />
                </div>

                <div>
                  <Label htmlFor="treatment">Traitement</Label>
                  <Textarea
                    id="treatment"
                    value={consultationData.treatment}
                    onChange={(e) => setConsultationData({ ...consultationData, treatment: e.target.value })}
                    placeholder="Ex: Repos, hydratation, médicaments"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes additionnelles</Label>
                  <Textarea
                    id="notes"
                    value={consultationData.notes}
                    onChange={(e) => setConsultationData({ ...consultationData, notes: e.target.value })}
                    placeholder="Notes pour le suivi du patient"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="followUpDate">Date de suivi</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={consultationData.followUpDate}
                    onChange={(e) => setConsultationData({ ...consultationData, followUpDate: e.target.value })}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ordonnance</span>
                <Button variant="outline" onClick={handlePrintPrescription}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Dr. Mamadou Sarr</h3>
                      <p className="text-sm text-gray-600">Cardiologue</p>
                      <p className="text-sm text-gray-600">N° RPPS: 10101010101</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{new Date().toLocaleDateString("fr-FR")}</p>
                      <p className="text-sm text-gray-600">Hôpital Medi+</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium">Patient:</h4>
                    <p>
                      {patient.firstName} {patient.lastName},{" "}
                      {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} ans
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Médicaments prescrits:</h4>

                  {medications.length === 0 ? (
                    <p className="text-gray-500 italic">Aucun médicament prescrit</p>
                  ) : (
                    <div className="space-y-3">
                      {medications.map((med, index) => (
                        <div key={index} className="flex justify-between items-start p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">
                              {med.name} - {med.dosage}
                            </p>
                            <p className="text-sm text-gray-600">
                              {med.frequency} - Durée: {med.duration}
                            </p>
                            {med.instructions && <p className="text-sm text-gray-600 mt-1">{med.instructions}</p>}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveMedication(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 border-t pt-4">
                    <h4 className="font-medium mb-2">Ajouter un médicament:</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="medName">Nom du médicament</Label>
                        <Input
                          id="medName"
                          value={newMedication.name}
                          onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                          placeholder="Ex: Paracétamol"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medDosage">Dosage</Label>
                        <Input
                          id="medDosage"
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                          placeholder="Ex: 1000mg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="medFrequency">Fréquence</Label>
                        <Input
                          id="medFrequency"
                          value={newMedication.frequency}
                          onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                          placeholder="Ex: 3 fois par jour"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medDuration">Durée</Label>
                        <Input
                          id="medDuration"
                          value={newMedication.duration}
                          onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                          placeholder="Ex: 7 jours"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="medInstructions">Instructions</Label>
                      <Textarea
                        id="medInstructions"
                        value={newMedication.instructions}
                        onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                        placeholder="Ex: Prendre après les repas"
                        rows={2}
                      />
                    </div>

                    <Button
                      onClick={handleAddMedication}
                      className="w-full"
                      disabled={!newMedication.name || !newMedication.dosage}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter à l'ordonnance
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hospitalization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hospitalisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hospitalize"
                    checked={consultationData.hospitalize}
                    onChange={(e) => setConsultationData({ ...consultationData, hospitalize: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-medical-blue focus:ring-medical-blue"
                  />
                  <Label htmlFor="hospitalize">Hospitaliser le patient</Label>
                </div>

                {consultationData.hospitalize && (
                  <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                    <div>
                      <Label htmlFor="hospitalRoom">Chambre</Label>
                      <Select
                        value={consultationData.hospitalRoom}
                        onValueChange={(value) => setConsultationData({ ...consultationData, hospitalRoom: value })}
                      >
                        <SelectTrigger id="hospitalRoom">
                          <SelectValue placeholder="Sélectionner une chambre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="101A">Chambre 101A</SelectItem>
                          <SelectItem value="102B">Chambre 102B</SelectItem>
                          <SelectItem value="103C">Chambre 103C</SelectItem>
                          <SelectItem value="201A">Chambre 201A</SelectItem>
                          <SelectItem value="202B">Chambre 202B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="hospitalizationReason">Raison de l'hospitalisation</Label>
                      <Textarea
                        id="hospitalizationReason"
                        placeholder="Raison détaillée de l'hospitalisation"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="estimatedDuration">Durée estimée</Label>
                      <Select>
                        <SelectTrigger id="estimatedDuration">
                          <SelectValue placeholder="Sélectionner une durée" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 jour</SelectItem>
                          <SelectItem value="2">2 jours</SelectItem>
                          <SelectItem value="3">3 jours</SelectItem>
                          <SelectItem value="5">5 jours</SelectItem>
                          <SelectItem value="7">1 semaine</SelectItem>
                          <SelectItem value="14">2 semaines</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onBack}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} className="bg-gradient-medical hover:opacity-90">
          <Save className="w-4 h-4 mr-2" />
          Terminer la consultation
        </Button>
      </div>
    </div>
  )
}
