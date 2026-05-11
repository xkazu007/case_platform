// Shared components and icons
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Icons (inline SVG) ───────────────────────────────────────────────
const Icon = ({ name, size = 16, stroke = 1.6 }) => {
  const s = size, sw = stroke;
  const props = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    filter: <><path d="M3 5h18M6 12h12M10 19h4"/></>,
    book: <><path d="M4 4h11a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4Z"/><path d="M4 4v12a4 4 0 0 0 4 4"/></>,
    bookmark: <><path d="M6 3h12v18l-6-4-6 4V3z"/></>,
    inbox: <><path d="M3 13h5l2 3h4l2-3h5"/><path d="M3 13V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7"/></>,
    library: <><path d="M3 5v14M9 5v14M15 5v14M21 5v14"/></>,
    chart: <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-7"/></>,
    users: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 14c2.5 0 5 1.7 5 5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    home: <><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    check: <><path d="m5 12 5 5 9-12"/></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    chevD: <><path d="m6 9 6 6 6-6"/></>,
    chevR: <><path d="m9 6 6 6-6 6"/></>,
    chevL: <><path d="m15 6-6 6 6 6"/></>,
    play: <><path d="M7 5v14l12-7z"/></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></>,
    note: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8z"/><path d="M14 3v6h6M9 14h6M9 18h4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    x: <><path d="M5 5l14 14M19 5 5 19"/></>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    edit: <><path d="M14 4l6 6L8 22H2v-6z"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
    highlight: <><path d="M14 3 21 10M5 21l3-1 12-12-2-2L6 18l-1 3z"/></>,
    underline: <><path d="M6 4v8a6 6 0 0 0 12 0V4M5 20h14"/></>,
    msg: <><path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/></>,
    warn: <><path d="M12 3 2 21h20Z"/><path d="M12 10v5M12 18h0"/></>,
    arrL: <><path d="M19 12H5M12 19l-7-7 7-7"/></>,
    arrR: <><path d="M5 12h14M12 5l7 7-7 7"/></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
};

// ─── Logo + Brand mark ───────────────────────────────────────────────
const Brand = ({ collapsed = false }) => (
  <div style={{display:"flex",alignItems:"center",gap:10,padding:"20px 18px",borderBottom:"1px solid var(--outline-variant)"}}>
    <img src="assets/abs-logo.png" alt="UM6P · ABS" style={{height:28,width:"auto",objectFit:"contain"}}/>
    {!collapsed && <div style={{marginLeft:"auto"}}>
      <div style={{fontFamily:"Epilogue",fontWeight:700,fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--on-surface)"}}>Case Platform</div>
      <div style={{fontSize:10,color:"var(--on-surface-variant)",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>Internal · v3.4</div>
    </div>}
  </div>
);

// ─── Toast system ───────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, kind="ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  }, []);
  const node = (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span className={`dot dot-${t.kind}`}/>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
  return { push, node };
}

// ─── Toggle switch ───────────────────────────────────────────────
const Switch = ({ checked, onChange, label }) => (
  <label style={{display:"flex",alignItems:"center",gap:12,padding:"7px 0",cursor:"pointer",fontSize:13}}>
    <span className="switch">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span className="slider"></span>
    </span>
    <span style={{color:"var(--on-surface)"}}>{label}</span>
  </label>
);

// ─── Checkbox row ───────────────────────────────────────────────
const Check = ({ checked, onChange, label, count }) => (
  <label className="checkbox">
    <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
    <span className="box"></span>
    <span>{label}</span>
    {count != null && <span className="count tnum">{count}</span>}
  </label>
);

// ─── Filter group (collapsible) ───────────────────────────────────────────────
const FilterGroup = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-group">
      <div className="head" onClick={()=>setOpen(o=>!o)}>
        <span>{title}</span>
        <span style={{transform:open?"rotate(0)":"rotate(-90deg)",transition:"var(--t)",color:"var(--on-surface-variant)"}}>
          <Icon name="chevD" size={14}/>
        </span>
      </div>
      {open && <div className="body">{children}</div>}
    </div>
  );
};

// ─── Pill counter ───────────────────────────────────────────────
const Pill = ({ children, tone="neutral" }) => {
  const tones = {
    neutral: { bg: "var(--surface-container-high)", color: "var(--on-surface)" },
    primary: { bg: "var(--primary-container)", color: "white" },
    soft: { bg: "var(--orange-chip)", color: "var(--on-surface)" },
  };
  const t = tones[tone];
  return <span style={{background:t.bg,color:t.color,padding:"2px 8px",borderRadius:"999px",fontSize:11,fontWeight:700,letterSpacing:"0.04em"}}>{children}</span>;
};

// ─── Difficulty badge ───────────────────────────────────────────────
const DifficultyBadge = ({ level }) => {
  const map = { Core:1, Advanced:2, Executive:3 };
  const lvl = map[level] || 1;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,letterSpacing:"0.06em",color:"var(--on-surface-variant)"}}>
      {[1,2,3].map(i => (
        <span key={i} style={{
          width: 4 + (i*1), height: 8 + (i*2),
          background: i <= lvl ? "var(--primary-container)" : "var(--outline-variant)",
        }}/>
      ))}
      <span style={{textTransform:"uppercase",marginLeft:2}}>{level}</span>
    </span>
  );
};

window.ABS_UI = { Icon, Brand, useToasts, Switch, Check, FilterGroup, Pill, DifficultyBadge };
