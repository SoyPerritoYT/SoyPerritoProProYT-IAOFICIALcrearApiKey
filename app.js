const $=id=>document.getElementById(id);
let apiKey=localStorage.getItem("spyt_api_key")||"";
$("key").value=apiKey;

async function request(path,options={}){
  const r=await fetch(path,options);
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error||"Error del servidor");
  return d;
}

$("create").onclick=async()=>{
  const b=$("create");
  b.disabled=true;
  $("keyStatus").textContent="Creando clave...";
  try{
    const d=await request("/api/keys",{method:"POST"});
    apiKey=d.apiKey;
    localStorage.setItem("spyt_api_key",apiKey);
    $("key").value=apiKey;
    $("keyStatus").textContent="✅ API Key creada correctamente. Guárdala en un lugar seguro.";
  }catch(e){
    $("keyStatus").textContent="❌ "+e.message;
  }finally{
    b.disabled=false;
  }
};

$("copy").onclick=async()=>{
  if(!apiKey) return;
  $("key").select();
  await navigator.clipboard.writeText(apiKey);
  $("keyStatus").textContent="📋 API Key copiada.";
};
