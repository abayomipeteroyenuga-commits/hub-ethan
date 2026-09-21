import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const origin='https://kids.ethandigitalacademy.org';
const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store','Content-Type':'application/json'};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const admin=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});
Deno.serve(async(req)=>{if(req.method==='OPTIONS')return new Response(null,{headers});if(req.method!=='POST')return json({error:'Method not allowed'},405);
try{const body=await req.json();if(body.action==='verify'){const token=(req.headers.get('Authorization')||'').replace(/^Bearer /,'');const client=createClient(url,anon);const {data:{user},error}=await client.auth.getUser(token);if(error||!user)return json({allowed:false},401);const {data:role}=await admin.from('ethan_kids_adults').select('user_id').eq('user_id',user.id).eq('enabled',true).maybeSingle();return json({allowed:!!role},role?200:403);}
if(body.action==='create'){
 const access=(req.headers.get('Authorization')||'').replace(/^Bearer /,'');if(!access)return json({error:'Sign in first'},401);
 const client=createClient(url,anon);const {data:{user},error}=await client.auth.getUser(access);if(error||!user||!user.email_confirmed_at)return json({error:'Confirmed Ethan ID required'},401);
 if(body.target!=='kids')return json({error:'Invalid destination'},400);
 const {data:role,error:roleError}=await admin.from('ethan_kids_adults').select('user_id').eq('user_id',user.id).eq('enabled',true).maybeSingle();
 if(roleError||!role)return json({error:'Adult access has not been approved for this Ethan ID'},403);
 const refresh=body.refresh_token;if(typeof refresh!=='string'||refresh.length<10)return json({error:'Session refresh required'},400);
 const ticket=crypto.randomUUID()+crypto.randomUUID();const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ticket)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const {error:insertError}=await admin.from('ethan_kids_handoffs').insert({ticket_hash:hash,user_id:user.id,refresh_token:refresh,expires_at:new Date(Date.now()+45000).toISOString()});if(insertError)throw Error('Could not create handoff');
 return json({ticket,expires_in:45});}
 if(body.action==='exchange'){
 if(req.headers.get('Origin')!==origin)return json({error:'Invalid origin'},403);
 const ticket=body.ticket;if(typeof ticket!=='string'||!/^[0-9a-f-]{72}$/.test(ticket))return json({error:'Invalid handoff'},400);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ticket)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const {data,error}=await admin.rpc('redeem_ethan_kids_handoff',{p_hash:hash});if(error||!data?.length)return json({error:'Handoff expired or already used'},401);
 const row=data[0];const {data:role}=await admin.from('ethan_kids_adults').select('user_id').eq('user_id',row.user_id).eq('enabled',true).maybeSingle();if(!role)return json({error:'Adult access not approved'},403);
 const {data:session,error:sessionError}=await admin.auth.refreshSession({refresh_token:row.refresh_token});if(sessionError||!session.session||session.user?.id!==row.user_id)return json({error:'Session expired; sign in again'},401);
 return json({access_token:session.session.access_token,refresh_token:session.session.refresh_token});}
 return json({error:'Unsupported action'},400);
 }catch(_e){return json({error:'Handoff unavailable. Try signing in again.'},500);}});
