'use strict';
// Offline, permission-gated aggregator. Never crawls a website or uploads raw reviews.
const fs=require('node:fs'),path=require('node:path');const {TOPICS}=require('../lib/review-guidance');
const filename=process.argv[2];if(!filename){console.error('node scripts/aggregate-licensed-reviews.js /private/reviews.jsonl');process.exit(2)}
const entries=fs.readFileSync(filename,'utf8').split(/\r?\n/).filter(Boolean);
const counts=Object.fromEntries(TOPICS.map(t=>[t.id,0]));let accepted=0,rejected=0;
for(const line of entries){
 let o;try{o=JSON.parse(line)}catch{rejected++;continue}
 const rights=o&&o.rights;
 const allowed=typeof o.text==='string'&&o.text.length>2&&o.text.length<=2500&&rights&&rights.author_release===true&&rights.ai_processing_allowed===true&&typeof rights.evidence==='string'&&rights.evidence.length>=4&&['direct_cutbridge_review','contracted_license'].includes(rights.basis);
 const platform=['naver','kakao'].includes(o?.platform);
 if(!allowed||(platform&&!(rights.basis==='contracted_license'&&typeof rights.platform_license_id==='string'&&rights.platform_license_id.length>3))){rejected++;continue}
 accepted++;
 for(const t of TOPICS){if(t.label.includes('앞머리')&&o.text.includes('앞머리')||t.label.includes('옆머리')&&o.text.includes('옆머리')||t.label.includes('숱')&&o.text.includes('숱')||t.label.includes('손질')&&o.text.includes('손질')||t.label.includes('사진')&&o.text.includes('사진')||t.label.includes('윗머리')&&o.text.includes('윗머리'))counts[t.id]++}
}
const topics=Object.entries(counts).filter(([id,c])=>c>=3).map(([id,count])=>({id,count}));const out={status:accepted>=3&&topics.length?'licensed_aggregate':'insufficient_authorized_data',reviewCount:accepted,topics,note:'Only authorized aggregate category counts. Never commit source photos, author identities or raw review text.'};
const dest=path.resolve(__dirname,'../data/authorized-review-profile.json');fs.writeFileSync(dest,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({accepted,rejected,topics:topics.length,destination:dest}));
