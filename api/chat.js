import crypto from "node:crypto";
const CREATOR="SoyPerritoProProYT";
function validKey(key,secret){
  if(typeof key!=="string"||!key.startsWith("spyt_live_"))return false;
  const raw=key.slice("spyt_live_"); const i=raw.lastIndexOf(".");
  if(i<1)return false; const id=raw.slice(0,i),sig=raw.slice(i+1);
  const expected=crypto.createHmac("sha256",secret).update(id).digest("base64url");
  return sig.length===expected.length&&crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected));
}
export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Método no permitido"});
  const secret=process.env.SPYT_API_SECRET;
  if(!secret)return res.status(500).json({error:"Falta SPYT_API_SECRET en las variables de entorno."});
  const auth=req.headers.authorization||"";
  const key=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!validKey(key,secret))return res.status(401).json({error:"API Key inválida."});
  const message=String(req.body?.message||"").trim();
  if(!message)return res.status(400).json({error:"Falta message."});
  if(/qu[ií]en.*(tu|es).*creador|creador.*(eres|tu)/i.test(message))
    return res.status(200).json({response:`Mi creador es ${CREATOR} 🐶🔥`});
  const upstream=process.env.SPYT_AI_URL||"https://soyperritoproproyt-iaoficial.vercel.app/api/gemini";
  try{
    const r=await fetch(upstream,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})});
    const data=await r.json().catch(()=>({}));
    if(!r.ok) return res.status(502).json({error:data.error||"La IA principal no está disponible ahora mismo."});
    return res.status(200).json({response:data.response||data.message||data.text||"La IA no devolvió una respuesta."});
  }catch(e){return res.status(502).json({error:"No se pudo conectar con SoyPerritoProProYT-IAOFICIAL."});}
}