"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Status = "Pendiente" | "En proceso" | "En revisión" | "Entregado";
type Kind = "Imagen" | "Video";
type Task = { id: number; title: string; kind: Kind; due: string; status: Status; link: string; image?: string; notes: string };

const seed: Task[] = [
  { id: 1, title: "Personaje con reporte de métricas", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-01.png", notes: "Ilustración 3D, fondo blanco y acentos azules." },
  { id: 2, title: "Personaje con tablet y analítica", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-02.png", notes: "Incluir elementos flotantes y tarjetas de datos." },
  { id: 3, title: "Escena de trabajo en escritorio", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-03.png", notes: "Escena 3D lila, formato horizontal." },
  { id: 4, title: "Cohete de lanzamiento digital", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-04.png", notes: "Acabado cristal, paleta azul y violeta." },
  { id: 5, title: "Visual tecnológico abstracto", kind: "Video", due: "", status: "Pendiente", link: "", image: "/referencias/ref-05.png", notes: "Animación horizontal con partículas y profundidad." },
  { id: 6, title: "Calendario 3D", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-06.png", notes: "Calendario de escritorio, estilo limpio." },
  { id: 7, title: "Productividad y calendario", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-07.png", notes: "Escena isométrica coral y rosa." },
  { id: 8, title: "Laptop creativa", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-08.png", notes: "Laptop blanca con elementos creativos." },
  { id: 9, title: "Interfaz creativa 3D", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-09.png", notes: "Manos interactuando con una interfaz." },
  { id: 10, title: "Dashboard de integraciones", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-10.png", notes: "Panel de métricas con manos y módulos." },
  { id: 11, title: "Escena interior azul", kind: "Video", due: "", status: "Pendiente", link: "", image: "/referencias/ref-11.png", notes: "Animación de iluminación en ambiente interior." },
];

const statuses: Status[] = ["Pendiente", "En proceso", "En revisión", "Entregado"];
const today = new Date().toISOString().slice(0, 10);

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(seed);
  const [filter, setFilter] = useState<"Todas" | Status>("Todas");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);
  const [ready, setReady] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("marco-tracker-v1");
    if (saved) try { setTasks(JSON.parse(saved)); } catch { /* keep starter data */ }
    setReady(true);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem("marco-tracker-v1", JSON.stringify(tasks)); }, [tasks, ready]);

  const visible = useMemo(() => tasks.filter(t => (filter === "Todas" || t.status === filter) && t.title.toLowerCase().includes(query.toLowerCase())), [tasks, filter, query]);
  const done = tasks.filter(t => t.status === "Entregado").length;
  const upcoming = tasks.filter(t => t.due && t.due >= today && t.status !== "Entregado").sort((a,b) => a.due.localeCompare(b.due))[0];

  function saveTask(task: Task) {
    setTasks(current => current.some(t => t.id === task.id) ? current.map(t => t.id === task.id ? task : t) : [task, ...current]);
    setEditing(null);
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "tracker-marco.json"; a.click(); URL.revokeObjectURL(url);
  }
  function importData(file?: File) {
    if (!file) return; const reader = new FileReader(); reader.onload = () => { try { setTasks(JSON.parse(String(reader.result))); } catch { alert("Este archivo no es un respaldo válido."); } }; reader.readAsText(file);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="logo">M</span><div><strong>Marco / entregas</strong><small>Tracker creativo</small></div></div>
        <div className="actions"><button className="ghost" onClick={exportData}>↓ Respaldo</button><button className="primary" onClick={() => setEditing({ id: Date.now(), title: "", kind: "Imagen", due: "", status: "Pendiente", link: "", notes: "" })}>＋ Nueva actividad</button></div>
      </header>

      <section className="hero">
        <div><p className="eyebrow">CONTROL DE PRODUCCIÓN</p><h1>Todo lo que Marco<br/>tiene que entregar.</h1><p className="lede">Referencias, fechas, avances y links finales en un solo lugar.</p></div>
        <div className="progress-card"><div className="progress-ring" style={{"--progress": `${tasks.length ? done / tasks.length * 360 : 0}deg`} as React.CSSProperties}><span>{tasks.length ? Math.round(done/tasks.length*100) : 0}%</span></div><div><b>{done} de {tasks.length}</b><p>actividades entregadas</p></div></div>
      </section>

      <section className="summary">
        <article><span className="summary-icon lilac">◎</span><div><b>{tasks.filter(t=>t.status==="Pendiente").length}</b><p>Pendientes</p></div></article>
        <article><span className="summary-icon yellow">↗</span><div><b>{tasks.filter(t=>t.status==="En proceso").length}</b><p>En proceso</p></div></article>
        <article><span className="summary-icon green">✓</span><div><b>{done}</b><p>Entregadas</p></div></article>
        <article className="next"><span className="summary-icon blue">▣</span><div><b>{upcoming ? new Date(upcoming.due+"T12:00:00").toLocaleDateString("es-MX", {day:"numeric",month:"short"}) : "Sin fecha"}</b><p>{upcoming ? upcoming.title : "Agrega fechas de entrega"}</p></div></article>
      </section>

      <section className="workspace">
        <div className="toolbar"><div className="tabs">{(["Todas", ...statuses] as const).map(s => <button key={s} className={filter===s?"active":""} onClick={()=>setFilter(s)}>{s}{s==="Todas"?` · ${tasks.length}`:""}</button>)}</div><input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar actividad…" /></div>
        <div className="grid">
          {visible.map(task => <article className="task" key={task.id}>
            <button className="image-wrap" onClick={()=>setEditing(task)} aria-label={`Editar ${task.title}`}>{task.image ? <img src={task.image} alt={`Referencia: ${task.title}`} /> : <div className="empty-image">Sin referencia</div>}<span className={`kind ${task.kind.toLowerCase()}`}>{task.kind === "Video" ? "▶" : "▧"} {task.kind}</span></button>
            <div className="task-body"><div className="task-top"><select value={task.status} className={`status s-${task.status.replaceAll(" ","-").toLowerCase()}`} onChange={e=>saveTask({...task,status:e.target.value as Status})}>{statuses.map(s=><option key={s}>{s}</option>)}</select><span className={`date ${task.due && task.due < today && task.status!=="Entregado" ? "late":""}`}>{task.due ? new Date(task.due+"T12:00:00").toLocaleDateString("es-MX",{day:"numeric",month:"short"}) : "Sin fecha"}</span></div><h2>{task.title}</h2><p>{task.notes || "Sin indicaciones todavía."}</p><div className="card-actions"><button onClick={()=>setEditing(task)}>Editar</button>{task.link ? <a href={task.link} target="_blank">Abrir entrega ↗</a> : <span>Falta link final</span>}</div></div>
          </article>)}
        </div>
        {!visible.length && <div className="empty-state">No hay actividades con estos filtros.</div>}
      </section>

      <footer><div><b>Los cambios se guardan en este dispositivo.</b><p>Descarga el respaldo para guardarlo en Google Drive o subir el proyecto a GitHub.</p></div><div><input ref={fileRef} type="file" accept="application/json" hidden onChange={e=>importData(e.target.files?.[0])}/><button className="ghost" onClick={()=>fileRef.current?.click()}>Importar respaldo</button><button className="ghost" onClick={exportData}>Descargar JSON</button></div></footer>

      {editing && <div className="modal-backdrop" onMouseDown={()=>setEditing(null)}><form className="modal" onMouseDown={e=>e.stopPropagation()} onSubmit={e=>{e.preventDefault(); saveTask(editing)}}><div className="modal-head"><div><p className="eyebrow">ACTIVIDAD</p><h2>{tasks.some(t=>t.id===editing.id)?"Editar entrega":"Nueva entrega"}</h2></div><button type="button" className="close" onClick={()=>setEditing(null)}>×</button></div><label>Título<input required value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})}/></label><div className="form-row"><label>Tipo<select value={editing.kind} onChange={e=>setEditing({...editing,kind:e.target.value as Kind})}><option>Imagen</option><option>Video</option></select></label><label>Fecha de entrega<input type="date" value={editing.due} onChange={e=>setEditing({...editing,due:e.target.value})}/></label></div><label>Estado<select value={editing.status} onChange={e=>setEditing({...editing,status:e.target.value as Status})}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label>Link del archivo final<input type="url" placeholder="https://drive.google.com/…" value={editing.link} onChange={e=>setEditing({...editing,link:e.target.value})}/></label><label>Indicaciones<textarea rows={3} value={editing.notes} onChange={e=>setEditing({...editing,notes:e.target.value})}/></label><div className="modal-actions">{tasks.some(t=>t.id===editing.id)&&<button type="button" className="danger" onClick={()=>{if(confirm("¿Eliminar esta actividad?")){setTasks(tasks.filter(t=>t.id!==editing.id));setEditing(null)}}}>Eliminar</button>}<span/><button type="button" className="ghost" onClick={()=>setEditing(null)}>Cancelar</button><button className="primary">Guardar actividad</button></div></form></div>}
    </main>
  );
}
