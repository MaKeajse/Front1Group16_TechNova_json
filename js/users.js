// ====== CONFIG ======
const LS_USERS = 'TECHNOVA_USERS_V3';
const USERS_JSON = (location.pathname.includes('/pages/') ? '../' : '') + 'assets/data/users.json';

// ====== SEEDING DESDE JSON ======
async function ensureSeededUsers(){
  if (!localStorage.getItem(LS_USERS)) {
    const res = await fetch(USERS_JSON);
    if (!res.ok) throw new Error('No se pudo leer users.json');
    const data = await res.json();
    saveUsers(data);
  }
}

// ====== CRUD ======
function loadUsers(){
  try { 
    return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); 
  }
  catch { 
    return []; 
  }
}

function saveUsers(arr){
  localStorage.setItem(LS_USERS, JSON.stringify(arr));
}

function getUser(id){
  return loadUsers().find(u => String(u.id) === String(id));
}

function upsertUser(u){
  const arr = loadUsers();
  if (!u.id){
    u.id = arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
    arr.push(u);
  } else {
    const i = arr.findIndex(x => x.id === u.id);
    if (i >= 0) arr[i] = u; else arr.push(u);
  }
  saveUsers(arr);
  return u.id;
}

function deleteUser(id){
  saveUsers(loadUsers().filter(u => String(u.id) !== String(id)));
}

function findUserByEmail(email){
  const e = (email || '').trim().toLowerCase();
  return loadUsers().find(u => (u.email || '').toLowerCase() === e);
}



