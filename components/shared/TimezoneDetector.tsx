"use client"

import { useEffect } from "react"
import { API_ROUTES } from "@/lib/constants/api-routes"

/**
 * Automatically detects the user's browser timezone and 
 * saves it to the backend if the profile doesn't have one set.
 */
export function TimezoneDetector() {
  useEffect(() => {
    const syncTimezone = async () => {
      try {
        // 1. Fetch current profile
        const res = await fetch(API_ROUTES.PROFILE.BASE)
        const json = await res.json()
        
        if (json.data && (!json.data.timezone || json.data.timezone === "UTC")) {
          const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone
          
          if (browserTz && browserTz !== json.data.timezone) {
            // 2. Update profile with detected timezone
            await fetch(API_ROUTES.PROFILE.BASE, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ timezone: browserTz })
            })
            console.log(`[TimezoneDetector] Synced browser timezone: ${browserTz}`)
          }
        }
      } catch (err) {
        // Silent fail - non-critical
        console.error("[TimezoneDetector] Sync failed:", err)
      }
    }

    syncTimezone()
  }, [])

  return null // pure logic component
}
