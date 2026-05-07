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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Sparkles,
  RotateCcw,
  ArrowRight,
  User,
  Briefcase,
  GraduationCap,
  Home,
  Car,
  MapPin,
  IndianRupee,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const professions = [
  { value: "doctor", label: "Doctor", multiplier: 3.0 },
  { value: "engineer", label: "Software Engineer / IT", multiplier: 2.8 },
  { value: "government", label: "Government Officer", multiplier: 3.2 },
  { value: "business", label: "Business Owner", multiplier: 3.5 },
  { value: "lawyer", label: "Lawyer", multiplier: 2.5 },
  { value: "teacher", label: "Teacher / Professor", multiplier: 2.0 },
  { value: "banker", label: "Banker / Finance", multiplier: 2.6 },
  { value: "accountant", label: "Accountant / CA", multiplier: 2.4 },
  { value: "police", label: "Police / Military", multiplier: 2.7 },
  { value: "farmer", label: "Farmer / Agriculture", multiplier: 1.5 },
  { value: "shopkeeper", label: "Shopkeeper / Retail", multiplier: 1.8 },
  { value: "driver", label: "Driver / Transport", multiplier: 1.2 },
  { value: "laborer", label: "Daily Wage Worker", multiplier: 0.8 },
  { value: "student", label: "Student", multiplier: 0.5 },
  { value: "unemployed", label: "Unemployed", multiplier: 0.3 },
  { value: "other", label: "Other", multiplier: 1.5 },
];

const educationLevels = [
  { value: "phd", label: "PhD / Doctorate", multiplier: 1.5 },
  { value: "masters", label: "Master's Degree", multiplier: 1.3 },
  { value: "bachelors", label: "Bachelor's Degree", multiplier: 1.1 },
  { value: "diploma", label: "Diploma", multiplier: 0.9 },
  { value: "intermediate", label: "12th / Intermediate", multiplier: 0.7 },
  { value: "matric", label: "10th / Matriculation", multiplier: 0.5 },
  { value: "below", label: "Below 10th", multiplier: 0.3 },
];

interface CalculatorState {
  age: string;
  profession: string;
  salary: string;
  education: string;
  educationExpense: string;
  maritalStatus: string;
  homeOwnership: string;
  carOwnership: string;
  location: string;
}

interface DahejResult {
  total: number;
  salaryComponent: number;
  educationComponent: number;
  propertyComponent: number;
  professionComponent: number;
  locationBonus: number;
  breakdown: { label: string; amount: number; color: string }[];
  verdict: string;
  emoji: string;
  rank: string;
}

const verdicts = [
  {
    min: 0,
    max: 500000,
    verdict: "The girl's family might actually pity you and offer help.",
    emoji: "😅",
    rank: "Humble Human",
  },
  {
    min: 500000,
    max: 2000000,
    verdict: "Modest expectations. The family will breathe a sigh of relief.",
    emoji: "😊",
    rank: "Reasonable Romeo",
  },
  {
    min: 2000000,
    max: 5000000,
    verdict: "Middle-class dreams. Prepare for some negotiation.",
    emoji: "😏",
    rank: "Aspiring Alpha",
  },
  {
    min: 5000000,
    max: 15000000,
    verdict: "Ambitious! The girl's family needs a loan approval first.",
    emoji: "🤑",
    rank: "Dowry Demander",
  },
  {
    min: 15000000,
    max: 50000000,
    verdict: "Congratulations! You've entered the 'Sell the Kidney' zone.",
    emoji: "💀",
    rank: "Shameless Sultan",
  },
  {
    min: 50000000,
    max: 100000000,
    verdict: "VIP greed detected! Family will need to sell everything they own.",
    emoji: "👁️",
    rank: "Greed Master",
  },
  {
    min: 100000000,
    max: Infinity,
    verdict: "Congrats! You've won the 'Most Absurd Expectations' award. The girl's family should flee!",
    emoji: "🏆",
    rank: "Hall of Shame Champion",
  },
];

function calculateDahej(state: CalculatorState): DahejResult | null {
  if (!state.age || !state.profession || !state.salary || !state.education) {
    return null;
  }

  const salary = parseFloat(state.salary) || 0;
  const eduExpense = parseFloat(state.educationExpense) || 0;
  const age = parseInt(state.age) || 25;

  const profData = professions.find((p) => p.value === state.profession);
  const eduData = educationLevels.find((e) => e.value === state.education);
  if (!profData || !eduData) return null;

  const profMult = profData.multiplier;
  const eduMult = eduData.multiplier;

  // Salary component: 12 months x years of earning x profession multiplier
  const yearsLeft = Math.max(0, 60 - age);
  const salaryComponent =
    salary * 12 * Math.min(yearsLeft * 0.1, 5) * profMult;

  // Education component
  const educationComponent = eduExpense * eduMult * profMult * 2;

  // Property component
  const homeValue =
    state.homeOwnership === "owned" ? 15000000 : state.homeOwnership === "mortgage" ? 8000000 : 0;
  const carValue = state.carOwnership === "yes" ? 2000000 : 0;
  const propertyComponent = (homeValue + carValue) * profMult * 0.3;

  // Profession base premium
  const professionComponent = profMult * 1000000 * 2;

  // Location bonus
  const locationMults: Record<string, number> = {
    "india-urban": 1.5,
    "india-rural": 0.8,
    "outside-india": 3.0,
  };
  const locationBonus =
    (salaryComponent + educationComponent + propertyComponent) *
    (locationMults[state.location] || 1) *
    0.2;

  const total =
    Math.round(salaryComponent + educationComponent + propertyComponent + professionComponent + locationBonus);

  const breakdown = [
    { label: "Salary Factor", amount: Math.round(salaryComponent), color: "#f97316" },
    { label: "Education Factor", amount: Math.round(educationComponent), color: "#22c55e" },
    { label: "Property Factor", amount: Math.round(propertyComponent), color: "#3b82f6" },
    { label: "Profession Premium", amount: Math.round(professionComponent), color: "#a855f7" },
    { label: "Location Bonus", amount: Math.round(locationBonus), color: "#eab308" },
  ];

  const match = verdicts.find(
    (v) => total >= v.min && total < v.max
  ) || verdicts[verdicts.length - 1];

  return {
    total,
    salaryComponent: Math.round(salaryComponent),
    educationComponent: Math.round(educationComponent),
    propertyComponent: Math.round(propertyComponent),
    professionComponent: Math.round(professionComponent),
    locationBonus: Math.round(locationBonus),
    breakdown,
    verdict: match.verdict,
    emoji: match.emoji,
    rank: match.rank,
  };
}

function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function CalculatorForm() {
  const [state, setState] = useState<CalculatorState>({
    age: "",
    profession: "",
    salary: "",
    education: "",
    educationExpense: "",
    maritalStatus: "single",
    homeOwnership: "rented",
    carOwnership: "no",
    location: "india-urban",
  });
  const [result, setResult] = useState<DahejResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const updateState = useCallback(
    (key: keyof CalculatorState, value: string) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleCalculate = useCallback(() => {
    const res = calculateDahej(state);
    setResult(res);
    if (res) {
      setShowResult(true);
    }
  }, [state]);

  const handleReset = useCallback(() => {
    setState({
      age: "",
      profession: "",
      salary: "",
      education: "",
      educationExpense: "",
      maritalStatus: "single",
      homeOwnership: "rented",
      carOwnership: "no",
      location: "india-urban",
    });
    setResult(null);
    setShowResult(false);
  }, []);

  const isFormValid = useMemo(
    () =>
      state.age &&
      state.profession &&
      state.salary &&
      parseFloat(state.salary) > 0 &&
      state.education,
    [state]
  );

  return (
    <div className="space-y-8">
      {/* Calculator Form */}
      <Card className="gradient-card border-orange-100 shadow-xl animate-pulse-glow">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-orange-100">
              <Calculator className="w-6 h-6 text-orange-600" />
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-medium">
              SATIRICAL TOOL
            </Badge>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Fill In Your &quot;Demand Sheet&quot;
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Enter your details below to calculate your satirical dowry amount
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2 font-medium">
                <User className="w-4 h-4 text-orange-500" />
                Your Age
              </Label>
              <Select
                value={state.age}
                onValueChange={(v) => updateState("age", v)}
              >
                <SelectTrigger id="age">
                  <SelectValue placeholder="Select your age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 40 }, (_, i) => i + 18).map((age) => (
                    <SelectItem key={age} value={String(age)}>
                      {age} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Profession */}
            <div className="space-y-2">
              <Label htmlFor="profession" className="flex items-center gap-2 font-medium">
                <Briefcase className="w-4 h-4 text-orange-500" />
                Profession
              </Label>
              <Select
                value={state.profession}
                onValueChange={(v) => updateState("profession", v)}
              >
                <SelectTrigger id="profession">
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary" className="flex items-center gap-2 font-medium">
                <IndianRupee className="w-4 h-4 text-orange-500" />
                Monthly Salary
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  ₹
                </span>
                <Input
                  id="salary"
                  type="number"
                  placeholder="e.g., 150000"
                  className="pl-8"
                  value={state.salary}
                  onChange={(e) => updateState("salary", e.target.value)}
                />
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education" className="flex items-center gap-2 font-medium">
                <GraduationCap className="w-4 h-4 text-orange-500" />
                Education Level
              </Label>
              <Select
                value={state.education}
                onValueChange={(v) => updateState("education", v)}
              >
                <SelectTrigger id="education">
                  <SelectValue placeholder="Select your education" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Education Expenses */}
            <div className="space-y-2">
              <Label htmlFor="eduExpense" className="flex items-center gap-2 font-medium">
                <GraduationCap className="w-4 h-4 text-orange-500" />
                Education Expenses (Total)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  ₹
                </span>
                <Input
                  id="eduExpense"
                  type="number"
                  placeholder="e.g., 1000000"
                  className="pl-8"
                  value={state.educationExpense}
                  onChange={(e) => updateState("educationExpense", e.target.value)}
                />
              </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium">
                <Heart className="w-4 h-4 text-orange-500" />
                Marital Status
              </Label>
              <RadioGroup
                value={state.maritalStatus}
                onValueChange={(v) => updateState("maritalStatus", v)}
                className="flex gap-4 mt-1"
              >
                {[
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "divorced", label: "Divorced" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <Label htmlFor={opt.value} className="cursor-pointer text-sm">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Home Ownership */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium">
                <Home className="w-4 h-4 text-orange-500" />
                Home Ownership
              </Label>
              <RadioGroup
                value={state.homeOwnership}
                onValueChange={(v) => updateState("homeOwnership", v)}
                className="flex gap-4 mt-1"
              >
                {[
                  { value: "owned", label: "Owned" },
                  { value: "mortgage", label: "Mortgage" },
                  { value: "rented", label: "Rented" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={`home-${opt.value}`} />
                    <Label htmlFor={`home-${opt.value}`} className="cursor-pointer text-sm">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Car */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium">
                <Car className="w-4 h-4 text-orange-500" />
                Own a Car?
              </Label>
              <RadioGroup
                value={state.carOwnership}
                onValueChange={(v) => updateState("carOwnership", v)}
                className="flex gap-4 mt-1"
              >
                {[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={`car-${opt.value}`} />
                    <Label htmlFor={`car-${opt.value}`} className="cursor-pointer text-sm">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Location */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-orange-500" />
                Location
              </Label>
              <RadioGroup
                value={state.location}
                onValueChange={(v) => updateState("location", v)}
                className="flex flex-wrap gap-4 mt-1"
              >
                {[
                  { value: "india-urban", label: "India - Urban" },
                  { value: "india-rural", label: "India - Rural" },
                  { value: "outside-india", label: "Outside India (NRI)" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={`loc-${opt.value}`} />
                    <Label htmlFor={`loc-${opt.value}`} className="cursor-pointer text-sm">
                      {opt.label}
                    </Label>
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
              Calculate Dahej
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

      {/* Result Display */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          >
            <Card className="border-orange-200 shadow-2xl overflow-hidden">
              {/* Result Header */}
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
                  Your Satirical Dahej Amount
                </p>
                <motion.h2
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
                  className="text-4xl md:text-5xl font-black mt-2 animate-count-up"
                >
                  {formatINR(result.total)}
                </motion.h2>
                <Badge className="mt-3 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
                  {result.rank}
                </Badge>
              </div>

              <CardContent className="pt-6 space-y-6">
                {/* Verdict */}
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
                  <h3 className="text-lg font-bold mb-4 text-center">
                    Dowry Breakdown
                  </h3>
                  <div className="space-y-3">
                    {result.breakdown.map((item, idx) => {
                      const pct =
                        result.total > 0
                          ? ((item.amount / result.total) * 100).toFixed(1)
                          : 0;
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
                              {formatINR(item.amount)} ({pct}%)
                            </span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                delay: 0.9 + idx * 0.1,
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Share Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="text-center pt-4"
                >
                  <p className="text-sm text-muted-foreground mb-3">
                    Share your result and spread awareness!
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <ShareButton
                      platform="whatsapp"
                      text={`My satirical dahej amount is ${formatINR(result.total)}! ${result.verdict} Try the Dahej Calculator 👉`}
                    />
                    <ShareButton
                      platform="twitter"
                      text={`My satirical dahej amount is ${formatINR(result.total)}! ${result.verdict} #DahejCalculator #StopDowry`}
                    />
                    <ShareButton
                      platform="facebook"
                      text={`My satirical dahej amount is ${formatINR(result.total)}! ${result.verdict}`}
                    />
                    <CopyButton
                      text={`My satirical dahej amount is ${formatINR(result.total)}! ${result.verdict} Try the Dahej Calculator at calculatedahej.com`}
                    />
                  </div>
                </motion.div>

                {/* Disclaimer in result */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                  <p className="text-red-700 text-xs leading-relaxed">
                    <strong>Disclaimer:</strong> This calculator is purely satirical and
                    is intended to highlight the absurdity of dowry practices. Dowry is
                    illegal in India under the Dowry Prohibition Act of 1961. We strongly
                    support the elimination of dowry practices and advocate for gender
                    equality.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShareButton({
  platform,
  text,
}: {
  platform: string;
  text: string;
}) {
  const encodedText = encodeURIComponent(text);
  const url = encodeURIComponent("https://www.calculatedahej.com");

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
      // Fallback for browsers without clipboard API
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
        copied
          ? "bg-green-500 text-white"
          : "bg-gray-700 text-white hover:bg-gray-800"
      }`}
    >
      {copied ? "Copied!" : "Copy Text"}
    </button>
  );
}
