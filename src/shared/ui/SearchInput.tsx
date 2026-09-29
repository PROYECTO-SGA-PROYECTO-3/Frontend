import { forwardRef, type InputHTMLAttributes, type KeyboardEvent } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  containerClassName?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onClear,
      containerClassName,
      placeholder = 'Buscar...',
      className,
      onKeyDown,
      disabled,
      ...props
    },
    ref,
  ) => {
    const handleClear = () => {
      onChange('')
      onClear?.()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape' && value) {
        e.preventDefault()
        handleClear()
      }
      onKeyDown?.(e)
    }

    return (
      <div className={cn('group relative flex items-center', containerClassName)}>
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors group-focus-within:text-brand-600">
          <Search size={18} className="transition-transform duration-150 group-focus-within:scale-105" />
        </span>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={cn(
            'w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
            className,
          )}
          {...props}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
            title="Limpiar búsqueda (Esc)"
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 transition-colors hover:text-slate-700 cursor-pointer"
          >
            <span className="flex items-center justify-center rounded-md p-1 hover:bg-slate-100 transition-colors">
              <X size={15} />
            </span>
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = 'SearchInput'
