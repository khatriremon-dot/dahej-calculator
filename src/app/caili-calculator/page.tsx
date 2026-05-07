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
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
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
  Home,
  Car,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Constants ──
const provinces = [
  { value: "jiangxi", label: "Jiangxi (江西)", base: 200000 },
  { value: "fujian", label: "Fujian (福建)", base: 180000 },
  { value: "zhejiang", label: "Zhejiang (浙江)", base: 200000 },
  { value: "shandong", label: "Shandong (山东)", base: 100000 },
  { value: "henan", label: "Henan (河南)", base: 80000 },
  { value: "guangdong", label: "Guangdong (广东)", base: 50000 },
  { value: "sichuan", label: "Sichuan (四川)", base: 60000 },
  { value: "hubei", label: "Hubei (湖北)", base: 70000 },
  { value: "anhui", label: "Anhui (安徽)", base: 80000 },
  { value: "hebei", label: "Hebei (河北)", base: 60000 },
  { value: "chongqing", label: "Chongqing (重庆)", base: 30000 },
  { value: "beijing", label: "Beijing (北京)", base: 250000 },
  { value: "shanghai", label: "Shanghai (上海)", base: 300000 },
];

const locationTypes = [
  { value: "urban", label: "Urban (城市)", multiplier: 1.5 },
  { value: "rural", label: "Rural (农村)", multiplier: 0.8 },
];

const educationLevels = [
  { value: "high-school", label: "High School (高中)", multiplier: 1.0 },
  { value: "bachelors", label: "Bachelor's (本科)", multiplier: 1.3 },
  { value: "masters", label: "Master's (硕士)", multiplier: 1.5 },
  { value: "phd", label: "PhD (博士)", multiplier: 1.8 },
];

const employmentTypes = [
  { value: "soe", label: "State-owned Enterprise (国企)", multiplier: 1.4 },
  { value: "private", label: "Private Sector (私企)", multiplier: 1.2 },
  { value: "civil", label: "Civil Servant (公务员)", multiplier: 1.5 },
  { value: "self", label: "Self-Employed (自雇)", multiplier: 1.1 },
  { value: "teacher", label: "Teacher (教师)", multiplier: 1.2 },
  { value: "student", label: "Student (学生)", multiplier: 0.8 },
];

// ── Types ──
interface CailiState {
  province: string;
  locationType: string;
  education: string;
  employment: string;
  ownHouse: string;
  ownCar: string;
  brideOnlyChild: string;
  groomOnlyChild: string;
}

interface CailiResult {
  totalCNY: number;
  totalUSD: number;
  baseAmount: number;
  locationBonus: number;
  educationBonus: number;
  employmentBonus: number;
  propertyBonus: number;
  onlyChildBonus: number;
  breakdown: { label: string; amount: number; color: string }[];
  verdict: string;
  emoji: string;
  rank: string;
}

// ── Helpers ──
const USD_RATE = 7.25; // approximate CNY to USD

function calculateCaili(state: CailiState): CailiResult | null {
  if (!state.province || !state.locationType || !state.education || !state.employment) return null;

  const prov = provinces.find((p) => p.value === state.province);
  const loc = locationTypes.find((l) => l.value === state.locationType);
  const edu = educationLevels.find((e) => e.value === state.education);
  const emp = employmentTypes.find((e) => e.value === state.employment);
  if (!prov || !loc || !edu || !emp) return null;

  const baseAmount = prov.base;
  const locationBonus = baseAmount * (loc.multiplier - 1);
  const educationBonus = baseAmount * (edu.multiplier - 1);
  const employmentBonus = baseAmount * (emp.multiplier - 1);

  const propertyBonus = (state.ownHouse === "yes" ? 50000 : 0) + (state.ownCar === "yes" ? 30000 : 0);

  const onlyChildMultiplier =
    (state.brideOnlyChild === "yes" ? 1.1 : 1.0) * (state.groomOnlyChild === "yes" ? 1.15 : 1.0);
  const subtotal = baseAmount + locationBonus + educationBonus + employmentBonus + propertyBonus;
  const onlyChildBonus = subtotal * (onlyChildMultiplier - 1);

  const totalCNY = Math.round(subtotal * onlyChildMultiplier);
  const totalUSD = Math.round(totalCNY / USD_RATE);

  const breakdown = [
    { label: "Province Base (省份基础)", amount: Math.round(baseAmount), color: "#f97316" },
    { label: "Location Factor (城乡差异)", amount: Math.round(locationBonus), color: "#22c55e" },
    { label: "Education Factor (学历加分)", amount: Math.round(educationBonus), color: "#3b82f6" },
    { label: "Employment Factor (职业加分)", amount: Math.round(employmentBonus), color: "#a855f7" },
    { label: "Property Bonus (房车加分)", amount: Math.round(propertyBonus), color: "#eab308" },
    { label: "Only Child Bonus (独生子女)", amount: Math.round(onlyChildBonus), color: "#ec4899" },
  ];

  let verdict: string, emoji: string, rank: string;
  if (totalCNY < 50000) {
    verdict = "In some areas, this is considered a symbolic caili. The focus is on love, not money.";
    emoji = "😊";
    rank = "Symbolic Match (象征性彩礼)";
  } else if (totalCNY < 100000) {
    verdict = "A moderate amount that respects tradition without excessive burden. Common in many provinces.";
    emoji = "💪";
    rank = "Reasonable Amount (合理范围)";
  } else if (totalCNY < 200000) {
    verdict = "This is a typical amount in many Chinese provinces. Prepare for some serious saving!";
    emoji = "🎯";
    rank = "Standard Range (标准范围)";
  } else if (totalCNY < 500000) {
    verdict = "High-end territory! Common in tier-1 cities and provinces with strong caili traditions.";
    emoji = "💰";
    rank = "Premium Range (高端范围)";
  } else {
    verdict = "Top tier! This level is seen in extreme cases reported in the news. The government has called for reductions.";
    emoji = "👑";
    rank = "Sky-High Level (天价彩礼)";
  }

  return {
    totalCNY, totalUSD,
    baseAmount: Math.round(baseAmount),
    locationBonus: Math.round(locationBonus),
    educationBonus: Math.round(educationBonus),
    employmentBonus: Math.round(employmentBonus),
    propertyBonus: Math.round(propertyBonus),
    onlyChildBonus: Math.round(onlyChildBonus),
    breakdown, verdict, emoji, rank,
  };
}

function formatCNY(amount: number): string {
  if (amount >= 10000) {
    const wan = amount / 10000;
    return `¥${wan % 1 === 0 ? wan.toFixed(0) : wan.toFixed(1)}万`;
  }
  return `¥${amount.toLocaleString("zh-CN")}`;
}

// ── FAQ Data ──
const cailiFaqs = [
  {
    question: "What is Caili (彩礼)?",
    answer: "Caili (彩礼) is the Chinese bride price tradition where the groom's family gives money or goods to the bride's family before or during the wedding. The practice has been part of Chinese culture for thousands of years and is deeply rooted in Confucian values of filial piety and family respect. In modern times, caili has become a significant social issue due to rapidly escalating amounts, particularly in rural areas where the gender imbalance created by the one-child policy has made finding a bride more competitive.",
  },
  {
    question: "How much is Caili in different provinces?",
    answer: "Caili amounts vary dramatically by province. According to recent surveys, average caili ranges from ¥30,000 in Chongqing to ¥300,000 in Shanghai. Provinces like Jiangxi, Fujian, and Zhejiang are known for high caili, while Guangdong and Chongqing tend to have lower amounts. In rural areas of Jiangxi and Anhui, caili can consume several years of a family's income. The Chinese government has published guidelines urging families to keep caili below ¥100,000 in most regions.",
  },
  {
    question: "Is Caili legal in China?",
    answer: "Caili is not illegal in China, but the government has taken steps to curb excessive amounts. In 2024, the central government launched nationwide campaigns against 'sky-high caili' (天价彩礼), calling it a social evil that burdens young people. Several provinces have issued local regulations and guidelines suggesting maximum amounts. However, enforcement is challenging as caili remains deeply embedded in cultural traditions. Courts can intervene in disputes over unreasonable caili demands under civil law principles.",
  },
  {
    question: "Why has Caili become so expensive?",
    answer: "Several factors have driven caili inflation: (1) Gender imbalance from the one-child policy, with an estimated 30 million more men than women of marriageable age; (2) Social comparison and 'face' culture (面子文化) where families compete to show status; (3) Economic development creating wealth disparities between families; (4) Real estate requirements where owning a house and car are often prerequisites; (5) Declining marriage rates making competition for brides more intense; (6) Commercialization of weddings turning marriage into a status display. The government has identified these factors and is working on multi-pronged solutions.",
  },
  {
    question: "What is the difference between Caili and Dowry?",
    answer: "Caili flows from the groom's family to the bride's family, while dowry (as practiced in India) flows from the bride's family to the groom's family. Caili is given as a sign of respect and gratitude to the bride's parents for raising her. In contrast, dowry has been criticized for placing financial burden on the bride's family. However, both practices can create financial pressure and have been linked to social problems when amounts become excessive.",
  },
  {
    question: "Is this Caili calculator accurate?",
    answer: "This calculator provides estimates based on publicly reported average caili amounts by province and commonly considered factors. Actual caili amounts vary significantly based on family negotiations, local customs, and individual circumstances. This tool is for educational and informational purposes only and should not be used as a guide for actual caili negotiations. Always respect family traditions and local customs when discussing marriage arrangements.",
  },
  {
    question: "What is the Chinese government doing about excessive Caili?",
    answer: "The Chinese government has launched multiple initiatives: (1) National campaigns against 'sky-high caili' since 2021; (2) Model marriage guidelines issued by the Ministry of Civil Affairs; (3) Local regulations in provinces like Hebei, Jiangxi, and Ganso setting suggested maximums; (4) Promotion of new marriage customs including group weddings and zero-caili marriages; (5) Legal support for brides to return excessive caili in case of divorce; (6) Education campaigns through media and community outreach. The goal is to reduce the financial burden while respecting cultural traditions.",
  },
  {
    question: "Does Caili need to be returned after divorce?",
    answer: "Under Chinese law, there are specific rules about caili return after divorce. Generally, if the couple did not register the marriage, the caili must be returned in full. If they registered but did not live together, it must generally be returned. If the caili caused financial hardship for the payer, courts may order partial or full return. The Supreme People's Court has issued detailed judicial interpretations on this matter. These rules aim to prevent caili from becoming a tool for financial exploitation.",
  },
];

const culturalFacts = [
  {
    icon: Landmark,
    title: "Ancient Roots (历史悠久)",
    text: "Caili has been part of Chinese marriage customs for over 2,000 years. It originated from the 'Six Etiquettes' (六礼) of traditional Chinese weddings, where the groom's family presented gifts to the bride's family as a formal marriage proposal.",
  },
  {
    icon: TrendingUp,
    title: "Rising Costs (彩礼上涨)",
    text: "Caili has increased dramatically in recent decades. In some rural areas, caili can equal 10-20 years of a farmer's annual income. In one extreme case, a man delivered $1.9 million in cash and gold bars by armored truck to his fiancée's family in Jiangxi province.",
  },
  {
    icon: Globe,
    title: "Government Response (政府行动)",
    text: "Since 2021, the Chinese government has been actively campaigning against 'sky-high caili' (天价彩礼). Multiple provinces have issued guidelines suggesting maximum amounts, typically between ¥30,000 and ¥100,000 depending on the region.",
  },
  {
    icon: Heart,
    title: "New Marriage Customs (移风易俗)",
    text: "Many young Chinese couples are now choosing 'zero-caili' (零彩礼) marriages, where the groom pays a symbolic amount or nothing at all. Group weddings organized by local governments are becoming popular as an alternative to expensive traditional ceremonies.",
  },
  {
    icon: Shield,
    title: "Legal Protection (法律保护)",
    text: "Chinese courts have established clear rules for caili return in divorce cases. If the couple never registered their marriage, or if the payment caused the groom severe financial hardship, courts can order full or partial return of the caili amount.",
  },
  {
    icon: User,
    title: "Gender Imbalance (性别失衡)",
    text: "China's gender imbalance from the one-child policy has created approximately 30 million more men than women of marriageable age. This demographic reality has driven caili inflation, particularly in rural areas where the competition for brides is most intense.",
  },
];

// ── Component ──
export default function CailiCalculatorPage() {
  const [state, setState] = useState<CailiState>({
    province: "",
    locationType: "",
    education: "",
    employment: "",
    ownHouse: "no",
    ownCar: "no",
    brideOnlyChild: "no",
    groomOnlyChild: "no",
  });
  const [result, setResult] = useState<CailiResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const updateState = useCallback((key: keyof CailiState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    const res = calculateCaili(state);
    setResult(res);
    if (res) setShowResult(true);
  }, [state]);

  const handleReset = useCallback(() => {
    setState({
      province: "", locationType: "", education: "", employment: "",
      ownHouse: "no", ownCar: "no", brideOnlyChild: "no", groomOnlyChild: "no",
    });
    setResult(null);
    setShowResult(false);
  }, []);

  const isFormValid = useMemo(
    () => state.province && state.locationType && state.education && state.employment,
    [state]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-md">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  <span className="golden-text">彩礼计算器</span> Caili Calculator
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Bride Price Calculator China
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
          <div className="absolute top-10 left-10 text-8xl">🧧</div>
          <div className="absolute top-20 right-20 text-6xl">💍</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🇨🇳</div>
          <div className="absolute bottom-20 right-10 text-5xl">💰</div>
        </div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 text-center">
          <Badge variant="secondary" className="bg-white/80 text-red-700 text-xs font-medium mb-6 shadow-sm">
            <Zap className="w-3 h-3 mr-1" />
            CHINESE BRIDE PRICE CALCULATOR
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 leading-tight">
            <span className="animate-rainbow">彩礼</span> (Caili) Calculator
            <br className="hidden sm:block" />
            <span className="text-2xl md:text-3xl">Calculate Bride Price in China</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Estimate your caili (彩礼) based on province, education, employment, and more.
            Understand this important Chinese marriage tradition.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">Educational Tool</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Share2 className="w-4 h-4 text-orange-600" />
              <span className="text-muted-foreground">Shareable Results</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-muted-foreground">13 Provinces</span>
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
          <div className="max-w-5xl mx-auto">
            {/* Calculator */}
            <Card className="gradient-card border-orange-100 shadow-xl animate-pulse-glow">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="p-2 rounded-full bg-red-100">
                    <Calculator className="w-6 h-6 text-red-600" />
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs font-medium">
                    彩礼计算器
                  </Badge>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Calculate Your Caili Estimate
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Enter details below to estimate the bride price amount
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Province */}
                  <div className="space-y-2">
                    <Label htmlFor="province" className="flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      Province (省份)
                    </Label>
                    <Select value={state.province} onValueChange={(v) => updateState("province", v)}>
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Type */}
                  <div className="space-y-2">
                    <Label htmlFor="locationType" className="flex items-center gap-2 font-medium">
                      <Globe className="w-4 h-4 text-orange-500" />
                      Location Type (城乡)
                    </Label>
                    <Select value={state.locationType} onValueChange={(v) => updateState("locationType", v)}>
                      <SelectTrigger id="locationType">
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationTypes.map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <Label htmlFor="edu" className="flex items-center gap-2 font-medium">
                      <GraduationCap className="w-4 h-4 text-orange-500" />
                      Bride&apos;s Education (学历)
                    </Label>
                    <Select value={state.education} onValueChange={(v) => updateState("education", v)}>
                      <SelectTrigger id="edu">
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
                    <Label htmlFor="emp" className="flex items-center gap-2 font-medium">
                      <Briefcase className="w-4 h-4 text-orange-500" />
                      Bride&apos;s Employment (职业)
                    </Label>
                    <Select value={state.employment} onValueChange={(v) => updateState("employment", v)}>
                      <SelectTrigger id="emp">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((e) => (
                          <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Own House */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-medium">
                      <Home className="w-4 h-4 text-orange-500" />
                      Groom Owns House? (有房?)
                    </Label>
                    <RadioGroup value={state.ownHouse} onValueChange={(v) => updateState("ownHouse", v)} className="flex gap-4 mt-1">
                      {[
                        { value: "yes", label: "Yes (有)" },
                        { value: "no", label: "No (没有)" },
                      ].map((opt) => (
                        <div key={opt.value} className="flex items-center gap-2">
                          <RadioGroupItem value={opt.value} id={`house-${opt.value}`} />
                          <Label htmlFor={`house-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Own Car */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-medium">
                      <Car className="w-4 h-4 text-orange-500" />
                      Groom Owns Car? (有车?)
                    </Label>
                    <RadioGroup value={state.ownCar} onValueChange={(v) => updateState("ownCar", v)} className="flex gap-4 mt-1">
                      {[
                        { value: "yes", label: "Yes (有)" },
                        { value: "no", label: "No (没有)" },
                      ].map((opt) => (
                        <div key={opt.value} className="flex items-center gap-2">
                          <RadioGroupItem value={opt.value} id={`car-${opt.value}`} />
                          <Label htmlFor={`car-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Bride Only Child */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-medium">
                      <User className="w-4 h-4 text-orange-500" />
                      Bride Only Child? (独生女?)
                    </Label>
                    <RadioGroup value={state.brideOnlyChild} onValueChange={(v) => updateState("brideOnlyChild", v)} className="flex gap-4 mt-1">
                      {[
                        { value: "yes", label: "Yes (是)" },
                        { value: "no", label: "No (否)" },
                      ].map((opt) => (
                        <div key={opt.value} className="flex items-center gap-2">
                          <RadioGroupItem value={opt.value} id={`bo-${opt.value}`} />
                          <Label htmlFor={`bo-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Groom Only Child */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-medium">
                      <User className="w-4 h-4 text-orange-500" />
                      Groom Only Child? (独生子?)
                    </Label>
                    <RadioGroup value={state.groomOnlyChild} onValueChange={(v) => updateState("groomOnlyChild", v)} className="flex gap-4 mt-1">
                      {[
                        { value: "yes", label: "Yes (是)" },
                        { value: "no", label: "No (否)" },
                      ].map((opt) => (
                        <div key={opt.value} className="flex items-center gap-2">
                          <RadioGroupItem value={opt.value} id={`go-${opt.value}`} />
                          <Label htmlFor={`go-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
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
                    计算彩礼 Calculate Caili
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
                    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-6 text-white text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-6xl mb-3">
                        {result.emoji}
                      </motion.div>
                      <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Estimated Caili (预估彩礼)</p>
                      <motion.h2
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
                        className="text-4xl md:text-5xl font-black mt-2 animate-count-up"
                      >
                        {formatCNY(result.totalCNY)}
                      </motion.h2>
                      <p className="text-white/90 mt-2 text-lg">≈ ${result.totalUSD.toLocaleString()} USD</p>
                      <Badge className="mt-3 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
                        {result.rank}
                      </Badge>
                    </div>

                    <CardContent className="pt-6 space-y-6">
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                        className="bg-red-50 border border-red-100 rounded-xl p-4 text-center"
                      >
                        <p className="text-foreground font-medium italic">&quot;{result.verdict}&quot;</p>
                      </motion.div>

                      {/* Breakdown */}
                      <div>
                        <h3 className="text-lg font-bold mb-4 text-center">Caili Breakdown (彩礼明细)</h3>
                        <div className="space-y-3">
                          {result.breakdown.map((item, idx) => {
                            const pct = result.totalCNY > 0 ? ((item.amount / result.totalCNY) * 100).toFixed(1) : 0;
                            return (
                              <motion.div key={item.label} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + idx * 0.1 }} className="space-y-1"
                              >
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{item.label}</span>
                                  <span className="font-bold text-orange-700">
                                    {formatCNY(item.amount)} ({pct}%)
                                  </span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                    transition={{ delay: 0.9 + idx * 0.1, duration: 0.6, ease: "easeOut" }}
                                    className="h-full rounded-full" style={{ backgroundColor: item.color }}
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Share */}
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="text-center pt-4">
                        <p className="text-sm text-muted-foreground mb-3">Share your caili estimate! (分享结果)</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          <ShareButton platform="whatsapp" text={`My estimated caili is ${formatCNY(result.totalCNY)}! Try the Caili Calculator 👉`} pageUrl="/caili-calculator" />
                          <ShareButton platform="twitter" text={`My estimated caili is ${formatCNY(result.totalCNY)} (~$${result.totalUSD} USD)! #CailiCalculator #彩礼计算器`} pageUrl="/caili-calculator" />
                          <ShareButton platform="facebook" text={`My estimated caili is ${formatCNY(result.totalCNY)}!`} pageUrl="/caili-calculator" />
                          <CopyButton text={`My estimated caili (彩礼) is ${formatCNY(result.totalCNY)} (~$${result.totalUSD} USD). Try the Caili Calculator at calculatedahej.com/caili-calculator`} />
                        </div>
                      </motion.div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                        <p className="text-amber-800 text-xs leading-relaxed">
                          <strong>Note:</strong> This calculator provides estimates for educational purposes only.
                          Actual caili amounts are determined through family negotiations. The Chinese government
                          encourages reasonable caili amounts and has launched campaigns against excessive demands.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ad Slot */}
            <div className="my-8"><div className="ad-slot h-[250px]"><span>Advertisement</span></div></div>

            {/* Cultural Facts */}
            <section className="py-12">
              <div className="text-center mb-10">
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs font-medium mb-3">
                  <BookOpen className="w-3 h-3 mr-1" />
                  关于彩礼 CULTURAL EDUCATION
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Understanding <span className="golden-text">Caili (彩礼)</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Learn about the cultural significance, history, and modern debate around Chinese bride price
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {culturalFacts.map((fact, idx) => {
                  const Icon = fact.icon;
                  return (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="border-orange-100 hover:shadow-lg transition-shadow h-full">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <Icon className="w-6 h-6 text-red-600" />
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
            <div className="my-8"><div className="ad-slot h-[250px]"><span>Advertisement</span></div></div>

            {/* FAQ */}
            <section className="py-12">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs font-medium mb-3">
                  <Info className="w-3 h-3 mr-1" />
                  常见问题 FAQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">Caili FAQ / 彩礼常见问题</h2>
                <p className="text-muted-foreground mt-2">
                  Common questions about caili, Chinese bride price, and marriage customs
                </p>
              </div>
              <Accordion type="single" collapsible className="space-y-3 max-w-3xl mx-auto">
                {cailiFaqs.map((faq, idx) => (
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
                mainEntity: cailiFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">彩礼计算器 Caili Calculator</h3>
                  <p className="text-xs text-gray-400">Chinese Bride Price Tool</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                An educational tool to understand caili (彩礼) traditions in Chinese culture.
                For informational purposes only. 彩礼计算器仅供教育参考。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Other Calculators</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Dahej Calculator (India)</a></li>
                <li><a href="/lobola-calculator" className="hover:text-white transition-colors">Lobola Calculator (South Africa)</a></li>
                <li><a href="/mahr-calculator" className="hover:text-white transition-colors">Mahr Calculator (Islamic)</a></li>
                <li><a href="/bride-price-calculator" className="hover:text-white transition-colors">Bride Price Worldwide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Disclaimer (声明)</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                This calculator is for educational purposes only. Actual caili amounts are determined
                through family negotiations. 本计算器仅供教育用途，实际彩礼金额由家庭协商确定。
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Caili Calculator (彩礼计算器). All rights reserved. Part of the Bride Price Calculator network.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Ad */}
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
