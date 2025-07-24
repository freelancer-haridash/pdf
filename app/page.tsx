"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PdfUploader from "@/components/pdf-uploader"
import PdfLibrary from "@/components/pdf-library"
import PdfReader from "@/components/pdf-reader"
import SettingsPanel from "@/components/settings-panel"
import { Upload, Library, Settings } from "lucide-react"

interface PdfFile {
  id: string
  name: string
  title: string
  file: File
  thumbnail: string
  uploadDate: string
}

export default function HomePage() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [selectedPdf, setSelectedPdf] = useState<PdfFile | null>(null)
  const [isReaderOpen, setIsReaderOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    // Load PDFs from localStorage on component mount
    const savedPdfs = localStorage.getItem("pdf-library")
    if (savedPdfs) {
      try {
        const parsedPdfs = JSON.parse(savedPdfs)
        console.log("Found saved PDF metadata:", parsedPdfs.length)
      } catch (error) {
        console.error("Error loading PDFs from localStorage:", error)
      }
    }
  }, [])

  const handlePdfUpload = (newPdf: PdfFile) => {
    const updatedPdfs = [...pdfs, newPdf]
    setPdfs(updatedPdfs)

    // Save only metadata to localStorage
    const pdfMetadata = updatedPdfs.map((pdf) => ({
      id: pdf.id,
      name: pdf.name,
      title: pdf.title,
      thumbnail: pdf.thumbnail,
      uploadDate: pdf.uploadDate,
    }))
    localStorage.setItem("pdf-library", JSON.stringify(pdfMetadata))

    // Auto-navigate to library after upload
    setActiveSection("library")
  }

  const handlePdfSelect = (pdf: PdfFile) => {
    setSelectedPdf(pdf)
    setIsReaderOpen(true)
  }

  const handleCloseReader = () => {
    setIsReaderOpen(false)
    setSelectedPdf(null)
  }

  const handleDeletePdf = (pdfId: string) => {
    const updatedPdfs = pdfs.filter((pdf) => pdf.id !== pdfId)
    setPdfs(updatedPdfs)

    const pdfMetadata = updatedPdfs.map((pdf) => ({
      id: pdf.id,
      name: pdf.name,
      title: pdf.title,
      thumbnail: pdf.thumbnail,
      uploadDate: pdf.uploadDate,
    }))
    localStorage.setItem("pdf-library", JSON.stringify(pdfMetadata))
  }

  const handleNavigation = (section: string) => {
    setActiveSection(section)

    // Scroll to section
    setTimeout(() => {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "upload":
        return (
          <div id="upload" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload PDF Files</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select or drag and drop your PDF files to add them to your library
              </p>
            </div>
            <PdfUploader onUpload={handlePdfUpload} />
          </div>
        )

      case "library":
        return (
          <div id="library" className="space-y-8">
            <PdfLibrary pdfs={pdfs} onSelect={handlePdfSelect} onDelete={handleDeletePdf} />
          </div>
        )

      case "settings":
        return (
          <div id="settings" className="space-y-8">
            <SettingsPanel
              pdfs={pdfs}
              onClearAll={() => {
                setPdfs([])
                localStorage.removeItem("pdf-library")
              }}
            />
          </div>
        )

      default: // home
        return (
          <div id="home" className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF Reader & Library</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Upload, organize, and read your PDF documents with our custom PDF reader. Your files are stored locally
                in your browser for privacy and security.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upload PDFs</h3>
                  <p className="text-gray-600 mb-4">Drag and drop or select PDF files to add to your library</p>
                  <button
                    onClick={() => handleNavigation("upload")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Start Uploading
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Library className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Manage Library</h3>
                  <p className="text-gray-600 mb-4">View, search, and organize your PDF collection</p>
                  <button
                    onClick={() => handleNavigation("library")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    View Library ({pdfs.length})
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Settings</h3>
                  <p className="text-gray-600 mb-4">Configure your PDF reader preferences and manage data</p>
                  <button
                    onClick={() => handleNavigation("settings")}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Open Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Navbar onNavigate={handleNavigation} activeSection={activeSection} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {!isReaderOpen ? renderContent() : selectedPdf && <PdfReader pdf={selectedPdf} onClose={handleCloseReader} />}
      </main>

      <Footer />
    </div>
  )
}
