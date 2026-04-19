"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Zap, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

const tiers = [
  {
    name: "Starter",
    price: 0,
    displayPrice: "Free",
    description: "Perfect for individuals starting their journey.",
    features: [
      "Up to 5 active habits",
      "Basic swipe tracking",
      "7-day history",
      "Mobile access",
    ],
    cta: "Start for free",
    popular: false,
  },
  {
    name: "Prime",
    price: 9,
    period: "/mo",
    description: "For serious builders who want to level up.",
    features: [
      "Unlimited habits",
      "Advanced heatmaps",
      "Cloud sync across devices",
      "Priority agentic suggestions",
      "Custom themes",
    ],
    cta: "Go Prime",
    popular: true,
  },
  {
    name: "Pro",
    price: 49,
    period: "/year",
    description: "Collaborative habit building for teams.",
    features: [
      "Everything in Pro",
      "Shared habit rooms",
      "Team analytics dashboard",
      "Admin controls",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  const [isDiscounted, setIsDiscounted] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const proCardRef = useRef<HTMLDivElement>(null)

  const handleAvailOffer = () => {
    setIsDiscounted(true)
    setShowBanner(false)
    setTimeout(() => {
      proCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }

  return (
    <section className={`${inter.className} py-24 px-6 relative overflow-hidden`} id="pricing">
      <div className="max-w-7xl mx-auto">


        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>ANNUAL SALE: DISCOUNT ON PRO PLAN</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.95]">
            Simple, honest pricing.
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your growth velocity. No hidden fees.
          </p>
        </div>
        {/* Animated Promo Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 40 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-morphism rounded-[2rem] p-1 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <div className="bg-indigo-600/10 rounded-[1.8rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg tracking-tight">SAVE ON PRO PLAN</p>
                      <p className="text-indigo-200/60 text-sm">Unlock pro features for just $44/Year</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={handleAvailOffer}
                      className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-indigo-500 text-white text-sm font-black hover:bg-indigo-400 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                    >
                      Avail Offer
                    </button>
                    <button
                      onClick={() => setShowBanner(false)}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-zinc-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const isAnnualPlan = tier.name === "Pro";
            const finalPrice = isDiscounted && isAnnualPlan
              ? 44
              : tier.price;

            return (
              <motion.div
                key={tier.name}
                ref={isAnnualPlan ? proCardRef : null}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative glass rounded-[2.5rem] p-8 border ${tier.popular ? "border-indigo-500/50" : "border-white/5"
                  } flex flex-col`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-xs font-bold text-white flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    MOST POPULAR
                  </div>
                )}

                {isDiscounted && isAnnualPlan && (
                  <div className="absolute -top-4 right-8 px-4 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center gap-1 shadow-lg shadow-emerald-500/20">
                    <Sparkles className="w-3 h-3 fill-current" />
                    10% OFF APPLIED
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isDiscounted && isAnnualPlan ? 'discounted' : 'normal'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-4xl font-bold tracking-tight"
                      >
                        {tier.displayPrice || `$${finalPrice}`}
                      </motion.span>
                    </AnimatePresence>
                    {tier.period && <span className="text-zinc-500">{tier.period}</span>}
                    {isDiscounted && isAnnualPlan && (
                      <span className="text-xs text-indigo-400 ml-2 line-through opacity-50">
                        ${tier.price}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mt-2">{tier.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                      <div className="mt-1 w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-indigo-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full h-11 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${tier.popular
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-white/[0.05] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.07]"
                    }`}
                >
                  {isDiscounted && isAnnualPlan ? "Claim Pro Offer" : tier.cta}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
