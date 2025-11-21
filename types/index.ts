export interface Patient {
  id: string
  qrCode: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "M" | "F"
  phone: string
  email: string
  address: string
  emergencyContacts: EmergencyContact[]
  medicalHistory: MedicalRecord[]
  allergies: string[]
  chronicConditions: string[]
  currentMedications: string[]
  isHospitalized: boolean
  hospitalRoom?: string
  admissionDate?: string
  status: "registered" | "waiting_payment" | "waiting_consultation" | "in_consultation" | "completed" | "hospitalized"
  department?: string
  consultationType?: string
  registrationDate: string
  paymentStatus: "pending" | "paid" | "cancelled"
  paymentAmount?: number
  paymentDate?: string
  priority: "normal" | "urgent" | "emergency"
  labResults?: LabResult[]
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  date: string
  type: "consultation" | "emergency" | "follow-up" | "hospitalization" | "lab_test"
  diagnosis: string
  symptoms: string[]
  treatment: string
  prescription?: Prescription
  notes: string
  department: string
  vitalSigns?: VitalSigns
  followUpDate?: string
  labResults?: LabResult[]
}

export interface VitalSigns {
  temperature?: number
  bloodPressure?: string
  heartRate?: number
  oxygenSaturation?: number
  weight?: number
  height?: number
  notes?: string
}

export interface LabResult {
  id: string
  patientId: string
  date: string
  type: "blood_test" | "urine_test" | "electrophoresis" | "imaging" | "other"
  name: string
  results: LabValue[]
  status: "pending" | "completed" | "reviewed"
  requestedBy: string
  reviewedBy?: string
  notes?: string
}

export interface LabValue {
  name: string
  value: string | number
  unit?: string
  normalRange?: string
  isAbnormal?: boolean
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  doctorName?: string
  date: string
  medications: Medication[]
  instructions: string
  department: string
  validUntil?: string
  printed: boolean
  dispensed: boolean
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  category?: "antibiotique" | "antidouleur" | "anti-inflammatoire" | "autre"
}

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  role: "doctor" | "hr" | "reception" | "cashier"
  department?: string
  speciality?: string
}

export interface Payment {
  id: string
  patientId: string
  amount: number
  date: string
  time: string
  type: "consultation" | "procedure" | "medication" | "hospitalization"
  status: "paid" | "pending" | "cancelled"
  method: "cash" | "card" | "insurance"
  cashierId: string
  department: string
}

export interface Department {
  id: string
  name: string
  consultationPrice: number
  waitingPatients: string[]
  availableDoctors: string[]
  specialties: string[]
  color: string
}

export interface QueueItem {
  patientId: string
  timestamp: string
  priority: "normal" | "urgent" | "emergency"
  estimatedWaitTime: number
}
