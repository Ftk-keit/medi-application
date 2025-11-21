import type { Department } from "@/types"

export const DEPARTMENTS: Department[] = [
  {
    id: "cardiology",
    name: "Cardiologie",
    consultationPrice: 80,
    waitingPatients: [],
    availableDoctors: ["dr.martin", "dr.dupont"],
    specialties: ["Cardiologie interventionnelle", "Électrophysiologie", "Insuffisance cardiaque"],
    color: "#E53E3E",
  },
  {
    id: "neurology",
    name: "Neurologie",
    consultationPrice: 90,
    waitingPatients: [],
    availableDoctors: ["dr.bernard", "dr.rousseau"],
    specialties: ["Neurologie générale", "Épilepsie", "Sclérose en plaques"],
    color: "#9F7AEA",
  },
  {
    id: "pediatrics",
    name: "Pédiatrie",
    consultationPrice: 60,
    waitingPatients: [],
    availableDoctors: ["dr.laurent", "dr.moreau"],
    specialties: ["Pédiatrie générale", "Néonatologie", "Pédiatrie d'urgence"],
    color: "#38B2AC",
  },
  {
    id: "maternity",
    name: "Maternité",
    consultationPrice: 70,
    waitingPatients: [],
    availableDoctors: ["dr.dubois", "dr.simon"],
    specialties: ["Obstétrique", "Gynécologie", "Médecine fœtale"],
    color: "#ED64A6",
  },
  {
    id: "orthopedics",
    name: "Orthopédie",
    consultationPrice: 75,
    waitingPatients: [],
    availableDoctors: ["dr.garcia", "dr.petit"],
    specialties: ["Chirurgie orthopédique", "Traumatologie", "Chirurgie de la main"],
    color: "#F56500",
  },
  {
    id: "dermatology",
    name: "Dermatologie",
    consultationPrice: 65,
    waitingPatients: [],
    availableDoctors: ["dr.roux", "dr.blanc"],
    specialties: ["Dermatologie générale", "Dermatologie esthétique", "Oncologie cutanée"],
    color: "#38A169",
  },
  {
    id: "emergency",
    name: "Urgences",
    consultationPrice: 120,
    waitingPatients: [],
    availableDoctors: ["dr.urgence1", "dr.urgence2"],
    specialties: ["Médecine d'urgence", "Réanimation", "SAMU"],
    color: "#E53E3E",
  },
  {
    id: "psychiatry",
    name: "Psychiatrie",
    consultationPrice: 85,
    waitingPatients: [],
    availableDoctors: ["dr.mental", "dr.psycho"],
    specialties: ["Psychiatrie générale", "Pédopsychiatrie", "Addictologie"],
    color: "#4299E1",
  },
  {
    id: "ophthalmology",
    name: "Ophtalmologie",
    consultationPrice: 70,
    waitingPatients: [],
    availableDoctors: ["dr.vision", "dr.oeil"],
    specialties: ["Ophtalmologie générale", "Chirurgie rétinienne", "Glaucome"],
    color: "#48BB78",
  },
]

export const getDepartmentById = (id: string): Department | undefined => {
  return DEPARTMENTS.find((dept) => dept.id === id)
}

export const getDepartmentName = (id: string): string => {
  const dept = getDepartmentById(id)
  return dept ? dept.name : id
}

export const getDepartmentColor = (id: string): string => {
  const dept = getDepartmentById(id)
  return dept ? dept.color : "#4A90E2"
}
