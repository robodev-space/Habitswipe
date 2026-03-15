"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { CameraSnapModal } from "@/components/share/CameraSnapModal"
import { Flame, CheckCircle2, Share2 } from "lucide-react"
import { API_ROUTES } from "@/lib/constants/api-routes"

interface ShareableHabit {
  id: string
  name: string
  icon: string
  currentStreak: number
}

export default function SharePage() {
  const { data: session } = useSession()
  const [completedHabits, setCompletedHabits] = useState<ShareableHabit[]>([])
  const [sharedDates, setSharedDates] = useState<Date[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHabit, setSelectedHabit] = useState<ShareableHabit | null>(null)

  // Fetch initial data
  const fetchData = async (signal?: AbortSignal) => {
    try {
      // Fetch today's habits
      const streaksRes = await fetch(API_ROUTES.STREAKS.BASE, { signal })
      const streaksData = await streaksRes.json()
      
      // Filter habits that have been completed today
      const todayString = format(new Date(), "yyyy-MM-dd")
      const doneToday = streaksData.data?.habits?.filter((h: any) => 
        h.heatmap[0]?.date === todayString && h.heatmap[0]?.status === "DONE"
      ) || []
      
      setCompletedHabits(doneToday)

      // Fetch shared dates
      const snapsRes = await fetch(API_ROUTES.SNAPS.BASE, { signal })
      const snapsData = await snapsRes.json()
      
      // Parse UTC date strings to local Dates
      const dates = (snapsData.dates || []).map((d: string) => {
        const [year, month, day] = d.split('-').map(Number)
        return new Date(year, month - 1, day) // Note: months are 0-indexed in JS Date!
      })
      setSharedDates(dates)

    } catch (error: any) {
      if (error.name === "AbortError") return
      console.error("Error fetching share data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-fore">Share your Snap 📸</h1>
        <p className="text-fore-2">Capture your daily wins and share them with friends to keep yourself accountable!</p>
      </header>

      {/* Habits Section */}
      <section className="space-y-4">
         <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            Today's Completed Habits
         </h2>
         
         {isLoading ? (
            <div className="animate-pulse flex gap-4 overflow-x-auto pb-4">
              {[1, 2].map(i => <div key={i} className="w-64 h-24 bg-surface-2 rounded-2xl flex-shrink-0" />)}
            </div>
         ) : completedHabits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedHabits.map(habit => (
                 <div 
                    key={habit.id}
                    onClick={() => setSelectedHabit(habit)}
                    className="group cursor-pointer relative overflow-hidden rounded-2xl bg-surface border border-theme p-4 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {habit.icon}
                       </div>
                       <div className="flex-1">
                          <h3 className="font-bold text-fore">{habit.name}</h3>
                          <div className="flex items-center gap-1.5 text-orange-500 mt-1">
                             <Flame className="w-4 h-4" />
                             <span className="text-sm font-semibold">{habit.currentStreak} Day Streak</span>
                          </div>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                          <Share2 className="w-5 h-5" />
                       </div>
                    </div>
                 </div>
              ))}
            </div>
         ) : (
            <div className="p-8 rounded-2xl bg-surface-2 border border-theme text-center">
               <p className="text-fore-2 mb-2">You haven't completed any habits today yet!</p>
               <p className="text-sm">Complete a habit to unlock the share feature.</p>
            </div>
         )}
      </section>

      {/* Calendar Section */}
      <section className="space-y-4">
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold flex items-center gap-2">
              <Share2 className="w-5 h-5 text-pink-500" />
              Share History
           </h2>
           <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 text-sm font-bold">
             {sharedDates.length} Snaps Shared
           </span>
         </div>
         
         <div className="p-6 rounded-3xl bg-surface border border-theme inline-block">
            <Calendar
              mode="multiple"
              selected={sharedDates}
              className="rounded-md"
              modifiers={{
                shared: sharedDates,
              }}
              modifiersStyles={{
                shared: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgb(236, 72, 153)', // pink-500
                  color: 'white',
                  borderRadius: '100%',
                }
              }}
            />
         </div>
      </section>

      {/* Modal */}
      {selectedHabit && (
        <CameraSnapModal 
          habit={selectedHabit} 
          onClose={() => setSelectedHabit(null)} 
          onShareSuccess={fetchData} // Refresh the calendar
        />
      )}
    </div>
  )
}
