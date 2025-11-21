"use client"

import { useState } from "react"
import { FileBarChart, Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import type { LabResult, LabValue } from "@/types"

interface LabResultsTabProps {
  patientId: string
  doctorId: string
  doctorName: string
  onLabResultAdded: (labResult: LabResult) => void
}

export function LabResultsTab({ patientId, doctorId, doctorName, onLabResultAdded }: LabResultsTabProps) {
  const [labType, setLabType] = useState<string>("blood_test")
  const [labName, setLabName] = useState<string>("")
  const [labNotes, setLabNotes] = useState<string>("")
  const [labValues, setLabValues] = useState<LabValue[]>([])
  const [newValue, setNewValue] = useState<LabValue>({
    name: "",
    value: "",
    unit: "",
    normalRange: "",
    isAbnormal: false,
  })

  // Valeurs prédéfinies pour l'électrophorèse
  const electrophoresisTemplate = [
    { name: "Albumine", unit: "g/L", normalRange: "35-50" },
    { name: "Alpha-1", unit: "g/L", normalRange: "2-4" },
    { name: "Alpha-2", unit: "g/L", normalRange: "5-9" },
    { name: "Beta", unit: "g/L", normalRange: "6-11" },
    { name: "Gamma", unit: "g/L", normalRange: "7-16" },
  ]

  // Valeurs prédéfinies pour les analyses sanguines courantes
  const bloodTestTemplate = [
    { name: "Hémoglobine", unit: "g/dL", normalRange: "12-16" },
    { name: "Globules blancs", unit: "10^9/L", normalRange: "4.5-11.0" },
    { name: "Plaquettes", unit: "10^9/L", normalRange: "150-400" },
    { name: "Glycémie", unit: "mmol/L", normalRange: "3.9-5.8" },
  ]

  const handleAddValue = () => {
    if (newValue.name && newValue.value) {
      setLabValues([...labValues, { ...newValue }])
      setNewValue({
        name: "",
        value: "",
        unit: "",
        normalRange: "",
        isAbnormal: false,
      })
    }
  }

  const handleRemoveValue = (index: number) => {
    const updatedValues = [...labValues]
    updatedValues.splice(index, 1)
    setLabValues(updatedValues)
  }

  const handleLabTypeChange = (type: string) => {
    setLabType(type)
    setLabValues([])

    if (type === "electrophoresis") {
      setLabName("Électrophorèse des protéines sériques")
      setLabValues(
        electrophoresisTemplate.map((item) => ({
          name: item.name,
          value: "",
          unit: item.unit,
          normalRange: item.normalRange,
          isAbnormal: false,
        })),
      )
    } else if (type === "blood_test") {
      setLabName("Analyse sanguine")
      setLabValues([])
    } else {
      setLabName("")
      setLabValues([])
    }
  }

  const handleLoadTemplate = (template: typeof bloodTestTemplate) => {
    setLabValues(
      template.map((item) => ({
        name: item.name,
        value: "",
        unit: item.unit,
        normalRange: item.normalRange,
        isAbnormal: false,
      })),
    )
  }

  const handleSubmit = () => {
    if (!labName || labValues.length === 0) return

    const newLabResult: LabResult = {
      id: `LAB-${Date.now()}`,
      patientId,
      date: new Date().toISOString(),
      type: labType as "blood_test" | "urine_test" | "electrophoresis" | "imaging" | "other",
      name: labName,
      results: labValues,
      status: "completed",
      requestedBy: doctorName,
      reviewedBy: doctorName,
      notes: labNotes,
    }

    onLabResultAdded(newLabResult)

    // Reset form
    setLabName("")
    setLabNotes("")
    setLabValues([])
    setLabType("blood_test")
  }

  const updateLabValue = (index: number, field: keyof LabValue, value: string | number | boolean) => {
    const updatedValues = [...labValues]
    updatedValues[index] = { ...updatedValues[index], [field]: value }
    setLabValues(updatedValues)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-medical-blue" />
            Ajouter un résultat d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="labType">Type d'analyse</Label>
                <Select value={labType} onValueChange={handleLabTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood_test">Analyse sanguine</SelectItem>
                    <SelectItem value="urine_test">Analyse urinaire</SelectItem>
                    <SelectItem value="electrophoresis">Électrophorèse</SelectItem>
                    <SelectItem value="imaging">Imagerie</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="labName">Nom de l'analyse</Label>
                <Input
                  id="labName"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="Ex: Bilan sanguin complet"
                />
              </div>
            </div>

            {labType === "blood_test" && (
              <div>
                <Label>Modèles d'analyses</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadTemplate(bloodTestTemplate)}
                  >
                    Bilan sanguin standard
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleLoadTemplate([
                        { name: "Cholestérol total", unit: "mmol/L", normalRange: "3.9-5.2" },
                        { name: "HDL", unit: "mmol/L", normalRange: "1.0-1.5" },
                        { name: "LDL", unit: "mmol/L", normalRange: "2.0-3.4" },
                        { name: "Triglycérides", unit: "mmol/L", normalRange: "0.5-1.7" },
                      ])
                    }
                  >
                    Bilan lipidique
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleLoadTemplate([
                        { name: "Créatinine", unit: "μmol/L", normalRange: "60-110" },
                        { name: "Urée", unit: "mmol/L", normalRange: "2.5-7.5" },
                        { name: "DFG", unit: "mL/min/1.73m²", normalRange: ">90" },
                      ])
                    }
                  >
                    Fonction rénale
                  </Button>
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Valeurs</Label>
                {labType !== "electrophoresis" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddValue}
                    disabled={!newValue.name || !newValue.value}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Ajouter
                  </Button>
                )}
              </div>

              {labValues.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paramètre</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Unité</TableHead>
                      <TableHead>Plage normale</TableHead>
                      <TableHead>Anormal</TableHead>
                      {labType !== "electrophoresis" && <TableHead></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labValues.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell>{value.name}</TableCell>
                        <TableCell>
                          <Input
                            value={value.value}
                            onChange={(e) => updateLabValue(index, "value", e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={value.unit}
                            onChange={(e) => updateLabValue(index, "unit", e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={value.normalRange}
                            onChange={(e) => updateLabValue(index, "normalRange", e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={value.isAbnormal}
                            onCheckedChange={(checked) => updateLabValue(index, "isAbnormal", checked)}
                          />
                        </TableCell>
                        {labType !== "electrophoresis" && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveValue(index)}
                              className="text-red-500 hover:text-red-700 p-0 h-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Aucune valeur ajoutée</p>
                </div>
              )}

              {labType !== "electrophoresis" && (
                <div className="grid grid-cols-4 gap-2 mt-4 p-3 bg-gray-50 rounded-lg">
                  <Input
                    placeholder="Paramètre"
                    value={newValue.name}
                    onChange={(e) => setNewValue({ ...newValue, name: e.target.value })}
                  />
                  <Input
                    placeholder="Valeur"
                    value={newValue.value}
                    onChange={(e) => setNewValue({ ...newValue, value: e.target.value })}
                  />
                  <Input
                    placeholder="Unité"
                    value={newValue.unit}
                    onChange={(e) => setNewValue({ ...newValue, unit: e.target.value })}
                  />
                  <Input
                    placeholder="Plage normale"
                    value={newValue.normalRange}
                    onChange={(e) => setNewValue({ ...newValue, normalRange: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="labNotes">Notes</Label>
              <Textarea
                id="labNotes"
                value={labNotes}
                onChange={(e) => setLabNotes(e.target.value)}
                placeholder="Notes sur l'analyse..."
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!labName || labValues.length === 0}
                className="bg-gradient-medical hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer l'analyse
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
