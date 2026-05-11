// Main app shell
const { Icon: AI, Brand, useToasts } = window.ABS_UI;
const { CASES } = window.ABS_DATA;
const { CatalogView } = window.ABS_CATALOG;
const { DetailView } = window.ABS_DETAIL;
const { ReaderView } = window.ABS_READER;
const { RequestView } = window.ABS_REQUEST;
const { TeachingNoteView } = window.ABS_TN;
const { EditorView } = window.ABS_EDITOR;
const { LibraryView } = window.ABS_LIBRARY;
const { SubmitCaseView } = window.ABS_SUBMIT;

const ROLES = {
  professor: {
    name: "Prof. Mounia Cherkaoui",
    role: "Faculty · Strategy",
    nav: [
      { id:"catalog", label:"Case Catalog", icon:"library" },
      { id:"requests", label:"My Requests", icon:"inbox", badge:3 },
      { id:"saved", label:"Saved Cases", icon:"bookmark" },
      { id:"modules", label:"My Modules", icon:"grid" },
      { id:"settings", label:"Settings", icon:"settings" },
    ],
  },
  student: {
    name: "Yasmine Ouali",
    role: "Student · EMBA Cohort 12",
    nav: [
      { id:"library", label:"My Library", icon:"library" },
      { id:"reader", label:"OCP Group · Active", icon:"book" },
      { id:"notes", label:"Notes & Highlights", icon:"bookmark", badge:14 },
      { id:"settings", label:"Settings", icon:"settings" },
    ],
  },
  editor: {
    name: "Hicham Bensaid",
    role: "Editorial Board · Director",
    nav: [
      { id:"editor", label:"Dashboard", icon:"home" },
      { id:"requests", label:"Pending Reviews", icon:"inbox", badge:5 },
      { id:"pipeline", label:"Case Pipeline", icon:"file" },
      { id:"authors", label:"Authors", icon:"users" },
      { id:"reports", label:"Reports", icon:"chart" },
      { id:"settings", label:"Settings", icon:"settings" },
    ],
  },
};

function App() {
  const [role, setRole] = useState("professor");
  const [view, setView] = useState({ name: "catalog" }); // catalog | detail | reader | request | tn | editor
  const [activeNav, setActiveNav] = useState("catalog");
  const toasts = useToasts();

  // Switch role → reset to default view
  const switchRole = (r) => {
    setRole(r);
    if (r === "professor") { setView({ name: "catalog" }); setActiveNav("catalog"); }
    if (r === "student") { setView({ name: "library" }); setActiveNav("library"); }
    if (r === "editor") { setView({ name: "editor" }); setActiveNav("editor"); }
  };

  const openCase = (c) => { setView({ name: "detail", c }); };
  const openReader = () => { setView({ name: "reader" }); };
  const openRequest = (c) => { setView({ name: "request", c }); };
  const openTN = (c) => { setView({ name: "tn", c }); };
  const backToCatalog = () => { setView({ name: "catalog" }); setActiveNav("catalog"); };

  const isFullScreen = view.name === "reader" && role === "student";
  const config = ROLES[role];

  // pick a case to default into for the student reader
  const defaultCase = CASES[0];

  return (
    <div style={{display:"grid",gridTemplateColumns: isFullScreen ? "260px 1fr" : "260px 1fr",height:"100vh",overflow:"hidden",background:"var(--background)"}}>
      {/* Sidebar */}
      <aside style={{borderRight:"1px solid var(--outline-variant)",background:"white",display:"flex",flexDirection:"column"}}>
        <Brand/>

        {/* Role switcher */}
        <div style={{padding:"16px 18px",borderBottom:"1px solid var(--outline-variant)"}}>
          <div className="label-caps label-caps-muted" style={{fontSize:9,marginBottom:8}}>Viewing as</div>
          <div style={{display:"flex",gap:4,padding:3,background:"var(--surface-container)",borderRadius:"var(--r-default)"}}>
            {[
              {id:"professor",label:"Faculty"},
              {id:"student",label:"Student"},
              {id:"editor",label:"Editor"},
            ].map(r => (
              <button key={r.id} onClick={()=>switchRole(r.id)} style={{
                flex:1,
                padding:"6px 8px",
                background: role===r.id ? "white" : "transparent",
                border:0,borderRadius:4,
                fontFamily:"Manrope",fontWeight: role===r.id ? 700 : 500,fontSize:11,
                letterSpacing:"0.04em",
                color: role===r.id ? "var(--on-surface)" : "var(--on-surface-variant)",
                cursor:"pointer",
                boxShadow: role===r.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition:"var(--t)",
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"14px 0",overflowY:"auto"}}>
          {config.nav.map(item => (
            <div key={item.id} className={`sidebar-nav-item ${activeNav===item.id?"active":""}`} onClick={()=>{
              setActiveNav(item.id);
              if (role === "professor" && item.id === "catalog") setView({ name:"catalog" });
              if (role === "student" && item.id === "reader") setView({ name:"reader", c: defaultCase });
              if (role === "student" && item.id === "library") setView({ name:"library" });
              if (role === "editor" && (item.id === "editor" || item.id === "requests" || item.id === "pipeline")) setView({ name:"editor" });
            }}>
              <AI name={item.icon} size={16}/>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge && (
                <span style={{background:"var(--primary-container)",color:"white",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:"999px",letterSpacing:"0.04em"}}>{item.badge}</span>
              )}
            </div>
          ))}
        </nav>

        {/* User card */}
        <div style={{padding:"14px 18px",borderTop:"1px solid var(--outline-variant)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:"var(--primary-container)",color:"white",display:"grid",placeItems:"center",fontFamily:"Epilogue",fontWeight:700,fontSize:13}}>
            {config.name.split(" ").slice(-2).map(s=>s[0]).join("")}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{config.name}</div>
            <div style={{fontSize:11,color:"var(--on-surface-variant)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{config.role}</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{overflow:"auto",position:"relative"}}>
        {/* Top toolbar (hidden in full-screen reader) */}
        {!isFullScreen && (
          <div style={{height:56,borderBottom:"1px solid var(--outline-variant)",background:"white",display:"flex",alignItems:"center",padding:"0 32px",gap:18,position:"sticky",top:0,zIndex:20}}>
            <Breadcrumb view={view} role={role}/>
            <div style={{flex:1}}/>
            <button className="btn-link" style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"var(--on-surface-variant)"}}>
              <AI name="bell" size={16}/>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setView({name:"submit"})}>
              <AI name="plus" size={13}/> Submit a case
            </button>
          </div>
        )}

        <div style={{minHeight: isFullScreen ? "100vh" : "calc(100vh - 56px)"}}>
          {role === "professor" && view.name === "catalog" && (
            <CatalogView onOpenCase={openCase} onRequestCase={openRequest}/>
          )}
          {role === "professor" && view.name === "detail" && (
            <DetailView c={view.c} onBack={backToCatalog} onOpenReader={openReader} onRequestCase={()=>openRequest(view.c)} onOpenTN={()=>openTN(view.c)}/>
          )}
          {role === "professor" && view.name === "reader" && (
            <ReaderView onExit={()=>setView({name:"detail", c: view.c || defaultCase})}/>
          )}
          {role === "professor" && view.name === "request" && (
            <RequestView c={view.c} onSubmit={()=>toasts.push("Request submitted to editorial board", "ok")} onCancel={backToCatalog}/>
          )}
          {role === "professor" && view.name === "tn" && (
            <TeachingNoteView c={view.c} onBack={()=>setView({name:"detail", c: view.c})}/>
          )}

          {role === "student" && view.name === "library" && (
            <LibraryView onOpenReader={(c)=>{ setView({name:"reader", c}); setActiveNav("reader"); }}/>
          )}
          {role === "student" && view.name === "reader" && (
            <ReaderView onExit={()=>{ setView({name:"library"}); setActiveNav("library"); toasts.push("Saved your place to your library.","info"); }}/>
          )}

          {role === "editor" && view.name === "editor" && (
            <EditorView pushToast={toasts.push} onSubmitNewCase={()=>setView({name:"submit"})}/>
          )}
          {view.name === "submit" && (
            <SubmitCaseView
              onCancel={()=>{
                if (role === "editor") setView({name:"editor"});
                else if (role === "professor") setView({name:"catalog"});
                else setView({name:"library"});
              }}
              onSubmit={()=>toasts.push("Case submitted — routed to discipline chair","ok")}
            />
          )}
        </div>
      </main>

      {toasts.node}
    </div>
  );
}

function Breadcrumb({ view, role }) {
  const items = [];
  if (role === "professor") {
    items.push("Case Catalog");
    if (view.name === "detail") items.push(view.c?.title);
    if (view.name === "request") items.push(view.c?.title, "Request");
    if (view.name === "tn") items.push(view.c?.title, "Teaching Note");
    if (view.name === "reader") items.push(view.c?.title || "Reading", "Read");
  }
  if (role === "editor") items.push("Editor Dashboard");
  if (role === "student") {
    items.push("My Library");
    if (view.name === "reader") items.push(view.c?.title || "Reading");
  }

  return (
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,minWidth:0}}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <AI name="chevR" size={12}/>}
          <span style={{
            color: i === items.length - 1 ? "var(--on-surface)" : "var(--on-surface-variant)",
            fontWeight: i === items.length - 1 ? 600 : 500,
            whiteSpace:"nowrap",
            overflow:"hidden",
            textOverflow:"ellipsis",
            maxWidth: i === items.length - 1 ? 480 : 200,
          }}>{it}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
