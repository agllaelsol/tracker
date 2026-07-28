"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "Pendiente" | "En proceso" | "En revisión" | "Entregado";
type Kind = "Imagen" | "Video";
type Assignee = "Marco" | "Ari";
type Folder = "Koollege" | "Online";
type Task = { id: number; code?: string; title: string; kind: Kind; due: string; status: Status; link: string; image?: string; notes: string; assignee: Assignee; paused: boolean; pauseReason: string; folder?: Folder | ""; characterNotes?: string };

const seed: Task[] = [
  { id: 1, title: "Personaje con reporte de métricas", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-01.png", notes: "Ilustración 3D, fondo blanco y acentos azules.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 2, title: "Personaje con tablet y analítica", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-02.png", notes: "Incluir elementos flotantes y tarjetas de datos.", assignee: "Ari", paused: false, pauseReason: "" },
  { id: 3, title: "Escena de trabajo en escritorio", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-03.png", notes: "Escena 3D lila, formato horizontal.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 4, title: "Cohete de lanzamiento digital", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-04.png", notes: "Acabado cristal, paleta azul y violeta.", assignee: "Ari", paused: false, pauseReason: "" },
  { id: 5, title: "Visual tecnológico abstracto", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-05.png", notes: "Composición horizontal con partículas y profundidad.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 6, title: "Calendario 3D", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-06.png", notes: "Calendario de escritorio, estilo limpio.", assignee: "Ari", paused: false, pauseReason: "" },
  { id: 7, title: "Productividad y calendario", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-07.png", notes: "Escena isométrica coral y rosa.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 8, title: "Laptop creativa", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-08.png", notes: "Laptop blanca con elementos creativos.", assignee: "Ari", paused: false, pauseReason: "" },
  { id: 9, title: "Interfaz creativa 3D", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-09.png", notes: "Manos interactuando con una interfaz.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 10, title: "Dashboard de integraciones", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-10.png", notes: "Panel de métricas con manos y módulos.", assignee: "Ari", paused: false, pauseReason: "" },
  { id: 11, title: "Escena interior azul", kind: "Video", due: "", status: "Pendiente", link: "", image: "/referencias/ref-11.png", notes: "Animación de iluminación en ambiente interior.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1011, title: "Video 11 · El Mapa del Conocimiento", kind: "Video", due: "", status: "Entregado", link: "", notes: "Mapa holográfico con rutas a módulos Koollege. Vertical 1080×1920 · 30 s máx.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1012, title: "Video 12 · Organiza tus pestañas", kind: "Video", due: "", status: "Entregado", link: "", notes: "Ventanas flotantes se organizan dentro de la plataforma Koollege. Vertical 1080×1920 · 30 s máx.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1013, title: "Video 13 · Aula Infinita", kind: "Video", due: "", status: "Pendiente", link: "", notes: "El cuarto desaparece y se expande hacia un universo de aprendizaje. Vertical 1080×1920 · 15 s.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1014, title: "Video 14 · Nivel Desbloqueado", kind: "Video", due: "", status: "Pendiente", link: "", notes: "Recorrido digital con módulos y barra de progreso hasta 100%. Vertical 1080×1920 · 20 s máx.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1015, title: "Video 15 · Pausa Inteligente", kind: "Video", due: "", status: "Pendiente", link: "", notes: "Las pantallas se detienen para dar paso a un descanso consciente. Vertical 1080×1920 · 45 s máx.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1016, title: "Video 16 · Video Conferencia", kind: "Video", due: "", status: "Pendiente", link: "", notes: "Tres personas se conectan y forman una sala holográfica compartida. Vertical 1080×1920 · 45 s máx.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1017, title: "Video 17 · Montaña de papeles", kind: "Video", due: "", status: "Pendiente", link: "", notes: "Un profesor digitaliza una enorme montaña de documentos con Koollege. Vertical 1080×1920 · 30 s.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1018, title: "Video 18 · Detox Koollege", kind: "Video", due: "", status: "Pendiente", link: "", notes: "El personaje sale de un celular gigante hacia un entorno natural. Vertical 1080×1920 · 45 s máx.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1019, title: "Video 19 · Pago invisible", kind: "Video", due: "", status: "Pendiente", link: "", notes: "Un padre realiza un pago simple y recibe confirmación holográfica. Vertical 1080×1920 · 30 s.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1020, title: "Video 20 · Modo Concentración", kind: "Video", due: "", status: "Pendiente", link: "", notes: "Las distracciones desaparecen al activar el modo concentración. Vertical 1080×1920 · 30 s.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1021, title: "Diseño de interfaz online", kind: "Imagen", due: "", status: "Pendiente", link: "", notes: "Diseño y preparación de la interfaz para su versión online.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1022, title: "Persona con celular en sala", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-12.jpeg", notes: "Referencia 3D de persona usando el celular junto a mobiliario azul.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1023, title: "Personas y mascota en plataforma", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-13.jpeg", notes: "Referencia 3D de grupo de personas y mascota sobre plataforma circular.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1024, title: "Personajes sobre interfaz interactiva", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-14.jpeg", notes: "Referencia 3D de dos personajes interactuando con elementos de interfaz luminosos.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1025, title: "Terminal de pago digital", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-15.jpeg", notes: "Referencia 3D de terminal de pago con tarjeta y comprobante.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1026, title: "Composición educativa digital", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-16.jpeg", notes: "Referencia gráfica educativa con perfil, búsqueda, libros y elementos escolares.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1027, title: "Lanzamiento y métricas", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-17.jpeg", notes: "Referencia 3D de cohete y paneles de crecimiento.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1028, title: "Estrategia de lanzamiento", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-18.jpeg", notes: "Ilustración lineal de cohete, gráfica y objetivos.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1029, title: "Sala de juntas isométrica", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-19.jpeg", notes: "Referencia isométrica de sala de reuniones corporativa.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1030, title: "Atención y soporte en línea", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-20.jpeg", notes: "Persona atendiendo mensajes desde una laptop.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1031, title: "Configuración de analítica", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-21.jpeg", notes: "Ilustración de panel, engranes y gráfica de datos.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1032, title: "Verificación móvil", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-22.jpeg", notes: "Teléfono con confirmación y tarjeta digital.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1033, title: "Gráfica circular 3D", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-23.jpeg", notes: "Gráfica circular por segmentos en colores.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1034, title: "Contrato y firma digital", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-24.jpeg", notes: "Documento firmado con acceso y verificación digital.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1035, title: "Portal de pagos bancarios", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-25.jpeg", notes: "Interfaz bancaria con tarjeta y comprobante.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1036, title: "Indicadores de crecimiento", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-26.jpeg", notes: "Flecha ascendente con porcentaje y gráficas.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1037, title: "Cálculo y resultados financieros", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-27.jpeg", notes: "Calculadora, gráfica y monedas en composición 3D.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1038, title: "Mercado de activos digitales", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-28.jpeg", notes: "Monedas digitales sobre una pista de mercado.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1039, title: "Finanzas móviles seguras", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-29.jpeg", notes: "Aplicación financiera móvil con seguridad y nube.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1040, title: "Consulta virtual", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-30.jpeg", notes: "Comparación de personajes en una experiencia virtual.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1041, title: "Herramientas de diseño creativo", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-31.jpeg", notes: "Interfaz creativa con paletas, cámara y herramientas.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1042, title: "Experiencia social móvil", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-32.jpeg", notes: "Personaje usando celular dentro de una interfaz luminosa.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1043, title: "Reconocimientos y posiciones", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-33.jpeg", notes: "Medallas de primer, segundo y tercer lugar.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1044, title: "Organización de plataforma web", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-34.jpeg", notes: "Persona organizando módulos y archivos de un sitio.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1045, title: "Comunicación desde tablet", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-35.jpeg", notes: "Personaje con tablet y mensajes flotantes.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1046, title: "Equipo global conectado", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-36.jpeg", notes: "Personas colaborando alrededor del mundo.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1047, title: "Agente de soporte digital", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-37.jpeg", notes: "Personaje con audífonos atendiendo desde laptop.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1048, title: "Espacio de trabajo isométrico", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-38.jpeg", notes: "Oficina 3D con escritorio, computadora y librero.", assignee: "Marco", paused: false, pauseReason: "" },
  { id: 1049, title: "Certificación completada", kind: "Imagen", due: "", status: "Pendiente", link: "", image: "/referencias/ref-39.jpeg", notes: "Sello de aprobación con documentos y diploma.", assignee: "Marco", paused: false, pauseReason: "" },
];

const statuses: Status[] = ["Pendiente", "En proceso", "En revisión", "Entregado"];
const today = new Date().toISOString().slice(0, 10);

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(seed);
  const [filter, setFilter] = useState<"Todas" | Status>("Todas");
  const [viewer, setViewer] = useState<Assignee>("Marco");
  const [folderFilter, setFolderFilter] = useState<"Todas" | Folder | "Sin asignar">("Todas");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [draft, setDraft] = useState({ code: "", title: "", assignee: "Marco" as Assignee, kind: "Imagen" as Kind, folder: "" as Folder | "", due: "", image: "", notes: "", characterNotes: "" });

  useEffect(() => {
    const requestedViewer = new URLSearchParams(window.location.search).get("persona");
    const requestedMode = new URLSearchParams(window.location.search).get("modo");
    setViewer(requestedViewer?.toLowerCase() === "ari" ? "Ari" : "Marco");
    setIsAdmin(requestedMode === "admin");
    const saved = localStorage.getItem("marco-tracker-v1");
    if (saved) try {
      const parsed = JSON.parse(saved) as Partial<Task>[];
      const deletedIds = JSON.parse(localStorage.getItem("marco-tracker-deleted-v1") ?? "[]") as number[];
      const savedById = new Map(parsed.map(task => [task.id, task]));
      const restoredSeed = seed.filter(task => !deletedIds.includes(task.id)).map(task => {
        const savedTask = savedById.get(task.id);
        return {
          ...task,
          ...savedTask,
          kind: task.id === 5 ? "Imagen" : savedTask?.kind ?? task.kind,
          assignee: savedTask?.assignee === "Ari" || savedTask?.assignee === "Marco" ? savedTask.assignee : task.assignee,
          paused: false,
          pauseReason: "",
        };
      });
      const seedIds = new Set(seed.map(task => task.id));
      const addedTasks = parsed.filter(task => task.id && !deletedIds.includes(task.id) && !seedIds.has(task.id) && task.title && task.assignee).map(task => task as Task);
      setTasks([...restoredSeed, ...addedTasks]);
    } catch { /* keep starter data */ }
    setReady(true);
  }, []);

  useEffect(() => { if (ready) try { localStorage.setItem("marco-tracker-v1", JSON.stringify(tasks)); } catch { window.alert("La imagen es demasiado pesada. Intenta con una imagen más pequeña."); } }, [tasks, ready]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setPreview(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const ownTasks = useMemo(() => tasks.filter(t => t.assignee === viewer), [tasks, viewer]);
  const visible = useMemo(() => ownTasks.filter(t => (filter === "Todas" || t.status === filter) && (folderFilter === "Todas" || (folderFilter === "Sin asignar" ? !t.folder : t.folder === folderFilter)) && t.title.toLowerCase().includes(query.toLowerCase())).sort((a, b) => !a.due && !b.due ? a.id - b.id : !a.due ? 1 : !b.due ? -1 : a.due.localeCompare(b.due)), [ownTasks, filter, folderFilter, query]);
  const done = ownTasks.filter(t => t.status === "Entregado").length;
  const upcoming = ownTasks.filter(t => t.due && t.due >= today && t.status !== "Entregado").sort((a,b) => a.due.localeCompare(b.due))[0];

  function changeDate(id: number, due: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, due } : task));
  }
  function deleteTask(task: Task) {
    if (!window.confirm(`¿Eliminar ${taskCode(task)} ${task.title}? Esta acción no se puede deshacer.`)) return;
    const deletedIds = JSON.parse(localStorage.getItem("marco-tracker-deleted-v1") ?? "[]") as number[];
    localStorage.setItem("marco-tracker-deleted-v1", JSON.stringify([...new Set([...deletedIds, task.id])]));
    setTasks(current => current.filter(item => item.id !== task.id));
  }
  function changeTitle(id: number, title: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, title } : task));
  }
  function changeCode(id: number, code: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, code: code.toUpperCase() } : task));
  }
  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const newTask: Task = { id: Date.now(), code: draft.code.trim().toUpperCase() || undefined, title: draft.title.trim(), assignee: draft.assignee, kind: draft.kind, folder: draft.folder, due: draft.due, image: draft.image.trim() || undefined, notes: draft.notes.trim(), characterNotes: draft.characterNotes.trim(), status: "Pendiente", link: "", paused: false, pauseReason: "" };
    setTasks(current => [...current, newTask]);
    setDraft({ code: "", title: "", assignee: "Marco", kind: "Imagen", folder: "", due: "", image: "", notes: "", characterNotes: "" });
    setShowNewTask(false);
    setViewer(newTask.assignee);
  }
  function loadReferenceImage(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 1200;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        setDraft(current => ({ ...current, image: canvas.toDataURL("image/jpeg", 0.8) }));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }
  function changeLink(id: number, link: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, link, status: link.trim() ? "Entregado" : "Pendiente" } : task));
  }
  function changeFolder(id: number, folder: Folder | "") {
    setTasks(current => current.map(task => task.id === id ? { ...task, folder } : task));
  }
  function changeCharacterNotes(id: number, characterNotes: string) {
    setTasks(current => current.map(task => task.id === id ? { ...task, characterNotes } : task));
  }
  function changeKind(id: number, kind: Kind) {
    setTasks(current => current.map(task => task.id === id ? { ...task, kind } : task));
  }
  function togglePause(task: Task) {
    if (task.paused) {
      setTasks(current => current.map(item => item.id === task.id ? { ...item, paused: false, pauseReason: "" } : item));
      return;
    }
    const reason = window.prompt("¿Qué actividad tiene prioridad sobre esta?", "");
    if (reason === null) return;
    setTasks(current => current.map(item => item.id === task.id ? { ...item, paused: true, pauseReason: reason.trim() || "Otra actividad prioritaria" } : item));
  }
  function taskCode(task: Task): string {
    if (task.code?.trim()) return task.code.trim().toUpperCase();
    const sameFolder = tasks.filter(item => item.assignee === task.assignee && (item.folder ?? "") === (task.folder ?? ""));
    const position = sameFolder.findIndex(item => item.id === task.id) + 1;
    const prefix = task.folder === "Koollege" ? "KOO" : task.folder === "Online" ? "ONL" : "SCA";
    return `${prefix}-${String(position).padStart(2, "0")}`;
  }
  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="logo">M+A</span><div><strong>Marco y Ari</strong><small>Tracker creativo</small></div></div>
        {isAdmin && <button className="primary" onClick={()=>setShowNewTask(true)}>+ Nueva actividad</button>}
      </header>

      <nav className="people-tabs" aria-label="Personas del tracker">
        {(["Marco", "Ari"] as Assignee[]).map(person => <button key={person} className={viewer === person ? "active" : "locked"} disabled={viewer !== person}><span>{person}</span><small>{viewer === person ? "Tu pestaña" : "🔒 Pestaña privada"}</small></button>)}
      </nav>

      <section className="hero progress-only">
        <div className="progress-card"><b>{done} de {ownTasks.length} entregadas</b><span>{ownTasks.length ? Math.round(done/ownTasks.length*100) : 0}%</span></div>
      </section>

      <section className="summary">
        <article><b>{ownTasks.filter(t=>t.status==="Pendiente").length}</b><p>Pendientes</p></article>
        <article><b>{ownTasks.filter(t=>t.status==="En proceso").length}</b><p>En proceso</p></article>
        <article><b>{upcoming ? new Date(upcoming.due+"T12:00:00").toLocaleDateString("es-MX", {day:"numeric",month:"short"}) : "Sin fecha"}</b><p>Próxima entrega</p></article>
      </section>

      <section className="workspace">
        <div className="toolbar"><div className="tabs">{(["Todas", ...statuses] as const).map(s => <button key={s} className={filter===s?"active":""} onClick={()=>setFilter(s)}>{s}{s==="Todas"?` · ${ownTasks.length}`:""}</button>)}</div><div className="toolbar-right"><select className="folder-filter" value={folderFilter} onChange={e=>setFolderFilter(e.target.value as "Todas" | Folder | "Sin asignar")} aria-label="Filtrar por carpeta"><option>Todas</option><option>Koollege</option><option>Online</option><option>Sin asignar</option></select><input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar actividad…" /></div></div>
        <div className="grid">
          {visible.map(task => <article className={`task ${task.paused ? "is-paused" : ""}`} key={task.id}>
            <button type="button" className={`image-wrap ${task.image ? "can-zoom" : ""}`} onClick={()=>task.image && setPreview({src:task.image,title:task.title})} aria-label={task.image ? `Ampliar referencia de ${task.title}` : undefined}>{task.image ? <img src={task.image} alt={`Referencia: ${task.title}`} /> : task.kind === "Video" ? <div className="video-placeholder" aria-label="Referencia de video"><span>▶</span><small>VIDEO</small></div> : <div className="empty-image">Sin referencia</div>}<span className={`kind ${task.kind.toLowerCase()}`}>{task.kind === "Video" ? "▶" : "▧"} {task.kind}</span>{task.image && <span className="zoom-hint">⌕ Ver grande</span>}</button>
            {isAdmin && <button type="button" className="delete-task" onClick={()=>deleteTask(task)}>Eliminar</button>}
            <div className="task-body"><div className="task-top"><div className="task-labels"><span className={`status ${task.paused ? "s-pausada" : `s-${task.status.replaceAll(" ","-").toLowerCase()}`}`}>{task.paused ? "Pausada" : task.status}</span><span className={`assignee a-${task.assignee.toLowerCase()}`}>{task.assignee}</span>{isAdmin && <select className={`type-select t-${task.kind.toLowerCase()}`} value={task.kind} onChange={e=>changeKind(task.id,e.target.value as Kind)} aria-label={`Tipo de ${task.title}`}><option>Imagen</option><option>Video</option></select>}{isAdmin ? <select className={`folder-badge ${task.folder ? `f-${task.folder.toLowerCase()}` : ""}`} value={task.folder ?? ""} onChange={e=>changeFolder(task.id,e.target.value as Folder | "")} aria-label={`Carpeta de ${task.title}`}><option value="">Carpeta por asignar</option><option value="Koollege">Carpeta Koollege</option><option value="Online">Carpeta Online</option></select> : <span className={`folder-badge ${task.folder ? `f-${task.folder.toLowerCase()}` : ""}`}>{task.folder ? `Carpeta ${task.folder}` : "Carpeta por asignar"}</span>}</div><label className={`date-editor ${task.due && task.due < today && task.status!=="Entregado" ? "late":""}`}><span>Fecha de entrega</span><input aria-label={`Fecha de entrega de ${task.title}`} type="date" value={task.due} onChange={e=>changeDate(task.id,e.target.value)} /></label></div>{isAdmin ? <label className="title-editor"><input className="code-input" aria-label={`Código de ${task.title}`} value={task.code ?? taskCode(task)} onChange={e=>changeCode(task.id,e.target.value)} /><input aria-label={`Nombre de ${taskCode(task)}`} value={task.title} onChange={e=>changeTitle(task.id,e.target.value)} /></label> : <h2><span className="task-code">{taskCode(task)}</span>{task.title}</h2>}<p>{task.paused ? `En pausa por: ${task.pauseReason}` : task.notes || "Sin indicaciones todavía."}</p><label className="character-notes" htmlFor={`characters-${task.id}`}><span>Personajes / notas de trabajo</span><textarea id={`characters-${task.id}`} rows={2} placeholder="Ej. personaje hombre con playera azul…" value={task.characterNotes ?? ""} onChange={e=>changeCharacterNotes(task.id,e.target.value)} /></label><div className="material-link"><label htmlFor={`link-${task.id}`}>Link del material</label><div><input id={`link-${task.id}`} type="url" placeholder="Pega aquí el enlace de Drive…" value={task.link} onChange={e=>changeLink(task.id,e.target.value)} />{task.link && <a href={task.link} target="_blank" aria-label={`Abrir material de ${task.title}`}>↗</a>}</div></div><div className="card-actions"><button className={task.paused ? "resume" : "pause"} onClick={()=>togglePause(task)}>{task.paused ? "▶ Reanudar actividad" : "Ⅱ Pausar esta actividad"}</button><span>{task.link ? "✓ Entregado automáticamente" : "Falta material"}</span></div></div>
          </article>)}
        </div>
        {!visible.length && <div className="empty-state">No hay actividades con estos filtros.</div>}
      </section>

      {showNewTask && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Nueva actividad"><form className="modal new-task-form" onSubmit={addTask}><div className="modal-head"><div><p className="eyebrow">ASIGNAR TAREA</p><h2>Nueva actividad</h2></div><button type="button" className="close" onClick={()=>setShowNewTask(false)} aria-label="Cerrar">×</button></div><div className="form-row"><label>Código<input value={draft.code} onChange={e=>setDraft({...draft,code:e.target.value.toUpperCase()})} placeholder="Ej. KOO-01" /></label><label>Nombre de la actividad<input required value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="Ej. Diseño de inicio" /></label></div><div className="form-row"><label>Responsable<select value={draft.assignee} onChange={e=>setDraft({...draft,assignee:e.target.value as Assignee})}><option>Marco</option><option>Ari</option></select></label><label>Tipo<select value={draft.kind} onChange={e=>setDraft({...draft,kind:e.target.value as Kind})}><option>Imagen</option><option>Video</option></select></label></div><div className="form-row"><label>Carpeta<select value={draft.folder} onChange={e=>setDraft({...draft,folder:e.target.value as Folder | ""})}><option value="">Por asignar</option><option value="Koollege">Carpeta Koollege</option><option value="Online">Carpeta Online</option></select></label><label>Fecha de entrega<input type="date" value={draft.due} onChange={e=>setDraft({...draft,due:e.target.value})} /></label></div><label>Cargar imagen de referencia<input type="file" accept="image/*" onChange={e=>loadReferenceImage(e.target.files?.[0])} /><span className="image-upload-note">Selecciona una imagen de tu computadora.</span></label>{draft.image && <img className="draft-image" src={draft.image} alt="Vista previa de la referencia" />}<label>Instrucciones<textarea rows={3} value={draft.notes} onChange={e=>setDraft({...draft,notes:e.target.value})} placeholder="Describe lo que deben entregar…" /></label><label>Personajes / notas de trabajo<textarea rows={2} value={draft.characterNotes} onChange={e=>setDraft({...draft,characterNotes:e.target.value})} placeholder="Personajes, ropa, colores o indicaciones…" /></label><div className="new-task-actions"><button type="button" className="ghost" onClick={()=>setShowNewTask(false)}>Cancelar</button><button type="submit" className="primary">Asignar actividad</button></div></form></div>}

      {preview && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Vista ampliada de ${preview.title}`} onMouseDown={()=>setPreview(null)}><div className="lightbox-content" onMouseDown={event=>event.stopPropagation()}><button className="lightbox-close" onClick={()=>setPreview(null)} aria-label="Cerrar imagen">×</button><img src={preview.src} alt={`Referencia ampliada: ${preview.title}`} /><p>{preview.title}</p></div></div>}

    </main>
  );
}
