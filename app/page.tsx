"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Dashboard } from "@/components/dashboard/dashboard"
import { PatientList } from "@/components/patients/patient-list"
import { PatientDetail } from "@/components/patients/patient-detail"
import { QRScanner } from "@/components/qr-scanner/qr-scanner"
import { PatientRegistration } from "@/components/reception/patient-registration"
import { PaymentProcessing } from "@/components/cashier/payment-processing"
import { DailySummary } from "@/components/cashier/daily-summary"
import { ConsultationQueue } from "@/components/doctor/consultation-queue"
import { HospitalizedPatients } from "@/components/doctor/hospitalized-patients"
import { HospitalStats } from "@/components/hr/hospital-stats"
import { LoginForm } from "@/components/auth/login-form"
import type { Patient, User, Payment, MedicalRecord } from "@/types"
import { IntegratedConsultation } from "@/components/doctor/integrated-consultation"
import { DepartmentManagement } from "@/components/admin/department-management"
import { ConsultationMenu } from "@/components/doctor/consultation-menu"
import { PatientsOverview } from "@/components/hr/patients-overview"

// Mock users for different roles
const mockUsers: { [key: string]: User } = {
  doctor: {
    id: "1",
    username: "dr.sow",
    firstName: "Amadou",
    lastName: "Sow",
    role: "doctor",
    department: "cardiology",
    speciality: "Cardiologue",
  },
  hr: {
    id: "2",
    username: "hr.diop",
    firstName: "Fatou",
    lastName: "Diop",
    role: "hr",
    department: "RH",
  },
  reception: {
    id: "3",
    username: "reception.ba",
    firstName: "Aïssatou",
    lastName: "Ba",
    role: "reception",
    department: "Accueil",
  },
  cashier: {
    id: "4",
    username: "cashier.ndiaye",
    firstName: "Cheikh",
    lastName: "Ndiaye",
    role: "cashier",
    department: "Caisse",
  },
}

const initialPatients: Patient[] = [
  {
    id: "1",
    qrCode: "PAT001",
    firstName: "Awa",
    lastName: "Gueye",
    dateOfBirth: "1985-03-15",
    gender: "F",
    phone: "77 123 45 67",
    email: "awa.gueye@email.com",
    address: "123 Rue de la Santé, Dakar",
    emergencyContacts: [
      {
        name: "Ibrahima Gueye",
        phone: "77 234 56 78",
        relationship: "Mari",
      },
      {
        name: "Miriam Sow",
        phone: "77 111 22 33",
        relationship: "Sœur",
      },
    ],
    medicalHistory: [
      {
        id: "med1",
        patientId: "1",
        doctorId: "1",
        doctorName: "Dr. Amadou Sow",
        date: new Date(Date.now() - 7 * 86400000).toISOString(),
        type: "consultation",
        diagnosis: "Hypertension artérielle",
        symptoms: ["Maux de tête", "Fatigue"],
        treatment: "Modification du régime alimentaire, médicaments antihypertenseurs",
        notes: "Patiente répondant bien au traitement",
        department: "cardiology",
        vitalSigns: {
          temperature: 36.8,
          bloodPressure: "140/90",
          heartRate: 78,
          oxygenSaturation: 98,
          weight: 68.5,
          height: 165,
        },
      },
    ],
    allergies: ["Pénicilline", "Fruits de mer"],
    chronicConditions: ["Hypertension", "Diabète type 2"],
    currentMedications: ["Lisinopril 10mg", "Metformine 500mg"],
    isHospitalized: false,
    status: "waiting_consultation",
    department: "cardiology",
    consultationType: "follow-up",
    registrationDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    paymentStatus: "paid",
    paymentAmount: 80,
    paymentDate: new Date().toISOString().split("T")[0],
    priority: "normal",
    labResults: [
      {
        id: "LAB001",
        patientId: "1",
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        type: "electrophoresis",
        name: "Électrophorèse des protéines sériques",
        results: [
          { name: "Albumine", value: "42", unit: "g/L", normalRange: "35-50", isAbnormal: false },
          { name: "Alpha-1", value: "3.2", unit: "g/L", normalRange: "2-4", isAbnormal: false },
          { name: "Alpha-2", value: "7.8", unit: "g/L", normalRange: "5-9", isAbnormal: false },
          { name: "Beta", value: "8.5", unit: "g/L", normalRange: "6-11", isAbnormal: false },
          { name: "Gamma", value: "18.2", unit: "g/L", normalRange: "7-16", isAbnormal: true },
        ],
        status: "reviewed",
        requestedBy: "Dr. Amadou Sow",
        reviewedBy: "Dr. Yacine Diallo",
        notes: "Légère augmentation des gamma-globulines, à surveiller",
      },
      {
        id: "LAB002",
        patientId: "1",
        date: new Date(Date.now() - 1 * 86400000).toISOString(),
        type: "blood_test",
        name: "Bilan sanguin complet",
        results: [
          { name: "Hémoglobine", value: "13.5", unit: "g/dL", normalRange: "12-16", isAbnormal: false },
          { name: "Globules blancs", value: "7.2", unit: "10^9/L", normalRange: "4.5-11.0", isAbnormal: false },
          { name: "Plaquettes", value: "280", unit: "10^9/L", normalRange: "150-400", isAbnormal: false },
          { name: "Glycémie", value: "6.8", unit: "mmol/L", normalRange: "3.9-5.8", isAbnormal: true },
        ],
        status: "completed",
        requestedBy: "Dr. Amadou Sow",
        notes: "Glycémie légèrement élevée, ajustement du traitement diabétique recommandé",
      },
    ],
  },
  {
    id: "2",
    qrCode: "PAT002",
    firstName: "Moussa",
    lastName: "Diallo",
    dateOfBirth: "1978-07-22",
    gender: "M",
    phone: "77 234 56 78",
    email: "moussa.diallo@email.com",
    address: "456 Avenue de la République, Dakar",
    emergencyContact: {
      name: "Hawa Diallo",
      phone: "77 111 22 33",
      relationship: "Épouse",
    },
    medicalHistory: [],
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    isHospitalized: false,
    status: "waiting_payment",
    department: "neurology",
    consultationType: "first-visit",
    registrationDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    paymentStatus: "pending",
    paymentAmount: 90,
    priority: "normal",
  },
  {
    id: "3",
    qrCode: "PAT003",
    firstName: "Mariam",
    lastName: "Ndiaye",
    dateOfBirth: "1992-11-08",
    gender: "F",
    phone: "77 345 67 89",
    email: "mariam.ndiaye@email.com",
    address: "789 Boulevard de l'Indépendance, Dakar",
    emergencyContact: {
      name: "Omar Ndiaye",
      phone: "77 456 78 90",
      relationship: "Père",
    },
    medicalHistory: [
      {
        id: "med1",
        patientId: "3",
        doctorId: "1",
        doctorName: "Dr. Amadou Sow",
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        type: "consultation",
        diagnosis: "Pneumonie",
        symptoms: ["Fièvre", "Toux", "Difficultés respiratoires"],
        treatment: "Antibiotiques, repos, hydratation",
        notes: "Patiente nécessitant une hospitalisation pour surveillance",
        department: "cardiology",
      },
    ],
    allergies: ["Aspirine"],
    chronicConditions: ["Asthme"],
    currentMedications: ["Ventoline"],
    isHospitalized: true,
    hospitalRoom: "205B",
    admissionDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "hospitalized",
    department: "cardiology",
    consultationType: "emergency",
    registrationDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    paymentStatus: "paid",
    paymentAmount: 120,
    paymentDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    priority: "urgent",
  },
  {
    id: "4",
    qrCode: "PAT004",
    firstName: "Khady",
    lastName: "Fall",
    dateOfBirth: "2018-05-12",
    gender: "F",
    phone: "77 111 22 33",
    email: "khady.fall@email.com",
    address: "456 Rue de l'Enfance, Dakar",
    emergencyContact: {
      name: "Aïssatou Fall",
      phone: "77 555 66 77",
      relationship: "Mère",
    },
    medicalHistory: [],
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    isHospitalized: false,
    status: "waiting_consultation",
    department: "pediatrics",
    consultationType: "first-visit",
    registrationDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    paymentStatus: "paid",
    paymentAmount: 60,
    paymentDate: new Date().toISOString().split("T")[0],
    priority: "normal",
  },
  {
    id: "5",
    qrCode: "PAT005",
    firstName: "Oumou",
    lastName: "Sane",
    dateOfBirth: "1990-08-20",
    gender: "F",
    phone: "77 666 77 88",
    email: "oumou.sane@email.com",
    address: "789 Avenue de la Maternité, Dakar",
    emergencyContact: {
      name: "Seydou Sane",
      phone: "77 777 88 99",
      relationship: "Époux",
    },
    medicalHistory: [],
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    isHospitalized: false,
    status: "waiting_consultation",
    department: "maternity",
    consultationType: "follow-up",
    registrationDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    paymentStatus: "paid",
    paymentAmount: 70,
    paymentDate: new Date().toISOString().split("T")[0],
    priority: "normal",
  },
]

const initialPayments: Payment[] = [
  {
    id: "1",
    patientId: "1",
    amount: 80,
    date: new Date().toISOString().split("T")[0],
    time: "14:30",
    type: "consultation",
    status: "paid",
    method: "card",
    cashierId: "4",
    department: "cardiology",
  },
  {
    id: "2",
    patientId: "3",
    amount: 120,
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    time: "09:15",
    type: "consultation",
    status: "paid",
    method: "insurance",
    cashierId: "4",
    department: "cardiology",
  },
]

export default function MediPlusApp() {
  const [currentUserRole, setCurrentUserRole] = useState<keyof typeof mockUsers | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [consultationInProgress, setConsultationInProgress] = useState(false)

  const currentUser = currentUserRole ? mockUsers[currentUserRole] : null

  const [currentDoctor] = useState({
    id: "dr.sow",
    name: "Dr. Amadou Sow",
    department: currentUser?.department || "cardiology",
  })

  const handleLogin = (username: string, password: string, role: keyof typeof mockUsers) => {
    setCurrentUserRole(role)
    setIsAuthenticated(true)
    setActiveTab("dashboard")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUserRole(null)
  }

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setActiveTab("patient-detail")
  }

  const handleBackToPatients = () => {
    setSelectedPatient(null)
    setActiveTab("patients")
  }

  const handleAddPatient = () => {
    setActiveTab("patient-registration")
  }

  const handlePatientRegistered = (newPatient: Patient) => {
    setPatients([...patients, newPatient])
    setActiveTab("payment-queue")
  }

  const handlePaymentProcessed = (patientId: string, payment: Payment) => {
    // Update patient status
    setPatients(
      patients.map((p) =>
        p.id === patientId
          ? { ...p, status: "waiting_consultation", paymentStatus: "paid", paymentDate: payment.date }
          : p,
      ),
    )

    // Add payment record
    setPayments([...payments, payment])
  }

  const handleStartConsultation = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    if (patient) {
      setSelectedPatient(patient)
      setConsultationInProgress(true)
      setActiveTab("consultation")

      // Mettre à jour le statut du patient
      setPatients(patients.map((p) => (p.id === patientId ? { ...p, status: "in_consultation" } : p)))
    }
  }

  const handleConsultationComplete = (updatedPatient: Patient, record: MedicalRecord) => {
    // Mettre à jour le patient avec le nouveau dossier médical et statut
    setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)))
    setConsultationInProgress(false)
    setActiveTab("consultation-queue")
  }

  const waitingPayments = patients.filter((p) => p.status === "waiting_payment")
  const waitingConsultations = patients.filter((p) => p.status === "waiting_consultation")
  const hospitalizedPatients = patients.filter((p) => p.isHospitalized)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Medi+" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-medical-blue mb-2">Medi+</h1>
            <p className="text-gray-600">Système de Gestion Médicale</p>
          </div>

          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard userRole={currentUser?.role || ""} />

      case "patients":
        return <PatientList patients={patients} onPatientSelect={handlePatientSelect} onAddPatient={handleAddPatient} />

      case "patient-detail":
        return selectedPatient ? <PatientDetail patient={selectedPatient} onBack={handleBackToPatients} /> : null

      case "qr-scanner":
        return <QRScanner patients={patients} onPatientFound={handlePatientSelect} />

      case "patient-registration":
        return <PatientRegistration onPatientRegistered={handlePatientRegistered} />

      case "payment-queue":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">File d'attente Paiement</h2>
            <div className="text-center py-8">
              <p className="text-gray-600">{waitingPayments.length} patients en attente de paiement</p>
            </div>
          </div>
        )

      case "payment-processing":
        return <PaymentProcessing waitingPayments={waitingPayments} onPaymentProcessed={handlePaymentProcessed} />

      case "daily-summary":
        return <DailySummary payments={payments} />

      case "consultation-queue":
        return (
          <ConsultationQueue
            waitingPatients={waitingConsultations}
            department={currentUser?.department || ""}
            onStartConsultation={handleStartConsultation}
            onViewPatient={handlePatientSelect}
          />
        )

      case "consultation":
        return selectedPatient ? (
          <IntegratedConsultation
            patient={selectedPatient}
            onBack={() => {
              setConsultationInProgress(false)
              setActiveTab("consultation-queue")
            }}
            onConsultationComplete={handleConsultationComplete}
            currentDoctor={currentDoctor}
          />
        ) : null

      case "hospitalization":
        return <HospitalizedPatients patients={hospitalizedPatients} onViewPatient={handlePatientSelect} />

      case "consultation-queues":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Files de Consultation par Département</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["cardiology", "neurology", "pediatrics", "orthopedics", "dermatology", "emergency"].map((dept) => {
                const deptPatients = waitingConsultations.filter((p) => p.department === dept)
                const deptNames: { [key: string]: string } = {
                  cardiology: "Cardiologie",
                  neurology: "Neurologie",
                  pediatrics: "Pédiatrie",
                  orthopedics: "Orthopédie",
                  dermatology: "Dermatologie",
                  emergency: "Urgences",
                }

                return (
                  <div key={dept} className="p-4 border rounded-lg bg-white">
                    <h3 className="font-semibold text-lg mb-2">{deptNames[dept]}</h3>
                    <div className="text-2xl font-bold text-medical-blue mb-2">{deptPatients.length}</div>
                    <p className="text-sm text-gray-600">patients en attente</p>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case "hospital-stats":
        return <HospitalStats patients={patients} payments={payments} />

      case "departments":
        return <DepartmentManagement patients={patients} />

      case "consultation-center":
        return currentUser ? (
          <ConsultationMenu
            waitingPatients={waitingConsultations}
            hospitalizedPatients={hospitalizedPatients}
            allPatients={patients}
            currentUser={currentUser}
            onStartConsultation={handleStartConsultation}
            onViewPatient={handlePatientSelect}
          />
        ) : null

      case "patients-overview":
        return <PatientsOverview patients={patients} onViewPatient={handlePatientSelect} />

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Module en développement</h2>
            <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {currentUser && (
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={currentUser.role}
          department={currentUser.department}
        />
      )}
      <div className="flex-1 flex flex-col">
        {currentUser && <Header user={currentUser} onLogout={handleLogout} />}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
