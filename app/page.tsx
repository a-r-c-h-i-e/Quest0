"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  CalendarIcon,
  Settings,
  Brain,
  Clock,
  BarChart3,
  LineChart,
  Activity,
  Zap,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Crown,
  Target,
  Flame,
  RefreshCw,
  Sparkles,
  BookOpen,
  Trophy,
  CalendarDays,
  CheckCircle,
  Star,
} from "lucide-react"
import { format, differenceInDays, startOfWeek, endOfWeek, isWithinInterval, subDays } from "date-fns"
import {
  Bar,
  BarChart,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useSoundEffects } from "@/hooks/useSoundEffects"
import { useTheme } from "next-themes"

interface DailyReport {
  date: Date
  lecturesCompleted: number
  topicsRevised: number
  practiceHours: number
  morningSession: boolean
  exerciseDone: boolean
  distractionsLevel: string
  mentalState: string
  expGained: number
}

interface Skill {
  id: string
  name: string
  level: number
  exp: number
  maxExp: number
  category: string
}

interface Goal {
  id: string
  title: string
  description: string
  targetDate: Date
  completed: boolean
  progress: number
}

interface StudyResource {
  id: string
  title: string
  type: "video" | "book" | "article" | "course"
  url: string
  completed: boolean
  rating: number
}

interface RankInfo {
  name: string
  title: string
  color: string
  minExp: number
  maxExp: number
  description: string
}

const ranks: RankInfo[] = [
  {
    name: "E",
    title: "Novice",
    color: "hsl(var(--muted-foreground))",
    minExp: 0,
    maxExp: 500,
    description: "Just getting started",
  },
  {
    name: "D",
    title: "Learner",
    color: "hsl(var(--primary))",
    minExp: 500,
    maxExp: 1200,
    description: "Building foundations",
  },
  {
    name: "C",
    title: "Student",
    color: "hsl(var(--primary))",
    minExp: 1200,
    maxExp: 2000,
    description: "Making progress",
  },
  {
    name: "B",
    title: "Scholar",
    color: "hsl(var(--primary))",
    minExp: 2000,
    maxExp: 3000,
    description: "Solid understanding",
  },
  {
    name: "A",
    title: "Expert",
    color: "hsl(var(--primary))",
    minExp: 3000,
    maxExp: 4500,
    description: "Advanced knowledge",
  },
  {
    name: "S",
    title: "Master",
    color: "hsl(var(--primary))",
    minExp: 4500,
    maxExp: 6500,
    description: "Elite performance",
  },
  {
    name: "SS",
    title: "Elite",
    color: "hsl(var(--primary))",
    minExp: 6500,
    maxExp: 9000,
    description: "Top 5% performer",
  },
  {
    name: "SSS",
    title: "Legend",
    color: "hsl(var(--primary))",
    minExp: 9000,
    maxExp: 15000,
    description: "Legendary status",
  },
]

const themes = [
  { name: "Blue", value: "blue", color: "hsl(221, 83%, 53%)" },
  { name: "Green", value: "green", color: "hsl(142, 76%, 36%)" },
  { name: "Purple", value: "purple", color: "hsl(262, 83%, 58%)" },
  { name: "Orange", value: "orange", color: "hsl(25, 95%, 53%)" },
  { name: "Red", value: "red", color: "hsl(0, 84%, 60%)" },
  { name: "Pink", value: "pink", color: "hsl(336, 75%, 40%)" },
]

const chartConfig = {
  lectures: { label: "Lectures", color: "hsl(var(--chart-1))" },
  topics: { label: "Topics", color: "hsl(var(--chart-2))" },
  practice: { label: "Practice", color: "hsl(var(--chart-3))" },
  exp: { label: "EXP", color: "hsl(var(--chart-4))" },
  morning: { label: "Morning", color: "hsl(var(--chart-5))" },
}

const motivationalQuotes = [
  "Excellence is not a skill, it's an attitude.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "Your only limit is your mind.",
  "Great things never come from comfort zones.",
  "Dream it. Believe it. Build it.",
]

const defaultSkills: Skill[] = [
  { id: "1", name: "Mathematics", level: 1, exp: 0, maxExp: 100, category: "Core" },
  { id: "2", name: "Physics", level: 1, exp: 0, maxExp: 100, category: "Core" },
  { id: "3", name: "Chemistry", level: 1, exp: 0, maxExp: 100, category: "Core" },
  { id: "4", name: "Programming", level: 1, exp: 0, maxExp: 100, category: "Technical" },
  { id: "5", name: "Problem Solving", level: 1, exp: 0, maxExp: 100, category: "Soft Skills" },
]

export default function GATETracker() {
  const [currentExp, setCurrentExp] = useState(0)
  const [examDate, setExamDate] = useState<Date | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [skills, setSkills] = useState<Skill[]>(defaultSkills)
  const [goals, setGoals] = useState<Goal[]>([])
  const [resources, setResources] = useState<StudyResource[]>([])
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentQuote, setCurrentQuote] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("blue")

  const sounds = useSoundEffects()
  const { theme, setTheme } = useTheme()

  const [formData, setFormData] = useState({
    lecturesCompleted: 0,
    topicsRevised: 0,
    practiceHours: 0,
    morningSession: false,
    exerciseDone: false,
    distractionsLevel: "None",
    mentalState: "",
  })

  // Get current rank
  const currentRank = ranks.find((rank) => currentExp >= rank.minExp && currentExp < rank.maxExp) || ranks[0]
  const nextRank = ranks[ranks.findIndex((r) => r.name === currentRank.name) + 1]

  // Calculate days remaining
  const daysRemaining = examDate ? Math.max(0, differenceInDays(examDate, new Date())) : 180

  // Calculate EXP progress within current rank
  const expProgress = ((currentExp - currentRank.minExp) / (currentRank.maxExp - currentRank.minExp)) * 100

  // Initialize quote
  useEffect(() => {
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
  }, [])

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gate-tracker-pro")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCurrentExp(data.currentExp || 0)
        setDailyReports(data.dailyReports?.map((r: any) => ({ ...r, date: new Date(r.date) })) || [])
        setSkills(data.skills || defaultSkills)
        setGoals(data.goals?.map((g: any) => ({ ...g, targetDate: new Date(g.targetDate) })) || [])
        setResources(data.resources || [])
        setSoundEnabled(data.soundEnabled ?? true)
        setSelectedTheme(data.selectedTheme || "blue")
        if (data.examDate) setExamDate(new Date(data.examDate))
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "gate-tracker-pro",
        JSON.stringify({
          currentExp,
          dailyReports: dailyReports.map((r) => ({ ...r, date: r.date.toISOString() })),
          skills,
          goals: goals.map((g) => ({ ...g, targetDate: g.targetDate.toISOString() })),
          resources,
          examDate: examDate?.toISOString(),
          soundEnabled,
          selectedTheme,
        }),
      )
    } catch (error) {
      console.error("Error saving data to localStorage:", error)
    }
  }, [currentExp, dailyReports, skills, goals, resources, examDate, soundEnabled, selectedTheme])

  // Apply theme colors
  useEffect(() => {
    const root = document.documentElement
    const selectedThemeData = themes.find((t) => t.value === selectedTheme)
    if (selectedThemeData) {
      root.style.setProperty("--primary", selectedThemeData.color.replace("hsl(", "").replace(")", ""))
    }
  }, [selectedTheme])

  // Calculate EXP gain
  const calculateExp = useCallback((data: typeof formData) => {
    let exp = 0
    exp += data.lecturesCompleted * 50
    exp += data.topicsRevised * 30
    exp += data.practiceHours * 100
    exp += data.morningSession ? 50 : 0
    exp += data.exerciseDone ? 30 : 0

    // Distraction penalty
    const distractionPenalty = {
      None: 0,
      Low: -20,
      Medium: -50,
      High: -100,
    }
    exp += distractionPenalty[data.distractionsLevel as keyof typeof distractionPenalty] || 0

    return Math.max(0, exp)
  }, [])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const expGained = calculateExp(formData)
    const newReport: DailyReport = {
      date: selectedDate,
      ...formData,
      expGained,
    }

    const oldRank = currentRank
    setCurrentExp((prev) => prev + expGained)

    // Update daily reports - replace if same date exists, otherwise add new
    setDailyReports((prev) => {
      const existingIndex = prev.findIndex((r) => r.date.toDateString() === selectedDate.toDateString())
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newReport
        return updated
      } else {
        return [newReport, ...prev].slice(0, 30) // Keep last 30 days
      }
    })

    // Update skills based on activities
    setSkills((prev) =>
      prev.map((skill) => {
        let skillExp = 0
        if (skill.name === "Mathematics" && formData.lecturesCompleted > 0) skillExp += formData.lecturesCompleted * 10
        if (skill.name === "Physics" && formData.topicsRevised > 0) skillExp += formData.topicsRevised * 8
        if (skill.name === "Problem Solving" && formData.practiceHours > 0) skillExp += formData.practiceHours * 20

        if (skillExp > 0) {
          const newExp = skill.exp + skillExp
          const newLevel = Math.floor(newExp / skill.maxExp) + 1
          return {
            ...skill,
            exp: newExp % skill.maxExp,
            level: Math.max(skill.level, newLevel),
          }
        }
        return skill
      }),
    )

    // Play sound effects
    if (soundEnabled) {
      sounds.formSubmit()
      if (expGained > 0) {
        setTimeout(() => sounds.expGain(), 200)
      }
    }

    // Check for rank up
    const newExp = currentExp + expGained
    const newRank = ranks.find((rank) => newExp >= rank.minExp && newExp < rank.maxExp) || ranks[0]

    if (
      newRank.name !== oldRank.name &&
      ranks.findIndex((r) => r.name === newRank.name) > ranks.findIndex((r) => r.name === oldRank.name)
    ) {
      setShowLevelUp(true)
      if (soundEnabled) {
        setTimeout(() => sounds.levelUp(), 500)
      }
      setTimeout(() => setShowLevelUp(false), 4000)
    }

    // Reset form
    setFormData({
      lecturesCompleted: 0,
      topicsRevised: 0,
      practiceHours: 0,
      morningSession: false,
      exerciseDone: false,
      distractionsLevel: "None",
      mentalState: "",
    })

    // New quote
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
  }

  // Refresh data
  const handleRefresh = () => {
    setIsRefreshing(true)
    if (soundEnabled) sounds.buttonClick()
    setTimeout(() => {
      setIsRefreshing(false)
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
    }, 1000)
  }

  // Chart data functions with real data
  const getChartData = () => {
    if (dailyReports.length === 0) {
      // Generate sample data for demo
      return Array.from({ length: 7 }, (_, i) => ({
        date: format(subDays(new Date(), 6 - i), "MMM dd"),
        lectures: Math.floor(Math.random() * 5),
        topics: Math.floor(Math.random() * 8),
        practice: Math.floor(Math.random() * 4),
        exp: Math.floor(Math.random() * 200) + 50,
      }))
    }

    return dailyReports
      .slice(0, 7)
      .reverse()
      .map((report) => ({
        date: format(report.date, "MMM dd"),
        lectures: report.lecturesCompleted,
        topics: report.topicsRevised,
        practice: report.practiceHours,
        exp: report.expGained,
      }))
  }

  const getExpTrendData = () => {
    if (dailyReports.length === 0) {
      // Generate sample data for demo
      let cumulative = 0
      return Array.from({ length: 14 }, (_, i) => {
        const exp = Math.floor(Math.random() * 150) + 50
        cumulative += exp
        return {
          date: format(subDays(new Date(), 13 - i), "dd"),
          exp,
          total: cumulative,
        }
      })
    }

    let cumulative = 0
    return dailyReports
      .slice(0, 14)
      .reverse()
      .map((report) => {
        cumulative += report.expGained
        return {
          date: format(report.date, "dd"),
          exp: report.expGained,
          total: cumulative,
        }
      })
  }

  const getPerformanceRadarData = () => {
    const recentReports = dailyReports.slice(0, 7)
    if (recentReports.length === 0) {
      // Sample data for demo
      return [
        { subject: "Lectures", A: 75, fullMark: 100 },
        { subject: "Topics", A: 60, fullMark: 100 },
        { subject: "Practice", A: 80, fullMark: 100 },
        { subject: "Consistency", A: 70, fullMark: 100 },
        { subject: "Discipline", A: 85, fullMark: 100 },
        { subject: "Focus", A: 65, fullMark: 100 },
      ]
    }

    const avgLectures = recentReports.reduce((sum, r) => sum + r.lecturesCompleted, 0) / recentReports.length
    const avgTopics = recentReports.reduce((sum, r) => sum + r.topicsRevised, 0) / recentReports.length
    const avgPractice = recentReports.reduce((sum, r) => sum + r.practiceHours, 0) / recentReports.length
    const consistency = (recentReports.filter((r) => r.expGained > 0).length / recentReports.length) * 100
    const discipline =
      (recentReports.filter((r) => r.morningSession && r.exerciseDone).length / recentReports.length) * 100
    const focus = (recentReports.filter((r) => r.distractionsLevel === "None").length / recentReports.length) * 100

    return [
      { subject: "Lectures", A: Math.min(100, avgLectures * 20), fullMark: 100 },
      { subject: "Topics", A: Math.min(100, avgTopics * 10), fullMark: 100 },
      { subject: "Practice", A: Math.min(100, avgPractice * 25), fullMark: 100 },
      { subject: "Consistency", A: consistency, fullMark: 100 },
      { subject: "Discipline", A: discipline, fullMark: 100 },
      { subject: "Focus", A: focus, fullMark: 100 },
    ]
  }

  const getWeeklyStats = () => {
    const thisWeekStart = startOfWeek(new Date())
    const thisWeekEnd = endOfWeek(new Date())
    const thisWeekReports = dailyReports.filter((report) =>
      isWithinInterval(report.date, { start: thisWeekStart, end: thisWeekEnd }),
    )

    return {
      totalExp: thisWeekReports.reduce((sum, r) => sum + r.expGained, 0),
      totalLectures: thisWeekReports.reduce((sum, r) => sum + r.lecturesCompleted, 0),
      totalTopics: thisWeekReports.reduce((sum, r) => sum + r.topicsRevised, 0),
      totalPractice: thisWeekReports.reduce((sum, r) => sum + r.practiceHours, 0),
      activeDays: thisWeekReports.length,
      avgExp:
        thisWeekReports.length > 0
          ? thisWeekReports.reduce((sum, r) => sum + r.expGained, 0) / thisWeekReports.length
          : 0,
    }
  }

  const getSkillDistribution = () => {
    return skills.map((skill) => ({
      name: skill.name,
      value: skill.level,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }))
  }

  const weeklyStats = getWeeklyStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -50 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 3,
                  repeatType: "reverse",
                }}
                className="text-6xl font-bold text-primary mb-4"
              >
                🎉 RANK UP! 🎉
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold mb-2"
              >
                {currentRank.name}-Rank {currentRank.title}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground mb-6"
              >
                {currentRank.description}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-background mx-auto bg-primary"
              >
                {currentRank.name}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold">GATE Tracker Pro</h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mt-1 flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              {daysRemaining} days remaining • Level up your preparation
            </motion.p>
          </div>

          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </motion.div>

            <Dialog>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" onClick={() => soundEnabled && sounds.buttonClick()}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>Configure your GATE preparation tracker</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound">Sound Effects</Label>
                    <Switch
                      id="sound"
                      checked={soundEnabled}
                      onCheckedChange={(checked) => {
                        setSoundEnabled(checked)
                        if (checked) sounds.toggleSwitch()
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Theme Mode</Label>
                    <Select
                      value={theme}
                      onValueChange={(value) => {
                        setTheme(value)
                        if (soundEnabled) sounds.buttonClick()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light Mode</SelectItem>
                        <SelectItem value="dark">Dark Mode</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {themes.map((themeOption) => (
                        <Button
                          key={themeOption.value}
                          variant={selectedTheme === themeOption.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedTheme(themeOption.value)
                            if (soundEnabled) sounds.buttonClick()
                          }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeOption.color }} />
                          {themeOption.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Exam Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {examDate ? format(examDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={examDate || undefined} onSelect={setExamDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSoundEnabled(!soundEnabled)
                  if (soundEnabled) sounds.buttonClick()
                }}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="skills">
                <Brain className="h-4 w-4 mr-2" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="goals">
                <Target className="h-4 w-4 mr-2" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="study-plan">
                <CalendarDays className="h-4 w-4 mr-2" />
                Study Plan
              </TabsTrigger>
              <TabsTrigger value="resources">
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Rank</p>
                        <p className="text-3xl font-bold">{currentRank.name}</p>
                        <p className="text-sm text-muted-foreground">{currentRank.title}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-primary text-primary-foreground">
                        <Crown className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total EXP</p>
                        <p className="text-3xl font-bold">{currentExp.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">+{weeklyStats.totalExp} this week</p>
                      </div>
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                        <p className="text-3xl font-bold">
                          {dailyReports.filter((r, i) => i < 7 && r.expGained > 0).length}
                        </p>
                        <p className="text-sm text-muted-foreground">days active</p>
                      </div>
                      <Flame className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Daily EXP</p>
                        <p className="text-3xl font-bold">{Math.round(weeklyStats.avgExp)}</p>
                        <p className="text-sm text-muted-foreground">this week</p>
                      </div>
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Entry Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      Daily Entry
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start bg-transparent">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(selectedDate, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setSelectedDate(date)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                          <Label htmlFor="lectures">Lectures Completed</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  lecturesCompleted: Math.max(0, prev.lecturesCompleted - 1),
                                }))
                                if (soundEnabled) sounds.buttonClick()
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="lectures"
                              type="number"
                              value={formData.lecturesCompleted}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  lecturesCompleted: Number.parseInt(e.target.value) || 0,
                                }))
                              }
                              className="text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, lecturesCompleted: prev.lecturesCompleted + 1 }))
                                if (soundEnabled) sounds.buttonClick()
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <motion.p
                            key={formData.lecturesCompleted}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-xs text-muted-foreground"
                          >
                            +{formData.lecturesCompleted * 50} EXP
                          </motion.p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                          <Label htmlFor="topics">Topics Revised</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, topicsRevised: Math.max(0, prev.topicsRevised - 1) }))
                                if (soundEnabled) sounds.buttonClick()
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="topics"
                              type="number"
                              value={formData.topicsRevised}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  topicsRevised: Number.parseInt(e.target.value) || 0,
                                }))
                              }
                              className="text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, topicsRevised: prev.topicsRevised + 1 }))
                                if (soundEnabled) sounds.buttonClick()
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <motion.p
                            key={formData.topicsRevised}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-xs text-muted-foreground"
                          >
                            +{formData.topicsRevised * 30} EXP
                          </motion.p>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                          <Label htmlFor="practice">Practice Hours</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  practiceHours: Math.max(0, prev.practiceHours - 0.5),
                                }))
                                if (soundEnabled) sounds.buttonClick()
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="practice"
                              type="number"
                              step="0.5"
                              value={formData.practiceHours}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  practiceHours: Number.parseFloat(e.target.value) || 0,
                                }))
                              }
                              className="text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, practiceHours: prev.practiceHours + 0.5 }))
                                if (soundEnabled) sounds.buttonClick()
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <motion.p
                            key={formData.practiceHours}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-xs text-muted-foreground"
                          >
                            +{formData.practiceHours * 100} EXP
                          </motion.p>
                        </motion.div>
                      </div>

                      {/* Bonus Activities */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <Label htmlFor="morning">Morning Session</Label>
                          <Switch
                            id="morning"
                            checked={formData.morningSession}
                            onCheckedChange={(checked) => {
                              setFormData({ ...formData, morningSession: checked })
                              if (soundEnabled) sounds.toggleSwitch()
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <Label htmlFor="exercise">Exercise Done</Label>
                          <Switch
                            id="exercise"
                            checked={formData.exerciseDone}
                            onCheckedChange={(checked) => {
                              setFormData({ ...formData, exerciseDone: checked })
                              if (soundEnabled) sounds.toggleSwitch()
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Distractions Level</Label>
                        <Select
                          value={formData.distractionsLevel}
                          onValueChange={(value) => {
                            setFormData({ ...formData, distractionsLevel: value })
                            if (soundEnabled) sounds.buttonClick()
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None (+0 EXP)</SelectItem>
                            <SelectItem value="Low">Low (-20 EXP)</SelectItem>
                            <SelectItem value="Medium">Medium (-50 EXP)</SelectItem>
                            <SelectItem value="High">High (-100 EXP)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <motion.div
                        animate={{
                          scale: calculateExp(formData) > 0 ? [1, 1.02, 1] : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="rounded-lg p-4 border"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total EXP Gain</span>
                          <motion.span
                            key={calculateExp(formData)}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="text-2xl font-bold text-primary"
                          >
                            +{calculateExp(formData)}
                          </motion.span>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" className="w-full">
                          Submit Entry
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Rank & Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                {/* Current Rank */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Rank</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto bg-primary"
                    >
                      {currentRank.name}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold">{currentRank.title}</h3>
                      <p className="text-sm text-muted-foreground">{currentExp.toLocaleString()} EXP</p>
                      <p className="text-xs text-muted-foreground mt-1">{currentRank.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(expProgress)}%</span>
                      </div>
                      <Progress value={expProgress} className="h-2" />
                      {nextRank && (
                        <p className="text-xs text-muted-foreground">
                          {(nextRank.minExp - currentExp).toLocaleString()} EXP to {nextRank.name}-Rank
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Wisdom */}
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-primary" />
                        Daily Wisdom
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm italic text-center">"{currentQuote}"</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total EXP</span>
                      <Badge variant="secondary">{weeklyStats.totalExp}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lectures</span>
                      <Badge variant="secondary">{weeklyStats.totalLectures}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Topics</span>
                      <Badge variant="secondary">{weeklyStats.totalTopics}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Practice Hours</span>
                      <Badge variant="secondary">{weeklyStats.totalPractice.toFixed(1)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Days</span>
                      <Badge variant="secondary">{weeklyStats.activeDays}/7</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Daily Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Daily Activity (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="lectures" fill="var(--color-lectures)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="topics" fill="var(--color-topics)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="practice" fill="var(--color-practice)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* EXP Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-primary" />
                    EXP Trend (Last 14 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={getExpTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="exp"
                          stroke="var(--color-exp)"
                          strokeWidth={3}
                          dot={{ fill: "var(--color-exp)", strokeWidth: 2, r: 4 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Performance Radar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Performance Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getPerformanceRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Performance"
                          dataKey="A"
                          stroke="var(--color-exp)"
                          fill="var(--color-exp)"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <ChartTooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Skill Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    Skill Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getSkillDistribution()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getSkillDistribution().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    Skill Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            <p className="text-sm text-muted-foreground">{skill.category}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">Level {skill.level}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {skill.exp}/{skill.maxExp} EXP
                            </p>
                          </div>
                        </div>
                        <Progress value={(skill.exp / skill.maxExp) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Study Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {goals.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No goals set yet. Create your first goal to get started!</p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Goal
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{goal.title}</h4>
                            <Badge variant={goal.completed ? "default" : "secondary"}>
                              {goal.completed ? "Completed" : "In Progress"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Due: {format(goal.targetDate, "MMM dd, yyyy")}
                            </span>
                            <span className="text-xs text-muted-foreground">{goal.progress}% complete</span>
                          </div>
                          <Progress value={goal.progress} className="h-2 mt-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="study-plan" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                    Study Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Study planner coming soon! Plan your daily study sessions.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Study Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {resources.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No resources added yet. Add your study materials!</p>
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div key={resource.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{resource.title}</h4>
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < resource.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex items-center space-x-2">
                              {resource.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                              <Button size="sm" variant="outline" asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  View
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
