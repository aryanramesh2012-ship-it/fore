
import { useEffect, useRef, useState } from "react";
import {
  FOREST_INCIDENTS,
  INCIDENT_LABELS,
  normalizeVillage,
  type ForestIncident,
} from "./forestSimulation";

export interface ForestAlert extends ForestIncident {
  message: string;
  detectedAt: string;
  simulated: true;
}

interface SimulationOptions {
  village: string;
  state: string;
  enabled?: boolean;
  intervalMs?: number;
}

export function useForestSimulation({
  village,
  state,
  enabled = true,
  intervalMs = 20_000,
}: SimulationOptions) {
  const [alert, setAlert] = useState<ForestAlert | null>(null);
  const [monitoring, setMonitoring] = useState(false);
  const [lastDetection, setLastDetection] =
    useState<ForestIncident | null>(null);

  const indexRef = useRef(0);
  const lastAlertTimes = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!enabled) {
      setMonitoring(false);
      return;
    }

    setMonitoring(true);

    const runDetection = () => {
      // Cycle through the predefined simulated detections.
      const incident =
        FOREST_INCIDENTS[indexRef.current % FOREST_INCIDENTS.length];

      indexRef.current += 1;
      setLastDetection(incident);

      const sameVillage =
        normalizeVillage(village) === normalizeVillage(incident.village);

      const sameState =
        normalizeVillage(state) === normalizeVillage(incident.state);

      if (!sameVillage || !sameState) return;

      // Don't alert repeatedly for the same incident within 60 seconds.
      const now = Date.now();
      const lastAlert = lastAlertTimes.current[incident.id] ?? 0;

      if (now - lastAlert < 60_000) return;

      lastAlertTimes.current[incident.id] = now;

      setAlert({
        ...incident,
        message: INCIDENT_LABELS[incident.type],
        detectedAt: new Date().toLocaleTimeString(),
        simulated: true,
      });
    };

    // Run once immediately, then keep simulating while enabled.
    runDetection();
    const timer = window.setInterval(runDetection, intervalMs);

    return () => {
      window.clearInterval(timer);
      setMonitoring(false);
    };
  }, [village, state, enabled, intervalMs]);

  return {
    alert,
    setAlert,
    monitoring,
    lastDetection,
  };
}
