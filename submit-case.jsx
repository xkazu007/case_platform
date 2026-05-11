// Submit New Case — multi-step form for authors / editors
const { Icon: SI, TagInput } = window.ABS_UI;
const { CASE_TYPES_LIST, PROGRAM_LEVELS, AFRICAN_COUNTRIES, KEYWORD_SUGGESTIONS } = window.ABS_DATA;

const STEPS = [
  { id: "meta", label: "Case Metadata" },
  { id: "abstract", label: "Abstract & Setting" },
  { id: "files", label: "Files & Materials" },
  { id: "pedagogy", label: "Teaching Plan" },
  { id: "review", label: "Review & Submit" },
];

const DISCIPLINE_OPTS = ["Strategy","Finance","Marketing","Entrepreneurship","Operations Management","General Management","International Business","HR Management","Information Technology","Accounting","Economics","Business Ethics","Negotiation","Organizational Behavior","Sales","Service Management","Social Enterprise"];
const INDUSTRY_OPTS = ["Agriculture & Food","Energy & Transition","Financial Services","Goods & Consumer Services","Healthcare","Industrial","IT & Telecom","Mining & Natural Resources","Public Administration & Nonprofits"];

// Item 6: full case type descriptions for form dropdown
const CASE_TYPE_LABELS = {
  "Field Case": "Field Case — primary research (interviews, observations)",
  "Library Case": "Library Case — secondary sources only",
  "Fictitious Case": "Fictitious Case",
  "Compact · 1–5p": "Compact Case — 1 to 5 pages",
  "Compact · 6–10p": "Compact Case — 6 to 10 pages",
  "Compact · 10+p": "Compact Case — 10+ pages",
  "Video Case": "Video Case",
};

function SubmitCaseView({ onCancel, onSubmit }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    country: "",
    // Item 4: African countries multi-select
    countries: [],
    discipline: "",
    industry: "",
    // Item 6: updated case types
    type: "Field Case",
    // Item 5: program level replaces difficulty
    programLevel: "Post-experience Masters",
    language: "English",
    year: 2026,
    abstract: "",
    setting: "",
    // Item 7: keywords as array
    keywords: [],
    files: [
      { id: "f1", name: "OCP-FieldCase-v3.pdf", size: "1.4 MB", kind: "case", uploaded: true },
    ],
    teachingNote: false,
    video: false,
    excel: false,
    learningObjectives: ["", "", ""],
    discussionQuestions: ["", ""],
    sessionMinutes: 90,
    // Item 3: authors as array
    authors: [],
    consent: false,
    rights: false,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updateAt = (k, idx, v) => setForm((f) => ({ ...f, [k]: f[k].map((x, i) => i === idx ? v : x) }));
  const addItem = (k) => setForm((f) => ({ ...f, [k]: [...f[k], ""] }));
  const removeItem = (k, idx) => setForm((f) => ({ ...f, [k]: f[k].filter((_, i) => i !== idx) }));

  const stepValid = (i) => {
    if (i === 0) return form.title.trim().length > 4 && form.company.trim() && form.discipline && form.industry;
    if (i === 1) return form.abstract.trim().length > 60;
    if (i === 2) return form.files.some((f) => f.kind === "case");
    if (i === 3) return form.learningObjectives.filter((o) => o.trim()).length >= 2;
    if (i === 4) return form.consent && form.rights;
    return true;
  };
  const allValid = STEPS.every((_, i) => stepValid(i));

  const next = () => stepValid(step) && setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    if (!allValid) return;
    setSubmitted(true);
    onSubmit?.();
  };

  if (submitted) return <Submitted form={form} onDone={onCancel} />;

  return (
    <div style={{ padding: "0 0 80px", minHeight: "100%" }}>
      <div className="hero-band" style={{ padding: "32px 48px 28px" }}>
        <button className="btn-link" onClick={onCancel} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
          <SI name="arrL" size={13} /> Back to dashboard
        </button>
        <div className="label-caps">Submit New Case</div>
        <h1 style={{ margin: "10px 0 4px" }}>Add a Case to the Catalog</h1>
        <p className="muted" style={{ maxWidth: 580 }}>The editorial board reviews submissions in two passes: a structural review within five business days, and a peer-review pass within three weeks.</p>
      </div>

      {/* Stepper */}
      <div style={{ padding: "24px 48px 0", borderBottom: "1px solid var(--outline-variant)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 980 }}>
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isDone = i < step && stepValid(i);
            return (
              <React.Fragment key={s.id}>
                <button onClick={() => setStep(i)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "transparent", border: 0, cursor: "pointer", padding: "12px 0",
                  color: isActive ? "var(--on-surface)" : "var(--on-surface-variant)",
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: isDone ? "var(--green-ok)" : isActive ? "var(--primary-container)" : "var(--surface-container-high)",
                    color: isDone || isActive ? "white" : "var(--on-surface-variant)",
                    display: "grid", placeItems: "center",
                    fontFamily: "Epilogue", fontWeight: 700, fontSize: 12,
                    border: !isDone && !isActive ? "1.5px solid var(--outline-variant)" : "0",
                  }}>
                    {isDone ? <SI name="check" size={13} stroke={2.4} /> : <span className="tnum">{i + 1}</span>}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: isActive ? 700 : 500, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <span style={{ flex: 1, height: 1, background: "var(--outline-variant)", margin: "0 16px" }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 48, padding: "40px 48px" }}>
        <div style={{ maxWidth: 720 }}>
          {step === 0 && <StepMeta form={form} update={update} />}
          {step === 1 && <StepAbstract form={form} update={update} />}
          {step === 2 && <StepFiles form={form} update={update} />}
          {step === 3 && <StepPedagogy form={form} update={update} updateAt={updateAt} addItem={addItem} removeItem={removeItem} />}
          {step === 4 && <StepReview form={form} update={update} stepValid={stepValid} setStep={setStep} />}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--outline-variant)" }}>
            <button className="btn btn-ghost" onClick={prev} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>
              <SI name="arrL" size={13} /> Previous
            </button>
            <div style={{ fontSize: 12, color: "var(--on-surface-variant)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
              Step {step + 1} of {STEPS.length}
            </div>
            {step < STEPS.length - 1 ? (
              <button className="btn btn-primary" onClick={next} disabled={!stepValid(step)} style={{ opacity: stepValid(step) ? 1 : 0.5 }}>
                Next <SI name="arrR" size={13} />
              </button>
            ) : (
              <button className="btn btn-success" onClick={submit} disabled={!allValid} style={{ opacity: allValid ? 1 : 0.5 }}>
                <SI name="check" size={13} /> Submit for review
              </button>
            )}
          </div>
        </div>

        {/* Live preview */}
        <aside style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <div className="label-caps label-caps-muted" style={{ marginBottom: 12 }}>Live preview</div>
          <PreviewCard form={form} />
          <div style={{ marginTop: 20, padding: 16, background: "var(--surface-container)", borderRadius: "var(--r-default)", fontSize: 12, color: "var(--on-surface-variant)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--on-surface)" }}>Reviewer assignment</strong><br />
            Will route to <strong>{form.discipline || "—"}</strong> chair: based on declared discipline. Auto-assigned at submit.
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Step 1: Metadata ──────────────────────────────────────────
function StepMeta({ form, update }) {
  return (
    <div>
      <SectionHead title="Case Metadata" sub="Bibliographic details — match the catalog header." />
      <Field label="Working Title" required>
        <input className="input" placeholder="e.g. OCP Group: Phosphate, Power and the Pan-African Pivot" value={form.title} onChange={(e) => update("title", e.target.value)} />
      </Field>

      {/* Item 3: multi-author tag input */}
      <Field label="Authors" hint="Add each author as a tag — press Enter or comma to confirm.">
        <TagInput
          tags={form.authors}
          onChange={(tags) => update("authors", tags)}
          placeholder="e.g. Dr. Salma Bennani…"
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Field label="Protagonist Company" required>
          <input className="input" placeholder="e.g. OCP Group" value={form.company} onChange={(e) => update("company", e.target.value)} />
        </Field>
        <Field label="Country / Region">
          <input className="input" placeholder="e.g. Morocco" value={form.country} onChange={(e) => update("country", e.target.value)} />
        </Field>
        <Field label="Primary Discipline" required>
          <select className="select" value={form.discipline} onChange={(e) => update("discipline", e.target.value)}>
            <option value="">Select…</option>
            {DISCIPLINE_OPTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Industry Sector" required>
          <select className="select" value={form.industry} onChange={(e) => update("industry", e.target.value)}>
            <option value="">Select…</option>
            {INDUSTRY_OPTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>

        {/* Item 6: updated case types */}
        <Field label="Case Type">
          <select className="select" value={form.type} onChange={(e) => update("type", e.target.value)}>
            {CASE_TYPES_LIST.map((t) => (
              <option key={t} value={t}>{CASE_TYPE_LABELS[t] || t}</option>
            ))}
          </select>
        </Field>

        {/* Item 5: Program Level replaces Difficulty */}
        <Field label="Program Level">
          <select className="select" value={form.programLevel} onChange={(e) => update("programLevel", e.target.value)}>
            {PROGRAM_LEVELS.map(([lvl]) => <option key={lvl}>{lvl}</option>)}
          </select>
        </Field>

        <Field label="Language">
          <select className="select" value={form.language} onChange={(e) => update("language", e.target.value)}>
            <option>English</option><option>French</option><option>Bilingual</option>
          </select>
        </Field>
        <Field label="Year">
          <input className="input tnum" type="number" min="2000" max="2030" value={form.year} onChange={(e) => update("year", parseInt(e.target.value) || 2026)} />
        </Field>
      </div>

      {/* Item 4: African Country multi-select as tag input */}
      <Field label="African Countries" hint="Select the African countries where this case is set.">
        <TagInput
          tags={form.countries}
          onChange={(tags) => update("countries", tags)}
          placeholder="Type a country name…"
          suggestions={AFRICAN_COUNTRIES}
        />
      </Field>

      {/* Item 7: Keywords tag input with vocabulary suggestions */}
      <Field label="Keywords" hint="Add keywords that help faculty discover this case. Press Enter to confirm each one.">
        <TagInput
          tags={form.keywords}
          onChange={(tags) => update("keywords", tags)}
          placeholder="e.g. vertical integration, AfCFTA…"
          suggestions={KEYWORD_SUGGESTIONS}
        />
      </Field>
    </div>
  );
}

// ─── Step 2: Abstract ──────────────────────────────────────────
function StepAbstract({ form, update }) {
  return (
    <div>
      <SectionHead title="Abstract & Setting" sub="What's the strategic problem? Reviewers read the abstract first." />
      <Field label="Abstract" required hint="Two to three paragraphs. State the decision, the protagonist, the time horizon, and what's at stake.">
        <textarea className="textarea" style={{ minHeight: 200 }} placeholder="Faced with volatile fertilizer markets and growing pressure to anchor value creation on African soil…" value={form.abstract} onChange={(e) => update("abstract", e.target.value)} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--on-surface-variant)" }}>
          <span>{form.abstract.length < 60 ? <span style={{ color: "var(--primary)" }}>At least 60 characters</span> : "Looks good"}</span>
          <span className="tnum">{form.abstract.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </Field>
      <Field label="Setting / Time Period" hint="Where and when the case is set. Helps reviewers contextualize.">
        <input className="input" placeholder="Casablanca, Khouribga & Jorf Lasfar · 2022–2025" value={form.setting} onChange={(e) => update("setting", e.target.value)} />
      </Field>
    </div>
  );
}

// ─── Step 3: Files ──────────────────────────────────────────
function StepFiles({ form, update }) {
  const fakeUpload = (kind, label) => {
    const id = `f-${Date.now()}`;
    update("files", [...form.files, { id, name: `${label}.pdf`, size: "uploading…", kind, uploaded: false }]);
    setTimeout(() => {
      update("files", [...form.files, { id, name: `${label}.pdf`, size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`, kind, uploaded: true }]);
    }, 900);
  };
  const remove = (id) => update("files", form.files.filter((f) => f.id !== id));

  return (
    <div>
      <SectionHead title="Files & Materials" sub="Upload the case PDF (required) and any supporting materials." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <DropTile icon="file" label="Case PDF" sub="Required · 32 pages max" onClick={() => fakeUpload("case", "Case-draft")} />
        <DropTile icon="note" label="Teaching Note" sub="Optional · faculty-only" onClick={() => fakeUpload("tn", "Teaching-Note")} />
        <DropTile icon="grid" label="Excel Model" sub="Optional · sensitivity workbook" onClick={() => fakeUpload("xls", "Sensitivity-Model")} />
        <DropTile icon="video" label="Video Briefing" sub="Optional · ≤ 12 min" onClick={() => fakeUpload("video", "Protagonist-Interview")} />
      </div>
      <div className="label-caps label-caps-muted" style={{ marginBottom: 10 }}>Uploaded ({form.files.length})</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {form.files.map((f) => (
          <div key={f.id} className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--surface-container)", display: "grid", placeItems: "center", color: "var(--on-surface-variant)" }}>
              <SI name={f.kind === "video" ? "video" : f.kind === "tn" ? "note" : f.kind === "xls" ? "grid" : "file"} size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{f.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--on-surface-variant)" }}>{f.size}</div>
            </div>
            <span className={`chip ${f.uploaded ? "chip-status-published" : "chip-status-review"}`} style={{ fontSize: 9.5 }}>
              {f.uploaded ? "Uploaded" : "Uploading"}
            </span>
            <button onClick={() => remove(f.id)} style={{ background: "transparent", border: 0, padding: 4, cursor: "pointer", color: "var(--on-surface-variant)" }}>
              <SI name="x" size={14} />
            </button>
          </div>
        ))}
        {form.files.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", border: "1px dashed var(--outline-variant)", borderRadius: 8, color: "var(--on-surface-variant)", fontSize: 13 }}>
            No files uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}

function DropTile({ icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "20px 18px", border: "1.5px dashed var(--outline-variant)", borderRadius: "var(--r-md)",
      background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", transition: "var(--t)",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary-container)"; e.currentTarget.style.background = "rgba(208,68,37,0.03)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--outline-variant)"; e.currentTarget.style.background = "white"; }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-container)", display: "grid", placeItems: "center", color: "var(--on-surface-variant)" }}>
        <SI name={icon} size={16} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: "var(--on-surface-variant)" }}>{sub}</div>
      </div>
      <div style={{ marginLeft: "auto", color: "var(--on-surface-variant)" }}><SI name="plus" size={14} /></div>
    </button>
  );
}

// ─── Step 4: Pedagogy ──────────────────────────────────────────
function StepPedagogy({ form, update, updateAt, addItem, removeItem }) {
  return (
    <div>
      <SectionHead title="Teaching Plan" sub="The core of the teaching note — what students should walk away with." />
      <div style={{ marginBottom: 28 }}>
        <label className="label">Learning Objectives <span style={{ color: "var(--primary-container)" }}>*</span></label>
        <div style={{ fontSize: 12, color: "var(--on-surface-variant)", marginBottom: 10 }}>Add at least two. Start with verbs: "Evaluate…", "Apply…", "Diagnose…"</div>
        {form.learningObjectives.map((lo, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--surface-container)", color: "var(--on-surface-variant)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, marginTop: 10, flexShrink: 0 }}>{i + 1}</span>
            <input className="input" value={lo} placeholder={i === 0 ? "Evaluate vertical integration decisions in commodity industries…" : "Add another objective"} onChange={(e) => updateAt("learningObjectives", i, e.target.value)} />
            {form.learningObjectives.length > 1 && (
              <button onClick={() => removeItem("learningObjectives", i)} style={{ background: "transparent", border: 0, padding: 8, cursor: "pointer", color: "var(--on-surface-variant)" }}>
                <SI name="x" size={14} />
              </button>
            )}
          </div>
        ))}
        <button className="btn-link" onClick={() => addItem("learningObjectives")} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <SI name="plus" size={12} /> Add objective
        </button>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label className="label">Discussion Questions</label>
        {form.discussionQuestions.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ marginTop: 10, color: "var(--on-surface-variant)", fontSize: 14, fontWeight: 600 }}>Q{i + 1}.</span>
            <input className="input" value={q} placeholder="Open-ended question for plenary discussion…" onChange={(e) => updateAt("discussionQuestions", i, e.target.value)} />
            {form.discussionQuestions.length > 1 && (
              <button onClick={() => removeItem("discussionQuestions", i)} style={{ background: "transparent", border: 0, padding: 8, cursor: "pointer", color: "var(--on-surface-variant)" }}>
                <SI name="x" size={14} />
              </button>
            )}
          </div>
        ))}
        <button className="btn-link" onClick={() => addItem("discussionQuestions")} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <SI name="plus" size={12} /> Add question
        </button>
      </div>

      <Field label="Suggested Session Length">
        <div style={{ display: "flex", gap: 8 }}>
          {[60, 75, 90, 120].map((m) => (
            <button key={m} onClick={() => update("sessionMinutes", m)} style={{
              padding: "10px 18px",
              border: `1.5px solid ${form.sessionMinutes === m ? "var(--primary-container)" : "var(--outline-variant)"}`,
              background: form.sessionMinutes === m ? "rgba(208,68,37,0.04)" : "white",
              borderRadius: 8, cursor: "pointer", fontFamily: "Manrope",
              fontWeight: form.sessionMinutes === m ? 700 : 500, fontSize: 13,
            }} className="tnum">{m} min</button>
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─── Step 5: Review ──────────────────────────────────────────
function StepReview({ form, update, stepValid, setStep }) {
  const summary = [
    { step: 0, label: "Metadata", entries: [
      ["Title", form.title || "—"],
      ["Company / Country", `${form.company || "—"} · ${form.country || "—"}`],
      ["Authors", form.authors.length > 0 ? form.authors.join(", ") : "—"],
      ["Discipline", form.discipline || "—"],
      ["Industry", form.industry || "—"],
      ["Type / Level", `${form.type} · ${form.programLevel}`],
      ["Language", form.language],
      ["African countries", form.countries.length > 0 ? form.countries.join(", ") : "—"],
      ["Keywords", form.keywords.length > 0 ? form.keywords.join(", ") : "—"],
    ]},
    { step: 1, label: "Abstract", entries: [
      ["Abstract", `${form.abstract.split(/\s+/).filter(Boolean).length} words`],
      ["Setting", form.setting || "—"],
    ]},
    { step: 2, label: "Materials", entries: [
      ["Files attached", `${form.files.length} file${form.files.length === 1 ? "" : "s"}`],
      ["Includes Teaching Note", form.files.some((f) => f.kind === "tn") ? "Yes" : "No"],
      ["Includes Video", form.files.some((f) => f.kind === "video") ? "Yes" : "No"],
    ]},
    { step: 3, label: "Pedagogy", entries: [
      ["Learning objectives", `${form.learningObjectives.filter((o) => o.trim()).length} declared`],
      ["Discussion questions", `${form.discussionQuestions.filter((q) => q.trim()).length} declared`],
      ["Session length", `${form.sessionMinutes} min`],
    ]},
  ];

  return (
    <div>
      <SectionHead title="Review & Submit" sub="Last look before this enters the editorial queue." />
      {summary.map((s) => (
        <div key={s.step} className="card" style={{ padding: "16px 20px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: stepValid(s.step) ? "var(--green-ok)" : "var(--primary-container)", color: "white", display: "grid", placeItems: "center" }}>
                <SI name={stepValid(s.step) ? "check" : "warn"} size={11} stroke={2.4} />
              </span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</span>
            </div>
            <button className="btn-link" onClick={() => setStep(s.step)} style={{ fontSize: 11.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>Edit</button>
          </div>
          <table style={{ width: "100%", fontSize: 13 }}>
            <tbody>
              {s.entries.map(([k, v], i) => (
                <tr key={i}>
                  <td style={{ padding: "4px 0", color: "var(--on-surface-variant)", width: 200 }}>{k}</td>
                  <td style={{ padding: "4px 0", fontWeight: 500 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="card" style={{ padding: 20, marginTop: 20, background: "var(--surface-container)" }}>
        <label className="checkbox" style={{ marginBottom: 8 }}>
          <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} />
          <span className="box"></span>
          <span>All protagonists and quoted parties have given informed consent for case publication.</span>
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={form.rights} onChange={(e) => update("rights", e.target.checked)} />
          <span className="box"></span>
          <span>I confirm I hold the rights to all attached materials and grant ABS license to use in teaching.</span>
        </label>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────
function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 26, margin: 0 }}>{title}</h2>
      {sub && <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>{sub}</p>}
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label className="label">{label} {required && <span style={{ color: "var(--primary-container)" }}>*</span>}</label>
      {children}
      {hint && <div style={{ fontSize: 12, color: "var(--on-surface-variant)", marginTop: 6, lineHeight: 1.5 }}>{hint}</div>}
    </div>
  );
}

function PreviewCard({ form }) {
  const authorLine = form.authors.length > 0 ? form.authors.join(", ") : "—";
  return (
    <article className="card-shadow" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {form.discipline && <span className="chip chip-discipline">{form.discipline}</span>}
        {form.type && <span className="chip chip-content">{form.type}</span>}
      </div>
      <h3 style={{ margin: 0, fontSize: 17, lineHeight: 1.3, color: form.title ? "var(--on-surface)" : "var(--on-surface-variant)", fontStyle: form.title ? "normal" : "italic" }}>
        {form.title || "Working title appears here…"}
      </h3>
      {form.company && (
        <div style={{ fontSize: 12.5, color: "var(--on-surface-variant)" }}>
          <strong style={{ color: "var(--on-surface)", fontWeight: 600 }}>{form.company}</strong>
          {form.country && <> · {form.country}</>}
        </div>
      )}
      <p style={{ fontSize: 12.5, color: "var(--on-surface-variant)", lineHeight: 1.55, margin: 0, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 60 }}>
        {form.abstract || "Abstract preview will appear once you write at least one paragraph."}
      </p>
      {/* Item 7: keywords preview */}
      {form.keywords.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {form.keywords.slice(0, 4).map(k => (
            <span key={k} style={{ fontSize: 10, padding: "1px 6px", background: "var(--surface-container)", borderRadius: "var(--r-full)", color: "var(--on-surface-variant)", fontWeight: 500 }}>{k}</span>
          ))}
        </div>
      )}
      <div style={{ paddingTop: 10, borderTop: "1px solid var(--outline-variant)", fontSize: 11, color: "var(--on-surface-variant)", display: "flex", justifyContent: "space-between" }}>
        {/* Item 3: show authors, Item 5: show program level */}
        <span>{form.programLevel} · {form.language}</span>
        <span className="tnum">{form.year}</span>
      </div>
    </article>
  );
}

function Submitted({ form, onDone }) {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <div className="check-circle"></div>
      <div className="label-caps">Submitted · Reference #2026-CASE-{Math.floor(Math.random() * 900 + 100)}</div>
      <h1 style={{ margin: "12px 0 14px" }}>Case sent for review.</h1>
      <p className="muted" style={{ fontSize: 16, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
        The <strong style={{ color: "var(--on-surface)" }}>{form.discipline}</strong> chair has been notified. You'll get a structural review within five business days.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn btn-ghost" onClick={onDone}>Back to dashboard</button>
        <button className="btn btn-primary" onClick={onDone}>View pipeline</button>
      </div>
    </div>
  );
}

window.ABS_SUBMIT = { SubmitCaseView };
