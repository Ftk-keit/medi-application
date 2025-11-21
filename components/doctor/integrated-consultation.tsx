"use client"

import type React from "react"

import { useState } from "react"
import { Save, Printer, Plus, Trash2, ArrowLeft, FileText, Stethoscope, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import type { Patient, MedicalRecord, Medication, VitalSigns, Prescription } from "@/types"
import { getDepartmentName, getDepartmentColor } from "@/config/departments"

interface IntegratedConsultationProps {
  patient: Patient
  onBack: () => void
  onConsultationComplete: (patient: Patient, record: MedicalRecord) => void
  currentDoctor: {
    id: string
    name: string
    department: string
  }
}

export function IntegratedConsultation({
  patient,
  onBack,
  onConsultationComplete,
  currentDoctor,
}: IntegratedConsultationProps) {
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

  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    temperature: undefined,
    bloodPressure: "",
    heartRate: undefined,
    oxygenSaturation: undefined,
    weight: undefined,
    height: undefined,
    notes: "",
  })

  const [medications, setMedications] = useState<Medication[]>([])
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    category: "autre",
  })

  const [prescriptionInstructions, setPrescriptionInstructions] = useState("")

  const medicationCategories = [
    { value: "antibiotique", label: "Antibiotique" },
    { value: "antidouleur", label: "Antidouleur" },
    { value: "anti-inflammatoire", label: "Anti-inflammatoire" },
    { value: "autre", label: "Autre" },
  ]

  const commonMedications = {
    pediatrics: [
      { name: "Paracétamol pédiatrique", dosage: "10mg/kg", frequency: "3 fois par jour" },
      { name: "Amoxicilline", dosage: "50mg/kg/jour", frequency: "2 fois par jour" },
      { name: "Doliprane", dosage: "15mg/kg", frequency: "4 fois par jour" },
    ],
    cardiology: [
      { name: "Lisinopril", dosage: "10mg", frequency: "1 fois par jour" },
      { name: "Atorvastatine", dosage: "20mg", frequency: "1 fois par jour le soir" },
      { name: "Bisoprolol", dosage: "5mg", frequency: "1 fois par jour" },
    ],
    neurology: [
      { name: "Levetiracetam", dosage: "500mg", frequency: "2 fois par jour" },
      { name: "Gabapentine", dosage: "300mg", frequency: "3 fois par jour" },
      { name: "Sumatriptan", dosage: "50mg", frequency: "Si besoin" },
    ],
    maternity: [
      { name: "Acide folique", dosage: "5mg", frequency: "1 fois par jour" },
      { name: "Fer", dosage: "80mg", frequency: "1 fois par jour" },
      { name: "Calcium", dosage: "1000mg", frequency: "1 fois par jour" },
    ],
  }

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setMedications([...medications, { ...newMedication }])
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        category: "autre",
      })
    }
  }

  const handleAddCommonMedication = (med: { name: string; dosage: string; frequency: string }) => {
    setNewMedication({
      ...newMedication,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
    })
  }

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const prescription: Prescription | undefined =
      medications.length > 0
        ? {
            id: `PRESC-${Date.now()}`,
            patientId: patient.id,
            doctorId: currentDoctor.id,
            doctorName: currentDoctor.name,
            date: new Date().toISOString(),
            medications: medications,
            instructions: prescriptionInstructions,
            department: currentDoctor.department,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
            printed: false,
            dispensed: false,
          }
        : undefined

    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      patientId: patient.id,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      date: new Date().toISOString(),
      type: "consultation",
      diagnosis: consultationData.diagnosis,
      symptoms: consultationData.symptoms.split(",").map((s) => s.trim()),
      treatment: consultationData.treatment,
      notes: consultationData.notes,
      department: currentDoctor.department,
      prescription: prescription,
      vitalSigns: vitalSigns,
      followUpDate: consultationData.followUpDate,
    }

    const updatedPatient = {
      ...patient,
      status: consultationData.hospitalize ? "hospitalized" : "completed",
      isHospitalized: consultationData.hospitalize,
      hospitalRoom: consultationData.hospitalize ? consultationData.hospitalRoom : undefined,
      admissionDate: consultationData.hospitalize ? new Date().toISOString() : undefined,
      medicalHistory: [...(patient.medicalHistory || []), newRecord],
      currentMedications: medications.map((med) => `${med.name} ${med.dosage}`),
    }

    onConsultationComplete(updatedPatient, newRecord)
  }

  const handlePrintPrescription = () => {
    if (medications.length === 0) {
      alert("Aucun médicament à imprimer")
      return
    }

    const printContent = `
    <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: 0 auto;">
      <!-- En-tête -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
        <div>
          <h1 style="color: #2563eb; margin: 0; font-size: 24px;">Dr. ${currentDoctor.name}</h1>
          <p style="margin: 5px 0; font-size: 16px; color: #666;">${getDepartmentName(currentDoctor.department)}</p>
          <p style="margin: 5px 0; color: #666;">N° RPPS: 10101010101</p>
          <p style="margin: 5px 0; color: #666;">Hôpital Medi+</p>
          <p style="margin: 5px 0; color: #666;">123 Avenue de la Médecine, 75001 Paris</p>
          <p style="margin: 5px 0; color: #666;">Tél: 01 23 45 67 89</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 5px 0; font-size: 14px; color: #666;">Date: ${new Date().toLocaleDateString("fr-FR")}</p>
          <div style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; margin-top: 10px;">
            <h2 style="margin: 0; font-size: 18px;">ORDONNANCE</h2>
          </div>
        </div>
      </div>
      
      <!-- Informations patient -->
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #2563eb;">
        <h3 style="margin: 0 0 15px 0; color: #2563eb;">Informations Patient</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="margin: 5px 0;"><strong>Nom:</strong> ${patient.firstName} ${patient.lastName}</p>
            <p style="margin: 5px 0;"><strong>Date de naissance:</strong> ${new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")} (${
              new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
            } ans)</p>
          </div>
          <div>
            <p style="margin: 5px 0;"><strong>Adresse:</strong> ${patient.address}</p>
            <p style="margin: 5px 0;"><strong>Téléphone:</strong> ${patient.phone}</p>
          </div>
        </div>
      </div>
      
      <!-- Médicaments prescrits -->
      <div style="margin-bottom: 40px;">
        <h3 style="color: #2563eb; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Médicaments Prescrits</h3>
        ${medications
          .map(
            (med, index) => `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: ${
            index % 2 === 0 ? "#ffffff" : "#f8fafc"
          };">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
              <h4 style="margin: 0; color: #1e40af; font-size: 16px;">${med.name}</h4>
              <span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                ${medicationCategories.find((cat) => cat.value === med.category)?.label || "Autre"}
              </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 10px;">
              <p style="margin: 0;"><strong>Dosage:</strong> ${med.dosage}</p>
              <p style="margin: 0;"><strong>Fréquence:</strong> ${med.frequency}</p>
              <p style="margin: 0;"><strong>Durée:</strong> ${med.duration}</p>
            </div>
            ${med.instructions ? `<p style="margin: 10px 0 0 0; padding: 10px; background: #fef3c7; border-radius: 4px; font-style: italic;"><strong>Instructions:</strong> ${med.instructions}</p>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>
      
      ${
        prescriptionInstructions
          ? `
        <div style="margin-bottom: 40px; padding: 20px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 15px 0; color: #047857;">Instructions Générales</h3>
          <p style="margin: 0; line-height: 1.6;">${prescriptionInstructions}</p>
        </div>
      `
          : ""
      }
      
      <!-- Pied de page -->
      <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: end;">
        <div style="flex: 1;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            Cette ordonnance est valable 30 jours à compter de la date d'émission.<br>
            En cas d'urgence, contactez le service des urgences au 15.
          </p>
        </div>
        <div style="text-align: center; flex: 1;">
          <p style="margin: 0 0 40px 0; font-size: 14px;">Signature du médecin:</p>
          <div style="border-bottom: 1px solid #000; width: 200px; margin: 0 auto 10px auto;"></div>
          <p style="margin: 0; font-weight: bold;">Dr. ${currentDoctor.name}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${getDepartmentName(currentDoctor.department)}</p>
        </div>
      </div>
    </div>
  `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Ordonnance - ${patient.firstName} ${patient.lastName}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `)
      printWindow.document.close()
    }
  }

  const departmentColor = getDepartmentColor(currentDoctor.department)

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
        <Badge style={{ backgroundColor: departmentColor, color: "white" }}>
          {getDepartmentName(currentDoctor.department)}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consultation">
            <Stethoscope className="w-4 h-4 mr-2" />
            Consultation
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <Activity className="w-4 h-4 mr-2" />
            Constantes
          </TabsTrigger>
          <TabsTrigger value="prescription">
            <FileText className="w-4 h-4 mr-2" />
            Ordonnance
          </TabsTrigger>
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
              <div className="space-y-4">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Constantes vitales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="temperature">Température (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={vitalSigns.temperature || ""}
                    onChange={(e) =>
                      setVitalSigns({
                        ...vitalSigns,
                        temperature: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                      })
                    }
                    placeholder="37.0"
                  />
                </div>

                <div>
                  <Label htmlFor="bloodPressure">Pression artérielle</Label>
                  <Input
                    id="bloodPressure"
                    value={vitalSigns.bloodPressure || ""}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })}
                    placeholder="120/80"
                  />
                </div>

                <div>
                  <Label htmlFor="heartRate">Fréquence cardiaque (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={vitalSigns.heartRate || ""}
                    onChange={(e) =>
                      setVitalSigns({
                        ...vitalSigns,
                        heartRate: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="72"
                  />
                </div>

                <div>
                  <Label htmlFor="oxygenSaturation">Saturation O2 (%)</Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    value={vitalSigns.oxygenSaturation || ""}
                    onChange={(e) =>
                      setVitalSigns({
                        ...vitalSigns,
                        oxygenSaturation: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="98"
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={vitalSigns.weight || ""}
                    onChange={(e) =>
                      setVitalSigns({
                        ...vitalSigns,
                        weight: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                      })
                    }
                    placeholder="70.0"
                  />
                </div>

                <div>
                  <Label htmlFor="height">Taille (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={vitalSigns.height || ""}
                    onChange={(e) =>
                      setVitalSigns({
                        ...vitalSigns,
                        height: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="175"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="vitalNotes">Notes sur les constantes</Label>
                <Textarea
                  id="vitalNotes"
                  value={vitalSigns.notes || ""}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, notes: e.target.value })}
                  placeholder="Observations particulières..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ordonnance</span>
                <Button
                  variant="outline"
                  onClick={handlePrintPrescription}
                  disabled={medications.length === 0}
                  className="bg-medical-blue text-white hover:bg-medical-blue/90"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer l'ordonnance
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Médicaments prescrits */}
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
                            <Badge variant="outline" className="mt-1">
                              {medicationCategories.find((cat) => cat.value === med.category)?.label}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveMedication(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Médicaments courants par département */}
                {currentDoctor.department in commonMedications && (
                  <div>
                    <h4 className="font-medium mb-2">
                      Médicaments courants en {getDepartmentName(currentDoctor.department)}:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {commonMedications[currentDoctor.department as keyof typeof commonMedications].map(
                        (med, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddCommonMedication(med)}
                            className="justify-start text-left h-auto p-2"
                          >
                            <div>
                              <p className="font-medium text-sm">{med.name}</p>
                              <p className="text-xs text-gray-500">
                                {med.dosage} - {med.frequency}
                              </p>
                            </div>
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Ajouter un médicament */}
                <div>
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

                  <div className="grid grid-cols-3 gap-4 mb-4">
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
                    <div>
                      <Label htmlFor="medCategory">Catégorie</Label>
                      <Select
                        value={newMedication.category}
                        onValueChange={(value) =>
                          setNewMedication({ ...newMedication, category: value as Medication["category"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {medicationCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

                <Separator />

                {/* Instructions générales */}
                <div>
                  <Label htmlFor="prescriptionInstructions">Instructions générales de l'ordonnance</Label>
                  <Textarea
                    id="prescriptionInstructions"
                    value={prescriptionInstructions}
                    onChange={(e) => setPrescriptionInstructions(e.target.value)}
                    placeholder="Instructions générales pour le patient..."
                    rows={3}
                  />
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
                          <SelectItem value="301A">Chambre 301A - Pédiatrie</SelectItem>
                          <SelectItem value="302B">Chambre 302B - Maternité</SelectItem>
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
