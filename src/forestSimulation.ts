
export type IncidentType = "gunshot" | "chainsaw" | "forest-fire";

export interface ForestIncident {
  id: string;
  village: string;
  state: string;
  type: IncidentType;
  audioFile: string;
  latitude: number;
  longitude: number;
}

// Demo locations only. Replace these with your actual marked map locations.
export const FOREST_INCIDENTS: ForestIncident[] = [
  {
    id: "demo-001",
    village: "Mudumalai",
    state: "Tamil Nadu",
    type: "chainsaw",
    audioFile: "/sounds/chainsaw.mp3",
    latitude: 11.57,
    longitude: 76.55,
  },
  {
    id: "demo-002",
    village: "Bandipur",
    state: "Karnataka",
    type: "gunshot",
    audioFile: "/sounds/gunshot.mp3",
    latitude: 11.67,
    longitude: 76.63,
  },
  {
    id: "demo-003",
    village: "Wayanad",
    state: "Kerala",
    type: "forest-fire",
    audioFile: "/sounds/forest-fire.mp3",
    latitude: 11.68,
    longitude: 76.13,
  },
];

export const INCIDENT_LABELS: Record<IncidentType, string> = {
  gunshot: "Possible gunshot detected",
  chainsaw: "Possible chainsaw activity detected",
  "forest-fire": "Possible forest-fire sound detected",
};

export function normalizeVillage(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}
