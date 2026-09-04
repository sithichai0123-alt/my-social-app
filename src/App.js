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

// ── Voice Rooms ───────────────────────────────────────────
function VoiceRoomsPage({user, profile}){
  const [rooms,setRooms]=useState(INIT_VOICE_ROOMS);
  const [inRoomId,setInRoomId]=useState(null);
  const [myMic,setMyMic]=useState(true);
  const [showPlaylist,setShowPlaylist]=useState(false);
  const [newName,setNewName]=useState("");
  const [creating,setCreating]=useState(false);
  const [nameErr,setNameErr]=useState("");

  const inRoom=rooms.find(r=>r.id===inRoomId);
  const isHost=inRoom&&inRoom.hostId===user.init;

  function join(r){
    setRooms(prev=>prev.map(room=>{
      if(room.id!==r.id)return room;
      if(room.members.find(m=>m.init===user.init))return room;
      return {...room,members:[...room.members,{init:user.init,name:user.name,bg:"#EDE9FE",tc:C.brand,mic:true,kicked:false, img:profile?.avatar}]};
    }));
    setInRoomId(r.id);setMyMic(true);setShowPlaylist(false);
  }

  function leave(){
    setRooms(prev=>prev.map(room=>{
      if(room.id!==inRoomId)return room;
      return {...room,members:room.members.filter(m=>m.init!==user.init)};
    }));
    setInRoomId(null);setShowPlaylist(false);
  }

  function hostToggleMic(memberInit){
    if(!isHost)return;
    setRooms(prev=>prev.map(room=>{
      if(room.id!==inRoomId)return room;
      return {...room,members:room.members.map(m=>m.init===memberInit?{...m,mic:!m.mic}:m)};
    }));
  }

  function kickMember(memberInit){
    if(!isHost||memberInit===user.init)return;
    setRooms(prev=>prev.map(room=>{
      if(room.id!==inRoomId)return room;
      return {...room,members:room.members.filter(m=>m.init!==memberInit)};
    }));
  }

  function createRoom(){
    if(!newName.trim()){setNameErr("ใส่ชื่อห้องก่อนนะ");return;}
    const r={id:Date.now(),name:newName.trim(),vibe:"🎵",hostId:user.init,
      members:[{init:user.init,name:user.name,bg:"#EDE9FE",tc:C.brand,mic:true,kicked:false, img:profile?.avatar}],
      playlist:[]};
    setRooms(rs=>[r,...rs]);
    setInRoomId(r.id);setMyMic(true);setNewName("");setCreating(false);setNameErr("");
  }

  function updatePlaylist(roomId,pl){
    setRooms(prev=>prev.map(r=>r.id===roomId?{...r,playlist:pl}:r));
  }

  return(
    <div>
      {inRoom&&(
        <Card style={{marginBottom:18,border:"1.5px solid "+C.brand,boxShadow:"0 4px 24px rgba(124,58,237,.18)"}}>
          <div style={{background:C.gradSoft,padding:"16px 18px",borderBottom:"1px solid "+C.border}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:C.brand,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:C.green,boxShadow:"0 0 8px "+C.green}}/>
                  {inRoom.vibe} {inRoom.name}
                </div>
                <div style={{fontSize:12,color:C.sub,marginTop:3}}>
                  {isHost?"คุณเป็น Host 👑":"กำลังคุยอยู่"}  •  {inRoom.members.length} คน
                </div>
              </div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <Btn onClick={()=>setShowPlaylist(!showPlaylist)} variant={showPlaylist?"primary":"secondary"} size="sm">
                  🎵 Playlist
                </Btn>
                <Btn onClick={()=>setMyMic(!myMic)} variant="secondary" size="sm">
                  {myMic?"🎙️ ปิดไมค์":"🔇 เปิดไมค์"}
                </Btn>
                <Btn onClick={leave} variant="danger" size="sm">📵 ออก</Btn>
              </div>
            </div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {inRoom.members.map((m,i)=>{
                const isMe=m.init===user.init;
                const speaking=isMe?myMic:m.mic;
                return(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,position:"relative"}}>
                    {isHost&&!isMe&&(
                      <div style={{position:"absolute",top:-6,right:-6,display:"flex",gap:2,zIndex:2}}>
                        <button onClick={()=>hostToggleMic(m.init)} title="เปิด/ปิดไมค์"
                          style={{width:18,height:18,borderRadius:"50%",background:m.mic?"#D1FAE5":"#FEF3C7",border:"1px solid #ddd",cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {m.mic?"🎙":"🔇"}
                        </button>
                        <button onClick={()=>kickMember(m.init)} title="เตะออก"
                          style={{width:18,height:18,borderRadius:"50%",background:C.redL,border:"1px solid #FECACA",cursor:"pointer",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",color:C.red}}>
                          ✕
                        </button>
                      </div>
                    )}
                    <div style={{padding:3,borderRadius:"50%",border:"3px solid "+(speaking?C.green:C.borderMid),
                      boxShadow:speaking?"0 0 12px rgba(16,185,129,.35)":"none",transition:"all .3s"}}>
                      <Av init={m.init} bg={m.bg} tc={m.tc} isGrad={isMe} img={m.img} size={48}/>
                    </div>
                    <div style={{fontSize:12,color:C.brand,fontWeight:700,maxWidth:60,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isMe?"คุณ":m.name}</div>
                    <div style={{fontSize:11,padding:"2px 7px",borderRadius:20,background:speaking?"#D1FAE5":C.border,color:speaking?C.green:C.muted,fontWeight:600}}>
                      {speaking?"🎙":"🔇"}
                    </div>
                    {isHost&&m.init===user.init&&<div style={{fontSize:9,color:C.yellow,fontWeight:700}}>👑 HOST</div>}
                  </div>
                );
              })}
            </div>
          </div>
          {showPlaylist&&(
            <div style={{padding:"0 18px 16px"}}>
              <YoutubePlaylist playlist={inRoom.playlist} setPlaylist={pl=>updatePlaylist(inRoom.id,pl)} isHost={isHost}/>
            </div>
          )}
        </Card>
      )}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:800,color:C.text}}>ห้องเสียง 🎙️</div>
        <Btn onClick={()=>setCreating(!creating)} variant={creating?"primary":"secondary"} size="sm">+ เปิดห้องใหม่</Btn>
      </div>

      {creating&&(
        <Card style={{marginBottom:14}}>
          <div style={{padding:"16px 18px"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>🏠 สร้างห้องใหม่</div>
            <input value={newName} onChange={e=>{setNewName(e.target.value);setNameErr("");}} onKeyDown={e=>e.key==="Enter"&&createRoom()}
              placeholder="ชื่อห้อง เช่น คืนนี้ใครว่างบ้าง 🌙"
              style={{width:"100%",border:"1.5px solid "+C.border,borderRadius:12,padding:"10px 14px",fontSize:14,outline:"none",background:C.bg,color:C.text,boxSizing:"border-box",fontFamily:"inherit",marginBottom:8}}/>
            {nameErr&&<div style={{fontSize:12,color:C.red,marginBottom:8,fontWeight:500}}>{nameErr}</div>}
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={createRoom} variant="primary" size="sm">สร้างห้อง ✨</Btn>
              <Btn onClick={()=>{setCreating(false);setNameErr("");}} variant="ghost" size="sm">ยกเลิก</Btn>
            </div>
          </div>
        </Card>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {rooms.map(r=>(
          <Card key={r.id} style={{border:"1.5px solid "+(inRoomId===r.id?C.brand:C.border)}}>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:C.text}}>{r.vibe} {r.name}</div>
                  <div style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>{r.members.length} คนอยู่
                    {r.playlist.length>0&&<span>• 🎵 {r.playlist.length} เพลง</span>}
                  </div>
                </div>
                {inRoomId===r.id
                  ?<Btn onClick={leave} variant="danger" size="sm">📵 ออก</Btn>
                  :<Btn onClick={()=>join(r)} variant="primary" size="sm">เข้าร่วม</Btn>
                }
              </div>
              <div style={{display:"flex",gap:0}}>
                {r.members.slice(0,7).map((m,i)=>(
                  <div key={i} style={{width:30,height:30,borderRadius:"50%",background:m.bg||C.grad,color:m.tc||'#fff',display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,border:"2.5px solid #fff",marginLeft:i>0?-8:0,boxShadow:"0 1px 4px rgba(0,0,0,.1)", overflow:'hidden'}}>
                    {m.img ? <img src={m.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : m.init}
                  </div>
                ))}
                {r.members.length>7&&<div style={{width:30,height:30,borderRadius:"50%",background:"#E5E7EB",color:C.sub,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,border:"2.5px solid #fff",marginLeft:-8}}>+{r.members.length-7}</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── PostCard ──────────────────────────────────────────────
function PostCard({p,onLike,onComment, userProfile}){
  const [open,setOpen]=useState(false);
  const [cmt,setCmt]=useState("");
  const [err,setErr]=useState("");
  function submit(){if(!cmt.trim()){setErr("เม้นอะไรก่อนนะ 😊");return;}onComment(p.id,cmt.trim());setCmt("");setErr("");}
  
  // ถ้าเป็นโพสต์ของเราเอง ให้ใช้รูปโปรไฟล์ปัจจุบัน
  const isMe = p.init === "ME";
  const avatar = isMe ? userProfile?.avatar : null;
  const isGrad = isMe;

  return(
    <Card style={{marginBottom:14}}>
      <div style={{padding:"16px 16px 0"}}>
        <div style={{display:"flex",gap:12,marginBottom:12}}>
          <Av init={p.init} bg={p.bg} tc={p.tc} size={42} img={avatar} isGrad={isGrad}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{p.author}</div>
            <div style={{fontSize:12,color:C.muted,display:"flex",flexWrap:"wrap",gap:6,marginTop:3}}>
              <span>{p.time}</span><span>·</span>
              <span style={{background:C.bg,borderRadius:20,padding:"1px 8px",border:"1px solid "+C.border}}>{PV_ICO[p.privacy]} {PV_LBL[p.privacy]}</span>
              {p.mood&&<span style={{background:"#F5F3FF",borderRadius:20,padding:"1px 8px",color:C.brand,fontWeight:600,fontSize:12}}>✦ {p.mood}</span>}
            </div>
          </div>
        </div>
        {p.content&&<div style={{fontSize:15,color:C.text,lineHeight:1.75,marginBottom:4, whiteSpace:'pre-wrap'}}>{p.content}</div>}
      </div>
      <ImgGrid images={p.images}/>
      <div style={{padding:"0 16px 14px"}}>
        <div style={{borderTop:"1px solid "+C.border,paddingTop:10,display:"flex",gap:8}}>
          <Btn onClick={()=>onLike(p.id)} variant={p.liked?"primary":"ghost"} size="sm">{p.liked?"❤️":"🤍"} {p.likes}</Btn>
          <Btn onClick={()=>setOpen(!open)} variant={open?"secondary":"ghost"} size="sm">💬 {p.comments.length}</Btn>
          <Btn variant="ghost" size="sm">🔗 แชร์</Btn>
        </div>
        {open&&(
          <div style={{marginTop:12}}>
            {p.comments.map(c=>(
              <div key={c.id} style={{display:"flex",gap:9,marginBottom:10}}>
                <Av init={c.init} bg={c.bg} tc={c.tc} size={30} img={c.init==="ME"?userProfile?.avatar:null} isGrad={c.init==="ME"}/>
                <div style={{background:C.bg,borderRadius:14,padding:"8px 13px",flex:1,border:"1px solid "+C.border}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text}}>{c.author} <span style={{fontWeight:400,color:C.muted,fontSize:11}}>{c.time}</span></div>
                  <div style={{fontSize:13,color:C.text,marginTop:3,lineHeight:1.5}}>{c.text}</div>
                </div>
              </div>
            ))}
            <div style={{display:"flex",gap:9,alignItems:"center",marginTop:6}}>
              <Av init="ME" isGrad size={30} img={userProfile?.avatar}/>
              <input value={cmt} onChange={e=>{setCmt(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()}
                placeholder="เม้นอะไรสักอย่าง..."
                style={{flex:1,border:"1.5px solid "+C.border,borderRadius:20,padding:"8px 14px",fontSize:13,outline:"none",background:C.bg,color:C.text,fontFamily:"inherit"}}/>
              <Btn onClick={submit} variant="primary" size="sm">ส่ง</Btn>
            </div>
            {err&&<div style={{fontSize:12,color:C.red,marginTop:6,marginLeft:39,fontWeight:500}}>{err}</div>}
          </div>
        )}
      </div>
    </Card>
  );
}

function NewPostBox({onPost, user, profile}){
  const [text,setText]=useState("");
  const [mood,setMood]=useState("");
  const [privacy,setPrivacy]=useState("public");
  const [images,setImages]=useState([]);
  const [err,setErr]=useState("");
  const [showM,setShowM]=useState(false);
  const fileRef=useRef();
  function handleFiles(e){Array.from(e.target.files).forEach(f=>{const r=new FileReader();r.onload=ev=>setImages(p=>[...p,{src:ev.target.result,isVideo:f.type.startsWith("video/"),name:f.name}]);r.readAsDataURL(f);});e.target.value="";}
  function submit(){if(!text.trim()&&!images.length){setErr("เขียนอะไรหรือเพิ่มรูปก่อนนะ");return;}onPost({text:text.trim(),mood,privacy,images:images.map(i=>i.src)});setText("");setMood("");setImages([]);setErr("");setShowM(false);}
  return(
    <Card style={{marginBottom:16}}>
      <div style={{padding:"16px 16px 14px"}}>
        <div style={{display:"flex",gap:12}}>
          <Av init={user.init} img={profile?.avatar} isGrad size={42}/>
          <textarea value={text} onChange={e=>{setText(e.target.value);setErr("");}} placeholder="คุณรู้สึกยังไงวันนี้? บอกเพื่อนๆบ้างนะ 💜"
            style={{flex:1,border:"1.5px solid "+C.border,borderRadius:14,padding:"10px 14px",fontSize:14,resize:"none",outline:"none",minHeight:74,lineHeight:1.6,background:"#FAFAFF",color:C.text,fontFamily:"inherit"}}/>
        </div>
        {images.length>0&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10,marginLeft:54}}>
            {images.map((img,i)=>(
              <div key={i} style={{position:"relative",width:72,height:72,borderRadius:12,overflow:"hidden",border:"1.5px solid "+C.border}}>
                {img.isVideo?<div style={{width:"100%",height:"100%",background:"#1a1a1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}><span style={{fontSize:20}}>🎬</span><span style={{fontSize:9,color:"#aaa"}}>{img.name.slice(0,10)}</span></div>
                :<img src={img.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                <button onClick={()=>setImages(imgs=>imgs.filter((_,j)=>j!==i))} style={{position:"absolute",top:3,right:3,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,.6)",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✕</button>
              </div>
            ))}
          </div>
        )}
        {err&&<div style={{fontSize:12,color:C.red,marginTop:7,marginLeft:54,fontWeight:500}}>{err}</div>}
        <div style={{display:"flex",alignItems:"center",gap:7,marginTop:12,marginLeft:54,flexWrap:"wrap"}}>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{display:"none"}} onChange={handleFiles}/>
          <Btn onClick={()=>fileRef.current.click()} variant="ghost" size="sm">📷 รูป/วิดีโอ{images.length>0?` (${images.length})`:""}</Btn>
          <Btn onClick={()=>setShowM(!showM)} variant={mood?"secondary":"ghost"} size="sm">✦ {mood||"mood"}</Btn>
          <select value={privacy} onChange={e=>setPrivacy(e.target.value)}
            style={{padding:"7px 10px",borderRadius:10,border:"1.5px solid "+C.border,background:"#fff",color:C.sub,fontSize:12,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
            <option value="public">🌐 สาธารณะ</option>
            <option value="friends">👥 เพื่อนเท่านั้น</option>
            <option value="only_me">🔒 ฉันเท่านั้น</option>
          </select>
          <Btn onClick={submit} variant="primary" size="sm" style={{marginLeft:"auto"}}>โพสต์ ✨</Btn>
        </div>
        {showM&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10,marginLeft:54}}>{MOODS.map(m=><Btn key={m} onClick={()=>{setMood(m);setShowM(false);}} variant={mood===m?"secondary":"ghost"} size="sm">{m}</Btn>)}</div>}
      </div>
    </Card>
  );
}

function FeedPage({posts,setPosts, user, profile}){
  function handleLike(id){setPosts(ps=>ps.map(p=>p.id===id?{...p,liked:!p.liked,likes:p.liked?p.likes-1:p.likes+1}:p));}
  function handleComment(id,text){setPosts(ps=>ps.map(p=>p.id===id?{...p,comments:[...p.comments,{id:Date.now(),author:user.name,init:user.init,bg:"#EDE9FE",tc:C.brand,text,time:"เมื่อกี้"}]}:p));}
  function handlePost({text,mood,privacy,images}){setPosts(ps=>[{id:Date.now(),author:user.name,init:user.init,bg:"#EDE9FE",tc:C.brand,time:"เมื่อกี้",content:text,mood,privacy,likes:0,liked:false,images:images||[],comments:[]},...ps]);}
  return(<div><NewPostBox onPost={handlePost} user={user} profile={profile}/>{posts.map(p=><PostCard key={p.id} p={p} onLike={handleLike} onComment={handleComment} userProfile={profile}/>)}</div>);
}

function ChatPage({user, profile}){
  const [chats,setChats]=useLocalStorage("warmly_chats", INIT_CHATS);
  const [active,setActive]=useState(1);
  const [input,setInput]=useState("");
  const [voiceOn,setVoiceOn]=useState(false);
  const [micOn,setMicOn]=useState(true);
  const [chatImg,setChatImg]=useState(null);
  const fileRef=useRef();
  const endRef=useRef();
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[chats,active]);
  const friend=FRIENDS.find(f=>f.id===active);
  const msgs=chats[active]||[];
  function send(){const txt=input.trim();if(!txt&&!chatImg)return;const nm=[];if(chatImg)nm.push({id:Date.now(),from:"me",type:"image",src:chatImg});if(txt)nm.push({id:Date.now()+1,from:"me",type:"text",text:txt});setChats(c=>({...c,[active]:[...(c[active]||[]),...nm]}));setInput("");setChatImg(null);setTimeout(()=>{const r=AUTO_REPLIES[Math.floor(Math.random()*AUTO_REPLIES.length)];setChats(c=>({...c,[active]:[...(c[active]||[]),{id:Date.now()+2,from:"them",type:"text",text:r}]}));},900+Math.random()*500);}
  function toggleVoice(){const next=!voiceOn;setVoiceOn(next);if(next){setChats(c=>({...c,[active]:[...(c[active]||[]),{id:Date.now(),from:"system",text:`🎙️ เปิดห้องเสียงแล้ว — รอ ${friend.name} รับสาย...`}]}));setTimeout(()=>setChats(c=>({...c,[active]:[...(c[active]||[]),{id:Date.now(),from:"system",text:`✅ ${friend.name} รับสายแล้ว! คุยได้เลย 💜`}]})),1400);}else{setChats(c=>({...c,[active]:[...(c[active]||[]),{id:Date.now(),from:"system",text:"📵 วางสายแล้ว"}]}));}}
  
  return(
    <div style={{display:"flex",height:"calc(100vh - 112px)",minHeight:460}}>
      {/* ซ่อนรายชื่อเพื่อนบนมือถือ */}
      <style>{`@media(max-width:768px){ .chat-sidebar { display: none !important; } }`}</style>
      <div className="chat-sidebar" style={{width:200,borderRight:"1px solid "+C.border,background:C.surface,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"14px 16px 10px",borderBottom:"1px solid "+C.border,fontSize:13,fontWeight:700,color:C.text}}>ข้อความ</div>
        <div style={{flex:1,overflowY:"auto"}}>
          {FRIENDS.map(f=>(
            <div key={f.id} onClick={()=>setActive(f.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",background:active===f.id?"#F5F3FF":"transparent",borderBottom:"1px solid "+C.border,transition:"background .15s"}}>
              <Av init={f.init} bg={f.bg} tc={f.tc} size={34} online={f.online}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:active===f.id?C.brand:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{f.name}</div>
                <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{(chats[f.id]||[]).filter(m=>m.type==="text").slice(-1)[0]?.text||"..."}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",background:C.bg,minWidth:0}}>
        <div style={{padding:"10px 16px",borderBottom:"1px solid "+C.border,background:C.surface,display:"flex",alignItems:"center",gap:11,flexShrink:0}}>
          <Av init={friend.init} bg={friend.bg} tc={friend.tc} size={36} online={friend.online}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{friend.name}</div>
            <div style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:6}}>
              {friend.online&&<><div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/><span>ออนไลน์</span></>}
              {friend.mood&&<span style={{background:"#F5F3FF",borderRadius:20,padding:"1px 8px",color:C.brand,fontWeight:600,fontSize:11}}>✦ {friend.mood}</span>}
            </div>
          </div>
          <Btn onClick={toggleVoice} variant={voiceOn?"primary":"ghost"} size="sm">🎙️ {voiceOn?"กำลังคุย":"เปิดเสียง"}</Btn>
        </div>
        {voiceOn&&(
          <div style={{background:"#F5F3FF",borderBottom:"1px solid "+C.borderMid,padding:"12px 16px",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:C.brand,display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:C.green,boxShadow:"0 0 6px "+C.green}}/> ห้องเสียง — กำลังคุยกัน
              </div>
              <div style={{display:"flex",gap:6}}>
                <Btn onClick={()=>setMicOn(!micOn)} variant="secondary" size="sm">{micOn?"🎙️ ไมค์เปิด":"🔇 ไมค์ปิด"}</Btn>
                <Btn onClick={toggleVoice} variant="danger" size="sm">📵 วางสาย</Btn>
              </div>
            </div>
            <div style={{display:"flex",gap:16}}>
              {[{init:user.init,isGrad:true,tc:"#fff",name:user.name,sp:true, img:profile?.avatar},{init:friend.init,bg:friend.bg,tc:friend.tc,name:friend.name,sp:false}].map((u,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{padding:3,borderRadius:"50%",border:"3px solid "+(u.sp?C.green:C.borderMid),boxShadow:u.sp?"0 0 10px rgba(16,185,129,.3)":"none"}}>
                    <Av init={u.init} bg={u.bg} isGrad={u.isGrad} tc={u.tc} img={u.img} size={44}/>
                  </div>
                  <div style={{fontSize:12,color:C.brand,fontWeight:700}}>{u.name}</div>
                  <div style={{fontSize:10,background:u.sp?"#D1FAE5":C.border,color:u.sp?C.green:C.muted,borderRadius:20,padding:"2px 7px",fontWeight:600}}>{u.sp?(micOn?"🎙️":"🔇"):"🎧"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {chatImg&&<div style={{padding:"8px 16px 0",flexShrink:0}}><div style={{position:"relative",display:"inline-block"}}><img src={chatImg} alt="" style={{height:64,borderRadius:10,objectFit:"cover",border:"1px solid "+C.border}}/><button onClick={()=>setChatImg(null)} style={{position:"absolute",top:-4,right:-4,width:18,height:18,borderRadius:"50%",background:"#444",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✕</button></div></div>}
        <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
          {msgs.map(m=>{
            if(m.from==="system")return<div key={m.id} style={{textAlign:"center",fontSize:12,color:C.muted,padding:"4px 0"}}>{m.text}</div>;
            const me=m.from==="me";
            return(
              <div key={m.id} style={{display:"flex",gap:8,alignItems:"flex-end",flexDirection:me?"row-reverse":"row"}}>
                {!me&&<Av init={friend.init} bg={friend.bg} tc={friend.tc} size={28}/>}
                <div style={{maxWidth:"70%"}}>
                  {m.type==="image"?<img src={m.src} alt="" style={{maxWidth:"100%",borderRadius:14,display:"block",border:"1px solid "+C.border}}/>
                  :<div style={{padding:"9px 14px",borderRadius:16,fontSize:14,lineHeight:1.55,background:me?C.grad:"#fff",color:me?"#fff":C.text,border:me?"none":"1px solid "+C.border,borderBottomLeftRadius:!me?4:16,borderBottomRightRadius:me?4:16,boxShadow:me?"0 2px 10px rgba(124,58,237,.3)":"0 1px 4px rgba(0,0,0,.06)"}}>{m.text}</div>}
                </div>
              </div>
            );
          })}
          <div ref={endRef}/>
        </div>
        <div style={{padding:"10px 16px",borderTop:"1px solid "+C.border,background:C.surface,flexShrink:0}}>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setChatImg(ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <button onClick={()=>fileRef.current.click()} style={{width:36,height:36,borderRadius:"50%",border:"1.5px solid "+C.border,background:C.bg,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>📷</button>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="พิมพ์ข้อความ..." rows={1}
              style={{flex:1,border:"1.5px solid "+C.border,borderRadius:20,padding:"9px 16px",fontSize:14,color:C.text,background:"#FAFAFF",outline:"none",resize:"none",fontFamily:"inherit",lineHeight:1.4}}/>
            <button onClick={send} style={{width:38,height:38,borderRadius:"50%",background:C.grad,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",flexShrink:0,fontSize:17,boxShadow:"0 2px 10px rgba(124,58,237,.4)",fontFamily:"inherit"}}>↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({posts, user, profile, setProfile}){
  const [editing,setEditing]=useState(false);
  const [bioInput,setBioInput]=useState(profile.bio);
  const [showMP,setShowMP]=useState(false);
  
  const coverRef=useRef();const avatarRef=useRef();
  const myPosts=posts.filter(p=>p.init===user.init);

  const updateProfile = (key, val) => {
    setProfile(p => ({...p, [key]: val}));
  };

  return(
    <div>
      <Card style={{marginBottom:14,overflow:"hidden"}}>
        <div style={{height:120,background:profile.cover?"transparent":C.gradHero,position:"relative",cursor:"pointer"}} onClick={()=>coverRef.current.click()}>
          {profile.cover?<img src={profile.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          :<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.5)",fontSize:13,fontWeight:500}}>✏️ คลิกเพื่อเปลี่ยนรูปปก</div>}
          <input ref={coverRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>updateProfile('cover', ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
        </div>
        <div style={{padding:"0 20px 20px",position:"relative"}}>
          <div style={{position:"absolute",top:-36,left:20,cursor:"pointer"}} onClick={()=>avatarRef.current.click()}>
            {profile.avatar
              ?<div style={{width:70,height:70,borderRadius:"50%",overflow:"hidden",border:"4px solid #fff",boxShadow:"0 4px 16px rgba(124,58,237,.3)"}}><img src={profile.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
              :<div style={{width:70,height:70,borderRadius:"50%",background:C.grad,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,border:"4px solid #fff",boxShadow:"0 4px 16px rgba(124,58,237,.3)"}}>{user.init}</div>
            }
            <input ref={avatarRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>updateProfile('avatar', ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
          </div>
          <div style={{paddingTop:44}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:19,fontWeight:800,color:C.text}}>{user.name}</div>
                {user.isGuest&&<div style={{fontSize:11,background:"#FEF3C7",color:"#92400E",borderRadius:20,padding:"2px 8px",display:"inline-block",fontWeight:600,marginTop:3}}>👋 ผู้เยี่ยมชม</div>}
                {editing?<div style={{marginTop:7,display:"flex",gap:7}}>
                  <input value={bioInput} onChange={e=>setBioInput(e.target.value)} style={{border:"1.5px solid "+C.border,borderRadius:10,padding:"6px 11px",fontSize:13,outline:"none",width:220,color:C.text,background:C.bg,fontFamily:"inherit"}}/>
                  <Btn onClick={()=>{updateProfile('bio', bioInput);setEditing(false);}} variant="primary" size="sm">บันทึก</Btn>
                </div>:<div style={{fontSize:13,color:C.sub,marginTop:5,lineHeight:1.5}}>{profile.bio}</div>}
                <div style={{marginTop:9}}>
                  <span onClick={()=>setShowMP(!showMP)} style={{background:"#F5F3FF",color:C.brand,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700,cursor:"pointer",border:"1px solid "+C.borderMid}}>✦ {profile.mood}</span>
                </div>
                {showMP&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>{MOODS.map(m=><Btn key={m} onClick={()=>{updateProfile('mood', m);setShowMP(false);}} variant={profile.mood===m?"secondary":"ghost"} size="sm">{m}</Btn>)}</div>}
              </div>
              <Btn onClick={()=>{setEditing(!editing);setBioInput(profile.bio);}} variant="ghost" size="sm">✏️ แก้ไข</Btn>
            </div>
            <div style={{display:"flex",gap:28,marginTop:16,paddingTop:14,borderTop:"1px solid "+C.border}}>
              {[["48","เพื่อน"],[String(myPosts.length),"โพสต์"],["1.2k","การเข้าชม"]].map(([n,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:19,fontWeight:800,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
                  <div style={{fontSize:12,color:C.muted}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div style={{padding:"16px 18px"}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>โพสต์ของฉัน</div>
          {myPosts.length===0&&<div style={{fontSize:13,color:C.muted,textAlign:"center",padding:"20px 0"}}>ยังไม่มีโพสต์ — ลองโพสต์แรกได้เลย! ✨</div>}
          {myPosts.map(p=>(
            <div key={p.id} style={{borderBottom:"1px solid "+C.border,paddingBottom:12,marginBottom:12}}>
              {p.images?.length>0&&<div style={{display:"flex",gap:5,marginBottom:7,flexWrap:"wrap"}}>{p.images.map((src,i)=><img key={i} src={src} alt="" style={{width:60,height:60,borderRadius:10,objectFit:"cover",border:"1px solid "+C.border}}/>)}</div>}
              {p.content&&<div style={{fontSize:13,color:C.text,lineHeight:1.65}}>{p.content}</div>}
              <div style={{fontSize:11,color:C.muted,marginTop:6,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <span>{p.time}</span><span>{PV_ICO[p.privacy]}</span>
                {p.mood&&<span style={{background:"#F5F3FF",borderRadius:20,padding:"0 7px",color:C.brand,fontWeight:600}}>✦ {p.mood}</span>}
                <span>❤️ {p.likes}</span><span>💬 {p.comments.length}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PrivacyPage(){
  const [s,setS]=useState({postDef:"public",whoSee:"public",whoCmt:"everyone",whoMsg:"everyone",showMood:true,showOnline:true,showLast:true,friendList:"friends"});
  const set=(k,v)=>setS(p=>({...p,[k]:v}));
  const pv=[{v:"public",l:"🌐 สาธารณะ"},{v:"friends",l:"👥 เพื่อนเท่านั้น"},{v:"only_me",l:"🔒 ฉันเท่านั้น"}];
  const ev=[{v:"everyone",l:"ทุกคน"},{v:"friends",l:"เพื่อนเท่านั้น"},{v:"none",l:"ไม่มีใคร"}];
  const Toggle=({label,desc,k})=>(
    <div style={{padding:"13px 0",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
      <div><div style={{fontSize:14,color:C.text,fontWeight:500}}>{label}</div>{desc&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{desc}</div>}</div>
      <div onClick={()=>set(k,!s[k])} style={{width:46,height:26,borderRadius:13,cursor:"pointer",background:s[k]?C.brand:"#D1D5DB",position:"relative",transition:"background .2s",flexShrink:0,boxShadow:s[k]?"0 2px 6px rgba(124,58,237,.3)":"none"}}>
        <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:s[k]?23:3,transition:"left .22s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
      </div>
    </div>
  );
  const Select=({label,desc,k,opts})=>(
    <div style={{padding:"13px 0",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
      <div><div style={{fontSize:14,color:C.text,fontWeight:500}}>{label}</div>{desc&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{desc}</div>}</div>
      <select value={s[k]} onChange={e=>set(k,e.target.value)} style={{padding:"7px 11px",borderRadius:10,border:"1.5px solid "+C.border,background:C.bg,color:C.sub,fontSize:13,outline:"none",flexShrink:0,fontFamily:"inherit",cursor:"pointer"}}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>
    </div>
  );
  const Sec=({title,children})=><Card style={{marginBottom:12}}><div style={{padding:"4px 18px"}}><div style={{fontSize:11,fontWeight:700,color:C.muted,padding:"12px 0 4px",textTransform:"uppercase",letterSpacing:1.2}}>{title}</div>{children}</div></Card>;
  return(
    <div>
      <Card style={{marginBottom:14}}>
        <div style={{padding:"18px 20px"}}>
          <div style={{fontSize:17,fontWeight:800,color:C.text}}>ความเป็นส่วนตัว 🔒</div>
          <div style={{fontSize:13,color:C.muted,marginTop:4}}>ปรับว่าใครเห็นอะไรได้บ้าง</div>
        </div>
      </Card>
      <Sec title="โพสต์"><Select label="โพสต์เริ่มต้น" desc="ค่าเริ่มต้นเวลาสร้างโพสต์ใหม่" k="postDef" opts={pv}/><Select label="ใครเห็นโพสต์ได้" k="whoSee" opts={pv}/><Select label="ใครเม้นได้" k="whoCmt" opts={ev}/></Sec>
      <Sec title="โปรไฟล์"><Toggle label="แสดง mood" desc="ให้คนอื่นเห็น mood ของคุณ" k="showMood"/><Toggle label="แสดงสถานะออนไลน์" k="showOnline"/><Toggle label="แสดงเวลาออนไลน์ล่าสุด" k="showLast"/><Select label="ใครเห็นรายชื่อเพื่อน" k="friendList" opts={pv}/></Sec>
      <Sec title="ข้อความและเสียง"><Select label="ใครส่งข้อความได้" k="whoMsg" opts={ev}/></Sec>
      <Card>
        <div style={{padding:"18px 20px"}}>
          <div style={{fontSize:14,fontWeight:700,color:C.red,marginBottom:10}}>โซนอันตราย ⚠️</div>
          <Btn variant="danger" size="md" style={{width:"100%",justifyContent:"center",borderRadius:12}}>ปิดบัญชีชั่วคราว</Btn>
        </div>
      </Card>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────
const TABS=[
  {key:"feed",   icon:"🏠", label:"ฟีด"},
  {key:"chat",   icon:"💬", label:"แชท"},
  {key:"voice",  icon:"🎙️", label:"ห้องเสียง"},
  {key:"profile",icon:"👤", label:"โปรไฟล์"},
  {key:"privacy",icon:"🔒", label:"ส่วนตัว"},
];

export default function App(){
  // ใช้ localStorage สำหรับเก็บข้อมูลหลัก
  const [user,setUser]=useLocalStorage("warmly_user", null);
  const [page,setPage]=useState("feed");
  const [posts,setPosts]=useLocalStorage("warmly_posts", INIT_POSTS);
  
  // โปรไฟล์ (รูป, bio)
  const [profile, setProfile]=useLocalStorage("warmly_profile", {
    bio: "ชอบคุยเล่น • ฟังเพลง • หาเพื่อนใหม่ 💜",
    mood: "สบายดี 😊",
    avatar: null,
    cover: null
  });

  if(!user) return <AuthPage onLogin={u=>setUser(u)}/>;

  return(
    <div style={{fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
      {/* ── CSS จัดการเลย์เอาต์มือถือ Bottom Navigation ── */}
      <style>{`
        *{box-sizing:border-box}
        button,input,select,textarea{font-family:inherit}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#DDD6FE;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#C4B5FD}
        
        .desktop-tabs { display: flex; gap: 5px; flex-wrap: wrap; }
        .mobile-tabs { display: none; }
        .main-content { padding-bottom: 52px; }
        
        @media (max-width: 768px) {
          .desktop-tabs { display: none !important; }
          .mobile-tabs {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            border-top: 1px solid ${C.border};
            justify-content: space-around;
            padding: 10px 5px;
            padding-bottom: calc(10px + env(safe-area-inset-bottom));
            z-index: 100;
            box-shadow: 0 -4px 15px rgba(124, 58, 237, 0.05);
          }
          .main-content { padding-bottom: 100px !important; }
        }
      `}</style>

      {/* Topbar */}
      <div style={{background:"rgba(255,255,255,.94)",backdropFilter:"blur(16px)",borderBottom:"1px solid "+C.border,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:30,boxShadow:"0 1px 20px rgba(124,58,237,.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 2px 8px rgba(124,58,237,.4)"}}>💜</div>
          <span style={{fontSize:19,fontWeight:800,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-.5}}>Warmly</span>
        </div>
        
        {/* เมนูแท็บจอใหญ่ (คอม) */}
        <div className="desktop-tabs">
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setPage(t.key)}
              style={{padding:"7px 13px",borderRadius:12,border:"1.5px solid "+(page===t.key?C.brand:C.border),background:page===t.key?C.grad:"transparent",color:page===t.key?"#fff":C.sub,cursor:"pointer",fontSize:12,fontWeight:page===t.key?700:500,display:"flex",alignItems:"center",gap:5,transition:"all .2s",boxShadow:page===t.key?"0 2px 10px rgba(124,58,237,.35)":"none",fontFamily:"inherit"}}>
              <span style={{fontSize:13}}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {profile.avatar && (
            <img src={profile.avatar} alt="Profile" style={{width:30, height:30, borderRadius:"50%", objectFit:"cover", border:"2px solid "+C.brand}} />
          )}
          <div style={{fontSize:13,color:C.sub,fontWeight:500, display: "none" /* ซ่อนชื่อยาวๆ บนมือถือถ้าแคบไป ให้ใช้คลาสซ่อนได้ถ้าอยาก */}} className="hide-mobile">{user.name}</div>
          {user.isGuest&&<span style={{fontSize:10,background:"#FEF3C7",color:"#92400E",borderRadius:20,padding:"2px 7px",fontWeight:700}}>Guest</span>}
          <button onClick={()=>{setUser(null);}} style={{border:"1.5px solid "+C.border,borderRadius:10,background:"transparent",color:C.muted,cursor:"pointer",padding:"5px 10px",fontSize:12,fontFamily:"inherit"}}>ออก</button>
        </div>
      </div>

      <div className="main-content" style={{flex:1,maxWidth:660,width:"100%",margin:"0 auto",padding:page==="chat"?"0":"18px 16px",boxSizing:"border-box"}}>
        {page==="feed"    && <FeedPage posts={posts} setPosts={setPosts} user={user} profile={profile}/>}
        {page==="chat"    && <ChatPage user={user} profile={profile}/>}
        {page==="voice"   && <VoiceRoomsPage user={user} profile={profile}/>}
        {page==="profile" && <ProfilePage posts={posts} user={user} profile={profile} setProfile={setProfile}/>}
        {page==="privacy" && <PrivacyPage/>}
      </div>

      {/* เมนูแท็บจอมือถือ (Bottom Nav) */}
      <div className="mobile-tabs">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setPage(t.key)}
            style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 0", background:"transparent", border:"none", cursor:"pointer", color:page===t.key?C.brand:C.muted}}>
            <div style={{fontSize:18, filter:page===t.key?"drop-shadow(0 2px 4px rgba(124,58,237,0.3))":""}}>{t.icon}</div>
            <div style={{fontSize:10, fontWeight:page===t.key?700:500}}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
