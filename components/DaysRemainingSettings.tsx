"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, Settings } from "lucide-react"

interface DaysRemainingSettingsProps {
  daysRemaining: number
  onDaysRemainingChange: (days: number) => void
  onSoundClick: () => void
}

export default function DaysRemainingSettings({
  daysRemaining,
  onDaysRemainingChange,
  onSoundClick,
}: DaysRemainingSettingsProps) {
  const [tempDays, setTempDays] = useState(daysRemaining)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    onDaysRemainingChange(tempDays)
    setIsOpen(false)
    onSoundClick()
  }

  const handleCancel = () => {
    setTempDays(daysRemaining)
    setIsOpen(false)
    onSoundClick()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={onSoundClick}
        >
          <Settings className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-400 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Set Days Remaining
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300 font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-red-400" />
              Days Until GATE Exam
            </Label>
            <Input
              type="number"
              min="0"
              max="365"
              value={tempDays}
              onChange={(e) => setTempDays(Number.parseInt(e.target.value) || 0)}
              className="bg-gray-800 border-gray-600 focus:border-red-400"
              placeholder="Enter days remaining"
            />
            <p className="text-xs text-gray-500">Set the number of days remaining until your GATE exam</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Save Changes
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
