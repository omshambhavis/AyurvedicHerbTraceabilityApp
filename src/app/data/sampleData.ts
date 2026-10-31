// Sample data for the AyurTrace application

export interface User {
  id: string;
  name: string;
  role: 'farmer' | 'consumer' | 'admin';
  mobile: string;
  email: string;
  location: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'banned';
  aadhaarId?: string;
  farmSize?: string;
  herbsGrown?: string[];
  avatar?: string;
}

export interface Herb {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  category: string;
  benefits: string[];
  description: string;
  price: number;
  unit: string;
}

export interface Batch {
  id: string;
  herbId: string;
  farmerId: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  quality: 'premium' | 'organic' | 'standard';
  certifications: string[];
  status: 'cultivation' | 'harvested' | 'processed' | 'quality_checked' | 'packaged' | 'shipped' | 'retail' | 'sold';
  currentLocation: string;
  price: number;
  expiryDate: string;
  processingMethod: string;
  farmLocation: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface Review {
  id: string;
  batchId: string;
  consumerId: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// Sample Users
export const sampleUsers: User[] = [
  // Farmers
  {
    id: "F001",
    name: "Ravi Kumar",
    role: "farmer",
    mobile: "+91-9876543210",
    email: "ravi.kumar@email.com",
    location: "Wayanad, Kerala",
    registrationDate: "2024-01-15",
    status: "active",
    aadhaarId: "XXXX-XXXX-1234",
    farmSize: "5 acres",
    herbsGrown: ["Turmeric", "Ashwagandha", "Neem"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "F002",
    name: "Mohan Singh",
    role: "farmer",
    mobile: "+91-9876543211",
    email: "mohan.singh@email.com",
    location: "Jodhpur, Rajasthan",
    registrationDate: "2024-01-20",
    status: "active",
    aadhaarId: "XXXX-XXXX-5678",
    farmSize: "8 acres",
    herbsGrown: ["Ashwagandha", "Brahmi", "Shankhpushpi"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "F003",
    name: "Lakshmi Devi",
    role: "farmer",
    mobile: "+91-9876543212",
    email: "lakshmi.devi@email.com",
    location: "Coimbatore, Tamil Nadu",
    registrationDate: "2024-02-01",
    status: "active",
    aadhaarId: "XXXX-XXXX-9012",
    farmSize: "3 acres",
    herbsGrown: ["Neem", "Tulsi", "Aloe Vera"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e6?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "F004",
    name: "Suresh Patel",
    role: "farmer",
    mobile: "+91-9876543213",
    email: "suresh.patel@email.com",
    location: "Ahmedabad, Gujarat",
    registrationDate: "2024-02-10",
    status: "pending",
    aadhaarId: "XXXX-XXXX-3456",
    farmSize: "6 acres",
    herbsGrown: ["Giloy", "Amla", "Fennel"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "F005",
    name: "Anita Sharma",
    role: "farmer",
    mobile: "+91-9876543214",
    email: "anita.sharma@email.com",
    location: "Dehradun, Uttarakhand",
    registrationDate: "2024-02-15",
    status: "active",
    aadhaarId: "XXXX-XXXX-7890",
    farmSize: "4 acres",
    herbsGrown: ["Brahmi", "Shankhpushpi", "Jatamansi"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Consumers
  {
    id: "C001",
    name: "Priya Reddy",
    role: "consumer",
    mobile: "+91-9876543220",
    email: "priya.reddy@email.com",
    location: "Bangalore, Karnataka",
    registrationDate: "2024-01-25",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "C002",
    name: "Rajesh Agarwal",
    role: "consumer",
    mobile: "+91-9876543221",
    email: "rajesh.agarwal@email.com",
    location: "Mumbai, Maharashtra",
    registrationDate: "2024-02-05",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "C003",
    name: "Sunita Joshi",
    role: "consumer",
    mobile: "+91-9876543222",
    email: "sunita.joshi@email.com",
    location: "Pune, Maharashtra",
    registrationDate: "2024-02-12",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e6?w=100&h=100&fit=crop&crop=face"
  },

  // Admin
  {
    id: "A001",
    name: "Admin User",
    role: "admin",
    mobile: "+91-9876543230",
    email: "admin@ayurtrace.com",
    location: "Delhi, India",
    registrationDate: "2024-01-01",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
];

// Comprehensive herb database with 50+ herbs
export const sampleHerbs: Herb[] = [
  {
    id: "H001",
    name: "Turmeric",
    scientificName: "Curcuma longa",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500",
    category: "Spice & Medicine",
    benefits: ["Anti-inflammatory", "Antioxidant", "Digestive", "Immune support"],
    description: "Golden spice with powerful healing properties",
    price: 250,
    unit: "kg"
  },
  {
    id: "H002",
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    image: "https://images.unsplash.com/photo-1544961503-7ad532b3e9bc?w=500",
    category: "Adaptogen",
    benefits: ["Stress relief", "Energy boost", "Sleep support", "Immunity"],
    description: "Powerful adaptogenic herb for stress management",
    price: 800,
    unit: "kg"
  },
  {
    id: "H003",
    name: "Neem",
    scientificName: "Azadirachta indica",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    category: "Medicinal",
    benefits: ["Antibacterial", "Skin health", "Blood purification", "Oral health"],
    description: "Nature's pharmacy for skin and health",
    price: 150,
    unit: "kg"
  },
  {
    id: "H004",
    name: "Brahmi",
    scientificName: "Bacopa monnieri",
    image: "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=500",
    category: "Brain Tonic",
    benefits: ["Memory enhancement", "Mental clarity", "Anxiety relief", "Focus"],
    description: "Ancient brain tonic for mental wellness",
    price: 600,
    unit: "kg"
  },
  {
    id: "H005",
    name: "Tulsi",
    scientificName: "Ocimum sanctum",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500",
    category: "Spiritual & Medicinal",
    benefits: ["Respiratory health", "Immunity", "Stress relief", "Detox"],
    description: "Sacred herb for holistic wellness",
    price: 300,
    unit: "kg"
  },
  {
    id: "H006",
    name: "Ginger",
    scientificName: "Zingiber officinale",
    image: "https://images.unsplash.com/photo-1615485020461-81c9a70b4e9c?w=500",
    category: "Spice & Medicine",
    benefits: ["Digestive aid", "Anti-nausea", "Anti-inflammatory", "Circulation"],
    description: "Warming spice for digestive and respiratory health",
    price: 180,
    unit: "kg"
  },
  {
    id: "H007",
    name: "Amla",
    scientificName: "Phyllanthus emblica",
    image: "https://images.unsplash.com/photo-1618269360726-4dc0d19b9005?w=500",
    category: "Nutritive",
    benefits: ["Vitamin C", "Hair health", "Immunity", "Antioxidant"],
    description: "Rich source of vitamin C and antioxidants",
    price: 220,
    unit: "kg"
  },
  {
    id: "H008",
    name: "Fenugreek",
    scientificName: "Trigonella foenum-graecum",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Spice & Medicine",
    benefits: ["Blood sugar", "Lactation support", "Digestive", "Heart health"],
    description: "Seeds with metabolic and digestive benefits",
    price: 160,
    unit: "kg"
  },
  {
    id: "H009",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis",
    image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=500",
    category: "Skin & Digestive",
    benefits: ["Skin healing", "Digestive soothing", "Anti-inflammatory", "Hydrating"],
    description: "Succulent plant for skin and digestive wellness",
    price: 120,
    unit: "kg"
  },
  {
    id: "H010",
    name: "Triphala",
    scientificName: "Terminalia chebula blend",
    image: "https://images.unsplash.com/photo-1602526212686-faa7f42ac0d7?w=500",
    category: "Digestive Tonic",
    benefits: ["Digestive health", "Detoxification", "Eye health", "Immunity"],
    description: "Three-fruit combination for digestive wellness",
    price: 350,
    unit: "kg"
  },
  {
    id: "H011",
    name: "Giloy",
    scientificName: "Tinospora cordifolia",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500",
    category: "Immunity Booster",
    benefits: ["Immunity", "Fever reduction", "Liver health", "Anti-inflammatory"],
    description: "Heart-leaved moonseed for immunity and vitality",
    price: 400,
    unit: "kg"
  },
  {
    id: "H012",
    name: "Shatavari",
    scientificName: "Asparagus racemosus",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Women's Health",
    benefits: ["Women's health", "Lactation", "Reproductive health", "Adaptogen"],
    description: "Queen of herbs for women's wellness",
    price: 450,
    unit: "kg"
  },
  {
    id: "H013",
    name: "Moringa",
    scientificName: "Moringa oleifera",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Nutritive",
    benefits: ["Nutrition", "Energy", "Antioxidant", "Blood sugar"],
    description: "Drumstick tree leaves packed with nutrients",
    price: 280,
    unit: "kg"
  },
  {
    id: "H014",
    name: "Shankhpushpi",
    scientificName: "Convolvulus pluricaulis",
    image: "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=500",
    category: "Brain Tonic",
    benefits: ["Memory", "Learning", "Concentration", "Mental clarity"],
    description: "Brain tonic for enhanced cognitive function",
    price: 550,
    unit: "kg"
  },
  {
    id: "H015",
    name: "Manjistha",
    scientificName: "Rubia cordifolia",
    image: "https://images.unsplash.com/photo-1617859047452-8175454ad519?w=500",
    category: "Blood Purifier",
    benefits: ["Blood purification", "Skin health", "Lymphatic support", "Anti-inflammatory"],
    description: "Natural blood purifier and skin enhancer",
    price: 380,
    unit: "kg"
  },
  {
    id: "H016",
    name: "Cardamom",
    scientificName: "Elettaria cardamomum",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Spice & Medicine",
    benefits: ["Digestive", "Breath freshener", "Heart health", "Antioxidant"],
    description: "Queen of spices with aromatic and medicinal properties",
    price: 3200,
    unit: "kg"
  },
  {
    id: "H017",
    name: "Cinnamon",
    scientificName: "Cinnamomum verum",
    image: "https://images.unsplash.com/photo-1615485020461-81c9a70b4e9c?w=500",
    category: "Spice & Medicine",
    benefits: ["Blood sugar", "Circulation", "Digestive", "Antimicrobial"],
    description: "Sweet spice with metabolic and circulatory benefits",
    price: 600,
    unit: "kg"
  },
  {
    id: "H018",
    name: "Black Pepper",
    scientificName: "Piper nigrum",
    image: "https://images.unsplash.com/photo-1582169296194-77561a7c5739?w=500",
    category: "Spice & Medicine",
    benefits: ["Digestive", "Respiratory", "Bioavailability enhancer", "Metabolism"],
    description: "King of spices that enhances nutrient absorption",
    price: 800,
    unit: "kg"
  },
  {
    id: "H019",
    name: "Cumin",
    scientificName: "Cuminum cyminum",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Spice & Medicine",
    benefits: ["Digestive", "Iron source", "Antioxidant", "Weight management"],
    description: "Aromatic spice for digestive health and metabolism",
    price: 320,
    unit: "kg"
  },
  {
    id: "H020",
    name: "Coriander",
    scientificName: "Coriandrum sativum",
    image: "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=500",
    category: "Spice & Medicine",
    benefits: ["Digestive", "Cooling", "Detoxifying", "Blood sugar"],
    description: "Cooling spice with digestive and detoxifying properties",
    price: 180,
    unit: "kg"
  },
  {
    id: "H021",
    name: "Fennel",
    scientificName: "Foeniculum vulgare",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Digestive",
    benefits: ["Digestive", "Breath freshener", "Lactation", "Anti-inflammatory"],
    description: "Sweet seeds for digestive comfort and freshness",
    price: 240,
    unit: "kg"
  },
  {
    id: "H022",
    name: "Mustard Seeds",
    scientificName: "Brassica nigra",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Spice & Medicine",
    benefits: ["Circulation", "Respiratory", "Digestive", "Anti-inflammatory"],
    description: "Pungent seeds for circulation and respiratory health",
    price: 140,
    unit: "kg"
  },
  {
    id: "H023",
    name: "Ajwain",
    scientificName: "Trachyspermum ammi",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Digestive",
    benefits: ["Digestive", "Respiratory", "Antimicrobial", "Carminative"],
    description: "Potent seeds for digestive and respiratory wellness",
    price: 260,
    unit: "kg"
  },
  {
    id: "H024",
    name: "Cloves",
    scientificName: "Syzygium aromaticum",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Spice & Medicine",
    benefits: ["Oral health", "Digestive", "Antimicrobial", "Pain relief"],
    description: "Aromatic flower buds with potent medicinal properties",
    price: 1200,
    unit: "kg"
  },
  {
    id: "H025",
    name: "Nutmeg",
    scientificName: "Myristica fragrans",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Spice & Medicine",
    benefits: ["Digestive", "Sleep support", "Pain relief", "Brain health"],
    description: "Fragrant seed with digestive and calming properties",
    price: 2800,
    unit: "kg"
  },
  {
    id: "H026",
    name: "Jatamansi",
    scientificName: "Nardostachys jatamansi",
    image: "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=500",
    category: "Nervine Tonic",
    benefits: ["Anxiety relief", "Sleep support", "Memory", "Nervous system"],
    description: "Himalayan herb for nervous system support",
    price: 1500,
    unit: "kg"
  },
  {
    id: "H027",
    name: "Haritaki",
    scientificName: "Terminalia chebula",
    image: "https://images.unsplash.com/photo-1602526212686-faa7f42ac0d7?w=500",
    category: "Digestive Tonic",
    benefits: ["Digestive", "Detoxification", "Rejuvenative", "Laxative"],
    description: "King of medicines for digestive health",
    price: 420,
    unit: "kg"
  },
  {
    id: "H028",
    name: "Bibhitaki",
    scientificName: "Terminalia bellirica",
    image: "https://images.unsplash.com/photo-1602526212686-faa7f42ac0d7?w=500",
    category: "Respiratory & Digestive",
    benefits: ["Respiratory health", "Digestive", "Hair health", "Rejuvenative"],
    description: "Baheda fruit for respiratory and digestive wellness",
    price: 380,
    unit: "kg"
  },
  {
    id: "H029",
    name: "Amalaki",
    scientificName: "Phyllanthus emblica",
    image: "https://images.unsplash.com/photo-1618269360726-4dc0d19b9005?w=500",
    category: "Nutritive Tonic",
    benefits: ["Vitamin C", "Immunity", "Anti-aging", "Hair health"],
    description: "Vitamin C powerhouse for immunity and vitality",
    price: 220,
    unit: "kg"
  },
  {
    id: "H030",
    name: "Punarnava",
    scientificName: "Boerhavia diffusa",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Kidney & Liver Tonic",
    benefits: ["Kidney health", "Liver support", "Diuretic", "Anti-inflammatory"],
    description: "Regenerative herb for kidney and liver health",
    price: 340,
    unit: "kg"
  },
  {
    id: "H031",
    name: "Arjuna",
    scientificName: "Terminalia arjuna",
    image: "https://images.unsplash.com/photo-1602526212686-faa7f42ac0d7?w=500",
    category: "Heart Tonic",
    benefits: ["Heart health", "Blood pressure", "Cholesterol", "Circulation"],
    description: "Cardiac tonic for heart health and circulation",
    price: 480,
    unit: "kg"
  },
  {
    id: "H032",
    name: "Vidanga",
    scientificName: "Embelia ribes",
    image: "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=500",
    category: "Digestive & Antiparasitic",
    benefits: ["Digestive", "Antiparasitic", "Weight management", "Skin health"],
    description: "Traditional antiparasitic and digestive herb",
    price: 520,
    unit: "kg"
  },
  {
    id: "H033",
    name: "Chitrak",
    scientificName: "Plumbago zeylanica",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Digestive Fire",
    benefits: ["Digestive fire", "Metabolism", "Weight management", "Circulation"],
    description: "Powerful digestive stimulant and metabolic enhancer",
    price: 450,
    unit: "kg"
  },
  {
    id: "H034",
    name: "Vacha",
    scientificName: "Acorus calamus",
    image: "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=500",
    category: "Brain & Respiratory",
    benefits: ["Memory", "Speech", "Respiratory", "Nervous system"],
    description: "Sacred grass for mental clarity and respiratory health",
    price: 680,
    unit: "kg"
  },
  {
    id: "H035",
    name: "Kapikacchu",
    scientificName: "Mucuna pruriens",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Nervine & Reproductive",
    benefits: ["Mood support", "Energy", "Reproductive health", "Nervous system"],
    description: "Velvet bean for mood and reproductive wellness",
    price: 580,
    unit: "kg"
  },
  {
    id: "H036",
    name: "Safed Musli",
    scientificName: "Chlorophytum borivilianum",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Rejuvenative",
    benefits: ["Energy", "Reproductive health", "Immunity", "Strength"],
    description: "White gold herb for vitality and strength",
    price: 2400,
    unit: "kg"
  },
  {
    id: "H037",
    name: "Bala",
    scientificName: "Sida cordifolia",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Strength & Vitality",
    benefits: ["Strength", "Muscle health", "Energy", "Heart health"],
    description: "Strength-giving herb for muscle and heart health",
    price: 420,
    unit: "kg"
  },
  {
    id: "H038",
    name: "Yashtimadhu",
    scientificName: "Glycyrrhiza glabra",
    image: "https://images.unsplash.com/photo-1617859047452-8175454ad519?w=500",
    category: "Respiratory & Digestive",
    benefits: ["Respiratory", "Soothing", "Digestive", "Adrenal support"],
    description: "Sweet root for respiratory and adrenal support",
    price: 650,
    unit: "kg"
  },
  {
    id: "H039",
    name: "Kutki",
    scientificName: "Picrorhiza kurroa",
    image: "https://images.unsplash.com/photo-1617859047452-8175454ad519?w=500",
    category: "Liver Tonic",
    benefits: ["Liver health", "Digestive", "Immunity", "Skin health"],
    description: "Himalayan herb for liver health and immunity",
    price: 1800,
    unit: "kg"
  },
  {
    id: "H040",
    name: "Kalmegh",
    scientificName: "Andrographis paniculata",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Immunity & Liver",
    benefits: ["Immunity", "Liver support", "Digestive", "Anti-inflammatory"],
    description: "King of bitters for immunity and liver health",
    price: 320,
    unit: "kg"
  },
  {
    id: "H041",
    name: "Bhringraj",
    scientificName: "Eclipta prostrata",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Hair & Liver",
    benefits: ["Hair health", "Liver support", "Premature graying", "Scalp health"],
    description: "False daisy for hair health and liver support",
    price: 280,
    unit: "kg"
  },
  {
    id: "H042",
    name: "Tagar",
    scientificName: "Valeriana wallichii",
    image: "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=500",
    category: "Nervine Sedative",
    benefits: ["Sleep support", "Anxiety relief", "Nervous tension", "Relaxation"],
    description: "Natural tranquilizer for peaceful sleep",
    price: 720,
    unit: "kg"
  },
  {
    id: "H043",
    name: "Jivanti",
    scientificName: "Leptadenia reticulata",
    image: "https://images.unsplash.com/photo-1471943038325-a1e64d9be2ea?w=500",
    category: "Rejuvenative",
    benefits: ["Vitality", "Reproductive health", "Immunity", "Anti-aging"],
    description: "Life-giving herb for vitality and longevity",
    price: 850,
    unit: "kg"
  },
  {
    id: "H044",
    name: "Pippali",
    scientificName: "Piper longum",
    image: "https://images.unsplash.com/photo-1582169296194-77561a7c5739?w=500",
    category: "Respiratory & Digestive",
    benefits: ["Respiratory health", "Digestive fire", "Circulation", "Bioavailability"],
    description: "Long pepper for respiratory and digestive health",
    price: 680,
    unit: "kg"
  },
  {
    id: "H045",
    name: "Maricha",
    scientificName: "Piper nigrum",
    image: "https://images.unsplash.com/photo-1582169296194-77561a7c5739?w=500",
    category: "Digestive & Respiratory",
    benefits: ["Digestive", "Respiratory", "Circulation", "Metabolism"],
    description: "Black pepper for enhanced digestion and circulation",
    price: 800,
    unit: "kg"
  },
  {
    id: "H046",
    name: "Shunthi",
    scientificName: "Zingiber officinale",
    image: "https://images.unsplash.com/photo-1615485020461-81c9a70b4e9c?w=500",
    category: "Digestive & Respiratory",
    benefits: ["Digestive", "Nausea relief", "Circulation", "Anti-inflammatory"],
    description: "Dried ginger for digestive and respiratory wellness",
    price: 180,
    unit: "kg"
  },
  {
    id: "H047",
    name: "Ela",
    scientificName: "Elettaria cardamomum",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Digestive & Heart",
    benefits: ["Digestive", "Heart health", "Breath freshener", "Circulation"],
    description: "Green cardamom for heart and digestive health",
    price: 3200,
    unit: "kg"
  },
  {
    id: "H048",
    name: "Twak",
    scientificName: "Cinnamomum zeylanicum",
    image: "https://images.unsplash.com/photo-1615485020461-81c9a70b4e9c?w=500",
    category: "Metabolic & Circulatory",
    benefits: ["Blood sugar", "Circulation", "Digestive", "Warming"],
    description: "Ceylon cinnamon for metabolic and circulatory health",
    price: 600,
    unit: "kg"
  },
  {
    id: "H049",
    name: "Tejpatra",
    scientificName: "Cinnamomum tamala",
    image: "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=500",
    category: "Digestive & Respiratory",
    benefits: ["Digestive", "Respiratory", "Blood sugar", "Antioxidant"],
    description: "Indian bay leaf for digestive and respiratory health",
    price: 320,
    unit: "kg"
  },
  {
    id: "H050",
    name: "Lavanga",
    scientificName: "Syzygium aromaticum",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500",
    category: "Oral & Digestive",
    benefits: ["Oral health", "Digestive", "Pain relief", "Antimicrobial"],
    description: "Clove buds for oral health and pain relief",
    price: 1200,
    unit: "kg"
  }
];

// Sample batches
export const sampleBatches: Batch[] = [
  {
    id: "AYU-TUR-2024-001234",
    herbId: "H001",
    farmerId: "F001",
    quantity: 100,
    unit: "kg",
    harvestDate: "2024-03-15",
    quality: "premium",
    certifications: ["AYUSH Certified", "Organic", "Fair Trade"],
    status: "retail",
    currentLocation: "Ayurvedic Store, Delhi",
    price: 250,
    expiryDate: "2026-03-15",
    processingMethod: "Sun-dried and ground using traditional stone mills",
    farmLocation: "Organic Farm, Wayanad District, Kerala",
    approvalStatus: "approved"
  },
  {
    id: "AYU-ASH-2024-002156",
    herbId: "H002",
    farmerId: "F002",
    quantity: 50,
    unit: "kg",
    harvestDate: "2024-02-20",
    quality: "organic",
    certifications: ["AYUSH Certified", "Organic"],
    status: "shipped",
    currentLocation: "Distribution Center, Mumbai",
    price: 800,
    expiryDate: "2026-02-20",
    processingMethod: "Shade-dried and powdered using modern facilities",
    farmLocation: "Rajasthan Desert Farms, Jodhpur",
    approvalStatus: "approved"
  },
  {
    id: "AYU-NIM-2024-003287",
    herbId: "H003",
    farmerId: "F003",
    quantity: 75,
    unit: "kg",
    harvestDate: "2024-01-10",
    quality: "standard",
    certifications: ["AYUSH Certified"],
    status: "quality_checked",
    currentLocation: "Quality Testing Lab, Chennai",
    price: 150,
    expiryDate: "2025-01-10",
    processingMethod: "Air-dried under controlled conditions",
    farmLocation: "Coimbatore District, Tamil Nadu",
    approvalStatus: "pending"
  }
];

// Sample reviews
export const sampleReviews: Review[] = [
  {
    id: "R001",
    batchId: "AYU-TUR-2024-001234",
    consumerId: "C001",
    rating: 5,
    comment: "Excellent quality turmeric! The color and aroma are amazing. Highly recommended.",
    date: "2024-04-10",
    helpful: 12
  },
  {
    id: "R002",
    batchId: "AYU-TUR-2024-001234",
    consumerId: "C002",
    rating: 4,
    comment: "Good quality product. The traceability feature is very helpful to know the source.",
    date: "2024-04-12",
    helpful: 8
  },
  {
    id: "R003",
    batchId: "AYU-ASH-2024-002156",
    consumerId: "C003",
    rating: 5,
    comment: "Best ashwagandha I've used. Really helps with stress and sleep.",
    date: "2024-04-08",
    helpful: 15
  }
];

// Language translations
export const translations = {
  en: {
    appName: "AyurTrace",
    tagline: "Herb Traceability",
    welcome: "Welcome to AyurTrace",
    login: "Login",
    register: "Register",
    farmer: "Farmer",
    consumer: "Consumer",
    admin: "Admin",
    dashboard: "Dashboard",
    herbs: "Herbs",
    batches: "Batches",
    profile: "Profile",
    scan: "Scan",
    browse: "Browse",
    recent: "Recent",
    search: "Search herbs, origins, farmers...",
    viewDetails: "View Details",
    addBatch: "Add Batch",
    manageBatches: "Manage Batches",
    analytics: "Analytics",
    accounts: "Accounts",
    community: "Community",
    certifications: "Certifications",
    quality: "Quality",
    organic: "Organic",
    premium: "Premium",
    standard: "Standard"
  },
  hi: {
    appName: "आयुर्ट्रेस",
    tagline: "जड़ी बूटी की खोज",
    welcome: "आयुर्ट्रेस में आपका स्वागत है",
    login: "लॉगिन",
    register: "रजिस्टर",
    farmer: "किसान",
    consumer: "उपभोक्ता", 
    admin: "व्यवस्थापक",
    dashboard: "डैशबोर्ड",
    herbs: "जड़ी बूटी",
    batches: "बैच",
    profile: "प्रोफाइल",
    scan: "स्कैन",
    browse: "ब्राउज़",
    recent: "हाल ही में",
    search: "जड़ी बूटी, स्थान, किसान खोजें...",
    viewDetails: "विवरण देखें",
    addBatch: "बैच जोड़ें",
    manageBatches: "बैच प्रबंधन",
    analytics: "विश्लेषण",
    accounts: "खाते",
    community: "समुदाय",
    certifications: "प्रमाणन",
    quality: "गुणवत्ता",
    organic: "जैविक",
    premium: "प्रीमियम",
    standard: "मानक"
  }
};