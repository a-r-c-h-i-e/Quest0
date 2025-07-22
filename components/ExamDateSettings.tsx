"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Settings } from "lucide-react"
import { format, differenceInDays } from "date-fns"

interface ExamDateSettingsProps {
  examDate: Date | null
  onExamDateChange: (date: Date) => void
  onSoundClick: () => void
}

export default function ExamDateSettings({ examDate, onExamDateChange, onSoundClick }: ExamDateSettingsProps) {
  const [tempDate, setTempDate] = useState<Date | undefined>(examDate || undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const calculateDaysRemaining = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const examDay = new Date(date)
    examDay.setHours(0, 0, 0, 0)
    return Math.max(0, differenceInDays(examDay, today))
  }

  const handleSave = () => {
    if (tempDate) {
      onExamDateChange(tempDate)
      setIsOpen(false)
      onSoundClick()
    }
  }

  const handleCancel = () => {
    setTempDate(examDate || undefined)
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
          Set Date
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-400 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Set GATE Exam Date
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300 font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-red-400" />
              GATE Exam Date
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-800 border-gray-600 hover:bg-gray-700"
                  onClick={onSoundClick}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tempDate ? format(tempDate, "PPP") : "Pick exam date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                <Calendar
                  mode="single"
                  selected={tempDate}
                  onSelect={(date) => {
                    if (date) {
                      setTempDate(date)
                      setIsCalendarOpen(false)
                      onSoundClick()
                    }
                  }}
                  initialFocus
                  className="bg-gray-800"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {tempDate && (
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <p className="text-sm text-gray-400">Days remaining:</p>
                <p className="text-2xl font-bold text-red-400">{calculateDaysRemaining(tempDate)} days</p>
              </div>
            )}
            <p className="text-xs text-gray-500">Select your GATE exam date to see accurate countdown</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!tempDate}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50"
            >
              Save Date
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
