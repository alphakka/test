'use strict';
// CutBridge v0.5 security fence: previous AI photo APIs are disabled.
// This preview does not collect or transmit customer photos.
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Allow','GET');
 return res.status(410).json({error:'이전 AI 상담 API는 개인정보 보호 검토 전까지 비활성화되었습니다.',code:'PHOTO_PROCESSING_DISABLED'});
};
