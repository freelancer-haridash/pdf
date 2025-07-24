"use client"

import { useState } from "react"
import { FileText, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfFile {
  id: string
  name: string
  title: string
  file: File
  thumbnail: string
  uploadDate: string
}

interface PdfTextExtractorProps {
  pdf: PdfFile
}

export default function PdfTextExtractor({ pdf }: PdfTextExtractorProps) {
  const [extractedText, setExtractedText] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)

  const extractText = async () => {
    try {
      setIsExtracting(true)

      // Dynamically import PDF.js
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

      const arrayBuffer = await pdf.file.arrayBuffer()
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ""

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum)
        const textContent = await page.getTextContent()

        const pageText = textContent.items.map((item: any) => item.str).join(" ")

        fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`
      }

      setExtractedText(fullText)
    } catch (error) {
      console.error("Error extracting text:", error)
      alert("Error extracting text from PDF")
    } finally {
      setIsExtracting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
    alert("Text copied to clipboard!")
  }

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${pdf.name.replace(".pdf", "")}_extracted_text.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Text Extraction
        </h3>
        <Button onClick={extractText} disabled={isExtracting}>
          {isExtracting ? "Extracting..." : "Extract Text"}
        </Button>
      </div>

      {extractedText && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={downloadText} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          <textarea
            value={extractedText}
            readOnly
            className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
            placeholder="Extracted text will appear here..."
          />
        </div>
      )}
    </div>
  )
}
