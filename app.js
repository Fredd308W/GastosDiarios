// Importar módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -------- CONFIGURACIÓN DE FIREBASE --------
const firebaseConfig = {
  apiKey: "AIzaSyCEFYUkU5xy2QB4FhHLmWnV3jGvkeKaO8M",
  authDomain: "gastosdiarios-1c9b9.firebaseapp.com",
  projectId: "gastosdiarios-1c9b9",
  storageBucket: "gastosdiarios-1c9b9.firebasestorage.app",
  messagingSenderId: "1048929925714",
  appId: "1:1048929925714:web:53ed0886ea0b7dfe7bbd8b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------- GUARDAR GASTO CON ID CONSECUTIVO --------
document.getElementById("formGasto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const descripcion = document.getElementById("descripcion").value;
  const tipo = document.getElementById("tipo").value;
  const monto = Number(document.getElementById("monto").value);
  const fecha = document.getElementById("fecha").value;

  // Obtener el número de registros actuales para asignar ID consecutivo
  const snapshot = await getDocs(collection(db, "gastos"));
  const idConsecutivo = snapshot.size + 1;

  await addDoc(collection(db, "gastos"), {
    id: idConsecutivo,
    descripcion,
    tipo,
    monto,
    fecha
  });

  alert("Gasto guardado correctamente");

  document.getElementById("formGasto").reset();
  cargarGastos();
});

// -------- MOSTRAR GASTOS EN LISTA CON ID --------
async function cargarGastos() {
  const lista = document.getElementById("listaGastos");
  lista.innerHTML = "";

  const q = query(collection(db, "gastos"), orderBy("id", "asc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const g = doc.data();
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    item.textContent = `${g.id}. ${g.fecha} - ${g.descripcion} (Q${g.monto})`;
    lista.appendChild(item);
  });
}

cargarGastos();
document.getElementById("exportarBtn").addEventListener("click", async () => {
  const q = query(collection(db, "gastos"));
  const querySnapshot = await getDocs(q);
  
  const datos = [];
  
  querySnapshot.forEach((doc) => {
    datos.push({ idFirebase: doc.id, ...doc.data() });
  });

  const json = JSON.stringify(datos, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gastos_export.json";
  a.click();
  URL.revokeObjectURL(url);

  alert("Exportación completada, se descargó gastos_export.json");
});