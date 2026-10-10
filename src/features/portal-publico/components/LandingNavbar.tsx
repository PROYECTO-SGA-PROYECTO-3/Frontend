import { LogIn } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { navItems } from '../data/portal.data'

export function LandingNavbar() {
  const navigate = useNavigate()

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
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
              className={cn(
                'group flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                item.active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700',
              )}
            >
              <item.icon
                className={cn(
                  'mr-2 h-4 w-4 flex-shrink-0',
                  item.active ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600',
                )}
                aria-hidden="true"
              />
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
          <Button
            onClick={() => navigate('/login')}
            className="rounded-full bg-brand-700 px-5 hover:bg-brand-800 text-white shadow-sm"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Ingresar al Portal
          </Button>
        </div>
      </div>
    </nav>
  )
}
