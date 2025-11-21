"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { EmergencyContact } from "@/types"

interface PatientRegistrationProps {
  onPatientRegistered: (patient: any) => void
}

export function PatientRegistration({ onPatientRegistered }: PatientRegistrationProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    allergies: "",
    chronicConditions: "",
    department: "",
    consultationType: "",
    priority: "normal",
  })

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "", phone: "", relationship: "" },
  ])

  const departments = [
    { id: "cardiology", name: "Cardiologie", price: 80 },
    { id: "neurology", name: "Neurologie", price: 90 },
    { id: "pediatrics", name: "Pédiatrie", price: 60 },
    { id: "orthopedics", name: "Orthopédie", price: 75 },
    { id: "dermatology", name: "Dermatologie", price: 65 },
    { id: "emergency", name: "Urgences", price: 120 },
    { id: "maternity", name: "Maternité", price: 70 },
    { id: "psychiatry", name: "Psychiatrie", price: 85 },
    { id: "ophthalmology", name: "Ophtalmologie", price: 70 },
  ]

  const generateQRCode = () => {
    return `PAT${Date.now().toString().slice(-6)}`
  }

  const handleEmergencyContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    const updatedContacts = [...emergencyContacts]
    updatedContacts[index] = { ...updatedContacts[index], [field]: value }
    setEmergencyContacts(updatedContacts)
  }

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: "", phone: "", relationship: "" }])
  }

  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length > 1) {
      const updatedContacts = [...emergencyContacts]
      updatedContacts.splice(index, 1)
      setEmergencyContacts(updatedContacts)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedDept = departments.find((d) => d.id === formData.department)

    // Filtrer les contacts d'urgence vides
    const validEmergencyContacts = emergencyContacts.filter(
      (contact) => contact.name.trim() !== "" && contact.phone.trim() !== "",
    )

    const newPatient = {
      id: Date.now().toString(),
      qrCode: generateQRCode(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as "M" | "F",
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergencyContacts: validEmergencyContacts,
      medicalHistory: [],
      allergies: formData.allergies
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      chronicConditions: formData.chronicConditions
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      currentMedications: [],
      isHospitalized: false,
      status: "waiting_payment" as const,
      department: formData.department,
      consultationType: formData.consultationType,
      registrationDate: new Date().toISOString(),
      paymentStatus: "pending" as const,
      paymentAmount: selectedDept?.price || 0,
      priority: formData.priority as "normal" | "urgent" | "emergency",
      labResults: [],
    }

    onPatientRegistered(newPatient)

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      allergies: "",
      chronicConditions: "",
      department: "",
      consultationType: "",
      priority: "normal",
    })
    setEmergencyContacts([{ name: "", phone: "", relationship: "" }])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Enregistrement Patient</h2>
        <Badge className="bg-gradient-medical text-white">Réception</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-medical-blue" />
            Nouveau Patient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Sexe *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Urgence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Contacts d'urgence</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEmergencyContact}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Ajouter un contact
                </Button>
              </div>

              {emergencyContacts.map((contact, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Contact d'urgence {index + 1}</h4>
                    {emergencyContacts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmergencyContact(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`emergencyContactName-${index}`}>Nom *</Label>
                      <Input
                        id={`emergencyContactName-${index}`}
                        value={contact.name}
                        onChange={(e) => handleEmergencyContactChange(index, "name", e.target.value)}
                        required={index === 0}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`emergencyContactPhone-${index}`}>Téléphone *</Label>
                      <Input
                        id={`emergencyContactPhone-${index}`}
                        value={contact.phone}
                        onChange={(e) => handleEmergencyContactChange(index, "phone", e.target.value)}
                        required={index === 0}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`emergencyContactRelation-${index}`}>Relation *</Label>
                      <Input
                        id={`emergencyContactRelation-${index}`}
                        value={contact.relationship}
                        onChange={(e) => handleEmergencyContactChange(index, "relationship", e.target.value)}
                        required={index === 0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Consultation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Département *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name} - {dept.price}€
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="consultationType">Type de consultation</Label>
                  <Select
                    value={formData.consultationType}
                    onValueChange={(value) => setFormData({ ...formData, consultationType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-visit">Première visite</SelectItem>
                      <SelectItem value="follow-up">Suivi</SelectItem>
                      <SelectItem value="emergency">Urgence</SelectItem>
                      <SelectItem value="control">Contrôle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Informations médicales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="allergies">Allergies (séparées par des virgules)</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="Ex: Pénicilline, Fruits de mer"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="chronicConditions">Conditions chroniques (séparées par des virgules)</Label>
                  <Textarea
                    id="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                    placeholder="Ex: Diabète, Hypertension"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Annuler
              </Button>
              <Button type="submit" className="bg-gradient-medical hover:opacity-90">
                <Save className="w-4 h-4 mr-2" />
                Enregistrer Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
