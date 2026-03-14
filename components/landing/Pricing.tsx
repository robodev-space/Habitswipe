"use client"

import { motion } from "framer-motion"
import { Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const tiers = [
  {
    name: "Starter",
    price: "Free",
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
    name: "Pro",
    price: "$9",
    period: "/mo",
    description: "For serious builders who want to level up.",
    features: [
      "Unlimited habits",
      "Advanced heatmaps",
      "Cloud sync across devices",
      "Priority agentic suggestions",
      "Custom themes",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/mo",
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
  return (
    <section className={`${inter.className} py-24 px-6 relative`} id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.95]">
            Simple, honest pricing.
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your growth velocity. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
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

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  {tier.period && <span className="text-zinc-500">{tier.period}</span>}
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

              <Button
                variant={tier.popular ? "gradient" : "secondary"}
                className="w-full rounded-2xl h-12"
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
