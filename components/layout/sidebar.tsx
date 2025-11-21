"use client"

import { useState } from "react"
import {
  Users,
  Calendar,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  QrCode,
  UserPlus,
  Clock,
  TrendingUp,
  Building2,
  Stethoscope,
  ClipboardList,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole: string
  department?: string
}

export function Sidebar({ activeTab, onTabChange, userRole, department }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const getMenuItems = () => {
    switch (userRole) {
      case "doctor":
        return [
          { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
          { id: "consultation-center", label: "Centre Consultation", icon: Stethoscope },
          { id: "patients", label: "Tous les Patients", icon: Users },
          { id: "qr-scanner", label: "Scanner QR", icon: QrCode },
          { id: "settings", label: "Paramètres", icon: Settings },
        ]
      case "hr":
        return [
          { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
          { id: "hospital-stats", label: "Statistiques Hôpital", icon: TrendingUp },
          { id: "departments", label: "Départements", icon: Building2 },
          { id: "staff-management", label: "Gestion Personnel", icon: Users },
          { id: "patients-overview", label: "Dossiers Patients", icon: ClipboardList },
          { id: "reports", label: "Rapports RH", icon: FileText },
          { id: "settings", label: "Paramètres", icon: Settings },
        ]
      case "reception":
        return [
          { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
          { id: "patient-registration", label: "Enregistrement", icon: UserPlus },
          { id: "payment-queue", label: "File Paiement", icon: Clock },
          { id: "patients", label: "Patients", icon: Users },
          { id: "appointments", label: "Rendez-vous", icon: Calendar },
        ]
      case "cashier":
        return [
          { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
          { id: "payment-processing", label: "Traitement Paiements", icon: CreditCard },
          { id: "daily-summary", label: "Résumé Journalier", icon: TrendingUp },
          { id: "consultation-queues", label: "Files Consultation", icon: Clock },
          { id: "payment-history", label: "Historique", icon: FileText },
        ]
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Medi+" className="w-8 h-8" />
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-medical bg-clip-text text-transparent">Medi+</h1>
              <p className="text-xs text-gray-500">
                {userRole === "doctor" && `Dr. ${department}`}
                {userRole === "hr" && "Ressources Humaines"}
                {userRole === "reception" && "Réception"}
                {userRole === "cashier" && "Caisse"}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                activeTab === item.id && "bg-gradient-medical text-white hover:bg-gradient-medical",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="w-full">
          {collapsed ? "→" : "←"}
        </Button>
      </div>
    </div>
  )
}
