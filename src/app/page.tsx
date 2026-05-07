import CalculatorForm from "@/components/dahej/calculator-form";
import Leaderboard from "@/components/dahej/leaderboard";
import SeoContent from "@/components/dahej/seo-content";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Shield,
  Zap,
  Share2,
  TrendingUp,
  Globe,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                Dahej <span className="golden-text">Calculator</span>
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Satirical Social Awareness Tool
              </p>
            </div>
          </div>
          {/* Nav Dropdown - Other Calculators */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-orange-50">
                <Globe className="w-4 h-4" />
                <span>Calculators</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <a href="/lobola-calculator" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 text-sm transition-colors">
                    <span>🇿🇦</span><span>Lobola Calculator (SA)</span>
                  </a>
                  <a href="/caili-calculator" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 text-sm transition-colors">
                    <span>🇨🇳</span><span>Caili Calculator (China)</span>
                  </a>
                  <a href="/mahr-calculator" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 text-sm transition-colors">
                    <span>☪️</span><span>Mahr Calculator (Islamic)</span>
                  </a>
                  <a href="/bride-price-calculator" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 text-sm transition-colors">
                    <span>🌍</span><span>Bride Price Worldwide</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:flex bg-orange-100 text-orange-700 text-xs gap-1">
              <Share2 className="w-3 h-3" />
              Viral
            </Badge>
            <Badge variant="secondary" className="hidden sm:flex bg-green-100 text-green-700 text-xs gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-8xl">💍</div>
          <div className="absolute top-20 right-20 text-6xl">💰</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">💸</div>
          <div className="absolute bottom-20 right-10 text-5xl">🏛️</div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 text-center">
          <Badge
            variant="secondary"
            className="bg-white/80 text-orange-700 text-xs font-medium mb-6 shadow-sm"
          >
            <Zap className="w-3 h-3 mr-1" />
            SATIRICAL TOOL FOR SOCIAL AWARENESS
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 leading-tight">
            How Much <span className="animate-rainbow">Dahej</span>
            <br className="hidden sm:block" />
            Should You Ask For?
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            A satirical tool to expose the absurdity of dowry practices.
            Fill in your details and see how ridiculous &quot;demanding
            dahej&quot; truly is.
          </p>

          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">Anti-Dowry</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Share2 className="w-4 h-4 text-orange-600" />
              <span className="text-muted-foreground">Shareable Results</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-muted-foreground">100% Satirical</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot - Top Banner */}
      <div className="container mx-auto px-4 py-3">
        <div className="ad-slot h-[90px]">
          <span>Advertisement</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Calculator + Sidebar Layout */}
          <div className="max-w-5xl mx-auto">
            {/* Calculator Form */}
            <CalculatorForm />

            {/* Ad Slot - Mid Content */}
            <div className="my-8">
              <div className="ad-slot h-[250px]">
                <span>Advertisement</span>
              </div>
            </div>

            {/* Disclaimer Banner */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-12">
              <p className="text-red-800 font-bold text-lg mb-2">
                IMPORTANT DISCLAIMER
              </p>
              <p className="text-red-700 text-sm leading-relaxed max-w-2xl mx-auto">
                This calculator is <strong>purely satirical</strong> and is
                intended to highlight the absurdity of dowry practices. It is
                not meant to encourage or promote dowry in any way. Dowry is
                <strong> illegal in India</strong> under the Dowry Prohibition
                Act of 1961. We strongly support the elimination of dowry
                practices and advocate for gender equality and respect in all
                relationships.
              </p>
            </div>

            {/* Leaderboard */}
            <Separator className="mb-4" />
            <Leaderboard />

            {/* Ad Slot - Pre-content */}
            <div className="my-8">
              <div className="ad-slot h-[250px]">
                <span>Advertisement</span>
              </div>
            </div>

            {/* Try Our Other Calculators */}
            <section className="py-12">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs font-medium mb-3">
                  <Globe className="w-3 h-3 mr-1" />
                  OUR CALCULATOR NETWORK
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Try Our Other <span className="golden-text">Calculators</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                  Explore bride price and dowry traditions around the world
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Lobola Calculator", subtitle: "South Africa, Zimbabwe", icon: "🇿🇦", href: "/lobola-calculator", gradient: "from-green-500 to-emerald-500" },
                  { title: "Caili Calculator 彩礼", subtitle: "China, Taiwan", icon: "🇨🇳", href: "/caili-calculator", gradient: "from-red-500 to-rose-500" },
                  { title: "Mahr Calculator", subtitle: "Islamic Countries", icon: "☪️", href: "/mahr-calculator", gradient: "from-amber-500 to-orange-500" },
                  { title: "Bride Price Worldwide", subtitle: "90+ Countries Compared", icon: "🌍", href: "/bride-price-calculator", gradient: "from-orange-500 to-red-500" },
                ].map((calc, idx) => (
                  <a key={idx} href={calc.href} className="group block">
                    <Card className="h-full border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
                      <div className={`bg-gradient-to-r ${calc.gradient} p-3 text-white text-center`} style={{ animationDelay: `${idx * 0.1}s` }}>
                        <span className="text-3xl block mb-1">{calc.icon}</span>
                        <h3 className="font-bold text-sm">{calc.title}</h3>
                      </div>
                      <CardContent className="p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-2">{calc.subtitle}</p>
                        <span className="inline-flex items-center gap-1 text-orange-600 font-medium text-xs group-hover:gap-2 transition-all">
                          Try it <ArrowRight className="w-3 h-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </section>

            {/* SEO Content */}
            <Separator className="mb-4" />
            <SeoContent />

            {/* Ad Slot - Bottom */}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Dahej Calculator</h3>
                  <p className="text-xs text-gray-400">Satirical Awareness Tool</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                A satirical tool created to raise awareness about the problematic
                nature of dowry practices and promote equality in marriage.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hall of Shame
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Dowry
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Disclaimer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Helpline */}
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Need Help?</h4>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Women Helpline</p>
                  <p className="font-bold text-lg text-green-400">181</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Emergency</p>
                  <p className="font-bold text-lg text-red-400">112</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">NCW Complaint</p>
                  <p className="font-bold text-lg text-orange-400">7827170170</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
              This website does not promote or endorse dowry practices. Dowry is
              illegal in India and many other countries. This calculator is for
              educational and satirical purposes only. All calculations are
              fictional and arbitrary.
            </p>
            <p className="text-xs text-gray-600 mt-4">
              &copy; {new Date().getFullYear()} Dahej Calculator. All rights
              reserved. Built for social awareness.
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
