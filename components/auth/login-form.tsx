"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginFormProps {
  onLogin: (username: string, password: string, role: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const demoUsers = [
    { username: "dr.sow", password: "doctor123", role: "doctor", name: "Dr. Amadou Sow - Médecin" },
    { username: "hr.diop", password: "hr123", role: "hr", name: "Fatou Diop - RH" },
    { username: "reception.ba", password: "reception123", role: "reception", name: "Aïssatou Ba - Réception" },
    { username: "cashier.ndiaye", password: "cashier123", role: "cashier", name: "Cheikh Ndiaye - Caisse" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simuler une vérification d'authentification
    setTimeout(() => {
      const user = demoUsers.find((u) => u.username === username && u.password === password)

      if (user) {
        onLogin(username, password, user.role)
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
        <CardDescription>Entrez vos identifiants pour accéder au système</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="username"
                placeholder="Entrez votre nom d'utilisateur"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
                <span className="sr-only">{showPassword ? "Masquer" : "Afficher"} le mot de passe</span>
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-medical" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="relative w-full mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Utilisateurs de démonstration</span>
          </div>
        </div>

        <div className="grid w-full gap-2">
          {demoUsers.map((user) => (
            <Button
              key={user.username}
              variant="outline"
              className="justify-start text-left bg-transparent"
              onClick={() => {
                setUsername(user.username)
                setPassword(user.password)
              }}
            >
              <User className="mr-2 h-4 w-4" />
              {user.name}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
