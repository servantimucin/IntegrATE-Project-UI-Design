"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState("") // Tek arama terimi için state
  const { toast } = useToast()

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // Boşlukları temizleyerek kontrol et
      toast({
        title: "Arama Hatası",
        description: "Lütfen aramak için bir MRN veya Vaka Numarası girin.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Arama Başlatıldı",
      description: `Aranıyor: ${searchTerm}`,
    })
    console.log("Aranıyor:", { searchTerm })
    // Burada gerçek arama mantığını uygulayabilirsiniz.
    // Örneğin, searchTerm'in MRN mi yoksa Vaka Numarası mı olduğunu belirleyip ilgili API çağrısını yapabilirsiniz.
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card">
      <Input
        placeholder="MRN veya Vaka Numarası ile ara..." // Yeni placeholder
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="MRN veya Vaka Numarası arama kutusu"
        className="flex-grow" // Arama kutusunun genişlemesini sağla
      />
      <Button onClick={handleSearch} className="flex-shrink-0" aria-label="Arama butonu">
        <Search className="mr-2 h-4 w-4" /> Ara
      </Button>
    </div>
  )
}
