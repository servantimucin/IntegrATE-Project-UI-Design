import { create } from "zustand"
import type { Message } from "@/lib/api"

interface MessageStore {
  selectedMessage: Message | null
  setSelectedMessage: (message: Message | null) => void
}

export const useMessageStore = create<MessageStore>((set) => ({
  selectedMessage: null,
  setSelectedMessage: (message) => set({ selectedMessage: message }),
}))
