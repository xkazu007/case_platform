// Editor Dashboard
const { Icon: EI } = window.ABS_UI;
const { PENDING_REQUESTS, PUBLISHED, ACTIVITY, PROGRAMS: INITIAL_PROGRAMS } = window.ABS_DATA;

function EditorView({ pushToast, onSubmitNewCase }) {
  const [tab, setTab] = useState("requests");
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [selected, setSelected] = useState(null);
  // Item 2: programs state — admin can add to this list
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [newProgram, setNewProgram] = useState("");

  const approve = (r) => {
    setRequests(rs => rs.filter(x => x.id !== r.id));
    setSelected(null);
    pushToast?.(`Approved · ${r.prof.split(" ").slice(-1)} can now share with ${r.students} students`, "ok");
  };
  const reject = (r) => {
    setRequests(rs => rs.filter(x => x.id !== r.id));
    setSelected(null);
    pushToast?.(`Rejected · ${r.prof}'s request was returned with notes`, "warn");
  };

  const addProgram = () => {
    const t = newProgram.trim();
    if (!t || programs.includes(t)) return;
    const updated = [...programs, t];
    setPrograms(updated);
    window.ABS_DATA.PROGRAMS = updated;
    setNewProgram("");
    pushToast?.(`Program "${t}" added to registry`, "ok");
  };
  const removeProgram = (p) => {
    const updated = programs.filter(x => x !== p);
    setPrograms(updated);
    window.ABS_DATA.PROGRAMS = updated;
  };

  return (
    <div style={{padding:"40px 48px 80px"}}>
      <div className="label-caps">Editorial Board</div>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginTop:8,marginBottom:32,gap:24,flexWrap:"wrap"}}>
        <div>
          <h1 style={{margin:0}}>Editor Dashboard</h1>
          <p className="muted" style={{maxWidth:540,marginTop:4}}>Review module requests, manage the case pipeline, and monitor catalog usage across the school.</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-ghost"><EI name="file" size={14}/> Export usage report</button>
          <button className="btn btn-primary" onClick={onSubmitNewCase}><EI name="plus" size={14}/> Submit new case</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:20,marginBottom:36}}>
        <Stat label="Pending review" value={requests.length} delta="+2 this week" tone="primary"/>
        <Stat label="Cases in catalog" value={184} delta="+9 since Jan"/>
        <Stat label="Active modules" value={61} delta="3 cohorts launching"/>
        <Stat label="Avg. review time" value="28h" delta="−6h vs target" down/>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",alignItems:"center",borderBottom:"1px solid var(--outline-variant)",marginBottom:24}}>
        {[
          { id:"requests", label:"Pending Requests", count: requests.length },
          { id:"pipeline", label:"Case Pipeline", count: PUBLISHED.length },
          { id:"activity", label:"Recent Activity" },
          // Item 2: Registry tab for program management
          { id:"registry", label:"Program Registry", count: programs.length },
        ].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            background:"transparent",border:0,padding:"14px 22px 14px 0",marginRight:24,
            fontFamily:"Manrope",fontWeight:600,fontSize:14,
            color: tab===t.id ? "var(--on-surface)" : "var(--on-surface-variant)",
            borderBottom: tab===t.id ? "2px solid var(--primary-container)" : "2px solid transparent",
            marginBottom:-1,cursor:"pointer",display:"flex",alignItems:"center",gap:8,
          }}>
            {t.label}
            {t.count != null && <span style={{
              background: tab===t.id ? "var(--primary-container)" : "var(--surface-container-high)",
              color: tab===t.id ? "white" : "var(--on-surface-variant)",
              padding:"2px 8px",borderRadius:"999px",fontSize:11,fontWeight:700,
            }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <div style={{display:"grid",gridTemplateColumns: selected ? "minmax(0,1fr) 420px" : "1fr",gap:24}}>
          <div style={{background:"white",border:"1px solid var(--outline-variant)",borderRadius:"var(--r-md)",overflow:"hidden"}}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Professor / Module</th>
                  <th>Case</th>
                  <th>Cohort</th>
                  <th style={{textAlign:"right"}}>Students</th>
                  <th>Submitted</th>
                  <th style={{width:80}}></th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} onClick={()=>setSelected(r)} style={{cursor:"pointer",background: selected?.id===r.id ? "var(--surface-container)" : "transparent"}}>
                    <td>
                      <div style={{fontWeight:600}}>{r.prof}</div>
                      <div style={{fontSize:12,color:"var(--on-surface-variant)"}}>{r.module}</div>
                    </td>
                    <td style={{maxWidth:280}}>
                      <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.caseTitle}</div>
                    </td>
                    <td><span style={{fontSize:12,color:"var(--on-surface-variant)"}}>{r.program}</span></td>
                    <td style={{textAlign:"right"}} className="tnum">{r.students}</td>
                    <td style={{fontSize:12,color:"var(--on-surface-variant)"}}>{r.date}</td>
                    <td>
                      <span className="chip chip-status-review">Pending</span>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={6} style={{textAlign:"center",padding:48,color:"var(--on-surface-variant)"}}>No pending requests. Inbox zero.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {selected && (
            <aside className="card" style={{padding:24,position:"sticky",top:24,alignSelf:"start"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div className="label-caps">Request #{selected.id.toUpperCase()}</div>
                <button className="btn-link" onClick={()=>setSelected(null)}><EI name="x" size={14}/></button>
              </div>
              <h3 style={{fontSize:18,margin:"0 0 4px"}}>{selected.caseTitle}</h3>
              <div style={{fontSize:13,color:"var(--on-surface-variant)",marginBottom:18}}>Requested {selected.date}</div>

              <hr className="divider" style={{margin:"0 0 16px"}}/>

              <Row label="Professor" value={selected.prof}/>
              <Row label="Module" value={selected.module}/>
              <Row label="Program" value={selected.program}/>
              <Row label="Estimated students" value={selected.students}/>

              <div className="label-caps label-caps-muted" style={{marginTop:18}}>Teaching Context</div>
              <p style={{fontSize:13.5,lineHeight:1.6,color:"var(--on-surface)",marginTop:8,padding:"14px 16px",background:"var(--surface-container)",borderRadius:"var(--r-default)"}}>
                Anchoring case for the third week, paired with the M-KOPA reading. Students will prepare a one-page memo to the chairman. Discussion follows the cold-call → small-group → plenary structure used in this module.
              </p>

              <div className="label-caps label-caps-muted" style={{marginTop:18}}>Editorial check</div>
              <ul style={{listStyle:"none",padding:0,margin:"10px 0",fontSize:13}}>
                <CheckItem ok label="Professor verified · UM6P faculty"/>
                <CheckItem ok label="Module on this term's calendar"/>
                <CheckItem ok label="Case author available for Q&A if requested"/>
                <CheckItem warn label="Cohort size above class median (42 vs 28)"/>
              </ul>

              {/* Item 14: action buttons including Contact mailto link */}
              <div style={{display:"flex",gap:8,marginTop:24,flexWrap:"wrap"}}>
                <a
                  href={`mailto:${selected.email}?subject=Re%3A%20Case%20Request%20%E2%80%94%20${encodeURIComponent(selected.caseTitle)}`}
                  className="btn btn-ghost btn-sm"
                  title={`Email ${selected.prof}`}
                  style={{display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none"}}
                >
                  <EI name="mail" size={13}/> Contact
                </a>
                <button className="btn btn-danger btn-sm" style={{flex:1,justifyContent:"center"}} onClick={()=>reject(selected)}>Reject</button>
                <button className="btn btn-success btn-sm" style={{flex:1.5,justifyContent:"center"}} onClick={()=>approve(selected)}>
                  <EI name="check" size={13}/> Approve & send link
                </button>
              </div>
            </aside>
          )}
        </div>
      )}

      {tab === "pipeline" && (
        <div style={{background:"white",border:"1px solid var(--outline-variant)",borderRadius:"var(--r-md)",overflow:"hidden"}}>
          <table className="tbl">
            <thead>
              <tr><th>Case</th><th>Author</th><th>Status</th><th>Year</th><th style={{textAlign:"right"}}>Times taught</th><th style={{width:60}}></th></tr>
            </thead>
            <tbody>
              {PUBLISHED.map(p => (
                <tr key={p.id}>
                  <td style={{fontWeight:500,maxWidth:380}}>{p.title}</td>
                  <td style={{fontSize:13,color:"var(--on-surface-variant)"}}>{p.author}</td>
                  <td>
                    <span className={`chip ${
                      p.status==="Published" ? "chip-status-published" :
                      p.status==="Under Review" ? "chip-status-review" :
                      "chip-status-draft"
                    }`}>{p.status}</span>
                  </td>
                  <td className="tnum">{p.year}</td>
                  <td style={{textAlign:"right"}} className="tnum">{p.uses || "—"}</td>
                  <td><button className="btn-link" style={{fontSize:12}}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "activity" && (
        <div className="card" style={{padding:8}}>
          <ul style={{listStyle:"none",padding:0,margin:0}}>
            {ACTIVITY.map((a, i) => (
              <li key={i} style={{padding:"16px 20px",borderBottom: i<ACTIVITY.length-1 ? "1px solid var(--outline-variant)" : "0",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"var(--surface-container)",display:"grid",placeItems:"center",fontFamily:"Epilogue",fontWeight:700,fontSize:13,color:"var(--on-surface-variant)",flexShrink:0}}>
                  {a.who.split(" ").map(s => s[0]).slice(0,2).join("")}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14}}>
                    <strong>{a.who}</strong>{" "}
                    <span style={{color:"var(--on-surface-variant)"}}>{a.what}</span>{" "}
                    <strong style={{color:"var(--primary)"}}>{a.obj}</strong>
                  </div>
                </div>
                <div style={{fontSize:12,color:"var(--on-surface-variant)",letterSpacing:"0.04em"}} className="tnum">{a.when}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Item 2: Program Registry tab — admin-configurable programs list */}
      {tab === "registry" && (
        <div style={{maxWidth:600}}>
          <div style={{marginBottom:20}}>
            <h3 style={{margin:"0 0 6px",fontSize:20}}>Program Registry</h3>
            <p className="muted" style={{fontSize:13,marginBottom:0}}>These programs appear in the request form when faculty submit a module request. Changes take effect immediately for new submissions.</p>
          </div>
          <div className="card" style={{padding:20,marginBottom:16}}>
            <div style={{display:"flex",gap:10}}>
              <input
                className="input"
                placeholder="Add a new program…"
                value={newProgram}
                onChange={e=>setNewProgram(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter") addProgram();}}
                style={{flex:1}}
              />
              <button className="btn btn-primary" onClick={addProgram} disabled={!newProgram.trim()} style={{opacity:newProgram.trim()?1:0.5}}>
                <EI name="plus" size={13}/> Add
              </button>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {programs.map(p => (
              <div key={p} className="card" style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <span style={{fontSize:14,fontWeight:500}}>{p}</span>
                <button onClick={()=>removeProgram(p)} style={{background:"transparent",border:0,padding:4,cursor:"pointer",color:"var(--on-surface-variant)",display:"flex"}}>
                  <EI name="x" size={14}/>
                </button>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,fontSize:12,color:"var(--on-surface-variant)"}}>
            {programs.length} program{programs.length!==1?"s":""} · changes sync to the request form automatically
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, delta, down, tone }) {
  return (
    <div className="stat-card" style={tone==="primary"?{borderLeftWidth:3,borderLeftColor:"var(--primary-container)",borderLeftStyle:"solid"}:{}}>
      <div className="label-caps label-caps-muted">{label}</div>
      <div className="num tnum">{value}</div>
      {delta && <div className={`delta ${down?"down":""}`}>{delta}</div>}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13,gap:16}}>
      <span style={{color:"var(--on-surface-variant)"}}>{label}</span>
      <span style={{fontWeight:600,textAlign:"right"}}>{value}</span>
    </div>
  );
}

function CheckItem({ ok, warn, label }) {
  const color = ok ? "var(--green-ok)" : warn ? "var(--tertiary-container)" : "var(--on-surface-variant)";
  return (
    <li style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0"}}>
      <span style={{width:18,height:18,borderRadius:"50%",background:color,color:"white",display:"grid",placeItems:"center"}}>
        <EI name={ok ? "check" : "warn"} size={11} stroke={2.4}/>
      </span>
      <span>{label}</span>
    </li>
  );
}

window.ABS_EDITOR = { EditorView };
