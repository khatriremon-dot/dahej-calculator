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
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
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
  Info,
  Coins,
  Gem,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Constants ──
const mahrTypes = [
  {
    value: "fatimi",
    label: "Mahr Fatimi (مهر فاطمي)",
    description: "The mahr of Hazrat Fatima (RA), daughter of Prophet Muhammad (PBUH)",
    silverGrams: 1470,
    goldGrams: 1750,
    dirhams: 400,
  },
  {
    value: "minimum",
    label: "Mahr Minimum (أقل المهر)",
    description: "The minimum mahr according to Islamic law",
    silverGrams: 30.6,
    goldGrams: 36.4,
    dirhams: 10,
  },
  {
    value: "azwaj",
    label: "Mahr al-Azwaj (مهر الأزواج)",
    description: "The mahr given by Prophet Muhammad (PBUH) to his wives",
    silverGrams: 1531,
    goldGrams: 1825,
    dirhams: 500,
  },
  {
    value: "custom",
    label: "Custom Amount",
    description: "Enter a custom mahr amount",
    silverGrams: 0,
    goldGrams: 0,
    dirhams: 0,
  },
];

const currencies = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "GBP", label: "GBP (£)", symbol: "£" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "SAR", label: "SAR (ر.س)", symbol: "SAR " },
  { value: "AED", label: "AED (د.إ)", symbol: "AED " },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" },
  { value: "INR", label: "INR (₹)", symbol: "₹" },
  { value: "MYR", label: "MYR (RM)", symbol: "RM" },
  { value: "IDR", label: "IDR (Rp)", symbol: "Rp" },
];

const DEFAULT_GOLD_PRICE = 65; // $/gram
const DEFAULT_SILVER_PRICE = 0.85; // $/gram

// Exchange rates to USD (approximate, for reference)
const currencyRates: Record<string, number> = {
  USD: 1, GBP: 0.79, EUR: 0.92, SAR: 3.75, AED: 3.67,
  PKR: 278, INR: 83.5, MYR: 4.47, IDR: 15750,
};

// ── Types ──
interface MahrState {
  mahrType: string;
  metalPreference: string;
  currency: string;
  goldPrice: string;
  silverPrice: string;
  customAmount: string;
}

interface MahrResult {
  amountInCurrency: number;
  currencySymbol: string;
  goldEquivalent: number;
  silverEquivalent: number;
  mahrTypeName: string;
  silverGrams: number;
  goldGrams: number;
  dirhams: number;
  verdict: string;
  emoji: string;
}

// ── Helpers ──
function calculateMahr(state: MahrState): MahrResult | null {
  if (!state.mahrType || !state.currency) return null;

  const type = mahrTypes.find((t) => t.value === state.mahrType);
  const curr = currencies.find((c) => c.value === state.currency);
  if (!type || !curr) return null;

  let silverGrams = type.silverGrams;
  let goldGrams = type.goldGrams;
  let dirhams = type.dirhams;

  // Custom amount in the selected currency, converted to silver/gold
  if (state.mahrType === "custom") {
    const customAmt = parseFloat(state.customAmount) || 0;
    if (customAmt <= 0) return null;

    const rate = currencyRates[state.currency] || 1;
    const amountUSD = customAmt / rate;
    const goldPrice = parseFloat(state.goldPrice) || DEFAULT_GOLD_PRICE;
    const silverPrice = parseFloat(state.silverPrice) || DEFAULT_SILVER_PRICE;

    goldGrams = amountUSD / goldPrice;
    silverGrams = amountUSD / silverPrice;
    dirhams = Math.round(silverGrams / 3.07); // 1 dirham ≈ 3.07g silver

    // Calculate in selected currency
    return {
      amountInCurrency: customAmt,
      currencySymbol: curr.symbol,
      goldEquivalent: parseFloat(goldGrams.toFixed(2)),
      silverEquivalent: parseFloat(silverGrams.toFixed(2)),
      mahrTypeName: "Custom Mahr",
      silverGrams: parseFloat(silverGrams.toFixed(2)),
      goldGrams: parseFloat(goldGrams.toFixed(2)),
      dirhams,
      verdict: `Your custom mahr of ${curr.symbol}${customAmt.toLocaleString()} is equivalent to ${goldGrams.toFixed(2)} grams of gold or ${silverGrams.toFixed(2)} grams of silver.`,
      emoji: "✨",
    };
  }

  // Preset types
  const goldPrice = parseFloat(state.goldPrice) || DEFAULT_GOLD_PRICE;
  const silverPrice = parseFloat(state.silverPrice) || DEFAULT_SILVER_PRICE;

  let amountUSD = 0;
  if (state.metalPreference === "gold") {
    amountUSD = goldGrams * goldPrice;
  } else if (state.metalPreference === "silver") {
    amountUSD = silverGrams * silverPrice;
  } else {
    // Cash - average of gold and silver value
    amountUSD = (goldGrams * goldPrice + silverGrams * silverPrice) / 2;
  }

  const rate = currencyRates[state.currency] || 1;
  const amountInCurrency = amountUSD * rate;

  const verdicts: Record<string, { text: string; emoji: string }> = {
    fatimi: {
      text: "Mahr Fatimi is the most recommended mahr in Islam, being the amount given by the Prophet (PBUH) to his beloved daughter Hazrat Fatima (RA). It represents a balanced and blessed amount.",
      emoji: "🌙",
    },
    minimum: {
      text: "The minimum mahr is 10 silver Dirhams (~30.6g silver), as established in Islamic law. While permissible, scholars encourage giving a reasonable amount that reflects the groom's means.",
      emoji: "📖",
    },
    azwaj: {
      text: "Mahr al-Azwaj (500 Dirhams) represents the amount the Prophet Muhammad (PBUH) gave to his wives. It is considered a generous and Sunnah-compliant amount.",
      emoji: "⭐",
    },
  };

  const v = verdicts[state.mahrType] || { text: "", emoji: "✨" };

  return {
    amountInCurrency: parseFloat(amountInCurrency.toFixed(2)),
    currencySymbol: curr.symbol,
    goldEquivalent: parseFloat(((goldGrams * goldPrice) / goldPrice).toFixed(2)),
    silverEquivalent: parseFloat(((silverGrams * silverPrice) / silverPrice).toFixed(2)),
    mahrTypeName: type.label,
    silverGrams: parseFloat(silverGrams.toFixed(2)),
    goldGrams: parseFloat(goldGrams.toFixed(2)),
    dirhams,
    verdict: v.text,
    emoji: v.emoji,
  };
}

function formatCurrency(amount: number, symbol: string, currency: string): string {
  if (currency === "IDR" || currency === "PKR") {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── FAQ Data ──
const mahrFaqs = [
  {
    question: "What is Mahr (Mehr) in Islam?",
    answer: "Mahr (مهر) is a mandatory payment from the groom to the bride in Islamic marriages. It is an un conditional gift that becomes the bride's exclusive property upon marriage. Mahr serves as a financial security and a symbol of the groom's commitment. It is one of the essential elements of a valid Islamic marriage contract (nikah). Unlike dowry, which flows from the bride's family to the groom, mahr is the groom's obligation to the bride alone.",
  },
  {
    question: "What is Mahr Fatimi?",
    answer: "Mahr Fatimi is the mahr given by Prophet Muhammad (PBUH) to his daughter Hazrat Fatima (RA) upon her marriage to Hazrat Ali (RA). It is approximately 400 silver Dirhams, which equals about 1,470 grams of silver or 1,750 grams of gold (using historical conversion rates). Mahr Fatimi is widely considered the most recommended amount by Islamic scholars as it was practiced by the Prophet's own family and represents a balanced, blessed amount.",
  },
  {
    question: "What is the minimum Mahr in Islam?",
    answer: "According to Islamic law, the minimum mahr is 10 silver Dirhams, which is approximately 30.6 grams of silver. This was established by the Prophet Muhammad (PBUH). However, scholars encourage the groom to give an amount that is reasonable according to his financial capacity. There is no maximum limit for mahr — it can be as much as the couple agrees upon, though the Prophet (PBUH) discouraged setting excessively high amounts that create hardship.",
  },
  {
    question: "Can Mahr be paid later (deferred)?",
    answer: "Yes, mahr can be split into two parts: Mahr Mu'ajjal (مهر معجل - prompt/advance) paid at the time of marriage, and Mahr Mu'akkhar (مهر مؤخر - deferred) paid at a later date, typically upon divorce or the husband's death. Many couples choose a combination of both, with a portion paid immediately and the remainder deferred. The deferred portion serves as important financial protection for the bride, especially in case of divorce or the husband's death.",
  },
  {
    question: "What is the difference between Mahr and Dowry?",
    answer: "Mahr and dowry are fundamentally different: (1) Direction: Mahr flows from groom to bride, while dowry flows from bride's family to groom's family. (2) Ownership: Mahr belongs exclusively to the bride, while dowry becomes the groom/family's property. (3) Nature: Mahr is a religious obligation in Islam, while dowry is a cultural practice. (4) Purpose: Mahr provides financial security to the bride, while dowry historically served different purposes across cultures. (5) Negotiation: Mahr is agreed upon by the couple, while dowry demands are often imposed by the groom's family.",
  },
  {
    question: "How is Mahr calculated in gold and silver?",
    answer: "Mahr is traditionally calculated based on the weight of silver Dirhams. Historically, 1 silver Dirham weighs approximately 3.07 grams. For Mahr Fatimi (400 Dirhams), this equals approximately 1,228 to 1,470 grams of silver depending on the historical standard used. The gold equivalent is calculated based on the silver-to-gold ratio, which historically was approximately 1:7. Some scholars use different ratios, so you may see slight variations in gold equivalent amounts.",
  },
  {
    question: "Is Mahr negotiable between the couple?",
    answer: "Yes, mahr is absolutely negotiable. In fact, the bride (or her wali/guardian) has the right to set, negotiate, or waive the mahr. Islam encourages setting a reasonable amount based on the groom's financial capacity. Hazrat Ali (RA) once offered his shield as mahr to Hazrat Fatima (RA), showing that mahr can even be a symbolic item of value. The key principle is that both parties should agree willingly and without coercion.",
  },
  {
    question: "What happens to Mahr in case of divorce?",
    answer: "If divorce occurs before the marriage is consummated, the wife is entitled to half of the mahr (unless she waives it). After consummation, she is entitled to the full mahr, whether it was paid promptly or deferred. If the mahr was deferred and divorce occurs, the wife can claim the deferred portion. If the husband dies, the deferred mahr becomes a debt owed by his estate and is paid before the inheritance is distributed. These rules are clearly established in the Quran (2:237) and Islamic jurisprudence.",
  },
];

const educationalContent = [
  {
    icon: BookOpen,
    title: "Quranic Foundation",
    text: "Mahr is explicitly mentioned in the Quran: 'And give the women [upon marriage] their [bridal] gifts graciously. But if they give up willingly to you anything of it, then take it in satisfaction and ease.' (Quran 4:4). This establishes mahr as a divine obligation, not merely a cultural practice.",
  },
  {
    icon: Gem,
    title: "Types of Mahr",
    text: "There are several forms mahr can take: (1) Mahr Mu'ajjal (prompt) - paid at the time of marriage; (2) Mahr Mu'akkhar (deferred) - paid later, usually upon divorce or death; (3) Mahr Musamma (named) - a specific amount stated in the marriage contract; (4) Mahr Mithl (equivalent) - an amount typical for women of similar status in the community.",
  },
  {
    icon: Star,
    title: "Mahr in the Prophet's Time",
    text: "The Prophet Muhammad (PBUH) set various mahr amounts. For his daughter Fatima (RA), he gave 400 silver Dirhams. For his wives, the mahr ranged from 400-500 Dirhams. The minimum he permitted was 10 Dirhams. When a companion wanted to give an extravagant mahr, the Prophet (PBUH) said: 'There is no blessing in extravagant mahr.'",
  },
  {
    icon: Coins,
    title: "Modern Mahr Practices",
    text: "Today, mahr amounts vary widely across Muslim communities. In South Asian countries, mahr often includes both cash and gold jewelry. In Gulf countries, mahr can range from a few thousand to millions of dirhams. In Western countries, couples often choose moderate amounts in local currency. Many Islamic scholars encourage returning to the Sunnah of Mahr Fatimi as a balanced approach.",
  },
  {
    icon: Shield,
    title: "Bride's Financial Protection",
    text: "Mahr serves as an important financial protection for Muslim women. The deferred portion (mahr mu'akkhar) acts as a financial safeguard in case of divorce or the husband's death. This is particularly important in societies where women may have limited economic opportunities. Islam designed mahr as a woman's right, not a family entitlement — it belongs exclusively to the bride.",
  },
  {
    icon: Globe,
    title: "Global Mahr Calculator",
    text: "Our calculator supports 9 major currencies including USD, GBP, EUR, SAR, AED, PKR, INR, MYR, and IDR. This allows Muslims worldwide to calculate mahr amounts in their local currency while understanding the gold and silver equivalents. The calculator uses approximate precious metal prices that can be customized for accuracy.",
  },
];

// ── Component ──
export default function MahrCalculatorPage() {
  const [state, setState] = useState<MahrState>({
    mahrType: "",
    metalPreference: "gold",
    currency: "USD",
    goldPrice: String(DEFAULT_GOLD_PRICE),
    silverPrice: String(DEFAULT_SILVER_PRICE),
    customAmount: "",
  });
  const [result, setResult] = useState<MahrResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const updateState = useCallback((key: keyof MahrState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    const res = calculateMahr(state);
    setResult(res);
    if (res) setShowResult(true);
  }, [state]);

  const handleReset = useCallback(() => {
    setState({
      mahrType: "", metalPreference: "gold", currency: "USD",
      goldPrice: String(DEFAULT_GOLD_PRICE), silverPrice: String(DEFAULT_SILVER_PRICE), customAmount: "",
    });
    setResult(null);
    setShowResult(false);
  }, []);

  const isFormValid = useMemo(() => {
    if (!state.mahrType || !state.currency) return false;
    if (state.mahrType === "custom" && (!state.customAmount || parseFloat(state.customAmount) <= 0)) return false;
    return true;
  }, [state]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  <span className="golden-text">Mahr</span> Calculator
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Islamic Marriage Gift Calculator
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
          <div className="absolute top-10 left-10 text-8xl">☪️</div>
          <div className="absolute top-20 right-20 text-6xl">💍</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🌙</div>
          <div className="absolute bottom-20 right-10 text-5xl">✨</div>
        </div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 text-center">
          <Badge variant="secondary" className="bg-white/80 text-amber-700 text-xs font-medium mb-6 shadow-sm">
            <Zap className="w-3 h-3 mr-1" />
            ISLAMIC MAHR CALCULATOR
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 leading-tight">
            Calculate <span className="animate-rainbow">Mahr</span> (Mehr)
            <br className="hidden sm:block" />
            <span className="text-2xl md:text-3xl">Islamic Marriage Gift</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Calculate Mahr Fatimi, Mahr Minimum, or custom amounts in gold,
            silver, and 9 currencies. Learn about this important Islamic obligation.
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
              <span className="text-muted-foreground">9 Currencies</span>
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
                  <div className="p-2 rounded-full bg-amber-100">
                    <Calculator className="w-6 h-6 text-amber-600" />
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs font-medium">
                    مهر CALCULATOR
                  </Badge>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  Calculate Your Mahr
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Choose a mahr type and calculate the amount in your preferred currency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mahr Type */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="mahrType" className="flex items-center gap-2 font-medium">
                      <Star className="w-4 h-4 text-amber-500" />
                      Mahr Type (نوع المهر)
                    </Label>
                    <Select value={state.mahrType} onValueChange={(v) => updateState("mahrType", v)}>
                      <SelectTrigger id="mahrType">
                        <SelectValue placeholder="Select mahr type" />
                      </SelectTrigger>
                      <SelectContent>
                        {mahrTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label} — {t.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="flex items-center gap-2 font-medium">
                      <Coins className="w-4 h-4 text-amber-500" />
                      Currency (العملة)
                    </Label>
                    <Select value={state.currency} onValueChange={(v) => updateState("currency", v)}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Metal Preference (not for custom) */}
                  {state.mahrType && state.mahrType !== "custom" && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 font-medium">
                        <Gem className="w-4 h-4 text-amber-500" />
                        Calculate In (حساب)
                      </Label>
                      <RadioGroup value={state.metalPreference} onValueChange={(v) => updateState("metalPreference", v)} className="flex flex-wrap gap-3 mt-1">
                        {[
                          { value: "gold", label: "Gold (ذهب)" },
                          { value: "silver", label: "Silver (فضة)" },
                          { value: "cash", label: "Cash Average (نقدي)" },
                        ].map((opt) => (
                          <div key={opt.value} className="flex items-center gap-2">
                            <RadioGroupItem value={opt.value} id={`metal-${opt.value}`} />
                            <Label htmlFor={`metal-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Custom Amount */}
                  {state.mahrType === "custom" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="customAmount" className="flex items-center gap-2 font-medium">
                        <Coins className="w-4 h-4 text-amber-500" />
                        Custom Mahr Amount (مبلغ مخصص)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                          {currencies.find((c) => c.value === state.currency)?.symbol || "$"}
                        </span>
                        <Input id="customAmount" type="number" placeholder="Enter custom amount"
                          className="pl-12" value={state.customAmount}
                          onChange={(e) => updateState("customAmount", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Gold Price */}
                  <div className="space-y-2">
                    <Label htmlFor="goldPrice" className="flex items-center gap-2 font-medium">
                      <span className="text-amber-500">🥇</span>
                      Gold Price ($/gram)
                    </Label>
                    <Input id="goldPrice" type="number" placeholder={String(DEFAULT_GOLD_PRICE)}
                      value={state.goldPrice} onChange={(e) => updateState("goldPrice", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Default: ~${DEFAULT_GOLD_PRICE}/gram (approximate)</p>
                  </div>

                  {/* Silver Price */}
                  <div className="space-y-2">
                    <Label htmlFor="silverPrice" className="flex items-center gap-2 font-medium">
                      <span className="text-gray-400">🥈</span>
                      Silver Price ($/gram)
                    </Label>
                    <Input id="silverPrice" type="number" placeholder={String(DEFAULT_SILVER_PRICE)}
                      value={state.silverPrice} onChange={(e) => updateState("silverPrice", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Default: ~${DEFAULT_SILVER_PRICE}/gram (approximate)</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCalculate} disabled={!isFormValid}
                    className="btn-gradient text-white flex-1 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Calculate Mahr
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button onClick={handleReset} variant="outline"
                    className="px-6 py-6 border-orange-200 hover:bg-orange-50" size="lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            <AnimatePresence>
              {showResult && result && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                  className="mt-8"
                >
                  <Card className="border-amber-200 shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-6xl mb-3"
                      >{result.emoji}</motion.div>
                      <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                        {result.mahrTypeName}
                      </p>
                      <motion.h2 initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
                        className="text-4xl md:text-5xl font-black mt-2 animate-count-up"
                      >
                        {formatCurrency(result.amountInCurrency, result.currencySymbol, state.currency)}
                      </motion.h2>

                      <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg mx-auto">
                        <div className="bg-white/10 rounded-xl p-3">
                          <p className="text-white/70 text-xs">Gold Equivalent</p>
                          <p className="text-lg font-bold">{result.goldEquivalent.toLocaleString()}g</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3">
                          <p className="text-white/70 text-xs">Silver Equivalent</p>
                          <p className="text-lg font-bold">{result.silverEquivalent.toLocaleString()}g</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3">
                          <p className="text-white/70 text-xs">Dirhams</p>
                          <p className="text-lg font-bold">{result.dirhams}</p>
                        </div>
                      </div>
                    </div>

                    <CardContent className="pt-6 space-y-6">
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                        className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center"
                      >
                        <p className="text-foreground font-medium italic">&quot;{result.verdict}&quot;</p>
                      </motion.div>

                      {/* Share */}
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }} className="text-center pt-4"
                      >
                        <p className="text-sm text-muted-foreground mb-3">Share your mahr calculation!</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          <ShareButton platform="whatsapp" text={`My Mahr calculation: ${result.mahrTypeName} = ${formatCurrency(result.amountInCurrency, result.currencySymbol, state.currency)} (${result.goldEquivalent}g gold). Try the Mahr Calculator 👉`} pageUrl="/mahr-calculator" />
                          <ShareButton platform="twitter" text={`My Mahr calculation: ${result.mahrTypeName} = ${formatCurrency(result.amountInCurrency, result.currencySymbol, state.currency)} (${result.goldEquivalent}g gold). #MahrCalculator #IslamicMarriage`} pageUrl="/mahr-calculator" />
                          <ShareButton platform="facebook" text={`Mahr Calculator: ${result.mahrTypeName} = ${formatCurrency(result.amountInCurrency, result.currencySymbol, state.currency)}`} pageUrl="/mahr-calculator" />
                          <CopyButton text={`Mahr Calculator: ${result.mahrTypeName} = ${formatCurrency(result.amountInCurrency, result.currencySymbol, state.currency)} (${result.goldEquivalent}g gold / ${result.silverEquivalent}g silver / ${result.dirhams} dirhams). Try it at calculatedahej.com/mahr-calculator`} />
                        </div>
                      </motion.div>

                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-green-800 text-xs leading-relaxed">
                          <strong>Note:</strong> This calculator provides estimates for educational purposes. Actual mahr should be agreed upon by the couple and their families.
                          Consult with a qualified Islamic scholar for guidance on mahr amounts. Gold and silver prices are approximate and should be verified with current market rates.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ad Slot */}
            <div className="my-8"><div className="ad-slot h-[250px]"><span>Advertisement</span></div></div>

            {/* Educational Content */}
            <section className="py-12">
              <div className="text-center mb-10">
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs font-medium mb-3">
                  <BookOpen className="w-3 h-3 mr-1" />
                  ABOUT MAHR
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Understanding <span className="golden-text">Mahr in Islam</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Learn about the Islamic obligation of Mahr and its significance in marriage
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {educationalContent.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="border-amber-100 hover:shadow-lg transition-shadow h-full">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                            <Icon className="w-6 h-6 text-amber-600" />
                          </div>
                          <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
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
                  FAQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">Mahr FAQ</h2>
                <p className="text-muted-foreground mt-2">
                  Common questions about Mahr, Mehr, and Islamic marriage
                </p>
              </div>
              <Accordion type="single" collapsible className="space-y-3 max-w-3xl mx-auto">
                {mahrFaqs.map((faq, idx) => (
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
                mainEntity: mahrFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Mahr Calculator</h3>
                  <p className="text-xs text-gray-400">Islamic Marriage Gift Tool</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                An educational tool to help understand Mahr (مهر) in Islamic marriages.
                For informational purposes only. Please consult a qualified Islamic scholar for guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Other Calculators</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Dahej Calculator (India)</a></li>
                <li><a href="/lobola-calculator" className="hover:text-white transition-colors">Lobola Calculator (South Africa)</a></li>
                <li><a href="/caili-calculator" className="hover:text-white transition-colors">Caili Calculator (China)</a></li>
                <li><a href="/bride-price-calculator" className="hover:text-white transition-colors">Bride Price Worldwide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Disclaimer</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                This calculator provides estimates for educational purposes only. Mahr amounts should be
                agreed upon by the couple and their families. Consult a qualified Islamic scholar for proper guidance.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Mahr Calculator. All rights reserved. Part of the Bride Price Calculator network.
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
