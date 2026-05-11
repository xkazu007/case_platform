// Case Reader — Student View
const { Icon: RI } = window.ABS_UI;
const { READER_SECTIONS, READER_BODY } = window.ABS_DATA;

// Item 11: hardcoded assignment questions shown in collapsible strip
const ASSIGNMENT_QUESTIONS = [
  "Frame OCP's strategic decision in a single sentence. What is the board being asked to approve, exactly?",
  "The CFO asks at what return on invested capital a sovereign mission stops looking like a strategy. How would you answer that question using the data in the case?",
  "Which of the three constituencies — the Industrial Director, Chief Strategy Officer, or CFO — has the strongest argument? What evidence supports your position?",
];

function ReaderView({ onExit }) {
  const [sections, setSections] = useState(READER_SECTIONS);
  const currentIdx = sections.findIndex((s) => s.status === "current");
  const currentSection = sections[currentIdx];
  const completedCount = sections.filter((s) => s.status === "done").length;
  const progressPct = Math.round(completedCount / sections.length * 100);

  const [readMs, setReadMs] = useState(4 * 60_000 + 32_000);
  const [tabSwitches, setTabSwitches] = useState(1);
  const [isFocused, setIsFocused] = useState(true);

  // Item 12: chunk size state
  const [chunkSize, setChunkSize] = useState("Half");

  // Annotations lifted to parent so both panels can access them
  const [annotations, setAnnotations] = useState([
    { id: "a1", category: "note", kind: "highlight", text: "the yield gap, as agronomists in the room described it", note: "", section: "Section II" },
    { id: "a2", category: "note", kind: "comment", text: "vertical integration into downstream agri-services", note: "Compare to Aramco vertical move 2018", section: "Section II" },
    { id: "a3", category: "question", kind: "question", text: "", note: "What hurdle rate would the CFO actually accept given the sovereign mandate?", section: "Section II" },
  ]);

  const addAnnotation = (a) => setAnnotations((arr) => [...arr, a]);
  const updateAnnotation = (id, patch) => setAnnotations((arr) => arr.map((x) => x.id === id ? { ...x, ...patch } : x));
  const removeAnnotation = (id) => setAnnotations((arr) => arr.filter((x) => x.id !== id));

  useEffect(() => {
    if (!isFocused) return;
    const id = setInterval(() => setReadMs((ms) => ms + 1000), 1000);
    return () => clearInterval(id);
  }, [isFocused]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        setIsFocused(false);
        setTabSwitches((n) => n + 1);
      } else {
        setIsFocused(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const fmtTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m} min ${ss.toString().padStart(2, "0")} sec`;
  };

  const advance = () => {
    if (currentIdx < 0) return;
    setSections((prev) => prev.map((s, i) => {
      if (i === currentIdx) return { ...s, status: "done" };
      if (i === currentIdx + 1) return { ...s, status: "current" };
      return s;
    }));
  };
  const back = () => {
    if (currentIdx <= 0) return;
    setSections((prev) => prev.map((s, i) => {
      if (i === currentIdx) return { ...s, status: "locked" };
      if (i === currentIdx - 1) return { ...s, status: "current" };
      return s;
    }));
  };

  return (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr", height: "100%", position: "relative" }}>
      <div className="focus-bar" style={{ padding: "10px 32px" }}>
        <button className="btn-link" onClick={onExit} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, letterSpacing: "0.04em" }}>
          <RI name="arrL" size={13} /> Exit reader
        </button>
        <div style={{ flex: 1 }} />
        <span className="stat" aria-label="reading time">
          <RI name="book" size={13} />
          <span>Reading time:</span>
          <strong style={{ color: "var(--on-surface)" }}>{fmtTime(readMs)}</strong>
        </span>
        <span style={{ width: 1, height: 14, background: "var(--outline-variant)" }} />
        <span className={`stat ${tabSwitches > 2 ? "warn" : ""}`} aria-label="tab switches">
          {tabSwitches > 2 ? <RI name="warn" size={13} /> : <RI name="eye" size={13} />}
          <span>{tabSwitches > 2 ? "You've switched tabs" : "Tab switches:"}</span>
          <strong className="tnum">{tabSwitches} {tabSwitches > 2 ? "times" : ""}</strong>
        </span>
        <span style={{ width: 1, height: 14, background: "var(--outline-variant)" }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--on-surface-variant)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-ok)" }} /> Single-session access
        </span>
      </div>

      {/* Item 9: three-column layout — TOC (220px) | content (flex) | annotations (280px) */}
      <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0,1fr) 280px", height: "100%", overflow: "hidden" }}>
        {/* Left: TOC only */}
        <aside style={{ borderRight: "1px solid var(--outline-variant)", background: "white", padding: "24px 0", overflowY: "auto" }}>
          <div style={{ padding: "0 20px" }}>
            <div className="label-caps">Table of Contents</div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--on-surface-variant)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
              <span>Progress</span>
              <span className="tnum">{progressPct}%</span>
            </div>
            <div className="progress-rail"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
          </div>
          <div style={{ marginTop: 20 }}>
            {sections.map((s, i) => <TocItem key={s.id} idx={i + 1} section={s} />)}
          </div>
        </aside>

        {/* Center: case content */}
        <main className="scroll-y" style={{ padding: "40px 56px 80px", position: "relative" }}>
          <ReaderHeader />

          {/* Item 11: collapsible assignment questions strip — sticky within scroll area */}
          <AssignmentStrip />

          {/* Item 12: section size selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: "var(--on-surface-variant)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>View</span>
            <div style={{ display: "flex", background: "var(--surface-container)", borderRadius: 6, padding: 2, gap: 0 }}>
              {["Full", "Half", "Quarter"].map(sz => (
                <button key={sz} onClick={() => setChunkSize(sz)} style={{
                  padding: "5px 12px",
                  background: chunkSize === sz ? "white" : "transparent",
                  border: 0, borderRadius: 4,
                  fontFamily: "Manrope", fontWeight: chunkSize === sz ? 700 : 500, fontSize: 11.5,
                  color: chunkSize === sz ? "var(--on-surface)" : "var(--on-surface-variant)",
                  cursor: "pointer",
                  boxShadow: chunkSize === sz ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "var(--t)",
                }}>{sz}</button>
              ))}
            </div>
          </div>

          <ChunkCard
            section={currentSection}
            isFocused={isFocused}
            onResume={() => setIsFocused(true)}
            onAddAnnotation={addAnnotation}
            chunkSize={chunkSize}
            sectionLabel={currentSection?.label || ""}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--outline-variant)" }}>
            <button className="btn btn-ghost" onClick={back} disabled={currentIdx <= 0} style={{ opacity: currentIdx <= 0 ? 0.4 : 1 }}>
              <RI name="arrL" size={14} /> Previous Section
            </button>
            <div style={{ fontSize: 12, color: "var(--on-surface-variant)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
              Section {currentIdx + 1} of {sections.length}
            </div>
            <button className="btn btn-primary" onClick={advance} disabled={currentIdx >= sections.length - 1}>
              Next Section <RI name="arrR" size={14} />
            </button>
          </div>
        </main>

        {/* Item 9: right annotations panel */}
        <aside style={{ borderLeft: "1px solid var(--outline-variant)", background: "white", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <AnnotationsPanel
            annotations={annotations}
            onUpdate={updateAnnotation}
            onRemove={removeAnnotation}
            onAddNote={(note, section) => addAnnotation({ id: `n-${Date.now()}`, category: "note", kind: "note", text: "", note, section })}
            onAddQuestion={(note, section) => addAnnotation({ id: `q-${Date.now()}`, category: "question", kind: "question", text: "", note, section })}
            currentSection={currentSection?.label || ""}
          />
        </aside>
      </div>
    </div>
  );
}

// Item 11: assignment questions strip with sticky positioning
function AssignmentStrip() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 10,
      marginBottom: 24, maxWidth: 780,
      border: "1px solid var(--outline-variant)",
      borderRadius: "var(--r-md)",
      overflow: "hidden",
      boxShadow: open ? "none" : "var(--shadow-1)",
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px",
        background: "var(--surface-container)",
        border: 0, cursor: "pointer",
        fontFamily: "Manrope", fontWeight: 700, fontSize: 11.5,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "var(--on-surface-variant)",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RI name="msg" size={13} />
          Assignment Questions
        </span>
        <span style={{ transform: open ? "rotate(0)" : "rotate(-90deg)", transition: "var(--t)", display: "flex" }}>
          <RI name="chevD" size={13} />
        </span>
      </button>
      {open && (
        <ol style={{ margin: 0, padding: "14px 18px 16px 38px", background: "white", listStyle: "decimal" }}>
          {ASSIGNMENT_QUESTIONS.map((q, i) => (
            <li key={i} style={{ fontSize: 13, lineHeight: 1.65, color: "var(--on-surface)", padding: "3px 0 3px 4px" }}>{q}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

// Item 10: split annotations panel — Notes & Highlights + Questions
function AnnotationsPanel({ annotations, onUpdate, onRemove, onAddNote, onAddQuestion, currentSection }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [composingNote, setComposingNote] = useState(false);
  const [composingQ, setComposingQ] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newQ, setNewQ] = useState("");

  const notes = annotations.filter(a => a.category === "note");
  const questions = annotations.filter(a => a.category === "question");

  const startEdit = (a) => { setEditingId(a.id); setDraft(a.note || ""); };
  const saveEdit = (id) => { onUpdate(id, { note: draft }); setEditingId(null); setDraft(""); };

  const submitNote = () => {
    const t = newNote.trim();
    if (!t) return;
    onAddNote(t, currentSection);
    setNewNote(""); setComposingNote(false);
  };
  const submitQ = () => {
    const t = newQ.trim();
    if (!t) return;
    onAddQuestion(t, currentSection);
    setNewQ(""); setComposingQ(false);
  };

  // Item 10: print button exports annotations to a new window
  const printAnnotations = () => {
    const win = window.open("", "_blank");
    const rows = annotations.map(a => `
      <div style="margin-bottom:14px;padding:10px 12px;border-left:3px solid ${a.category==="question"?"#D04425":"#2F7D5B"};background:#fafafa">
        <div style="font-size:10px;text-transform:uppercase;font-weight:700;color:#5A413B;margin-bottom:4px">${a.category.toUpperCase()} · ${a.section||currentSection||""}</div>
        ${a.text ? `<div style="font-style:italic;color:#5A413B;margin-bottom:4px">"${a.text}"</div>` : ""}
        <div style="font-size:13px;line-height:1.5">${a.note||""}</div>
      </div>`).join("");
    win.document.write(`<html><head><title>Notes — ${READER_BODY.title}</title>
      <style>body{font-family:Georgia,serif;max-width:680px;margin:40px auto;font-size:14px;line-height:1.6;color:#1B1B1C}</style>
      </head><body>
      <h1 style="font-size:20px;margin-bottom:4px">${READER_BODY.title}</h1>
      <p style="color:#5A413B;font-size:13px;margin-bottom:24px">Exported ${new Date().toLocaleDateString()} · ${annotations.length} annotation${annotations.length!==1?"s":""}</p>
      <hr style="border:0;border-top:1px solid #E2BFB7;margin-bottom:20px"/>
      ${rows}
      </body></html>`);
    win.print();
  };

  const swatch = (kind) => kind === "highlight" ? "var(--yellow-chip)" : kind === "underline" ? "var(--primary-container)" : kind === "question" ? "rgba(208,68,37,0.15)" : "var(--secondary-container)";

  const AnnotationItem = ({ a }) => {
    const isEditing = editingId === a.id;
    return (
      <li style={{
        padding: "8px 10px",
        background: a.kind === "highlight" ? "#FFF6CC" : a.category === "question" ? "rgba(208,68,37,0.04)" : "var(--surface-container)",
        borderRadius: 4,
        borderLeft: `2px solid ${swatch(a.kind)}`,
        fontSize: 12.5, color: "var(--on-surface)", position: "relative",
      }}
        onMouseEnter={(e) => e.currentTarget.querySelector(".note-actions").style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.querySelector(".note-actions").style.opacity = 0}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--on-surface-variant)" }}>
          <RI name={a.kind === "highlight" ? "highlight" : a.kind === "underline" ? "underline" : a.category === "question" ? "question" : "note"} size={10} />
          <span>{a.kind}</span>
          {a.section && <span style={{ marginLeft: 4, color: "var(--outline)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>· {a.section}</span>}
          <span className="note-actions" style={{ marginLeft: "auto", display: "flex", gap: 4, opacity: 0, transition: "opacity 120ms" }}>
            {!isEditing && <button onClick={() => startEdit(a)} style={iconBtn}><RI name="edit" size={10} /></button>}
            <button onClick={() => onRemove(a.id)} style={iconBtn}><RI name="x" size={10} /></button>
          </span>
        </div>
        {a.text && (
          <div style={{ fontStyle: "italic", color: "var(--on-surface-variant)", marginBottom: a.note || isEditing ? 5 : 0, lineHeight: 1.5, fontSize: 12 }}>
            "{a.text.length > 80 ? a.text.slice(0, 80) + "…" : a.text}"
          </div>
        )}
        {isEditing ? (
          <div>
            <textarea autoFocus className="textarea" style={{ minHeight: 52, fontSize: 12.5, padding: "6px 8px", lineHeight: 1.5 }} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add your note…"/>
            <div style={{ display: "flex", gap: 6, marginTop: 6, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={() => saveEdit(a.id)}>Save</button>
            </div>
          </div>
        ) : a.note ? (
          <div onClick={() => startEdit(a)} style={{ color: "var(--on-surface)", lineHeight: 1.5, cursor: "text", fontSize: 12.5 }}>{a.note}</div>
        ) : (
          <button onClick={() => startEdit(a)} style={{ background: "transparent", border: 0, padding: 0, color: "var(--primary)", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}>
            <RI name="plus" size={10} /> Add note
          </button>
        )}
      </li>
    );
  };

  const ComposeBox = ({ value, onChange, onSubmit, onCancel, placeholder }) => (
    <div style={{ marginBottom: 10, padding: 9, background: "var(--surface-container)", borderRadius: 6, border: "1px solid var(--outline-variant)" }}>
      <textarea autoFocus className="textarea" placeholder={placeholder}
        style={{ minHeight: 56, fontSize: 12.5, padding: "7px 9px", lineHeight: 1.5 }}
        value={value} onChange={(e) => onChange(e.target.value)}
      />
      <div style={{ display: "flex", gap: 5, marginTop: 7, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={onSubmit} disabled={!value.trim()} style={{ opacity: value.trim() ? 1 : 0.5 }}>Save</button>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 16px 16px" }}>
      {/* Notes & Highlights section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div className="label-caps label-caps-muted" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RI name="highlight" size={11} />
            Notes & Highlights
            {notes.length > 0 && <span style={{ background: "var(--surface-container-high)", borderRadius: "999px", padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{notes.length}</span>}
          </div>
          <button onClick={() => { setComposingNote(c => !c); setComposingQ(false); }} title="Add note" style={{
            width: 20, height: 20, border: "1px solid var(--outline-variant)",
            background: composingNote ? "var(--primary-container)" : "white",
            color: composingNote ? "white" : "var(--on-surface-variant)",
            borderRadius: 4, cursor: "pointer", display: "grid", placeItems: "center",
          }}>
            <RI name={composingNote ? "x" : "plus"} size={11} stroke={2} />
          </button>
        </div>
        {composingNote && (
          <ComposeBox value={newNote} onChange={setNewNote} onSubmit={submitNote}
            onCancel={() => { setComposingNote(false); setNewNote(""); }}
            placeholder="Jot a thought, a connection, a key insight…"
          />
        )}
        {notes.length === 0 && !composingNote && (
          <div style={{ fontSize: 12, color: "var(--on-surface-variant)", lineHeight: 1.5, padding: "6px 0" }}>
            Select text to highlight or click <strong>+</strong> for a free-form note.
          </div>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
          {notes.map(a => <AnnotationItem key={a.id} a={a} />)}
        </ul>
      </div>

      {/* Questions section */}
      <div style={{ borderTop: "1px solid var(--outline-variant)", paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div className="label-caps label-caps-muted" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RI name="question" size={11} />
            Questions
            {questions.length > 0 && <span style={{ background: "rgba(208,68,37,0.1)", borderRadius: "999px", padding: "1px 6px", fontSize: 10, fontWeight: 700, color: "var(--primary-container)" }}>{questions.length}</span>}
          </div>
          <button onClick={() => { setComposingQ(c => !c); setComposingNote(false); }} title="Add question" style={{
            width: 20, height: 20, border: "1px solid var(--outline-variant)",
            background: composingQ ? "var(--primary-container)" : "white",
            color: composingQ ? "white" : "var(--on-surface-variant)",
            borderRadius: 4, cursor: "pointer", display: "grid", placeItems: "center",
          }}>
            <RI name={composingQ ? "x" : "plus"} size={11} stroke={2} />
          </button>
        </div>
        {composingQ && (
          <ComposeBox value={newQ} onChange={setNewQ} onSubmit={submitQ}
            onCancel={() => { setComposingQ(false); setNewQ(""); }}
            placeholder="What do you want to ask in class or investigate further?"
          />
        )}
        {questions.length === 0 && !composingQ && (
          <div style={{ fontSize: 12, color: "var(--on-surface-variant)", lineHeight: 1.5, padding: "6px 0" }}>
            Click <strong>+</strong> or select text and choose "Question" to capture something to ask in class.
          </div>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
          {questions.map(a => <AnnotationItem key={a.id} a={a} />)}
        </ul>
      </div>

      {/* Item 10: print button */}
      {annotations.length > 0 && (
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--outline-variant)" }}>
          <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", gap: 7, fontSize: 11 }} onClick={printAnnotations}>
            <RI name="print" size={13} /> Print notes & questions
          </button>
        </div>
      )}
    </div>
  );
}

const iconBtn = {
  background: "transparent", border: 0, padding: 2,
  cursor: "pointer", color: "var(--on-surface-variant)",
  display: "grid", placeItems: "center", borderRadius: 3,
};

function TocItem({ idx, section }) {
  const isCurrent = section.status === "current";
  const isDone = section.status === "done";
  const isLocked = section.status === "locked";
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "12px 20px",
      borderLeft: isCurrent ? "3px solid var(--primary-container)" : "3px solid transparent",
      background: isCurrent ? "var(--surface-container)" : "transparent",
      cursor: isLocked ? "default" : "pointer",
      opacity: isLocked ? 0.5 : 1, transition: "var(--t)",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        display: "grid", placeItems: "center",
        background: isDone ? "var(--green-ok)" : isCurrent ? "var(--primary-container)" : "transparent",
        border: isDone || isCurrent ? "0" : "1.5px solid var(--outline-variant)",
        color: isDone || isCurrent ? "white" : "var(--on-surface-variant)",
        fontSize: 11, fontWeight: 700, marginTop: 1,
      }}>
        {isDone ? <RI name="check" size={11} stroke={2.4} /> : isLocked ? <RI name="lock" size={10} stroke={1.6} /> : <span className="tnum">{idx}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: isCurrent ? "var(--primary-container)" : "var(--on-surface-variant)", marginBottom: 2 }}>
          {section.label}
        </div>
        <div style={{ fontSize: 12.5, fontWeight: isCurrent ? 600 : 500, color: "var(--on-surface)", lineHeight: 1.35 }}>
          {section.title}
        </div>
      </div>
    </div>
  );
}

function ReaderHeader() {
  return (
    <div className="card" style={{ padding: 32, marginBottom: 24, maxWidth: 780 }}>
      <div className="label-caps">{READER_BODY.eyebrow}</div>
      <h1 className="display" style={{ fontSize: 36, marginTop: 12, lineHeight: 1.1, maxWidth: 680 }}>{READER_BODY.title}</h1>
      <div style={{ marginTop: 12, fontSize: 13, color: "var(--on-surface-variant)" }}>{READER_BODY.byline}</div>
      <hr className="divider" style={{ margin: "20px 0 0" }} />
    </div>
  );
}

function ChunkCard({ section, isFocused, onResume, onAddAnnotation, chunkSize, sectionLabel }) {
  const bodyRef = useRef(null);
  const [bubble, setBubble] = useState(null);
  const [popupDraft, setPopupDraft] = useState({ open: false, type: "note", text: "", value: "", x: 0, y: 0 });

  // Item 12: truncate paragraphs based on chunkSize
  const allParas = READER_BODY.current.paragraphs;
  const visibleParas = chunkSize === "Full"
    ? allParas
    : chunkSize === "Half"
      ? allParas.slice(0, Math.ceil(allParas.length / 2))
      : allParas.slice(0, Math.max(1, Math.ceil(allParas.length / 4)));
  const isTruncated = visibleParas.length < allParas.length;

  const onMouseUp = () => {
    if (popupDraft.open) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { setBubble(null); return; }
    const range = sel.getRangeAt(0);
    if (!bodyRef.current?.contains(range.commonAncestorContainer)) { setBubble(null); return; }
    const rect = range.getBoundingClientRect();
    const parentRect = bodyRef.current.getBoundingClientRect();
    setBubble({ x: rect.left + rect.width / 2 - parentRect.left, y: rect.top - parentRect.top, range, text: sel.toString() });
  };

  const applyAnnotation = (kind) => {
    if (!bubble?.range) return;
    const { range, text } = bubble;
    if (kind === "note" || kind === "question") {
      setPopupDraft({ open: true, type: kind, text, value: "", x: bubble.x, y: bubble.y });
      setBubble(null);
      return;
    }
    try {
      const mark = document.createElement("mark");
      mark.className = kind === "highlight" ? "hl" : "ul";
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
      window.getSelection()?.removeAllRanges();
    } catch (e) {}
    onAddAnnotation({ id: `a-${Date.now()}`, category: "note", kind, text, note: "", section: sectionLabel });
    setBubble(null);
  };

  const savePopup = () => {
    onAddAnnotation({
      id: `a-${Date.now()}`,
      category: popupDraft.type === "question" ? "question" : "note",
      kind: popupDraft.type,
      text: popupDraft.text,
      note: popupDraft.value,
      section: sectionLabel,
    });
    setPopupDraft({ open: false, type: "note", text: "", value: "", x: 0, y: 0 });
  };

  return (
    // Item 15: do-not-copy watermark via CSS ::after on .do-not-copy class
    <article className="card do-not-copy" style={{ padding: 36, maxWidth: 780, position: "relative" }} onMouseUp={onMouseUp}>
      <div className="label-caps">{section.label}</div>
      <h2 style={{ margin: "14px 0 24px", fontSize: 30, lineHeight: 1.15 }}>{section.title}</h2>

      <div ref={bodyRef} style={{ fontSize: 17, lineHeight: 1.8, color: "var(--on-surface)" }}>
        {visibleParas.map((p, i) =>
          <p key={i} style={{ marginBottom: 20 }}>{p}</p>
        )}

        {/* Only show blockquote and trailing content when Full or at least Half */}
        {!isTruncated && (
          <>
            <blockquote className="accent-bar" style={{ margin: "32px 0", fontFamily: "Epilogue", fontWeight: 400, fontSize: 22, lineHeight: 1.4, color: "var(--on-surface)" }}>
              "At what level of return on invested capital does a sovereign mission stop looking like a strategy and start looking like a subsidy?"
              <div style={{ fontFamily: "Manrope", fontWeight: 600, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginTop: 12 }}>— CFO, Executive Committee Meeting</div>
            </blockquote>
            <p>The committee adjourned without a decision. Three weeks later, the chairman convened a smaller working group of six — three internal, three external — to reframe the question. The reframing was deliberate, and worth examining: rather than asking whether to commit, the working group was asked to specify what would have to be true, in 2030, for the commitment to be judged successful.</p>
          </>
        )}

        {/* Item 12: truncation indicator */}
        {isTruncated && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", color: "var(--on-surface-variant)", fontSize: 13 }}>
            <div style={{ flex: 1, height: 1, background: "var(--outline-variant)" }} />
            <span style={{ fontWeight: 600, letterSpacing: "0.04em" }}>Continue in Full view</span>
            <div style={{ flex: 1, height: 1, background: "var(--outline-variant)" }} />
          </div>
        )}
      </div>

      {bubble && (
        <div className="annot-bubble" style={{ left: bubble.x, top: bubble.y }} onMouseDown={(e) => e.preventDefault()}>
          <button onClick={() => applyAnnotation("highlight")}><span className="swatch" style={{ background: "var(--yellow-chip)" }} />Highlight</button>
          <button onClick={() => applyAnnotation("underline")}><span className="swatch" style={{ background: "var(--primary-container)" }} />Underline</button>
          {/* Item 10: separate Note and Question actions */}
          <button onClick={() => applyAnnotation("note")}><RI name="note" size={12} />Note</button>
          <button onClick={() => applyAnnotation("question")}><RI name="question" size={12} />Question</button>
        </div>
      )}

      {popupDraft.open && (
        <div style={{
          position: "absolute", left: popupDraft.x, top: popupDraft.y,
          transform: "translate(-50%, -100%)", marginTop: -10,
          background: "white", border: "1px solid var(--outline-variant)",
          boxShadow: "var(--shadow-3)", borderRadius: "var(--r-md)",
          padding: 14, width: 300, zIndex: 60,
        }} onMouseDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "var(--on-surface-variant)", marginBottom: 6 }}>
            {popupDraft.type === "question" ? "Save as Question" : "Save as Note"}
          </div>
          {popupDraft.text && (
            <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--on-surface-variant)", marginBottom: 8, lineHeight: 1.5, padding: "5px 8px", background: "var(--surface-container)", borderRadius: 4, borderLeft: "2px solid var(--outline-variant)" }}>
              "{popupDraft.text.length > 100 ? popupDraft.text.slice(0, 100) + "…" : popupDraft.text}"
            </div>
          )}
          <textarea autoFocus className="textarea"
            placeholder={popupDraft.type === "question" ? "What do you want to ask in class?" : "What's worth noting here?"}
            style={{ minHeight: 65, fontSize: 13, padding: "8px 10px" }}
            value={popupDraft.value}
            onChange={(e) => setPopupDraft((c) => ({ ...c, value: e.target.value }))}
          />
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPopupDraft({ open: false, type: "note", text: "", value: "", x: 0, y: 0 })}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={savePopup} disabled={!popupDraft.value.trim()} style={{ opacity: popupDraft.value.trim() ? 1 : 0.5 }}>Save</button>
          </div>
        </div>
      )}

      {!isFocused && (
        <div className="chunk-blur" onClick={onResume}>
          <div>
            <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: "50%", background: "var(--primary-container)", display: "grid", placeItems: "center", color: "white" }}>
              <RI name="eye" size={20} />
            </div>
            <h3 style={{ fontSize: 22, marginBottom: 8 }}>Welcome back — stay focused</h3>
            <p className="muted" style={{ maxWidth: 380, margin: "0 auto 18px" }}>This is a single-session reading. Your tab switches are tracked and shared with the instructor. Click below to resume where you left off.</p>
            <button className="btn btn-primary" onClick={onResume}>Resume reading</button>
          </div>
        </div>
      )}
    </article>
  );
}

window.ABS_READER = { ReaderView };
