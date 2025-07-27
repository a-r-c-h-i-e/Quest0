"use client"
import { useState, useEffect } from "react"
import { Menu, X, User, Settings, LogOut, Command, Bell, Search, Zap, Shield, Home, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ModernCyberpunkNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Leaderboard", href: "/leaderboard", icon: User },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "Blog", href: "/blog", icon: Zap },
    {name: "about", href: "/about", icon: Shield },
  ]

  return (
    <div className="relative">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-transparent to-cyan-900/20 animate-pulse" />
      
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern with glow */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.4) 1px, transparent 0),
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px, 50px 50px, 50px 50px",
        }}
      />

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-black/60 backdrop-blur-2xl border-b border-violet-500/20 shadow-lg shadow-violet-500/10" 
            : "bg-transparent"
        }`}
      >
        {/* Top accent line */}
        <div className={`h-px w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="relative">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-cyan-400 rounded-xl blur-md opacity-0 " />
                  
                  {/* Main logo container */}
                  <div className="relative w-10 h-10 bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600 rounded-xl flex items-center justify-center transform shadow-lg">
                    <Command className="w-5 h-5 text-white drop-shadow-sm" />
                    
                    {/* Inner highlight */}
                    <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg opacity-60" />
                  </div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 p-[1px] opacity-0  transition-opacity duration-300">
                    <div className="w-full h-full bg-black rounded-xl" />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Quest0
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">GATE Tracker</span>
                </div>
              </div>

              {/* Enhanced Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="relative px-4 py-2 text-sm text-gray-400 hover:text-white transition-all duration-300 group rounded-lg hover:bg-white/5"
                    >
                      <div className="flex items-center space-x-2">
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span>{item.name}</span>
                      </div>
                      
                      {/* Animated underline */}
                      <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full" />
                      
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Enhanced Right Side */}
            <div className="flex items-center space-x-3">
              {/* Enhanced Search Button */}
             
              {/* Desktop Auth */}
              <div className="hidden md:flex items-center space-x-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 relative group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Log in</span>
                    </Button>
                  </SignInButton>
                  
                  <SignUpButton mode="modal">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-violet-500/25 relative group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Sign up</span>
                    </Button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  {/* Enhanced Notifications */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 relative group"
                  >
                    <Bell className="w-4 h-4" />
                    {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full animate-pulse" /> */}
                    {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-400 rounded-full animate-ping" /> */}
                  </Button>

                  {/* Enhanced Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full group">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 " />
                        <Avatar className="h-9 w-9 border-2 border-violet-500/30 group-hover:border-violet-400 transition-colors duration-300 relative z-10">
                          <AvatarImage src={user?.imageUrl} alt="Profile" />
                          <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-600 text-white text-sm font-semibold">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 bg-black/90 backdrop-blur-2xl border border-violet-500/20 shadow-2xl shadow-violet-500/10 rounded-xl"
                      align="end"
                    >
                      <div className="px-4 py-3 border-b border-violet-500/20 bg-gradient-to-r from-violet-900/20 to-cyan-900/20">
                        <p className="text-sm font-semibold text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                      
                      <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-violet-500/10 transition-all duration-200 mx-1 my-1 rounded-lg">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-violet-500/10 transition-all duration-200 mx-1 my-1 rounded-lg">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-violet-500/20 mx-2" />
                      <SignOutButton>
                        <DropdownMenuItem className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 mx-1 my-1 rounded-lg">
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </DropdownMenuItem>
                      </SignOutButton>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SignedIn>
              </div>

              {/* Enhanced Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
                {isOpen ? <X className="h-5 w-5 relative z-10" /> : <Menu className="h-5 w-5 relative z-10" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-500 ease-out ${
            isOpen ? "max-h-screen opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 overflow-hidden"
          }`}
        >
          <div className="px-6 py-6 bg-black/95 backdrop-blur-2xl border-t border-violet-500/20">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-violet-500/10 rounded-xl transition-all duration-300 group"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: isOpen ? 'slideInFromLeft 0.3s ease-out forwards' : undefined
                    }}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-violet-500/20">
              <SignedOut>
                <div className="space-y-3">
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      Log in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium transition-all duration-300">
                      Sign up
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 px-4 py-3 bg-violet-500/10 rounded-xl">
                    <Avatar className="h-10 w-10 border-2 border-violet-500/30">
                      <AvatarImage src={user?.imageUrl} alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-600 text-white text-sm font-semibold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </Button>
                  <SignOutButton>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </Button>
                  </SignOutButton>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}