"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Target, BookOpen, Brain, Clock } from "lucide-react"

interface DailyTargets {
  lecturesCompleted: number
  oldTopicsRevised: number
  questionPracticeHours: number
}

interface TargetSettingsProps {
  targets: DailyTargets
  onTargetsChange: (targets: DailyTargets) => void
  onSoundClick: () => void
}

export default function TargetSettings({ targets, onTargetsChange, onSoundClick }: TargetSettingsProps) {
  const [tempTargets, setTempTargets] = useState(targets)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    onTargetsChange(tempTargets)
    setIsOpen(false)
    onSoundClick()
  }

  const handleCancel = () => {
    setTempTargets(targets)
    setIsOpen(false)
    onSoundClick()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-cyan-400"
          onClick={onSoundClick}
        >
          <Target className="w-4 h-4 mr-2" />
          Set Targets
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cyan-400 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Set Daily Targets
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300 font-medium flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
              Lectures per Day
            </Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={tempTargets.lecturesCompleted}
              onChange={(e) =>
                setTempTargets((prev) => ({
                  ...prev,
                  lecturesCompleted: Number.parseInt(e.target.value) || 1,
                }))
              }
              className="bg-gray-800 border-gray-600 focus:border-cyan-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 font-medium flex items-center">
              <Brain className="w-4 h-4 mr-2 text-green-400" />
              Topics to Revise per Day
            </Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={tempTargets.oldTopicsRevised}
              onChange={(e) =>
                setTempTargets((prev) => ({
                  ...prev,
                  oldTopicsRevised: Number.parseInt(e.target.value) || 1,
                }))
              }
              className="bg-gray-800 border-gray-600 focus:border-cyan-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-purple-400" />
              Practice Hours per Day
            </Label>
            <Input
              type="number"
              min="0.5"
              max="12"
              step="0.5"
              value={tempTargets.questionPracticeHours}
              onChange={(e) =>
                setTempTargets((prev) => ({
                  ...prev,
                  questionPracticeHours: Number.parseFloat(e.target.value) || 0.5,
                }))
              }
              className="bg-gray-800 border-gray-600 focus:border-cyan-400"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Save Targets
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-gray-600 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
