import React from 'react';
import { Menu, X, Phone, Car, PenTool as Tools, ShoppingBag, MessageSquare, ChevronLeft, ChevronRight, X as Close, Search, Star, TrendingUp, Tag, Award, Filter, ChevronDown, Calendar, Sliders, Store, Heart } from 'lucide-react';

// Cart type definitions
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface VehiclePart {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  certification: string;
  images: string[];
  awards: string[];
  condition: string;
  category: string;
  specifications: {
    material: string;
    compatibility: string[];
    warranty: string;
  };
}

// New interfaces for search functionality
interface Vehicle {
  id: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
}

interface PartCategory {
  id: string;
  name: string;
  icon: string;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = React.useState<{ [key: string]: number }>({});
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const [lastAddedItem, setLastAddedItem] = React.useState<CartItem | null>(null);
  const [savedItems, setSavedItems] = React.useState<Set<string>>(new Set());
  
  // Enhanced search state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<VehiclePart[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);
  
  // Filter states
  const [selectedMake, setSelectedMake] = React.useState<string>('');
  const [selectedModel, setSelectedModel] = React.useState<string>('');
  const [selectedYear, setSelectedYear] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedCondition, setSelectedCondition] = React.useState<string>('');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 500000]);
  const [sortOption, setSortOption] = React.useState<string>('relevance');
  
  // Part detail view state
  const [selectedPart, setSelectedPart] = React.useState<VehiclePart | null>(null);
  const [showPartDetail, setShowPartDetail] = React.useState(false);

  // Product conditions
  const productConditions = ["New", "Used", "Refurbished"];

  // Categories data
  const partCategories: PartCategory[] = [
    { id: "1", name: "Engine Parts", icon: "https://lh3.googleusercontent.com/d/1mbcv9dHCvsewAaoYzY73DeKRJ_yZ-NX6=w800-h600?auto=format&fit=crop&q=80" },
    { id: "2", name: "Brake System", icon: "https://lh3.googleusercontent.com/d/13yvHMJlSrN-LhAcOXm13keeokq5yeehO=w800-h600?auto=format&fit=crop&q=80" },
    { id: "3", name: "Suspension", icon: "https://lh3.googleusercontent.com/d/1_AVLHElA9U39l0v_YcG1r9Gc1kw9iadX=w800-h600?auto=format&fit=crop&q=80" },
    { id: "4", name: "Electrical", icon: "https://lh3.googleusercontent.com/d/1eenF26i-szAFaLaa96GSoeMpjj4fJlzg=w800-h600?auto=format&fit=crop&q=80" },
    { id: "5", name: "Transmission", icon: "https://lh3.googleusercontent.com/d/1VkhKnk1y_CExRgKviyB4HrtPNJW3CuPq=w800-h600?auto=format&fit=crop&q=80" },
    { id: "6", name: "Cooling System", icon: "https://lh3.googleusercontent.com/d/1tSry-770CUeDcINQB19ElLMHytevIIto=w800-h600?auto=format&fit=crop&q=80" },
    { id: "7", name: "Fuel System", icon: "https://lh3.googleusercontent.com/d/1hHNHV3rcOgmT-i9uPfDKLLGzOuGpVCkN=w800-h600?auto=format&fit=crop&q=80" },
    { id: "8", name: "Exhaust System", icon: "https://lh3.googleusercontent.com/d/1pT12xnZdKA2KQHauK0y6l0h-Ltlhg8jZ=w800-h600?auto=format&fit=crop&q=80" }
  ];

  // Nigerian car makes and models
  const carMakes = [
    "Toyota", "Honda", "Volkswagen", "Range Rover", "Lexus", "Mercedes-Benz", 
    "Nissan", "Hyundai", "Kia", "Ford", "Mazda", "Chevrolet", "Mitsubishi", 
    "Peugeot", "BMW", "Audi", "Subaru", "Jeep"
  ];

  const carModels: { [key: string]: string[] } = {
    "Toyota": ["Corolla", "Camry", "Sienna", "Hilux", "Venza", "Highlander", "RAV4", "Prado", "Tacoma"],
    "Honda": ["Accord", "Civic", "Pilot", "CR-V"],
    "Volkswagen": ["Golf"],
    "Range Rover": ["Sport"],
    "Lexus": ["RX 350"],
    "Mercedes-Benz": ["G-Class"],
    "Nissan": ["Altima", "Pathfinder", "Frontier"],
    "Hyundai": ["Elantra", "Santa Fe", "Tucson"],
    "Kia": ["Rio", "Sportage", "Sorento"],
    "Ford": ["Explorer", "Edge", "Escape"],
    "Mazda": ["3", "CX-5", "6"],
    "Chevrolet": ["Cruze", "Equinox", "Malibu"],
    "Mitsubishi": ["Pajero"],
    "Peugeot": ["406"],
    "BMW": ["3 Series"],
    "Audi": ["A4"],
    "Subaru": ["Forester"],
    "Jeep": ["Grand Cherokee"]
  };

  // Years range
  const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => (2025 - i).toString());

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      role: "Car Enthusiast",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      content: "Found exactly what I needed for my Toyota Camry. The quality of parts and service is exceptional!",
      rating: 5
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Professional Mechanic",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      content: "As a mechanic, I rely on quality parts. This store never disappoints with their authentic products.",
      rating: 5
    },
    {
      id: 3,
      name: "Michael Smith",
      role: "Car Collector",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
      content: "The range of premium parts available here is impressive. Great for both vintage and modern cars.",
      rating: 4
    }
  ];

  // Special offers data
  const specialOffers = [
    {
      id: 1,
      title: "Flash Sales",
      discount: "25% OFF",
      description: "On all brake systems",
      endDate: "Limited time offer",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Bundle Deal",
      discount: "Save ₦50,000",
      description: "Engine maintenance kit",
      endDate: "While stocks last",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
    }
  ];

  // Vehicle parts data
  const vehicleParts: VehiclePart[] = [
    {
      id: "1",
      name: "Toyota Camry 2.4L Engine Control Module",
      price: 185000,
      description: "Premium Engine Control Module (ECM) specifically designed for Toyota Camry 2.4L engines. This OEM-grade module ensures optimal engine performance, fuel efficiency, and reliability.",
      features: [
        "Direct OEM replacement",
        "Pre-programmed for plug-and-play installation",
        "Advanced diagnostic capabilities",
        "Enhanced fuel management system",
        "Improved throttle response"
      ],
      certification: "ISO 9001:2015 Certified",
      images: [
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80"
      ],
      condition: "New",
      category: "Electrical",
      awards: [
        "2023 Best Aftermarket Part - AutoParts Nigeria",
        "Quality Excellence Award - Lagos Auto Show"
      ],
      specifications: {
        material: "High-grade automotive plastic with aluminum housing",
        compatibility: ["Toyota Camry 2002-2006", "Toyota Solara 2004-2008"],
        warranty: "2 Years Limited Warranty"
      }
    },
    {
      id: "2",
      name: "Honda Accord Brake Pad Set",
      price: 45000,
      description: "High-performance ceramic brake pad set engineered specifically for Honda Accord models. Delivers superior stopping power with minimal noise and dust.",
      features: [
        "Advanced ceramic compound",
        "Low dust formulation",
        "Noise reduction shims included",
        "Extended pad life",
        "Superior heat dissipation"
      ],
      certification: "TÜV Certified",
      images: [
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
      ],
      condition: "New",
      category: "Brake System",
      awards: [
        "Best Safety Product 2023 - Nigeria Auto Parts Association",
        "Consumer Choice Award - Auto Care Excellence"
      ],
      specifications: {
        material: "Advanced Ceramic Compound",
        compatibility: ["Honda Accord 2018-2023", "Honda CR-V 2017-2023"],
        warranty: "3 Years Limited Warranty"
      }
    },
    {
      id: "3",
      name: "Lexus RX350 Air Filter System",
      price: 28000,
      description: "Premium air filtration system designed for Lexus RX350, providing superior engine protection and optimal airflow performance.",
      features: [
        "Advanced filtration media",
        "Increased airflow efficiency",
        "Enhanced engine protection",
        "Easy installation design",
        "Washable and reusable"
      ],
      certification: "SAE J726 Certified",
      images: [
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
      ],
      condition: "Refurbished",
      category: "Engine Parts",
      awards: [
        "Environmental Choice Award 2023",
        "Innovation in Filtration - Auto Parts Expo Lagos"
      ],
      specifications: {
        material: "Multi-layer synthetic filter media",
        compatibility: ["Lexus RX350 2016-2023", "Toyota Highlander 2017-2023"],
        warranty: "Lifetime Limited Warranty"
      }
    },
    {
      id: "4",
      name: "Toyota Corolla Fuel Pump Assembly",
      price: 65000,
      description: "Complete fuel pump assembly for Toyota Corolla models. Ensures reliable fuel delivery and optimal engine performance.",
      features: [
        "OEM quality replacement",
        "Improved fuel pressure regulation",
        "Enhanced durability",
        "Quiet operation",
        "Complete assembly with all necessary components"
      ],
      certification: "ISO/TS 16949 Certified",
      images: [
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80"
      ],
      condition: "Used",
      category: "Fuel System",
      awards: [
        "Reliability Award 2023 - Auto Parts Nigeria",
        "Best Fuel System Component - Lagos Automotive Week"
      ],
      specifications: {
        material: "High-grade polymer with stainless steel components",
        compatibility: ["Toyota Corolla 2003-2018", "Toyota Matrix 2003-2014"],
        warranty: "18 Months Limited Warranty"
      }
    },
    {
      id: "5",
      name: "Mercedes-Benz G-Class Suspension Kit",
      price: 350000,
      description: "Premium suspension upgrade kit for Mercedes-Benz G-Class. Provides improved handling, stability, and ride comfort for both on and off-road driving.",
      features: [
        "Heavy-duty shock absorbers",
        "Progressive rate springs",
        "Reinforced bushings",
        "Adjustable ride height",
        "Enhanced load capacity"
      ],
      certification: "TÜV Rheinland Certified",
      images: [
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80"
      ],
      condition: "New",
      category: "Suspension",
      awards: [
        "Off-Road Excellence Award 2023",
        "Premium Aftermarket Component - Nigeria Auto Show"
      ],
      specifications: {
        material: "Aircraft-grade aluminum and high-tensile steel",
        compatibility: ["Mercedes-Benz G-Class 2010-2023"],
        warranty: "5 Years Limited Warranty"
      }
    }
  ];

  // Search functionality
  const handleSearch = () => {
    setIsSearching(true);
    
    let results = [...vehicleParts];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(part => 
        part.name.toLowerCase().includes(query) || 
        part.description.toLowerCase().includes(query)
      );
    }
    
    if (selectedMake) {
      results = results.filter(part => {
        const makeModelPattern = new RegExp(selectedMake, 'i');
        return makeModelPattern.test(part.name) || 
               part.specifications.compatibility.some(comp => makeModelPattern.test(comp));
      });
      
      if (selectedModel) {
        const modelPattern = new RegExp(selectedModel, 'i');
        results = results.filter(part => 
          modelPattern.test(part.name) || 
          part.specifications.compatibility.some(comp => modelPattern.test(comp))
        );
      }
    }
    
    if (selectedYear) {
      results = results.filter(part => {
        return part.specifications.compatibility.some(comp => {
          const yearRanges = comp.match(/\d{4}-\d{4}/g);
          if (yearRanges) {
            return yearRanges.some(range => {
              const [start, end] = range.split('-').map(Number);
              return Number(selectedYear) >= start && Number(selectedYear) <= end;
            });
          }
          return comp.includes(selectedYear);
        });
      });
    }
    
    if (selectedCategory) {
      results = results.filter(part => part.category === selectedCategory);
    }
    
    if (selectedCondition) {
      results = results.filter(part => part.condition === selectedCondition);
    }
    
    results = results.filter(part => 
      part.price >= priceRange[0] && part.price <= priceRange[1]
    );
    
    switch (sortOption) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    setSearchResults(results);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedCategory('');
    setSelectedCondition('');
    setPriceRange([0, 500000]);
    setSortOption('relevance');
    setSearchQuery('');
    setSearchResults([]);
  };

  // Auto-search when filters change
  React.useEffect(() => {
    if (selectedMake || selectedModel || selectedYear || selectedCategory || selectedCondition || searchQuery) {
      handleSearch();
    }
  }, [selectedMake, selectedModel, selectedYear, selectedCategory, selectedCondition, sortOption]);

  // Image carousel functions
  const nextImage = (partId: string) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [partId]: ((prev[partId] || 0) + 1) % vehicleParts.find(p => p.id === partId)!.images.length
    }));
  };

  const prevImage = (partId: string) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [partId]: ((prev[partId] || 0) - 1 + vehicleParts.find(p => p.id === partId)!.images.length) % vehicleParts.find(p => p.id === partId)!.images.length
    }));
  };

  // Cart functions
  const addToCart = (part: VehiclePart) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === part.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === part.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: part.id, name: part.name, price: part.price, quantity: 1, image: part.images[0] }];
    });
    
    setLastAddedItem({
      id: part.id,
      name: part.name,
      price: part.price,
      quantity: 1,
      image: part.images[0]
    });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Update the quantity selector in the product detail view
  const updateDetailQuantity = (partId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const existingItem = cart.find(item => item.id === partId);
    if (existingItem) {
      setCart(prev =>
        prev.map(item =>
          item.id === partId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      const part = vehicleParts.find(p => p.id === partId);
      if (part) {
        setCart(prev => [...prev, {
          id: part.id,
          name: part.name,
          price: part.price,
          quantity: newQuantity,
          image: part.images[0]
        }]);
      }
    }
  };

  // Toggle save for later
  const toggleSaveForLater = (partId: string) => {
    setSavedItems(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(partId)) {
        newSaved.delete(partId);
      } else {
        newSaved.add(partId);
      }
      return newSaved;
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Get condition badge color
  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Used':
        return 'bg-amber-100 text-amber-800';
      case 'Refurbished':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle part click to show detail view
  const handlePartClick = (part: VehiclePart) => {
    setSelectedPart(part);
    setShowPartDetail(true);
    window.scrollTo(0, 0);
  };

  // Close part detail view
  const closePartDetail = () => {
    setShowPartDetail(false);
    setSelectedPart(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">EVERYTHING-AUTOMOTIVE</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Parts Store</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">Buy/Sell Cars</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">About</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Login
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-3 pb-6 space-y-3 bg-white shadow-lg">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition">Home</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition">Services</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition">Parts Store</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition">Buy/Sell Cars</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition">About</a>
              <button className="w-full mt-4 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition shadow-md">
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Part Detail View */}
      {showPartDetail && selectedPart && (
        <div className="pt-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="mb-1 sm:mb-6 flex items-center">
              <button 
                onClick={closePartDetail}
                className="flex items-center text-blue-600 hover:text-blue-800 transition"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span>Back to Parts</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-8">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96">
                  <img
                    src={selectedPart.images[currentImageIndexes[selectedPart.id] || 0]}
                    alt={selectedPart.name}
                    className="w-full h-full object-contain"
                  />
                  {selectedPart.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(selectedPart.id)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => nextImage(selectedPart.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
                <div className="p-4 flex justify-center space-x-2">
                  {selectedPart.images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndexes(prev => ({...prev, [selectedPart.id]: index}))}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                        (currentImageIndexes[selectedPart.id] || 0) === index 
                          ? 'border-blue-500' 
                          : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedPart.name}</h1>
                  <span className={`${getConditionBadgeColor(selectedPart.condition)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {selectedPart.condition}
                  </span>
                </div>
                
                <p className="text-3xl font-bold text-blue-600 mb-6">₦{selectedPart.price.toLocaleString()}</p>
                
                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-8 h-8 flex items -center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => {
                        const currentQty = cart.find(item => item.id === selectedPart.id)?.quantity || 1;
                        if (currentQty > 1) {
                          updateDetailQuantity(selectedPart.id, currentQty - 1);
                        }
                      }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={cart.find(item => item.id === selectedPart.id)?.quantity || 1}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value);
                        if (qty >= 1) {
                          updateDetailQuantity(selectedPart.id, qty);
                        }
                      }}
                      className="w-16 text-center border border-gray-300 rounded-md"
                    />
                    <button
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => {
                        const currentQty = cart.find(item => item.id === selectedPart.id)?.quantity || 1;
                        updateDetailQuantity(selectedPart.id, currentQty + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bulk Purchase Call */}
                <div className="mb-6 bg-pink-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-medium">Call us for Bulk Purchases:</p>
                  <a href="tel:08138900104" className="text-blue-600 text-lg font-semibold hover:text-blue-800">
                    08138900104
                  </a>
                </div>

                {/* Add to Cart and Save Buttons */}
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={() => addToCart(selectedPart)}
                    className="flex-1 bg-[#37BD6B] text-white px-6 py-3 rounded-lg hover:bg-[#2ea35d] transition flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add To Cart</span>
                  </button>
                  <button
                    onClick={() => toggleSaveForLater(selectedPart.id)}
                    className={`p-3 border rounded-lg transition ${
                      savedItems.has(selectedPart.id)
                        ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                {/* Pickup Information */}
                <div className="mb-6 flex items-center space-x-3 text-gray-700">
                  <Store className="h-5 w-5" />
                  <span>Pickup & Pay on Collection Available</span>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700">{selectedPart.description}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {selectedPart.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h2>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <span className="font-medium">Material:</span> {selectedPart.specifications.material}
                    </p>
                    <div>
                      <p className="font-medium mb-1">Compatibility:</p>
                      <ul className="list-disc list-inside text-gray-700 pl-2">
                        {selectedPart.specifications.compatibility.map((comp, index) => (
                          <li key={index}>{comp}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-medium">Warranty:</span> {selectedPart.specifications.warranty}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Condition:</span> <span className={`inline-block ${selectedPart.condition === 'New' ? 'text-green-600' : selectedPart.condition === 'Used' ? 'text-amber-600' : 'text-blue-600'} font-medium`}>{selectedPart.condition}</span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Category:</span> {selectedPart.category}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Certification</h2>
                  <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                    {selectedPart.certification}
                  </div>
                </div>

                {selectedPart.awards.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Awards & Recognition</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      {selectedPart.awards.map((award, index) => (
                        <li key={index}>{award}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showPartDetail && (
        <>
          {/* Hero Section */}
          <div className="relative pt-16">
            <div className="absolute inset-0 z-0">
              <img
                src="https://lh3.googleusercontent.com/d/1qrbRItj3VmhP6kd3vRftIx8Pk-LubElz=w800-h600?auto=format&fit=crop&q=80"
                alt="Luxury car background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
                  Your Complete Automotive Solution
                </h1>
                <p className="text-xl text-white mb-24 max-w-3xl mx-auto drop-shadow">
                  From buying and selling cars to maintenance, repairs, and a wide range of car parts—we've got everything you need under one roof.
                </p>

                {/* CTA Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition group shadow-lg">
                    <Tools className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span>Book a Service</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-white text-gray-900 px-6 py-4 rounded-lg hover:bg-gray-100 transition group shadow-lg">
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Find Parts</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-white text-gray-900 px-6 py-4 rounded-lg hover:bg-gray-100 transition group shadow-lg">
                    <Car className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    <span>Buy/Sell Cars</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition group shadow-lg">
                    <Phone className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
                    <span>Free Manager Call</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Widget Button */}
            <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 group">
              <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Enhanced Search Section */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-white px-4">
                    <h2 className="text-3xl font-bold text-gray-900">Find Your Parts</h2>
                  </div>
                </div>
              </div>

              {/* Main Search Bar */}
              <div className="mt-8">
                <div className="w-full max-w-4xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-4 pl-12 pr-32 text-base bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                      placeholder="Search by vehicle (Toyota Corolla 2012) or part name (Brake Pad)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button 
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mr-2"
                      >
                        Search
                      </button>
                      <button 
                        onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                        className="text-gray-500 hover:text-blue-600 transition"
                        title="Advanced Search"
                      >
                        <Filter className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Search Filters */}
              {showAdvancedSearch && (
                <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Search</h3>
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 transition"
                    >
                      Reset Filters
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Vehicle Make */}
                    <div>
                      <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Make
                      </label>
                      <div className="relative">
                        <select
                          id="make"
                          value={selectedMake}
                          onChange={(e) => {
                            setSelectedMake(e.target.value);
                            setSelectedModel('');
                          }}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">All Makes</option>
                          {carMakes.map((make) => (
                            <option key={make} value={make}>{make}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Model */}
                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Model
                      </label>
                      <div className="relative">
                        <select
                          id="model"
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          disabled={!selectedMake}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">All Models</option>
                          {selectedMake && carModels[selectedMake]?.map((model) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Year */}
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <div className="relative">
                        <select
                          id="year"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">All Years</option>
                          {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {/* Part Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Part Category
                      </label>
                      <div className="relative">
                        <select
                          id="category"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">All Categories</option>
                          {partCategories.map((category) => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Product Condition */}
                    <div>
                      <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                        Product Condition
                      </label>
                      <div className="relative">
                        <select
                          id="condition"
                          value={selectedCondition}
                          onChange={(e) => setSelectedCondition(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">All Conditions</option>
                          {productConditions.map((condition) => (
                            <option key={condition} value={condition}>{condition}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <div className="relative">
                        <select
                          id="sort"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="relevance">Relevance</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="name">Name: A to Z</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <Sliders className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <label htmlFor="price-range" className="block text-sm font-medium text-gray-700">
                        Price Range: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                      </label>
                    </div>
                    <div className="mt-2 px-2">
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>₦0</span>
                      <span>₦500,000</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchQuery || selectedMake || selectedModel || selectedYear || selectedCategory || selectedCondition ? (
                <div className="mt-8">
                  {isSearching ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Showing:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {searchResults.length} of {searchResults.length}
                          </span>
                        </div>
                      </div>

                      {searchResults.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg shadow text-center">
                          <div className="text-gray-400 mb-4">
                            <Search className="h-12 w-12 mx-auto" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                          <p className="text-gray-500 mb-4">
                            We couldn't find any parts matching your search criteria.
                          </p>
                          <button 
                            onClick={resetFilters}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            Clear all filters
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {searchResults.map(part => (
                            <div key={part.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                              {/* Image Carousel */}
                              <div className="relative h-64">
                                <img
                                  src={part.images[currentImageIndexes[part.id] || 0]}
                                  alt={part.name}
                                  className="w-full h-full object-cover"
                                />
                                {part.images.length > 1 && (
                                  <>
                                    <button
                                      onClick={() => prevImage(part.id)}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                                    >
                                      <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => nextImage(part.id)}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                                    >
                                      <ChevronRight className="h-5 w-5" />
                                    </button>
                                  </>
                                )}
                                {/* Condition Badge */}
                                <div className="absolute top-3 right-3">
                                  <span className={`${getConditionBadgeColor(part.condition)} px-3 py-1 rounded-full text-xs font-medium shadow-sm`}>
                                    {part.condition}
                                  </span>
                                </div>
                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                    {part.category}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{part.name}</h3>
                                <p className="text-2xl font-bold text-blue-600 mb-3">₦{part.price.toLocaleString()}</p>
                                <p className="text-gray-600 mb-4 line-clamp-2">{part.description}</p>
                                
                                {/* This spacer pushes the buttons to the bottom */}
                                <div className="flex-grow"></div>
                                
                                {/* Action buttons - now at the bottom of each card */}
                                <div className="flex justify-between items-center mt-4">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addToCart(part);
                                    }}
                                    className="bg-[#37BD6B] text-white px-4 py-2 rounded-lg hover:bg-[#2ea35d] transition flex items-center space-x-2"
                                  >
                                    <ShoppingBag className="h-5 w-5" />
                                    <span>Add to Cart</span>
                                  </button>
                                  <button
                                    onClick={() => handlePartClick(part)}
                                    className="text-sm text-blue-600 hover:text-blue-800 transition"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {partCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setShowAdvancedSearch(true);
                        }}
                        className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-40"
                      >
                        <div className="absolute inset-0">
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                        </div>
                        <div className="relative p-4 flex flex-col h-full justify-end">
                          <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Car Models</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {/* First 7 car model cards (original) */}
                      {Object.entries(carModels).slice(0, 5).flatMap(([make, models]) => 
                        models.slice(0, 2).map((model) => (
                          <button
                            key={`${make}-${model}`}
                            onClick={() => {
                              setSelectedMake(make);
                              setSelectedModel(model);
                              setShowAdvancedSearch(true);
                            }}
                            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col items-center text-center"
                          >
                            <Car className="h-8 w-8 text-blue-600 mb-2" />
                            <span className="font-medium text-gray-900">{make}</span>
                            <span className="text-sm text-gray-600">{model}</span>
                          </button>
                        ))
                      )}
                      
                      {/* Additional 3 car model cards */}
                      <button
                        onClick={() => {
                          setSelectedMake("BMW");
                          setSelectedModel("3 Series");
                          setShowAdvancedSearch(true);
                        }}
                        className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col items-center text-center"
                      >
                        <Car className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="font-medium text-gray-900">BMW</span>
                        <span className="text-sm text-gray-600">3 Series</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedMake("Audi");
                          setSelectedModel("A4");
                          setShowAdvancedSearch(true);
                        }}
                        className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col items-center text-center"
                      >
                        <Car className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="font-medium text- gray-900">Audi</span>
                        <span className="text-sm text-gray-600">A4</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedMake("Jeep");
                          setSelectedModel("Grand Cherokee");
                          setShowAdvancedSearch(true);
                        }}
                        className="bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col items-center text-center"
                      >
                        <Car className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="font-medium text-gray-900">Jeep</span>
                        <span className="text-sm text-gray-600">Grand Cherokee</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Popular Searches Section */}
          <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Toyota Corolla Brake Pads", 
                  "Honda Accord Air Filter", 
                  "Toyota Camry Oil Filter", 
                  "Mercedes-Benz G-Class Suspension", 
                  "Lexus RX350 Spark Plugs", "Toyota Hilux Clutch Kit", 
                  "BMW 3 Series Brake Discs", 
                  "Toyota RAV4 Alternator", 
                  "Honda Civic Timing Belt"
                ].map((search, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearch();
                    }}
                    className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Parts Section */}
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Parts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {vehicleParts.slice(0, 3).map(part => (
                  <div 
                    key={part.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
                    onClick={() => handlePartClick(part)}
                  >
                    {/* Main Image */}
                    <div className="relative h-64">
                      <img
                        src={part.images[0]}
                        alt={part.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Condition Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`${getConditionBadgeColor(part.condition)} px-3 py-1 rounded-full text-xs font-medium shadow-sm`}>
                          {part.condition}
                        </span>
                      </div>
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                          {part.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{part.name}</h3>
                      <p className="text-2xl font-bold text-blue-600 mb-3">₦{part.price.toLocaleString()}</p>
                      <p className="text-gray-600 mb-4 line-clamp-2">{part.description}</p>
                      
                      {/* This spacer pushes the buttons to the bottom */}
                      <div className="flex-grow"></div>
                      
                      {/* Action buttons - now at the bottom of each card */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(part);
                          }}
                          className="bg-[#37BD6B] text-white px-4 py-2 rounded-lg hover:bg-[#2ea35d] transition flex items-center space-x-2"
                        >
                          <ShoppingBag className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </button>
                        <span className="text-sm text-blue-600 hover:text-blue-800 transition">View Details</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Special Offers Section */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Special Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {specialOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="relative overflow-hidden rounded-xl shadow-lg group"
                  >
                    <div className="absolute inset-0">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-900/90" />
                    </div>
                    <div className="relative p-8">
                      <div className="flex items-center space-x-2 mb-4">
                        <Tag className="h-6 w-6 text-white" />
                        <span className="text-white font-medium">{offer.title}</span>
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-2">{offer.discount}</h3>
                      <p className="text-white/90 text-lg mb-4">{offer.description}</p>
                      <p className="text-white/70">{offer.endDate}</p>
                      <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition">
                        Shop Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Don't just take our word for it - hear from our satisfied customers about their experience with our automotive parts and service.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill={i < testimonial.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{testimonial.content}</p>
                    <div className="mt-6 flex items-center space-x-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">Verified Purchase</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Close className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">₦{item.price.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        <span className="mx-2 text-gray-700">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Close className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
            <button
              className="w-full bg-[#37BD6B] text-white py-3 rounded-lg hover:bg-[#2ea35d] transition"
              onClick={() => alert('Proceeding to checkout...')}
            >
              Proceed to Checkout
            </button>
            <button
              className="w-full mt-2 text-gray-600 py-3 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setIsCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Add to Cart Notification */}
      <div
        className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-xl p-4 transform transition-transform duration-300 ${
          showNotification ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ width: '400px', zIndex: 1000 }}
      >
        {lastAddedItem && (
          <div className="flex items-center space-x-4">
            <img
              src={lastAddedItem.image}
              alt={lastAddedItem.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Added to cart!</p>
              <p className="text-sm text-gray-500">{lastAddedItem.name}</p>
              <p className="text-sm font-semibold text-blue-600">₦{lastAddedItem.price.toLocaleString()}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setShowNotification(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View Cart
              </button>
              <button
                onClick={() => setShowNotification(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 left-6 bg-[#37BD6B] text-white p-4 rounded-full shadow-lg hover:bg-[#2ea35d] transition-colors z-50 group"
      >
        <ShoppingBag className="h-6 w-6 group-hover:scale-110 transition-transform" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>
    </div>
  );
}

export default App;
