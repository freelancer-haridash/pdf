"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, X, Menu, Search } from "lucide-react"
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

interface PdfReaderProps {
  pdf: PdfFile
  onClose: () => void
}

export default function PdfReader({ pdf, onClose }: PdfReaderProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [pageInput, setPageInput] = useState("1")
  const [renderError, setRenderError] = useState<string | null>(null)

  useEffect(() => {
    loadPdf()
  }, [pdf])

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage()
    }
  }, [pdfDoc, currentPage, zoom, rotation])

  useEffect(() => {
    setPageInput(currentPage.toString())
  }, [currentPage])

  const loadPdf = async () => {
    try {
      setIsLoading(true)
      setRenderError(null)

      // Try to load PDF.js with multiple fallback methods
      let pdfjsLib: any = null

      try {
        // Method 1: Try default import
        pdfjsLib = await import("pdfjs-dist")
      } catch (error) {
        console.error("Failed to import pdfjs-dist:", error)
        setRenderError("PDF.js library could not be loaded. Please refresh the page and try again.")
        setIsLoading(false)
        return
      }

      // Check if getDocument exists
      if (!pdfjsLib || typeof pdfjsLib.getDocument !== "function") {
        // Try accessing from default export
        if (pdfjsLib.default && typeof pdfjsLib.default.getDocument === "function") {
          pdfjsLib = pdfjsLib.default
        } else {
          throw new Error("PDF.js getDocument function not found")
        }
      }

      // Set worker source
      if (typeof window !== "undefined") {
        const workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

        try {
          if (pdfjsLib.GlobalWorkerOptions) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
          }
        } catch (workerError) {
          console.warn("Could not set worker source:", workerError)
        }
      }

      const arrayBuffer = await pdf.file.arrayBuffer()

      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      })

      const loadedPdf = await loadingTask.promise

      setPdfDoc(loadedPdf)
      setTotalPages(loadedPdf.numPages)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading PDF:", error)
      setRenderError(`Error loading PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
      setIsLoading(false)
    }
  }

  const renderPage = async () => {
    if (!pdfDoc || !canvasRef.current) return

    try {
      setRenderError(null)
      const page = await pdfDoc.getPage(currentPage)
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) {
        throw new Error("Could not get canvas context")
      }

      // Calculate viewport with zoom and rotation
      const viewport = page.getViewport({ scale: zoom, rotation: rotation })

      canvas.height = viewport.height
      canvas.width = viewport.width

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Render page
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }

      await page.render(renderContext).promise
    } catch (error) {
      console.error("Error rendering page:", error)
      setRenderError(`Error rendering page: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value)
  }

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = Number.parseInt(pageInput)
    if (!isNaN(page)) {
      goToPage(page)
    } else {
      setPageInput(currentPage.toString())
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleDownload = () => {
    const url = URL.createObjectURL(pdf.file)
    const a = document.createElement("a")
    a.href = url
    a.download = pdf.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const searchInPdf = async () => {
    if (!pdfDoc || !searchText.trim()) {
      setSearchResults([])
      return
    }

    try {
      const results = []

      for (let pageNum = 1; pageNum <= Math.min(totalPages, 50); pageNum++) {
        try {
          const page = await pdfDoc.getPage(pageNum)
          const textContent = await page.getTextContent()

          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ")
            .toLowerCase()

          if (pageText.includes(searchText.toLowerCase())) {
            results.push({
              page: pageNum,
              text: pageText.substring(0, 100) + "...",
            })
          }
        } catch (pageError) {
          console.error(`Error searching page ${pageNum}:`, pageError)
          continue
        }
      }

      setSearchResults(results)
    } catch (error) {
      console.error("Error searching PDF:", error)
      alert("Error searching PDF. Please try again.")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPage(currentPage - 1)
    } else if (e.key === "ArrowRight") {
      goToPage(currentPage + 1)
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  if (renderError) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg max-w-md mx-4">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading PDF</h2>
          <p className="text-gray-700 mb-4">{renderError}</p>
          <div className="flex space-x-4">
            <Button onClick={loadPdf} variant="outline">
              Try Again
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-gray-900 truncate max-w-md">{pdf.title}</h1>
            <p className="text-sm text-gray-600">{pdf.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search in PDF..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchInPdf()}
              className="w-48"
            />
            <Button onClick={searchInPdf} variant="ghost" size="sm" disabled={!pdfDoc}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
          <Button onClick={handleDownload} variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-64 bg-white border-r flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-2">Navigation</h3>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Pages */}
              <div className="p-4">
                <h4 className="font-medium mb-3">Pages ({totalPages})</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        currentPage === page ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100"
                      }`}
                    >
                      Page {page}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="p-4 border-t">
                  <h4 className="font-medium mb-3">Search Results ({searchResults.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => goToPage(result.page)}
                        className="w-full text-left p-2 rounded text-xs hover:bg-gray-100 border"
                      >
                        <div className="font-medium">Page {result.page}</div>
                        <div className="text-gray-600 truncate">{result.text}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
            <div className="flex items-center space-x-2">
              <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <form onSubmit={handlePageInputSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={pageInput}
                  onChange={handlePageInputChange}
                  className="w-16 px-2 py-1 text-sm border rounded text-center"
                  onBlur={() => setPageInput(currentPage.toString())}
                />
                <span className="text-sm text-gray-600">of {totalPages}</span>
              </form>

              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                variant="ghost"
                size="sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={handleZoomOut} variant="ghost" size="sm" disabled={zoom <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 min-w-[4rem] text-center">{Math.round(zoom * 100)}%</span>
              <Button onClick={handleZoomIn} variant="ghost" size="sm" disabled={zoom >= 3}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button onClick={handleRotate} variant="ghost" size="sm">
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-gray-200 p-4">
            <div className="flex justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                  <p className="text-sm text-gray-500">This may take a moment for large files</p>
                </div>
              ) : (
                <div className="bg-white shadow-lg">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto block"
                    style={{
                      cursor: "grab",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
