"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/contexts/LanguageContext"
import { Globe } from "lucide-react"

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "qu", name: "Runasimi", flag: "🇵🇪" },
  { code: "ay", name: "Aymar aru", flag: "🇧🇴" },
  { code: "en", name: "English", flag: "🇺🇸" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className="w-[140px] bg-transparent border-gray-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
