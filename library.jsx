// Student Library view — list of cases the student has access to
const { Icon: LI, DifficultyBadge: LDB } = window.ABS_UI;
const { CASES } = window.ABS_DATA;

// Subset of CASES presented as the student's assigned modules
const LIBRARY_ITEMS = [
  { caseId: "c-01", module: "Strategy in Emerging Markets", instructor: "Prof. Mounia Cherkaoui", due: "Due Tue · May 12", status: "in-progress", progress: 38, lastRead: "12 min ago", notes: 4 },
  { caseId: "c-03", module: "Inclusive Innovation", instructor: "Prof. Daniel Otieno", due: "Due Thu · May 14", status: "not-started", progress: 0, lastRead: null, notes: 0 },
  { caseId: "c-02", module: "Financial Institutions in Africa", instructor: "Prof. Réda Lahlou", due: "Closes Fri · May 15", status: "in-progress", progress: 72, lastRead: "Yesterday", notes: 9 },
  { caseId: "c-08", module: "Inclusive Innovation", instructor: "Prof. Daniel Otieno", due: "Closed · Apr 28", status: "complete", progress: 100, lastRead: "Apr 27", notes: 7 },
  { caseId: "c-04", module: "Strategy in Emerging Markets", instructor: "Prof. Mounia Cherkaoui", due: "Closed · Apr 18", status: "complete", progress: 100, lastRead: "Apr 17", notes: 12 },
];

function LibraryView({ onOpenReader }) {
  const [filter, setFilter] = useState("all"); // all | in-progress | not-started | complete

  const items = LIBRARY_ITEMS
    .map((it) => ({ ...it, c: CASES.find((c) => c.id === it.caseId) }))
    .filter((it) => filter === "all" ? true : it.status === filter);

  const counts = {
    all: LIBRARY_ITEMS.length,
    "in-progress": LIBRARY_ITEMS.filter((x) => x.status === "in-progress").length,
    "not-started": LIBRARY_ITEMS.filter((x) => x.status === "not-started").length,
    complete: LIBRARY_ITEMS.filter((x) => x.status === "complete").length,
  };

  const continueItem = LIBRARY_ITEMS.find((x) => x.status === "in-progress");
  const continueCase = continueItem && CASES.find((c) => c.id === continueItem.caseId);

  return (
    <div>
      <div className="hero-band" style={{ padding: "36px 48px 28px" }}>
        <div className="label-caps">My Library · EMBA Cohort 12</div>
        <h1 style={{ margin: "10px 0 4px" }}>Welcome back, Yasmine.</h1>
        <p className="muted" style={{ maxWidth: 600 }}>Five cases assigned across three modules this term. Two readings due this week.</p>

        {continueItem && continueCase && (
          <div style={{
            marginTop: 28,
            padding: "20px 24px",
            background: "white",
            border: "1px solid var(--outline-variant)",
            borderRadius: "var(--r-md)",
            borderLeft: "2px solid var(--primary-container)",
            display: "flex",
            alignItems: "center",
            gap: 24,
            maxWidth: 880,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="label-caps" style={{ fontSize: 10 }}>Continue Reading</div>
              <h3 style={{ margin: "8px 0 6px", fontSize: 19, lineHeight: 1.25 }}>{continueCase.title}</h3>
              <div style={{ fontSize: 13, color: "var(--on-surface-variant)", marginBottom: 10 }}>
                {continueItem.module} · last opened {continueItem.lastRead}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="progress-rail" style={{ flex: 1, maxWidth: 240 }}>
                  <div className="progress-fill" style={{ width: `${continueItem.progress}%` }} />
                </div>
                <span className="tnum" style={{ fontSize: 11, fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.06em" }}>{continueItem.progress}%</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => onOpenReader(continueCase)}>
              <LI name="play" size={13} /> Resume
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: "32px 48px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: 4, background: "var(--surface-container)", borderRadius: "var(--r-default)" }}>
            {[
              { id: "all", label: "All" },
              { id: "in-progress", label: "In Progress" },
              { id: "not-started", label: "New" },
              { id: "complete", label: "Complete" },
            ].map((t) => (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                padding: "8px 14px",
                background: filter === t.id ? "white" : "transparent",
                border: 0,
                borderRadius: 6,
                fontFamily: "Manrope",
                fontWeight: filter === t.id ? 700 : 500,
                fontSize: 12.5,
                color: filter === t.id ? "var(--on-surface)" : "var(--on-surface-variant)",
                cursor: "pointer",
                boxShadow: filter === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "var(--t)",
              }}>
                <span>{t.label}</span>
                <span className="tnum" style={{
                  fontSize: 10,
                  background: filter === t.id ? "var(--primary-container)" : "var(--outline-variant)",
                  color: filter === t.id ? "white" : "var(--on-surface-variant)",
                  padding: "1px 6px",
                  borderRadius: 999,
                  fontWeight: 700,
                }}>{counts[t.id]}</span>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "var(--on-surface-variant)", letterSpacing: "0.04em" }}>
            Showing <strong className="tnum">{items.length}</strong> of <span className="tnum">{LIBRARY_ITEMS.length}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((it) => <LibraryRow key={it.caseId + it.module} item={it} onOpen={() => onOpenReader(it.c)} />)}
          {items.length === 0 && (
            <div style={{ padding: 60, textAlign: "center", border: "1px dashed var(--outline-variant)", borderRadius: "var(--r-md)", color: "var(--on-surface-variant)" }}>
              Nothing in this filter. Try "All".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LibraryRow({ item, onOpen }) {
  const c = item.c;
  if (!c) return null;
  const statusBg = item.status === "complete" ? "var(--green-ok)" : item.status === "in-progress" ? "var(--primary-container)" : "var(--outline)";
  const statusLabel = item.status === "complete" ? "Complete" : item.status === "in-progress" ? "In Progress" : "Not Started";

  return (
    <article className="card" style={{
      padding: "20px 24px",
      display: "grid",
      gridTemplateColumns: "minmax(0,1fr) 220px 200px auto",
      gap: 24,
      alignItems: "center",
      background: "white",
      transition: "var(--t)",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary-container)"; e.currentTarget.style.boxShadow = "var(--shadow-2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--outline-variant)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span className="chip chip-discipline" style={{ fontSize: 10 }}>{c.discipline}</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusBg }} />
          <span style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--on-surface-variant)" }}>{statusLabel}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: 17, lineHeight: 1.3 }}>
          <a onClick={onOpen} style={{ color: "var(--on-surface)", cursor: "pointer" }}>{c.title}</a>
        </h3>
        <div style={{ fontSize: 12.5, color: "var(--on-surface-variant)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <strong style={{ color: "var(--on-surface)", fontWeight: 600 }}>{c.company}</strong>
          <span className="dot-sep">·</span>
          <span>{c.country}</span>
          <span className="dot-sep">·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><LI name="clock" size={11} />{c.readingMin} min</span>
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--on-surface-variant)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Module</div>
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{item.module}</div>
        <div style={{ fontSize: 11.5, color: "var(--on-surface-variant)", marginTop: 2 }}>{item.instructor}</div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: item.status === "complete" ? "var(--on-surface-variant)" : "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{item.due}</div>
        <div className="progress-rail"><div className="progress-fill" style={{ width: `${item.progress}%`, background: item.status === "complete" ? "var(--green-ok)" : "var(--primary-container)" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--on-surface-variant)" }}>
          <span className="tnum">{item.progress}%</span>
          {item.notes > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><LI name="bookmark" size={10} /> {item.notes}</span>}
        </div>
      </div>

      <div>
        <button className="btn btn-secondary btn-sm" onClick={onOpen} style={{ whiteSpace: "nowrap" }}>
          {item.status === "not-started" ? <><LI name="play" size={12} /> Start</> :
            item.status === "complete" ? <><LI name="eye" size={12} /> Review</> :
              <><LI name="book" size={12} /> Continue</>}
        </button>
      </div>
    </article>
  );
}

window.ABS_LIBRARY = { LibraryView };
