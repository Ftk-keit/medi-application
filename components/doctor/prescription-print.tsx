"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, FileText } from "lucide-react"
import type { Patient, Prescription } from "@/types"

interface PrescriptionPrintProps {
  patient: Patient
  prescription: Prescription
  doctor: {
    name: string
    department: string
  }
}

export function PrescriptionPrint({ patient, prescription, doctor }: PrescriptionPrintProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)

    // Créer une fenêtre d'impression
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      // Contenu HTML de l'ordonnance
      const prescriptionHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ordonnance Médicale - ${patient.firstName} ${patient.lastName}</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #2563eb;
            }
            .hospital-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin: 0;
            }
            .doctor-info {
              font-size: 16px;
              margin: 5px 0;
            }
            .patient-info {
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f3f4f6;
              border-radius: 5px;
            }
            .prescription-date {
              text-align: right;
              margin-bottom: 20px;
            }
            .medication {
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #e5e7eb;
            }
            .medication-name {
              font-weight: bold;
              font-size: 16px;
            }
            .medication-details {
              margin-left: 20px;
            }
            .category {
              display: inline-block;
              padding: 3px 8px;
              background-color: #e5e7eb;
              border-radius: 12px;
              font-size: 12px;
              margin-left: 10px;
            }
            .instructions {
              margin-top: 30px;
              padding: 15px;
              background-color: #f3f4f6;
              border-radius: 5px;
            }
            .signature {
              margin-top: 40px;
              text-align: right;
            }
            .signature-line {
              display: inline-block;
              width: 200px;
              border-bottom: 1px solid #333;
              margin-bottom: 5px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
            .validity {
              margin-top: 20px;
              font-style: italic;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="hospital-name">Centre Médical Medi+</p>
            <p class="doctor-info">Dr. ${doctor.name}</p>
            <p class="doctor-info">Service de ${doctor.department}</p>
          </div>
          
          <div class="prescription-date">
            <p>Date: ${new Date().toLocaleDateString("fr-FR")}</p>
          </div>
          
          <div class="patient-info">
            <p><strong>Patient:</strong> ${patient.firstName} ${patient.lastName}</p>
            <p><strong>Date de naissance:</strong> ${new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")}</p>
            <p><strong>Numéro de dossier:</strong> ${patient.qrCode}</p>
          </div>
          
          <h2>Ordonnance</h2>
          
          ${prescription.medications
            .map(
              (med) => `
            <div class="medication">
              <div class="medication-name">
                ${med.name} ${med.dosage}
                <span class="category">${med.category}</span>
              </div>
              <div class="medication-details">
                <p><strong>Posologie:</strong> ${med.frequency}</p>
                <p><strong>Durée:</strong> ${med.duration}</p>
                ${med.instructions ? `<p><strong>Instructions:</strong> ${med.instructions}</p>` : ""}
              </div>
            </div>
          `,
            )
            .join("")}
          
          ${
            prescription.instructions
              ? `
            <div class="instructions">
              <h3>Instructions générales:</h3>
              <p>${prescription.instructions}</p>
            </div>
          `
              : ""
          }
          
          <div class="signature">
            <div class="signature-line"></div>
            <p>Dr. ${doctor.name}</p>
          </div>
          
          <div class="validity">
            <p>Cette ordonnance est valable pour une durée de 30 jours à compter de la date d'émission.</p>
          </div>
          
          <div class="footer">
            <p>Centre Médical Medi+ - Système de Gestion Médicale</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
        </html>
      `

      printWindow.document.open()
      printWindow.document.write(prescriptionHTML)
      printWindow.document.close()

      // Réinitialiser l'état après l'impression
      printWindow.onafterprint = () => {
        setIsPrinting(false)
      }
    }
  }

  return (
    <div className="mt-4">
      <Button onClick={handlePrint} disabled={isPrinting} className="bg-gradient-medical hover:bg-medical-blue-dark">
        {isPrinting ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Impression en cours...
          </>
        ) : (
          <>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer l'ordonnance
          </>
        )}
      </Button>

      <div className="mt-6 p-4 border rounded-md bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="mr-2 h-5 w-5 text-medical-blue" />
            Aperçu de l'ordonnance
          </h3>
          <Badge variant="outline" className="bg-white">
            {new Date().toLocaleDateString("fr-FR")}
          </Badge>
        </div>

        <div className="bg-white p-4 rounded-md border mb-4">
          <p className="font-medium">
            Patient: {patient.firstName} {patient.lastName}
          </p>
          <p className="text-sm text-gray-500">
            Né(e) le {new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")} • Dossier: {patient.qrCode}
          </p>
        </div>

        <div className="space-y-3">
          {prescription.medications.map((med, index) => (
            <div key={index} className="bg-white p-3 rounded-md border">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {med.name} {med.dosage}
                </div>
                <Badge variant="outline" className="bg-gray-100">
                  {med.category}
                </Badge>
              </div>
              <div className="mt-1 text-sm">
                <p>
                  <span className="text-gray-500">Posologie:</span> {med.frequency}
                </p>
                <p>
                  <span className="text-gray-500">Durée:</span> {med.duration}
                </p>
                {med.instructions && (
                  <p>
                    <span className="text-gray-500">Instructions:</span> {med.instructions}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {prescription.instructions && (
          <div className="mt-4 p-3 bg-white rounded-md border">
            <p className="font-medium mb-1">Instructions générales:</p>
            <p className="text-sm">{prescription.instructions}</p>
          </div>
        )}

        <div className="mt-4 text-right">
          <p className="font-medium">Dr. {doctor.name}</p>
          <p className="text-sm text-gray-500">Service de {doctor.department}</p>
        </div>
      </div>
    </div>
  )
}
