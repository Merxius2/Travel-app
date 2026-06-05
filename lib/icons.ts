import {
  Briefcase,
  Car,
  Coffee,
  Dumbbell,
  GraduationCap,
  Heart,
  Home,
  Hospital,
  Plane,
  Store,
  TreePine,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { LocationIconId } from "./types";

export interface IconOption {
  id: LocationIconId;
  label: string;
  icon: LucideIcon;
}

export const ICON_OPTIONS: IconOption[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "store", label: "Store", icon: Store },
  { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { id: "hospital", label: "Hospital", icon: Hospital },
  { id: "school", label: "School", icon: GraduationCap },
  { id: "park", label: "Park", icon: TreePine },
  { id: "car", label: "Car", icon: Car },
  { id: "plane", label: "Travel", icon: Plane },
  { id: "heart", label: "Favorite", icon: Heart },
];

export const COLOR_PRESETS = [
  { id: "violet", value: "#8B5CF6", label: "Violet" },
  { id: "fuchsia", value: "#D946EF", label: "Fuchsia" },
  { id: "rose", value: "#F43F5E", label: "Rose" },
  { id: "amber", value: "#F59E0B", label: "Amber" },
  { id: "emerald", value: "#10B981", label: "Emerald" },
  { id: "cyan", value: "#06B6D4", label: "Cyan" },
  { id: "blue", value: "#3B82F6", label: "Blue" },
  { id: "indigo", value: "#6366F1", label: "Indigo" },
] as const;

export function getIconComponent(iconId: LocationIconId): LucideIcon {
  const option = ICON_OPTIONS.find((item) => item.id === iconId);
  return option?.icon ?? Home;
}
