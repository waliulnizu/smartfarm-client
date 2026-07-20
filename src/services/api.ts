import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const hadToken = !!originalRequest.headers?.Authorization;
    if (error.response?.status === 401 && !originalRequest._retry && hadToken) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("accessToken", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export interface DailyLogPayload {
  animalId: string;
  date: string;
  feedConsumedKg: number;
  milkCollectedLiters?: number;
  eggsCollectedCount?: number;
  currentWeight: number;
  healthNotes?: string;
  extraMedicine?: string;
  isFeedDeficit?: boolean;
}

export interface DailyLogResponse {
  message: string;
  dailyLog: {
    _id: string;
    animalId: string;
    date: string;
    feedConsumedKg: number;
    milkCollectedLiters: number;
    eggsCollectedCount: number;
    currentWeight: number;
  };
}

export interface WeightGrowthResponse {
  animalId: string;
  latestRecord: { weight: number; date: string };
  previousRecord: { weight: number; date: string };
  dayRange: number;
  netWeightChange: number;
  percentageChange: number;
}

export interface AnimalPayload {
  type: "Cow" | "Goat" | "Hen" | "Duck";
  identityNumberOrBatchName: string;
  name?: string;
  ringNumber?: string;
  identificationType: "neck-tag" | "leg-ring";
  breed: string;
  averageFeedKg: number;
  entryWeight: number;
  status?: "healthy" | "sick";
  subType?: string;
  gender?: string;
  isPregnant?: boolean;
  source?: string;
  purchasePrice?: number;
  originDistrict?: string;
}

export interface AnimalResponse {
  _id: string;
  type: string;
  identityNumberOrBatchName: string;
  name?: string;
  ringNumber?: string;
  identificationType: string;
  breed: string;
  status: string;
}

export interface VaccineAlert {
  logId: string;
  medicineName: string;
  dosage: string;
  nextDoseDate: string;
  daysUntilDose: number;
  urgency: "overdue" | "tomorrow" | "upcoming";
  animal: {
    id: string;
    identityNumber: string;
    name?: string;
    type: string;
    ringNumber?: string;
  };
}

export interface VaccineAlertResponse {
  alerts: VaccineAlert[];
  count: number;
}

export interface AnimalListItem {
  _id: string;
  type: string;
  identityNumberOrBatchName: string;
  name?: string;
  ringNumber?: string;
  identificationType: string;
  breed: string;
  status: string;
  entryWeight: number;
  averageFeedKg: number;
  subType?: string;
  gender?: string;
  source?: string;
  purchasePrice?: number;
  originDistrict?: string;
  isPregnant?: boolean;
  calvingCount?: number;
  weightFrequencyDays?: number;
  lastWeightTakenDate?: string;
}

export interface MyAnimalsResponse {
  animals: AnimalListItem[];
  count: number;
}

export interface WeightScheduleAlert {
  animalId: string;
  identityNumber: string;
  name?: string;
  type: string;
  breed: string;
  frequencyDays: number;
  lastWeightTakenDate: string | null;
  nextDueDate: string;
  overdueDays: number;
  urgency: "due-today" | "overdue-soon" | "overdue";
}

export interface WeightScheduleAlertResponse {
  alerts: WeightScheduleAlert[];
  count: number;
}

export interface AnimalROIItem {
  _id: string;
  identityNumber: string;
  name?: string;
  type: string;
  breed: string;
  subType?: string;
  gender?: string;
  source?: string;
  purchasePrice?: number;
  originDistrict?: string;
  entryWeight: number;
  latestWeight: number;
  calvingCount?: number;
  isPregnant?: boolean;
  totalMilkLiters: number;
  milkIncome: number;
  assetValue: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  isProfit: boolean;
  logCount: number;
}

export interface AnimalROIDetailResponse {
  animal: {
    _id: string;
    identityNumberOrBatchName: string;
    name?: string;
    type: string;
    breed: string;
    subType?: string;
    gender?: string;
    source?: string;
    purchasePrice?: number;
    originDistrict?: string;
    entryWeight: number;
    entryDate: string;
    calvingCount: number;
  };
  income: {
    totalMilkLiters: number;
    milkPricePerLiter: number;
    milkIncome: number;
    assetValue: number;
    latestWeight: number;
    totalIncome: number;
  };
  expenses: {
    totalExpenses: number;
    breakdown: { category: string; amount: number }[];
  };
  profit: {
    netProfit: number;
    roi: number;
    isProfit: boolean;
  };
  pregnancy: {
    isActive: boolean;
    activePregnancy: { inseminationDate: string; expectedDeliveryDate: string } | null;
    completedCount: number;
    history: any[];
  };
  logCount: number;
  lastLogDate: string | null;
}

export interface CalvingPayload {
  motherId: string;
  inseminationDate: string;
  actualDeliveryDate: string;
  notes?: string;
}

export interface CalvingResponse {
  message: string;
  calf: { _id: string; identityNumberOrBatchName: string; type: string; breed: string };
  mother: { _id: string; identityNumberOrBatchName: string; calvingCount: number; isPregnant: boolean };
}

export async function submitDailyLog(
  payload: DailyLogPayload
): Promise<DailyLogResponse> {
  const { data } = await api.post<DailyLogResponse>("/daily-logs", payload);
  return data;
}

export async function getWeightGrowth(
  animalId: string,
  days?: number
): Promise<WeightGrowthResponse> {
  const params = days ? { days } : {};
  const { data } = await api.get<WeightGrowthResponse>(
    `/daily-logs/${animalId}/weight-growth`,
    { params }
  );
  return data;
}

export async function createAnimal(
  payload: AnimalPayload
): Promise<AnimalResponse> {
  const { data } = await api.post<AnimalResponse>("/animals", payload);
  return data;
}

export async function getVaccineAlerts(): Promise<VaccineAlertResponse> {
  const { data } = await api.get<VaccineAlertResponse>("/vaccines/alerts");
  return data;
}

export async function getMyAnimals(): Promise<MyAnimalsResponse> {
  const { data } = await api.get<MyAnimalsResponse>("/animals");
  return data;
}

export async function updateAnimal(
  id: string,
  payload: Partial<AnimalPayload>
): Promise<{ animal: AnimalListItem }> {
  const { data } = await api.put(`/animals/${id}`, payload);
  return data;
}

export async function deleteAnimal(id: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/animals/${id}`);
  return data;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt?: string;
}

export async function getMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/auth/me");
  return data;
}

export async function updateProfile(payload: { name?: string; email?: string; currentPassword?: string; newPassword?: string }): Promise<UserProfile> {
  const { data } = await api.put<UserProfile>("/auth/profile", payload);
  return data;
}

export async function getNextAnimalId(
  type: string
): Promise<{ nextId: string }> {
  const { data } = await api.get("/animals/next-id", { params: { type } });
  return data;
}

export async function getWeightScheduleAlerts(): Promise<WeightScheduleAlertResponse> {
  const { data } = await api.get<WeightScheduleAlertResponse>("/weight-schedule/alerts");
  return data;
}

export async function getAllAnimalsROI(): Promise<{ animals: AnimalROIItem[]; count: number }> {
  const { data } = await api.get<{ animals: AnimalROIItem[]; count: number }>("/roi");
  return data;
}

export async function getAnimalROI(animalId: string): Promise<AnimalROIDetailResponse> {
  const { data } = await api.get<AnimalROIDetailResponse>(`/roi/${animalId}`);
  return data;
}

export async function recordCalving(
  payload: CalvingPayload
): Promise<CalvingResponse> {
  const { data } = await api.post<CalvingResponse>("/calving", payload);
  return data;
}

export interface AdminUser {
  _id: string;
  name?: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export async function getUsers(): Promise<{ users: AdminUser[]; count: number }> {
  const { data } = await api.get("/admin/users");
  return data;
}

export async function createUser(payload: { name?: string; email: string; password: string }): Promise<{ message: string; user: AdminUser }> {
  const { data } = await api.post("/admin/users", payload);
  return data;
}

export async function toggleUserStatus(id: string): Promise<{ message: string; user: AdminUser }> {
  const { data } = await api.patch(`/admin/users/${id}/toggle`);
  return data;
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
}

export default api;
