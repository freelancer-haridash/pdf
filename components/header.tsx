import { FileText, Upload, Library } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PDF Reader Pro</h1>
              <p className="text-sm text-gray-600">Your Personal PDF Library</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Library className="h-4 w-4" />
              <span>Library</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
