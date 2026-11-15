'use strict';
function decode(v){if(typeof v!=='string'||v.length>1800000)return null;const m=/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(v);return m?{mime:'image/'+m[1],data:Buffer.from(m[2],'base64')}:null}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store, private');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'POST 전용 API입니다.'})}
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'AI 이미지 생성 키가 설정되지 않았습니다.'});
 const b=req.body||{},current=decode(b.current),ref=b.reference?decode(b.reference):null;
 if(!current||(b.reference&&!ref))return res.status(400).json({error:'유효한 현재 머리 사진이 필요합니다.'});
 const prompt='Generate a single realistic salon HAIRSTYLE PREVIEW from the FIRST uploaded photo, preserving the same person and facial features, expression, skin tone, lighting, pose and background. Modify only the hair. '+(ref?'The SECOND image provides only the desired hairstyle, never copy its face or identity. ':'')+'The desired haircut direction is '+String(b.summary||'').slice(0,350)+'; mood: '+String(b.mood||'').slice(0,100)+'; area requirements: '+JSON.stringify(b.hair||{}).slice(0,600)+'. Maintain plausibility. No text, watermark, collage, additional people. This is an illustration, not a guaranteed haircut outcome.';
 const form=new FormData();const append=(o,name)=>form.append('image[]',new Blob([o.data],{type:o.mime}),name);
 append(current,'current.jpg');if(ref)append(ref,'reference.jpg');
 form.append('model',process.env.OPENAI_IMAGE_MODEL||'gpt-image-1.5');form.append('prompt',prompt);form.append('size','1024x1024');form.append('quality','low');form.append('output_format','jpeg');form.append('output_compression','75');
 const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),75000);
 try{const r=await fetch('https://api.openai.com/v1/images/edits',{method:'POST',signal:ctl.signal,headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY},body:form});
 if(!r.ok){console.error('Image upstream:',r.status);return res.status(502).json({error:'AI 이미지 생성에 실패했습니다. 모델 권한과 API 설정을 확인해 주세요.'})}
 const j=await r.json(),image=j.data?.[0]?.b64_json;
 if(typeof image!=='string'||!image)return res.status(502).json({error:'AI 서버가 이미지를 반환하지 않았습니다.'});
 return res.status(200).json({image:'data:image/jpeg;base64,'+image})
 }catch(e){console.error('Image edit failed:',e.name);return res.status(e.name==='AbortError'?504:502).json({error:'AI 시각화를 완료하지 못했습니다.'})}finally{clearTimeout(t)}
};