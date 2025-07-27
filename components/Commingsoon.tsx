"use client"
import { motion } from "framer-motion"
import { Brain, Target, Users, Trophy, Zap, Bell, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  eta: string
  delay: number
}

const FeatureCard = ({ icon: Icon, title, description, eta, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
         
          </div>
          
          <h3 className="font-semibold text-base md:text-lg mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export  function ComingSoonFeatures() {
  const features = [
    {
      icon: Brain,
      title: "AI Study Companion",
      description: "Personal AI tutor that adapts to your learning style and provides customized practice questions with detailed explanations.",
      eta: "March 2025"
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Join or create study groups with fellow learners. Collaborate, share notes, and solve problems together in real-time.",
      eta: "February 2025"
    },
    {
      icon: Target,
      title: "Smart Goals",
      description: "Set personalized study goals with AI-powered recommendations based on your performance and time remaining.",
      eta: "January 2025"
    },
    {
      icon: Trophy,
      title: "Achievements System",
      description: "Unlock badges and rewards as you complete challenges, maintain streaks, and achieve milestones.",
      eta: "February 2025"
    },
    {
      icon: Zap,
      title: "Lightning Rounds",
      description: "Quick 5-minute challenge rounds to test your speed and accuracy across different topics.",
      eta: "January 2025"
    }
  ]

  return (
    <div className="min-h-screen bg-background py-8 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 md:mb-6">
            Exciting Features Ahead
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent px-4">
            Coming Soon
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We're building revolutionary features to transform your learning experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>

       
      </div>
    </div>
  )
}