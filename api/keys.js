import crypto from "node:crypto";
export default function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Método no permitido"});
  const secret=process.env.SPYT_API_SECRET;
  if(!secret) return res.status(500).json({error:"Falta SPYT_API_SECRET en las variables de entorno."});
  const id=crypto.randomBytes(18).toString("base64url");
  const sig=crypto.createHmac("sha256",secret).update(id).digest("base64url");
  return res.status(200).json({apiKey:`spyt_live_${id}.${sig}`});
}