"use client"

import { useState } from "react"
import { Settings, Trash2, Download, Info, Shield, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfFile {
  id: string
  name: string
  title: string
  file: File
  thumbnail: string
  uploadDate: string
}

interface SettingsPanelProps {
  pdfs: PdfFile[]
  onClearAll: () => void
}

export default function SettingsPanel({ pdfs, onClearAll }: SettingsPanelProps) {
  const [theme, setTheme] = useState("light")
  const [autoSave, setAutoSave] = useState(true)
  const [showThumbnails, setShowThumbnails] = useState(true)

  const calculateStorageUsed = () => {
    const totalBytes = pdfs.reduce((total, pdf) => total + (pdf.file?.size || 0), 0)
    if (totalBytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(totalBytes) / Math.log(k))
    return Number.parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const exportLibraryData = () => {
    const libraryData = {
      pdfs: pdfs.map((pdf) => ({
        id: pdf.id,
        name: pdf.name,
        title: pdf.title,
        thumbnail: pdf.thumbnail,
        uploadDate: pdf.uploadDate,
      })),
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(libraryData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pdf-library-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all PDF data? This action cannot be undone.")) {
      onClearAll()
      alert("All PDF data has been cleared.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Settings className="h-8 w-8 mr-3" />
          Settings & Preferences
        </h2>
        <p className="text-lg text-gray-600">Manage your PDF reader settings and library data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Library Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-600" />
            Library Statistics
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total PDFs:</span>
              <span className="font-semibold">{pdfs.length}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Storage Used:</span>
              <span className="font-semibold">{calculateStorageUsed()}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Last Upload:</span>
              <span className="font-semibold">
                {pdfs.length > 0
                  ? new Date(Math.max(...pdfs.map((pdf) => new Date(pdf.uploadDate).getTime()))).toLocaleDateString()
                  : "Never"}
              </span>
            </div>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-purple-600" />
            Display Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-700">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-gray-700">Show Thumbnails:</label>
              <input
                type="checkbox"
                checked={showThumbnails}
                onChange={(e) => setShowThumbnails(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-gray-700">Auto-save Library:</label>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Data Management
          </h3>

          <div className="space-y-4">
            <Button
              onClick={exportLibraryData}
              className="w-full flex items-center justify-center bg-transparent"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Library Data
            </Button>

            <div className="text-sm text-gray-600">
              Export your library metadata as a JSON file for backup purposes.
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-red-600">
            <Trash2 className="h-5 w-5 mr-2" />
            Danger Zone
          </h3>

          <div className="space-y-4">
            <Button
              onClick={clearAllData}
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All PDF Data
            </Button>

            <div className="text-sm text-gray-600">
              This will permanently delete all uploaded PDFs and their metadata. This action cannot be undone.
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Privacy & Security
        </h4>
        <p className="text-blue-800 text-sm">
          All your PDF files are stored locally in your browser. No data is sent to external servers. Your files remain
          private and secure on your device. Clearing browser data will remove all uploaded PDFs.
        </p>
      </div>
    </div>
  )
}
