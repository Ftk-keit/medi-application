"use client"

import { useState } from "react"
import { Building2, Euro, Plus, Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DEPARTMENTS } from "@/config/departments"
import type { Patient } from "@/types"

interface DepartmentManagementProps {
  patients: Patient[]
}

export function DepartmentManagement({ patients }: DepartmentManagementProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  const getDepartmentStats = (deptId: string) => {
    const deptPatients = patients.filter((p) => p.department === deptId)
    const waitingConsultation = deptPatients.filter((p) => p.status === "waiting_consultation").length
    const inConsultation = deptPatients.filter((p) => p.status === "in_consultation").length
    const hospitalized = deptPatients.filter((p) => p.isHospitalized).length
    const totalToday = deptPatients.filter(
      (p) => new Date(p.registrationDate).toDateString() === new Date().toDateString(),
    ).length

    return {
      waitingConsultation,
      inConsultation,
      hospitalized,
      totalToday,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Départements</h2>
        <Button className="bg-gradient-medical hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Département
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEPARTMENTS.map((dept) => {
          const stats = getDepartmentStats(dept.id)

          return (
            <Card key={dept.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: dept.color }}
                    title={`Couleur du département: ${dept.color}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-medical-green" />
                  <span className="font-semibold">{dept.consultationPrice}€</span>
                  <span className="text-sm text-gray-500">par consultation</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">{stats.waitingConsultation}</div>
                    <div className="text-xs text-blue-600">En attente</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">{stats.inConsultation}</div>
                    <div className="text-xs text-green-600">En consultation</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-lg font-bold text-red-600">{stats.hospitalized}</div>
                    <div className="text-xs text-red-600">Hospitalisés</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-600">{stats.totalToday}</div>
                    <div className="text-xs text-gray-600">Aujourd'hui</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Spécialités:</h4>
                  <div className="flex flex-wrap gap-1">
                    {dept.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {dept.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{dept.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tableau récapitulatif */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-medical-blue" />
            Vue d'ensemble des départements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Département</TableHead>
                <TableHead>Prix consultation</TableHead>
                <TableHead>En attente</TableHead>
                <TableHead>En consultation</TableHead>
                <TableHead>Hospitalisés</TableHead>
                <TableHead>Total aujourd'hui</TableHead>
                <TableHead>Spécialités</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEPARTMENTS.map((dept) => {
                const stats = getDepartmentStats(dept.id)

                return (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="font-medium">{dept.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{dept.consultationPrice}€</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {stats.waitingConsultation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {stats.inConsultation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {stats.hospitalized}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{stats.totalToday}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {dept.specialties.slice(0, 1).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {dept.specialties.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{dept.specialties.length - 1}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
