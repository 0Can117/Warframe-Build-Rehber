const CDN='https://cdn.jsdelivr.net/gh/WFCD/warframe-items@master/data/json/', SRC=[f=>'https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/'+f+'.json', f=>CDN+f+'.json'], IMG='https://cdn.warframestat.us/img/';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS=['Warframe','Primary','Secondary','Melee','Archgun','Archmelee','Zaw','Kitgun','Companion','Companion Weapon','Necramech','K-Drive','Railjack'];
const XC={Companion:{n:10,re:/^Companion Mod/},'Companion Weapon':{n:8,re:/^(Primary|Secondary|Melee|Pistol|Rifle|Shotgun|Bow|Sniper|Companion|Posture) Mod/},Necramech:{n:12,re:/^Necramech Mod/},'K-Drive':{n:8,re:/^K-Drive Mod/},Railjack:{n:8,aura:true,re:/^(Plexus|Railjack) Mod/},Custom:{n:12,re:/./}};
const MODRE={Warframe:/^Warframe Mod/,Primary:/^(Primary|Shotgun|Rifle|Bow|Sniper) Mod/,Secondary:/^(Secondary|Pistol) Mod/,Melee:/^(Melee|Stance) Mod/,Archgun:/^Arch-Gun Mod/,Archmelee:/^Arch-Melee Mod/,Zaw:/^Melee Mod/};
const ARC={Warframe:/^Warframe Arcane/,Primary:/^(Primary|Shotgun|Bow) Arcane/,Secondary:/^Secondary Arcane/,Melee:/^Melee Arcane/,Zaw:/^Zaw Arcane/,Kitgun:/^Kitgun Arcane/};
const SL={Warframe:['Warframe','Warframe'],Primary:['Primary'],Secondary:['Secondary'],Melee:['Melee'],Archgun:['Primary','Secondary'],Archmelee:['Melee','Melee'],Necramech:['Warframe','Warframe'],Zaw:['Melee','Zaw']};
const POLS=['','madurai','vazarin','naramon','zenurik','unairu','penjaga','umbra','omni'], PSYM={'':'·',madurai:'V',vazarin:'D',naramon:'—',zenurik:'Z',unairu:'U',penjaga:'P',umbra:'Ω',omni:'✦'};
const polLabel=p=>({madurai:'Madurai',vazarin:'Vazarin',naramon:'Naramon',zenurik:'Zenurik',unairu:'Unairu',penjaga:'Penjaga',umbra:'Umbra',omni:'Omni','':'Nötr'}[p]||p);
const ZP={Strike:[],Grip:[],Link:[]}, KP={Chamber:[],Grip:{Primary:[],Secondary:[]},Loader:[]}, ELEMS=['Impact','Heat','Cold','Electricity','Toxin','Magnetic','Radiation'];
const M=new Map(), A=new Map(), IT=new Map(), AB=new Map(), PO=['pols','apol','a2pol','expol','stpol'], CF=['aura','au2','ex','st','slots','arcs','elem','bonus','reactor','helm','evo','parts','cn'];
const RIVCAT=['Primary','Secondary','Melee','Zaw','Kitgun','Archgun','Archmelee'], CONV_MODS={'Burning Claws':'Heat','Chilling Claws':'Cold','Shocking Claws':'Electricity','Sepsis Claws':'Toxin'};
const RS={common:['Damage','Critical Chance','Critical Damage','Multishot','Status Chance','Status Duration','Heat','Cold','Electricity','Toxin','Impact','Puncture','Slash','Damage vs Grineer','Damage vs Corpus','Damage vs Infested'],ranged:['Fire Rate','Reload Speed','Magazine Capacity','Ammo Maximum','Zoom','Punch Through','Projectile Speed','Weapon Recoil'],melee:['Attack Speed','Range','Combo Duration','Initial Combo','Chance for Additional Combo','Critical Chance on Slide Attack','Finisher Damage','Heavy Attack Efficiency'],spl:['Status Damage','Gas Damage','Corrosive Damage','Viral Damage','Radiation Damage','Blast Damage','Magnetic Damage','Damage vs Orokin','Damage vs Techrot','Damage vs Scalda'],splr:['Weak Point Damage','Weak Point Critical Chance','Ammo Efficiency','Magazine Reload While Holstered'],splm:['Heavy Attack Damage']};
let DATA={mods:[],arcanes:[],items:{}};
const blank=()=>({id:null,name:'',cat:'Warframe',item:null,reactor:true,elem:'',bonus:25,note:'',imgs:[],riv:[],helm:{},shards:Array(5).fill(null),cn:null,cname:'',parts:{},exs:{},evo:['','','','',''],cfgs:[{n:'Config 1',d:null}],ci:0,aura:null,au2:null,a2pol:'',ex:null,st:null,apol:'',expol:'',stpol:'',pols:Array(14).fill(''),slots:Array(14).fill(null),arcs:[]});
let S=blank(), tab='mods', drag=null, sup=false, abPick=null, omniOn=false, bcat='all';
const msg=t=>$('#msg').textContent=t||'';

const ADMIN_HASH = "6b215dadc6a4e29028391bc75263c3444715e2530b185ef46c35db90ed5706ff";
const ADMIN = (() => {
    try {
        const urlParam = new URLSearchParams(location.search).get('admin');
        if (urlParam === '0') { localStorage.removeItem('admin'); history.replaceState(null, '', location.pathname); return false; }
        if (urlParam && urlParam !== '1') {
            history.replaceState(null, '', location.pathname);
            if (!window.crypto?.subtle) { alert("Güvenli bağlantı (HTTPS) gerekli!"); return false; }
            crypto.subtle.digest('SHA-256', new TextEncoder().encode(urlParam)).then(h => {
                const hashHex = Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
                if (hashHex === ADMIN_HASH) { localStorage.setItem('admin', '1'); location.reload(); }
                else alert('Hatalı yönetici şifresi!');
            }).catch(() => alert("Şifreleme hatası! Lütfen HTTPS üzerinden girin."));
            return false;
        }
        return localStorage.getItem('admin') === '1';
    } catch(e) { return false; }
})();

const RO=!ADMIN; document.body.classList.toggle('ro',RO);
const openView=()=>{if(RO)document.body.classList.add('open')};
let saved=[]; if(ADMIN)try{saved=JSON.parse(localStorage.getItem('builds')||'[]')}catch(e){}
let guides=[]; if(ADMIN)try{guides=JSON.parse(localStorage.getItem('guides')||'[]')}catch(e){}
const persistGuides=()=>{if(!RO)try{localStorage.setItem('guides',JSON.stringify(guides))}catch(e){msg('Rehber kaydı yazılamadı.')}};
let curGuide=null, guideImgs=[];
const navStack=[];
let CM=[]; if(ADMIN)try{CM=JSON.parse(localStorage.getItem('cmods')||'[]')}catch(e){}
const saveCM=()=>{if(!RO)try{localStorage.setItem('cmods',JSON.stringify(CM))}catch(e){}};
let CMD=[]; if(ADMIN)try{CMD=JSON.parse(localStorage.getItem('cmodsdel')||'[]')}catch(e){}
const saveCMD=()=>{if(!RO)try{localStorage.setItem('cmodsdel',JSON.stringify(CMD))}catch(e){}};
const persist=()=>{if(!RO)try{localStorage.setItem('builds',JSON.stringify(saved))}catch(e){msg('Tarayıcı kaydı yazılamadı.')}};

const pk=k=>/^\d+$/.test(k)?+k:k, KM={aura:['aura','apol'],au2:['au2','a2pol'],ex:['ex','expol'],st:['st','stpol']};
const getS=k=>typeof k==='number'?S.slots[k]:S[KM[k][0]], setS=(k,v)=>{typeof k==='number'?S.slots[k]=v:S[KM[k][0]]=v};
const getP=k=>typeof k==='number'?S.pols[k]:S[KM[k][1]], setP=(k,v)=>{typeof k==='number'?S.pols[k]=v:S[KM[k][1]]=v};
const isNecExalt=()=>!!S.tgt&&S.par?.cat==='Necramech', isClaws=()=>!!S.tgt&&/^claw:/.test(S.tgt);
const A2=n=>/^Jade/.test(n||''), soT=()=>S.tgt==='sirius'||S.tgt==='orion';
const NG=()=>isNecExalt()?8:((+S.cn)||XC[S.cat]?.n||8);
const hasK=k=>{
    if(isNecExalt())return typeof k==='number'?k<8:false;
    if(S.tgt&&(k==='aura'||k==='au2')&&!soT())return false;
    return typeof k==='number'?(k<NG()||(S.cat==='Railjack'&&k>=8&&k<14)):k==='aura'?(S.cat==='Warframe'||!!XC[S.cat]?.aura||S.cat==='Custom'):k==='au2'?(S.cat==='Warframe'&&A2(IT.get(S.item)?.name)):k==='st'?(S.cat==='Melee'||S.cat==='Custom'||(S.cat==='Companion Weapon'&&/^claw:/.test(S.tgt||''))):k==='ex'?(S.cat==='Custom'||(!XC[S.cat]&&!['Archgun','Archmelee'].includes(S.cat))):false;
};
const ALLK=['aura','au2','ex','st',0,1,2,3,4,5,6,7,8,9,10,11,12,13], KEYS=()=>ALLK.filter(hasK);
const arcSlots=()=>{if(isNecExalt())return[];let a=S.cat==='Kitgun'?['Kitgun',S.item==='kg-s'?'Secondary':'Primary']:SL[S.cat]||[];if(S.tgt&&S.par?.cat==='Necramech'&&a.length===1)a=[a[0],a[0]];return a};
const modRe=()=>S.cat==='Custom'?/./:(XC[S.cat]?XC[S.cat].re:S.cat==='Kitgun'?(S.item==='kg-s'?MODRE.Secondary:MODRE.Primary):MODRE[S.cat]);
const special=()=>/\b(Kuva|Tenet|Coda)\b/.test(IT.get(S.item)?.name||''), statsOf=m=>{const l=m.levelStats;return l&&l.length?(l[l.length-1].stats||[]).join(' | '):(m.description||'')};
const maxRank=m=>m.fusionLimit??0, isAura=m=>m.custom?m.ck==='aura':(m.baseDrain||0)<0&&/^(Warframe|Companion|Plexus|Railjack) Mod$/.test(m.type||''), isSt=m=>m.custom?m.ck==='stance':/^(Stance|Posture) Mod$/.test(m.type||'');
const canPlace=(m,k)=>m.custom?true:(k==='aura'||k==='au2')?isAura(m):k==='st'?isSt(m):(isAura(m)||isSt(m))?false:(k==='ex'?(S.cat==='Custom'||!!m.isUtility):true);

async function get(f){let err;for(const s of SRC){try{const r=await fetch(s(f));if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}catch(e){err=e}}throw new Error(f+' yüklenemedi')}
async function init(){
  try{
    const [mods,arc,wf,pri,sec,mel,ag,misc,pets,sen,sw,am]=await Promise.all(['Mods','Arcanes','Warframes','Primary','Secondary','Melee','Arch-Gun','Misc','Pets','Sentinels','SentinelWeapons','Arch-Melee'].map(get));
    DATA.mods=mods.filter(m=>m.uniqueName&&m.name&&!/Riven/i.test(m.type||'')).sort((a,b)=>a.name.localeCompare(b.name));
    DATA.arcanes=arc.filter(a=>a.uniqueName&&a.name).sort((a,b)=>a.name.localeCompare(b.name));
    const isSO = i => /^\/Lotus\/Powersuits\/SiriusOrion\//.test(i.uniqueName||'');
    const soSirius = wf.find(i => i.type==='Warframe' && isSO(i) && /Sirius/.test(i.uniqueName) && /SiriusSuit$/.test(i.uniqueName));
    const soOrion  = wf.find(i => i.type==='Warframe' && isSO(i) && /OrionSuit$/.test(i.uniqueName));
    const soFix = (i,ap) => ({...(i||{}), polarities:((i||{}).polarities||[]).filter(p=>p!=='aura').concat('omni'), auraPolarity:ap});
    let wfList = wf.filter(i => i.type === 'Warframe' && !isSO(i));
    wfList.push({...soFix(soSirius,'vazarin'), uniqueName:'siriusorion', name:'Sirius & Orion', type:'Warframe', abilities:[]});
    const necList=wf.filter(i=>i.type==='Necramech'&&/^(Bonewidow|Voidrig|Culverin)( Prime)?$/.test(i.name));
    DATA.items={Warframe:wfList,Primary:pri,Secondary:sec,Melee:mel.filter(i=>i.type==='Melee'),Archgun:ag,Archmelee:am,Zaw:[{uniqueName:'zaw',name:'Zaw (modüler)'}],Kitgun:[{uniqueName:'kg-p',name:'Kitgun (birincil)'},{uniqueName:'kg-s',name:'Kitgun (ikincil)'}],Companion:sen.concat(pets.filter(i=>i.type==='Pets')),'Companion Weapon':sw,Necramech:necList,'K-Drive':[{uniqueName:'kdrive',name:'K-Drive'}],Railjack:[{uniqueName:'plexus',name:'Plexus'}],Custom:[{uniqueName:'custom',name:'Custom (kendin tanımla)'}]};
    for(const k in DATA.items){DATA.items[k]=DATA.items[k].filter(i=>i.uniqueName&&i.name).sort((a,b)=>a.name.localeCompare(b.name));DATA.items[k].forEach(i=>IT.set(i.uniqueName,i))}
    DATA.mods.forEach(m=>M.set(m.uniqueName,m)); DATA.arcanes.forEach(a=>A.set(a.uniqueName,a));
    misc.filter(i=>i.type==='Exalted Weapon'&&i.uniqueName&&i.name).forEach(i=>IT.set(i.uniqueName,i));
    ['venari','venariclaws','sevashadow','sevashadowp'].forEach(u=>IT.set(u,{uniqueName:u,name:u.charAt(0).toUpperCase()+u.slice(1).replace('p',' Prime')}));
    IT.set('sirius', {...soFix(soSirius,'vazarin'), uniqueName:'sirius', name:'Sirius', type:'Warframe'});
    IT.set('orion', {...soFix(soOrion,'naramon'), uniqueName:'orion', name:'Orion', type:'Warframe'});
    ['sirius','orion'].forEach(u=>(IT.get(u).abilities||[]).forEach(a=>AB.set(a.uniqueName,{...a,own:IT.get(u).name})));
    DATA.items.Companion.filter(i=>/Kubrow|Kavat|Vulpaphyla|Predasite|Charger/.test(i.name)).forEach(i=>IT.set('claw:'+i.uniqueName,{uniqueName:'claw:'+i.uniqueName,name:i.name+' Claws'}));
    mel.filter(i=>i.type==='Zaw Component'&&!/PvPVariant/.test(i.uniqueName)).forEach(i=>{const l=i.uniqueName.split('/').pop(),k=/Tip/.test(l)?'Strike':/Handle/.test(l)?'Grip':'Link';if(!ZP[k].includes(i.name))ZP[k].push(i.name)});
    misc.filter(i=>i.type==='Kitgun Component'||i.name==='Sporelacer'||i.name==='Vermisplicer').forEach(i=>{const u=i.uniqueName,k=/Barrel/.test(u)?'Chamber':/Handle/.test(u)?'Grip':/Clip/.test(u)?'Loader':null;if(!k)return;if(k==='Grip'){const sd=/\/Primary\//.test(u)?'Primary':'Secondary';if(!KP.Grip[sd].includes(i.name))KP.Grip[sd].push(i.name)}else if(!KP[k].includes(i.name))KP[k].push(i.name)});
    [ZP.Strike,ZP.Grip,ZP.Link,KP.Chamber,KP.Grip.Primary,KP.Grip.Secondary,KP.Loader].forEach(a=>a.sort());
    DATA.items.Warframe.forEach(w=>(w.abilities||[]).forEach(a=>AB.set(a.uniqueName,{...a,own:w.name})));
    msg('');
    let pub=[];try{const r=await fetch('builds.json?'+Date.now());if(r.ok)pub=await r.json()}catch(e){}
    const pb=Array.isArray(pub)?pub:(Array.isArray(pub?.builds)?pub.builds:[]),pc=Array.isArray(pub?.cmods)?pub.cmods:[],pg=Array.isArray(pub?.guides)?pub.guides:[];
    if(RO){saved=pb;CM=pc;guides=pg}else{if(!saved.length&&pb.length){saved=pb;persist()}if(!guides.length&&pg.length){guides=pg;persistGuides()}pc.forEach(c=>{if(!CM.some(x=>x.id===c.id)&&!CMD.includes(c.id))CM.push(c)});saveCM()}
    syncCM();
    const h=location.hash.match(/^#b=(.+)$/);
    if(h){try{loadBuild(JSON.parse(decodeURIComponent(escape(atob(h[1])))));openView()}catch(e){msg('Paylaşım bağlantısı okunamadı.')}}
    selectCat(S.cat); renderAll();
    if(RO){
      setInterval(async()=>{
        try{
          const r=await fetch('builds.json?'+Date.now());
          if(r.ok){
            const pub=await r.json(), pb=Array.isArray(pub)?pub:(Array.isArray(pub?.builds)?pub.builds:[]),pg=Array.isArray(pub?.guides)?pub.guides:[];
            if(JSON.stringify(pb)!==JSON.stringify(saved)){
              saved=pb; renderSaved();
              if(S.id){ const updated=saved.find(x=>x.id===S.id); if(updated){ loadBuild(updated); renderAll(); } }
            }
            if(JSON.stringify(pg)!==JSON.stringify(guides)){guides=pg;renderSaved()}
          }
        }catch(e){}
      }, 30000);
    }
  }catch(e){msg('Veri alınamadı: '+e.message)}
}

function drainOf(m,r,sp){const b=m.baseDrain||0,neg=b<0;let d=Math.abs(b)+r;if(sp&&m.polarity){if(sp==='omni'||sp===m.polarity)d=neg?d*2:Math.ceil(d/2);else if(!neg)d=Math.ceil(d*1.25)}return neg?-d:d}
function calc(){let cap=S.cat==='Necramech'?(S.reactor?80:40):(S.reactor?60:30),used=0;for(const k of KEYS()){const s=getS(k),m=s&&M.get(s.u);if(!m||(S.cat==='Railjack'&&typeof k==='number'&&k>=8))continue;const d=drainOf(m,s.r,getP(k));if(k==='aura'||k==='au2'||k==='st')cap-=d;else used+=d}return{cap,used}}
function applyPols(){
    const it=IT.get(S.item);
    S.pols=Array.from({length:14},(_,i)=>it?.polarities?.[i]||'');
    S.apol=S.cat==='Warframe'?(it?.auraPolarity||auraPol(it?.name||'')):'';
    S.a2pol=S.cat==='Warframe'&&A2(it?.name)?'omni':'';
    S.expol=it?.exilusPolarity||'';
    S.stpol=it?.stancePolarity||'';
}
const fitArcs=()=>S.arcs=arcSlots().map((t,i)=>{const a=A.get(S.arcs[i]);return a&&ARC[t].test(a.type)?a.uniqueName:null});
function cleanMods(){for(const k of ALLK){const s=getS(k),m=s&&M.get(s.u);if(m&&(!hasK(k)||(!m.custom&&!modRe().test(m.type))))setS(k,null)}}
function selectCat(c){const changed=S.cat!==c;if(changed){S.parts={};S.cfgs.forEach(g=>{if(g.d)g.d.parts={}});S.cn=XC[c]?.n||8}S.cat=c;const list=DATA.items[c]||[];if(!list.some(i=>i.uniqueName===S.item)){S.item=list[0]?.uniqueName||null;applyPols()}if(!special())S.elem='';cleanMods();fitArcs()}
function renderAll(){renderBuilder();renderList();renderSaved();renderCm()}

function renderBuilder(){
  $('#prevb').hidden=!navStack.length; $('#cats').innerHTML=CATS.map(c=>`<button data-cat="${c}" lang="en" class="${c===S.cat?'on':''}">${c}</button>`).join('');
  $('#item').innerHTML=(DATA.items[S.cat]||[]).map(i=>`<option value="${esc(i.uniqueName)}" ${i.uniqueName===S.item?'selected':''}>${esc(i.name)}</option>`).join('');
  if(RO){$('#item').hidden=true; $('#itembtn').hidden=false; $('#itembtn').textContent=(IT.get(S.item)?.name||'Seç')+' ▾';}else{$('#item').hidden=false; $('#itembtn').hidden=true;}
  $('#reactor').checked=S.reactor; $('#elrow').hidden=!special();
  $('#elem').innerHTML=['<option value="">Bonus element seç</option>',...ELEMS.map(x=>`<option ${x===S.elem?'selected':''}>${x}</option>`)].join('');
  $('#bonus').value=S.bonus;
  renderCfg();renderAbil();renderShards();renderTgt();renderEvo();renderParts();
  const it0=IT.get(S.item),tm=it0?.wikiaThumbnail||(it0?.imageName?IMG+it0.imageName:''); $('#timg').hidden=!tm; if(tm)$('#timg').src=tm;
  const {cap,used}=calc();
  $('#capn').textContent=`${used} / ${cap}`; $('#bar').className='bar'+(used>cap?' over':''); $('#builder').classList.toggle('cfgover',used>cap);
  $('#bar i').style.width=Math.min(100,cap?Math.max(0,used)/cap*100:0)+'%';
  const cell=k=>{
    const s=getS(k),m=s&&M.get(s.u),pv=getP(k),sp=typeof k==='string',lab=k==='ex'&&/Melee|Zaw/.test(S.cat)?'Exilus / Tennokai':({aura:'Aura',au2:'Aura 2',ex:'Exilus',st:'Stance'}[k]||'Boş');
    const pb=`<select class="pb${pv!==baseP(k)?' fm':''}" data-pol="${k}">${POLS.map(p=>`<option value="${p}" ${p===pv?'selected':''}>${PSYM[p]} ${polLabel(p)}</option>`).join('')}</select>`;
    if(!m)return `<div class="slot ${sp?'sp':''}" data-key="${k}">${pb}<span class="muted">${lab}</span></div>`;
    return `<div class="slot f ${sp?'sp':''}" data-key="${k}" title="${esc(statsOf(m))}">${pb}<button class="x" data-rm="${k}">×</button><div>${m.imageName?`<img src="${IMG+esc(m.imageName)}" loading="lazy" draggable="false">`:''}<b lang="en">${esc(m.name)}</b></div><span class="pol">${polLabel(m.polarity||'')}</span><label>Rank <input type="number" min="0" max="${maxRank(m)}" value="${s.r}" data-rank="${k}"></label></div>`};
  renderNote();
  $('#sp').innerHTML=['aura','au2',...(S.cat==='Melee'?['st','ex']:['ex','st'])].filter(hasK).map(cell).join('');
  $('#slots').innerHTML=Array.from({length:NG()},(_,i)=>i).map(cell).join('');
  $('#xs').innerHTML=S.cat==='Railjack'?[['Battle',8],['Tactical',11]].map(([n,a])=>`<h3 class="xh"><span lang="en">${n}</span> (Kapasite Kullanmaz)</h3><div class="slots sp3">${[a,a+1,a+2].map(cell).join('')}</div>`).join(''):'';
  $('#custrow').hidden=isNecExalt();
  $('#arcs').innerHTML=arcSlots().map((t,i)=>{const a=A.get(S.arcs[i]);return a?`<div class="aslot f" data-ai="${i}" title="${esc(statsOf(a))}"><button class="x" data-rmarc="${i}">×</button><img src="${IMG+esc(a.imageName)}" draggable="false"><b lang="en">${esc(a.name)}</b><span class="muted">${t}</span></div>`:`<div class="aslot" data-ai="${i}"><span class="muted">${t} Arcane</span></div>`}).join('');
  renderStats();
  if(RO)document.querySelectorAll('#builder input,#builder select').forEach(n=>n.disabled=true);
}

function getModLastStats(m){const l=m.levelStats;return l&&l.length?(l[l.length-1].stats||[]).join(' | '):''}
function getModElements(m){
  const stats=getModLastStats(m), EL='Heat|Cold|Electricity|Toxin|Blast(?!\\s*(?:Range|Radius))|Radiation|Magnetic|Viral|Corrosive|Gas', T='(?:<[^>]*>\\s*)?';
  const seg=new RegExp('[+\\-]\\s*\\d+(?:\\.\\d+)?%\\s*('+T+'(?:'+EL+')\\b(?:\\s+and\\s+'+T+'(?:'+EL+')\\b)*)(?!\\s*(?:Status|Proc|Resist))','gi');
  const one=new RegExp('\\b('+EL+')\\b','gi'), els=[];let a;
  while((a=seg.exec(stats))){let b;one.lastIndex=0;while((b=one.exec(a[1])))els.push(b[1])}
  return els
}
const getModPrimaryEls=m=>getModElements(m).filter(e=>['Heat','Cold','Electricity','Toxin'].includes(e)), getModSecondaryEls=m=>getModElements(m).filter(e=>['Blast','Radiation','Magnetic','Viral','Corrosive','Gas'].includes(e));
function getInnateEls(){if(S.cat==='Companion'||S.cat==='Companion Weapon')return[];const it=IT.get(S.item);if(!it)return[];const dmg=it.damage||{};const els=[];['heat','cold','electricity','toxin','blast','radiation','magnetic','viral','corrosive','gas'].forEach(k=>{if(dmg[k]&&dmg[k]>0)els.push(k.charAt(0).toUpperCase()+k.slice(1))});return els}
function getModAbilityBonus(m){const stats=getModLastStats(m);const result={str:0,dur:0,range:0,eff:0};const re=/([+-]?\d+(?:\.\d+)?)%\s+Ability\s+(Strength|Duration|Range|Efficiency)/gi;let match;while((match=re.exec(stats))){const val=+match[1],type=match[2].toLowerCase();if(type==='strength')result.str+=val;else if(type==='duration')result.dur+=val;else if(type==='range')result.range+=val;else if(type==='efficiency')result.eff+=val}return result}
function shardParse(v){if(!v)return null;const parts=String(v).split('|');if(parts.length<2)return null;return{color:parts[0],idx:+parts[1],tau:parts[2]!=='n'}}

function renderStats(){
  const box=$('#stats-panel'); if(!box)return;
  const ELC={Heat:'#ff6b3d',Cold:'#6bc9ff',Electricity:'#c06bff',Toxin:'#6bff7a',Blast:'#ff9e3d',Radiation:'#ffea6b',Magnetic:'#8a8aff',Viral:'#6bffc9',Corrosive:'#b8ff6b',Gas:'#a8ff6b'};
  const combo={'Heat|Cold':'Blast','Cold|Heat':'Blast','Heat|Electricity':'Radiation','Electricity|Heat':'Radiation','Heat|Toxin':'Gas','Toxin|Heat':'Gas','Cold|Electricity':'Magnetic','Electricity|Cold':'Magnetic','Cold|Toxin':'Viral','Toxin|Cold':'Viral','Electricity|Toxin':'Corrosive','Toxin|Electricity':'Corrosive'};
  let primaryModEls=[], secondaryModEls=[], convEl=null;
  if(isClaws()){for(const k of [0,1,2,3,4,5,6,7]){const s=getS(k),m=s&&M.get(s.u);if(m&&CONV_MODS[m.name]){convEl=CONV_MODS[m.name];break}}}
  for(const k of [0,1,2,3,4,5,6,7]){const s=getS(k),m=s&&M.get(s.u);if(!m)continue;getModPrimaryEls(m).forEach(e=>primaryModEls.push(e));getModSecondaryEls(m).forEach(e=>secondaryModEls.push(e))}
  const innateEls=getInnateEls(), innateSecondary=innateEls.filter(e=>['Blast','Radiation','Magnetic','Viral','Corrosive','Gas'].includes(e)), innatePrimary=innateEls.filter(e=>['Heat','Cold','Electricity','Toxin'].includes(e));
  const valEl=(special()&&S.elem)?[S.elem]:[], allPrimary=[...primaryModEls,...innatePrimary,...valEl];
  let finalEls=[];
  if(convEl){finalEls=[convEl,...innateSecondary,...secondaryModEls]}
  else{
    const used=new Set(), comboPairs=[];
    for(let i=0;i<allPrimary.length;i++){if(used.has(i))continue;let did=false;for(let j=i+1;j<allPrimary.length;j++){if(used.has(j))continue;const key=allPrimary[i]+'|'+allPrimary[j];if(combo[key]){comboPairs.push(combo[key]);used.add(i);used.add(j);did=true;break}}if(!did&&!used.has(i))comboPairs.push(allPrimary[i])}
    finalEls=[...innateSecondary,...secondaryModEls,...comboPairs]; if(!finalEls.length&&allPrimary.length)finalEls=allPrimary;
  }
  const combined=[...new Set(finalEls)].map(name=>({name}));
  const wf={str:100,dur:100,range:100,eff:100};
  for(const k of [0,1,2,3,4,5,6,7]){const s=getS(k),m=s&&M.get(s.u);if(!m)continue;const b=getModAbilityBonus(m);wf.str+=b.str;wf.dur+=b.dur;wf.range+=b.range;wf.eff+=b.eff}
  (S.shards||[]).forEach(sh=>{const p=shardParse(sh);if(!p)return;const statArr=SH[p.color]?(SH[p.color][p.tau?'t':'n']||[]):[];const stat=statArr[p.idx]||'';const num=parseFloat((stat.match(/(\d+(?:\.\d+)?)/)||[])[1]||'0');if(/Yetenek Gücü/i.test(stat))wf.str+=num;else if(/Yetenek Süresi/i.test(stat))wf.dur+=num});
  const effCapped=wf.eff>175; if(effCapped)wf.eff=175;
  const isWf=S.cat==='Warframe'||S.cat==='Necramech';
  if(!combined.length&&!isWf){box.classList.remove('on');box.innerHTML='';return}
  let html='<div class="stats-title">Stats</div>';
  if(combined.length&&!isWf){html+='<div class="stat-row"><span class="stat-lbl">Element:</span>'+combined.map((c,i)=>`${i>0?'<span class="muted">+</span>':''}<span class="el-chip" style="background:${ELC[c.name]||'#aaa'}">${c.name}</span>`).join('')+'</div>'}
  if(isWf){html+=`<div class="stat-row"><span class="wf-stat">Güç<b>${Math.round(wf.str*10)/10}%</b></span><span class="wf-stat">Süre<b>${Math.round(wf.dur*10)/10}%</b></span><span class="wf-stat">Menzil<b>${Math.round(wf.range*10)/10}%</b></span><span class="wf-stat${effCapped?' capped':''}">Verimlilik<b>${Math.round(wf.eff*10)/10}%</b>${effCapped?' ✦':''}</span></div>`}
  box.innerHTML=html; box.classList.add('on');
}

const AUP={madurai:'Ash Atlas Banshee Chroma Cyte-09 Ember Garuda Koumei Mag Mesa Nidus Nokko Oberon Oraxia Rhino Titania Uriel Valkyr Volt Wukong Yareli',vazarin:'Frost Gara Khora Qorvex Saryn Trinity Voruna Zephyr Follie Jade',naramon:'Baruuk Caliban Citrine Equinox Gauss Grendel Gyre Harrow Hildryn Hydroid Inaros Ivara Kullervo Lavos Limbo Loki Mirage Nezha Nova Nyx Octavia Revenant Styanax Temple Vauban Wisp Xaku',omni:'Dante Protea'};
function auraPol(n){if(/^Sevagoth (Prime )?Shadow/.test(n)||/^Excalibur (Prime|Umbra)/.test(n))return'madurai';const b=n.replace(/ (Prime|Umbra)$/,'');for(const k in AUP)if(AUP[k].split(' ').includes(b))return k;return''}
const baseP=k=>{const it=IT.get(S.item),n=it?.name||'';if(k==='aura')return S.cat==='Warframe'?(it?.auraPolarity||auraPol(n)):'';if(k==='au2')return S.cat==='Warframe'&&A2(n)?'omni':'';return(typeof k==='number'?it?.polarities?.[k]:it?.[{ex:'exilusPolarity',st:'stancePolarity'}[k]])||''};

const stash=()=>{leaveTgt();const d=Object.fromEntries(CF.map(k=>[k,S[k]]));if(S.cat!=='Zaw'&&S.cat!=='Kitgun'){d.parts={};S.cfgs.forEach(g=>{if(g.d)g.d.parts={}})}S.cfgs[S.ci].d=d};
function loadCfg(i,skip){if(!skip)stash();const keep=[...PO,'shards','exs'].map(k=>[k,S[k]]);S.ci=i;const d=S.cfgs[i].d||{};S.aura=d.aura??null;S.au2=d.au2??null;S.ex=d.ex??null;S.st=d.st??null;S.arcs=d.arcs?JSON.parse(JSON.stringify(d.arcs)):[];S.elem=d.elem||'';S.bonus=d.bonus??25;S.reactor=d.reactor??true;S.helm=d.helm?JSON.parse(JSON.stringify(d.helm)):{};S.evo=d.evo?JSON.parse(JSON.stringify(d.evo)):['','','','',''];S.parts=(d.parts&&S.cat!=='Zaw'&&S.cat!=='Kitgun')?JSON.parse(JSON.stringify(d.parts)):{};S.cn=d.cn||XC[S.cat]?.n||8;S.slots=(d.slots||[]).concat(Array(14).fill(null)).slice(0,14);keep.forEach(([k,v])=>S[k]=v);S.helm=S.helm||{};fitArcs()}
function renderCfg(){const e=S.tgt?S.exs[S.tgt]:null,L=e?e.cfgs:S.cfgs,ci=e?e.ci:S.ci;$('#cfgrow').innerHTML=L.map((c,i)=>{const name=esc(c.n||('Config '+(i+1)));if(RO||i===ci)return `<button data-cfg="${i}" class="${i===ci?'on':''}">${name}</button>`;return `<span style="display:inline-flex;margin:0;gap:0;"><button data-cfg="${i}" style="border-radius:6px 0 0 6px;">${name}</button><button data-cfgcopy="${i}" title="Kopyala" style="padding:0 .45rem;border-left:0;border-radius:0 6px 6px 0;">⧉</button></span>`}).join('')+(RO?'':`<button data-cfgadd="1">+</button><input type="text" id="cfgname" value="${esc(L[ci].n)}"><button data-cfgdel="1">Sil</button>`)}
function renderAbil(){const it=IT.get(S.item),box=$('#abil');if(S.cat!=='Warframe'||!it?.abilities){box.innerHTML='';return}box.innerHTML='<div class="abh">Yetenekler</div>'+it.abilities.slice(0,4).map((a,i)=>{const h=AB.get(S.helm[i]),x=h||a;return `<div class="abrow"><span class="abn">${i+1}.</span><button class="ab ${h?'sw':''}" lang="en" data-ab="${i}" title="${esc(x.description||'')}"><img src="${IMG+esc(x.imageName)}" draggable="false">${h?`<s>${esc(a.name)}</s><b>${esc(h.name)}</b>`:`<span>${esc(a.name)}</span>`}</button></div>`}).join('')+(abPick!==null?`<select id="hsel"><option value="">Orijinal</option>${[...AB.values()].filter(x=>x.own!==it.name).sort((a,b)=>a.name.localeCompare(b.name)).map(x=>`<option value="${esc(x.uniqueName)}">${esc(x.name)} (${esc(x.own)})</option>`).join('')}</select>`:'')}
function renderRiv(){const mel=/Melee|Zaw/.test(S.cat),B=RS.common.concat(mel?RS.melee:RS.ranged),P=RS.spl.concat(mel?RS.splm:RS.splr),o=(p,l)=>l.map(x=>`<option value="${p}|${esc(x)}">${esc(x)}</option>`).join('');const opts=`<option value="">+ Stat Ekle</option><optgroup label="Pozitif">${o('p',B)}</optgroup><optgroup label="Spliced">${o('s',P)}</optgroup><optgroup label="Negatif">${o('n',B)}</optgroup>`;$('#rivs').innerHTML=S.riv.map((r,i)=>`<div class="riv"><div class="row" style="margin:0"><input type="text" data-rivn="${i}" value="${esc(r.n)}" placeholder="Riven Adı"><button class="x2" data-rmriv="${i}">×</button></div><span class="dis">Disposition ×1.20 · S-tier</span>${r.st.map((t,j)=>`<div class="rs ${t.s<0?'neg':''} ${t.sp?'sp':''}"><span>${t.s<0?'−':'+'} ${esc(t.k)}${t.sp?' (spliced)':''}</span><button data-rmst="${i}.${j}">×</button></div>`).join('')}<select data-rivadd="${i}">${opts}</select></div>`).join('')}
function openByName(n){const b=saved.find(x=>(x.name||'').trim().toLowerCase()===n.trim().toLowerCase());if(!b){msg('Build bulunamadı: '+n);return}const warn=S.tgt?'Alt formdaki değişiklikler kaybolacak. ':'';if(ADMIN&&!confirm(warn+'Devam?'))return;if(S.id&&S.id!==b.id)navStack.push(S.id);loadBuild(b);openView();renderAll();scrollTo({top:0,behavior:'smooth'})}

const PF=['cat','item','slots','pols','aura','au2','a2pol','ex','st','apol','expol','stpol','arcs','elem','bonus','reactor','cn'];
function guessCat(u){if(u.startsWith('claw:'))return'Companion Weapon';if(u==='sevashadowp'||u==='sevashadow'||u==='sirius'||u==='orion'||u==='siriusorion')return'Warframe';if(u==='venari')return'Companion';if(u==='venariclaws')return'Companion Weapon';if(DATA.items.Archgun.some(i=>i.uniqueName===u))return'Archgun';const n=IT.get(u)?.name||'';return/Bow|Balefire|Neutralizer|Arquebex/.test(n)?'Primary':/Regulators|Pixia|Glory|Noctua/.test(n)?'Secondary':'Melee'}
const exList=()=>{
  const pc=S.tgt?S.par.cat:S.cat,pi=S.tgt?S.par.item:S.item,it=IT.get(pi),nm=it?.name||'';
  if(pi==='siriusorion') return ['sirius','orion'];
  if(!['Warframe','Companion','Necramech'].includes(pc))return[];
  const ex=Array.isArray(it?.exalted)?it.exalted.filter(u=>IT.get(u)&&!/^Mausolon$/i.test(IT.get(u)?.name||'')):[];
  if(pc==='Warframe'&&/^Sevagoth/.test(nm))return[/Prime/.test(nm)?'sevashadowp':'sevashadow',...ex];
  if(pc==='Warframe'&&/^Khora/.test(nm))return[...ex,'venari','venariclaws'];
  if(pc==='Companion'&&IT.get('claw:'+pi))return['claw:'+pi];
  return ex;
};
const EF=['slots','reactor','aura','au2','ex','st','arcs','cn'];
function tgtNorm(u){let e=(S.exs=S.exs||{})[u];if(!e)e={cfgs:[{n:'Config 1',d:null}],ci:0};else if(!e.cfgs)e={cat:e.cat,ci:0,cfgs:[{n:e.n||'Config 1',d:{slots:e.slots,reactor:e.reactor,aura:e.aura,ex:e.ex,st:e.st,arcs:e.arcs}}],po:{pols:e.pols,apol:e.apol,expol:e.expol,stpol:e.stpol}};return S.exs[u]=e}
function tgtLoad(i){const e=S.exs[S.tgt],it=IT.get(S.tgt),d=JSON.parse(JSON.stringify(e.cfgs[i].d||{})),po=e.po||{};const keepShards=S.shards.slice();e.ci=i;S.slots=(d.slots||[]).concat(Array(14).fill(null)).slice(0,14);S.reactor=d.reactor??true;S.aura=d.aura||null;S.au2=d.au2||null;S.ex=d.ex||null;S.st=d.st||null;S.arcs=d.arcs||[];S.elem='';S.cn=d.cn||XC[S.cat]?.n||8;S.pols=po.pols||Array.from({length:14},(_,k)=>it?.polarities?.[k]||'');S.apol=po.apol??(it?.auraPolarity||auraPol(it?.name||''));S.a2pol=po.a2pol??(A2(it?.name)?'omni':'');S.expol=po.expol??(it?.exilusPolarity||'');S.stpol=po.stpol??(it?.stancePolarity||'');S.shards=keepShards;fitArcs()}
function tgtSave(){const e=S.exs[S.tgt];e.cat=S.cat;e.cfgs[e.ci].d=Object.fromEntries(EF.map(k=>[k,S[k]]));e.po={pols:S.pols,apol:S.apol,a2pol:S.a2pol,expol:S.expol,stpol:S.stpol}}
function enterTgt(u){
  if(S.tgt)leaveTgt();
  S.par=Object.fromEntries(PF.map(k=>[k,S[k]]));
  const e=tgtNorm(u);
  let gc = (u === 'sirius' || u === 'orion') ? 'Warframe' : guessCat(u);
  if(!e.cat || (e.cat==='Warframe'&&gc!=='Warframe') || IT.get(u)?.name==='Glory' || gc==='Warframe'){
    e.cat = gc;
  }
  S.tgt=u; S.item=u; S.cat=e.cat; tgtLoad(e.ci||0);
}
function leaveTgt(){if(!S.tgt)return;tgtSave();Object.assign(S,S.par);S.par=null;S.tgt=null}
function renderTgt(){const l=exList(),box=$('#tgtrow'),cur=S.tgt?S.par.item:S.item;$('#builder').classList.toggle('intgt',!!S.tgt);if(!l.length){box.innerHTML='';return}box.innerHTML='<h2 style="margin-top:.8rem">Diğer</h2><div class="row">'+(cur==='siriusorion'?'':`<button data-tgt="" class="${S.tgt?'':'on'}" lang="en">${esc(IT.get(cur)?.name||'')}</button>`)+l.map(u=>`<button data-tgt="${esc(u)}" class="${S.tgt===u?'on':''}" lang="en">${esc(IT.get(u).name)}</button>`).join('')+(S.tgt&&!RO&&!/^(venari|sevashadow|claw:|sirius|orion)/.test(S.tgt)?`<select id="excat">${['Melee','Primary','Secondary','Archgun'].map(c=>`<option ${c===S.cat?'selected':''}>${c}</option>`).join('')}</select>`:'')+'</div>'}
function renderEvo(){$('#evbox').hidden=S.cat==='Warframe'||!!S.tgt||(RO&&!S.evo.some(Boolean));$('#evs').innerHTML=S.evo.map((t,i)=>`<label class="evl">Evo ${i+1}<textarea data-evo="${i}" rows="2" placeholder="Evo ${i+1} açıklaması">${esc(t)}</textarea></label>`).join('');if(RO)document.querySelectorAll('#evs textarea').forEach(n=>n.readOnly=true)}
function renderParts(){const box=$('#partbox'),spec=S.cat==='Zaw'?[['Strike',ZP.Strike],['Grip',ZP.Grip],['Link',ZP.Link]]:S.cat==='Kitgun'?[['Chamber',KP.Chamber],['Grip',KP.Grip[S.item==='kg-s'?'Secondary':'Primary']],['Loader',KP.Loader]]:null;if(!spec||S.tgt){box.innerHTML='';return}box.innerHTML=`<div class="row">${spec.map(([k,l])=>`<label>${k} <select data-part="${k}"><option value="">—</option>${l.map(n=>`<option ${S.parts[k]===n?'selected':''}>${esc(n)}</option>`).join('')}</select></label>`).join('')}</div><div class="notev">${spec.map(([k,l])=>l.includes(S.parts[k])?`<b>${esc(S.parts[k])}</b> <span class="muted">(${k})</span>`:'').filter(Boolean).join(' · ')}</div>`}

function calcWith(d,P){const keep=Object.fromEntries([...CF,...PO].map(k=>[k,S[k]]));Object.assign(S,d,P);const r=calc();Object.assign(S,keep);return r}
function autoForma(){
  const isTgt=!!S.tgt;
  if(isTgt)tgtSave();else{const d=Object.fromEntries(CF.map(k=>[k,S[k]]));if(S.cat!=='Zaw'&&S.cat!=='Kitgun'){d.parts={};S.cfgs.forEach(g=>{if(g.d)g.d.parts={}})}S.cfgs[S.ci].d=d}
  const cfgs=isTgt?S.exs[S.tgt].cfgs:S.cfgs,ds=cfgs.map(c=>c.d).filter(Boolean),pn={aura:'apol',au2:'a2pol',ex:'expol',st:'stpol'};
  const P={pols:S.pols.slice(),apol:S.apol,a2pol:S.a2pol,expol:S.expol,stpol:S.stpol},gp=k=>typeof k==='number'?P.pols[k]:P[pn[k]],sp=(k,v)=>{typeof k==='number'?P.pols[k]=v:P[pn[k]]=v};
  const modsAt=k=>ds.map(d=>typeof k==='number'?d.slots?.[k]:d[k]).filter(Boolean).map(x=>M.get(x.u)).filter(m=>m&&m.polarity);
  const tot=()=>ds.reduce((a,d)=>{const r=calcWith(d,P);return[a[0]+Math.max(0,r.used-r.cap),a[1]+r.used]},[0,0]);
  for(const k of ['aura','au2','st']){if(!hasK(k))continue;const m=modsAt(k)[0];if(m)sp(k,m.polarity)}
  for(let i=0;i<40;i++){const[o0,u0]=tot();if(o0===0)break;let best=null;for(const k of KEYS()){if(k==='aura'||k==='au2'||k==='st')continue;for(const pol of new Set(modsAt(k).map(m=>m.polarity))){if(pol===gp(k))continue;const old=gp(k);sp(k,pol);const[o1,u1]=tot();sp(k,old);const sc=(o0-o1)*1000+(u0-u1);if(o1<o0&&(!best||sc>best.sc))best={k,pol,sc}}}if(!best)break;sp(best.k,best.pol)}
  S.pols=P.pols;S.apol=P.apol;S.a2pol=P.a2pol;S.expol=P.expol;S.stpol=P.stpol;
  if(isTgt){const e=S.exs[S.tgt];e.cfgs[e.ci].d=Object.fromEntries(EF.map(k=>[k,S[k]]));e.po={pols:S.pols,apol:S.apol,a2pol:S.a2pol,expol:S.expol,stpol:S.stpol}}else{const d=Object.fromEntries(CF.map(k=>[k,S[k]]));S.cfgs[S.ci].d=d}
  const fm=KEYS().filter(k=>gp(k)!==baseP(k)).length,o=tot()[0];msg(fm+' forma kullanıldı'+(o>0?' (kapasite aşılıyor).':''))
}
function resetPolarities(){if(!confirm('Polariteler sıfırlanacak. Devam?'))return;const it=IT.get(S.item);S.pols=Array.from({length:14},(_,i)=>it?.polarities?.[i]||'');S.apol=S.cat==='Warframe'?(it?.auraPolarity||auraPol(it?.name||'')):'';S.a2pol=S.cat==='Warframe'&&A2(it?.name)?'omni':'';S.expol=it?.exilusPolarity||'';S.stpol=it?.stancePolarity||'';renderBuilder();msg('Polariteler sıfırlandı.')}
function resetCurrentBuild(){if(!confirm('Mevcut config sıfırlanacak. Devam?'))return;const isTgt=!!S.tgt;if(isTgt){tgtSave();const e=S.exs[S.tgt],cur=e.cfgs[e.ci].d||{};e.cfgs[e.ci].d={...cur,slots:Array(14).fill(null),arcs:[],aura:null,au2:null,ex:null,st:null,helm:{}};tgtLoad(e.ci)}else{stash();const cur=S.cfgs[S.ci].d||{};S.cfgs[S.ci].d={...cur,slots:Array(14).fill(null),arcs:[],aura:null,au2:null,ex:null,st:null,helm:{}};loadCfg(S.ci,true)}renderBuilder();msg('Sıfırlandı.')}

const CK={normal:'Normal',aura:'Aura',stance:'Stance',exilus:'Exilus'};
function syncCM(){DATA.mods=DATA.mods.filter(m=>!m.custom);[...M.keys()].forEach(k=>{if(k.startsWith('custom:'))M.delete(k)});CM.slice().reverse().forEach(c=>{const m={uniqueName:'custom:'+c.id,name:c.name,custom:true,ck:c.ck,type:'Custom Mod',polarity:c.polarity||'',baseDrain:(c.ck==='aura'||c.ck==='stance')?-c.drain:c.drain,fusionLimit:c.rank,isUtility:c.ck==='exilus',description:c.desc||'',imageName:''};M.set(m.uniqueName,m);DATA.mods.unshift(m)})}
function renderCm(){const b=$('#cmlist');if(!b)return;b.innerHTML=CM.map(c=>`<div class="bl"><span><b lang="en">${esc(c.name)}</b> <small class="muted">${CK[c.ck]} · ${esc(polLabel(c.polarity)||'Nötr')} · Drain ${c.drain} · Rank ${c.rank}${c.desc?' · '+esc(c.desc):''}</small></span><button data-cmdel="${c.id}">Sil</button></div>`).join('')}
function linkSuggest(ta){const pop=$('#linkpop'),m=ta.value.slice(0,ta.selectionStart).match(/\[\[([^\]\n]*)$/);if(!m||RO){pop.hidden=true;return}const q=m[1].toLowerCase(),names=[...new Set(saved.map(b=>b.name).filter(Boolean))].filter(n=>n.toLowerCase().includes(q)&&n!==S.name).slice(0,8);if(!names.length){pop.hidden=true;return}pop.innerHTML=names.map(n=>`<button type="button" data-lk="${esc(n)}">${esc(n)}</button>`).join('');pop.hidden=false}

const SH={Crimson:{n:['+%10 Yetenek Gücü','+%10 Yetenek Süresi','+%25 Yakın Dövüş Kritik Hasarı','+%25 Birincil Durum Şansı','+%25 İkincil Kritik Şansı'],t:['+%15 Yetenek Gücü','+%15 Yetenek Süresi','+%37.5 Yakın Dövüş Kritik Hasarı','+%37.5 Birincil Durum Şansı','+%37.5 İkincil Kritik Şansı']},Amber:{n:['Doğuşta Max Enerjinin %30\'u dolu','+%100 Can Küresi Etkinliği','+%50 Enerji Küresi Etkinliği','+%25 Yetenek Hızı','+%15 Parkur Hızı'],t:['Doğuşta Max Enerjinin %45\'i dolu','+%150 Can Küresi Etkinliği','+%75 Enerji Küresi Etkinliği','+%37.5 Yetenek Hızı','+%22.5 Parkur Hızı']},Azure:{n:['+150 Max Can','+%150 Kalkan Kapasitesi','+%50 Max Enerji','+%150 Zırh','+5 Can/sn Yenilenme'],t:['+225 Max Can','+%225 Kalkan Kapasitesi','+%75 Max Enerji','+%225 Zırh','+7.5 Can/sn Yenilenme']},Topaz:{n:['Blast ile öldürülen her düşman için +1 Max Can','Blast ile öldürünce +5 Kalkan','Heat durumlu düşman öldürünce +%1 İkincil Kritik Şansı (maks. %50)','Radiation durumlu düşmanlara +%10 Yetenek Hasarı'],t:['Blast ile öldürülen her düşman için +2 Max Can','Blast ile öldürünce +7.5 Kalkan','Heat durumlu düşman öldürünce +%1.5 İkincil Kritik Şansı (maks. %75)','Radiation durumlu düşmanlara +%15 Yetenek Hasarı']},Violet:{n:['Electricity durumlu düşmanlara +%10 Yetenek Hasarı','+%30 Birincil Electricity Hasarı','+%25 Yakın Dövüş Kritik Hasarı','Can küreleri +%20 Enerji verir'],t:['Electricity durumlu düşmanlara +%15 Yetenek Hasarı','+%45 Birincil Electricity Hasarı','+%37.5 Yakın Dövüş Kritik Hasarı','Can küreleri +%30 Enerji verir']},Emerald:{n:['Toxin durum etkileri +%30 daha fazla hasar','Toxin durum etkisiyle hasar alan düşmandan +2 Can','Corrosion durumlu düşmanlara +%10 Yetenek Hasarı','Corrosion en fazla +2 stack'],t:['Toxin durum etkileri +%45 daha fazla hasar','Toxin durum etkisiyle hasar alan düşmandan +3 Can','Corrosion durumlu düşmanlara +%15 Yetenek Hasarı','Corrosion en fazla +3 stack']}};
const SC={Crimson:'#c0443c',Amber:'#e0b04a',Azure:'#4c9bd6',Topaz:'#e08a3c',Violet:'#9b6fd1',Emerald:'#4cb07a'};
function renderShards(){const box=$('#shbox');box.hidden=S.cat!=='Warframe'||!!S.tgt||isNecExalt()||(RO&&!S.shards.some(Boolean));if(box.hidden)return;const optsFor=v=>{const p=shardParse(v);return Object.keys(SH).map(c=>`<optgroup label="${c}">${SH[c].t.map((d,i)=>`<option value="${c}|${i}|t" ${p&&p.color===c&&p.idx===i&&p.tau?'selected':''}>${c} (Tau): ${esc(d)}</option>`).join('')}${SH[c].n.map((d,i)=>`<option value="${c}|${i}|n" ${p&&p.color===c&&p.idx===i&&!p.tau?'selected':''}>${c} (Normal): ${esc(d)}</option>`).join('')}</optgroup>`).join('')};$('#shards').innerHTML=Array.from({length:5},(_,i)=>{const v=S.shards[i],p=shardParse(v),c=p?p.color:'';return `<div class="${v?'sf':''}" style="border-left-color:${SC[c]||'var(--ln)'}"><select data-sh="${i}"><option value="">Shard ${i+1}: Boş</option>${optsFor(v)}</select>${p?`<div class="shd"><b style="color:${SC[c]}">${c}${p.tau?' (Tau)':''}</b> · ${esc((SH[c][p.tau?'t':'n']||[])[p.idx]||'')}</div>`:''}</div>`}).join('')}
function renderNote(){$('#note').value=S.note||'';$('#note').readOnly=RO;$('#notebox').hidden=RO&&!S.note&&!S.imgs.length;$('#notev').innerHTML=esc(S.note).replace(/\n/g,'<br>').replace(/\[\[([^\]]+)\]\]/g,(m,n)=>`<a href="#" data-bl="${n}">${n}</a>`);$('#rivbox').hidden=isNecExalt()||!RIVCAT.includes(S.cat)||(RO&&!S.riv.length);renderRiv();$('#gal').innerHTML=S.imgs.map((u,i)=>`<figure><img src="${esc(u)}" referrerpolicy="no-referrer" loading="lazy"><button class="x" data-rmimg="${i}">×</button></figure>`).join('')}
function renderList(){const q=$('#q').value.trim().toLowerCase();let rows;if(tab==='mods')rows=DATA.mods.filter(m=>(m.custom||modRe().test(m.type||''))&&(!q||m.name.toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name));else{const sl=arcSlots();rows=sl.length?DATA.arcanes.filter(a=>sl.some(t=>ARC[t].test(a.type||''))&&(!q||a.name.toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name)):[]}const total=rows.length;rows=rows.slice(0,150);$('#list').innerHTML=rows.map(m=>`<button class="card" lang="en" data-${tab==='mods'?'mod':'arc'}="${esc(m.uniqueName)}" title="${esc(statsOf(m))}">${m.imageName?`<img src="${IMG+esc(m.imageName)}" loading="lazy" draggable="false">`:''}<b>${esc(m.name)}</b><small>${tab==='mods'?`${esc(polLabel(m.polarity)||'-')} · Drain ${Math.abs(m.baseDrain||0)} · Rank ${maxRank(m)}`:esc(m.type||'Arcane')}</small></button>`).join('')+(total>150?`<p class="muted">${total} sonuçtan ilk 150 gösteriliyor.</p>`:'')||'<p class="muted">Sonuç yok.</p>'}
function renderSaved(){
  const q=($('#bq')?.value||'').trim().toLowerCase(),bc=b=>b.cat==='Warframe'?'wf':/^(Primary|Secondary|Melee)$/.test(b.cat)?'wp':/^Companion/.test(b.cat)?'pet':'oth';
  $('#bcats').innerHTML=[['all','Tümü'],['wf','Warframeler'],['wp','Silahlar'],['pet','Yoldaşlar'],['oth','Diğer Buildler'],['guide','Rehberler']].map(([k,l])=>`<button data-bc="${k}" class="${k===bcat?'on':''}">${l}</button>`).join('');
  let html='';
  if(bcat==='guide'||bcat==='all'){
    const gr=guides.filter(g=>!q||[g.name,g.note].join(' ').toLowerCase().includes(q)).sort((a,b)=>(a.name||'').localeCompare(b.name||''));
    if(gr.length)html+=gr.map(g=>`<div class="bl"><span><b>${esc(g.name||'Adsız Rehber')}</b> <small class="muted">Rehber</small></span><button data-guide-open="${g.id}">${ADMIN?'Düzenle':'Aç'}</button>${ADMIN?`<button data-gdel="${g.id}">Sil</button>`:''}</div>`).join('');
    else if(bcat==='guide')html+=`<p class="muted">${guides.length?'Aramaya uyan rehber yok.':'Henüz rehber yok.'}</p>`;
  }
  if(bcat!=='guide'){
    const rows=saved.filter(b=>(bcat==='all'||bc(b)===bcat)&&(!q||[b.name,IT.get(b.item)?.name,b.elem,b.note].join(' ').toLowerCase().includes(q))).sort((a,b)=>(a.name||'').localeCompare(b.name||''));
    html+=rows.length?rows.map(b=>`<div class="bl"><span><b>${esc(b.name||'Adsız')}</b> <small class="muted">${esc(b.item==='custom'&&b.cname?b.cname:IT.get(b.item)?.name||'')}${b.elem?' · '+esc(b.elem)+' %'+esc(b.bonus):''}</small></span><button data-load="${b.id}">${ADMIN?'Düzenle':'Aç'}</button><button data-share="${b.id}">Bağlantı Kopyala</button>${ADMIN?`<button data-del="${b.id}">Sil</button>`:''}</div>`).join(''):`<p class="muted">${saved.length?'Aramaya uyan build yok.':'Henüz kayıtlı build yok.'}</p>`;
  }
  $('#bl').innerHTML=html;
}

function guideNoteHTML(note){
  return esc(note).replace(/\n/g,'<br>').replace(/\[\[([^\]]+)\]\]/g,(m,n)=>`<a href="#" data-bl="${esc(n)}">${esc(n)}</a>`);
}
function renderGuideGal(){
  $('#ggal').innerHTML=guideImgs.map((u,i)=>`<figure><img src="${esc(u)}" referrerpolicy="no-referrer" loading="lazy"><button class="x" data-grmimg="${i}">×</button></figure>`).join('');
}
function openGuide(g){
  curGuide=g||{id:'g'+Date.now().toString(36),name:'',note:'',imgs:[]};
  guideImgs=[...(curGuide.imgs||[])];
  $('#gname').value=curGuide.name||'';
  $('#gnote').value=curGuide.note||'';
  renderGuideGal();
  $('#gdelete').hidden=!g||RO;
  if(RO){
    $('#gname').readOnly=true; $('#gnote').readOnly=true;
    $('#gview').innerHTML=`<h2>${esc(curGuide.name||'')}</h2><div class="notev">${guideNoteHTML(curGuide.note||'')}</div>`;
    $('#gview').hidden=false;
    $('#gsave').hidden=true; $('#gdelete').hidden=true; $('#gimgrow').hidden=true;
    $('#gnote').style.display='none';
    $('#gcancel').textContent='Kapat';
  }else{
    $('#gname').readOnly=false; $('#gnote').readOnly=false;
    $('#gview').hidden=true;
    $('#gsave').hidden=false; $('#gimgrow').hidden=false;
    $('#gnote').style.display='';
    $('#gcancel').textContent='İptal';
  }
  $('#guidemodal').hidden=false;
}

function place(u,k){const m=M.get(u);if(!m)return false;if(!hasK(k)||!canPlace(m,k)){msg('Bu mod bu yuvaya takılamaz.');return false}if(KEYS().some(x=>x!==k&&getS(x)&&M.get(getS(x).u)?.name===m.name)){msg('Aynı mod iki kez kullanılamaz.');return false}if(CONV_MODS[m.name]&&isClaws()){const conflict=KEYS().find(x=>{const s=getS(x),mm=s&&M.get(s.u);return mm&&mm.name!==m.name&&CONV_MODS[mm.name]});if(conflict!==undefined){msg('Sadece 1 dönüşüm modu takılabilir: '+M.get(getS(conflict).u).name);return false}}msg('');setS(k,{u,r:maxRank(m)});return true}
function autoKey(m){if(m.custom){if(isAura(m)){if(hasK('aura')&&!getS('aura'))return'aura';if(hasK('au2')&&!getS('au2'))return'au2'}if(isSt(m)&&hasK('st')&&!getS('st'))return'st';if(m.isUtility&&hasK('ex')&&!getS('ex'))return'ex';for(let i=0;i<NG();i++)if(!S.slots[i])return i;if(hasK('ex')&&!getS('ex'))return'ex';if(hasK('aura')&&!getS('aura'))return'aura';if(hasK('au2')&&!getS('au2'))return'au2';if(hasK('st')&&!getS('st'))return'st';return null}if(isAura(m))return!S.aura||!hasK('au2')?'aura':!S.au2?'au2':'aura';if(isSt(m))return'st';if(m.isUtility&&hasK('ex')&&!getS('ex'))return'ex';for(let i=0;i<NG();i++)if(!S.slots[i])return i;return null}
function addMod(u){const m=M.get(u);if(!m)return;const k=autoKey(m);if(k===null){msg('Boş yuva kalmadı.');return}place(u,k);renderBuilder()}
function swap(a,b){const x=getS(a),y=getS(b),mx=x&&M.get(x.u),my=y&&M.get(y.u);if(mx&&canPlace(mx,b)&&(!my||canPlace(my,a))){setS(a,y);setS(b,x)}else msg('Takılamaz.')}
function placeArc(u,i){const a=A.get(u),sl=arcSlots(),t=sl[i];if(!t||!a||!ARC[t].test(a.type||'')){msg('Bu arcane takılamaz.');return false}if(S.arcs.some((x,j)=>x===u&&j!==i)){msg('Aynı arcane iki kez takılamaz.');return false}msg('');S.arcs[i]=u;return true}
function addArc(u){const a=A.get(u),sl=arcSlots(),ok=t=>ARC[t].test(a.type||'');let i=sl.findIndex((t,j)=>!S.arcs[j]&&ok(t));if(i<0)i=sl.findIndex(ok);if(i<0){msg('Uygun yuva yok.');return}placeArc(u,i);renderBuilder()}
function swapArc(a,b){const sl=arcSlots(),x=S.arcs[a],y=S.arcs[b],ok=(u,i)=>!u||ARC[sl[i]].test(A.get(u)?.type||'');if(ok(x,b)&&ok(y,a)){S.arcs[a]=y;S.arcs[b]=x}else msg('Takılamaz.')}
function drop(src,t,inBrowser){const tk=t?.dataset?.key,ta=t?.dataset?.ai;if(src.k==='mod'){if(tk!==undefined)place(src.u,pk(tk))}else if(src.k==='slot'){if(tk!==undefined){if(pk(tk)!==src.key)swap(src.key,pk(tk))}else if(inBrowser)setS(src.key,null)}else if(src.k==='arc'){if(ta!==undefined)placeArc(src.u,+ta)}else if(src.k==='aslot'){if(ta!==undefined){if(+ta!==src.i)swapArc(src.i,+ta)}else if(inBrowser)S.arcs[src.i]=null}renderBuilder()}
const cur=()=>{const t=S.tgt;stash();const o=JSON.parse(JSON.stringify({id:S.id||('b'+Date.now().toString(36)),name:S.name,cname:S.cname,cat:S.cat,item:S.item,note:S.note,imgs:S.imgs,riv:S.riv,pols:S.pols,apol:S.apol,a2pol:S.a2pol,expol:S.expol,stpol:S.stpol,shards:S.shards,cn:S.cn,exs:S.exs,cfgs:S.cfgs}));if(t)enterTgt(t);return o};
function loadBuild(b){const c=JSON.parse(JSON.stringify(b));S={...blank(),...c};if(c.cfgs?.length)Object.assign(S,c.cfgs[0].d||{});else S.cfgs=[{n:'Config 1',d:null}];S.ci=0;S.slots=(S.slots||[]).concat(Array(14).fill(null)).slice(0,14);S.arcs=S.arcs||[];S.helm=S.helm||{};S.shards=S.shards||Array(5).fill(null);S.exs=S.exs||{};S.evo=S.evo||['','','','',''];S.riv=S.riv||[];if(!c.cfgs&&!c.pols){S.item=c.item;applyPols()}selectCat(S.cat);if(S.cat!=='Zaw'&&S.cat!=='Kitgun')S.parts={};if(S.cat==='Warframe'&&!S.apol){const n0=IT.get(S.item)?.name||'';S.apol=auraPol(n0);if(A2(n0)&&!S.a2pol)S.a2pol='omni'}try{if(S.id)history.replaceState(null,'',location.pathname+location.search+'#b='+btoa(unescape(encodeURIComponent(JSON.stringify({...b,imgs:[]})))))}catch(e){}if(S.item==='siriusorion'&&!S.tgt)enterTgt('sirius')}
const link=b=>location.origin+location.pathname+'#b='+btoa(unescape(encodeURIComponent(JSON.stringify({...b,imgs:[]}))));
const SELQ='[data-mod],[data-arc],.slot.f,.aslot.f';
function startDrag(){drag.on=true;const g=drag.el.cloneNode(true);g.classList.add('ghost');g.style.width=drag.el.offsetWidth+'px';document.body.append(g);drag.g=g;drag.el.classList.add('dragging');moveGhost(drag.x,drag.y)}
function moveGhost(x,y){drag.g.style.left=x-drag.g.offsetWidth/2+'px';drag.g.style.top=y-20+'px';document.querySelectorAll('.over').forEach(n=>n.classList.remove('over'));document.elementFromPoint(x,y)?.closest('.slot,.aslot')?.classList.add('over')}
function endDrag(){if(!drag)return;clearTimeout(drag.tm);drag.g?.remove();drag.el.classList.remove('dragging');document.querySelectorAll('.over').forEach(n=>n.classList.remove('over'));drag=null}
document.addEventListener('pointerdown',e=>{if(RO)return;const el=e.target.closest(SELQ);if(!el||e.target.closest('input,.x,.pb'))return;const d=el.dataset;const src=d.mod?{k:'mod',u:d.mod}:d.arc?{k:'arc',u:d.arc}:d.key!==undefined?{k:'slot',key:pk(d.key)}:{k:'aslot',i:+d.ai};drag={el,src,x:e.clientX,y:e.clientY,on:false,touch:e.pointerType!=='mouse'};if(drag.touch)drag.tm=setTimeout(()=>{if(drag)startDrag()},300)});
document.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.on){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<(drag.touch?12:6))return;if(drag.touch){endDrag();return}startDrag()}moveGhost(e.clientX,e.clientY)});
document.addEventListener('pointerup',e=>{if(!drag)return;if(drag.on){const t=document.elementFromPoint(e.clientX,e.clientY);drop(drag.src,t?.closest('.slot,.aslot'),!!t?.closest('#browser'));sup=true;setTimeout(()=>sup=false,50)}endDrag()});
document.addEventListener('pointercancel',endDrag);
document.addEventListener('touchmove',e=>{if(drag&&drag.on)e.preventDefault()},{passive:false});

$('#itembtn').addEventListener('click',()=>{const box=$('#buildlistro');if(!box.hidden){box.hidden=true;return}const rows=saved.slice().sort((a,b)=>(a.name||'').localeCompare(b.name||''));box.innerHTML='<h2>Tüm Buildler</h2>'+(rows.length?rows.map(b=>`<button data-load="${b.id}">${esc(b.name||'Adsız')} <small class="muted">— ${esc(IT.get(b.item)?.name||'')}</small></button>`).join(''):'<p class="muted">Kayıtlı build yok.</p>');box.hidden=false});

document.addEventListener('click',e=>{
  if(sup)return;
  const bl=e.target.closest('[data-bl]');if(bl){e.preventDefault();$('#guidemodal').hidden=true;openByName(bl.dataset.bl);return}
  if(e.target.matches('#gal img, #ggal img')){e.target.classList.toggle('big');return}
  const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(RO&&!d.load&&!d.share&&d.cfg===undefined&&d.tgt===undefined&&!d.back&&!d.prevb&&d.bc===undefined&&d.guideOpen===undefined)return;
  if(d.cat){if(S.id&&d.cat!==S.cat){S=blank();msg('Yeni build başladı.')}if(d.cat!==S.cat)navStack.length=0;selectCat(d.cat);renderAll()}
  else if(d.tab){tab=d.tab;document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b===t));renderList()}
  else if(d.mod)addMod(d.mod); else if(d.arc)addArc(d.arc);
  else if(d.pol!==undefined){const k=pk(d.pol);setP(k,omniOn?'omni':POLS[(POLS.indexOf(getP(k))+1)%POLS.length]);renderBuilder()}
  else if(d.rm!==undefined){setS(pk(d.rm),null);renderBuilder()}
  else if(d.cadd){S.cn=Math.min(14,NG()+1);cleanMods();renderBuilder()}
  else if(d.cdel){S.cn=Math.max(1,NG()-1);cleanMods();renderBuilder()}
  else if(d.cmdel){CM=CM.filter(c=>c.id!==d.cmdel);if(!CMD.includes(d.cmdel))CMD.push(d.cmdel);saveCMD();saveCM();syncCM();renderAll();msg('Custom mod silindi.')}
  else if(d.lk!==undefined){const ta=$('#note'),pos=ta.selectionStart??ta.value.length,pre=ta.value.slice(0,pos),m=pre.match(/\[\[([^\]\n]*)$/);if(m){const ins='[['+d.lk+']]';S.note=pre.slice(0,m.index)+ins+ta.value.slice(pos);renderNote();const np=m.index+ins.length;ta.focus();ta.setSelectionRange(np,np)}$('#linkpop').hidden=true}
  else if(d.prevb){const id=navStack.pop(),b=saved.find(x=>x.id===id);if(b){loadBuild(b);openView();renderAll();scrollTo({top:0,behavior:'smooth'})}else msg('Bulunamadı.')}
  else if(d.fwd){$('#'+d.fwd).click()}
  else if(d.ghsync){syncToGitHub()}
  else if(d.ghset){const repo=prompt('Repo:',localStorage.getItem('gh_repo')||'');if(repo!==null)localStorage.setItem('gh_repo',repo.trim());const branch=prompt('Branch:',localStorage.getItem('gh_branch')||'main');if(branch!==null)localStorage.setItem('gh_branch',branch.trim()||'main');const token=prompt('PAT:',localStorage.getItem('gh_token')||'');if(token!==null)localStorage.setItem('gh_token',token.trim());msg('Ayarlar kaydedildi.')}
  else if(d.guide){openGuide(null)}
  else if(d.guideOpen!==undefined){const g=guides.find(x=>x.id===d.guideOpen);if(g)openGuide(g)}
  else if(d.gdel){if(confirm('Rehber silinsin mi?')){guides=guides.filter(x=>x.id!==d.gdel);persistGuides();renderSaved()}}
  else if(d.grmimg!==undefined){guideImgs.splice(+d.grmimg,1);renderGuideGal()}
  else if(d.bc!==undefined){bcat=d.bc;renderSaved()}
  else if(d.back){navStack.length=0;document.body.classList.remove('open');history.replaceState(null,'',location.pathname+location.search);scrollTo({top:0})}
  else if(d.tgt!==undefined){d.tgt?enterTgt(d.tgt):leaveTgt();fitArcs();renderAll()}
  else if(d.cfg!==undefined){if(S.tgt){tgtSave();tgtLoad(+d.cfg)}else loadCfg(+d.cfg);renderBuilder()}
  else if(d.polreset){resetPolarities()} else if(d.curreset){resetCurrentBuild()}
  else if(d.cfgcopy!==undefined){const srcIdx=+d.cfgcopy,isTgt=!!S.tgt,L=isTgt?S.exs[S.tgt].cfgs:S.cfgs,srcD=L[srcIdx].d;if(!srcD){msg('Boş.');return}if(!confirm('Kopyalanacak. Devam?'))return;if(isTgt){tgtSave();const e=S.exs[S.tgt];e.cfgs[e.ci].d=JSON.parse(JSON.stringify(srcD));tgtLoad(e.ci)}else{stash();S.cfgs[S.ci].d=JSON.parse(JSON.stringify(srcD));loadCfg(S.ci,true)}renderBuilder();msg('Kopyalandı.')}
  else if(d.cfgadd){if(S.tgt){tgtSave();const e=S.exs[S.tgt];e.cfgs.push({n:'Config '+(e.cfgs.length+1),d:null});tgtLoad(e.cfgs.length-1)}else{stash();S.cfgs.push({n:'Config '+(S.cfgs.length+1),d:null});loadCfg(S.cfgs.length-1)}renderBuilder()}
  else if(d.cfgdel){if(S.tgt){const e=S.exs[S.tgt];if(e.cfgs.length<2){msg('En az 1.');return}e.cfgs.splice(e.ci,1);tgtLoad(0)}else{if(S.cfgs.length<2){msg('En az 1.');return}S.cfgs.splice(S.ci,1);loadCfg(0,true)}renderBuilder()}
  else if(d.omni){omniOn=!omniOn;t.classList.toggle('on',omniOn);t.textContent='Omni Forma Modu: '+(omniOn?'Açık':'Kapalı')}
  else if(d.ab!==undefined){abPick=+d.ab;renderAbil()}
  else if(d.addriv){S.riv.push({n:'',st:[]});renderNote()}
  else if(d.rmriv!==undefined){S.riv.splice(+d.rmriv,1);renderNote()}
  else if(d.rmst!==undefined){const[i,j]=d.rmst.split('.').map(Number);S.riv[i].st.splice(j,1);renderNote()}
  else if(d.rmimg!==undefined){S.imgs.splice(+d.rmimg,1);renderNote()}
  else if(d.rmarc!==undefined){S.arcs[+d.rmarc]=null;renderBuilder()}
  else if(d.load){const b=saved.find(x=>x.id===d.load);if(b){navStack.length=0;loadBuild(b);openView();$('#buildlistro').hidden=true;renderAll();scrollTo({top:0,behavior:'smooth'})}}
  else if(d.del){saved=saved.filter(x=>x.id!==d.del);persist();renderSaved()}
  else if(d.share){const b=saved.find(x=>x.id===d.share);if(!b)return;const u=link(b);(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>msg('Kopyalandı.')).catch(()=>prompt('Bağlantı:',u))}
});

document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.sh!==undefined){S.shards[+t.dataset.sh]=t.value||null;renderShards();renderStats();return}
  if(t.dataset.pol!==undefined){setP(pk(t.dataset.pol),t.value);renderBuilder();return}
  if(t.dataset.part!==undefined){S.parts[t.dataset.part]=t.value;renderParts();return}
  if(t.id==='excat'){S.cat=t.value;S.cn=XC[S.cat]?.n||8;cleanMods();renderAll();return}
  if(t.id==='hsel'){if(t.value)S.helm[abPick]=t.value;else delete S.helm[abPick];abPick=null;renderAbil();return}
  if(t.id==='cfgname'){const e=S.tgt?S.exs[S.tgt]:null;(e?e.cfgs[e.ci]:S.cfgs[S.ci]).n=t.value.trim()||'Config';renderCfg();return}
  if(t.dataset.rivn!==undefined){S.riv[+t.dataset.rivn].n=t.value;return}
  if(t.dataset.rivadd!==undefined&&t.value){const[ty,k]=t.value.split('|'),r=S.riv[+t.dataset.rivadd],pos=r.st.filter(x=>x.s>0).length,neg=r.st.length-pos;if(r.st.some(x=>x.k===k))msg('Ekli.');else if(ty==='n'&&neg>=1)msg('Maks 1 negatif.');else if(ty!=='n'&&pos>=3)msg('Maks 3 pozitif.');else{r.st.push({k,s:ty==='n'?-1:1,sp:ty==='s'});msg('')}renderNote();return}
  if(t.dataset.rank!==undefined){const k=pk(t.dataset.rank),s=getS(k),m=M.get(s.u);s.r=Math.max(0,Math.min(maxRank(m),+t.value||0));renderBuilder()}
});

$('#item').addEventListener('change',e=>{const nv=e.target.value;if(S.id){const c=S.cat;S=blank();S.cat=c;msg('Yeni build.')}S.item=nv;applyPols();cleanMods();S.parts={};if(!special())S.elem='';if(nv==='siriusorion')enterTgt('sirius');fitArcs();renderAll()});
$('#elem').addEventListener('change',e=>{S.elem=e.target.value;renderStats()});
$('#bonus').addEventListener('change',e=>{S.bonus=Math.max(25,Math.min(60,+e.target.value||25));e.target.value=S.bonus;renderStats()});
$('#reactor').addEventListener('change',e=>{S.reactor=e.target.checked;renderBuilder()});
$('#q').addEventListener('input',renderList);

$('#save').addEventListener('click',()=>{const b=cur();S.id=b.id;if(!b.name){const base=(b.item==='custom'&&b.cname?b.cname:IT.get(b.item)?.name||'Build');let name=base,n=2;while(saved.some(x=>x.id!==b.id&&x.name===name))name=base+' '+n++;b.name=S.name=name}const i=saved.findIndex(x=>x.id===b.id);i<0?saved.unshift(b):saved[i]=b;persist();renderAll();msg('Kaydedildi.')});
$('#autof').addEventListener('click',()=>{autoForma();renderBuilder()});
$('#reset').addEventListener('click',()=>{if(!confirm('Sıfırlanacak. Devam?'))return;S=blank();selectCat('Warframe');navStack.length=0;history.replaceState(null,'',location.pathname+location.search);renderAll();msg('Sıfırlandı.')});
$('#new').addEventListener('click',()=>{const c=S.cat;S=blank();selectCat(c);navStack.length=0;history.replaceState(null,'',location.pathname+location.search);renderAll();msg('')});

$('#exp').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({builds:saved,cmods:CM,guides},null,2)],{type:'application/json'}));a.download='builds.json';a.click()});
$('#imp').addEventListener('click',()=>$('#file').click());
$('#file').addEventListener('change',async e=>{try{const j=JSON.parse(await e.target.files[0].text()),arr=Array.isArray(j)?j:j.builds;if(!Array.isArray(arr))throw 0;if(Array.isArray(j.cmods)){j.cmods.forEach(c=>{if(!CM.some(x=>x.id===c.id))CM.push(c);CMD=CMD.filter(x=>x!==c.id)});saveCMD();saveCM();syncCM();renderCm()}if(Array.isArray(j.guides)){j.guides.forEach(g=>{if(g&&g.id){const i=guides.findIndex(x=>x.id===g.id);i<0?guides.push(g):guides[i]=g}});persistGuides()}arr.forEach(b=>{if(b&&b.id){const i=saved.findIndex(x=>x.id===b.id);i<0?saved.push(b):saved[i]=b}});persist();renderSaved();msg('İçe aktarıldı.')}catch(err){msg('Geçersiz dosya.')}e.target.value=''});

function shrink(f){return new Promise((ok,bad)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1280/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.75))};im.onerror=bad;im.src=r.result};r.onerror=bad;r.readAsDataURL(f)})}
$('#note').addEventListener('input',e=>{if(!RO){S.note=e.target.value;linkSuggest(e.target)}});
document.addEventListener('click',e=>{if(!e.target.closest('#linkpop,#note'))$('#linkpop').hidden=true});
$('#addurl').addEventListener('click',()=>{const v=$('#imgurl').value.trim();if(!v)return;S.imgs.push(v);$('#imgurl').value='';renderNote()});
$('#addfile').addEventListener('click',()=>$('#imgfile').click());
$('#imgfile').addEventListener('change',async e=>{for(const f of e.target.files){try{S.imgs.push(await shrink(f))}catch(err){msg('Hata: '+f.name)}}e.target.value='';renderNote()});
$('#bq').addEventListener('input',renderSaved); $('#bgo').addEventListener('click',renderSaved);
$('#adminoff').addEventListener('click',()=>{try{localStorage.removeItem('admin')}catch(e){}location.href=location.pathname});
document.addEventListener('input',e=>{const d=e.target.dataset;if(d.evo!==undefined&&!RO)S.evo[+d.evo]=e.target.value});
$('#cmsave').addEventListener('click',()=>{const n=$('#cmname').value.trim();if(!n){msg('Mod adı gerekli.');return}CM.unshift({id:'c'+Date.now().toString(36),name:n,ck:$('#cmkind').value,polarity:$('#cmpol').value,drain:Math.min(30,Math.abs(+$('#cmdrain').value||0)),rank:Math.max(0,Math.min(30,+$('#cmrank').value||0)),desc:$('#cmdesc').value.trim()});saveCM();syncCM();$('#cmname').value='';$('#cmdesc').value='';renderAll();msg('Kaydedildi.')});

$('#gcancel').addEventListener('click',()=>{$('#guidemodal').hidden=true;curGuide=null});
$('#gsave').addEventListener('click',()=>{
  const name=$('#gname').value.trim();
  if(!name){msg('Rehber adı gerekli.');return}
  const g={id:curGuide.id,name,note:$('#gnote').value,imgs:guideImgs.slice()};
  const i=guides.findIndex(x=>x.id===g.id);
  i<0?guides.unshift(g):guides[i]=g;
  persistGuides();renderSaved();$('#guidemodal').hidden=true;curGuide=null;msg('Rehber kaydedildi.');
});
$('#gdelete').addEventListener('click',()=>{
  if(!curGuide||!confirm('Rehber silinsin mi?'))return;
  guides=guides.filter(g=>g.id!==curGuide.id);persistGuides();renderSaved();$('#guidemodal').hidden=true;curGuide=null;
});
$('#gaddurl').addEventListener('click',()=>{const v=$('#gimgurl').value.trim();if(!v)return;guideImgs.push(v);$('#gimgurl').value='';renderGuideGal()});
$('#gaddfile').addEventListener('click',()=>$('#gimgfile').click());
$('#gimgfile').addEventListener('change',async e=>{for(const f of e.target.files){try{guideImgs.push(await shrink(f))}catch(err){msg('Hata: '+f.name)}}e.target.value='';renderGuideGal()});

async function syncToGitHub(){
  if(!ADMIN) return;
  const token = localStorage.getItem('gh_token'), repo = localStorage.getItem('gh_repo'), branch = localStorage.getItem('gh_branch') || 'main';
  if(!token || !repo){ msg('GitHub ayarları eksik.'); return; }
  const b64content = btoa(unescape(encodeURIComponent(JSON.stringify({builds: saved, cmods: CM, guides}, null, 2))));
  const url = `https://api.github.com/repos/${repo}/contents/builds.json?ref=${branch}`;
  try{
    msg('Senkronize ediliyor...');
    let sha = '';
    const getRes = await fetch(url, {headers: {Authorization: `token ${token}`}});
    if(getRes.ok) sha = (await getRes.json()).sha;
    const putRes = await fetch(url, {method: 'PUT',headers: {Authorization: `token ${token}`,'Content-Type': 'application/json'},body: JSON.stringify({message: 'Builds auto-sync',content: b64content,sha: sha || undefined,branch: branch})});
    if(putRes.ok) msg('Başarıyla yüklendi.'); else msg('Hata: ' + ((await putRes.json()).message || 'Bilinmeyen hata'));
  }catch(e){ msg('Hata: ' + e.message); }
}

init();
