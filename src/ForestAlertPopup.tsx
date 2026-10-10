
import type { ForestAlert } from "./useForestSimulation";

interface Props {
  alert: ForestAlert | null;
  onDismiss: () => void;
}

export default function ForestAlertPopup({
  alert,
  onDismiss,
}: Props) {
  if (!alert) return null;

  return (
    <div className="forest-alert-overlay">
      <section
        className="forest-alert-card"
        role="alert"
        aria-live="assertive"
      >
        <div className="forest-alert-header">
          <span className="forest-alert-icon">🌲</span>
          <div>
            <strong>Forest Guardian AI</strong>
            <small>Simulated notification · {alert.detectedAt}</small>
          </div>
          <button
            className="forest-alert-close"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>

        <span className="forest-demo-tag">
          DEMO · UNVERIFIED
        </span>

        <h2>⚠️ {alert.message}</h2>

        <p>
          A simulated sound detection is associated with{" "}
          <strong>{alert.village}, {alert.state}</strong>.
        </p>

        <p>
          This detection may be a false alarm. Do not approach
          a potentially dangerous area. Seek verification through
          the appropriate forest authorities.
        </p>

        <div className="forest-alert-actions">
          <button onClick={onDismiss}>
            Acknowledge alert
          </button>
        </div>
      </section>
    </div>
  );
}
