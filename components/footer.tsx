import Link from "next/link"
import { Leaf, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold">Washingtonia</span>
            </div>
            <p className="text-gray-600 mb-4">
              Votre partenaire spécialisé dans le conseil en agriculture, la commercialisation de produits 
              et la prestation de services agricoles de qualité.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-emerald-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-emerald-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-emerald-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-emerald-600">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-emerald-600">Accueil</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-emerald-600">À Propos</Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-emerald-600">Services</Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-emerald-600">Produits</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-emerald-600">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-emerald-600">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#conseil" className="text-gray-600 hover:text-emerald-600">Conseil Technique</Link>
              </li>
              <li>
                <Link href="/services#mecanisation" className="text-gray-600 hover:text-emerald-600">Mécanisation Agricole</Link>
              </li>
              <li>
                <Link href="/services#formation" className="text-gray-600 hover:text-emeral\
