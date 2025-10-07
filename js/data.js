// === Clave y seeding (ajusta si usas otra) ==============================
const LS_KEY = 'TECHNOVA_SERVICES_V4'; // sube versión para forzar refresco una vez
const SERVICES_JSON = (location.pathname.includes('/pages/') ? '../' : '') + 'assets/data/services.json';

// Carga inicial desde JSON si no hay storage
async function ensureSeededServices(){
  if (!localStorage.getItem(LS_KEY)) {
    const res = await fetch(SERVICES_JSON);
    const data = await res.json();
    saveServices(data);
  }
}

// === CRUD + normalización ===============================================
function loadServices(){
  let arr = [];
  try { arr = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch {}
  return normalizeServices(arr);
}

function saveServices(arr){ 
  localStorage.setItem(LS_KEY, JSON.stringify(arr)); 
}

function getService(id){ 
  return loadServices().find(s => String(s.id) === String(id)); 
}

function upsertService(svc){
  const arr = loadServices();
  if (!svc.id){ 
    svc.id = arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1; arr.push(svc); 
  }
  else { 
    const i = arr.findIndex(x=>x.id===svc.id); 
    if(i>=0) arr[i]=svc; else arr.push(svc); 
  }
  saveServices(arr); 
  return svc.id;
}

function deleteService(id){ 
  saveServices(loadServices().filter(s => String(s.id)!==String(id))); 
}

function formatMoney(n){ 
  return Number(n||0).toLocaleString('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}); 
}

// Completa iconos faltantes y guarda si corrige algo
const ICONS_BY_NAME = {
  'Desarrollo web':'desarrollo-web.png',
  'Apps Móviles':'apps-moviles.png',
  'Consultoría TI':'consultoria-ti.png',
  'Servicios Nube':'cloud.png',
  'IA':'ai.png',
  'Soporte Técnico':'headset.png',
  'E-Commerce':'shopping-cart.png',
  'UI/UX Design':'edit-tools.png',
  'IoT':'internet-of-things.png',
  'Desarrollo de APIs':'processing.png'
};

function normalizeServices(arr){
  let changed = false;
  for (const s of arr){
    if(!s.icon && ICONS_BY_NAME[s.nombre]){ s.icon = ICONS_BY_NAME[s.nombre]; changed = true; }
  }
  if (changed) saveServices(arr);
  return arr;
}

