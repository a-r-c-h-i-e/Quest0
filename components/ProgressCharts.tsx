"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts"
import { TrendingUp, BookOpen, Brain, Clock, Zap } from "lucide-react"

interface ProgressData {
  date: string
  lectures: number
  topics: number
  hours: number
  lecturesTarget: number
  topicsTarget: number
  hoursTarget: number
  expGained: number
}

interface ProgressChartsProps {
  data: ProgressData[]
}

const chartConfig = {
  lectures: {
    label: "Lectures Completed",
    color: "#3B82F6",
  },
  topics: {
    label: "Topics Revised",
    color: "#10B981",
  },
  hours: {
    label: "Practice Hours",
    color: "#8B5CF6",
  },
  expGained: {
    label: "EXP Gained",
    color: "#06B6D4",
  },
}

export default function ProgressCharts({ data }: ProgressChartsProps) {
  console.log("ProgressCharts data:", data) // Debug log

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-300 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
            Progress Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Submit some daily reports to see your progress charts!</p>
          <p className="text-gray-600 text-sm mt-2">Charts will appear after you submit your first daily report.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Lectures Progress */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-300 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
            Lectures Progress ({data.length} days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
                <YAxis stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                          <p className="text-gray-200 font-medium">{`Date: ${label}`}</p>
                          <p className="text-blue-400">{`Lectures: ${payload[0]?.value || 0}`}</p>
                          <p className="text-red-400">
                            {`Target: ${data.find((d) => d.date === label)?.lecturesTarget || 0}`}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="lectures" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Lectures" />
                {data.length > 0 && (
                  <ReferenceLine
                    y={data[0]?.lecturesTarget || 0}
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                    label={{ value: "Target", position: "topRight", fill: "#EF4444" }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Topics Revision Progress */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-300 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-green-400" />
            Topics Revision Progress ({data.length} days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
                <YAxis stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                          <p className="text-gray-200 font-medium">{`Date: ${label}`}</p>
                          <p className="text-green-400">{`Topics: ${payload[0]?.value || 0}`}</p>
                          <p className="text-red-400">
                            {`Target: ${data.find((d) => d.date === label)?.topicsTarget || 0}`}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="topics" fill="#10B981" radius={[4, 4, 0, 0]} name="Topics" />
                {data.length > 0 && (
                  <ReferenceLine
                    y={data[0]?.topicsTarget || 0}
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                    label={{ value: "Target", position: "topRight", fill: "#EF4444" }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Question Practice Hours */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-300 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-400" />
            Question Practice Hours ({data.length} days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
                <YAxis stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                          <p className="text-gray-200 font-medium">{`Date: ${label}`}</p>
                          <p className="text-purple-400">{`Hours: ${payload[0]?.value || 0}`}</p>
                          <p className="text-red-400">
                            {`Target: ${data.find((d) => d.date === label)?.hoursTarget || 0}`}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="hours" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Hours" />
                {data.length > 0 && (
                  <ReferenceLine
                    y={data[0]?.hoursTarget || 0}
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                    label={{ value: "Target", position: "topRight", fill: "#EF4444" }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* EXP Trend */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-300 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-cyan-400" />
            EXP Trend ({data.length} days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
                <YAxis stroke="#9CA3AF" fontSize={12} tick={{ fill: "#9CA3AF" }} />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                          <p className="text-gray-200 font-medium">{`Date: ${label}`}</p>
                          <p className="text-cyan-400">{`EXP: ${payload[0]?.value || 0}`}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="expGained"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ fill: "#06B6D4", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#06B6D4", strokeWidth: 2 }}
                  name="EXP"
                />
                <ReferenceLine
                  y={0}
                  stroke="#6B7280"
                  strokeDasharray="3 3"
                  label={{ value: "Baseline", position: "topRight", fill: "#6B7280" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
