"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Users, Eye } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  profession: string;
  amount: number;
  emoji: string;
  trend: string;
  views: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    profession: "NRI Doctor (USA)",
    amount: 285000000,
    emoji: "🏆",
    trend: "+12%",
    views: 45200,
  },
  {
    rank: 2,
    profession: "IAS Officer (Delhi)",
    amount: 198000000,
    emoji: "🥈",
    trend: "+8%",
    views: 38700,
  },
  {
    rank: 3,
    profession: "Software Engineer (Bangalore)",
    amount: 156000000,
    emoji: "🥉",
    trend: "+15%",
    views: 35100,
  },
  {
    rank: 4,
    profession: "Business Owner (Mumbai)",
    amount: 134000000,
    emoji: "💰",
    trend: "+5%",
    views: 28900,
  },
  {
    rank: 5,
    profession: "CA (Chartered Accountant)",
    amount: 98000000,
    emoji: "📊",
    trend: "+3%",
    views: 22400,
  },
  {
    rank: 6,
    profession: "Govt. Teacher (UP)",
    amount: 67000000,
    emoji: "📚",
    trend: "-2%",
    views: 18700,
  },
  {
    rank: 7,
    profession: "Police Inspector",
    amount: 52000000,
    emoji: "👮",
    trend: "+7%",
    views: 15600,
  },
  {
    rank: 8,
    profession: "Bank Manager (Punjab)",
    amount: 41000000,
    emoji: "🏦",
    trend: "+1%",
    views: 12800,
  },
];

function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatViews(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

export default function Leaderboard() {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          Trending Calculations
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Hall of <span className="golden-text">Shame</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          The most absurd dowry demands calculated by our users. See who made it
          to the top!
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {mockLeaderboard.map((entry, idx) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -50 }}
            animate={
              animateIn
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -50 }
            }
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            <Card
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-default ${
                entry.rank === 1
                  ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50"
                  : entry.rank === 2
                  ? "border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50"
                  : entry.rank === 3
                  ? "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50"
                  : "border-gray-100"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      entry.rank === 1
                        ? "bg-yellow-400 text-yellow-900"
                        : entry.rank === 2
                        ? "bg-gray-300 text-gray-700"
                        : entry.rank === 3
                        ? "bg-orange-300 text-orange-900"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {entry.rank <= 3 ? (
                      <span className="text-xl">{entry.emoji}</span>
                    ) : (
                      `#${entry.rank}`
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {entry.profession}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatViews(entry.views)} views
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-lg text-orange-700">
                      {formatINR(entry.amount)}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        entry.trend.startsWith("+")
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {entry.trend}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">
          * Data is fictional and generated for satirical purposes. Calculate
          your own amount above!
        </p>
      </div>
    </section>
  );
}
