// Case Reader — Student View
const { Icon: RI } = window.ABS_UI;
const { READER_SECTIONS, READER_BODY } = window.ABS_DATA;

function ReaderView({ onExit }) {
  const [sections, setSections] = useState(READER_SECTIONS);
  const currentIdx = sections.findIndex((s) => s.status === "current");
  const currentSection = sections[currentIdx];
  const completedCount = sections.filter((s) => s.status === "done").length;
  const progressPct = Math.round(completedCount / sections.length * 100);

  const [readMs, setReadMs] = useState(4 * 60_000 + 32_000);
  const [tabSwitches, setTabSwitches] = useState(1);
  const [isFocused, setIsFocused] = useState(true);

  // Annotations lifted to parent so the sidebar list can display them
  const [annotations, setAnnotations] = useState([
    { id: "a1", kind: "highlight", text: "the yield gap, as agronomists in the room described it", note: "" },
    { id: "a2", kind: "comment", text: "vertical integration into downstream agri-services", note: "Compare to Aramco vertical move 2018" },
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

      <div style={{ display: "grid", gridTemplateColumns: "288px minmax(0,1fr)", height: "100%", overflow: "hidden" }}>
        <aside style={{ borderRight: "1px solid var(--outline-variant)", background: "white", padding: "24px 0", overflowY: "auto" }}>
          <div style={{ padding: "0 24px" }}>
            <div className="label-caps">Table of Contents</div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--on-surface-variant)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
              <span>Progress</span>
              <span className="tnum">{progressPct}%</span>
            </div>
            <div className="progress-rail"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
          </div>

          <div style={{ marginTop: 24 }}>
            {sections.map((s, i) => <TocItem key={s.id} idx={i + 1} section={s} />)}
          </div>

          <NotesPanel
            annotations={annotations}
            onUpdate={updateAnnotation}
            onRemove={removeAnnotation}
            onAddFreeform={(note) => addAnnotation({ id: `n-${Date.now()}`, kind: "note", text: "", note })}
          />
        </aside>

        <main className="scroll-y" style={{ padding: "40px 64px 80px", position: "relative" }}>
          <ReaderHeader />
          <ChunkCard
            section={currentSection}
            isFocused={isFocused}
            onResume={() => setIsFocused(true)}
            onAddAnnotation={addAnnotation}
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
      </div>
    </div>
  );
}

function NotesPanel({ annotations, onUpdate, onRemove, onAddFreeform }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [newNote, setNewNote] = useState("");

  const startEdit = (a) => {
    setEditingId(a.id);
    setDraft(a.note || "");
  };
  const saveEdit = (id) => {
    onUpdate(id, { note: draft });
    setEditingId(null);
    setDraft("");
  };

  const submitFreeform = () => {
    const t = newNote.trim();
    if (!t) return;
    onAddFreeform(t);
    setNewNote("");
    setComposing(false);
  };

  const swatch = (kind) => kind === "highlight" ? "var(--yellow-chip)" : kind === "underline" ? "var(--primary-container)" : kind === "comment" ? "var(--secondary-container)" : "var(--outline)";

  return (
    <div style={{ padding: "20px 24px 24px", marginTop: 24, borderTop: "1px solid var(--outline-variant)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div className="label-caps label-caps-muted">Notes & highlights</div>
        <button onClick={() => setComposing((c) => !c)} title="Add note" style={{
          width: 22, height: 22, border: "1px solid var(--outline-variant)", background: composing ? "var(--primary-container)" : "white",
          color: composing ? "white" : "var(--on-surface-variant)", borderRadius: 4, cursor: "pointer", display: "grid", placeItems: "center"
        }}>
          <RI name={composing ? "x" : "plus"} size={12} stroke={2} />
        </button>
      </div>

      {composing && (
        <div style={{ marginBottom: 12, padding: 10, background: "var(--surface-container)", borderRadius: 6, border: "1px solid var(--outline-variant)" }}>
          <textarea
            autoFocus
            className="textarea"
            placeholder="Jot a thought, a question, a connection…"
            style={{ minHeight: 64, fontSize: 12.5, padding: "8px 10px", lineHeight: 1.5 }}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setComposing(false); setNewNote(""); }}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={submitFreeform} disabled={!newNote.trim()} style={{ opacity: newNote.trim() ? 1 : 0.5 }}>Save</button>
          </div>
        </div>
      )}

      {annotations.length === 0 && !composing && (
        <div style={{ fontSize: 12, color: "var(--on-surface-variant)", lineHeight: 1.5, padding: "10px 0" }}>
          Select text in the case to highlight or comment. Click <strong>+</strong> for a free-form note.
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {annotations.map((a) => {
          const isEditing = editingId === a.id;
          return (
            <li key={a.id} style={{
              padding: "8px 10px",
              background: a.kind === "highlight" ? "#FFF6CC" : "var(--surface-container)",
              borderRadius: 4,
              borderLeft: `2px solid ${swatch(a.kind)}`,
              fontSize: 12.5,
              color: "var(--on-surface)",
              position: "relative",
              cursor: "default",
            }}
              onMouseEnter={(e) => e.currentTarget.querySelector(".note-actions").style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.querySelector(".note-actions").style.opacity = 0}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: a.text || a.note ? 4 : 0, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "var(--on-surface-variant)" }}>
                <RI name={a.kind === "highlight" ? "highlight" : a.kind === "underline" ? "underline" : a.kind === "comment" ? "msg" : "note"} size={10} />
                <span>{a.kind}</span>
                <span className="note-actions" style={{ marginLeft: "auto", display: "flex", gap: 4, opacity: 0, transition: "opacity 120ms" }}>
                  {!isEditing && <button onClick={() => startEdit(a)} style={iconBtn}><RI name="edit" size={10} /></button>}
                  <button onClick={() => onRemove(a.id)} style={iconBtn}><RI name="x" size={10} /></button>
                </span>
              </div>

              {a.text && (
                <div style={{ fontStyle: "italic", color: "var(--on-surface-variant)", marginBottom: a.note || isEditing ? 6 : 0, lineHeight: 1.5 }}>
                  "{a.text.length > 80 ? a.text.slice(0, 80) + "…" : a.text}"
                </div>
              )}

              {isEditing ? (
                <div>
                  <textarea
                    autoFocus
                    className="textarea"
                    style={{ minHeight: 56, fontSize: 12.5, padding: "6px 8px", lineHeight: 1.5 }}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Add your note…"
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 6, justifyContent: "flex-end" }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(a.id)}>Save</button>
                  </div>
                </div>
              ) : a.note ? (
                <div onClick={() => startEdit(a)} style={{ color: "var(--on-surface)", lineHeight: 1.5, cursor: "text" }}>{a.note}</div>
              ) : (
                <button onClick={() => startEdit(a)} style={{ background: "transparent", border: 0, padding: 0, color: "var(--primary)", fontSize: 11.5, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <RI name="plus" size={10} /> Add note
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const iconBtn = {
  background: "transparent",
  border: 0,
  padding: 2,
  cursor: "pointer",
  color: "var(--on-surface-variant)",
  display: "grid",
  placeItems: "center",
  borderRadius: 3,
};

function TocItem({ idx, section }) {
  const isCurrent = section.status === "current";
  const isDone = section.status === "done";
  const isLocked = section.status === "locked";
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "14px 24px",
      borderLeft: isCurrent ? "3px solid var(--primary-container)" : "3px solid transparent",
      background: isCurrent ? "var(--surface-container)" : "transparent",
      cursor: isLocked ? "default" : "pointer",
      opacity: isLocked ? 0.5 : 1,
      transition: "var(--t)"
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        flexShrink: 0,
        display: "grid", placeItems: "center",
        background: isDone ? "var(--green-ok)" : isCurrent ? "var(--primary-container)" : "transparent",
        border: isDone || isCurrent ? "0" : "1.5px solid var(--outline-variant)",
        color: isDone || isCurrent ? "white" : "var(--on-surface-variant)",
        fontSize: 11, fontWeight: 700,
        marginTop: 1
      }}>
        {isDone ? <RI name="check" size={12} stroke={2.4} /> : isLocked ? <RI name="lock" size={11} stroke={1.6} /> : <span className="tnum">{idx}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: isCurrent ? "var(--primary-container)" : "var(--on-surface-variant)", marginBottom: 2 }}>
          {section.label}
        </div>
        <div style={{ fontSize: 13, fontWeight: isCurrent ? 600 : 500, color: "var(--on-surface)", lineHeight: 1.35 }}>
          {section.title}
        </div>
      </div>
    </div>
  );
}

function ReaderHeader() {
  return (
    <div className="card" style={{ padding: 36, marginBottom: 36, maxWidth: 780 }}>
      <div className="label-caps">{READER_BODY.eyebrow}</div>
      <h1 className="display" style={{ fontSize: 40, marginTop: 14, lineHeight: 1.1, maxWidth: 680 }}>{READER_BODY.title}</h1>
      <div style={{ marginTop: 14, fontSize: 13, color: "var(--on-surface-variant)" }}>{READER_BODY.byline}</div>
      <hr className="divider" style={{ margin: "24px 0 0" }} />
    </div>
  );
}

function ChunkCard({ section, isFocused, onResume, onAddAnnotation }) {
  const bodyRef = useRef(null);
  const [bubble, setBubble] = useState(null);
  const [commentDraft, setCommentDraft] = useState({ open: false, text: "", value: "", x: 0, y: 0 });

  const onMouseUp = () => {
    if (commentDraft.open) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { setBubble(null); return; }
    const range = sel.getRangeAt(0);
    if (!bodyRef.current?.contains(range.commonAncestorContainer)) { setBubble(null); return; }
    const rect = range.getBoundingClientRect();
    const parentRect = bodyRef.current.getBoundingClientRect();
    setBubble({
      x: rect.left + rect.width / 2 - parentRect.left,
      y: rect.top - parentRect.top,
      range,
      text: sel.toString(),
    });
  };

  const applyAnnotation = (kind) => {
    if (!bubble?.range) return;
    const range = bubble.range;
    const text = bubble.text;
    if (kind === "comment") {
      setCommentDraft({ open: true, text, value: "", x: bubble.x, y: bubble.y });
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
    onAddAnnotation({ id: `a-${Date.now()}`, kind, text, note: "" });
    setBubble(null);
  };

  const saveComment = () => {
    onAddAnnotation({ id: `a-${Date.now()}`, kind: "comment", text: commentDraft.text, note: commentDraft.value });
    setCommentDraft({ open: false, text: "", value: "", x: 0, y: 0 });
  };

  return (
    <article className="card" style={{ padding: 36, maxWidth: 780, position: "relative" }} onMouseUp={onMouseUp}>
      <div className="label-caps">{section.label}</div>
      <h2 style={{ margin: "14px 0 24px", fontSize: 32, lineHeight: 1.15 }}>{section.title}</h2>

      <div ref={bodyRef} style={{ fontSize: 17, lineHeight: 1.8, color: "var(--on-surface)" }}>
        {READER_BODY.current.paragraphs.map((p, i) =>
          <p key={i} style={{ marginBottom: 20 }}>{p}</p>
        )}

        <blockquote className="accent-bar" style={{ margin: "32px 0", fontFamily: "Epilogue", fontWeight: 400, fontSize: 22, lineHeight: 1.4, color: "var(--on-surface)" }}>
          "At what level of return on invested capital does a sovereign mission stop looking like a strategy and start looking like a subsidy?"
          <div style={{ fontFamily: "Manrope", fontWeight: 600, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginTop: 12 }}>— CFO, Executive Committee Meeting</div>
        </blockquote>

        <p>The committee adjourned without a decision. Three weeks later, the chairman convened a smaller working group of six — three internal, three external — to reframe the question. The reframing was deliberate, and worth examining: rather than asking whether to commit, the working group was asked to specify what would have to be true, in 2030, for the commitment to be judged successful.</p>
      </div>

      {bubble &&
        <div className="annot-bubble" style={{ left: bubble.x, top: bubble.y }} onMouseDown={(e) => e.preventDefault()}>
          <button onClick={() => applyAnnotation("highlight")}><span className="swatch" style={{ background: "var(--yellow-chip)" }} />Highlight</button>
          <button onClick={() => applyAnnotation("underline")}><span className="swatch" style={{ background: "var(--primary-container)" }} />Underline</button>
          <button onClick={() => applyAnnotation("comment")}><RI name="msg" size={12} />Comment</button>
        </div>
      }

      {commentDraft.open && (
        <div style={{
          position: "absolute",
          left: commentDraft.x, top: commentDraft.y,
          transform: "translate(-50%, -100%)",
          marginTop: -10,
          background: "white",
          border: "1px solid var(--outline-variant)",
          boxShadow: "var(--shadow-3)",
          borderRadius: "var(--r-md)",
          padding: 14,
          width: 320,
          zIndex: 60,
        }} onMouseDown={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "var(--on-surface-variant)", marginBottom: 6 }}>Comment on selection</div>
          <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--on-surface-variant)", marginBottom: 8, lineHeight: 1.5, padding: "6px 8px", background: "var(--surface-container)", borderRadius: 4, borderLeft: "2px solid var(--secondary-container)" }}>
            "{commentDraft.text.length > 100 ? commentDraft.text.slice(0, 100) + "…" : commentDraft.text}"
          </div>
          <textarea
            autoFocus
            className="textarea"
            placeholder="What's worth noting here?"
            style={{ minHeight: 70, fontSize: 13, padding: "8px 10px" }}
            value={commentDraft.value}
            onChange={(e) => setCommentDraft((c) => ({ ...c, value: e.target.value }))}
          />
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setCommentDraft({ open: false, text: "", value: "", x: 0, y: 0 })}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={saveComment} disabled={!commentDraft.value.trim()} style={{ opacity: commentDraft.value.trim() ? 1 : 0.5 }}>Save note</button>
          </div>
        </div>
      )}

      {!isFocused &&
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
      }
    </article>
  );
}

window.ABS_READER = { ReaderView };
