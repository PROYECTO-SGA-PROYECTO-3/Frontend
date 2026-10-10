import type { LucideIcon } from 'lucide-react'

interface PilarCardProps {
  title: string
  desc: string
  Icon: LucideIcon
  iconColor: string
  iconBg: string
  footer: string
  footerColor: string
}

export function PilarCard({
  title,
  desc,
  Icon,
  iconColor,
  iconBg,
  footer,
  footerColor
}: PilarCardProps) {
  return (
    <div className="bg-white border border-slate-100 shadow-lg shadow-slate-100/50 rounded-3xl p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-6`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-8">
        {desc}
      </p>
      
      <div className="mt-auto pt-4 border-t border-slate-50">
        <span className={`text-[10px] font-bold tracking-widest uppercase ${footerColor}`}>
          {footer}
        </span>
      </div>
    </div>
  )
}
