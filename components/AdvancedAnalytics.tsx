"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Calendar,
  Target,
  Clock,
  Brain,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Flame,
} from "lucide-react"
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"

interface DailyReport {
  date: Date
  lecturesCompleted: number
  postLectureRevision: boolean
  oldTopicsRevised: number
  questionPracticeHours: number
  morningSession: boolean
  exerciseDone: boolean
  goalVisualization: boolean
  distractionsLevel: string
  missedLecture: boolean
  noRevision: boolean
  noQuestionPractice: boolean
  oversleeping: boolean
  mentalState: string
  finalComment: string
  expGained: number
}

interface DailyTargets {
  lecturesCompleted: number
  oldTopicsRevised: number
  questionPracticeHours: number
}

interface AdvancedAnalyticsProps {
  dailyReports: DailyReport[]
  dailyTargets: DailyTargets
  currentExp: number
  daysRemaining: number
}

export default function AdvancedAnalytics({
  dailyReports,
  dailyTargets,
  currentExp,
  daysRemaining,
}: AdvancedAnalyticsProps) {
  // Calculate study streak
  const calculateStudyStreak = () => {
    if (dailyReports.length === 0) return 0

    let streak = 0
    const sortedReports = [...dailyReports].sort((a, b) => b.date.getTime() - a.date.getTime())

    for (const report of sortedReports) {
      if (report.lecturesCompleted > 0 || report.oldTopicsRevised > 0 || report.questionPracticeHours > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  // Calculate weekly performance
  const calculateWeeklyPerformance = () => {
    const thisWeekStart = startOfWeek(new Date())
    const thisWeekEnd = endOfWeek(new Date())

    const thisWeekReports = dailyReports.filter((report) =>
      isWithinInterval(report.date, { start: thisWeekStart, end: thisWeekEnd }),
    )

    const totalLectures = thisWeekReports.reduce((sum, report) => sum + report.lecturesCompleted, 0)
    const totalTopics = thisWeekReports.reduce((sum, report) => sum + report.oldTopicsRevised, 0)
    const totalHours = thisWeekReports.reduce((sum, report) => sum + report.questionPracticeHours, 0)
    const totalExp = thisWeekReports.reduce((sum, report) => sum + report.expGained, 0)

    const targetLectures = dailyTargets.lecturesCompleted * 7
    const targetTopics = dailyTargets.oldTopicsRevised * 7
    const targetHours = dailyTargets.questionPracticeHours * 7

    return {
      lectures: { actual: totalLectures, target: targetLectures, percentage: (totalLectures / targetLectures) * 100 },
      topics: { actual: totalTopics, target: targetTopics, percentage: (totalTopics / targetTopics) * 100 },
      hours: { actual: totalHours, target: targetHours, percentage: (totalHours / targetHours) * 100 },
      exp: totalExp,
      daysActive: thisWeekReports.length,
    }
  }

  // Calculate productivity patterns
  const calculateProductivityPatterns = () => {
    const morningSessionCount = dailyReports.filter((report) => report.morningSession).length
    const exerciseCount = dailyReports.filter((report) => report.exerciseDone).length
    const noDistractionCount = dailyReports.filter((report) => report.distractionsLevel === "None").length
    const revisionCount = dailyReports.filter((report) => report.postLectureRevision).length

    const totalReports = dailyReports.length || 1

    return {
      morningSession: (morningSessionCount / totalReports) * 100,
      exercise: (exerciseCount / totalReports) * 100,
      noDistraction: (noDistractionCount / totalReports) * 100,
      revision: (revisionCount / totalReports) * 100,
    }
  }

  // Generate insights and recommendations
  const generateInsights = () => {
    const insights = []
    const weeklyPerf = calculateWeeklyPerformance()
    const patterns = calculateProductivityPatterns()
    const avgExp =
      dailyReports.length > 0 ? dailyReports.reduce((sum, r) => sum + r.expGained, 0) / dailyReports.length : 0

    // Performance insights
    if (weeklyPerf.lectures.percentage < 70) {
      insights.push({
        type: "warning",
        title: "Lecture Completion Below Target",
        message: `You're at ${weeklyPerf.lectures.percentage.toFixed(1)}% of your weekly lecture goal. Consider adjusting your schedule.`,
        icon: AlertTriangle,
      })
    }

    if (patterns.morningSession > 70) {
      insights.push({
        type: "success",
        title: "Excellent Morning Routine",
        message: `${patterns.morningSession.toFixed(1)}% morning sessions! Early study sessions boost retention by 25%.`,
        icon: CheckCircle,
      })
    }

    if (patterns.noDistraction < 50) {
      insights.push({
        type: "warning",
        title: "Distraction Management Needed",
        message: "High distraction levels detected. Try the Pomodoro technique or find a quieter study space.",
        icon: AlertTriangle,
      })
    }

    if (avgExp > 300) {
      insights.push({
        type: "success",
        title: "High Performance Streak",
        message: `Averaging ${avgExp.toFixed(0)} EXP/day! You're in the top 20% of performers.`,
        icon: Award,
      })
    }

    // Time-based insights
    const projectedExp = avgExp * daysRemaining
    const currentRankThreshold = 4000 // S-Rank threshold
    if (currentExp + projectedExp >= currentRankThreshold) {
      insights.push({
        type: "success",
        title: "S-Rank Achievable",
        message: `At current pace, you'll reach S-Rank before GATE! Keep up the momentum.`,
        icon: Award,
      })
    }

    return insights
  }

  const studyStreak = calculateStudyStreak()
  const weeklyPerformance = calculateWeeklyPerformance()
  const productivityPatterns = calculateProductivityPatterns()
  const insights = generateInsights()

  if (dailyReports.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-300 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Submit daily reports to unlock advanced analytics and insights!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-cyan-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-cyan-600">
            <PieChart className="w-4 h-4 mr-2" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-cyan-600">
            <Brain className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Study Streak</p>
                    <p className="text-2xl font-bold text-orange-400">{studyStreak}</p>
                    <p className="text-gray-500 text-xs">days</p>
                  </div>
                  <Flame className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Reports</p>
                    <p className="text-2xl font-bold text-blue-400">{dailyReports.length}</p>
                    <p className="text-gray-500 text-xs">submitted</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg EXP/Day</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {dailyReports.length > 0
                        ? (dailyReports.reduce((sum, r) => sum + r.expGained, 0) / dailyReports.length).toFixed(0)
                        : 0}
                    </p>
                    <p className="text-gray-500 text-xs">experience</p>
                  </div>
                  <Zap className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">This Week</p>
                    <p className="text-2xl font-bold text-green-400">{weeklyPerformance.daysActive}</p>
                    <p className="text-gray-500 text-xs">active days</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-300">Weekly Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Lectures Completed</span>
                    <span className="text-blue-400 font-mono">
                      {weeklyPerformance.lectures.actual}/{weeklyPerformance.lectures.target}
                    </span>
                  </div>
                  <Progress value={Math.min(100, weeklyPerformance.lectures.percentage)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {weeklyPerformance.lectures.percentage.toFixed(1)}% of weekly target
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Topics Revised</span>
                    <span className="text-green-400 font-mono">
                      {weeklyPerformance.topics.actual}/{weeklyPerformance.topics.target}
                    </span>
                  </div>
                  <Progress value={Math.min(100, weeklyPerformance.topics.percentage)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {weeklyPerformance.topics.percentage.toFixed(1)}% of weekly target
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Practice Hours</span>
                    <span className="text-purple-400 font-mono">
                      {weeklyPerformance.hours.actual.toFixed(1)}/{weeklyPerformance.hours.target}h
                    </span>
                  </div>
                  <Progress value={Math.min(100, weeklyPerformance.hours.percentage)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {weeklyPerformance.hours.percentage.toFixed(1)}% of weekly target
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Weekly EXP Gained</span>
                    <span className="text-yellow-400 font-bold text-lg">+{weeklyPerformance.exp}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-300">Goal Achievement Rate</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {dailyReports.slice(0, 7).map((report, index) => {
                    const lectureAchieved = (report.lecturesCompleted / dailyTargets.lecturesCompleted) * 100
                    const topicAchieved = (report.oldTopicsRevised / dailyTargets.oldTopicsRevised) * 100
                    const hourAchieved = (report.questionPracticeHours / dailyTargets.questionPracticeHours) * 100
                    const overallAchieved = (lectureAchieved + topicAchieved + hourAchieved) / 3

                    return (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300 text-sm">{format(report.date, "MMM dd")}</span>
                          <Badge
                            className={`${
                              overallAchieved >= 100
                                ? "bg-green-500/20 text-green-400"
                                : overallAchieved >= 70
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {overallAchieved.toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={Math.min(100, overallAchieved)} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-300">EXP Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Best Day</h4>
                    {dailyReports.length > 0 && (
                      <div>
                        {(() => {
                          const bestDay = dailyReports.reduce((best, current) =>
                            current.expGained > best.expGained ? current : best,
                          )
                          return (
                            <div>
                              <p className="text-green-400 font-bold">{format(bestDay.date, "MMM dd")}</p>
                              <p className="text-green-400 text-sm">+{bestDay.expGained} EXP</p>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Consistency Score</h4>
                    {(() => {
                      const avgExp = dailyReports.reduce((sum, r) => sum + r.expGained, 0) / dailyReports.length
                      const variance =
                        dailyReports.reduce((sum, r) => sum + Math.pow(r.expGained - avgExp, 2), 0) /
                        dailyReports.length
                      const consistency = Math.max(0, 100 - (Math.sqrt(variance) / avgExp) * 100)

                      return (
                        <div>
                          <p className="text-cyan-400 font-bold">{consistency.toFixed(1)}%</p>
                          <Progress value={consistency} className="h-2 mt-2" />
                        </div>
                      )
                    })()}
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Projected Rank</h4>
                    {(() => {
                      const avgExp = dailyReports.reduce((sum, r) => sum + r.expGained, 0) / dailyReports.length
                      const projectedExp = currentExp + avgExp * daysRemaining
                      let projectedRank = "E"

                      if (projectedExp >= 7000) projectedRank = "SSS"
                      else if (projectedExp >= 5500) projectedRank = "SS"
                      else if (projectedExp >= 4000) projectedRank = "S"
                      else if (projectedExp >= 2800) projectedRank = "A"
                      else if (projectedExp >= 1800) projectedRank = "B"
                      else if (projectedExp >= 1000) projectedRank = "C"
                      else if (projectedExp >= 400) projectedRank = "D"

                      return (
                        <div>
                          <p className="text-yellow-400 font-bold text-xl">{projectedRank}-Rank</p>
                          <p className="text-gray-400 text-sm">{projectedExp.toFixed(0)} EXP projected</p>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-300">Productivity Habits</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                        Morning Sessions
                      </span>
                      <span className="text-blue-400 font-mono">{productivityPatterns.morningSession.toFixed(1)}%</span>
                    </div>
                    <Progress value={productivityPatterns.morningSession} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-green-400" />
                        Exercise Routine
                      </span>
                      <span className="text-green-400 font-mono">{productivityPatterns.exercise.toFixed(1)}%</span>
                    </div>
                    <Progress value={productivityPatterns.exercise} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-purple-400" />
                        Focus (No Distractions)
                      </span>
                      <span className="text-purple-400 font-mono">
                        {productivityPatterns.noDistraction.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={productivityPatterns.noDistraction} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-cyan-400" />
                        Post-Lecture Revision
                      </span>
                      <span className="text-cyan-400 font-mono">{productivityPatterns.revision.toFixed(1)}%</span>
                    </div>
                    <Progress value={productivityPatterns.revision} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-300">Study Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {(() => {
                    const totalLectures = dailyReports.reduce((sum, r) => sum + r.lecturesCompleted, 0)
                    const totalTopics = dailyReports.reduce((sum, r) => sum + r.oldTopicsRevised, 0)
                    const totalHours = dailyReports.reduce((sum, r) => sum + r.questionPracticeHours, 0)
                    const total = totalLectures + totalTopics + totalHours

                    if (total === 0) return <p className="text-gray-500">No study data available</p>

                    const lecturePercentage = (totalLectures / total) * 100
                    const topicPercentage = (totalTopics / total) * 100
                    const hourPercentage = (totalHours / total) * 100

                    return (
                      <>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">New Lectures</span>
                            <span className="text-blue-400 font-mono">{lecturePercentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={lecturePercentage} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{totalLectures} total lectures</p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">Topic Revision</span>
                            <span className="text-green-400 font-mono">{topicPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={topicPercentage} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{totalTopics} topics revised</p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">Question Practice</span>
                            <span className="text-purple-400 font-mono">{hourPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={hourPercentage} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{totalHours.toFixed(1)} hours practiced</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon
              return (
                <Card
                  key={index}
                  className={`bg-gray-900/50 border-gray-700 ${
                    insight.type === "success"
                      ? "border-l-4 border-l-green-500"
                      : insight.type === "warning"
                        ? "border-l-4 border-l-yellow-500"
                        : "border-l-4 border-l-red-500"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <IconComponent
                        className={`w-5 h-5 mt-0.5 ${
                          insight.type === "success"
                            ? "text-green-400"
                            : insight.type === "warning"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-200 mb-1">{insight.title}</h4>
                        <p className="text-gray-400 text-sm">{insight.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {insights.length === 0 && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500">Keep submitting reports to unlock personalized insights!</p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-300">Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                    <h4 className="text-blue-400 font-semibold mb-1">Study Schedule Optimization</h4>
                    <p className="text-gray-400 text-sm">
                      Based on your patterns, morning sessions show{" "}
                      {productivityPatterns.morningSession > 50 ? "excellent" : "good"} results.
                      {productivityPatterns.morningSession < 50
                        ? " Consider scheduling more morning study sessions."
                        : " Keep maintaining this routine!"}
                    </p>
                  </div>

                  <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
                    <h4 className="text-green-400 font-semibold mb-1">Revision Strategy</h4>
                    <p className="text-gray-400 text-sm">
                      Your revision rate is {productivityPatterns.revision.toFixed(0)}%.
                      {productivityPatterns.revision < 70
                        ? "Increase post-lecture revision to improve retention by 40%."
                        : "Excellent revision habits! This significantly boosts long-term retention."}
                    </p>
                  </div>

                  <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-3">
                    <h4 className="text-purple-400 font-semibold mb-1">Focus Enhancement</h4>
                    <p className="text-gray-400 text-sm">
                      {productivityPatterns.noDistraction < 60
                        ? "Try the Pomodoro Technique: 25min focused study + 5min break. This can improve your focus score significantly."
                        : "Great focus discipline! Your distraction management is helping maximize study efficiency."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
