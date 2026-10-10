
import { useState, type FormEvent } from "react";
import ForestMap from "./ForestMap";
import ForestAlertPopup from "./ForestAlertPopup";
import { useForestSimulation } from "./useForestSimulation";
import "./App.css";

type Page =
  | "overview"
  | "monitoring"
  | "map"
  | "reports"
  | "history"
  | "community"
  | "learn"
  | "settings";

type Incident = {
  id: number;
  title: string;
  location: string;
  type: string;
  status: "Under review" | "Resolved" | "New report";
  time: string;
  description: string;
  sample?: boolean;
};

type Language = "English" | "Hindi" | "Telugu";
type ForestState = "Tamil Nadu" | "Karnataka" | "Kerala";

const initialIncidents: Incident[] = [
  {
    id: 1,
    title: "Possible chainsaw activity",
    location: "Northern forest sector",
    type: "Acoustic alert",
    status: "Under review",
    time: "Today, 9:30 AM",
    description:
      "Example alert that requires verification before any action is taken.",
    sample: true,
  },
  {
    id: 2,
    title: "Possible smoke sighting",
    location: "Eastern woodland",
    type: "Fire risk",
    status: "Under review",
    time: "Today, 8:15 AM",
    description:
      "Example observation. The presence of a fire has not been confirmed.",
    sample: true,
  },
  {
    id: 3,
    title: "Community patrol completed",
    location: "Village boundary",
    type: "Community update",
    status: "Resolved",
    time: "Yesterday",
    description: "Example community activity.",
    sample: true,
  },
];

const navigation: { id: Page; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "monitoring", label: "Forest monitoring" },
  { id: "map", label: "Forest map" },
  { id: "reports", label: "Report an incident" },
  { id: "history", label: "Incident history" },
  { id: "community", label: "Community" },
  { id: "learn", label: "Learn & protect" },
  { id: "settings", label: "Settings" },
];

function App() {
  const [screen, setScreen] = useState<"welcome" | "entry" | "app">(
    "welcome"
  );
  const [personName, setPersonName] = useState("");
  const [village, setVillage] = useState("");
  const [userState, setUserState] = useState<ForestState>("Karnataka");
  const [language, setLanguage] = useState<Language>("English");
  const [page, setPage] = useState<Page>("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [incidents, setIncidents] =
    useState<Incident[]>(initialIncidents);

  const [reportType, setReportType] = useState("Suspicious activity");
  const [reportArea, setReportArea] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [notice, setNotice] = useState("");

  // Simulated forest detections run only while the workspace is open.
  const { alert, setAlert } = useForestSimulation({
    village,
    state: userState,
    enabled: screen === "app",
    intervalMs: 20_000,
  });

  function showPage(nextPage: Page) {
    setPage(nextPage);
    setMobileNav(false);
    setNotice("");
  }

  function enterApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!personName.trim() || !village.trim()) return;

    setPersonName(personName.trim());
    setVillage(village.trim());
    setPage("overview");
    setScreen("app");
    setNotice(`Welcome, ${personName.trim()}.`);
  }

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!reportArea.trim() || !reportDetails.trim()) return;

    const newReport: Incident = {
      id: Date.now(),
      title: reportType,
      location: reportArea.trim(),
      type: "Community report",
      status: "New report",
      time: "Just now",
      description: reportDetails.trim(),
    };

    setIncidents((current) => [newReport, ...current]);
    setReportArea("");
    setReportDetails("");
    setPage("history");
    setNotice(
      "Report saved in this session. It has not been sent to forest authorities."
    );
  }

  const openIncidents = incidents.filter(
    (incident) => incident.status !== "Resolved"
  ).length;

  const communityReports = incidents.filter(
    (incident) => incident.type === "Community report"
  ).length;

  if (screen === "welcome") {
    return (
      <main className="welcome-screen">
        <nav className="welcome-nav">
          <a className="brand" href="#home">
            <span className="brand-icon" aria-hidden="true">
              F
            </span>
            <span>
              Forest Guardian
              <small>FOREST PROTECTION AND CONSERVATION</small>
            </span>
          </a>
        </nav>

        <section className="welcome-content" id="home">
          <div className="welcome-copy">
            <span className="eyebrow">PROTECTING OUR NATURAL WORLD</span>
            <h1>
              Protect the forest.
              <br />
              <span>Empower the people.</span>
            </h1>
            <p>
              Bringing communities and technology together to support
              forest monitoring, responsible reporting and environmental
              awareness.
            </p>

            <div className="welcome-actions">
              <button
                className="primary-button"
                onClick={() => setScreen("entry")}
              >
                Get started
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  setPage("learn");
                  setScreen("entry");
                }}
              >
                Explore our mission
              </button>
            </div>

            <div className="welcome-points">
              <span>Community reporting</span>
              <span>Forest awareness</span>
              <span>Incident tracking</span>
            </div>
          </div>

          <div
            className="forest-art"
            role="img"
            aria-label="Illustration of a forest landscape"
          >
            <div className="sun-glow" />
            <div className="mountain mountain-back" />
            <div className="mountain mountain-front" />
            <div className="tree tree-one" aria-hidden="true" />
            <div className="tree tree-two" aria-hidden="true" />
            <div className="tree tree-three" aria-hidden="true" />
            <div className="tree tree-four" aria-hidden="true" />
            <div className="forest-caption">
              <span className="status-dot" />
              Working together for healthier forests
            </div>
          </div>
        </section>

        <footer className="welcome-footer">
          <span>FOREST GUARDIAN</span>
          <span>Conservation starts with our communities.</span>
        </footer>
      </main>
    );
  }

  if (screen === "entry") {
    return (
      <main className="entry-screen">
        <section className="entry-card">
          <button
            type="button"
            className="back-button"
            onClick={() => setScreen("welcome")}
          >
            Back to welcome
          </button>

          <div className="entry-symbol" aria-hidden="true">
            F
          </div>
          <span className="eyebrow">GETTING STARTED</span>
          <h1>Welcome to your forest community.</h1>
          <p className="muted">
            Enter your details to personalise your workspace.
          </p>

          <form onSubmit={enterApp} className="entry-form">
            <label htmlFor="person-name">Full name</label>
            <input
              id="person-name"
              value={personName}
              onChange={(event) => setPersonName(event.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />

            <label htmlFor="village-name">Village or community</label>
            <input
              id="village-name"
              value={village}
              onChange={(event) => setVillage(event.target.value)}
              placeholder="e.g. Bandipur"
              required
            />

            <label htmlFor="forest-state">State</label>
            <select
              id="forest-state"
              value={userState}
              onChange={(event) =>
                setUserState(event.target.value as ForestState)
              }
              required
            >
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
            </select>

            <p className="muted">
              For the alert demonstration, use a matching sample location:
              Mudumalai, Bandipur or Wayanad.
            </p>

            <label htmlFor="preferred-language">Preferred language</label>
            <select
              id="preferred-language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
            </select>

            <button type="submit" className="primary-button">
              Continue to workspace
            </button>
          </form>

          <p className="entry-disclaimer">
            Your profile is stored only while this session is running.
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      {mobileNav && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}

      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-icon" aria-hidden="true">
            F
          </span>
          <span>
            Forest Guardian
            <small>FOREST CONSERVATION</small>
          </span>
        </div>

        <div className="sidebar-section-label">MENU</div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              aria-current={page === item.id ? "page" : undefined}
              onClick={() => showPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="community-mini">
            <span className="status-dot" />
            <div>
              <strong>Community workspace</strong>
              <small>{village}, {userState}</small>
            </div>
          </div>

          <button
            className="profile-button"
            onClick={() => showPage("settings")}
          >
            <span className="avatar">
              {(personName[0] || "U").toUpperCase()}
            </span>
            <span className="profile-text">
              <strong>{personName}</strong>
              <small>{village}</small>
            </span>
          </button>

          <button
            className="exit-button"
            onClick={() => {
              setScreen("welcome");
              setMobileNav(false);
              setNotice("");
              setAlert(null);
            }}
          >
            Return to welcome
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileNav((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={mobileNav}
          >
            Menu
          </button>

          <div className="breadcrumb">
            <span>Forest Guardian</span>
            <span>/</span>
            <strong>
              {navigation.find((item) => item.id === page)?.label}
            </strong>
          </div>

          <div className="topbar-right">
            <span className="topbar-avatar">
              {(personName[0] || "U").toUpperCase()}
            </span>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice-banner" role="status">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                Dismiss
              </button>
            </div>
          )}

          {page === "overview" && (
            <>
              <section className="page-heading">
                <div>
                  <span className="eyebrow">YOUR WORKSPACE</span>
                  <h1>Welcome back, {personName}.</h1>
                  <p>
                    Here's an overview of activity for {village}, {userState}.
                  </p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => showPage("reports")}
                >
                  Report an incident
                </button>
              </section>

              <section className="stats-grid">
                <StatCard
                  label="Total incidents"
                  value={incidents.length}
                  detail="Recorded in this session"
                />
                <StatCard
                  label="Awaiting review"
                  value={openIncidents}
                  detail="Require further verification"
                />
                <StatCard
                  label="Community reports"
                  value={communityReports}
                  detail="Submitted by community members"
                />
                <StatCard
                  label="Monitoring"
                  value="Demo mode"
                  detail="Simulated alerts only"
                />
              </section>

              <div className="content-grid">
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent activity</h2>
                      <p>Reports and observations</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => showPage("history")}
                    >
                      View all
                    </button>
                  </div>
                  <IncidentList incidents={incidents.slice(0, 4)} />
                </section>

                <section className="panel mission-panel">
                  <span className="eyebrow">OUR MISSION</span>
                  <div className="mission-icon" aria-hidden="true">
                    F
                  </div>
                  <h2>Every observation counts.</h2>
                  <p>
                    Share what you notice, learn about forest conservation
                    and help organise information for review.
                  </p>
                  <button
                    className="secondary-button full-button"
                    onClick={() => showPage("learn")}
                  >
                    Explore learning resources
                  </button>
                </section>
              </div>

              <section className="panel quick-actions">
                <div className="panel-heading">
                  <div>
                    <h2>Quick actions</h2>
                    <p>Go straight to a section</p>
                  </div>
                </div>

                <div className="quick-action-grid">
                  <QuickAction
                    title="Report an incident"
                    description="Submit an observation"
                    onClick={() => showPage("reports")}
                  />
                  <QuickAction
                    title="Forest map"
                    description="Explore the map of India"
                    onClick={() => showPage("map")}
                  />
                  <QuickAction
                    title="Forest monitoring"
                    description="Learn how monitoring could work"
                    onClick={() => showPage("monitoring")}
                  />
                </div>
              </section>
            </>
          )}

          {page === "monitoring" && (
            <>
              <PageHeading
                eyebrow="FOREST PROTECTION"
                title="Forest monitoring"
                description="Explore how repurposed phones could support acoustic monitoring in forest areas."
              />

              <div className="notice-banner">
                Demo mode is active. The system cycles through predefined
                example detections; it does not record or analyse live audio.
              </div>

              <section className="stats-grid">
                <StatCard
                  label="Connected devices"
                  value="0"
                  detail="No monitoring devices connected"
                />
                <StatCard
                  label="Audio detections"
                  value="Demo"
                  detail="Predefined sample records"
                />
                <StatCard
                  label="Fire alerts"
                  value="Demo only"
                  detail="No live fire detection"
                />
                <StatCard
                  label="Network"
                  value="Pending"
                  detail="Connectivity not configured"
                />
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>How monitoring works</h2>
                    <p>From audio collection to human review</p>
                  </div>
                </div>

                <div className="steps-grid">
                  <Step
                    number="01"
                    title="Collect"
                    text="A suitable device records environmental audio with the required permissions."
                  />
                  <Step
                    number="02"
                    title="Analyse"
                    text="An audio model looks for patterns associated with sounds such as chainsaws or gunshots."
                  />
                  <Step
                    number="03"
                    title="Verify"
                    text="A reviewer checks the result because an audio match alone cannot confirm an incident."
                  />
                  <Step
                    number="04"
                    title="Respond"
                    text="Verified information can be passed through an approved reporting process."
                  />
                </div>
              </section>
            </>
          )}

          {page === "map" && (
            <>
              <PageHeading
                eyebrow="GEOGRAPHIC OVERVIEW"
                title="Forest map of India"
                description="Explore India's geography and view illustrative forest incident markers."
              />

              <div className="notice-banner" role="note">
                This is a real geographic map of India. The displayed markers
                are demonstration examples, not verified incidents or live
                monitoring data. They do not identify sensitive wildlife
                locations.
              </div>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Explore India</h2>
                    <p>
                      Drag to move around, zoom to explore, and select a
                      marker for its example details.
                    </p>
                  </div>
                </div>

                <ForestMap />
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent observations</h2>
                    <p>Session records and illustrative entries</p>
                  </div>
                </div>
                <IncidentList incidents={incidents.slice(0, 4)} />
              </section>
            </>
          )}

          {page === "reports" && (
            <>
              <PageHeading
                eyebrow="COMMUNITY REPORTING"
                title="Report an incident"
                description="Record an observation for review."
              />

              <section className="panel form-panel">
                <h2>Observation details</h2>
                <p>Describe what you observed and where it happened.</p>

                <form className="report-form" onSubmit={submitReport}>
                  <label htmlFor="report-type">Incident type</label>
                  <select
                    id="report-type"
                    value={reportType}
                    onChange={(event) => setReportType(event.target.value)}
                  >
                    <option>Suspicious activity</option>
                    <option>Possible forest fire or smoke</option>
                    <option>Possible illegal logging</option>
                    <option>Wildlife concern</option>
                    <option>Environmental damage</option>
                    <option>Other observation</option>
                  </select>

                  <label htmlFor="report-area">General location</label>
                  <input
                    id="report-area"
                    value={reportArea}
                    onChange={(event) => setReportArea(event.target.value)}
                    placeholder="Enter the general area"
                    required
                  />

                  <label htmlFor="report-details">Description</label>
                  <textarea
                    id="report-details"
                    value={reportDetails}
                    onChange={(event) => setReportDetails(event.target.value)}
                    placeholder="Describe what you noticed."
                    rows={5}
                    required
                  />

                  <p className="muted">
                    Avoid including other people's private information or
                    the exact locations of vulnerable wildlife.
                  </p>

                  <button type="submit" className="primary-button">
                    Submit report
                  </button>
                </form>
              </section>
            </>
          )}

          {page === "history" && (
            <>
              <PageHeading
                eyebrow="RECORDS"
                title="Incident history"
                description="Review recorded observations and their current status."
              />

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>All incidents</h2>
                    <p>{incidents.length} recorded entries</p>
                  </div>
                </div>
                <IncidentList incidents={incidents} showDescription />
              </section>
            </>
          )}

          {page === "community" && (
            <>
              <PageHeading
                eyebrow="LOCAL COLLABORATION"
                title="Community"
                description={`Working together to support forest protection in ${village}, ${userState}.`}
              />

              <section className="content-grid">
                <div className="panel">
                  <h2>Working together</h2>
                  <p className="muted">
                    Community members can share observations, participate
                    in awareness activities and help identify concerns
                    that need further review.
                  </p>

                  <CommunityFeature
                    title="Local knowledge"
                    text="Residents can provide useful context about their surroundings."
                  />
                  <CommunityFeature
                    title="Human verification"
                    text="Reports should be checked before decisions are made."
                  />
                  <CommunityFeature
                    title="Responsible reporting"
                    text="Share relevant information while respecting privacy."
                  />
                </div>

                <div className="panel mission-panel">
                  <span className="eyebrow">YOUR PROFILE</span>
                  <div className="large-avatar">
                    {(personName[0] || "U").toUpperCase()}
                  </div>
                  <h2>{personName}</h2>
                  <p>{village}, {userState}</p>
                  <p className="muted">Language: {language}</p>
                  <button
                    className="secondary-button full-button"
                    onClick={() => showPage("settings")}
                  >
                    Manage profile
                  </button>
                </div>
              </section>
            </>
          )}

          {page === "learn" && (
            <>
              <PageHeading
                eyebrow="ENVIRONMENTAL AWARENESS"
                title="Learn & protect"
                description="Practical knowledge for protecting forests and using technology responsibly."
              />

              <section className="learning-grid">
                <LearningCard
                  number="01"
                  title="Recognising illegal logging"
                  text="Understand how to describe suspicious activity accurately. A sound alone cannot confirm illegal logging."
                  tag="Forest monitoring"
                />
                <LearningCard
                  number="02"
                  title="Forest fire awareness"
                  text="Learn to recognise possible warning signs and follow guidance from local emergency services."
                  tag="Fire safety"
                />
                <LearningCard
                  number="03"
                  title="Protecting wildlife"
                  text="Respect wildlife habitats and avoid publicly sharing sensitive locations of endangered animals."
                  tag="Biodiversity"
                />
                <LearningCard
                  number="04"
                  title="Privacy and technology"
                  text="Get permission before recording audio, collect only necessary information and protect submitted reports."
                  tag="Digital responsibility"
                />
              </section>
            </>
          )}

          {page === "settings" && (
            <>
              <PageHeading
                eyebrow="PREFERENCES"
                title="Settings"
                description="Update your profile, location and language preference."
              />

              <section className="panel form-panel">
                <h2>Profile details</h2>

                <form
                  className="report-form"
                  onSubmit={(event) => {
                    event.preventDefault();

                    if (!personName.trim() || !village.trim()) return;

                    setPersonName(personName.trim());
                    setVillage(village.trim());
                    setNotice("Your profile has been updated.");
                  }}
                >
                  <label htmlFor="settings-name">Full name</label>
                  <input
                    id="settings-name"
                    value={personName}
                    onChange={(event) => setPersonName(event.target.value)}
                    required
                  />

                  <label htmlFor="settings-village">
                    Village or community
                  </label>
                  <input
                    id="settings-village"
                    value={village}
                    onChange={(event) => setVillage(event.target.value)}
                    required
                  />

                  <label htmlFor="settings-state">State</label>
                  <select
                    id="settings-state"
                    value={userState}
                    onChange={(event) =>
                      setUserState(event.target.value as ForestState)
                    }
                    required
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                  </select>

                  <label htmlFor="settings-language">
                    Preferred language
                  </label>
                  <select
                    id="settings-language"
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as Language)
                    }
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                  </select>

                  <button type="submit" className="primary-button">
                    Save changes
                  </button>
                </form>

                <div className="settings-warning">
                  <strong>System status</strong>
                  <p>
                    Profile and report data are currently stored in
                    application memory. Forest alerts use predefined demo
                    incidents. Database storage, live audio monitoring
                    and automatic notifications still need to be connected.
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => {
                    setPersonName("");
                    setVillage("");
                    setUserState("Karnataka");
                    setLanguage("English");
                    setIncidents(initialIncidents);
                    setPage("overview");
                    setScreen("welcome");
                    setNotice("");
                    setAlert(null);
                  }}
                >
                  Reset and sign out
                </button>
              </section>
            </>
          )}

          <footer className="app-footer">
            <span>FOREST GUARDIAN</span>
            <span>Community-led forest conservation</span>
          </footer>
        </div>
      </main>

      <ForestAlertPopup
        alert={alert}
        onDismiss={() => setAlert(null)}
      />
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </article>
  );
}

function IncidentList({
  incidents,
  showDescription = false,
}: {
  incidents: Incident[];
  showDescription?: boolean;
}) {
  if (incidents.length === 0) {
    return <p className="empty-state">No incidents have been recorded yet.</p>;
  }

  return (
    <div className="incident-list">
      {incidents.map((incident) => (
        <article className="incident-row" key={incident.id}>
          <div className="incident-main">
            <strong>{incident.title}</strong>
            <span>{incident.location}</span>
            <small>
              {incident.time} · {incident.type}
              {incident.sample ? " · Example" : ""}
            </small>

            {showDescription && (
              <p className="incident-description">{incident.description}</p>
            )}
          </div>

          <span
            className={`status-pill ${
              incident.status === "Resolved"
                ? "status-resolved"
                : incident.status === "New report"
                  ? "status-new"
                  : "status-review"
            }`}
          >
            {incident.status}
          </span>
        </article>
      ))}
    </div>
  );
}

function QuickAction({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button className="quick-action" onClick={onClick}>
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="step-card">
      <span className="step-number">{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function LearningCard({
  number,
  title,
  text,
  tag,
}: {
  number: string;
  title: string;
  text: string;
  tag: string;
}) {
  return (
    <article className="learning-card">
      <span className="learning-number">{number}</span>
      <span className="learning-tag">{tag}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}

function CommunityFeature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="community-feature">
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default App;
