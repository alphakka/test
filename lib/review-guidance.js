'use strict';
// CutBridge salon communication heuristics. No third-party scraped reviews.
// Counts can only enter from a licensed, aggregate dataset, not raw review text.
const TOPICS=[
{id:'fringe_short',label:'앞머리가 너무 짧았어요',question:'앞머리 길이는 눈썹 기준으로 어디까지 남길까요?',options:['눈썹을 살짝 덮게','눈썹 위도 괜찮아요'],advice:'커트 전 눈썹 기준 앞머리 목표 길이를 확인하세요.'},
{id:'sides_short',label:'옆머리를 너무 밀었어요',question:'귀가 얼마나 드러나는 길이를 원하시나요?',options:['귀를 조금 가리게','귀가 보여도 괜찮아요'],advice:'귀 노출 정도와 클리퍼 사용 범위를 먼저 합의하세요.'},
{id:'thinning',label:'숱을 너무 많이 쳤어요',question:'숱을 줄이는 정도를 어떻게 할까요?',options:['현재 무게감 유지','조금 가볍게'],advice:'숱을 많이 치는 시술은 복구하기 어려우므로 범위를 확인하세요.'},
{id:'maintenance',label:'손질하기 어려웠어요',question:'평소 스타일링에 얼마나 시간을 쓰시나요?',options:['거의 하지 않아요','5분 정도는 괜찮아요'],advice:'손질 부담을 줄일 수 있는 디자인인지 확인하세요.'},
{id:'reference_gap',label:'사진과 많이 달랐어요',question:'목표 사진에서 가장 중요한 부분은?',options:['앞머리·옆머리','전체적인 실루엣'],advice:'사진과 동일한 결과를 보장하지 말고 구현 가능한 부분을 확인하세요.'},
{id:'top_volume',label:'윗머리가 너무 납작했어요',question:'윗머리 볼륨을 어떻게 할까요?',options:['볼륨 유지','좀 더 차분하게'],advice:'윗머리의 목표 볼륨과 길이를 먼저 합의하세요.'}
];
const ids=new Set(TOPICS.map(x=>x.id));
function makeReviewGuidance(tags=[]){
 const chosen=Array.isArray(tags)?[...new Set(tags.filter(x=>typeof x==='string'&&ids.has(x)))].slice(0,3):[];
 const ordered=[...TOPICS].sort((a,b)=>Number(chosen.includes(b.id))-Number(chosen.includes(a.id)));
 return {mode:'curated_heuristics',notice:'네이버·카카오 플레이스의 고객 리뷰를 수집한 결과가 아닌, 수동 설계된 상담 규칙입니다.',checks:ordered.slice(0,3).map(x=>({...x,fromCustomer:chosen.includes(x.id)})),labels:chosen.map(id=>TOPICS.find(x=>x.id===id).label)};
}
module.exports={TOPICS,makeReviewGuidance};