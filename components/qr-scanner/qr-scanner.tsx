"use client"

import { useState } from "react"
import { QrCode, Search, AlertTriangle, Phone, Hospital } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Patient } from "@/types"

interface QRScannerProps {
  patients: Patient[]
  onPatientFound: (patient: Patient) => void
}

export function QRScanner({ patients, onPatientFound }: QRScannerProps) {
  const [qrCode, setQrCode] = useState("")
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = () => {
    const patient = patients.find((p) => p.qrCode === qrCode)
    if (patient) {
      setFoundPatient(patient)
      onPatientFound(patient)
    } else {
      setFoundPatient(null)
    }
  }

  const simulateQRScan = () => {
    setIsScanning(true)
    // Simulate scanning delay
    setTimeout(() => {
      const randomPatient = patients[Math.floor(Math.random() * patients.length)]
      setQrCode(randomPatient.qrCode)
      setFoundPatient(randomPatient)
      setIsScanning(false)
      onPatientFound(randomPatient)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Scanner QR Patient</h2>
        <Badge className="bg-gradient-medical text-white">Accès Rapide</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-medical-blue" />
              Scanner QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              {isScanning ? (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-medical-blue border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600">Scan en cours...</p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Placez le QR code devant la caméra</p>
                </div>
              )}
            </div>

            <Button
              onClick={simulateQRScan}
              disabled={isScanning}
              className="w-full bg-gradient-medical hover:opacity-90"
            >
              {isScanning ? "Scan en cours..." : "Démarrer le scan (Demo)"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Saisir le code QR manuellement"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
              />
              <Button onClick={handleScan} variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Patient</CardTitle>
          </CardHeader>
          <CardContent>
            {foundPatient ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {foundPatient.firstName[0]}
                    {foundPatient.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {foundPatient.firstName} {foundPatient.lastName}
                    </h3>
                    <p className="text-gray-600">
                      {new Date().getFullYear() - new Date(foundPatient.dateOfBirth).getFullYear()} ans
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant={foundPatient.status === "active" ? "default" : "secondary"}>
                    {foundPatient.status === "active" ? "Actif" : "Inactif"}
                  </Badge>
                  {foundPatient.isHospitalized && (
                    <Badge className="bg-red-100 text-red-800">
                      <Hospital className="w-3 h-3 mr-1" />
                      Hospitalisé - {foundPatient.hospitalRoom}
                    </Badge>
                  )}
                </div>

                {/* Emergency Info */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Informations d'Urgence
                  </h4>
                  <div className="mt-2 space-y-2 text-sm">
                    {foundPatient.allergies.length > 0 && (
                      <div>
                        <span className="font-medium text-red-700">Allergies: </span>
                        <span className="text-red-600">{foundPatient.allergies.join(", ")}</span>
                      </div>
                    )}
                    {foundPatient.chronicConditions.length > 0 && (
                      <div>
                        <span className="font-medium text-red-700">Conditions: </span>
                        <span className="text-red-600">{foundPatient.chronicConditions.join(", ")}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-red-700">Contact d'urgence: </span>
                      <span className="text-red-600">
                        {foundPatient.emergencyContact.name} - {foundPatient.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Medications */}
                {foundPatient.currentMedications.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800">Médicaments Actuels</h4>
                    <div className="mt-2 space-y-1">
                      {foundPatient.currentMedications.map((med, index) => (
                        <div key={index} className="text-sm text-blue-700">
                          • {med}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-medical hover:opacity-90">Voir Dossier Complet</Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Appeler
                  </Button>
                </div>
              </div>
            ) : qrCode && !foundPatient ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 font-medium">Patient non trouvé</p>
                <p className="text-gray-500 text-sm">Vérifiez le code QR et réessayez</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Scannez un QR code pour voir les informations patient</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
