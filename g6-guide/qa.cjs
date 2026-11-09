#!/usr/bin/env node
/* G6 GUIDE local data/content integrity test. No external services or secrets. */
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const base=__dirname;
const files=["catalog.js","chapters-01-07.js","chapters-08-14.js","chapters-15-21.js","chapters-22-28.js","chapters-29-35.js","deep-01-07.js","deep-08-14.js","deep-15-21.js","deep-22-28.js","deep-29-35.js"];
const sandbox={window:{}};vm.createContext(sandbox);
for(const file of files)vm.runInContext(fs.readFileSync(path.join(base,file),"utf8"),sandbox,{filename:file,timeout:3000});
const catalog=sandbox.window.G6_CATALOG||[],chapters=sandbox.window.G6_CHAPTERS||{},deep=sandbox.window.G6_DEEP||{};
assert.equal(catalog.length,35,"Exactly 35 lessons required");
assert.deepEqual(catalog.map(c=>c.id),Array.from({length:35},(_,i)=>i+1),"Lessons must be 1-35 in order");
let total=0,words=0,minimum=Infinity;
for(let id=1;id<=35;id++){
 const item=catalog[id-1],old=chapters[id],blocks=deep[id];
 assert(item.title?.he&&item.title?.en&&item.title?.ru&&item.title?.es,"Missing translations "+id);
 assert(old&&Array.isArray(old.sections)&&old.sections.length>=3,"Missing base lesson "+id);
 assert(Array.isArray(blocks)&&blocks.length>=4,"Missing deep material "+id);
 const baseSectionText=old.sections.map(s=>[s.h,s.p,...(s.bullets||[])].join(" ")).join(" ");
 const deepText=blocks.map(b=>Array.isArray(b)?[b[0],b[1],...(Array.isArray(b[2])?b[2]:[])].join(" "):[b.h,b.p,...(b.bullets||[])].join(" ")).join(" ");
 assert(baseSectionText.length>500&&deepText.length>700,"Unreasonably short lesson "+id);
 for(const b of blocks){
  const title=Array.isArray(b)?b[0]:b.h,text=Array.isArray(b)?b[1]:b.p,bullets=Array.isArray(b)?b[2]:b.bullets;
  assert(typeof title==="string"&&title.length>6,"Missing section heading lesson "+id);
  assert(typeof text==="string"&&text.length>90,"Too little section text lesson "+id);
  assert(Array.isArray(bullets)&&bullets.length>=3,"Missing substantive detail lesson "+id);
 }
 const count=old.sections.length+blocks.length,totalText=baseSectionText+" "+deepText;
 words+=totalText.split(/\s+/).filter(Boolean).length;
 minimum=Math.min(minimum,totalText.split(/\s+/).filter(Boolean).length);
 total+=count;
}
for(const name of ["index.html","learning.html"]){
 const html=fs.readFileSync(path.join(base,name),"utf8");
 const scripts=[...html.matchAll(/<script\s+[^>]*src="([^"]+)"/g)].map(m=>m[1]);
 const styles=[...html.matchAll(/<link\s+[^>]*href="([^"]+\.css)"/g)].map(m=>m[1]);
 for(const file of [...scripts,...styles])assert(fs.existsSync(path.join(base,file)),"Missing linked asset "+name+" "+file);
 assert(html.includes('lang="he"')&&html.includes('dir="rtl"'),"RTL missing "+name);
 assert(html.includes("search")||html.includes("searchInput"),"Search missing "+name);
}
const home=fs.readFileSync(path.join(base,"home.js"),"utf8"),reader=fs.readFileSync(path.join(base,"reader.js"),"utf8");
assert(home.includes("deep[i.id]"),"Homepage search must index deep lessons");
assert(reader.includes("G6_DEEP?.[item.id]"),"Reader search must index deep lessons");
assert(!fs.readFileSync(path.join(base,"index.html"),"utf8").includes('id="g6-lessons"'),"Old summary-first homepage still present");
console.log(JSON.stringify({passed:true,lessons:catalog.length,contentSections:total,approxWordCount:words,minimumLessonWords:minimum,files:files.length+5},null,2));