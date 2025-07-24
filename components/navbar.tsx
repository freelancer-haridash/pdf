"use client"

import { useState } from "react"
import { Home, Upload, Library, Settings, Menu, X } from "lucide-react"

interface NavbarProps {
  onNavigate?: (section: string) => void
  activeSection?: string
}

export default function Navbar({ onNavigate, activeSection = "home" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Upload, label: "Upload", id: "upload" },
    { icon: Library, label: "Library", id: "library" },
    { icon: Settings, label: "Settings", id: "settings" },
  ]

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(sectionId)
    } else {
      // Fallback: scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  activeSection === item.id ? "bg-blue-700 text-white font-medium" : "hover:bg-blue-700"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md hover:bg-blue-700">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Right side info */}
          <div className="hidden md:block">
            <div className="text-sm text-blue-100">Navigate your PDF library</div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left ${
                    activeSection === item.id ? "bg-blue-700 text-white font-medium" : "hover:bg-blue-700"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
