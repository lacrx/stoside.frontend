import { useState, useRef, useCallback, useEffect, type ChangeEvent } from "react";
import * as s from "./walk-audit.module.css";
import PinMap, { forwardGeocode, type PinMapHandle } from "./pin-map";

type Segment = { name: string };

type RouteSegment = { name: string; lines: number[][][] };

type WalkAuditFormProps = {
  auditSlug: string;
  segments: Segment[];
  mapUrl: string | null;
  routeSegments: RouteSegment[] | null;
};

type FormState = {
  location: string;
  lat: number | null;
  lng: number | null;
  sidewalk: string | null;
  crosswalk: string | null;
  lighting: string | null;
  traffic: string | null;
  safety: string | null;
  flagged: boolean;
  photo: string | null;
  notes: string;
};

type Entry = FormState & {
  id: string;
  segment: string;
  observer: string;
  audit_slug: string;
  created_at: string;
  photo_url: string | null;
};

const LS = "walkaudit";
const EMPTY_FORM: FormState = {
  location: "", lat: null, lng: null,
  sidewalk: null, crosswalk: null, lighting: null,
  traffic: null, safety: null, flagged: false,
  photo: null, notes: "",
};

const CONDITION_FIELDS: Array<{
  field: keyof FormState;
  label: string;
  options: Array<{ value: string; label: string }>;
}> = [
  { field: "sidewalk", label: "Sidewalk condition", options: [
    { value: "good", label: "Good" }, { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" }, { value: "none", label: "No sidewalk" },
  ]},
  { field: "crosswalk", label: "Crosswalk safety", options: [
    { value: "good", label: "Good" }, { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" }, { value: "none", label: "None present" },
  ]},
  { field: "lighting", label: "Street lighting", options: [
    { value: "good", label: "Good" }, { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ]},
  { field: "traffic", label: "Traffic speed & volume", options: [
    { value: "low", label: "Low" }, { value: "moderate", label: "Moderate" },
    { value: "high", label: "High" },
  ]},
  { field: "safety", label: "Overall safety rating", options: [
    { value: "safe", label: "Feels safe" }, { value: "concerns", label: "Some concerns" },
    { value: "unsafe", label: "Feels unsafe" },
  ]},
];

const BADGE_LABELS: Record<string, Record<string, string>> = {
  safety: { safe: "Feels safe", concerns: "Some concerns", unsafe: "Feels unsafe" },
  sidewalk: { good: "Sidewalk: Good", fair: "Sidewalk: Fair", poor: "Sidewalk: Poor", none: "No sidewalk" },
  crosswalk: { good: "Crosswalk: Good", fair: "Crosswalk: Fair", poor: "Crosswalk: Poor", none: "No crosswalk" },
  lighting: { good: "Lighting: Good", fair: "Lighting: Fair", poor: "Lighting: Poor" },
  traffic: { low: "Traffic: Low", moderate: "Traffic: Moderate", high: "Traffic: High" },
};

const BADGE_CLASS: Record<string, string> = {
  good: s.badgeGood, fair: s.badgeFair, poor: s.badgePoor, none: s.badgeNone,
  low: s.badgeLow, moderate: s.badgeModerate, high: s.badgeHigh,
  safe: s.badgeSafe, concerns: s.badgeConcerns, unsafe: s.badgeUnsafe,
};

function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX) { h = h * MAX / w; w = MAX; }
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const SUPABASE_URL = process.env.GATSBY_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.GATSBY_SUPABASE_KEY || "";

export default function WalkAuditForm({ auditSlug, segments, mapUrl, routeSegments }: WalkAuditFormProps) {
  const supabaseUrl = SUPABASE_URL;
  const supabaseKey = SUPABASE_KEY;
  const [tab, setTab] = useState<"new" | "list">("new");
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [entries, setEntries] = useState<Entry[]>(() =>
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(`${LS}_entries_${auditSlug}`) || "[]")
      : []
  );
  const segment = segments[0]?.name || "";
  const [observer, setObserver] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(`${LS}_observer`) || ""
      : ""
  );
  const [geoStatus, setGeoStatus] = useState<{ text: string; cls: string }>({ text: "", cls: "" });
  const [synced, setSynced] = useState<boolean | null>(null);
  const [toast, setToast] = useState<{ text: string; cls: string } | null>(null);

  const sbRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const pinMapRef = useRef<PinMapHandle>(null);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout>>();
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const persist = useCallback((updated: Entry[]) => {
    localStorage.setItem(`${LS}_entries_${auditSlug}`, JSON.stringify(updated));
  }, [auditSlug]);

  // Init Supabase
  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
    script.onload = async () => {
      const sb = (window as any).supabase.createClient(supabaseUrl, supabaseKey);
      sbRef.current = sb;

      const { data } = await sb.from("entries").select("*").eq("audit_slug", auditSlug);
      if (data) {
        setEntries(prev => {
          const ids = new Set(prev.map((e: Entry) => e.id));
          const merged = [...prev];
          for (const row of data) {
            if (!ids.has(row.id)) { merged.push(row); ids.add(row.id); }
          }
          persist(merged);
          return merged;
        });
      }

      sb.channel(`walk-audit-${auditSlug}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "entries", filter: `audit_slug=eq.${auditSlug}` }, (p: any) => {
          if (p.eventType === "INSERT") {
            setEntries(prev => {
              if (prev.find(e => e.id === p.new.id)) return prev;
              const updated = [...prev, p.new];
              persist(updated);
              return updated;
            });
          } else if (p.eventType === "DELETE") {
            setEntries(prev => {
              const updated = prev.filter(e => e.id !== p.old.id);
              persist(updated);
              return updated;
            });
          }
        })
        .subscribe((status: string) => setSynced(status === "SUBSCRIBED"));
    };
    document.head.appendChild(script);
  }, [supabaseUrl, supabaseKey, auditSlug, persist]);

  const showToast = (text: string, warn = false) => {
    setToast({ text, cls: warn ? s.toastWarn : "" });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const filtered = entries;

  const handlePill = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: prev[field] === value ? null : value }));
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, location: value }));
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    if (value.trim().length < 3) return;
    geocodeTimer.current = setTimeout(async () => {
      const result = await forwardGeocode(value.trim());
      if (!result) return;
      setForm(prev => ({ ...prev, lat: result.lat, lng: result.lng }));
      setGeoStatus({ text: `📍 ${result.lat.toFixed(5)}, ${result.lng.toFixed(5)}`, cls: s.geoOk });
      pinMapRef.current?.setPin(result.lat, result.lng);
    }, 800);
  };

  const handlePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const resized = await resizePhoto(file);
    setForm(prev => ({ ...prev, photo: resized }));
  };

  const handleSave = async () => {
    if (!form.location && !form.sidewalk && !form.crosswalk &&
        !form.lighting && !form.traffic && !form.safety && !form.notes) {
      showToast("Add a location or at least one observation.", true);
      return;
    }

    localStorage.setItem(`${LS}_observer`, observer);

    const entry: Entry = {
      id: crypto.randomUUID(),
      audit_slug: auditSlug,
      segment,
      location: form.location,
      lat: form.lat,
      lng: form.lng,
      sidewalk: form.sidewalk,
      crosswalk: form.crosswalk,
      lighting: form.lighting,
      traffic: form.traffic,
      safety: form.safety,
      flagged: form.flagged,
      photo: null,
      photo_url: form.photo,
      notes: form.notes,
      observer,
      created_at: new Date().toISOString(),
    };

    const updated = [...entries, entry];
    setEntries(updated);
    persist(updated);

    if (sbRef.current) {
      try {
        const { photo, ...row } = entry;
        await sbRef.current.from("entries").insert(row);
      } catch (err) { console.error("Sync insert failed:", err); }
    }

    setForm({ ...EMPTY_FORM });
    setGeoStatus({ text: "", cls: "" });
    if (fileRef.current) fileRef.current.value = "";
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
    showToast("Entry saved");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    persist(updated);
    if (sbRef.current) {
      try { await sbRef.current.from("entries").delete().eq("id", id); }
      catch (err) { console.error("Sync delete failed:", err); }
    }
    showToast("Entry deleted");
  };

  const handleExport = () => {
    if (!filtered.length) { showToast("No entries to export.", true); return; }
    const cols = ["segment", "location", "lat", "lng", "sidewalk", "crosswalk", "lighting", "traffic", "safety", "flagged", "notes", "observer", "created_at"];
    const rows = filtered.map(e => cols.map(c => {
      const v = (e as any)[c];
      if (v == null) return "";
      const str = String(v);
      return (str.includes(",") || str.includes('"') || str.includes("\n")) ? `"${str.replace(/"/g, '""')}"` : str;
    }));
    const csv = [cols.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `walk-audit-${auditSlug}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("CSV downloaded");
  };

  return (
    <div className={s.form}>
      <div className={s.controls}>
        <label>Today's Audit</label>
        <div className={s.syncBadge}>
          <span className={synced ? s.dotConnected : s.dot} />
          <span>{synced === null ? "Local only" : synced ? "Synced with team" : "Reconnecting…"}</span>
        </div>
      </div>

      <nav className={s.tabs}>
        <button className={tab === "new" ? s.tabActive : s.tab} onClick={() => setTab("new")}>New entry</button>
        <button className={tab === "list" ? s.tabActive : s.tab} onClick={() => setTab("list")}>
          All entries ({filtered.length})
        </button>
      </nav>

      {tab === "new" && (
        <>
          <div className={s.card} ref={formTopRef}>
            <h3>Location</h3>
            <p className={s.hint}>Type a location, tap the map, or use GPS.</p>
            <span className={s.fieldLabelFirst}>Cross street / address / stop</span>
            <div className={s.inputRow}>
              <input className={s.textInput} type="text" value={form.location} onChange={handleLocationChange} placeholder="Mission Ave & Cleveland St" />
              {form.location && <button type="button" className={s.btnClear} onClick={() => { setForm(prev => ({ ...prev, location: "", lat: null, lng: null })); setGeoStatus({ text: "", cls: "" }); pinMapRef.current?.clearPin(); }}>✕</button>}
            </div>
            <div className={`${s.geoStatus} ${geoStatus.cls}`}>{geoStatus.text}</div>
            <PinMap
              ref={pinMapRef}
              lat={form.lat}
              lng={form.lng}
              routeSegments={routeSegments}
              onPin={(lat, lng, label) => {
                setForm(prev => ({ ...prev, lat, lng, location: label || prev.location }));
                setGeoStatus({ text: `📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`, cls: s.geoOk });
              }}
            />
          </div>

          <div className={s.card}>
            <h3>Conditions</h3>
            <p className={s.hint}>Rate what you observe at this stop.</p>
            {CONDITION_FIELDS.map(({ field, label, options }, i) => (
              <div key={field as string}>
                <span className={i === 0 ? s.fieldLabelFirst : s.fieldLabel}>{label}</span>
                <div className={s.pills}>
                  {options.map(opt => {
                    const selected = form[field] === opt.value;
                    let cls = s.pill;
                    if (selected) {
                      const v = opt.value;
                      if (v === "good" || v === "safe" || v === "low") cls = s.pillGreen;
                      else if (v === "fair" || v === "concerns" || v === "moderate") cls = s.pillYellow;
                      else if (v === "poor" || v === "high" || v === "unsafe" || v === "none") cls = s.pillRed;
                      else cls = s.pillSelected;
                    }
                    return (
                      <button key={opt.value} type="button" className={cls} onClick={() => handlePill(field, opt.value)}>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className={s.flagRow}>
              <input type="checkbox" id="f-flagged" checked={form.flagged} onChange={e => setForm(prev => ({ ...prev, flagged: e.target.checked }))} />
              <label htmlFor="f-flagged">Flag for immediate follow-up</label>
            </div>
          </div>

          <div className={s.card}>
            <h3>Photo</h3>
            <div className={form.photo ? s.photoPreviewVisible : s.photoPreview}>
              {form.photo && <img src={form.photo} alt="Preview" />}
              <button className={s.photoRemove} type="button" onClick={() => { setForm(prev => ({ ...prev, photo: null })); if (fileRef.current) fileRef.current.value = ""; }}>&times;</button>
            </div>
            <button className={s.btnPhoto} type="button" onClick={() => fileRef.current?.click()}>&#x1f4f7; Add photo</button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
          </div>

          <div className={s.card}>
            <h3>Notes</h3>
            <textarea className={s.textarea} value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Anything else to note..." />
          </div>

          <div className={s.card}>
            <h3>Observer</h3>
            <input className={s.textInput} type="text" value={observer} onChange={e => setObserver(e.target.value)} placeholder="Your name" />
          </div>

          <button className={s.btnSave} type="button" onClick={handleSave}>Save entry</button>
        </>
      )}

      {tab === "list" && (
        <>
          <div className={s.entriesHeader}>
            <span className={s.entriesLabel}>{filtered.length} entr{filtered.length === 1 ? "y" : "ies"}</span>
            <button className={s.btnExport} type="button" onClick={handleExport}>Export CSV</button>
          </div>
          <div>
            {!filtered.length ? (
              <div className={s.empty}>No entries yet.</div>
            ) : (
              [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(entry => (
                <div key={entry.id} className={s.entry}>
                  <div className={s.entryTop}>
                    <div>
                      <div className={s.entryLocation}>{entry.location || "No location"}</div>
                      {entry.lat && <div className={s.entryMeta}>{entry.lat.toFixed(5)}, {entry.lng!.toFixed(5)}</div>}
                    </div>
                    <span className={s.entryTime}>{new Date(entry.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                  </div>
                  <div className={s.entryBadges}>
                    {(["safety", "sidewalk", "crosswalk", "lighting", "traffic"] as const).map(cat => {
                      const val = (entry as any)[cat];
                      return val ? <span key={cat} className={`${s.badge} ${BADGE_CLASS[val] || ""}`}>{BADGE_LABELS[cat]?.[val]}</span> : null;
                    })}
                    {entry.flagged && <span className={`${s.badge} ${s.badgeFlag}`}>&#x2691; Flagged</span>}
                  </div>
                  {entry.photo_url && <div className={s.entryPhoto}><img src={entry.photo_url} alt="Photo" loading="lazy" /></div>}
                  {entry.notes && <div className={s.entryNotes}>"{entry.notes}"</div>}
                  <div className={s.entryFooter}>
                    <span className={s.entryObserver}>{entry.observer || "Anonymous"}</span>
                    <button className={s.btnDelete} type="button" onClick={() => handleDelete(entry.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div className={toast ? `${s.toastVisible} ${toast.cls}` : s.toast}>{toast?.text}</div>
    </div>
  );
}
