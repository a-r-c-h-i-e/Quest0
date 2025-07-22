"use client"
import { useState, useEffect } from "react"
import { Menu, X, User, Settings, LogOut, Command, ArrowRight, Bell, Search } from "lucide-react"
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
    //  { name: "Profile", href: "#" },
    //  { name: "Setting", href: "#" },
    //  { name: "", href: "#" },
    { name: "Company", href: "#" },
    { name: "Pricing", href: "#" },
  ]

  return (
    <div className="bg-[#0a0a0a]">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-cyan-950/20 pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.08]" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-all duration-200">
                    <Command className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
                </div>
                <span className="text-xl font-semibold text-white">Quest0</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <div className="text-xs text-gray-500 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.08]">
                  ⌘K
                </div>
              </Button>

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center space-x-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
                    >
                      Log in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-100 transition-all duration-200 font-medium"
                    >
                      Sign up
                    </Button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200 relative"
                  >
                    <Bell className="w-4 h-4" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full" />
                  </Button>

                  {/* Custom Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8 border border-white/[0.15]">
                          <AvatarImage src={user?.imageUrl} alt="Profile" />
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-sm">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl"
                      align="end"
                    >
                      <div className="px-3 py-2 border-b border-white/[0.08]">
                        <p className="text-sm font-medium text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                      <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors duration-200">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors duration-200">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/[0.08]" />
                      <SignOutButton>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors duration-200">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </DropdownMenuItem>
                      </SignOutButton>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SignedIn>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors duration-200"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-out ${isOpen ? "max-h-screen opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 overflow-hidden"
            }`}
        >
          <div className="px-6 py-4 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.08]">
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08]">
              <SignedOut>
                <div className="space-y-2">
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/[0.05]"
                    >
                      Log in
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button className="w-full bg-white text-black hover:bg-gray-100">
                      Sign up
                    </Button>
                  </SignInButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <Avatar className="h-8 w-8 border border-white/[0.15]">
                      <AvatarImage src={user?.imageUrl} alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-sm">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/[0.05]"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/[0.05]"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <div className="pt-2">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-full",
                          userButtonBox: "w-full",
                        }
                      }}
                    />
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
    </div>
  )
}
