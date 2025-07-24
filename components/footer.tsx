"use client"

import { useState } from "react"
import { FileText, Github, Mail, Heart, X, HelpCircle, MessageCircle, Book, Shield } from "lucide-react"

export default function Footer() {
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const features = [
    "PDF Upload & Storage",
    "Custom PDF Reader",
    "Thumbnail Generation",
    "Search & Organization",
    "Zoom & Rotation",
  ]

  const faqs = [
    {
      question: "How are my PDF files stored?",
      answer:
        "All PDF files are stored locally in your browser. No files are uploaded to any server, ensuring complete privacy and security.",
    },
    {
      question: "What's the maximum file size I can upload?",
      answer: "You can upload PDF files up to 50MB in size. For larger files, consider compressing them first.",
    },
    {
      question: "Can I access my PDFs from different devices?",
      answer:
        "Since files are stored locally in your browser, they're only available on the device where you uploaded them.",
    },
    {
      question: "What happens if I clear my browser data?",
      answer:
        "Clearing browser data will remove all uploaded PDFs. We recommend exporting your library data as backup from Settings.",
    },
    {
      question: "Does the PDF reader work offline?",
      answer: "Yes! Once loaded, the PDF reader works completely offline since all files are stored locally.",
    },
  ]

  const HelpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <HelpCircle className="h-6 w-6 mr-2 text-blue-600" />
              Help Center
            </h2>
            <button onClick={() => setShowHelpModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  1. <strong>Upload PDFs:</strong> Click "Upload" in the navbar or drag files to the upload area
                </p>
                <p>
                  2. <strong>View Library:</strong> Navigate to "Library" to see all your uploaded PDFs
                </p>
                <p>
                  3. <strong>Read PDFs:</strong> Click "Read" on any PDF to open it in the full-screen reader
                </p>
                <p>
                  4. <strong>Search:</strong> Use the search box to find specific PDFs or search within documents
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">PDF Reader Controls</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  • <strong>Navigation:</strong> Use arrow buttons or keyboard arrows to change pages
                </p>
                <p>
                  • <strong>Zoom:</strong> Click zoom buttons or use mouse wheel to zoom in/out
                </p>
                <p>
                  • <strong>Rotate:</strong> Click rotate button to rotate pages 90 degrees
                </p>
                <p>
                  • <strong>Search:</strong> Use the search box to find text within the PDF
                </p>
                <p>
                  • <strong>Download:</strong> Click download button to save the PDF file
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <kbd className="bg-gray-100 px-2 py-1 rounded">←</kbd> Previous page
                  </p>
                  <p>
                    <kbd className="bg-gray-100 px-2 py-1 rounded">→</kbd> Next page
                  </p>
                  <p>
                    <kbd className="bg-gray-100 px-2 py-1 rounded">Esc</kbd> Close reader
                  </p>
                </div>
                <div>
                  <p>
                    <kbd className="bg-gray-100 px-2 py-1 rounded">+</kbd> Zoom in
                  </p>
                  <p>
                    <kbd className="bg-gray-100 px-2 py-1 rounded">-</kbd> Zoom out
                  </p>
                  <p>
                    <kbd className="bg-gray-100 px-2 py-1 rounded">R</kbd> Rotate
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )

  const FAQModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-green-600" />
              Frequently Asked Questions
            </h2>
            <button onClick={() => setShowFAQModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Mail className="h-6 w-6 mr-2 text-purple-600" />
              Contact Us
            </h2>
            <button onClick={() => setShowContactModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get in Touch</h3>
              <p className="text-gray-600 mb-4">Have questions or feedback? We'd love to hear from you!</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">support@pdfreader.com</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Github className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">GitHub Issues</p>
                  <p className="text-sm text-gray-600">Report bugs or request features</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">Community Forum</p>
                  <p className="text-sm text-gray-600">Join discussions with other users</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const PrivacyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-600" />
              Privacy Policy
            </h2>
            <button onClick={() => setShowPrivacyModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6 text-gray-600">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Storage</h3>
              <p>
                PDF Reader Pro stores all your files locally in your browser using modern web storage APIs. No files are
                ever uploaded to external servers or cloud storage.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Protection</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Your PDF files never leave your device</li>
                <li>No user accounts or personal information required</li>
                <li>No tracking or analytics cookies</li>
                <li>No data sharing with third parties</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Local Storage</h3>
              <p>
                We use browser localStorage to save PDF metadata (titles, upload dates) for better user experience. This
                data remains on your device and can be cleared through browser settings or our Settings page.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Security</h3>
              <p>
                Since all processing happens locally in your browser, your documents are as secure as your device. We
                recommend keeping your browser and operating system updated for optimal security.
              </p>
            </section>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <p className="text-green-800 font-medium">
                🔒 Your privacy is our priority. This application is designed with privacy-first principles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">PDF Reader Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your personal PDF library and reader. Secure, fast, and easy to use.
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {features.map((feature, index) => (
                  <li key={index} className="hover:text-white transition-colors cursor-default">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => setShowHelpModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowFAQModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-3">
                <a
                  href="mailto:support@pdfreader.com"
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>support@pdfreader.com</span>
                </a>
                <a
                  href="#github"
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="#docs"
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Book className="h-4 w-4" />
                  <span>Documentation</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-400">© 2024 PDF Reader Pro. All rights reserved.</div>
            <div className="flex items-center space-x-1 text-sm text-gray-400 mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for PDF lovers</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showHelpModal && <HelpModal />}
      {showFAQModal && <FAQModal />}
      {showContactModal && <ContactModal />}
      {showPrivacyModal && <PrivacyModal />}
    </>
  )
}
