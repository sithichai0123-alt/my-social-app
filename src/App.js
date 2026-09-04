import React, { useState, useRef, useEffect } from "react";

// ── Custom Hook สำหรับบันทึกข้อมูลลงเครื่อง (ไม่หายเมื่อรีเฟรช) ──
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Error reading localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Error setting localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
}

// ── Design Tokens ─────────────────────────────────────────
const C = {
  brand:    "#7C3AED",
  brand2:   "#A855F7",
  brand3:   "#6D28D9",
  grad:     "linear-gradient(135deg,#7C3AED 0%,#A855F7 100%)",
  gradSoft: "linear-gradient(135deg,#EDE9FE 0%,#F5F3FF 100%)",
  gradHero: "linear-gradient(135deg,#1E1B4B 0%,#4C1D95 50%,#6D28D9 100%)",
  surface:  "#FFFFFF",
  bg:       "#F9F8FF",
  border:   "#EDE9FE",
  borderMid:"#DDD6FE",
  text:     "#1E1B2E",
  sub:      "#6B7280",
  muted:    "#9CA3AF",
  green:    "#10B981",
  red:      "#EF4444",
  redL:     "#FEF2F2",
  yellow:   "#F59E0B",
};

// ── Data ─────────────────────────────────────────────────
const FRIENDS = [
  {id:1,name:"หนูนก",init:"NK",bg:"#D1FAE5",tc:"#065F46",online:true, mood:"เหงา 🌙"},
  {id:2,name:"อาร์ม", init:"AR",bg:"#DBEAFE",tc:"#1E40AF",online:true, mood:"สนุก 🎉"},
  {id:3,name:"มิ้นท์",init:"MT",bg:"#FCE7F3",tc:"#831843",online:false,mood:"ง่วง 😴"},
  {id:4,name:"ไบรท์",init:"BR",bg:"#FEF3C7",tc:"#92400E",online:true, mood:"สงบ ✨"},
  {id:5,name:"แพม",  init:"PM",bg:"#D1FAE5",tc:"#064E3B",online:true, mood:"สบายดี 😊"},
];
const MOODS = ["สบายดี 😊","เหงา 🌙","สนุก 🎉","เครียด 😮‍💨","ง่วง 😴","สงบ ✨","ตื่นเต้น ⚡","โดดเดี่ยว 🫥"];
const PV_LBL = {public:"สาธารณะ",friends:"เพื่อนเท่านั้น",only_me:"ฉันเท่านั้น"};
const PV_ICO  = {public:"🌐",friends:"👥",only_me:"🔒"};
const AUTO_REPLIES = ["อ่อ จริงๆ เหรอ 😊","รู้สึกแบบเดียวกันเลย 💜","ฮ่าๆ น่ารักมาก 🥰","แล้วยังไงต่อล่ะ?","ใช่เลย! เห็นด้วย 100%","เดี๋ยวเล่าให้ฟังนะ 🎵"];
const INIT_VOICE_ROOMS = [
  {id:1,name:"นั่งเงียบๆด้วยกัน",  vibe:"🌙",hostId:"NK",
   members:[{init:"NK",name:"หนูนก",bg:"#D1FAE5",tc:"#065F46",mic:true, kicked:false},
             {init:"BR",name:"ไบรท์",bg:"#FEF3C7",tc:"#92400E",mic:false,kicked:false},
             {init:"PM",name:"แพม",  bg:"#D1FAE5",tc:"#064E3B",mic:true, kicked:false}],
   playlist:[]},
  {id:2,name:"คืนนี้เหงาใครมาก",  vibe:"💜",hostId:"AR",
   members:[{init:"AR",name:"อาร์ม", bg:"#DBEAFE",tc:"#1E40AF",mic:true, kicked:false},
             {init:"MT",name:"มิ้นท์",bg:"#FCE7F3",tc:"#831843",mic:true, kicked:false}],
   playlist:[]},
];
const INIT_POSTS = [
  {id:1,author:"หนูนก",init:"NK",bg:"#D1FAE5",tc:"#065F46",time:"2 นาทีที่แล้ว",content:"วันนี้เหงามากเลย ใครว่างคุยด้วยบ้าง 🌙",mood:"เหงา 🌙",privacy:"public",likes:12,liked:false,images:[],
   comments:[{id:1,author:"แพม",init:"PM",bg:"#D1FAE5",tc:"#064E3B",text:"มาคุยด้วยได้เลยนะ 🌸",time:"1น."}]},
  {id:2,author:"ไบรท์",init:"BR",bg:"#FEF3C7",tc:"#92400E",time:"1 ชม.",content:"อากาศดีมากวันนี้ ☀️ ออกไปนั่งข้างนอกสักพัก",mood:"สงบ ✨",privacy:"friends",likes:24,liked:true,
   images:["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"],comments:[]},
];
const INIT_CHATS = {
  1:[{id:1,from:"them",text:"หวัดดีจ้า วันนี้เป็นยังไงบ้าง 😊",type:"text"}],
  2:[{id:1,from:"them",text:"เฮ้ มีอะไรเล่าให้ฟังมั้ย 👂",type:"text"}],
};

function getYoutubeId(url){
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
function getYoutubeThumbnail(id){ return id?`https://img.youtube.com/vi/${id}/mqdefault.jpg`:""; }

// ── Shared UI ─────────────────────────────────────────────
function Av({init,bg,tc,size=40,online,isGrad, img}){
  return(
    <div style={{position:"relative",flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:"50%",
        background:isGrad?C.grad:(bg||"#EDE9FE"),
        color:isGrad?"#fff":(tc||C.brand),
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:size*.33,fontWeight:700, overflow:"hidden",
        boxShadow:isGrad?"0 4px 12px rgba(124,58,237,.35)":"0 1px 4px rgba(0,0,0,.08)"}}>
        {img ? <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : init}
      </div>
      {online&&<div style={{position:"absolute",bottom:1,right:1,
        width:Math.max(8,size*.2),height:Math.max(8,size*.2),
        borderRadius:"50%",background:C.green,border:"2px solid #fff",
        boxShadow:"0 0 0 1px "+C.green+"40"}}/>}
    </div>
  );
}

function Btn({children,onClick,variant="primary",size="md",style={}}){
  const base={border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .18s",...style};
  const variants={
    primary:{background:C.grad,color:"#fff",boxShadow:"0 2px 10px rgba(124,58,237,.35)"},
    secondary:{background:"#fff",color:C.brand,border:"1.5px solid "+C.borderMid},
    ghost:{background:"transparent",color:C.sub,border:"1.5px solid "+C.border},
    danger:{background:C.redL,color:C.red,border:"1.5px solid #FECACA"},
  };
  const sizes={sm:{padding:"5px 12px",borderRadius:10,fontSize:12},md:{padding:"8px 18px",borderRadius:12,fontSize:13},lg:{padding:"11px 24px",borderRadius:14,fontSize:15}};
  return <button onClick={onClick} style={{...base,...variants[variant],...sizes[size]}}>{children}</button>;
}

function Card({children,style={},glass}){
  return(
    <div style={{background:glass?"rgba(255,255,255,.85)":C.surface,
      border:"1px solid "+C.border,borderRadius:20,overflow:"hidden",
      boxShadow:"0 2px 16px rgba(124,58,237,.06)",backdropFilter:glass?"blur(12px)":"none",...style}}>
      {children}
    </div>
  );
}

function ImgGrid({images}){
  if(!images||!images.length)return null;
  const n=images.length;
  return(
    <div style={{display:"grid",gap:3,overflow:"hidden",margin:"10px 0",borderRadius:16,
      gridTemplateColumns:n===1?"1fr":"1fr 1fr",maxHeight:n===1?340:260}}>
      {images.slice(0,4).map((src,i)=>(
        <div key={i} style={{overflow:"hidden",position:"relative",gridColumn:n===3&&i===0?"1/3":undefined}}>
          <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:130}}/>
          {i===3&&n>4&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:24,fontWeight:700}}>+{n-4}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Auth Page ─────────────────────────────────────────────
function AuthPage({onLogin}){
  const [mode,setMode]=useState("login"); 
  const [form,setForm]=useState({name:"",email:"",password:"",confirm:""});
  const [err,setErr]=useState("");
  const f = k => e => { setForm(p=>({...p,[k]:e.target.value})); setErr(""); };

  const inp = (placeholder,k,type="text") => (
    <input type={type} placeholder={placeholder} value={form[k]} onChange={f(k)}
      style={{width:"100%",border:"1.5px solid "+C.border,borderRadius:12,padding:"11px 16px",
        fontSize:14,outline:"none",background:"#FAFAFF",color:C.text,boxSizing:"border-box",
        fontFamily:"inherit",marginBottom:10,transition:"border .15s"}}/>
  );

  function submit(){
    if(mode==="guest"){
      if(!form.name.trim()){setErr("ใส่ชื่อที่ต้องการแสดงก่อนนะ");return;}
      onLogin({name:form.name.trim(),email:"",isGuest:true, init:form.name.trim().substring(0,2).toUpperCase()});
    } else if(mode==="register"){
      if(!form.name.trim()||!form.email.trim()||!form.password){setErr("กรอกข้อมูลให้ครบก่อนนะ");return;}
      if(form.password!==form.confirm){setErr("รหัสผ่านไม่ตรงกัน");return;}
      onLogin({name:form.name.trim(),email:form.email.trim(),isGuest:false, init:form.name.trim().substring(0,2).toUpperCase()});
    } else {
      if(!form.email.trim()||!form.password){setErr("กรอกอีเมลและรหัสผ่านก่อนนะ");return;}
      // หากล็อกอินสำเร็จ จำลองการดึงชื่อ
      onLogin({name:"คุณ",email:form.email.trim(),isGuest:false, init:"ME"});
    }
  }

  return(
    <div style={{minHeight:"100vh",background:C.gradHero,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:20,background:"rgba(255,255,255,.15)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 14px"}}>💜</div>
          <div style={{fontSize:32,fontWeight:800,color:"#fff",letterSpacing:-.5}}>Warmly</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,.65)",marginTop:6}}>พื้นที่อบอุ่นสำหรับทุกคน</div>
        </div>
        <Card style={{borderRadius:24,border:"1px solid rgba(255,255,255,.15)"}}>
          <div style={{padding:28}}>
            <div style={{display:"flex",background:"#F3F4F6",borderRadius:12,padding:4,marginBottom:22,gap:2}}>
              {[["login","เข้าสู่ระบบ"],["register","สมัครสมาชิก"],["guest","ผู้เยี่ยมชม"]].map(([k,l])=>(
                <button key={k} onClick={()=>{setMode(k);setErr("");setForm({name:"",email:"",password:"",confirm:""});}}
                  style={{flex:1,padding:"7px 4px",borderRadius:9,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
                    fontFamily:"inherit",background:mode===k?C.grad:"transparent",color:mode===k?"#fff":C.sub,transition:"all .2s"}}>
                  {l}
                </button>
              ))}
            </div>

            {mode==="guest" && (<>{inp("ชื่อที่ต้องการแสดง","name")}</>)}
            {mode==="register" && (<>{inp("ชื่อที่ต้องการแสดง","name")}{inp("อีเมล","email","email")}{inp("รหัสผ่าน","password","password")}{inp("ยืนยันรหัสผ่าน","confirm","password")}</>)}
            {mode==="login" && (
              <>
                {inp("อีเมล","email","email")}
                {inp("รหัสผ่าน","password","password")}
                <div style={{textAlign:"right",marginTop:-4,marginBottom:12}}><span style={{fontSize:12,color:C.brand,cursor:"pointer",fontWeight:500}}>ลืมรหัสผ่าน?</span></div>
              </>
            )}
            {err&&<div style={{fontSize:13,color:C.red,marginBottom:12,padding:"8px 12px",background:C.redL,borderRadius:10,fontWeight:500}}>{err}</div>}
            <Btn onClick={submit} variant="primary" size="lg" style={{width:"100%",justifyContent:"center",borderRadius:14}}>
              {mode==="guest"?"เข้าสู่แอป 👋":mode==="register"?"สร้างบัญชี ✨":"เข้าสู่ระบบ 🔑"}
            </Btn>
            {mode==="login"&&(
              <div style={{marginTop:20}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:12,color:C.muted}}>หรือ</span><div style={{flex:1,height:1,background:C.border}}/>
                </div>
                <button onClick={()=>onLogin({name:"คุณ",email:"user@gmail.com",isGuest:false, init:"ME"})}
                  style={{width:"100%",padding:"10px",borderRadius:12,border:"1.5px solid "+C.border,background:"#fff",color:C.text,cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <span style={{fontSize:18}}>🔵</span> เข้าสู่ระบบด้วย Google
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── YouTube Playlist ──────────────────────────────────────
function YoutubePlaylist({playlist,setPlaylist,isHost}){
  const [url,setUrl]=useState("");
  const [title,setTitle]=useState("");
  const [err,setErr]=useState("");
  const [playing,setPlaying]=useState(null);

  function add(){
    const id=getYoutubeId(url.trim());
    if(!id){setErr("ลิงก์ YouTube ไม่ถูกต้อง (ตัวอย่าง: https://youtu.be/...)");return;}
    if(playlist.find(p=>p.id===id)){setErr("เพลงนี้อยู่ใน playlist แล้ว");return;}
    const thumb=getYoutubeThumbnail(id);
    const t=title.trim()||"YouTube - "+id.slice(0,8)+"...";
    setPlaylist(prev=>[...prev,{id,title:t,thumb,url:url.trim()}]);
    setUrl("");setTitle("");setErr("");
  }

  function remove(id){
    setPlaylist(prev=>prev.filter(p=>p.id!==id));
    if(playing===id)setPlaying(null);
  }

  function playVideo(item){
    setPlaying(item.id);
  }

  return(
    <div style={{marginTop:14,borderTop:"1px solid "+C.border,paddingTop:14}}>
      <div style={{fontSize:13,fontWeight:700,color:C.brand,marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
        🎵 Playlist ห้องนี้ <span style={{fontSize:11,fontWeight:400,color:C.muted}}>({playlist.length} เพลง)</span>
      </div>
      
      {/* ฝัง YouTube Iframe */}
      {playing && (
        <div style={{position:"relative", paddingBottom:"56.25%", height:0, marginBottom:16, borderRadius:12, overflow:"hidden", background:"#000", boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>
          <iframe src={`https://www.youtube.com/embed/${playing}?autoplay=1`} title="YouTube video player" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:0}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}

      {isHost&&(
        <div style={{background:"#FAFAFF",border:"1.5px dashed "+C.borderMid,borderRadius:14,padding:"12px 14px",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:600,color:C.sub,marginBottom:8}}>➕ เพิ่มเพลงจาก YouTube</div>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="วาง YouTube URL ที่นี่..." onKeyDown={e=>e.key==="Enter"&&add()}
            style={{width:"100%",border:"1.5px solid "+C.border,borderRadius:10,padding:"8px 12px",fontSize:13,outline:"none",background:"#fff",color:C.text,boxSizing:"border-box",fontFamily:"inherit",marginBottom:7}}/>
          {err&&<div style={{fontSize:12,color:C.red,marginBottom:7,fontWeight:500}}>{err}</div>}
          <Btn onClick={add} variant="primary" size="sm" style={{borderRadius:10}}>เพิ่มเพลง</Btn>
        </div>
      )}

      {playlist.length===0&&(
        <div style={{textAlign:"center",padding:"16px 0",color:C.muted,fontSize:13}}>
          {isHost?"ยังไม่มีเพลง — เพิ่มจาก YouTube ได้เลย 🎵":"Host ยังไม่ได้เพิ่มเพลง"}
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {playlist.map((song,i)=>(
          <div key={song.id} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 11px",borderRadius:12,
            background:playing===song.id?"#F5F3FF":"#fff",border:"1.5px solid "+(playing===song.id?C.brand:C.border),cursor:"pointer",transition:"all .2s"}}
            onClick={()=>playVideo(song)}>
            <div style={{fontSize:13,fontWeight:700,color:C.muted,width:18,textAlign:"center",flexShrink:0}}>{i+1}</div>
            {song.thumb
              ?<img src={song.thumb} alt="" style={{width:44,height:32,borderRadius:7,objectFit:"cover",flexShrink:0,border:"1px solid "+C.border}}/>
              :<div style={{width:44,height:32,borderRadius:7,background:C.gradSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🎵</div>
            }
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{song.title}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:1}}>คลิกเพื่อเล่นในแอป ▷</div>
            </div>
            <div style={{display:"flex",gap:5}}>
              <div style={{fontSize:14,color:playing===song.id?C.brand:C.muted}}>{playing===song.id?"▶️":"▷"}</div>
              {isHost&&<button onClick={e=>{e.stopPropagation();remove(song.id);}}
                style={{border:"none",background:"transparent",color:C.muted,cursor:"pointer",fontSize:14,padding:"0 2px",fontFamily:"inherit"}}>✕</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Voice Rooms
