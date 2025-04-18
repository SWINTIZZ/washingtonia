"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Leaf,
  X,
  ShoppingBag,
  Mail,
  FileText,
  Users,
  Tractor,
  Phone,
  MapPin,
  User,
  Download,
  ArrowLeft,
  Star,
  Edit,
  Save,
  Plus,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedButton, SmallAnimatedButton } from "@/components/animated-buttons"
import TractorAnimation from "@/components/tractor-animation"
import EnvelopeAnimation from "@/components/envelope-animation"
import ShoppingBagAnimation from "@/components/shopping-bag-animation"
import { useSearchParams } from "next/navigation"

// Type pour les produits
interface Product {
  id: number
  title: string
  description: string
  price: string
  image: string
  quantity?: number
  longDescription?: string
  origin?: string
  certification?: string
  rating?: number
}

export default function Home() {
  const searchParams = useSearchParams()
  const adminToken = searchParams.get("adminToken")
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showAddProductForm, setShowAddProductForm] = useState(false)

  const [activeSection, setActiveSection] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showNavBar, setShowNavBar] = useState(true)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [productForDetails, setProductForDetails] = useState<Product | null>(null)

  // État pour stocker les textes éditables
  const [editableTexts, setEditableTexts] = useState({
    heroTitle: "Washingtonia",
    heroSubtitle:
      "Votre partenaire spécialisé dans le conseil agricole, la commercialisation de produits et la prestation de services agricoles de qualité.",
    welcomeTitle: "Bienvenue chez Washingtonia",
    welcomeText: "Cliquez sur l'un des boutons ci-dessus pour découvrir nos services, produits et plus encore.",
  })

  // État pour le nouveau produit
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    price: "",
    image: "/placeholder.svg?height=300&width=400",
    longDescription: "",
    origin: "",
    certification: "",
    rating: 5,
  })

  // Vérifier si l'utilisateur est un administrateur
  useEffect(() => {
    // Dans un cas réel, vous utiliseriez une authentification sécurisée
    // Ici, nous utilisons simplement un token dans l'URL pour la démonstration
    if (adminToken === "admin123") {
      setIsAdmin(true)
    }
  }, [adminToken])

  // Scroll to content when section changes
  useEffect(() => {
    if (activeSection && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeSection])

  // Fonction pour ajouter un produit au panier
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      // Vérifier si le produit est déjà dans le panier
      const existingProductIndex = prev.findIndex((item) => item.id === product.id)

      if (existingProductIndex >= 0) {
        // Si le produit existe déjà, augmenter la quantité
        const updatedCart = [...prev]
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: (updatedCart[existingProductIndex].quantity || 1) + 1,
        }
        return updatedCart
      } else {
        // Sinon, ajouter le nouveau produit avec quantité 1
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  // Fonction pour supprimer un produit du panier
  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  // Fonction pour ouvrir le formulaire de commande
  const openCheckoutForm = (product: Product) => {
    setSelectedProduct(product)
    setShowCheckoutForm(true)
    setShowNavBar(false) // Masquer la barre de navigation
  }

  // Fonction pour ouvrir les détails du produit
  const openProductDetails = (product: Product) => {
    setProductForDetails(product)
    setShowProductDetails(true)
    setShowNavBar(false) // Masquer la barre de navigation
  }

  // Fonction pour télécharger le PDF du produit
  const downloadProductPDF = (product: Product) => {
    // Créer un élément a temporaire pour simuler le téléchargement
    const link = document.createElement("a")
    link.href = `/api/generate-pdf?productId=${product.id}`
    link.setAttribute("download", `${product.title.replace(/\s+/g, "-").toLowerCase()}-fiche-produit.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Dans un cas réel, vous pourriez avoir une API qui génère le PDF ou un lien vers un PDF stocké
    alert(`Le PDF pour ${product.title} sera téléchargé.`)
  }

  // Calculer le total du panier
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number.parseInt(item.price.replace(/[^\d]/g, ""))
      return total + price * (item.quantity || 1)
    }, 0)
  }

  // Fonction pour mettre à jour un champ du nouveau produit
  const handleNewProductChange = (field: keyof typeof newProduct, value: string | number) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Fonction pour ajouter un nouveau produit
  const handleAddProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
    const productToAdd = {
      id: newId,
      ...newProduct,
    }

    // Dans un cas réel, vous enverriez ces données à une API
    // Ici, nous mettons simplement à jour l'état local
    setProducts([...products, productToAdd])

    // Réinitialiser le formulaire
    setNewProduct({
      title: "",
      description: "",
      price: "",
      image: "/placeholder.svg?height=300&width=400",
      longDescription: "",
      origin: "",
      certification: "",
      rating: 5,
    })

    setShowAddProductForm(false)
    alert("Produit ajouté avec succès!")
  }

  // Fonction pour se déconnecter du mode admin
  const handleLogout = () => {
    setIsAdmin(false)
    setEditMode(false)
    setShowAdminPanel(false)

    // Rediriger vers la même page sans le token admin
    window.location.href = window.location.pathname
  }

  // Liste des produits avec informations détaillées
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: "Fruits & Légumes Bio",
      description: "Produits frais certifiés biologiques, cultivés sans pesticides ni engrais chimiques.",
      price: "80 DH",
      image: "/placeholder.svg?height=300&width=400",
      longDescription:
        "Nos fruits et légumes biologiques sont cultivés selon des méthodes respectueuses de l'environnement, sans utilisation de pesticides ou d'engrais chimiques. Récoltés à maturité optimale, ils vous garantissent une fraîcheur et une saveur incomparables. Chaque produit est soigneusement sélectionné pour sa qualité et sa fraîcheur, vous offrant ainsi le meilleur de l'agriculture biologique marocaine.",
      origin: "Régions agricoles du Maroc",
      certification: "Certification Bio Maroc",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Huile d'Olive Extra Vierge",
      description: "Huile d'olive pressée à froid, riche en antioxydants et au goût authentique.",
      price: "120 DH",
      image: "/placeholder.svg?height=300&width=400",
      longDescription:
        "Notre huile d'olive extra vierge est obtenue par première pression à froid d'olives soigneusement sélectionnées dans les oliveraies traditionnelles du Maroc. Cette méthode d'extraction préserve toutes les qualités nutritionnelles et organoleptiques de l'huile. Avec son goût fruité et sa légère amertume caractéristique, elle sublimera tous vos plats. Riche en antioxydants et en acides gras mono-insaturés, elle contribue à une alimentation saine et équilibrée.",
      origin: "Oliveraies de l'Atlas",
      certification: "AOC Huile d'Olive du Maroc",
      rating: 5.0,
    },
    {
      id: 3,
      title: "Miel de Fleurs Sauvages",
      description: "Miel 100% naturel, récolté dans les régions préservées de l'Atlas.",
      price: "150 DH",
      image: "/placeholder.svg?height=300&width=400",
      longDescription:
        "Notre miel de fleurs sauvages est récolté dans les régions préservées de l'Atlas marocain, où les abeilles butinent une grande diversité de fleurs sauvages. Ce miel 100% naturel et non pasteurisé conserve toutes ses propriétés nutritionnelles et médicinales. Sa texture onctueuse et son goût riche et complexe en font un produit d'exception. Chaque pot raconte l'histoire d'un terroir unique et d'un savoir-faire apicole traditionnel transmis de génération en génération.",
      origin: "Montagnes de l'Atlas",
      certification: "Produit Naturel du Terroir",
      rating: 4.9,
    },
  ])

  // Composant pour le texte éditable
  const EditableText = ({
    value,
    onChange,
    isTitle = false,
    className = "",
  }: {
    value: string
    onChange: (value: string) => void
    isTitle?: boolean
    className?: string
  }) => {
    if (editMode) {
      return isTitle ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-white/80 border border-emerald-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-white/80 border border-emerald-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
          rows={3}
        />
      )
    }

    return isTitle ? <h1 className={className}>{value}</h1> : <p className={className}>{value}</p>
  }

  const sections = [
    {
      id: "about",
      title: "À Propos",
      icon: <Leaf className="h-8 w-8" />,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      hoverColor: "hover:bg-emerald-600",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6 text-emerald-600">Notre Histoire</h2>
            <p className="mb-4">
              Fondée en 2010, Washingtonia est née de la passion de ses fondateurs pour l'agriculture durable et
              l'innovation. Notre mission est d'accompagner les agriculteurs marocains dans leur transition vers des
              pratiques plus respectueuses de l'environnement tout en améliorant leur rentabilité.
            </p>
            <p className="mb-6">
              Aujourd'hui, notre équipe d'experts travaille avec passion pour promouvoir des pratiques agricoles
              durables et innovantes à travers tout le Maroc. Nous sommes fiers de contribuer au développement d'une
              agriculture plus responsable et économiquement viable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-emerald-500 hover:bg-emerald-600">Notre équipe</Button>
              <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50">
                Notre vision
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2 relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image src="/green.jpg" alt="L'équipe Washingtonia" fill className="object-cover" />
          </div>
        </div>
      ),
    },
    {
      id: "services",
      title: "Services",
      icon: <Tractor className="h-8 w-8" />,
      color: "bg-amber-500",
      textColor: "text-amber-500",
      hoverColor: "hover:bg-amber-600",
      content: (
        <div>
          <div className="mb-8">
            <TractorAnimation isActive={true} />
          </div>

          <h2 className="text-3xl font-bold mb-6 text-amber-600">Nos Services</h2>
          <p className="mb-8 max-w-3xl">
            Washingtonia propose une gamme complète de services agricoles pour répondre aux besoins spécifiques des
            agriculteurs et des entreprises du secteur agricole au Maroc.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Conseil Technique",
                description:
                  "Notre équipe d'experts vous accompagne pour optimiser vos cultures et améliorer vos rendements grâce à des conseils personnalisés.",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Mécanisation Agricole",
                description:
                  "Nous proposons des services de travaux agricoles avec des équipements modernes et performants pour optimiser votre production.",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Formation",
                description:
                  "Nos programmes de formation vous permettent d'acquérir les compétences nécessaires pour mettre en œuvre des techniques agricoles innovantes.",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Études & Analyses",
                description:
                  "Nous réalisons des analyses de sol, des études de faisabilité et des diagnostics agricoles complets pour vous aider à prendre les meilleures décisions.",
                image: "/placeholder.svg?height=300&width=400",
              },
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100 group">
                <div className="relative h-48">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-xl font-bold text-white p-4">{service.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="mb-4">{service.description}</p>
                  <Button className="bg-amber-500 hover:bg-amber-600 group-hover:translate-x-1 transition-transform">
                    En savoir plus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "products",
      title: "Produits",
      icon: <ShoppingBag className="h-8 w-8" />,
      color: "bg-rose-500",
      textColor: "text-rose-500",
      hoverColor: "hover:bg-rose-600",
      content: (
        <div>
          <div className="mb-8">
            <ShoppingBagAnimation isActive={true} />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-rose-600">Nos Produits</h2>
            {isAdmin && (
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2"
                onClick={() => setShowAddProductForm(true)}
              >
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            )}
          </div>

          <p className="mb-8 max-w-3xl">
            Washingtonia commercialise une sélection de produits agricoles de haute qualité, issus de pratiques
            respectueuses de l'environnement et soigneusement sélectionnés pour leur fraîcheur et leur saveur.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-rose-100"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative h-48 cursor-pointer" onClick={() => openProductDetails(product)}>
                  <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="bg-white/80 text-rose-600 px-3 py-1 rounded-full text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
                      Voir détails
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-md">
                      <Edit className="h-4 w-4 text-rose-600" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3
                    className="text-xl font-bold mb-2 text-rose-700 cursor-pointer hover:text-rose-500 transition-colors"
                    onClick={() => openProductDetails(product)}
                  >
                    {product.title}
                  </h3>
                  <p className="mb-3 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-rose-600">{product.price}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="bg-rose-500 hover:bg-rose-600 transition-all duration-300 group"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Ajouter
                    </Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => openCheckoutForm(product)}>
                      Acheter
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => downloadProductPDF(product)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Fiche produit (PDF)
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "blog",
      title: "Blog",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-violet-500",
      textColor: "text-violet-500",
      hoverColor: "hover:bg-violet-600",
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-violet-600">Notre Blog</h2>
          <p className="mb-8 max-w-3xl">
            Découvrez nos derniers articles, conseils pratiques et actualités sur l'agriculture durable et les
            innovations du secteur agricole au Maroc.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Les meilleures pratiques pour une agriculture durable",
                excerpt:
                  "Découvrez comment mettre en place des pratiques agricoles respectueuses de l'environnement tout en maintenant une bonne rentabilité.",
                date: "15 avril 2023",
                image: "/placeholder.svg?height=300&width=500",
                category: "Agriculture Durable",
              },
              {
                title: "L'impact du changement climatique sur l'agriculture au Maroc",
                excerpt:
                  "Analyse des défis posés par le changement climatique pour les agriculteurs marocains et les solutions d'adaptation possibles.",
                date: "28 mars 2023",
                image: "/placeholder.svg?height=300&width=500",
                category: "Climat",
              },
            ].map((article, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-violet-100 group">
                <div className="relative h-48">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </div>
                  {isAdmin && (
                    <div className="absolute top-4 right-4 bg-white/90 rounded-full p-1.5 shadow-md">
                      <Edit className="h-4 w-4 text-violet-600" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                  <h3 className="text-xl font-bold mb-3 text-violet-700">{article.title}</h3>
                  <p className="mb-4">{article.excerpt}</p>
                  <Button variant="outline" className="border-violet-500 text-violet-700 hover:bg-violet-50">
                    Lire l'article
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      icon: <Mail className="h-8 w-8" />,
      color: "bg-teal-500",
      textColor: "text-teal-500",
      hoverColor: "hover:bg-teal-600",
      content: (
        <div>
          <div className="mb-8">
            <EnvelopeAnimation isActive={true} />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-teal-600">Contactez-nous</h2>
              <p className="mb-6">
                Vous avez des questions ou souhaitez en savoir plus sur nos services ? N'hésitez pas à nous contacter,
                notre équipe se fera un plaisir de vous répondre.
              </p>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100 mb-6">
                <h3 className="text-xl font-bold mb-4 text-teal-700">Nos Coordonnées</h3>
                <div className="space-y-3">
                  <p>
                    <strong>Adresse:</strong> 123 Avenue Mohammed V, Rabat, Maroc
                  </p>
                  <p>
                    <strong>Téléphone:</strong> +212 5XX XX XX XX
                  </p>
                  <p>
                    <strong>Email:</strong> contact@washingtonia.ma
                  </p>
                  <p>
                    <strong>Horaires:</strong> Lundi au Vendredi, 9h-18h
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-teal-100 h-64 relative overflow-hidden">
                <Image src="/placeholder.svg?height=300&width=600" alt="Carte" fill className="object-cover" />
              </div>
            </div>

            <form className="bg-white p-6 rounded-xl shadow-sm border border-teal-100 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Votre email"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Sujet de votre message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Votre message"
                />
              </div>
              <Button className="w-full bg-teal-500 hover:bg-teal-600">Envoyer</Button>
            </form>
          </div>
        </div>
      ),
    },
    {
      id: "partners",
      title: "Partenaires",
      icon: <Users className="h-8 w-8" />,
      color: "bg-sky-500",
      textColor: "text-sky-500",
      hoverColor: "hover:bg-sky-600",
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-sky-600">Nos Partenaires</h2>
          <p className="mb-8 max-w-3xl">
            Washingtonia collabore avec un réseau de partenaires de confiance pour offrir des solutions complètes et
            innovantes à nos clients.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((partner) => (
              <motion.div
                key={partner}
                className="bg-white p-6 rounded-xl shadow-sm border border-sky-100 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={`/placeholder.svg?height=100&width=200&text=Partenaire ${partner}`}
                    alt={`Partenaire ${partner}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button className="bg-sky-500 hover:bg-sky-600">Devenir partenaire</Button>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-white pb-32">
        {/* Admin Panel */}
        {isAdmin && (
          <>
            <div className="fixed top-6 left-6 z-50 flex gap-2">
              <Button
                className={`${editMode ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"} rounded-full p-3 h-auto shadow-lg`}
                onClick={() => setEditMode(!editMode)}
                title={editMode ? "Désactiver le mode édition" : "Activer le mode édition"}
              >
                {editMode ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
              </Button>

              <Button
                className="bg-violet-500 hover:bg-violet-600 rounded-full p-3 h-auto shadow-lg"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                title="Panneau d'administration"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            {/* Admin Status Indicator */}
            <div className="fixed bottom-24 left-6 z-40 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-emerald-200 px-3 py-1.5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">Mode Admin</span>
            </div>
          </>
        )}

        {/* Admin Panel Modal */}
        <AnimatePresence>
          {showAdminPanel && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminPanel(false)}
            >
              <motion.div
                className="bg-white rounded-xl max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-violet-600 flex items-center gap-2">
                      <Settings className="h-6 w-6" />
                      Panneau d'administration
                    </h2>
                    <button
                      onClick={() => setShowAdminPanel(false)}
                      className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Edit className="h-5 w-5 text-violet-500" />
                        <span>Mode édition</span>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${editMode ? "bg-emerald-500" : "bg-gray-300"}`}
                        onClick={() => setEditMode(!editMode)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editMode ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </div>

                    <Button
                      className="w-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Product Form Modal */}
        <AnimatePresence>
          {showAddProductForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProductForm(false)}
            >
              <motion.div
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                      <Plus className="h-6 w-6" />
                      Ajouter un nouveau produit
                    </h2>
                    <button
                      onClick={() => setShowAddProductForm(false)}
                      className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleAddProduct()
                    }}
                  >
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Titre du produit
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={newProduct.title}
                        onChange={(e) => handleNewProductChange("title", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Titre du produit"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description courte
                      </label>
                      <textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => handleNewProductChange("description", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Description courte du produit"
                        rows={2}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="longDescription" className="block text-sm font-medium mb-1">
                        Description détaillée
                      </label>
                      <textarea
                        id="longDescription"
                        value={newProduct.longDescription}
                        onChange={(e) => handleNewProductChange("longDescription", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Description détaillée du produit"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium mb-1">
                          Prix
                        </label>
                        <input
                          type="text"
                          id="price"
                          value={newProduct.price}
                          onChange={(e) => handleNewProductChange("price", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Ex: 100 DH"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium mb-1">
                          Note (1-5)
                        </label>
                        <input
                          type="number"
                          id="rating"
                          value={newProduct.rating}
                          onChange={(e) => handleNewProductChange("rating", Number.parseFloat(e.target.value))}
                          min="1"
                          max="5"
                          step="0.1"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="origin" className="block text-sm font-medium mb-1">
                          Origine
                        </label>
                        <input
                          type="text"
                          id="origin"
                          value={newProduct.origin}
                          onChange={(e) => handleNewProductChange("origin", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Origine du produit"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="certification" className="block text-sm font-medium mb-1">
                          Certification
                        </label>
                        <input
                          type="text"
                          id="certification"
                          value={newProduct.certification}
                          onChange={(e) => handleNewProductChange("certification", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Certification du produit"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium mb-1">
                        URL de l'image
                      </label>
                      <input
                        type="text"
                        id="image"
                        value={newProduct.image}
                        onChange={(e) => handleNewProductChange("image", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="URL de l'image"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Utilisez "/placeholder.svg?height=300&width=400" pour une image de placeholder
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
                        Ajouter le produit
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section with Logo */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <Image src="/green.jpg" alt="Agriculture durable" fill className="object-cover opacity-70" priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          <div className="container mx-auto px-4 relative z-10 text-white text-center">
            <motion.div
              className="flex items-center justify-center gap-3 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Leaf className="h-12 w-12 text-emerald-400" />
              <EditableText
                value={editableTexts.heroTitle}
                onChange={(value) => setEditableTexts({ ...editableTexts, heroTitle: value })}
                isTitle={true}
                className="text-4xl md:text-6xl font-bold"
              />
            </motion.div>
            <motion.div
              className="text-xl max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <EditableText
                value={editableTexts.heroSubtitle}
                onChange={(value) => setEditableTexts({ ...editableTexts, heroSubtitle: value })}
                className="text-xl"
              />
            </motion.div>

            {/* Animated Navigation Buttons */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {sections.map((section) => (
                <AnimatedButton
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  color={section.color}
                  hoverColor={section.hoverColor}
                  textColor={section.textColor}
                  icon={section.icon}
                  onClick={setActiveSection}
                  isActive={activeSection === section.id}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Content Display Area */}
        <div ref={contentRef} className="py-16">
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              {activeSection && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-md p-8 relative"
                >
                  <button
                    onClick={() => setActiveSection(null)}
                    className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  {sections.find((section) => section.id === activeSection)?.content}
                </motion.div>
              )}
            </AnimatePresence>

            {/* If no section is active, show a welcome message */}
            {!activeSection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto"
              >
                <h2 className="text-3xl font-bold mb-6">
                  <EditableText
                    value={editableTexts.welcomeTitle}
                    onChange={(value) => setEditableTexts({ ...editableTexts, welcomeTitle: value })}
                    isTitle={true}
                    className="text-3xl font-bold"
                  />
                </h2>
                <div className="text-lg mb-8">
                  <EditableText
                    value={editableTexts.welcomeText}
                    onChange={(value) => setEditableTexts({ ...editableTexts, welcomeText: value })}
                    className="text-lg"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                    <h3 className="text-xl font-bold mb-3 text-emerald-600">Notre Expertise</h3>
                    <p>
                      Plus de 10 ans d'expérience dans le conseil agricole et l'accompagnement des agriculteurs
                      marocains.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
                    <h3 className="text-xl font-bold mb-3 text-amber-600">Nos Engagements</h3>
                    <p>
                      Qualité, innovation et durabilité sont au cœur de notre approche pour une agriculture responsable.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
                    <h3 className="text-xl font-bold mb-3 text-teal-600">Notre Vision</h3>
                    <p>
                      Contribuer à une agriculture marocaine plus durable, productive et respectueuse de
                      l'environnement.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bouton Panier */}
        <motion.div
          className="fixed top-6 right-6 z-50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className="bg-rose-500 hover:bg-rose-600 rounded-full p-3 h-auto relative shadow-lg"
            onClick={() => setShowCart(true)}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-rose-600 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold border-2 border-rose-500">
                {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}
              </span>
            )}
          </Button>
        </motion.div>

        {/* Modal Panier */}
        <AnimatePresence>
          {showCart && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
            >
              <motion.div
                className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-rose-600 flex items-center gap-2">
                      <ShoppingBag className="h-6 w-6" />
                      Mon Panier
                    </h2>
                    <button
                      onClick={() => setShowCart(false)}
                      className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Votre panier est vide</p>
                      <Button
                        className="mt-4 bg-rose-500 hover:bg-rose-600"
                        onClick={() => {
                          setShowCart(false)
                          setActiveSection("products")
                        }}
                      >
                        Découvrir nos produits
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cartItems.map((item, index) => (
                          <div key={index} className="flex gap-4 border-b pb-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-gray-500">Quantité: {item.quantity || 1}</p>
                              <p className="font-medium text-rose-600">{item.price}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="self-center p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                              aria-label="Supprimer du panier"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg mb-4">
                          <span>Total:</span>
                          <span>{calculateTotal()} DH</span>
                        </div>
                        <Button
                          className="w-full bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => {
                            setShowCart(false)
                            setShowCheckoutForm(true)
                            setShowNavBar(false) // Masquer la barre de navigation
                          }}
                        >
                          Passer la commande
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulaire de commande */}
        <AnimatePresence>
          {showCheckoutForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowCheckoutForm(false)
                setShowNavBar(true) // Réafficher la barre de navigation
              }}
            >
              <motion.div
                className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-600">Formulaire de commande</h2>
                    <button
                      onClick={() => {
                        setShowCheckoutForm(false)
                        setShowNavBar(true) // Réafficher la barre de navigation
                      }}
                      className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form className="space-y-4">
                    {selectedProduct && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium mb-2">Produit sélectionné:</h3>
                        <div className="flex gap-4 items-center">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={selectedProduct.image || "/placeholder.svg"}
                              alt={selectedProduct.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{selectedProduct.title}</p>
                            <p className="text-emerald-600 font-bold">{selectedProduct.price}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                          <User className="h-4 w-4 inline mr-1" />
                          Nom
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                          <User className="h-4 w-4 inline mr-1" />
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Votre prénom"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Votre numéro de téléphone"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-1">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Adresse de livraison
                      </label>
                      <textarea
                        id="address"
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Votre adresse complète"
                        required
                      />
                    </div>

                    <div className="border-t pt-4 mt-6">
                      <div className="flex justify-between font-bold text-lg mb-4">
                        <span>Total à payer:</span>
                        <span className="text-emerald-600">
                          {selectedProduct ? selectedProduct.price : `${calculateTotal()} DH`}
                        </span>
                      </div>
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600 mb-4">Confirmer la commande</Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Détails du Produit */}
        <AnimatePresence>
          {showProductDetails && productForDetails && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowProductDetails(false)
                setShowNavBar(true)
              }}
            >
              <motion.div
                className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <button
                      onClick={() => {
                        setShowProductDetails(false)
                        setShowNavBar(true)
                      }}
                      className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span className="text-sm font-medium">Retour</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProductDetails(false)
                        setShowNavBar(true)
                      }}
                      className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                      <Image
                        src={productForDetails.image || "/placeholder.svg"}
                        alt={productForDetails.title}
                        fill
                        className="object-cover"
                      />
                      {isAdmin && (
                        <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-md">
                          <Edit className="h-4 w-4 text-rose-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-rose-700 mb-2">{productForDetails.title}</h2>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(productForDetails.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({productForDetails.rating})</span>
                      </div>
                      <p className="text-2xl font-bold text-rose-600 mb-4">{productForDetails.price}</p>
                      <div className="space-y-4 mb-6">
                        <div>
                          <h3 className="font-semibold text-gray-700">Description</h3>
                          <p className="text-gray-600">{productForDetails.longDescription}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-700">Origine</h3>
                            <p className="text-gray-600">{productForDetails.origin}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-700">Certification</h3>
                            <p className="text-gray-600">{productForDetails.certification}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          className="bg-rose-500 hover:bg-rose-600 transition-all duration-300 group"
                          onClick={() => {
                            addToCart(productForDetails)
                            setShowProductDetails(false)
                            setShowNavBar(true)
                          }}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          Ajouter au panier
                        </Button>
                        <Button
                          className="bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => {
                            setShowProductDetails(false)
                            openCheckoutForm(productForDetails)
                          }}
                        >
                          Acheter maintenant
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => downloadProductPDF(productForDetails)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger la fiche produit (PDF)
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showNavBar && (
          <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
            <motion.div
              className="flex gap-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              {sections.map((section) => (
                <SmallAnimatedButton
                  key={section.id}
                  id={section.id}
                  color={section.color}
                  textColor={section.textColor}
                  icon={section.icon}
                  onClick={setActiveSection}
                  isActive={activeSection === section.id}
                />
              ))}
            </motion.div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16 mb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="h-6 w-6 text-emerald-400" />
                  <span className="text-xl font-bold">Washingtonia</span>
                </div>
                <p className="text-gray-300 mb-4">
                  Votre partenaire spécialisé dans le conseil en agriculture, la commercialisation de produits et la
                  prestation de services agricoles de qualité.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button onClick={() => setActiveSection(section.id)} className="text-gray-300 hover:text-white">
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-gray-300">123 Avenue Mohammed V, Rabat, Maroc</li>
                  <li className="text-gray-300">+212 5XX XX XX XX</li>
                  <li className="text-gray-300">contact@washingtonia.ma</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white">
                    Facebook
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Twitter
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Instagram
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} Washingtonia. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </Suspense>
  )
}
