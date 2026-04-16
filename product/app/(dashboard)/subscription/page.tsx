"use client"

import { useState } from "react"
import { Check, Zap, Star, Shield, Smartphone, BarChart3, Palette, Infinity } from "lucide-react"
import { toast } from "react-hot-toast"

export default function SubscriptionPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly")

  const handleCheckout = (planName: string) => {
    if (planName === "Basic") {
      toast.success("You're already on the Basic plan!")
      return
    }
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Opening secure checkout...',
        success: 'Welcome to Pro! (Simulation)',
        error: 'Could not connect to payment gateway.',
      }
    )
  }

  return (
    <div className="tab active skeleton-loaded" id="tab-subscription">
      <div className="ph">
        <div>
          <div className="pd">Upgrade your experience</div>
          <div className="pt">Choose your <em>power</em> plan</div>
          <div className="ps">Unlock advanced analytics and unlimited habits</div>
        </div>
      </div>

      <div className="billing-nav">
        <div className="billing-toggle">
          <div 
            className={`billing-opt ${billingInterval === "monthly" ? "active" : ""}`}
            onClick={() => setBillingInterval("monthly")}
          >
            Monthly
          </div>
          <div 
            className={`billing-opt ${billingInterval === "annual" ? "active" : ""}`}
            onClick={() => setBillingInterval("annual")}
          >
            Annual <span style={{ color: "var(--grn)", marginLeft: 4 }}>-20%</span>
          </div>
        </div>
      </div>

      <div className="sub-grid">
        {/* Basic Plan */}
        <div className="sub-card">
          <div className="sub-header">
            <div className="sub-name">Basic</div>
            <div className="sub-price">$0<span>/forever</span></div>
          </div>
          <ul className="sub-features">
            <li className="sub-feature">
              <Check size={16} /> <span>Up to 5 habits</span>
            </li>
            <li className="sub-feature">
              <Check size={16} /> <span>Daily & Weekly stats</span>
            </li>
            <li className="sub-feature">
              <Check size={16} /> <span>Basic reminders</span>
            </li>
            <li className="sub-feature disabled">
              <Check size={16} /> <span>Yearly analytics</span>
            </li>
            <li className="sub-feature disabled">
              <Check size={16} /> <span>Custom habit colors</span>
            </li>
          </ul>
          <button className="btn-sub" onClick={() => handleCheckout("Basic")}>
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="sub-card pro">
          <div className="sub-header">
            <div className="sub-name">Pro</div>
            <div className="sub-price">
              {billingInterval === "monthly" ? "$5" : "$48"}
              <span>/{billingInterval === "monthly" ? "mo" : "yr"}</span>
            </div>
          </div>
          <ul className="sub-features">
            <li className="sub-feature">
              <Zap size={16} fill="var(--ind)" color="var(--ind)" /> <span><strong>Unlimited</strong> habits</span>
            </li>
            <li className="sub-feature">
              <BarChart3 size={16} /> <span>Advanced Yearly analytics</span>
            </li>
            <li className="sub-feature">
              <Palette size={16} /> <span>Custom colors & themes</span>
            </li>
            <li className="sub-feature">
              <Shield size={16} /> <span>Cloud sync & backup</span>
            </li>
            <li className="sub-feature">
              <Smartphone size={16} /> <span>Early access to Snap cards</span>
            </li>
          </ul>
          <button className="btn-sub" onClick={() => handleCheckout("Pro")}>
            Upgrade to Pro
          </button>
        </div>
      </div>

      <div className="sh" style={{ marginTop: 40 }}>
        <div className="st">Frequently Asked Questions</div>
      </div>
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "grid", gap: "20px" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>Can I cancel anytime?</div>
            <div style={{ fontSize: "12.5px", color: "var(--txt2)" }}>Yes, you can cancel your subscription at any time from your profile settings.</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>What happens to my data if I downgrade?</div>
            <div style={{ fontSize: "12.5px", color: "var(--txt2)" }}>Your data remains safe! You will just be limited to managing 5 active habits at a time.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
