import type { LucideIcon } from 'lucide-react'

interface InfoCardProps {
  title: string
  desc: string
  Icon: LucideIcon
}

export function InfoCard({ title, desc, Icon }: InfoCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-10 shadow-lg ring-1 ring-slate-200 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="absolute -right-10 -top-10 opacity-10">
        <Icon className="h-40 w-40 text-brand-600" />
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 mb-6">
        <Icon className="h-7 w-7 text-brand-700" />
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">
        {title}
      </h3>
      <p className="text-base leading-7 text-slate-600">
        {desc}
      </p>
    </div>
  )
}
