export type LocationIconId =
  | "home"
  | "work"
  | "gym"
  | "coffee"
  | "store"
  | "restaurant"
  | "hospital"
  | "school"
  | "park"
  | "car"
  | "plane"
  | "heart";

export interface Location {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: LocationIconId;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  locationId: string;
  timestamp: string;
}

export interface AppState {
  locations: Location[];
  checkIns: CheckIn[];
}

export interface LocationFormData {
  name: string;
  description: string;
  color: string;
  icon: LocationIconId;
}
