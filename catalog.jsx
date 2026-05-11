// Case Catalog — Professor view
const { Icon, FilterGroup, Switch, Check, Pill, DifficultyBadge } = window.ABS_UI;
const { DISCIPLINES, INDUSTRIES, LANGS, PROGRAM_LEVELS, AFRICAN_COUNTRY_COUNTS, CASES } = window.ABS_DATA;

function CatalogView({ onOpenCase, onRequestCase }) {
  const [query, setQuery] = useState("");
  // Item 8: removed "classic" from quick filters
  const [quickFlags, setQuickFlags] = useState({ bestseller: false, isNew: false });
  const [materials, setMaterials] = useState({ hasTN: false, hasVideo: false });
  const [disciplines, setDisciplines] = useState({});
  const [industries, setIndustries] = useState({});
  const [countries, setCountries] = useState({});
  const [langs, setLangs] = useState({});
  const [levels, setLevels] = useState({});
  const [sort, setSort] = useState("relevance");

  const toggleSet = (setter) => (key) => (val) => setter(s => ({ ...s, [key]: val }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const anyChecked = (obj) => Object.values(obj).some(Boolean);
    let r = CASES.filter(c => {
      // Item 7: keywords included in search
      if (q && !(`${c.title} ${c.company} ${(c.authors||[]).join(" ")} ${c.country} ${c.discipline} ${(c.keywords||[]).join(" ")}`.toLowerCase().includes(q))) return false;
      if (quickFlags.bestseller && !c.flags.bestseller) return false;
      if (quickFlags.isNew && !c.flags.isNew) return false;
      if (materials.hasTN && !c.flags.hasTN) return false;
      if (materials.hasVideo && !c.flags.hasVideo) return false;
      if (anyChecked(disciplines) && !disciplines[c.discipline]) return false;
      if (anyChecked(industries) && !industries[c.industry]) return false;
      // Item 4: country filter checks against c.countries array
      if (anyChecked(countries) && !(c.countries||[]).some(co => countries[co])) return false;
      if (anyChecked(langs) && !langs[c.language]) return false;
      // Item 5: filter on programLevel
      if (anyChecked(levels) && !levels[c.programLevel]) return false;
      return true;
    });
    if (sort === "year") r = [...r].sort((a,b) => b.year - a.year);
    else if (sort === "popular") r = [...r].sort((a,b) => b.usage.times - a.usage.times);
    else if (sort === "az") r = [...r].sort((a,b) => a.title.localeCompare(b.title));
    return r;
  }, [query, quickFlags, materials, disciplines, industries, countries, langs, levels, sort]);

  const activeFilterCount =
    Object.values(quickFlags).filter(Boolean).length +
    Object.values(materials).filter(Boolean).length +
    Object.values(disciplines).filter(Boolean).length +
    Object.values(industries).filter(Boolean).length +
    Object.values(countries).filter(Boolean).length +
    Object.values(langs).filter(Boolean).length +
    Object.values(levels).filter(Boolean).length;

  const clearAll = () => {
    setQuickFlags({ bestseller:false, isNew:false });
    setMaterials({ hasTN:false, hasVideo:false });
    setDisciplines({}); setIndustries({}); setCountries({}); setLangs({}); setLevels({});
    setQuery("");
  };

  return (
    <div>
      {/* Hero band */}
      <div className="hero-band" style={{padding:"36px 48px 24px"}}>
        <div className="label-caps">Case Library · Faculty Access</div>
        <h1 style={{margin:"10px 0 4px"}}>Case Catalog</h1>
        <p className="muted" style={{maxWidth:680,fontSize:15}}>Browse and request peer-reviewed cases authored by ABS faculty and partners across the continent. All requests are reviewed by the editorial board within two business days.</p>

        {/* Search */}
        <div style={{position:"relative",maxWidth:780,marginTop:24}}>
          <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",color:"var(--on-surface-variant)"}}>
            <Icon name="search" size={18}/>
          </span>
          <input
            className="input"
            style={{paddingLeft:46,paddingRight:120,height:52,fontSize:15}}
            placeholder="Search by title, company, author, country, or keyword…"
            value={query}
            onChange={e=>setQuery(e.target.value)}
          />
          <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"var(--on-surface-variant)",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600}}>
            {filtered.length} of {CASES.length}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{display:"grid",gridTemplateColumns:"272px 1fr",gap:0,padding:"0 48px 48px",alignItems:"start"}}>
        {/* Filter sidebar */}
        <aside style={{position:"sticky",top:0,paddingRight:24,paddingTop:28,borderRight:"1px solid var(--outline-variant)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:700,fontSize:13}}>
              <Icon name="filter" size={15}/>
              <span>Filters</span>
              {activeFilterCount > 0 && <Pill tone="primary">{activeFilterCount}</Pill>}
            </div>
            {activeFilterCount > 0 && (
              <button className="btn-link" style={{fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase"}} onClick={clearAll}>Clear all</button>
            )}
          </div>

          {/* Item 8: "Classic" removed — only Bestseller and New remain */}
          <FilterGroup title="Quick Filters">
            <Switch checked={quickFlags.bestseller} onChange={v=>setQuickFlags(s=>({...s,bestseller:v}))} label="Bestseller"/>
            <Switch checked={quickFlags.isNew} onChange={v=>setQuickFlags(s=>({...s,isNew:v}))} label="New"/>
          </FilterGroup>

          <FilterGroup title="Included Materials">
            <Switch checked={materials.hasTN} onChange={v=>setMaterials(s=>({...s,hasTN:v}))} label="Has Teaching Note"/>
            <Switch checked={materials.hasVideo} onChange={v=>setMaterials(s=>({...s,hasVideo:v}))} label="Has Video"/>
          </FilterGroup>

          <FilterGroup title="Discipline" defaultOpen={true}>
            <div className="scroll-y" style={{maxHeight:260}}>
              {DISCIPLINES.map(([name, count]) => (
                <Check key={name} label={name} count={count} checked={!!disciplines[name]} onChange={toggleSet(setDisciplines)(name)}/>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Industry Sector" defaultOpen={false}>
            {INDUSTRIES.map(([name, count]) => (
              <Check key={name} label={name} count={count} checked={!!industries[name]} onChange={toggleSet(setIndustries)(name)}/>
            ))}
          </FilterGroup>

          {/* Item 4: African Country selector replaces Geographic Focus */}
          <FilterGroup title="African Country" defaultOpen={false}>
            <div className="scroll-y" style={{maxHeight:240}}>
              {AFRICAN_COUNTRY_COUNTS.map(([name, count]) => (
                <Check key={name} label={name} count={count} checked={!!countries[name]} onChange={toggleSet(setCountries)(name)}/>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Language" defaultOpen={false}>
            {LANGS.map(([name, count]) => (
              <Check key={name} label={name} count={count} checked={!!langs[name]} onChange={toggleSet(setLangs)(name)}/>
            ))}
          </FilterGroup>

          {/* Item 5: Program Level replaces Difficulty */}
          <FilterGroup title="Program Level" defaultOpen={false}>
            {PROGRAM_LEVELS.map(([name, count]) => (
              <Check key={name} label={name} count={count} checked={!!levels[name]} onChange={toggleSet(setLevels)(name)}/>
            ))}
          </FilterGroup>
        </aside>

        {/* Card grid */}
        <main style={{paddingLeft:32,paddingTop:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div className="label-caps label-caps-muted">{filtered.length} cases</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span className="label-caps label-caps-muted">Sort</span>
              <select className="select" style={{width:200,padding:"8px 12px",fontSize:13}} value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="relevance">Most relevant</option>
                <option value="year">Newest first</option>
                <option value="popular">Most used</option>
                <option value="az">A → Z</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState onClear={clearAll}/>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:24}}>
              {filtered.map(c => <CaseCard key={c.id} c={c} onOpen={()=>onOpenCase(c)} onRequest={()=>onRequestCase(c)}/>)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CaseCard({ c, onOpen, onRequest }) {
  // Item 3: display multiple authors
  const authorLine = (c.authors||[c.author]).join(", ");

  return (
    <article className="card-shadow" style={{padding:24,display:"flex",flexDirection:"column",gap:14}}>
      {/* Top row: chips + flag dots */}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        <span className="chip chip-discipline">{c.discipline}</span>
        <span className="chip chip-content">{c.type}</span>
        {c.flags.bestseller && <span className="chip chip-outline" style={{borderColor:"var(--primary-container)",color:"var(--primary-container)"}}>★ Bestseller</span>}
        {c.flags.isNew && !c.flags.bestseller && <span className="chip chip-outline" style={{borderColor:"var(--green-ok)",color:"var(--green-ok)"}}>New</span>}
      </div>

      {/* Title */}
      <h3 style={{margin:0,fontSize:19,lineHeight:1.25,minHeight:48}}>
        <a onClick={onOpen} style={{color:"var(--on-surface)",cursor:"pointer"}}>{c.title}</a>
      </h3>

      {/* Company / country */}
      <div style={{fontSize:13,color:"var(--on-surface-variant)",display:"flex",alignItems:"center",gap:6}}>
        <strong style={{color:"var(--on-surface)",fontWeight:600}}>{c.company}</strong>
        <span className="dot-sep">·</span>
        <span>{c.country}</span>
      </div>

      {/* Abstract */}
      <p style={{
        fontSize:13.5,
        color:"var(--on-surface-variant)",
        lineHeight:1.55,
        margin:0,
        display:"-webkit-box",
        WebkitLineClamp:3,
        WebkitBoxOrient:"vertical",
        overflow:"hidden",
        minHeight:62,
      }}>{c.abstract}</p>

      {/* Author + meta */}
      <div style={{paddingTop:12,borderTop:"1px solid var(--outline-variant)",display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontSize:12,color:"var(--on-surface-variant)"}}>
          {/* Item 3: show all authors */}
          <span style={{color:"var(--on-surface)",fontWeight:600}}>{authorLine}</span>
          <span className="dot-sep">·</span>
          <span className="tnum">{c.year}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,fontSize:11.5,color:"var(--on-surface-variant)",flexWrap:"wrap"}}>
          {/* Item 5: use programLevel */}
          <DifficultyBadge level={c.programLevel}/>
          <span style={{display:"flex",alignItems:"center",gap:5}}><Icon name="globe" size={12}/>{c.language}</span>
          <span style={{display:"flex",alignItems:"center",gap:5}}><Icon name="clock" size={12}/>{c.readingMin} min</span>
          {c.flags.hasVideo && <span style={{display:"flex",alignItems:"center",gap:5,color:"var(--primary-container)"}}><Icon name="video" size={12}/>Video</span>}
          {/* Item 13: TN badge stays in professor catalog — catalog is professor-only */}
          {c.flags.hasTN && <span style={{display:"flex",alignItems:"center",gap:5}}><Icon name="note" size={12}/>TN</span>}
        </div>
        {/* Item 7: show keywords if present */}
        {c.keywords && c.keywords.length > 0 && (
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}>
            {c.keywords.slice(0,3).map(kw => (
              <span key={kw} style={{fontSize:10,padding:"2px 6px",background:"var(--surface-container)",borderRadius:"var(--r-full)",color:"var(--on-surface-variant)",fontWeight:500}}>{kw}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:8,marginTop:4}}>
        <button className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:"center"}} onClick={onOpen}>
          <Icon name="eye" size={13}/> Preview
        </button>
        <button className="btn btn-primary btn-sm" style={{flex:1.5,justifyContent:"center"}} onClick={onRequest}>
          Request for Module
        </button>
      </div>
    </article>
  );
}

function EmptyState({ onClear }) {
  return (
    <div style={{padding:"80px 40px",textAlign:"center",border:"1px dashed var(--outline-variant)",borderRadius:"var(--r-md)"}}>
      <div style={{width:64,height:64,margin:"0 auto 18px",borderRadius:"50%",background:"var(--surface-container)",display:"grid",placeItems:"center",color:"var(--on-surface-variant)"}}>
        <Icon name="search" size={26} stroke={1.4}/>
      </div>
      <h3 style={{fontSize:18}}>No cases match these filters</h3>
      <p className="muted" style={{maxWidth:380,margin:"6px auto 18px"}}>Try broadening your discipline or industry selection. The catalog updates weekly with new field cases from faculty.</p>
      <button className="btn btn-secondary btn-sm" onClick={onClear}>Clear filters</button>
    </div>
  );
}

window.ABS_CATALOG = { CatalogView };
