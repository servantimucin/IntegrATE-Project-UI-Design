export type KpiData = {
  totalMessages: number
  errorMessages: number
  criticalErrors: number
  successRate: number
  successRateSparkline: number[]
}

export type MessageStatus = "success" | "error" | "pending"

export type Message = {
  id: string
  timestamp: string
  event: string
  status: MessageStatus
  facility: string
  patient: string
  errorMessage?: string
  count?: number
  mrn?: string
  caseNumber?: string
}

export type CatalogItem = {
  id: string
  name: string
  description: string
  type: "error" | "event"
}

export type PatientSummary = {
  name: string
  visitStatus: "Admitted" | "Discharged" | "Inpatient" | "Outpatient" | "Pending"
  hasError: boolean
}

export type EventDefinition = {
  id: string
  name: string
  code: string
  description: string
}

export type SolutionStep = {
  id: string
  description: string
  order: number
}

export type ErrorDefinition = {
  id: string
  name: string
  associatedEventCodes: string[]
  solutionSteps: SolutionStep[]
}

// --- Mock Data ---
let mockEventDefinitions: EventDefinition[] = [
  { id: "evt-def-001", name: "Patient Admit", code: "PA", description: "Hasta kabul edildi." },
  { id: "evt-def-002", name: "Order Placed", code: "OP", description: "Yeni bir sipariş verildi." },
  { id: "evt-def-003", name: "Lab Result", code: "LR", description: "Laboratuvar sonucu alındı." },
  { id: "evt-def-004", name: "Patient Discharge", code: "PD", description: "Hasta taburcu edildi." },
  { id: "evt-def-005", name: "Medication Dispense", code: "MD", description: "İlaç verildi." },
]

let mockErrorDefinitions: ErrorDefinition[] = [
  {
    id: "err-def-001",
    name: "Invalid Order ID",
    associatedEventCodes: ["OP"],
    solutionSteps: [
      { id: "step-1", description: "Sipariş ID'sinin formatını kontrol edin.", order: 1 },
      { id: "step-2", description: "Sipariş ID'sinin geçerli bir siparişe ait olduğundan emin olun.", order: 2 },
      { id: "step-3", description: "Gerekirse siparişi manuel olarak yeniden işleyin.", order: 3 },
    ],
  },
  {
    id: "err-def-002",
    name: "Missing Patient Demographics",
    associatedEventCodes: ["PA", "PD"],
    solutionSteps: [
      { id: "step-1", description: "Hasta demografik bilgilerini EHR'dan doğrulayın.", order: 1 },
      { id: "step-2", description: "Eksik bilgileri sisteme girin.", order: 2 },
      { id: "step-3", description: "Mesajı yeniden işleyin.", order: 3 },
    ],
  },
]

// --- API Fonksiyonları ---

export const fetchKpiData = async (): Promise<KpiData> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    totalMessages: 123456,
    errorMessages: 789,
    criticalErrors: 42,
    successRate: 98.5,
    successRateSparkline: [90, 92, 95, 93, 96, 98, 98.5],
  }
}

const allMessages: Message[] = [
  {
    id: "msg-001",
    timestamp: "2024-07-10 10:00:00",
    event: "Patient Admit",
    status: "success",
    facility: "Facility A",
    patient: "John Doe",
    count: 1,
  },
  {
    id: "msg-002",
    timestamp: "2024-07-10 09:55:00",
    event: "Order Placed",
    status: "error",
    facility: "Facility B",
    patient: "Jane Smith",
    errorMessage: "Invalid order ID format.",
    count: 3,
    mrn: "MRN-12345",
    caseNumber: "CASE-67890",
  },
  {
    id: "msg-003",
    timestamp: "2024-07-10 09:50:00",
    event: "Lab Result",
    status: "pending",
    facility: "Facility A",
    patient: "Peter Jones",
    count: 1,
  },
  {
    id: "msg-004",
    timestamp: "2024-07-10 09:45:00",
    event: "Patient Discharge",
    status: "success",
    facility: "Facility C",
    patient: "Alice Brown",
    count: 1,
  },
  {
    id: "msg-005",
    timestamp: "2024-07-10 09:40:00",
    event: "Patient Admit",
    status: "error",
    facility: "Facility A",
    patient: "Bob White",
    errorMessage: "Missing required patient demographics.",
    count: 5,
  },
  {
    id: "msg-006",
    timestamp: "2024-07-10 09:35:00",
    event: "Medication Dispense",
    status: "success",
    facility: "Facility B",
    patient: "Charlie Green",
    count: 1,
  },
  {
    id: "msg-007",
    timestamp: "2024-07-10 09:30:00",
    event: "Order Placed",
    status: "error",
    facility: "Facility C",
    patient: "Diana Prince",
    errorMessage: "Database connection timeout.",
    count: 2,
  },
  {
    id: "msg-008",
    timestamp: "2024-07-10 09:25:00",
    event: "Lab Result",
    status: "success",
    facility: "Facility A",
    patient: "Eve Adams",
    count: 1,
  },
  {
    id: "msg-009",
    timestamp: "2024-07-10 09:20:00",
    event: "Patient Admit",
    status: "pending",
    facility: "Facility B",
    patient: "Frank Black",
    count: 1,
  },
  {
    id: "msg-010",
    timestamp: "2024-07-10 09:15:00",
    event: "Patient Discharge",
    status: "error",
    facility: "Facility A",
    patient: "Grace Kelly",
    errorMessage: "Facility ID not recognized.",
    count: 1,
  },
  {
    id: "msg-011",
    timestamp: "2024-07-10 09:10:00",
    event: "Order Placed",
    status: "success",
    facility: "Facility C",
    patient: "Harry Potter",
    count: 1,
  },
  {
    id: "msg-012",
    timestamp: "2024-07-10 09:05:00",
    event: "Lab Result",
    status: "error",
    facility: "Facility B",
    patient: "Ivy Queen",
    errorMessage: "Result parsing error.",
    count: 4,
  },
  // John Doe için ek mesajlar
  {
    id: "msg-013",
    timestamp: "2024-07-10 09:00:00",
    event: "Patient Admit",
    status: "success",
    facility: "Facility A",
    patient: "John Doe",
    count: 1,
  },
  {
    id: "msg-014",
    timestamp: "2024-07-10 08:55:00",
    event: "Order Placed",
    status: "success",
    facility: "Facility A",
    patient: "John Doe",
    count: 1,
  },
  {
    id: "msg-015",
    timestamp: "2024-07-10 08:50:00",
    event: "Lab Result",
    status: "success",
    facility: "Facility A",
    patient: "John Doe",
    count: 1,
  },
  {
    id: "msg-016",
    timestamp: "2024-07-10 08:45:00",
    event: "Patient Discharge",
    status: "success",
    facility: "Facility A",
    patient: "John Doe",
    count: 1,
  },
  {
    id: "msg-017",
    timestamp: "2024-07-10 08:40:00",
    event: "Patient Admit",
    status: "error",
    facility: "Facility A",
    patient: "John Doe",
    errorMessage: "Duplicate admission record.",
    count: 1,
  },
  {
    id: "msg-018",
    timestamp: "2024-07-10 08:35:00",
    event: "Medication Dispense",
    status: "success",
    facility: "Facility A",
    patient: "John Doe",
    count: 1,
  },
  {
    id: "msg-019",
    timestamp: "2024-07-10 08:30:00",
    event: "Order Placed",
    status: "error",
    facility: "Facility A",
    patient: "John Doe",
    errorMessage: "Medication not in formulary.",
    count: 1,
  },
  {
    id: "msg-020",
    timestamp: "2024-07-10 08:25:00",
    event: "Lab Result",
    status: "success",
    facility: "Facility A",
    patient: "John Doe",
    count: 1,
  },
]

export const fetchMessages = async (filters?: {
  status?: MessageStatus
  dateRange?: [string, string]
  events?: string[]
}): Promise<Message[]> => {
  await new Promise((resolve) => setTimeout(resolve, 700))
  let filteredMessages = allMessages
  if (filters?.status) {
    filteredMessages = filteredMessages.filter((msg) => msg.status === filters.status)
  }
  if (filters?.events && filters.events.length > 0) {
    filteredMessages = filteredMessages.filter((msg) => filters.events?.includes(msg.event))
  }
  return filteredMessages
}

export const fetchMessagesByPatient = async (
  patientName: string,
  filters?: {
    status?: MessageStatus
    dateRange?: [string, string]
    events?: string[]
  },
): Promise<Message[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  let patientMessages = allMessages.filter((msg) => msg.patient === patientName)
  if (filters?.status) {
    patientMessages = patientMessages.filter((msg) => msg.status === filters.status)
  }
  if (filters?.events && filters.events.length > 0) {
    patientMessages = patientMessages.filter((msg) => filters.events?.includes(msg.event))
  }
  if (filters?.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
    const [startDate, endDate] = filters.dateRange.map((d) => new Date(d))
    patientMessages = patientMessages.filter((msg) => {
      const msgDate = new Date(msg.timestamp.split(" ")[0])
      return msgDate >= startDate && msgDate <= endDate
    })
  }
  return patientMessages
}

export const fetchPatientSummaries = async (facility?: string): Promise<PatientSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  const patientMap = new Map<string, { hasError: boolean }>()
  const messagesToProcess = facility ? allMessages.filter((msg) => msg.facility === facility) : allMessages
  messagesToProcess.forEach((msg) => {
    if (!patientMap.has(msg.patient)) {
      patientMap.set(msg.patient, { hasError: false })
    }
    const patientData = patientMap.get(msg.patient)!
    if (msg.status === "error") {
      patientData.hasError = true
    }
  })
  const patientSummaries: PatientSummary[] = Array.from(patientMap.entries()).map(([patientName, data]) => {
    const statuses: PatientSummary["visitStatus"][] = ["Admitted", "Discharged", "Inpatient", "Outpatient", "Pending"]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    return {
      name: patientName,
      visitStatus: randomStatus,
      hasError: data.hasError,
    }
  })
  return patientSummaries.sort((a, b) => a.name.localeCompare(b.name))
}

// CatalogItem CRUD functions (these were the ones causing the error)
export const fetchCatalogItems = async (type: "error" | "event"): Promise<CatalogItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  if (type === "error") {
    return [
      {
        id: "err-001",
        name: "Invalid Order ID",
        description: "Order ID does not match expected format.",
        type: "error",
      },
      {
        id: "err-002",
        name: "Missing Demographics",
        description: "Patient demographics are incomplete.",
        type: "error",
      },
      {
        id: "err-003",
        name: "DB Timeout",
        description: "Database connection timed out during processing.",
        type: "error",
      },
      {
        id: "err-004",
        name: "Facility Not Found",
        description: "The specified facility ID is not recognized.",
        type: "error",
      },
      { id: "err-005", name: "Parsing Error", description: "Failed to parse incoming message data.", type: "error" },
    ]
  } else {
    return [
      { id: "evt-001", name: "Patient Admit", description: "Patient admission event.", type: "event" },
      { id: "evt-002", name: "Order Placed", description: "New order placed event.", type: "event" },
      { id: "evt-003", name: "Lab Result", description: "Laboratory result received.", type: "event" },
      { id: "evt-004", name: "Patient Discharge", description: "Patient discharge event.", type: "event" },
      { id: "evt-005", name: "Medication Dispense", description: "Medication dispensed event.", type: "event" },
    ]
  }
}

export const addCatalogItem = async (item: Omit<CatalogItem, "id">): Promise<CatalogItem> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const newId = `new-${Math.random().toString(36).substring(2, 9)}`
  return { ...item, id: newId }
}

export const updateCatalogItem = async (id: string, updates: Partial<CatalogItem>): Promise<CatalogItem> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  // In a real app, you'd update a database record
  return { id, name: updates.name || "", description: updates.description || "", type: updates.type || "error" }
}

export const deleteCatalogItem = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  // In a real app, you'd delete a database record
  console.log(`Deleted item with ID: ${id}`)
}

// --- Event Definition CRUD ---
export const fetchEventDefinitions = async (): Promise<EventDefinition[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockEventDefinitions
}

export const addEventDefinition = async (newEvent: Omit<EventDefinition, "id">): Promise<EventDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const newId = `evt-def-${Math.random().toString(36).substring(2, 9)}`
  const event = { ...newEvent, id: newId }
  mockEventDefinitions.push(event)
  return event
}

export const updateEventDefinition = async (
  id: string,
  updates: Partial<EventDefinition>,
): Promise<EventDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockEventDefinitions.findIndex((e) => e.id === id)
  if (index > -1) {
    mockEventDefinitions[index] = { ...mockEventDefinitions[index], ...updates }
    return mockEventDefinitions[index]
  }
  throw new Error("Event not found")
}

export const deleteEventDefinition = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  mockEventDefinitions = mockEventDefinitions.filter((e) => e.id !== id)
}

// --- Error Definition CRUD ---
export const fetchErrorDefinitions = async (): Promise<ErrorDefinition[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockErrorDefinitions
}

export const addErrorDefinition = async (newError: Omit<ErrorDefinition, "id">): Promise<ErrorDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const newId = `err-def-${Math.random().toString(36).substring(2, 9)}`
  const error = { ...newError, id: newId }
  mockErrorDefinitions.push(error)
  return error
}

export const updateErrorDefinition = async (
  id: string,
  updates: Partial<ErrorDefinition>,
): Promise<ErrorDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockErrorDefinitions.findIndex((e) => e.id === id)
  if (index > -1) {
    mockErrorDefinitions[index] = { ...mockErrorDefinitions[index], ...updates }
    return mockErrorDefinitions[index]
  }
  throw new Error("Error not found")
}

export const deleteErrorDefinition = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  mockErrorDefinitions = mockErrorDefinitions.filter((e) => e.id !== id)
}

// --- Solution Step Management (part of Error Definition) ---
export const updateErrorSolutionSteps = async (errorId: string, steps: SolutionStep[]): Promise<ErrorDefinition> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const error = mockErrorDefinitions.find((e) => e.id === errorId)
  if (error) {
    error.solutionSteps = steps.map((step, index) => ({ ...step, order: index + 1 }))
    return error
  }
  throw new Error("Error not found")
}
