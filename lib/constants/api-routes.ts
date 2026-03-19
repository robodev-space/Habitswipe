const getBaseUrl = () => {
  const isDev = process.env.NODE_ENV === "development"
  const isProd = process.env.NODE_ENV === "production"

  let url = ""

  // Condition: Use NEXT_PUBLIC_API_URL as primary for client/dev
  // Condition: Use API_URL as fallback in production (as per user setup)
  if (isProd) {
    url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ""
  } else {
    url = process.env.NEXT_PUBLIC_API_URL || ""
  }

  if (!url || url === "/" || url === "undefined") return ""

  // Ensure protocol if it's a domain/localhost
  if (url.includes("localhost") || url.includes(".")) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      const protocol = isProd ? "https://" : "http://"
      url = `${protocol}${url}`
    }
  }

  // Remove trailing slash if present
  return url.endsWith("/") ? url.slice(0, -1) : url
}

const BASE_URL = getBaseUrl()

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    SESSION: `${BASE_URL}/api/auth/session`, 
  },
  HABITS: {
    BASE: `${BASE_URL}/api/habits`,
    BY_ID: (id: string) => `${BASE_URL}/api/habits/${id}`,
  },
  LOGS: {
    BASE: `${BASE_URL}/api/logs`,
  },
  PROFILE: {
    BASE: `${BASE_URL}/api/profile`,
    AVATAR: `${BASE_URL}/api/profile/avatar`,
  },
  SNAPS: {
    BASE: `${BASE_URL}/api/snaps`,
  },
  STATS: {
    BASE: `${BASE_URL}/api/stats`,
  },
  STREAKS: {
    BASE: `${BASE_URL}/api/streaks`,
  },
  ONBOARDING: {
    BASE: `${BASE_URL}/api/onboarding`,
  },
} as const
