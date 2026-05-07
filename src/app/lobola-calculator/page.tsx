"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Heart,
  Shield,
  TrendingUp,
  Globe,
  BookOpen,
  Zap,
  Share2,
  Landmark,
  DollarSign,
  Baby,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Constants ──
const educationLevels = [
  { value: "high-school", label: "High School / Matric", multiplier: 1.2 },
  { value: "diploma", label: "Diploma / Certificate", multiplier: 1.5 },
  { value: "bachelors", label: "Bachelor's Degree", multiplier: 1.8 },
  { value: "masters", label: "Master's Degree", multiplier: 2.2 },
  { value: "phd", label: "PhD / Doctorate", multiplier: 2.5 },
];

const employmentTypes = [
  { value: "employed", label: "Employed (Full-time)", bonus: 15000 },
  { value: "self-employed", label: "Self-Employed / Business", bonus: 20000 },
  { value: "student", label: "Student", bonus: 5000 },
  { value: "unemployed", label: "Unemployed", bonus: 0 },
];

const financialStatus = [
  { value: "low", label: "Low Income", multiplier: 0.7 },
  { value: "middle", label: "Middle Income", multiplier: 1.0 },
  { value: "high", label: "High Income", multiplier: 1.5 },
];

const regions = [
  { value: "gauteng", label: "Gauteng", factor: 1.4 },
  { value: "kzn", label: "KwaZulu-Natal (KZN)", factor: 1.2 },
  { value: "western-cape", label: "Western Cape", factor: 1.3 },
  { value: "limpopo", label: "Limpopo", factor: 0.8 },
  { value: "free-state", label: "Free State", factor: 0.9 },
  { value: "mpumalanga", label: "Mpumalanga", factor: 0.85 },
];

const CATTLE_PRICE = 7000;
const BASE_AMOUNT = 30000;

// ── Types ──
interface LobolaState {
  education: string;
  employment: string;
  age: string;
  children: string;
  financialStatus: string;
  region: string;
}

interface LobolaResult {
  total: number;
  cattleCount: number;
  baseAmount: number;
  educationAmount: number;
  employmentAmount: number;
  regionAmount: number;
  childrenAmount: number;
  breakdown: { label: string; amount: number; color: string }[];
  verdict: string;
  emoji: string;
  rank: string;
}

// ── Helpers ──
function calculateLobola(state: LobolaState): LobolaResult | null {
  if (!state.education || !state.employment || !state.age || !state.financialStatus || !state.region) {
    return null;
  }

  const edu = educationLevels.find((e) => e.value === state.education);
  const emp = employmentTypes.find((e) => e.value === state.employment);
  const fin = financialStatus.find((f) => f.value === state.financialStatus);
  const reg = regions.find((r) => r.value === state.region);
  if (!edu || !emp || !fin || !reg) return null;

  const educationAmount = BASE_AMOUNT * (edu.multiplier - 1);
  const employmentAmount = emp.bonus * fin.multiplier;
  const regionAmount = (BASE_AMOUNT + educationAmount + employmentAmount) * (reg.factor - 1);

  const childrenMultiplier: Record<string, number> = { "0": 0, "1": 5000, "2": 12000, "3": 25000 };
  const childrenAmount = childrenMultiplier[state.children] || 0;

  const total = Math.round(
    BASE_AMOUNT + educationAmount + employmentAmount + regionAmount + childrenAmount
  );
  const cattleCount = Math.floor(total / CATTLE_PRICE);

  const breakdown = [
    { label: "Base Lobola Amount", amount: Math.round(BASE_AMOUNT), color: "#f97316" },
    { label: "Education Factor", amount: Math.round(educationAmount), color: "#22c55e" },
    { label: "Employment Bonus", amount: Math.round(employmentAmount), color: "#3b82f6" },
    { label: "Region Factor", amount: Math.round(regionAmount), color: "#a855f7" },
    { label: "Children Factor", amount: Math.round(childrenAmount), color: "#eab308" },
  ];

  let verdict: string, emoji: string, rank: string;
  if (total < 50000) {
    verdict = "Congratulations! You've put a 'modest' price tag on a human being. The ancestors are thrilled that love now comes with a receipt.";
    emoji = "😱";
    rank = "Bargain Hunter";
  } else if (total < 80000) {
    verdict = "Ah, the 'reasonable' range — because nothing says 'I love you' quite like a five-figure invoice handed to your in-laws.";
    emoji = "😬";
    rank = "Moderately Absurd";
  } else if (total < 120000) {
    verdict = "At this price, you could've bought a car instead. But sure, let's keep pretending that attaching a price to a person is totally normal.";
    emoji = "🏎️";
    rank = "Walking ATM";
  } else if (total < 200000) {
    verdict = "You're now in 'small house deposit' territory. Nothing screams romance like forcing a man to prove his love through financial devastation.";
    emoji = "🏦";
    rank = "Financially Ruined Groom";
  } else {
    verdict = "The ancestors are wheezing. At this price, you could've funded a university degree. But why invest in education when you can auction off a bride?";
    emoji = "💀";
    rank = "Peak Absurdity";
  }

  return {
    total, cattleCount, baseAmount: Math.round(BASE_AMOUNT),
    educationAmount: Math.round(educationAmount),
    employmentAmount: Math.round(employmentAmount),
    regionAmount: Math.round(regionAmount),
    childrenAmount: Math.round(childrenAmount),
    breakdown, verdict, emoji, rank,
  };
}

function formatZAR(amount: number): string {
  return `R${amount.toLocaleString("en-ZA")}`;
}

// ── FAQ Data ──
const lobolaFaqs = [
  {
    question: "What is Lobola (Lobolo)?",
    answer: "Lobola is a Southern African tradition where a groom's family pays the bride's family — usually in cattle or cash — as a 'token of appreciation.' Because nothing says 'we value your daughter' quite like literally pricing her in livestock. While proponents call it 'uniting two families,' critics point out that it effectively treats women as commodities with a market value. How romantic.",
  },
  {
    question: "How is Lobola calculated?",
    answer: "Traditionally, lobola was calculated in cattle heads (typically 11 for Zulu families). Today, families negotiate based on the bride's education, character, and family status — because apparently a PhD makes you a more expensive human being. Our satirical calculator mimics this absurd pricing system to show how ridiculous it is to attach a monetary value to a person.",
  },
  {
    question: "How much does Lobola cost in South Africa?",
    answer: "Anywhere from R30,000 to R200,000+, which is coincidentally the price range of a decent car. In Gauteng, lobola amounts tend to be higher — presumably because Jozi women are 'premium' human beings. The fact that we can even discuss a 'going rate' for a person should tell you everything you need to know about why this practice needs critical reexamination.",
  },
  {
    question: "Can Lobola be paid in cash instead of cattle?",
    answer: "Yes! Welcome to the modern era, where we've upgraded from literally trading cattle for humans to trading fiat currency for humans. Progress! One cattle is roughly R7,000-R10,000, so a 'standard' lobola of 11 cattle could set you back R77,000-R110,000. For that price, you could buy actual cattle and start a farm — or you could just, you know, treat your partner as an equal.",
  },
  {
    question: "What is the legal status of Lobola in South Africa?",
    answer: "Lobola is legally protected under the Recognition of Customary Marriages Act of 1998. So yes, it's perfectly legal to negotiate a price for a human being as long as you call it 'tradition.' The Constitutional Court has upheld this practice while encouraging 'reasonable negotiations' — which is like telling someone 'it's fine to haggle over a person, just don't be greedy about it.'",
  },
  {
    question: "What happens if the groom cannot afford the Lobola?",
    answer: "Ah, the classic catch-22: if you can't afford lobola, you can't get married. Families may enter 'extended negotiations' or 'payment plans' — because installment plans for a human being are totally not alarming. Some couples choose symbolic amounts, proving that the tradition can evolve when people use common sense. Imagine that.",
  },
  {
    question: "Is this Lobola calculator accurate?",
    answer: "About as accurate as using a Ouija board to pick your life partner. This is a SATIRICAL tool designed to expose how absurd it is to calculate the 'price' of a human being based on their education, region, and employment status. If you're actually using this to negotiate lobola, we have some concerns.",
  },
  {
    question: "What is the difference between Lobola and Dowry?",
    answer: "Lobola flows from groom's family to bride's family (paying for the bride), while dowry flows from bride's family to groom's family (paying to get rid of the bride). Both traditions involve treating marriage as a financial transaction centered on the woman's 'value.' One direction makes the bride a purchased asset; the other makes her a financial burden. Neither is exactly a glowing endorsement of gender equality.",
  },
];

const culturalFacts = [
  {
    icon: Landmark,
    title: "Ancient Tradition",
    text: "Lobola has been practiced for centuries across Southern Africa. It predates written history and is one of the most enduring African customs, symbolizing the deep respect for family unity and the value placed on women in African society.",
  },
  {
    icon: Heart,
    title: "Family Union",
    text: "Unlike many other bride price traditions, lobola is fundamentally about uniting two families. The negotiation process (ukulobola) involves extended family members from both sides and can take weeks or even months to complete.",
  },
  {
    icon: DollarSign,
    title: "Modern Evolution",
    text: "While traditionally paid in cattle, modern lobola increasingly involves cash payments. The cattle equivalent remains important symbolically, with one cattle typically valued at R7,000 to R10,000. Some families maintain a hybrid approach.",
  },
  {
    icon: Globe,
    title: "Regional Variations",
    text: "Lobola practices vary significantly across South Africa's provinces. Zulu families in KZN may request 11 cattle, while Xhosa families in the Eastern Cape have different customs. Gauteng and Western Cape tend to have higher cash amounts due to urban cost of living.",
  },
  {
    icon: Shield,
    title: "Legal Protection",
    text: "Under the Recognition of Customary Marriages Act of 1998, lobola is legally recognized in South Africa. The Constitutional Court has upheld lobola as a protected cultural practice while encouraging reasonable negotiations.",
  },
  {
    icon: TrendingUp,
    title: "Changing Times",
    text: "Modern couples are increasingly discussing lobola openly, with many choosing symbolic amounts that honor tradition without creating financial burden. Women's education and economic empowerment are also shifting the dynamics of lobola negotiations.",
  },
];

// ── Component ──
export default function LobolaCalculatorPage() {
  const [state, setState] = useState<LobolaState>({
    education: "",
    employment: "",
    age: "",
    children: "0",
    financialStatus: "",
    region: "",
  });
  const [result, setResult] = useState<LobolaResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const updateState = useCallback((key: keyof LobolaState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    const res = calculateLobola(state);
    setResult(res);
    if (res) setShowResult(true);
  }, [state]);

  const handleReset = useCallback(() => {
    setState({
      education: "", employment: "", age: "", children: "0",
      financialStatus: "", region: "",
    });
    setResult(null);
    setShowResult(false);
  }, []);

  const isFormValid = useMemo(
    () => state.education && state.employment && state.age && state.financialStatus && state.region,
    [state]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  <span className="golden-text">Lobola</span> Calculator
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Bride Price Calculator South Africa
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
          <div className="absolute top-10 left-10 text-8xl">🐄</div>
          <div className="absolute top-20 right-20 text-6xl">💍</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🇿🇦</div>
          <div className="absolute bottom-20 right-10 text-5xl">💰</div>
        </div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 text-center">
          <Badge variant="secondary" className="bg-white/80 text-orange-700 text-xs font-medium mb-6 shadow-sm">
            <Zap className="w-3 h-3 mr-1" />
            SATIRICAL TOOL FOR SOCIAL AWARENESS
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 leading-tight">
            How Much <span className="animate-rainbow">Lobola</span>
            <br className="hidden sm:block" />
            Should You Pay?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Calculate an estimated lobola (bride price) based on education,
            employment, region and more. A fun tool to understand this
            beautiful African tradition.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">Cultural Education</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Share2 className="w-4 h-4 text-orange-600" />
              <span className="text-muted-foreground">Shareable Results</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-muted-foreground">Estimate Only</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <div className="container mx-auto px-4 py-3">
        <div className="ad-slot h-[90px]">
          <span>Advertisement</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Calculator Form */}
            <Card className="gradient-card border-orange-100 shadow-xl animate-pulse-glow">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="p-2 rounded-full bg-orange-100">
                    <Calculator className="w-6 h-6 text-orange-600" />
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-medium">
                    LOBOLA ESTIMATOR
                  </Badge>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Calculate Your Lobola Estimate
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Enter the bride&apos;s details below to estimate the lobola amount
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Education */}
                  <div className="space-y-2">
                    <Label htmlFor="education" className="flex items-center gap-2 font-medium">
                      <GraduationCap className="w-4 h-4 text-orange-500" />
                      Bride&apos;s Education Level
                    </Label>
                    <Select value={state.education} onValueChange={(v) => updateState("education", v)}>
                      <SelectTrigger id="education">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((e) => (
                          <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Employment */}
                  <div className="space-y-2">
                    <Label htmlFor="employment" className="flex items-center gap-2 font-medium">
                      <Briefcase className="w-4 h-4 text-orange-500" />
                      Bride&apos;s Employment Status
                    </Label>
                    <Select value={state.employment} onValueChange={(v) => updateState("employment", v)}>
                      <SelectTrigger id="employment">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((e) => (
                          <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2 font-medium">
                      <User className="w-4 h-4 text-orange-500" />
                      Bride&apos;s Age
                    </Label>
                    <Select value={state.age} onValueChange={(v) => updateState("age", v)}>
                      <SelectTrigger id="age">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 33 }, (_, i) => i + 18).map((age) => (
                          <SelectItem key={age} value={String(age)}>{age} years</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Children */}
                  <div className="space-y-2">
                    <Label htmlFor="children" className="flex items-center gap-2 font-medium">
                      <Baby className="w-4 h-4 text-orange-500" />
                      Number of Children
                    </Label>
                    <Select value={state.children} onValueChange={(v) => updateState("children", v)}>
                      <SelectTrigger id="children">
                        <SelectValue placeholder="Select number of children" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { value: "0", label: "No children" },
                          { value: "1", label: "1 child" },
                          { value: "2", label: "2 children" },
                          { value: "3", label: "3 or more children" },
                        ].map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Financial Status */}
                  <div className="space-y-2">
                    <Label htmlFor="financial" className="flex items-center gap-2 font-medium">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      Groom&apos;s Financial Status
                    </Label>
                    <Select value={state.financialStatus} onValueChange={(v) => updateState("financialStatus", v)}>
                      <SelectTrigger id="financial">
                        <SelectValue placeholder="Select financial status" />
                      </SelectTrigger>
                      <SelectContent>
                        {financialStatus.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Region */}
                  <div className="space-y-2">
                    <Label htmlFor="region" className="flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      Region
                    </Label>
                    <Select value={state.region} onValueChange={(v) => updateState("region", v)}>
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Select province/region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCalculate}
                    disabled={!isFormValid}
                    className="btn-gradient text-white flex-1 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Calculate Lobola
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="px-6 py-6 border-orange-200 hover:bg-orange-50"
                    size="lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            <AnimatePresence>
              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                  className="mt-8"
                >
                  <Card className="border-orange-200 shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                        className="text-6xl mb-3"
                      >
                        {result.emoji}
                      </motion.div>
                      <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                        Estimated Lobola Amount
                      </p>
                      <motion.h2
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
                        className="text-4xl md:text-5xl font-black mt-2 animate-count-up"
                      >
                        {formatZAR(result.total)}
                      </motion.h2>
                      <Badge className="mt-3 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
                        {result.rank}
                      </Badge>
                      <div className="mt-3 flex items-center justify-center gap-2 text-white/90">
                        <span className="text-3xl">🐂</span>
                        <span className="text-lg font-bold">
                          ~{result.cattleCount} Cattle (at R{CATTLE_PRICE.toLocaleString()}/head)
                        </span>
                      </div>
                    </div>

                    <CardContent className="pt-6 space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center"
                      >
                        <p className="text-foreground font-medium italic">
                          &quot;{result.verdict}&quot;
                        </p>
                      </motion.div>

                      {/* Breakdown */}
                      <div>
                        <h3 className="text-lg font-bold mb-4 text-center">Lobola Breakdown</h3>
                        <div className="space-y-3">
                          {result.breakdown.map((item, idx) => {
                            const pct = result.total > 0 ? ((item.amount / result.total) * 100).toFixed(1) : 0;
                            return (
                              <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + idx * 0.1 }}
                                className="space-y-1"
                              >
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{item.label}</span>
                                  <span className="font-bold text-orange-700">
                                    {formatZAR(item.amount)} ({pct}%)
                                  </span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ delay: 0.9 + idx * 0.1, duration: 0.6, ease: "easeOut" }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Share */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="text-center pt-4"
                      >
                        <p className="text-sm text-muted-foreground mb-3">Share your lobola estimate!</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          <ShareButton platform="whatsapp" text={`My estimated lobola is ${formatZAR(result.total)} (~${result.cattleCount} cattle)! Try the Lobola Calculator 👉`} />
                          <ShareButton platform="twitter" text={`My estimated lobola is ${formatZAR(result.total)} (~${result.cattleCount} cattle)! #LobolaCalculator #SouthAfrica`} />
                          <ShareButton platform="facebook" text={`My estimated lobola is ${formatZAR(result.total)} (~${result.cattleCount} cattle)!`} />
                          <CopyButton text={`My estimated lobola is ${formatZAR(result.total)} (~${result.cattleCount} cattle)! Try the Lobola Calculator at calculatedahej.com/lobola-calculator`} />
                        </div>
                      </motion.div>

                      {/* Disclaimer */}
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                        <p className="text-red-800 text-xs leading-relaxed">
                          <strong>IMPORTANT DISCLAIMER:</strong> This calculator is <strong>purely satirical</strong> and intended to highlight the absurdity
                          of treating marriage as a financial transaction. Lobola should never reduce a human being to a price tag.
                          We support relationships built on mutual respect and equality, not cattle-head calculations.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ad Slot */}
            <div className="my-8">
              <div className="ad-slot h-[250px]">
                <span>Advertisement</span>
              </div>
            </div>

            {/* Cultural Facts */}
            <section className="py-12">
              <div className="text-center mb-10">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-medium mb-3">
                  <BookOpen className="w-3 h-3 mr-1" />
                  CULTURAL EDUCATION
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Understanding <span className="golden-text">Lobola</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Learn about the rich cultural significance of this African tradition
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {culturalFacts.map((fact, idx) => {
                  const Icon = fact.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="border-orange-100 hover:shadow-lg transition-shadow h-full">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                            <Icon className="w-6 h-6 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-bold mb-3">{fact.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{fact.text}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Ad Slot */}
            <div className="my-8">
              <div className="ad-slot h-[250px]">
                <span>Advertisement</span>
              </div>
            </div>

            {/* FAQ */}
            <section className="py-12">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs font-medium mb-3">
                  <Info className="w-3 h-3 mr-1" />
                  FREQUENTLY ASKED QUESTIONS
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">Lobola FAQ</h2>
                <p className="text-muted-foreground mt-2">
                  Common questions about lobola, bride price, and African marriage traditions
                </p>
              </div>
              <Accordion type="single" collapsible className="space-y-3 max-w-3xl mx-auto">
                {lobolaFaqs.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="bg-white rounded-xl border px-6 data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {/* JSON-LD FAQ Schema */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: lobolaFaqs.map((faq) => ({
                      "@type": "Question",
                      name: faq.question,
                      acceptedAnswer: { "@type": "Answer", text: faq.answer },
                    })),
                  }),
                }}
              />
            </section>

            {/* Ad Slot */}
            <div className="my-8">
              <div className="ad-slot h-[250px]">
                <span>Advertisement</span>
              </div>
            </div>
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
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Lobola Calculator</h3>
                  <p className="text-xs text-gray-400">South African Bride Price Tool</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                A satirical tool created to raise awareness about the problematic nature of bride price practices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Other Calculators</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Dahej Calculator (India)</a></li>
                <li><a href="/caili-calculator" className="hover:text-white transition-colors">Caili Calculator (China)</a></li>
                <li><a href="/mahr-calculator" className="hover:text-white transition-colors">Mahr Calculator (Islamic)</a></li>
                <li><a href="/bride-price-calculator" className="hover:text-white transition-colors">Bride Price Worldwide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Disclaimer</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                This calculator is <strong>purely satirical</strong> and does not promote or endorse the commodification of marriage.
                All calculations are fictional. We advocate for relationships based on equality, not transactions.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Lobola Calculator. All rights reserved. Part of the Bride Price Calculator network.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Ad */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-2">
        <div className="ad-slot h-[50px]">
          <span>Advertisement</span>
        </div>
      </div>
    </div>
  );
}

// ── Share & Copy Buttons ──
function ShareButton({ platform, text }: { platform: string; text: string }) {
  const encodedText = encodeURIComponent(text);
  const url = encodeURIComponent("https://www.calculatedahej.com/lobola-calculator");

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

  const labels: Record<string, string> = {
    whatsapp: "WhatsApp",
    twitter: "X / Twitter",
    facebook: "Facebook",
  };

  return (
    <a
      href={links[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className={`${colors[platform]} text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
    >
      {labels[platform]}
    </a>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ${
        copied ? "bg-green-500 text-white" : "bg-gray-700 text-white hover:bg-gray-800"
      }`}
    >
      {copied ? "Copied!" : "Copy Text"}
    </button>
  );
}
