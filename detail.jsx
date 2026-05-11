// Case Detail Page — Professor Preview
const { Icon: DI, DifficultyBadge: DDB } = window.ABS_UI;

function DetailView({ c, onBack, onOpenReader, onRequestCase, onOpenTN, role }) {
  if (!c) return null;
  // Item 3: multiple authors
  const authorLine = (c.authors || [c.author]).join(", ");

  return (
    <div>
      {/* Hero */}
      <div className="hero-band" style={{padding:"24px 48px 44px"}}>
        <button className="btn-link" onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:6,marginBottom:18}}>
          <DI name="arrL" size={14}/> Back to catalog
        </button>

        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          <span className="chip chip-discipline">{c.discipline}</span>
          <span className="chip chip-content">{c.industry}</span>
          {c.flags.bestseller && <span className="chip chip-outline" style={{borderColor:"var(--primary-container)",color:"var(--primary-container)"}}>★ Bestseller</span>}
          {c.flags.isNew && <span className="chip chip-outline" style={{borderColor:"var(--green-ok)",color:"var(--green-ok)"}}>New 2025</span>}
        </div>

        <h1 style={{maxWidth:920,margin:"0 0 18px"}}>{c.title}</h1>

        <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",fontSize:14,color:"var(--on-surface-variant)"}}>
          {/* Item 3: show all authors */}
          <span><strong style={{color:"var(--on-surface)",fontWeight:600}}>{authorLine}</strong> · {c.institution}</span>
          <span className="dot-sep">·</span>
          <span className="tnum">{c.year}</span>
          <span className="dot-sep">·</span>
          {/* Item 5: use programLevel */}
          <DDB level={c.programLevel}/>
          <span className="dot-sep">·</span>
          <span style={{display:"inline-flex",alignItems:"center",gap:6}}><DI name="globe" size={13}/>{c.language}</span>
          <span className="dot-sep">·</span>
          <span style={{display:"inline-flex",alignItems:"center",gap:6}}><DI name="clock" size={13}/>{c.readingMin} min read</span>
        </div>
      </div>

      {/* Body */}
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 320px",gap:48,padding:"40px 48px"}}>
        <div>
          {/* Abstract with accent bar */}
          <div className="label-caps">Abstract</div>
          <div className="accent-bar" style={{marginTop:12,marginBottom:36}}>
            <p style={{fontSize:18,lineHeight:1.6,color:"var(--on-surface)",margin:0,fontFamily:"Epilogue",fontWeight:400}}>
              {c.abstract}
            </p>
          </div>

          {/* Item 7: keywords on detail page */}
          {c.keywords && c.keywords.length > 0 && (
            <div style={{marginBottom:28}}>
              <div className="label-caps" style={{marginBottom:10}}>Keywords</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {c.keywords.map(kw => (
                  <span key={kw} style={{padding:"4px 10px",background:"var(--surface-container)",border:"1px solid var(--outline-variant)",borderRadius:"var(--r-full)",fontSize:12,fontWeight:500,color:"var(--on-surface)"}}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="label-caps" style={{marginTop:24}}>Setting</div>
          <p style={{marginTop:10,fontSize:15,lineHeight:1.7,color:"var(--on-surface)"}}>
            Set in {c.country} between 2022 and 2025, the case follows the leadership team of {c.company} as they confront a structural decision with continental implications. Written from sixteen interviews with executives, board members and external stakeholders, the case is intended for use in graduate and executive courses in {c.discipline.toLowerCase()}.
          </p>

          {/* Item 4: African countries */}
          {c.countries && c.countries.length > 0 && (
            <div style={{marginTop:20,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",fontSize:13,color:"var(--on-surface-variant)"}}>
              <span style={{fontWeight:700,color:"var(--on-surface)"}}>Countries covered:</span>
              {c.countries.map(co => (
                <span key={co} style={{padding:"2px 8px",background:"var(--surface-container)",borderRadius:"var(--r-full)",fontSize:11,fontWeight:600}}>{co}</span>
              ))}
            </div>
          )}

          <div className="label-caps" style={{marginTop:32}}>Suggested Discussion</div>
          <ul className="sq-list" style={{marginTop:12,fontSize:14.5,color:"var(--on-surface)"}}>
            <li>Frame the strategic decision in your own words. What is being optimized, and across what time horizon?</li>
            <li>Identify the three constituencies most affected by the decision. How do their incentives diverge?</li>
            <li>What would you need to believe to recommend the boldest option on the table?</li>
            <li>Stress-test the financial logic against a 30% downside scenario in the core market.</li>
          </ul>

          <div className="label-caps" style={{marginTop:36}}>Included Materials</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:12}}>
            <MaterialCard icon="file" title="Case (PDF)" sub="32 pages · 4 exhibits" available/>
            {/* Item 13: Teaching Note visible only for professor/editor roles, never student */}
            {role !== "student" && (
              <MaterialCard icon="note" title="Teaching Note" sub="Faculty only · 14 pages" available={c.flags.hasTN} onClick={c.flags.hasTN ? onOpenTN : undefined}/>
            )}
            <MaterialCard icon="video" title="Video Briefing" sub="11 min · interview" available={c.flags.hasVideo}/>
            <MaterialCard icon="grid" title="Excel Model" sub="Sensitivity workbook" available={false}/>
          </div>

          <div style={{display:"flex",gap:12,marginTop:40,paddingTop:32,borderTop:"1px solid var(--outline-variant)"}}>
            <button className="btn btn-secondary" onClick={onOpenReader}>
              <DI name="book" size={14}/> Read Full Case
            </button>
            <button className="btn btn-primary" onClick={onRequestCase}>Request for Module</button>
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{display:"flex",flexDirection:"column",gap:20}}>
          {/* Image placeholder */}
          <div className="img-ph" style={{aspectRatio:"4/3",borderRadius:"var(--r-md)",border:"1px solid var(--outline-variant)"}}>
            CASE COVER · {c.company.split(" ")[0].toUpperCase()}
          </div>

          {/* Usage stats */}
          <div className="card" style={{padding:20}}>
            <div className="label-caps label-caps-muted">Usage</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:14}}>
              <div>
                <div style={{fontFamily:"Epilogue",fontWeight:700,fontSize:28,letterSpacing:"-0.02em"}} className="tnum">{c.usage.times}</div>
                <div style={{fontSize:11,color:"var(--on-surface-variant)",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:600}}>Times taught</div>
              </div>
              <div>
                <div style={{fontFamily:"Epilogue",fontWeight:700,fontSize:28,letterSpacing:"-0.02em"}} className="tnum">{c.usage.programs}</div>
                <div style={{fontSize:11,color:"var(--on-surface-variant)",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:600}}>Programs</div>
              </div>
            </div>
            <hr className="divider"/>
            <div style={{fontSize:12,color:"var(--on-surface-variant)",lineHeight:1.6}}>
              Most frequently used in <strong style={{color:"var(--on-surface)"}}>EMBA Strategy</strong>, <strong style={{color:"var(--on-surface)"}}>MSc Finance</strong>, and <strong style={{color:"var(--on-surface)"}}>Executive Certificate in Pan-African Leadership</strong>.
            </div>
          </div>

          {/* Author card — Item 3: multiple authors */}
          <div className="card" style={{padding:20}}>
            <div className="label-caps label-caps-muted">{(c.authors||[]).length > 1 ? "Authors" : "Lead Author"}</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
              {(c.authors||[c.author]).map((author, i) => (
                <div key={i} style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background: i===0 ? "var(--primary-container)" : "var(--surface-container-high)",color: i===0 ? "white" : "var(--on-surface-variant)",display:"grid",placeItems:"center",fontFamily:"Epilogue",fontWeight:700,fontSize:15,flexShrink:0}}>
                    {author.split(" ").slice(-2).map(s=>s[0]).join("")}
                  </div>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{author}</div>
                    {i === 0 && <div style={{fontSize:12,color:"var(--on-surface-variant)"}}>{c.institution}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MaterialCard({ icon, title, sub, available, onClick }) {
  return (
    <div onClick={available?onClick:undefined} className="card" style={{
      padding:14,minWidth:180,flex:1,display:"flex",alignItems:"center",gap:12,
      opacity: available ? 1 : 0.45,
      cursor: available && onClick ? "pointer" : "default",
      transition:"var(--t)",
    }}>
      <div style={{width:36,height:36,borderRadius:"var(--r-default)",background:"var(--surface-container)",display:"grid",placeItems:"center",color:"var(--on-surface-variant)"}}>
        <DI name={icon} size={16}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:13}}>{title}</div>
        <div style={{fontSize:11,color:"var(--on-surface-variant)"}}>{sub}</div>
      </div>
      {!available && <DI name="lock" size={12}/>}
    </div>
  );
}

window.ABS_DETAIL = { DetailView };
