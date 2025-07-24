"use client"

import { useState } from "react"
import { FileText, Calendar, Trash2, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PdfFile {
  id: string
  name: string
  title: string
  file: File
  thumbnail: string
  uploadDate: string
}

interface PdfLibraryProps {
  pdfs: PdfFile[]
  onSelect: (pdf: PdfFile) => void
  onDelete: (pdfId: string) => void
}

export default function PdfLibrary({ pdfs, onSelect, onDelete }: PdfLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date">("date")

  const filteredPdfs = pdfs
    .filter(
      (pdf) =>
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title)
      }
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatFileSize = (file?: File) => {
    if (!file) return "Unknown size"

    const bytes = file.size
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (pdfs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No PDFs uploaded yet</h3>
        <p className="text-gray-600">Upload your first PDF to get started with your library</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">PDF Library ({pdfs.length})</h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search PDFs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "date")}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPdfs.map((pdf) => (
          <div key={pdf.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={pdf.thumbnail || "/placeholder.svg"}
                  alt={`${pdf.title} thumbnail`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 truncate" title={pdf.title}>
                  {pdf.title}
                </h3>

                <p className="text-sm text-gray-600 truncate" title={pdf.name}>
                  {pdf.name}
                </p>

                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(pdf.uploadDate)}
                </div>

                <div className="text-xs text-gray-500">{formatFileSize(pdf.file)}</div>
              </div>
            </div>

            <div className="px-4 pb-4 flex gap-2">
              <Button
                onClick={() => {
                  if (!pdf.file) {
                    alert("File not available. Please re-upload the PDF.")
                    return
                  }
                  onSelect(pdf)
                }}
                className="flex-1 text-sm"
                size="sm"
                disabled={!pdf.file}
              >
                <Eye className="h-3 w-3 mr-1" />
                {pdf.file ? "Read" : "Re-upload needed"}
              </Button>

              <Button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this PDF?")) {
                    onDelete(pdf.id)
                  }
                }}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
