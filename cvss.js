/* CVSS v3.1 基本値の計算（言語に依存しない部分）。項目名・説明文は lang/*.js にあります。
   仕様：https://www.first.org/cvss/v3.1/specification-document */
(function(){
var codes=[["AV",["N","A","L","P"]],["AC",["L","H"]],["PR",["N","L","H"]],["UI",["N","R"]],["S",["U","C"]],["C",["H","L","N"]],["I",["H","L","N"]],["A",["H","L","N"]]];
var W={AV:{N:.85,A:.62,L:.55,P:.2},AC:{L:.77,H:.44},UI:{N:.85,R:.62},CIA:{H:.56,L:.22,N:0}};
var PRW={U:{N:.85,L:.62,H:.27},C:{N:.85,L:.68,H:.5}};
function roundup(x){var i=Math.round(x*100000);return i%10000===0?i/100000:(Math.floor(i/10000)+1)/10}
function calc(v){
 var ch=v.S==="C";
 var iss=1-(1-W.CIA[v.C])*(1-W.CIA[v.I])*(1-W.CIA[v.A]);
 var imp=ch?7.52*(iss-0.029)-3.25*Math.pow(iss-0.02,15):6.42*iss;
 var ex=8.22*W.AV[v.AV]*W.AC[v.AC]*PRW[v.S][v.PR]*W.UI[v.UI];
 if(imp<=0)return 0;
 return ch?roundup(Math.min(1.08*(imp+ex),10)):roundup(Math.min(imp+ex,10));
}
window.CVSS={codes:codes,calc:calc};
})();
