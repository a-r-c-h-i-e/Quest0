"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Calendar, Crown } from "lucide-react"

interface RankInfo {
  name: string
  fullName: string
  color: string
  glowColor: string
  minExp: number
  maxExp: number
  meaning: string
  gateInterpretation: string
  mentalState: string
  icon: React.ComponentType<any>
}

interface SubmissionPopupProps {
  isOpen: boolean
  onClose: () => void
  currentRank: RankInfo
  currentExp: number
  expGained: number
  daysRemaining: number
  averageExpPerDay: number
  daysToNextRank: number | null
  nextRank: RankInfo | null
}

export default function SubmissionPopup({
  isOpen,
  onClose,
  currentRank,
  currentExp,
  expGained,
  daysRemaining,
  averageExpPerDay,
  daysToNextRank,
  nextRank,
}: SubmissionPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-cyan-400 flex items-center justify-center">
            <Zap className="w-6 h-6 mr-2" />
            Report Submitted!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* EXP Gained */}
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${expGained >= 0 ? "text-green-400" : "text-red-400"}`}>
              {expGained >= 0 ? "+" : ""}
              {expGained} EXP
            </div>
            <p className="text-gray-400">Experience {expGained >= 0 ? "Gained" : "Lost"}</p>
          </div>

          {/* Current Status */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300">Current Rank:</span>
              <Badge
                className="text-white font-bold"
                style={{
                  backgroundColor: currentRank.color,
                  boxShadow: `0 0 10px ${currentRank.glowColor}40`,
                }}
              >
                {currentRank.name}-Rank
              </Badge>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300">Total EXP:</span>
              <span className="text-cyan-400 font-mono">{currentExp.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Mental State:</span>
              <span className="text-purple-400 italic">"{currentRank.mentalState}"</span>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Progress Stats
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Avg EXP/Day:</span>
                <span className="text-yellow-400 font-mono">{averageExpPerDay.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Days to GATE:</span>
                <span className="text-red-400 font-mono flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {daysRemaining}
                </span>
              </div>
              {nextRank && daysToNextRank && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Days to {nextRank.name}-Rank:</span>
                  <span className="text-cyan-400 font-mono flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    {Math.ceil(daysToNextRank)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Rank Preview */}
          {nextRank && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Next Rank Goal</h3>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2"
                  style={{
                    backgroundColor: nextRank.color,
                    borderColor: nextRank.glowColor,
                    boxShadow: `0 0 15px ${nextRank.glowColor}40`,
                  }}
                >
                  {nextRank.name}
                </div>
                <div>
                  <p className="text-gray-200 font-medium">{nextRank.fullName}</p>
                  <p className="text-sm text-gray-400">{(nextRank.minExp - currentExp).toLocaleString()} EXP needed</p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            Continue Training
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
