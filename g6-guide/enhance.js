(()=>{"use strict";
const $=s=>document.getElementById(s);
const id=Math.min(35,Math.max(1,Number(new URLSearchParams(location.search).get("lesson"))||1));
const all=window.G6_DEEP||{};
const blocks=all[id]||[];
const catalog=window.G6_CATALOG||[];
const info=catalog.find(x=>x.id===id)||{};
const root=$("sections");
if(!root||!blocks.length)return;
function e(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function a(label,url){const x=e("a","",label);x.href=url;x.target="_blank";x.rel="noopener noreferrer";return x}
const intro=e("div","deep-heading");intro.lang="he";intro.dir="rtl";intro.append(e("p","deep-eyebrow","תוכן לימודי נוסף · מסודר לפי נושאים"));
intro.append(e("h2","deep-main-title","מעמיקים בנושא"));
intro.append(e("p","deep-subtitle","הרחבות מפורטות לנושאי השיעור, דוגמאות שימוש ומגבלות חשובוֹת. המידע נכתב מחדש לפי תוכנית הלמידה, ואינו תמליל מדויק של השיחות הקודמות."));
root.append(intro);
const toc=$("tocLinks");
for(let i=0;i<blocks.length;i++){
 const it=blocks[i];
 const s=e("section","section deep-section");s.id="deep-"+(i+1);s.lang="he";s.dir="rtl";
 const num=(window.G6_CHAPTERS?.[id]?.sections?.length||0)+i+1;
 const h=Array.isArray(it)?it[0]:it.h;
 const p=Array.isArray(it)?it[1]:it.p;
 const bullet=Array.isArray(it)?it[2]:it.bullets;
 const notes=Array.isArray(it)?null:it.note;
 s.append(e("div","section-index","פרק "+String(num).padStart(2,"0")));
 s.append(e("h2","",num+". "+h));
 s.append(e("p","",p));
 const ul=e("ul","detail-bullets");
 if(Array.isArray(bullet))for(const b of bullet)ul.append(e("li","",b));s.append(ul);
 if(notes){const n=e("p","detail-note","חשוב: "+notes);s.append(n)}
 root.append(s);
 const l=e("a","",h);l.href="#"+s.id;toc?.append(l);
}
const context=e("aside","verified-context");context.lang="he";context.dir="rtl";
context.append(e("span","context-mark","● מקור ודאות"));
context.append(e("h2","","מה מאומת ומה דורש בדיקה ברכב"));
const ul=e("ul");
for(const t of [
"נתוני אבזור, סוללה, הספקי AC/DC ויכולת תוכנה תלויים בגרסת Core+ המסוימת, שנת הייצור ומערכת XOS.",
"הסברים עקרוניים, חישובים ותרחישי שימוש הם כלי למידה; אינם הוראת הפעלה או הבטחה לטווח ולטעינה.",
"בדגם הישראלי החדש מומלץ להעדיף את מפרט היבואן ואת ספר הרכב המתאים על פני סרטון של דגם 2024 או שוק זר."
])ul.append(e("li","",t));context.append(ul);
root.append(context);
function panel(title,desc){const sec=e("section","tool-panel");sec.lang="he";sec.dir="rtl";sec.append(e("h2","",title));sec.append(e("p","tool-description",desc));root.append(sec);return sec}
function field(form,label,value,unit,min,max,step){const div=e("label","tool-field");const name=e("span","",label);div.append(name);const input=e("input");input.type="number";input.inputMode="decimal";input.min=min;input.max=max;input.step=step||"any";input.value=String(value);input.setAttribute("aria-label",label);div.append(input,e("small","",unit));form.append(div);return input}
if([6,12,17,34].includes(id)){
 const sec=panel("מחשבון טעינה ועלות","מחשבון מקומי להמחשה: הנתונים נשארים בדפדפן ואינם נשלחים לאתר או לספק חשמל. השתמשו בתעריף האמיתי שלכם כדי לקבל הערכה.");
 const form=e("div","tool-grid");
 const km=field(form,"מרחק נסיעה",100,"ק״מ",1,3000,1);
 const cons=field(form,"צריכת אנרגיה",18,"קוט״ש ל־100 ק״מ",5,70,.1);
 const price=field(form,"תעריף חשמל",.55,"₪ לקוט״ש",0,10,.01);
 const eff=field(form,"יעילות טעינה משוערת",90,"%",50,100,1);
 const output=e("output","tool-output");output.setAttribute("aria-live","polite");
 function calc(){let values=[km,cons,price,eff].map(x=>Number(x.value));if(values.some(v=>!Number.isFinite(v)||v<0)||values[3]<=0||values[3]>100){output.textContent="נא להזין ערכים תקינים.";return}
 const road=values[0]*values[1]/100,wall=road/(values[3]/100),cost=wall*values[2];
 output.textContent="אנרגיה לנסיעה: "+road.toFixed(1)+" קוט״ש · אנרגיה מהקיר: "+wall.toFixed(1)+" קוט״ש · עלות משוערת: ₪"+cost.toFixed(2)+".";
 }form.addEventListener("input",calc);sec.append(form,output);calc();
 sec.append(e("p","tool-fineprint","הדוגמה מניחה צריכת נסיעה ממוצעת ואחוז יעילות קבוע. החשבון בפועל, ההפסדים ותנאי ספק החשמל עשויים להיות שונים."));
}
if([2,17,18,35].includes(id)){
 const sec=panel("מחשבון טווח עיוני","חישוב לצורכי הבנה בלבד, לא לשימוש כהנחיית הגעה. הקיבולת הזמינה משתנה בין גרסאות, ואין לנהוג עד רזרבה מינימלית.");
 const form=e("div","tool-grid");
 const energy=field(form,"אנרגיה זמינה לחישוב",70,"קוט״ש",10,150,.5);
 const cons=field(form,"צריכה צפויה",20,"קוט״ש ל־100 ק״מ",5,70,.5);
 const reserve=field(form,"רזרבה",15,"%",0,50,1);
 const output=e("output","tool-output");output.setAttribute("aria-live","polite");
 function calc(){const v=[energy,cons,reserve].map(x=>Number(x.value));if(v.some(x=>!Number.isFinite(x))||v[1]<=0||v[2]<0||v[2]>=100){output.textContent="נא להזין ערכים תקינים.";return}const range=v[0]*(1-v[2]/100)/v[1]*100;output.textContent="טווח חישובי עם רזרבה: כ־"+range.toFixed(0)+" ק״מ. בפועל ייתכנו פערים משמעותיים.";}
 form.addEventListener("input",calc);sec.append(form,output);calc();
 sec.append(e("p","tool-fineprint","הנתונים אינם קוראים את הסוללה; אין כאן חיבור לרכב, למזג אוויר או למפת הדרך."));
}
const visual=panel("מפה חזותית של הנושא","המחשות מקוריות שנוצרו במיוחד למדריך. הן מציגות עקרונות ולא צילומי מסך של XOS.");
const cards=e("div","diagram-grid");
const diagrams={
 6:[["01","עמדת GNRGY","עד 22kW לפי דגם העמדה"],["02","המטען ברכב","AC עד 11kW לפי מפרט היבואן"],["03","BMS","ויסות הספק וחום"],["04","סוללה","הוספת אנרגיה בפועל"]],
 17:[["01","תחנת DC","הספק זמין ומגבלות זרם"],["02","מערכת רכב","מתח, טמפרטורה ו־BMS"],["03","שיא טעינה","לרגע ובתנאים מסוימים"],["04","עקומת טעינה","ההספק משתנה לאורך הזמן"]],
 4:[["01","חשבון XPENG","זהות ושירותי רכב"],["02","Bluetooth","שמע ושיחות"],["03","CarPlay","אפליקציות נבחרות"],["04","מפתח רכב","הרשאות עצמאיות, אם נתמך"]],
 28:[["01","ACC","מהירות ומרחק"],["02","LCC","מרכז נתיב"],["03","חיישנים","מוגבלים בתנאי ראות"],["04","הנהג","אחראי בכל רגע"]],
 34:[["01","ק״מ","מרחק בפועל"],["02","kWh/100","צריכת הרכב"],["03","kWh מהעמדה","חשמל שנרכש"],["04","₪ לק״מ","עלות בפועל"]]
};
const d=diagrams[id]||[["01","להכיר","מה הפעולה עושה"],["02","להבין","באילו תנאים היא פועלת"],["03","להבחין","מה היא לא מבטיחה"],["04","לפעול בבטחה","לפי הוראות הרכב"]];
for(const cell of d){const c=e("div","diagram-item");c.append(e("b","diagram-num",cell[0]),e("strong","",cell[1]),e("span","",cell[2]));cards.append(c)}visual.append(cards);
const media={
1:["סיור ב־G6, מסכים ופרופיל נהג","https://www.youtube.com/watch?v=5GpNbVfXFkU"],
3:["הדגמת מערכות ACC ו־LCC (דגם ושוק זרים)","https://www.youtube.com/watch?v=J7Ug6wWeeMU"],
4:["אפליקציה, מפתחות דיגיטליים ופרופילים","https://www.youtube.com/watch?v=5GpNbVfXFkU"],
5:["XCOMBO ושליטה קולית — הדגמת משתמש","https://www.youtube.com/watch?v=5GpNbVfXFkU"],
6:["טעינה, נתוני רכב והגדרת זרם","https://www.youtube.com/watch?v=5GpNbVfXFkU"],
8:["חניה אוטומטית ומרחוק — הדגמה","https://www.youtube.com/watch?v=IYGJUSvRQQA"],
11:["סיור לבעלי רכב חדש","https://www.youtube.com/watch?v=5GpNbVfXFkU"],
13:["קיצורים ואוטומציה — סקירה","https://www.youtube.com/watch?v=5GpNbVfXFkU"],
24:["מפתחות טלפון ופרופיל הנהג","https://www.youtube.com/watch?v=5GpNbVfXFkU"],
27:["חניה 360° ו־APA","https://www.youtube.com/watch?v=IYGJUSvRQQA"],
28:["הדגמת מערכות סיוע ותנאים להפעלה","https://www.youtube.com/watch?v=J7Ug6wWeeMU"],
29:["הדגמת מערכות סיוע (חו״ל, לא מדריך בטיחות)","https://www.youtube.com/watch?v=OhY40-0OWUo"]
};
const videos=panel("סרטונים, ספרי רכב ומקורות","קישורים נפתחים רק בלחיצה. הסרטונים שייכים ליוצרים שלהם ואינם מועתקים לאתר; הם מיועדים להמחשה ועשויים להציג שנת דגם או שוק אחרים.");
const list=e("div","media-list");
const official=[
["מפרט G6 בישראל · תצורות וטווח","https://heyxpeng.co.il/g6/","מפרט יבואן"],
["מפרט Core+ וקונפיגורטור ישראלי","https://heyxpeng.co.il/g6/configurator/","מפרט יבואן"],
["ספרי רכב רשמיים · בחירת שנת דגם ושפה","https://www.xpeng.com/user-manual","אתר יצרן"]
];
const vid=media[id];if(vid)official.push([vid[0],vid[1],"סרטון חיצוני"]);
else official.push(["חיפוש סרטונים בנושא השיעור","https://www.youtube.com/results?search_query="+encodeURIComponent("XPENG G6 "+(info.title?.en||"owners tutorial")),"חיפוש באתר חיצוני"]);
for(const [name,url,type]of official){const card=e("div","media-item");card.append(e("span","media-kind",type));card.append(a(name+" ↗",url));list.append(card)}videos.append(list);
const progress=e("section","finish-panel");
progress.lang="he";progress.dir="rtl";progress.append(e("h2","","שמירת התקדמות אישית"));
progress.append(e("p","","אפשר לסמן את השיעור כנקרא. ההתקדמות נשמרת רק בדפדפן שלך במכשיר הנוכחי ולא נשלחת לשרת."));
const b=e("button","finish-btn");
function saved(){try{return JSON.parse(localStorage.getItem("g6-read-lessons")||"[]")}catch{return []}}
function update(){const set=saved();b.textContent=set.includes(id)?"✓ סומן כנקרא — לחיצה לביטול":"סימון שיעור זה כנקרא";const f=progress.querySelector("output");f.textContent=set.length+" מתוך 35 שיעורים סומנו כנקראו."}
b.addEventListener("click",()=>{let set=saved();set=set.includes(id)?set.filter(x=>x!==id):[...set,id];try{localStorage.setItem("g6-read-lessons",JSON.stringify(set))}catch{}update();});
progress.append(b);const count=e("output","finish-count");count.setAttribute("aria-live","polite");progress.append(count);update();
$("chapterNav")?.before(progress);
})();