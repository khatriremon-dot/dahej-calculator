"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calculator,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Shield,
  TrendingUp,
  Globe,
  BookOpen,
  Zap,
  Share2,
  MapPin,
  Info,
  DollarSign,
  GraduationCap,
  Heart,
  ArrowRightCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Country Data for Comparison ──
const bridePriceData = [
  {
    country: "India, Pakistan, Bangladesh",
    term: "Dahej / Dowry / Jahez",
    direction: "Bride's family → Groom's family",
    rangeLow: "$500",
    rangeHigh: "$60,000+",
    currency: "INR / PKR / BDT",
    avgAmount: "$5,000 - $60,000",
    legality: "Illegal in India (1961), restricted in Pakistan (1976)",
    link: "/",
    icon: "🇮🇳",
    color: "from-orange-500 to-red-500",
    description: "Dowry (dahej) involves cash, jewelry, vehicles, and property given by the bride's family to the groom's family. Despite being illegal in India, it remains widespread across South Asia.",
  },
  {
    country: "South Africa, Zimbabwe, Zambia",
    term: "Lobola / Lobolo / Roora",
    direction: "Groom's family → Bride's family",
    rangeLow: "$3,000",
    rangeHigh: "$30,000+",
    currency: "ZAR",
    avgAmount: "$3,000 - $30,000",
    legality: "Legal and culturally protected",
    link: "/lobola-calculator",
    icon: "🇿🇦",
    color: "from-green-500 to-emerald-500",
    description: "Lobola is a centuries-old African tradition where the groom's family pays the bride's family in cash or cattle as a sign of respect and gratitude. Traditionally 11 heads of cattle.",
  },
  {
    country: "China, Taiwan, Singapore",
    term: "Caili (彩礼) / Bride Price",
    direction: "Groom's family → Bride's family",
    rangeLow: "$1,000",
    rangeHigh: "$1,900,000+",
    currency: "CNY (¥)",
    avgAmount: "$5,000 - $300,000",
    legality: "Government campaigns against excessive amounts",
    link: "/caili-calculator",
    icon: "🇨🇳",
    color: "from-red-500 to-rose-500",
    description: "Caili has escalated dramatically due to gender imbalance from the one-child policy. Prices vary enormously by province, from ¥30,000 in Chongqing to ¥300,000+ in Shanghai.",
  },
  {
    country: "Islamic Countries (Global)",
    term: "Mahr / Mehr / Meher",
    direction: "Groom → Bride (directly)",
    rangeLow: "$50",
    rangeHigh: "$100,000+",
    currency: "USD / Gold / Silver",
    avgAmount: "$500 - $50,000",
    legality: "Religious obligation under Sharia law",
    link: "/mahr-calculator",
    icon: "☪️",
    color: "from-amber-500 to-orange-500",
    description: "Mahr is an Islamic mandatory payment from groom to bride. Mahr Fatimi (Prophet's daughter's mahr) is approximately 400 silver Dirhams. Mahr belongs exclusively to the bride.",
  },
  {
    country: "Kenya, Uganda, Tanzania",
    term: "Bride Price / Dowry",
    direction: "Groom's family → Bride's family",
    rangeLow: "$500",
    rangeHigh: "$50,000+",
    currency: "KES / UGX / TZS",
    avgAmount: "$1,000 - $20,000",
    legality: "Legal; some regulation attempts",
    link: "/bride-price-calculator",
    icon: "🇰🇪",
    color: "from-teal-500 to-cyan-500",
    description: "In East Africa, bride price is practiced across multiple ethnic communities. Among the Kikuyu of Kenya, the tradition involves goats and sheep alongside cash.",
  },
  {
    country: "South Sudan, Ethiopia, Somalia",
    term: "Bride Price (Cattle-based)",
    direction: "Groom's family → Bride's family",
    rangeLow: "$10,000",
    rangeHigh: "$200,000+",
    currency: "Cattle",
    avgAmount: "20-200 cattle",
    legality: "Culturally mandated",
    link: "/bride-price-calculator",
    icon: "🌍",
    color: "from-yellow-600 to-amber-600",
    description: "Bride price is calculated in cattle rather than cash. A typical South Sudanese bride price ranges from 20 to 200 cattle, each worth approximately $500-$1,000.",
  },
  {
    country: "Thailand, Philippines, Myanmar",
    term: "Sin Sod / Bigay-Kaya / Bride Price",
    direction: "Groom → Bride's family",
    rangeLow: "$500",
    rangeHigh: "$50,000+",
    currency: "THB / PHP / MMK",
    avgAmount: "$1,000 - $30,000",
    legality: "Legal; culturally significant",
    link: "/bride-price-calculator",
    icon: "🇹🇭",
    color: "from-purple-500 to-indigo-500",
    description: "In Thailand, Sin Sod is a bride price given in gold and cash, often displayed at the wedding. In the Philippines, Bigay-Kaya involves traditional gift-giving during the ceremony.",
  },
  {
    country: "Iran, Afghanistan, Tajikistan",
    term: "Jahiziyeh / Mahr",
    direction: "Both directions (varies)",
    rangeLow: "$1,000",
    rangeHigh: "$100,000+",
    currency: "IRR / AFN / TJS",
    avgAmount: "$2,000 - $50,000",
    legality: "Mandatory in Islam; Jahiziyeh debated",
    link: "/mahr-calculator",
    icon: "🇮🇷",
    color: "from-sky-500 to-blue-500",
    description: "Jahiziyeh refers to goods provided by the bride's family, while Mahr is the groom's obligation. The combination creates significant financial barriers in Afghanistan.",
  },
];

// ── Global Calculator Data ──
const globalCountries = [
  { value: "india", label: "India (Dahej/Dowry)", low: 500, high: 60000, currency: "$", term: "Dahej" },
  { value: "pakistan", label: "Pakistan (Jahez)", low: 300, high: 30000, currency: "$", term: "Jahez" },
  { value: "bangladesh", label: "Bangladesh (Dahej)", low: 200, high: 20000, currency: "$", term: "Dahej" },
  { value: "south-africa", label: "South Africa (Lobola)", low: 3000, high: 30000, currency: "$", term: "Lobola" },
  { value: "china", label: "China (Caili)", low: 1000, high: 300000, currency: "$", term: "Caili" },
  { value: "kenya", label: "Kenya (Bride Price)", low: 500, high: 20000, currency: "$", term: "Bride Price" },
  { value: "nigeria", label: "Nigeria (Bride Price)", low: 100, high: 5000, currency: "$", term: "Bride Price" },
  { value: "thailand", label: "Thailand (Sin Sod)", low: 500, high: 30000, currency: "$", term: "Sin Sod" },
  { value: "philippines", label: "Philippines (Bigay-Kaya)", low: 200, high: 10000, currency: "$", term: "Bigay-Kaya" },
  { value: "iran", label: "Iran (Mahr)", low: 1000, high: 50000, currency: "$", term: "Mahr" },
  { value: "saudi-arabia", label: "Saudi Arabia (Mahr)", low: 2000, high: 100000, currency: "$", term: "Mahr" },
  { value: "indonesia", label: "Indonesia (Mahar)", low: 100, high: 5000, currency: "$", term: "Mahar" },
];

const educationMultiplier = [
  { value: "primary", label: "Primary School", multiplier: 0.7 },
  { value: "high-school", label: "High School", multiplier: 1.0 },
  { value: "bachelors", label: "Bachelor's Degree", multiplier: 1.5 },
  { value: "masters", label: "Master's Degree", multiplier: 2.0 },
  { value: "phd", label: "PhD / Doctorate", multiplier: 2.5 },
];

// ── Types ──
interface GlobalState {
  country: string;
  monthlyIncome: string;
  education: string;
}

interface GlobalResult {
  country: string;
  term: string;
  low: number;
  high: number;
  average: number;
}

// ── Helpers ──
function calculateGlobalBridePrice(state: GlobalState): GlobalResult | null {
  if (!state.country || !state.monthlyIncome) return null;

  const country = globalCountries.find((c) => c.value === state.country);
  const edu = educationMultiplier.find((e) => e.value === state.education);
  if (!country) return null;

  const incomeMult = edu ? edu.multiplier : 1.0;
  const income = parseFloat(state.monthlyIncome) || 0;

  // Base estimate using income multiplier and country range
  const baseLow = Math.max(country.low, income * 6 * 0.5);
  const baseHigh = Math.max(country.high, income * 24 * incomeMult);

  const low = Math.round(Math.min(baseLow, country.high));
  const high = Math.round(baseHigh);
  const average = Math.round((low + high) / 2);

  return { country: country.label, term: country.term, low, high, average };
}

// ── FAQ Data ──
const globalFaqs = [
  {
    question: "What is the difference between bride price and dowry?",
    answer: "The key difference is the direction of payment: Bride price (lobola, caili, mahr) flows from the groom's family to the bride's family, while dowry (dahej, jahez) flows from the bride's family to the groom's family. Despite this difference, both practices can create financial burdens and have been linked to social problems. In modern discourse, both are often criticized when they become excessive, though some traditions like mahr in Islam are protected religious obligations that serve the bride's financial security.",
  },
  {
    question: "In which countries is bride price practiced?",
    answer: "Bride price is practiced in over 90 countries worldwide. Major regions include: Sub-Saharan Africa (lobola in South Africa, roora in Zimbabwe, bride price in Kenya, Uganda, Nigeria, and many other nations); East Asia (caili in China, sin sod in Thailand, bigay-kaya in the Philippines); the Islamic world (mahr in all Muslim-majority countries); and parts of Oceania and the Pacific Islands. Each culture has unique traditions, amounts, and customs surrounding the practice.",
  },
  {
    question: "How much does bride price cost in different countries?",
    answer: "Bride price varies enormously: from as little as $100 in some African and Southeast Asian communities to over $1.9 million in extreme cases reported in China. South Africa lobola typically ranges from $3,000-$30,000, Chinese caili from $1,000-$300,000+, Indian dowry from $500-$60,000+, and Islamic mahr from $50 to unlimited amounts. The actual amount depends on education, income, family status, and regional customs.",
  },
  {
    question: "Which country has the highest bride price?",
    answer: "China holds the record for the highest documented bride prices, with extreme cases exceeding $1.9 million (delivered by armored truck in Jiangxi province). In normal circumstances, Chinese caili in tier-1 cities like Beijing and Shanghai can reach $50,000-$300,000. South Korea, Japan, and parts of the Middle East also have very high marriage costs, though these often include housing costs rather than pure bride price. Among African nations, South Africa and Nigeria tend to have the highest amounts.",
  },
  {
    question: "Is bride price legal worldwide?",
    answer: "The legal status varies by country: (1) India: Dowry (bride's family to groom) is illegal under the 1961 Dowry Prohibition Act; (2) South Africa: Lobola is legal and culturally protected; (3) China: Caili is legal but government campaigns against excessive amounts; (4) Islamic countries: Mahr is a religious obligation under Sharia law; (5) Kenya/Uganda: Legal but some regulation debates; (6) Thailand/Philippines: Legal cultural practices. Many countries are actively debating regulation of excessive marriage payment practices.",
  },
  {
    question: "How are these calculators connected?",
    answer: "Our calculator network includes four specialized tools: (1) Dahej Calculator for Indian dowry, (2) Lobola Calculator for South African bride price, (3) Caili Calculator (彩礼计算器) for Chinese bride price, and (4) Mahr Calculator for Islamic marriage gift. This global comparison page ties them all together, allowing users to understand how bride price and dowry practices compare across cultures. Each calculator follows the same design principles and provides culturally relevant estimates.",
  },
  {
    question: "What is being done to address excessive bride prices globally?",
    answer: "Multiple initiatives are underway: (1) China's government campaigns against 'sky-high caili' since 2021; (2) India's Dowry Prohibition Act and Section 498A protections; (3) South African debates about lobola regulation; (4) UN Women campaigns against harmful marriage practices; (5) NGOs promoting dowry-free marriages across South Asia; (6) Islamic scholars encouraging Mahr Fatimi as a balanced amount; (7) African women's rights groups advocating for reform. The global trend is toward moderation and cultural evolution.",
  },
  {
    question: "Are these calculators accurate for actual negotiations?",
    answer: "No, these calculators provide estimates for educational and informational purposes only. Actual bride price, dowry, caili, and mahr amounts are determined through complex family negotiations, cultural traditions, and personal circumstances that cannot be captured in a simple formula. Our tools are designed to raise awareness, educate about different cultural practices, and spark meaningful conversations. They should not be used as negotiation guides.",
  },
];

// ── Component ──
export default function BridePriceCalculatorPage() {
  const [state, setState] = useState<GlobalState>({
    country: "",
    monthlyIncome: "",
    education: "",
  });
  const [result, setResult] = useState<GlobalResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const updateState = useCallback((key: keyof GlobalState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    const res = calculateGlobalBridePrice(state);
    setResult(res);
    if (res) setShowResult(true);
  }, [state]);

  const handleReset = useCallback(() => {
    setState({ country: "", monthlyIncome: "", education: "" });
    setResult(null);
    setShowResult(false);
  }, []);

  const isFormValid = useMemo(() => state.country && state.monthlyIncome && parseFloat(state.monthlyIncome) > 0, [state]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  Bride Price <span className="golden-text">Worldwide</span>
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Global Dowry & Bride Price Comparison
                </p>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a href="/">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs gap-1 cursor-pointer hover:bg-orange-200 transition-colors">
                Dahej Calculator
              </Badge>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-8xl">🌍</div>
          <div className="absolute top-20 right-20 text-6xl">💍</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">💰</div>
          <div className="absolute bottom-20 right-10 text-5xl">⚖️</div>
        </div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 text-center">
          <Badge variant="secondary" className="bg-white/80 text-orange-700 text-xs font-medium mb-6 shadow-sm">
            <Zap className="w-3 h-3 mr-1" />
            GLOBAL COMPARISON
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 leading-tight">
            Bride Price <span className="animate-rainbow">Worldwide</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Compare dowry, lobola, caili, mahr, and bride price traditions across
            90+ countries. Understand how different cultures approach marriage payments.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Globe className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">90+ Countries</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Share2 className="w-4 h-4 text-orange-600" />
              <span className="text-muted-foreground">4 Calculators</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-muted-foreground">Cultural Education</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <div className="container mx-auto px-4 py-3">
        <div className="ad-slot h-[90px]"><span>Advertisement</span></div>
      </div>

      {/* Main */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-16">

            {/* ── Our Calculator Network ── */}
            <section>
              <div className="text-center mb-10">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-medium mb-3">
                  <Calculator className="w-3 h-3 mr-1" />
                  OUR CALCULATOR NETWORK
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Try Our <span className="golden-text">Specialized Calculators</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Each calculator is tailored to a specific cultural tradition with accurate local data
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Dahej Calculator", subtitle: "India, Pakistan, Bangladesh", icon: "🇮🇳", href: "/", gradient: "from-orange-500 to-red-500" },
                  { title: "Lobola Calculator", subtitle: "South Africa, Zimbabwe", icon: "🇿🇦", href: "/lobola-calculator", gradient: "from-green-500 to-emerald-500" },
                  { title: "Caili Calculator 彩礼", subtitle: "China, Taiwan", icon: "🇨🇳", href: "/caili-calculator", gradient: "from-red-500 to-rose-500" },
                  { title: "Mahr Calculator", subtitle: "Islamic Countries", icon: "☪️", href: "/mahr-calculator", gradient: "from-amber-500 to-orange-500" },
                ].map((calc, idx) => (
                  <motion.a key={idx} href={calc.href}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    <Card className="h-full border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer">
                      <div className={`bg-gradient-to-r ${calc.gradient} p-4 text-white text-center`}>
                        <span className="text-4xl block mb-1">{calc.icon}</span>
                        <h3 className="font-bold text-lg">{calc.title}</h3>
                      </div>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-3">{calc.subtitle}</p>
                        <span className="inline-flex items-center gap-1 text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">
                          Try Calculator <ArrowRightCircle className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </motion.a>
                ))}
              </div>
            </section>

            {/* Ad Slot */}
            <div className="my-8"><div className="ad-slot h-[250px]"><span>Advertisement</span></div></div>

            {/* ── Global Comparison Table ── */}
            <section>
              <div className="text-center mb-10">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs font-medium mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  WORLDWIDE COMPARISON
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Bride Price & Dowry by <span className="golden-text">Country</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
                  Compare marriage payment traditions across different cultures
                </p>
              </div>
              <div className="space-y-4">
                {bridePriceData.map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 md:p-6 border-b">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{item.icon}</span>
                              <div>
                                <h3 className="text-lg font-bold">{item.country}</h3>
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium text-orange-600">{item.term}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 ml-12 md:ml-0">
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                                {item.direction}
                              </Badge>
                              <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs font-medium">
                                {item.rangeLow} – {item.rangeHigh}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 md:p-6 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="bg-gray-50 rounded-lg p-3 flex-1 min-w-[200px]">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Average Range</p>
                              <p className="text-sm font-bold text-foreground mt-0.5">{item.avgAmount}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 flex-1 min-w-[200px]">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Legal Status</p>
                              <p className="text-xs text-foreground mt-0.5">{item.legality}</p>
                            </div>
                            <a href={item.link} className="btn-gradient text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all">
                              Try Calculator →
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Ad Slot */}
            <div className="my-8"><div className="ad-slot h-[250px]"><span>Advertisement</span></div></div>

            {/* ── Quick Global Calculator ── */}
            <section>
              <div className="text-center mb-10">
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs font-medium mb-3">
                  <Calculator className="w-3 h-3 mr-1" />
                  QUICK ESTIMATOR
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Quick Bride Price <span className="golden-text">Estimator</span>
                </h2>
                <p className="text-muted-foreground mt-2">
                  Get a rough estimate based on country, income, and education
                </p>
              </div>

              <Card className="gradient-card border-orange-100 shadow-xl animate-pulse-glow">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">Estimate Your Bride Price</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="g-country" className="flex items-center gap-2 font-medium">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        Country
                      </Label>
                      <Select value={state.country} onValueChange={(v) => updateState("country", v)}>
                        <SelectTrigger id="g-country"><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>
                          {globalCountries.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="g-income" className="flex items-center gap-2 font-medium">
                        <DollarSign className="w-4 h-4 text-orange-500" />
                        Monthly Income (USD)
                      </Label>
                      <Input id="g-income" type="number" placeholder="e.g., 2000" value={state.monthlyIncome}
                        onChange={(e) => updateState("monthlyIncome", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="g-edu" className="flex items-center gap-2 font-medium">
                        <GraduationCap className="w-4 h-4 text-orange-500" />
                        Education Level
                      </Label>
                      <Select value={state.education} onValueChange={(v) => updateState("education", v)}>
                        <SelectTrigger id="g-edu"><SelectValue placeholder="Select education" /></SelectTrigger>
                        <SelectContent>
                          {educationMultiplier.map((e) => (
                            <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleCalculate} disabled={!isFormValid}
                      className="btn-gradient text-white flex-1 py-5 text-lg font-bold shadow-lg disabled:opacity-50"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Estimate Bride Price
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="px-6 border-orange-200 hover:bg-orange-50">
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Global Result */}
              <AnimatePresence>
                {showResult && result && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                    className="mt-8"
                  >
                    <Card className="border-orange-200 shadow-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white text-center">
                        <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                          Estimated {result.term} Range for {result.country}
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-4 max-w-lg mx-auto">
                          <div className="bg-white/10 rounded-xl p-3">
                            <p className="text-white/70 text-xs">Low Estimate</p>
                            <p className="text-xl font-bold">${result.low.toLocaleString()}</p>
                          </div>
                          <div className="bg-white/20 rounded-xl p-3">
                            <p className="text-white/70 text-xs">Average</p>
                            <p className="text-xl font-bold">${result.average.toLocaleString()}</p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-3">
                            <p className="text-white/70 text-xs">High Estimate</p>
                            <p className="text-xl font-bold">${result.high.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="pt-6 space-y-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                          className="text-center pt-2"
                        >
                          <p className="text-sm text-muted-foreground mb-3">Share this comparison!</p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            <ShareButton platform="whatsapp" text={`Bride price in ${result.country} (${result.term}) is estimated at $${result.low.toLocaleString()}-$${result.high.toLocaleString()}. Compare worldwide 👉`} pageUrl="/bride-price-calculator" />
                            <ShareButton platform="twitter" text={`Bride price in ${result.country}: $${result.low.toLocaleString()}-$${result.high.toLocaleString()}. Compare dowry, lobola, caili & mahr worldwide! #BridePrice #Worldwide`} pageUrl="/bride-price-calculator" />
                            <ShareButton platform="facebook" text={`Compare bride price worldwide: ${result.country} (${result.term}) = $${result.low.toLocaleString()}-$${result.high.toLocaleString()}`} pageUrl="/bride-price-calculator" />
                            <CopyButton text={`Bride price in ${result.country} (${result.term}): estimated $${result.low.toLocaleString()}-$${result.high.toLocaleString()}. Try the worldwide comparison at calculatedahej.com/bride-price-calculator`} />
                          </div>
                        </motion.div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                          <p className="text-amber-800 text-xs leading-relaxed">
                            <strong>Note:</strong> These are rough estimates for educational purposes. Actual amounts vary
                            significantly based on family negotiations, regional customs, and individual circumstances.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Ad Slot */}
            <div className="my-8"><div className="ad-slot h-[250px]"><span>Advertisement</span></div></div>

            {/* ── FAQ ── */}
            <section>
              <div className="text-center mb-8">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs font-medium mb-3">
                  <Info className="w-3 h-3 mr-1" />
                  FAQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">Bride Price FAQ</h2>
                <p className="text-muted-foreground mt-2">
                  Common questions about bride price, dowry, and marriage payment traditions worldwide
                </p>
              </div>
              <Accordion type="single" collapsible className="space-y-3 max-w-3xl mx-auto">
                {globalFaqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}
                    className="bg-white rounded-xl border px-6 data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org", "@type": "FAQPage",
                mainEntity: globalFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
              }) }} />
            </section>

            <div className="my-8"><div className="ad-slot h-[250px]"><span>Advertisement</span></div></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Bride Price Worldwide</h3>
                  <p className="text-xs text-gray-400">Global Comparison Tool</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                A comprehensive comparison of bride price and dowry traditions across 90+ countries.
                Educational resource for understanding marriage payment practices worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Our Calculators</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Dahej Calculator (India)</a></li>
                <li><a href="/lobola-calculator" className="hover:text-white transition-colors">Lobola Calculator (South Africa)</a></li>
                <li><a href="/caili-calculator" className="hover:text-white transition-colors">Caili Calculator (China)</a></li>
                <li><a href="/mahr-calculator" className="hover:text-white transition-colors">Mahr Calculator (Islamic)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Disclaimer</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                All calculators are for educational purposes only. Actual bride price amounts
                are determined through family negotiations and cultural traditions. These tools
                do not constitute financial, legal, or cultural advice.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Bride Price Calculator Worldwide. All rights reserved. Part of the Bride Price Calculator network.
            </p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-2">
        <div className="ad-slot h-[50px]"><span>Advertisement</span></div>
      </div>
    </div>
  );
}

// ── Share & Copy ──
function ShareButton({ platform, text, pageUrl }: { platform: string; text: string; pageUrl: string }) {
  const encodedText = encodeURIComponent(text);
  const url = encodeURIComponent(`https://www.calculatedahej.com${pageUrl}`);
  const links: Record<string, string> = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`,
  };
  const colors: Record<string, string> = {
    whatsapp: "bg-green-500 hover:bg-green-600",
    twitter: "bg-black hover:bg-gray-800",
    facebook: "bg-blue-600 hover:bg-blue-700",
  };
  const labels: Record<string, string> = { whatsapp: "WhatsApp", twitter: "X / Twitter", facebook: "Facebook" };
  return (
    <a href={links[platform]} target="_blank" rel="noopener noreferrer"
      className={`${colors[platform]} text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
    >{labels[platform]}</a>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch {
      const textarea = document.createElement("textarea"); textarea.value = text;
      document.body.appendChild(textarea); textarea.select(); document.execCommand("copy");
      document.body.removeChild(textarea); setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button onClick={handleCopy}
      className={`px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ${
        copied ? "bg-green-500 text-white" : "bg-gray-700 text-white hover:bg-gray-800"
      }`}
    >{copied ? "Copied!" : "Copy Text"}</button>
  );
}
