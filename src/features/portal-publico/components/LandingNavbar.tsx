import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { useNavigate } from 'react-router-dom'
import { navItems } from '../data/portal.data'

export function LandingNavbar() {
  const navigate = useNavigate()

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    if (latest > 150 && previous && latest > previous) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  return (
    <motion.nav 
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Items */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(item.href)
              }}
              className="group flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            >
              <item.icon
                className="mr-2 h-4 w-4 flex-shrink-0 text-slate-400 group-hover:text-brand-600"
                aria-hidden="true"
              />
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
          <Button
            onClick={() => navigate('/login')}
            className="rounded-full bg-brand-700 px-4 sm:px-5 hover:bg-brand-800 text-white shadow-sm"
          >
            <LogIn className="mr-0 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Ingresar al Portal</span>
            <span className="inline sm:hidden ml-2">Ingresar</span>
          </Button>
        </div>
      </div>
    </motion.nav>
  )
}
