// Teaching Note view
const { Icon: TNI } = window.ABS_UI;
const { TEACHING_NOTE } = window.ABS_DATA;

function TeachingNoteView({ c, onBack }) {
  return (
    <div>
      <div className="banner">
        <TNI name="lock" size={14}/>
        <span>Faculty-only material · Do not redistribute · Watermarked to your account</span>
      </div>

      <div style={{maxWidth:880,margin:"0 auto",padding:"40px 24px 80px"}}>
        <button className="btn-link" onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,marginBottom:24}}>
          <TNI name="arrL" size={13}/> Back to case
        </button>

        <div className="label-caps">Teaching Note · {c?.discipline || "Strategy"}</div>
        <h1 style={{margin:"10px 0 8px"}}>{TEACHING_NOTE.title}</h1>
        <div style={{fontSize:13,color:"var(--on-surface-variant)",marginBottom:32}}>
          14 pages · Last revised May 2025 · Author: {c?.author || "Dr. Salma Bennani"}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 220px",gap:48,alignItems:"start"}}>
          <div>
            {TEACHING_NOTE.sections.map((s, i) => (
              <section key={i} style={{marginBottom:48}}>
                <div className="label-caps">Section {String(i+1).padStart(2,"0")}</div>
                <h2 style={{margin:"10px 0 18px",fontSize:26}}>{s.heading}</h2>

                {s.kind === "list" && (
                  <ul className="sq-list" style={{fontSize:15,lineHeight:1.7}}>
                    {s.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                )}

                {s.kind === "plan" && (
                  <table className="tbl" style={{border:"1px solid var(--outline-variant)",borderRadius:"var(--r-md)",overflow:"hidden"}}>
                    <thead>
                      <tr>
                        <th style={{width:160}}>Time</th>
                        <th>Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.items.map((it, j) => (
                        <tr key={j}>
                          <td className="tnum" style={{fontWeight:600,color:"var(--primary-container)"}}>{it.t}</td>
                          <td>{it.b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {s.kind === "paragraph" && (
                  <div className="accent-bar">
                    <p style={{fontSize:16,lineHeight:1.7,fontFamily:"Epilogue",fontWeight:400,margin:0}}>{s.body}</p>
                  </div>
                )}
              </section>
            ))}
          </div>

          <aside style={{position:"sticky",top:24,paddingLeft:24,borderLeft:"1px solid var(--outline-variant)"}}>
            <div className="label-caps label-caps-muted">In this note</div>
            <ul style={{listStyle:"none",padding:0,margin:"14px 0 0",fontSize:13}}>
              {TEACHING_NOTE.sections.map((s, i) => (
                <li key={i} style={{padding:"8px 0",borderBottom:"1px solid var(--outline-variant)"}}>
                  <a style={{color:"var(--on-surface)",fontWeight:500}}>{String(i+1).padStart(2,"0")} · {s.heading}</a>
                </li>
              ))}
            </ul>

            <div style={{marginTop:32,padding:16,background:"var(--surface-container)",borderRadius:"var(--r-default)",fontSize:12,color:"var(--on-surface-variant)",lineHeight:1.55}}>
              Need to discuss? <a href="#" style={{display:"block",marginTop:6,fontWeight:600}}>Schedule a 30-min call with the author</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

window.ABS_TN = { TeachingNoteView };
