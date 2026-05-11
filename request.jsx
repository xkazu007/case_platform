// Request Form — Professor view
const { Icon: RFI } = window.ABS_UI;
const { PROGRAMS } = window.ABS_DATA;

function RequestView({ c, onSubmit, onCancel }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    moduleName: "",
    // Item 1: start/end dates replace semester
    startDate: "",
    endDate: "",
    program: PROGRAMS[1] || "EMBA",
    students: 42,
    context: "",
    discussionLeader: "Dr. Salma Bennani (lead author available)",
    accessWindow: "2-week",
    materials: { caseFile: true, teachingNote: false, video: true },
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.moduleName.trim().length > 2 && form.context.trim().length > 20 && form.startDate && form.endDate;

  const submit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
    onSubmit?.();
  };

  if (submitted) return <SubmittedScreen c={c} form={form} onDone={onCancel}/>;

  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"40px 24px 80px"}}>
      <div style={{marginBottom:24}}>
        <button className="btn-link" onClick={onCancel} style={{display:"inline-flex",alignItems:"center",gap:6}}>
          <RFI name="arrL" size={13}/> Cancel and return
        </button>
      </div>

      <div className="label-caps">Module Request</div>
      <h1 style={{margin:"10px 0 4px"}}>Request Case for Module</h1>
      <p className="muted" style={{maxWidth:560}}>Editorial review takes one to two business days. You'll receive a unique link to share with enrolled students; access is scoped to your module's start and end dates.</p>

      {c && (
        <div style={{marginTop:32,padding:"20px 24px",background:"white",border:"1px solid var(--outline-variant)",borderRadius:"var(--r-md)",borderLeft:"2px solid var(--primary-container)",display:"flex",gap:20,alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div className="label-caps" style={{fontSize:10}}>Selected Case</div>
            <h3 style={{margin:"8px 0 6px",fontSize:18,lineHeight:1.3}}>{c.title}</h3>
            <div style={{fontSize:13,color:"var(--on-surface-variant)"}}>
              <strong style={{color:"var(--on-surface)",fontWeight:600}}>{c.company}</strong> · {c.country} · <span className="tnum">{c.year}</span>
            </div>
            <div style={{display:"flex",gap:6,marginTop:10}}>
              <span className="chip chip-discipline">{c.discipline}</span>
              <span className="chip chip-content">{c.type}</span>
            </div>
          </div>
          <button className="btn-link" onClick={onCancel} style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:700}}>Change</button>
        </div>
      )}

      <form onSubmit={submit} style={{marginTop:40,display:"flex",flexDirection:"column",gap:36}}>
        <Section title="Module Details">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <Field label="Module Name" required>
              <input className="input" placeholder="e.g. Strategy in Emerging Markets" value={form.moduleName} onChange={e=>update("moduleName", e.target.value)}/>
            </Field>
            {/* Item 2: dynamic programs list from data */}
            <Field label="Program">
              <select className="select" value={form.program} onChange={e=>update("program", e.target.value)}>
                {PROGRAMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            {/* Item 1: Start Date + End Date replace Semester dropdown */}
            <Field label="Start Date" required>
              <input className="input" type="date" value={form.startDate} onChange={e=>update("startDate", e.target.value)}/>
            </Field>
            <Field label="End Date" required>
              <input className="input" type="date" value={form.endDate} onChange={e=>update("endDate", e.target.value)}
                min={form.startDate}
              />
            </Field>
            <Field label="Estimated Student Count">
              <input className="input tnum" type="number" min="1" max="500" value={form.students} onChange={e=>update("students", parseInt(e.target.value) || 0)}/>
            </Field>
          </div>
        </Section>

        <Section title="Teaching Context">
          <Field label="How do you plan to use this case?" required hint="Describe the pedagogical role: cold open, build-up, capstone, comparison with another case, etc.">
            <textarea
              className="textarea"
              placeholder="The case will anchor a 90-minute session in week 4, paired with the M-KOPA case as a contrast on capital intensity and continental scale-up dynamics. Students will be asked to prepare a one-page memo recommending an option to the OCP board…"
              value={form.context}
              onChange={e=>update("context", e.target.value)}
            />
            <div style={{fontSize:11,color:"var(--on-surface-variant)",marginTop:6,letterSpacing:"0.04em"}} className="tnum">
              {form.context.length} chars · 100 minimum recommended
            </div>
          </Field>
          <Field label="Co-instructor or Discussion Leader">
            <input className="input" value={form.discussionLeader} onChange={e=>update("discussionLeader", e.target.value)}/>
          </Field>
        </Section>

        <Section title="Access Window">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[
              { id:"1-week", label:"1 week", sub:"Compressed reading" },
              { id:"2-week", label:"2 weeks", sub:"Standard window" },
              { id:"semester", label:"Full term", sub:"Multi-touch use" },
            ].map(opt => (
              <label key={opt.id} style={{
                padding:"16px 18px",border:`1.5px solid ${form.accessWindow===opt.id?"var(--primary-container)":"var(--outline-variant)"}`,
                borderRadius:"var(--r-md)",cursor:"pointer",
                background: form.accessWindow===opt.id ? "rgba(208,68,37,0.04)" : "white",
                transition:"var(--t)",display:"flex",flexDirection:"column",gap:4,
              }}>
                <input type="radio" name="window" checked={form.accessWindow===opt.id} onChange={()=>update("accessWindow", opt.id)} style={{display:"none"}}/>
                <span style={{fontWeight:700,fontSize:14}}>{opt.label}</span>
                <span style={{fontSize:12,color:"var(--on-surface-variant)"}}>{opt.sub}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Materials to include in student access">
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <ToggleRow label="Case PDF" sub="32 pages · all exhibits" checked={form.materials.caseFile} onChange={v=>update("materials",{...form.materials,caseFile:v})}/>
            <ToggleRow label="Teaching Note" sub="Faculty only — not shared with students" checked={form.materials.teachingNote} onChange={v=>update("materials",{...form.materials,teachingNote:v})} disabled/>
            <ToggleRow label="Video Briefing" sub="11-minute interview with case protagonists" checked={form.materials.video} onChange={v=>update("materials",{...form.materials,video:v})}/>
          </div>
        </Section>

        <div style={{padding:"20px 24px",background:"var(--surface-container)",borderRadius:"var(--r-md)",fontSize:13,color:"var(--on-surface-variant)",lineHeight:1.6,display:"flex",gap:14,alignItems:"flex-start"}}>
          <div style={{color:"var(--primary-container)",marginTop:1}}><RFI name="warn" size={16}/></div>
          <div>
            <strong style={{color:"var(--on-surface)"}}>Editorial review notice.</strong> By submitting, you confirm the case will be used in the program described above, students will not redistribute materials, and any classroom recordings will exclude case verbatim text per the ABS faculty handbook §4.2.
          </div>
        </div>

        <div style={{display:"flex",gap:12,justifyContent:"flex-end",alignItems:"center",borderTop:"1px solid var(--outline-variant)",paddingTop:24}}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Save as draft</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid} style={{opacity: isValid ? 1 : 0.5, cursor: isValid ? "pointer" : "not-allowed"}}>
            Submit for review <RFI name="arrR" size={13}/>
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <div className="label-caps">{title}</div>
        <div style={{flex:1,height:1,background:"var(--outline-variant)"}}/>
      </div>
      {children}
    </section>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div style={{marginBottom:18}}>
      <label className="label">{label} {required && <span style={{color:"var(--primary-container)"}}>*</span>}</label>
      {children}
      {hint && <div style={{fontSize:12,color:"var(--on-surface-variant)",marginTop:6,lineHeight:1.5}}>{hint}</div>}
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange, disabled }) {
  return (
    <label style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",border:"1px solid var(--outline-variant)",borderRadius:"var(--r-default)",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.6:1,background:"white"}}>
      <span className="switch">
        <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} disabled={disabled}/>
        <span className="slider"></span>
      </span>
      <div style={{flex:1}}>
        <div style={{fontWeight:600,fontSize:13.5}}>{label}</div>
        <div style={{fontSize:12,color:"var(--on-surface-variant)"}}>{sub}</div>
      </div>
      {disabled && <RFI name="lock" size={13}/>}
    </label>
  );
}

function SubmittedScreen({ c, form, onDone }) {
  // Item 1: display start/end dates instead of semester
  const dateRange = form.startDate && form.endDate
    ? `${form.startDate} → ${form.endDate}`
    : "—";

  return (
    <div style={{maxWidth:600,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
      <div className="check-circle"></div>
      <div className="label-caps">Submitted · Reference #2026-0847</div>
      <h1 style={{margin:"12px 0 14px"}}>Request received.</h1>
      <p className="muted" style={{fontSize:16,maxWidth:480,margin:"0 auto 32px",lineHeight:1.6}}>
        The editorial board has been notified. You'll receive a confirmation email at <strong style={{color:"var(--on-surface)"}}>your.email@um6p.ma</strong> within two business days, with a shareable student access link valid for the dates requested.
      </p>

      <div className="card" style={{padding:24,textAlign:"left",marginBottom:32}}>
        <div className="label-caps label-caps-muted">Your Request</div>
        <table style={{width:"100%",marginTop:14,fontSize:13}}>
          <tbody>
            <tr><td style={{padding:"8px 0",color:"var(--on-surface-variant)",width:160}}>Case</td><td style={{fontWeight:600}}>{c?.title}</td></tr>
            <tr><td style={{padding:"8px 0",color:"var(--on-surface-variant)"}}>Module</td><td>{form.moduleName}</td></tr>
            <tr><td style={{padding:"8px 0",color:"var(--on-surface-variant)"}}>Program</td><td>{form.program}</td></tr>
            <tr><td style={{padding:"8px 0",color:"var(--on-surface-variant)"}}>Access dates</td><td className="tnum">{dateRange}</td></tr>
            <tr><td style={{padding:"8px 0",color:"var(--on-surface-variant)"}}>Students</td><td className="tnum">{form.students}</td></tr>
            <tr><td style={{padding:"8px 0",color:"var(--on-surface-variant)"}}>Window</td><td>{form.accessWindow}</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        <button className="btn btn-ghost" onClick={onDone}>Back to catalog</button>
        <button className="btn btn-primary" onClick={onDone}>View my requests</button>
      </div>
    </div>
  );
}

window.ABS_REQUEST = { RequestView };
