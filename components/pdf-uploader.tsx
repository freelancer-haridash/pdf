"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfFile {
  id: string
  name: string
  title: string
  file: File
  thumbnail: string
  uploadDate: string
}

interface PdfUploaderProps {
  onUpload: (pdf: PdfFile) => void
}

export default function PdfUploader({ onUpload }: PdfUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise(async (resolve) => {
      const createFallbackThumbnail = () => {
        const canvas = document.createElement("canvas")
        canvas.width = 200
        canvas.height = 280
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Create a nice placeholder
          ctx.fillStyle = "#f8fafc"
          ctx.fillRect(0, 0, 200, 280)

          // Border
          ctx.strokeStyle = "#e2e8f0"
          ctx.lineWidth = 2
          ctx.strokeRect(1, 1, 198, 278)

          // PDF icon
          ctx.fillStyle = "#64748b"
          ctx.font = "bold 24px Arial"
          ctx.textAlign = "center"
          ctx.fillText("PDF", 100, 120)

          // File name
          ctx.font = "12px Arial"
          ctx.fillStyle = "#475569"
          const fileName = file.name.length > 20 ? file.name.substring(0, 17) + "..." : file.name
          ctx.fillText(fileName, 100, 160)

          // File size
          const fileSize = formatBytes(file.size)
          ctx.font = "10px Arial"
          ctx.fillStyle = "#94a3b8"
          ctx.fillText(fileSize, 100, 180)
        }

        return canvas.toDataURL()
      }

      // Try to generate real thumbnail
      try {
        let pdfjsLib: any = null

        try {
          pdfjsLib = await import("pdfjs-dist")
        } catch (importError) {
          console.warn("Could not import PDF.js, using fallback thumbnail")
          resolve(createFallbackThumbnail())
          return
        }

        // Check if getDocument exists
        if (!pdfjsLib || typeof pdfjsLib.getDocument !== "function") {
          if (pdfjsLib.default && typeof pdfjsLib.default.getDocument === "function") {
            pdfjsLib = pdfjsLib.default
          } else {
            console.warn("PDF.js getDocument not found, using fallback thumbnail")
            resolve(createFallbackThumbnail())
            return
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

        const arrayBuffer = await file.arrayBuffer()

        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          useWorkerFetch: false,
          isEvalSupported: false,
          useSystemFonts: true,
        })

        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)

        const viewport = page.getViewport({ scale: 0.5 })
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        canvas.height = viewport.height
        canvas.width = viewport.width

        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          }

          await page.render(renderContext).promise
          resolve(canvas.toDataURL())
          return
        }
      } catch (pdfError) {
        console.log("PDF.js thumbnail generation failed, using fallback:", pdfError)
      }

      // Use fallback thumbnail
      resolve(createFallbackThumbnail())
    })
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const extractTitle = async (file: File): Promise<string> => {
    try {
      let pdfjsLib: any = null

      try {
        pdfjsLib = await import("pdfjs-dist")
      } catch (importError) {
        console.warn("Could not import PDF.js for title extraction")
        return file.name
          .replace(/\.pdf$/i, "")
          .replace(/[-_]/g, " ")
          .trim()
      }

      // Check if getDocument exists
      if (!pdfjsLib || typeof pdfjsLib.getDocument !== "function") {
        if (pdfjsLib.default && typeof pdfjsLib.default.getDocument === "function") {
          pdfjsLib = pdfjsLib.default
        } else {
          return file.name
            .replace(/\.pdf$/i, "")
            .replace(/[-_]/g, " ")
            .trim()
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

      const arrayBuffer = await file.arrayBuffer()

      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      })

      const pdf = await loadingTask.promise
      const metadata = await pdf.getMetadata()

      // Try to get title from PDF metadata
      if (metadata.info && metadata.info.Title && metadata.info.Title.trim()) {
        return metadata.info.Title.trim()
      }

      // Fallback to cleaned filename
      return file.name
        .replace(/\.pdf$/i, "")
        .replace(/[-_]/g, " ")
        .trim()
    } catch (error) {
      console.error("Error extracting title:", error)
      return file.name
        .replace(/\.pdf$/i, "")
        .replace(/[-_]/g, " ")
        .trim()
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Basic file type check
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert(`${file.name} is not a PDF file`)
        continue
      }

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 50MB.`)
        continue
      }

      // Check if file is empty
      if (file.size === 0) {
        alert(`${file.name} is empty`)
        continue
      }

      try {
        // Process PDF
        const [thumbnail, title] = await Promise.all([generateThumbnail(file), extractTitle(file)])

        const pdfFile: PdfFile = {
          id: Date.now().toString() + i + Math.random().toString(36).substr(2, 9),
          name: file.name,
          title: title,
          file: file,
          thumbnail: thumbnail,
          uploadDate: new Date().toISOString(),
        }

        onUpload(pdfFile)
      } catch (error) {
        console.error("Error processing PDF:", error)
        alert(`Error processing ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    setIsUploading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="h-8 w-8 text-blue-600" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isUploading ? "Processing PDFs..." : "Upload PDF Files"}
            </h3>
            <p className="text-gray-600 mb-4">Drag and drop your PDF files here, or click to browse</p>
            <Button disabled={isUploading} className="mx-auto">
              <FileText className="h-4 w-4 mr-2" />
              {isUploading ? "Processing..." : "Choose Files"}
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            Supported format: PDF • Max file size: 50MB per file
            <br />
            Multiple files supported • Real PDF thumbnails when possible
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">
            Processing PDF files... Generating thumbnails and extracting metadata.
          </div>
        </div>
      )}
    </div>
  )
}
