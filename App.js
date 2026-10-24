/* フォーム処理、Markdown生成、言語の切り替え。
   表示文言・定型文・CWE例文は lang/*.js、CVSSの計算は cvss.js にあります。 */
(function(){
var $=function(id){return document.getElementById(id)};
var F=["status","title","aid","cve","pub","upd","summary","versioncheck","cwe","cwenote","desc","impact","score","sev","vector","fix","work","refs","credit","hist","contact"];
var cur="ja",L=I18N.ja;
var prods=$("prods"),out=$("out"),msg=$("msg"),timer;
var auto={desc:"",impact:""};

function T(x){return (x||"").trim()}
function lines(x){return T(x).split("\n").map(T).filter(Boolean)}
function fmt(s,o){return s.replace(/\{(\w+)\}/g,function(m,k){return o[k]})}
function today(){var d=new Date(),p=function(n){return String(n).padStart(2,"0")};return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())}
function esc(s){return String(s).replace(/\|/g,"\\|").replace(/\n/g," ")}
function sevFrom(s){var n=parseFloat(s);if(isNaN(n))return "";if(n===0)return "none";if(n<4)return "low";if(n<7)return "medium";if(n<9)return "high";return "critical"}
function isUnk(v){return v===I18N.ja.unk||v===I18N.en.unk}
function say(s){msg.textContent=s;clearTimeout(timer);timer=setTimeout(function(){msg.textContent=""},2800)}
/* "本文|ヒント" 形式の文言を、本文＋小さいヒントとして入れる（textContentのみ使用） */
function setText(el,str){
 var a=str.split("|");el.textContent="";el.appendChild(document.createTextNode(a[0]));
 if(a[1]){var sm=document.createElement("small");sm.textContent=a[1];el.appendChild(document.createTextNode(" "));el.appendChild(sm)}
}

/* ---- 製品の行 ---- */
function addProd(){
 var d=document.createElement("div"),n=document.createElement("input"),v=document.createElement("input"),b=document.createElement("button");
 d.className="prod";n.className="pn";v.className="pv";b.type="button";
 b.onclick=function(){d.remove();render()};
 d.appendChild(n);d.appendChild(v);d.appendChild(b);prods.appendChild(d);labelProds();
}
function labelProds(){
 Array.prototype.forEach.call(prods.children,function(d){
  var n=d.children[0],v=d.children[1],b=d.children[2];
  n.placeholder=L.ui.pn;n.setAttribute("aria-label",L.ui.pn);
  v.placeholder=L.ui.pv;v.setAttribute("aria-label",L.ui.pv);
  b.textContent=L.ui.pdel;
 });
}
function getProds(){
 return Array.prototype.map.call(prods.children,function(d){return [d.children[0].value.trim(),d.children[1].value.trim()]}).filter(function(p){return p[0]||p[1]});
}
function getData(){var o={};F.forEach(function(k){o[k]=$(k).value});o.prods=getProds();return o}

/* ---- Markdown生成 ---- */
function build(o){
 var U=L.ui,Ls=[],m=[],sevk=o.sev||sevFrom(o.score),sev=sevk?L.sev[sevk]:"";
 Ls.push("# "+(T(o.title).replace(/\s*\n\s*/g," ")||U.untitled),"");
 if(T(o.aid))m.push([U.mid,T(o.aid)]);
 if(sev)m.push([U.msev,T(o.score)?fmt(U.fSev,{s:sev,n:T(o.score)}):sev]);
 if(o.pub)m.push([U.mpub,o.pub]);
 if(o.upd)m.push([U.mupd,o.upd]);
 if(m.length){Ls.push("| "+U.tItem+" | "+U.tCont+" |","| --- | --- |");m.forEach(function(r){Ls.push("| "+r[0]+" | "+esc(r[1])+" |")});Ls.push("")}
 var sm=[L.stat[o.status],T(o.summary)].filter(Boolean).join("\n\n");
 if(sm)Ls.push("## "+U.oOver,"",sm,"");
 if(o.prods.length||T(o.versioncheck)){
  Ls.push("## "+U.oAff,"");
  if(o.prods.length){Ls.push(U.oAffT,"","| "+U.tProd+" | "+U.tVer+" |","| --- | --- |");o.prods.forEach(function(p){Ls.push("| "+esc(p[0])+" | "+esc(p[1])+" |")});Ls.push("")}
  if(T(o.versioncheck))Ls.push(U.oVerHow,"",T(o.versioncheck),"");
 }
 if(T(o.desc)||T(o.cwe)){
  Ls.push("## "+U.oDesc,"");
  if(T(o.desc))Ls.push(T(o.desc),"");
  if(isUnk(T(o.cwe)))Ls.push(fmt(U.fCweUnk,{t:T(o.cwenote).replace(/\n/g," ")}).replace(/\s+$/,""),"");
  else if(T(o.cwe))Ls.push("- "+T(o.cwe),"");
 }
 if(T(o.impact)||T(o.score)){
  Ls.push("## "+U.oImp,"");
  if(T(o.impact))Ls.push(T(o.impact),"");
  if(T(o.score))Ls.push(fmt(U.fCvss,{n:T(o.score),s:sev}));
  if(T(o.vector))Ls.push(fmt(U.fVec,{v:T(o.vector)}));
  Ls.push("");
 }
 var fix=T(o.fix)||(o.status==="eol"?L.eolfix:"");
 if(fix)Ls.push("## "+U.oFix,"",fix,"");
 if(T(o.work))Ls.push("## "+U.oWork,"",T(o.work),"");
 var rel=T(o.cve).split(/[,、\s]+/).filter(Boolean).concat(lines(o.refs));
 if(rel.length){Ls.push("## "+U.oRel,"");rel.forEach(function(r){Ls.push("- "+r)});Ls.push("")}
 if(T(o.credit))Ls.push("## "+U.oCred,"",T(o.credit),"");
 if(o.pub||T(o.hist)){Ls.push("## "+U.oHist,"");if(o.pub)Ls.push("- "+o.pub+" "+U.pubd);lines(o.hist).forEach(function(r){Ls.push("- "+r)});Ls.push("")}
 if(T(o.contact))Ls.push("## "+U.oCont,"",T(o.contact),"");
 return Ls.join("\n").replace(/\n+$/,"\n");
}

/* ---- 公開前チェック ---- */
function lint(o,txt){
 var ph=new RegExp(I18N.ja.ph+"|"+I18N.en.ph);
 var cweOk=isUnk(T(o.cwe))?!!T(o.cwenote):!!T(o.cwe);
 var ok=[/脆弱性|vulnerab/i.test(o.title),!!o.pub,!!T(o.summary),o.prods.some(function(p){return p[0]&&p[1]}),cweOk,!!T(o.impact),!!T(o.score),!!T(o.fix)||o.status==="eol",!!T(o.contact),!!T(o.work),!!T(o.cve)||!!T(o.refs),!ph.test(txt),T(o.cve).split(/[,、\s]+/).filter(Boolean).every(function(c){return /^CVE-\d{4}-\d{4,}$/i.test(c)})];
 var lv=["req","req","req","req","req","req","req","req","req","rec","rec","chk","chk"];
 var ul=$("lint"),ng=0;ul.textContent="";
 ok.forEach(function(good,i){
  var li=document.createElement("li");li.className=good?"ok":"ng";
  if(!good&&lv[i]!=="rec")ng++;
  li.textContent=(good?"✓ ":"□ ")+L.lint[i]+fmt(L.ui.fLvl,{l:L.lv[lv[i]]});
  ul.appendChild(li);
 });
 $("lintsum").textContent=ng?fmt(L.ui.fLint,{n:ng}):L.ui.lintOk;
}
function render(){
 var d=getData(),t=build(d);
 $("cwenotebox").hidden=!isUnk(T(d.cwe));
 out.textContent=t;lint(d,t);
}

/* ---- CVSS ---- */
var cv=$("cvss");
function buildCvss(){
 var sel={};
 CVSS.codes.forEach(function(c){var r=cv.querySelector('input[name="'+c[0]+'"]:checked');if(r)sel[c[0]]=r.value});
 cv.textContent="";
 CVSS.codes.forEach(function(c){
  var info=L.cvss[c[0]],fs=document.createElement("fieldset"),lg=document.createElement("legend"),p=document.createElement("p");
  lg.textContent=info[0];p.className="mdesc";p.textContent=info[1];fs.appendChild(lg);fs.appendChild(p);
  c[1].forEach(function(v){
   var lb=document.createElement("label"),r=document.createElement("input"),nm=document.createElement("span"),ds=document.createElement("span");
   lb.className="opt";r.type="radio";r.name=c[0];r.value=v;r.checked=sel[c[0]]===v;
   nm.className="on";nm.textContent=info[2][v][0];ds.className="od";ds.textContent=info[2][v][1];
   lb.appendChild(r);lb.appendChild(nm);lb.appendChild(ds);fs.appendChild(lb);
  });
  cv.appendChild(fs);
 });
}
function updateCvss(){
 var v={},n=0;
 CVSS.codes.forEach(function(c){var r=cv.querySelector('input[name="'+c[0]+'"]:checked');if(r){v[c[0]]=r.value;n++}});
 if(n===CVSS.codes.length){
  $("score").value=CVSS.calc(v).toFixed(1);
  $("vector").value="CVSS:3.1/"+CVSS.codes.map(function(c){return c[0]+":"+v[c[0]]}).join("/");
 }else{$("score").value="";$("vector").value=""}
 render();
}

/* ---- 定型文ボタン・CWE ---- */
function buildPresets(){
 Array.prototype.forEach.call(document.querySelectorAll(".pre"),function(d){d.remove()});
 Object.keys(L.presets).forEach(function(id){
  var t=$(id),d=document.createElement("div");d.className="pre";
  L.presets[id].forEach(function(p){
   var b=document.createElement("button");b.type="button";b.textContent="＋"+p[0];
   b.onclick=function(){var x=L.imp[p[1]]||p[1];t.value+=(t.value&&!/\n$/.test(t.value)?"\n":"")+x;render()};
   d.appendChild(b);
  });
  t.insertAdjacentElement("afterend",d);
 });
}
function buildCweList(){
 var dl=$("cwelist");dl.textContent="";
 [L.unk].concat(L.cwes).forEach(function(c){var op=document.createElement("option");op.value=c;dl.appendChild(op)});
}
/* CWEを候補から選ぶと、説明と脅威の例文を入れる。入力済みの欄は上書きしない */
function applyCwe(quiet){
 var v=T($("cwe").value),tx=L.cwes.indexOf(v)>=0&&L.cweText[v.split(" ")[0]];
 if(!tx)return;
 var skipped=0;
 [["desc",tx[0]],["impact",L.imp[tx[1]]]].forEach(function(f){
  var el=$(f[0]);
  if(!T(el.value)||el.value===auto[f[0]]){el.value=f[1];auto[f[0]]=f[1]}else skipped++;
 });
 render();
 if(!quiet)say(skipped?L.ui.autoSkip:L.ui.autoOk);
}

/* ---- 公開前の確認リスト ---- */
function buildChk(){
 var box=$("chklist"),prev=Array.prototype.map.call(box.querySelectorAll("input"),function(i){return i.checked});
 box.textContent="";
 L.chk.forEach(function(t,i){
  var lb=document.createElement("label"),c=document.createElement("input");
  c.type="checkbox";c.checked=!!prev[i];lb.appendChild(c);lb.appendChild(document.createTextNode(t));box.appendChild(lb);
 });
}

/* ---- 言語の切り替え ---- */
function applyLang(lang){
 var prev=L;cur=lang;L=I18N[lang];
 document.documentElement.lang=lang;document.title=L.ui.h1;
 Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"),function(el){setText(el,L.ui[el.getAttribute("data-i18n")])});
 Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-ph]"),function(el){el.placeholder=L.ui[el.getAttribute("data-i18n-ph")]});
 Array.prototype.forEach.call($("sev").options,function(o){if(o.value)o.textContent=L.sev[o.value]});
 var c=$("cwe"),v=c.value,i=prev.cwes.indexOf(v);
 if(v===prev.unk)c.value=L.unk;else if(i>=0)c.value=L.cwes[i];
 buildCweList();buildCvss();buildPresets();buildChk();labelProds();
 applyCwe(true);updateCvss();
}
$("lang").onchange=function(){applyLang(this.value)};

/* ---- 操作 ---- */
document.addEventListener("input",render);
document.addEventListener("input",function(e){if(e.target.id==="cwe")applyCwe(false)});
$("f").addEventListener("submit",function(e){e.preventDefault()});
cv.addEventListener("change",updateCvss);
$("cvssclear").onclick=function(){Array.prototype.forEach.call(cv.querySelectorAll("input"),function(r){r.checked=false});updateCvss()};
$("addprod").onclick=function(){addProd();render()};
function download(name,text,type){
 var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:type}));a.download=name;
 document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1000);
}
function fname(ext){var d=getData();return ((d.aid.trim()||d.cve.split(",")[0].trim()||"advisory").replace(/[^\w.\-]+/g,"_"))+ext}
$("copy").onclick=function(){
 var txt=out.textContent;
 function fallback(){var r=document.createRange();r.selectNodeContents(out);var s=getSelection();s.removeAllRanges();s.addRange(r);try{document.execCommand("copy");say(L.ui.copied)}catch(e){say(L.ui.copyfail)}s.removeAllRanges()}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){say(L.ui.copied)},fallback)}else fallback();
};
$("dl").onclick=function(){download(fname(".md"),out.textContent,"text/markdown;charset=utf-8");say(L.ui.saved)};
$("clearall").onclick=function(){
 if(!confirm(L.ui.clearq))return;
 $("f").reset();prods.textContent="";addProd();auto={desc:"",impact:""};$("pub").value=today();updateCvss();
};

addProd();$("pub").value=today();applyLang("ja");
})();
