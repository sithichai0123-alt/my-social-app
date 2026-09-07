import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// Design System
// ─────────────────────────────────────────────
const T = {
  bg:       "#0F0E17",
  surface:  "#1A1825",
  card:     "#221F33",
  cardHov:  "#2A2640",
  border:   "#2E2A45",
  borderHi: "#4F46A8",
  brand:    "#7C5CFC",
  brand2:   "#A78BFA",
  brandGrad:"linear-gradient(135deg,#7C5CFC,#A78BFA)",
  text:     "#F0EEFF",
  sub:      "#9B94C4",
  muted:    "#5C5780",
  green:    "#10B981",
  red:      "#F43F5E",
  redBg:    "rgba(244,63,94,.12)",
  yellow:   "#F59E0B",
  glass:    "rgba(34,31,51,.7)",
};

// ─────────────────────────────────────────────
// Persistent Storage (localStorage)
// ─────────────────────────────────────────────
const store = {
  get: (k, def) => {
    try {
      const v = localStorage.getItem("wm_"+k);
      if (!v) return def;
      const parsed = JSON.parse(v);
      // ถ้า expect array แต่ได้ค่าอื่นมา ให้ใช้ default แทน
      if (Array.isArray(def) && !Array.isArray(parsed)) return def;
      return parsed;
    } catch { return def; }
  },
  set: (k, v) => { try { localStorage.setItem("wm_"+k, JSON.stringify(v)); } catch {} },
  clear: (k)  => { try { localStorage.removeItem("wm_"+k); } catch {} },
};

// ─────────────────────────────────────────────
// Static Data
// ─────────────────────────────────────────────
const FRIENDS = [
  {id:1,name:"หนูนก",init:"NK",bg:"#1A3A2A",tc:"#6EE7B7",online:true, mood:"เหงา 🌙"},
  {id:2,name:"อาร์ม", init:"AR",bg:"#1A2A3A",tc:"#93C5FD",online:true, mood:"สนุก 🎉"},
  {id:3,name:"มิ้นท์",init:"MT",bg:"#3A1A2A",tc:"#F9A8D4",online:false,mood:"ง่วง 😴"},
  {id:4,name:"ไบรท์",init:"BR",bg:"#2A2A1A",tc:"#FCD34D",online:true, mood:"สงบ ✨"},
  {id:5,name:"แพม",  init:"PM",bg:"#1A3A1A",tc:"#86EFAC",online:true, mood:"สบายดี 😊"},
];
const MOODS = ["สบายดี 😊","เหงา 🌙","สนุก 🎉","เครียด 😮‍💨","ง่วง 😴","สงบ ✨","ตื่นเต้น ⚡","โดดเดี่ยว 🫥"];
const PV_LBL = {public:"สาธารณะ",friends:"เพื่อนเท่านั้น",only_me:"ฉันเท่านั้น"};
const PV_ICO  = {public:"🌐",friends:"👥",only_me:"🔒"};
const AUTO_REPLIES = ["อ่อ จริงๆ เหรอ 😊","รู้สึกแบบเดียวกันเลย 💜","ฮ่าๆ น่ารักมาก 🥰","แล้วยังไงต่อล่ะ?","ใช่เลย! 100%","เดี๋ยวเล่าให้ฟังนะ 🎵"];

const SEED_POSTS = [
  {id:"s1",author:"หนูนก",init:"NK",bg:"#1A3A2A",tc:"#6EE7B7",time:"2 นาทีที่แล้ว",content:"วันนี้เหงามากเลย ใครว่างคุยด้วยบ้าง 🌙",mood:"เหงา 🌙",privacy:"public",likes:12,liked:false,images:[],comments:[{id:"c1",author:"แพม",init:"PM",bg:"#1A3A1A",tc:"#86EFAC",text:"มาคุยด้วยได้เลยนะ 🌸",time:"1น."}]},
  {id:"s2",author:"ไบรท์",init:"BR",bg:"#2A2A1A",tc:"#FCD34D",time:"1 ชม.",content:"อากาศดีมากวันนี้ ☀️",mood:"สงบ ✨",privacy:"friends",likes:24,liked:true,images:["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"],comments:[]},
  {id:"s3",author:"แพม",init:"PM",bg:"#1A3A1A",tc:"#86EFAC",time:"3 ชม.",content:"กาแฟสักแก้วในวันหยุด ☕ ชีวิตดี",mood:"สบายดี 😊",privacy:"public",likes:31,liked:false,images:["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80"],comments:[]},
];

const INIT_VOICE_ROOMS = [
  {id:"vr1",name:"นั่งเงียบๆด้วยกัน",vibe:"🌙",hostId:"NK",members:[{init:"NK",name:"หนูนก",bg:"#1A3A2A",tc:"#6EE7B7",mic:true},{init:"BR",name:"ไบรท์",bg:"#2A2A1A",tc:"#FCD34D",mic:false},{init:"PM",name:"แพม",bg:"#1A3A1A",tc:"#86EFAC",mic:true}],playlist:[]},
  {id:"vr2",name:"คืนนี้เหงาใครมาก", vibe:"💜",hostId:"AR",members:[{init:"AR",name:"อาร์ม",bg:"#1A2A3A",tc:"#93C5FD",mic:true},{init:"MT",name:"มิ้นท์",bg:"#3A1A2A",tc:"#F9A8D4",mic:true}],playlist:[]},
];

const INIT_CHATS = {
  1:[{id:"m1",from:"them",text:"หวัดดีจ้า วันนี้เป็นยังไงบ้าง 😊",type:"text"}],
  2:[{id:"m2",from:"them",text:"เฮ้ มีอะไรเล่าให้ฟังมั้ย 👂",type:"text"}],
  3:[{id:"m3",from:"them",text:"ง่วงมากเลยวันนี้ 😴",type:"text"}],
  4:[{id:"m4",from:"them",text:"อยู่บ้านคนเดียวเหงาๆ",type:"text"}],
  5:[{id:"m5",from:"them",text:"ใครอยากคุยบ้างมั้ย! 🙋",type:"text"}],
};

// ─────────────────────────────────────────────
// YouTube helpers
// ─────────────────────────────────────────────
function getYTId(url) {
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split(/[?&]/)[0];
    return u.searchParams.get("v") || "";
  } catch { return ""; }
}
function ytThumb(id) { return `https://img.youtube.com/vi/${id}/mqdefault.jpg`; }
function ytEmbed(id) { return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`; }

// ─────────────────────────────────────────────
// Primitive UI
// ─────────────────────────────────────────────
function Av({ init, bg, tc, size=40, online, grad }) {
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:"50%",
        background: grad ? T.brandGrad : (bg||T.card),
        color: grad ? "#fff" : (tc||T.brand2),
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*.32, fontWeight:700,
        boxShadow: grad ? "0 0 16px rgba(124,92,252,.5)" : "none",
      }}>{init}</div>
      {online && <div style={{ position:"absolute", bottom:1, right:1, width:size*.22, height:size*.22,
        borderRadius:"50%", background:T.green, border:"2px solid "+T.bg }} />}
    </div>
  );
}

const Chip = ({ children, active, onClick, color }) => (
  <span onClick={onClick} style={{
    display:"inline-flex", alignItems:"center", gap:4,
    padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:500, cursor:onClick?"pointer":"default",
    background: active ? (color||T.brand)+"22" : "transparent",
    color: active ? (color||T.brand2) : T.sub,
    border: "1px solid " + (active ? (color||T.brand)+"55" : T.border),
    transition:"all .15s",
  }}>{children}</span>
);

function Btn({ children, onClick, v="primary", sz="md", full, style={} }) {
  const variants = {
    primary: { background:T.brandGrad, color:"#fff", border:"none", boxShadow:"0 4px 16px rgba(124,92,252,.35)" },
    ghost:   { background:"transparent", color:T.sub, border:"1px solid "+T.border },
    outline: { background:"transparent", color:T.brand2, border:"1px solid "+T.borderHi },
    danger:  { background:T.redBg, color:T.red, border:"1px solid rgba(244,63,94,.3)" },
  };
  const sizes = {
    sm: { padding:"6px 14px", borderRadius:10, fontSize:12 },
    md: { padding:"9px 20px", borderRadius:12, fontSize:14 },
    lg: { padding:"13px 28px", borderRadius:14, fontSize:15 },
  };
  return (
    <button onClick={onClick} style={{ fontFamily:"inherit", fontWeight:600, cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
      width:full?"100%":undefined, transition:"all .18s",
      ...variants[v], ...sizes[sz], ...style }}>{children}</button>
  );
}

function Card({ children, style={} }) {
  return (
    <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:18,
      overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,.3)", ...style }}>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type="text", onKeyDown, style={} }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown}
      style={{ width:"100%", background:T.surface, border:"1px solid "+T.border, borderRadius:12,
        padding:"11px 16px", fontSize:14, outline:"none", color:T.text, boxSizing:"border-box",
        fontFamily:"inherit", transition:"border .15s", ...style }}
      onFocus={e=>e.target.style.borderColor=T.borderHi}
      onBlur={e=>e.target.style.borderColor=T.border} />
  );
}

function ImgGrid({ images }) {
  if (!images?.length) return null;
  const n = images.length;
  return (
    <div style={{ display:"grid", gap:2, margin:"10px 0", borderRadius:14, overflow:"hidden",
      gridTemplateColumns: n===1?"1fr":"1fr 1fr", maxHeight: n===1?340:240 }}>
      {images.slice(0,4).map((src,i) => (
        <div key={i} style={{ overflow:"hidden", position:"relative", gridColumn:n===3&&i===0?"1/3":undefined }}>
          <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", minHeight:120 }}
            onError={e=>e.target.style.display="none"}/>
          {i===3&&n>4 && <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:22, fontWeight:700 }}>+{n-4}</div>}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  function loginGoogle() {
    // จำลอง Google OAuth
    const u = { name:"สิทธิชัย", email:"sittichai@gmail.com", avatar:"", isGuest:false, provider:"google" };
    store.set("user", u);
    onLogin(u);
  }
  function loginGuest() {
    if (!name.trim()) { setErr("ใส่ชื่อที่ต้องการแสดงก่อนนะ"); return; }
    const u = { name:name.trim(), email:"", avatar:"", isGuest:true, provider:"guest" };
    store.set("user", u);
    onLogin(u);
  }

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

      {/* Hero */}
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ width:72, height:72, borderRadius:22, background:T.brandGrad,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:36,
          margin:"0 auto 18px", boxShadow:"0 8px 32px rgba(124,92,252,.5)", animation:"float 3s ease-in-out infinite" }}>💜</div>
        <div style={{ fontSize:36, fontWeight:800, color:T.text, letterSpacing:-1 }}>Warmly</div>
        <div style={{ fontSize:15, color:T.sub, marginTop:8, lineHeight:1.6 }}>พื้นที่อบอุ่น สำหรับทุกคน<br/>หาเพื่อน คุยเล่น ไม่เหงา</div>
      </div>

      <div style={{ width:"100%", maxWidth:360 }}>
        {/* Google */}
        <button onClick={loginGoogle} style={{ width:"100%", padding:"14px 20px", borderRadius:16,
          border:"1px solid "+T.border, background:T.card, color:T.text, cursor:"pointer",
          fontSize:15, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center",
          gap:12, marginBottom:14, fontFamily:"inherit", transition:"all .2s" }}
          onMouseOver={e=>e.currentTarget.style.borderColor=T.borderHi}
          onMouseOut={e=>e.currentTarget.style.borderColor=T.border}>
          <span style={{ fontSize:22 }}>🔵</span> เข้าสู่ระบบด้วย Google
        </button>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"18px 0" }}>
          <div style={{ flex:1, height:1, background:T.border }}/>
          <span style={{ fontSize:12, color:T.muted }}>หรือ</span>
          <div style={{ flex:1, height:1, background:T.border }}/>
        </div>

        {/* Guest */}
        <div style={{ background:T.surface, border:"1px solid "+T.border, borderRadius:16, padding:"20px 18px" }}>
          <div style={{ fontSize:13, color:T.sub, marginBottom:12, textAlign:"center" }}>เข้าแบบผู้เยี่ยมชม 👋<br/>ไม่ต้องสมัคร</div>
          <Input value={name} onChange={e=>{setName(e.target.value);setErr("");}} placeholder="ชื่อที่ต้องการแสดง..." onKeyDown={e=>e.key==="Enter"&&loginGuest()} style={{marginBottom:10}}/>
          {err && <div style={{ fontSize:12, color:T.red, marginBottom:10, fontWeight:500 }}>{err}</div>}
          <Btn onClick={loginGuest} v="outline" sz="md" full>เข้าแบบผู้เยี่ยมชม</Btn>
        </div>

        <div style={{ textAlign:"center", fontSize:12, color:T.muted, marginTop:20, lineHeight:1.6 }}>
          การเข้าใช้งาน แสดงว่าคุณยอมรับ<br/>นโยบายความเป็นส่วนตัวของเรา
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// YouTube Playlist Component
// ─────────────────────────────────────────────
function YoutubePlaylist({ playlist, setPlaylist, isHost }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [err, setErr] = useState("");
  const [playing, setPlaying] = useState(null);

  function add() {
    try {
      const id = getYTId(url);
      if (!id) { setErr("ลิงก์ YouTube ไม่ถูกต้อง"); return; }
      const safeList = Array.isArray(playlist) ? playlist : [];
      if (safeList.find(p=>p.id===id)) { setErr("เพลงนี้อยู่ใน playlist แล้ว"); return; }
      const newSong = { id, title:title.trim()||"YouTube: "+id.slice(0,10)+"…", thumb:ytThumb(id) };
      setPlaylist([...safeList, newSong]);
      setUrl(""); setTitle(""); setErr("");
    } catch(e) { setErr("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง"); }
  }

  return (
    <div style={{ borderTop:"1px solid "+T.border, paddingTop:14, marginTop:14 }}>
      <div style={{ fontSize:13, fontWeight:700, color:T.brand2, marginBottom:12, display:"flex", alignItems:"center", gap:7 }}>
        🎵 Playlist <span style={{ fontSize:11, fontWeight:400, color:T.muted }}>({playlist.length})</span>
      </div>

      {isHost && (
        <div style={{ background:T.surface, border:"1px dashed "+T.border, borderRadius:14, padding:"12px 14px", marginBottom:12 }}>
          <div style={{ fontSize:12, color:T.muted, marginBottom:8 }}>➕ เพิ่มจาก YouTube URL</div>
          <Input value={url} onChange={e=>{setUrl(e.target.value);setErr("");}} placeholder="https://youtube.com/watch?v=..." style={{marginBottom:7}}/>
          <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="ชื่อเพลง (ไม่บังคับ)" onKeyDown={e=>e.key==="Enter"&&add()} style={{marginBottom:7}}/>
          {err && <div style={{ fontSize:12, color:T.red, marginBottom:7 }}>{err}</div>}
          <Btn onClick={add} v="primary" sz="sm">เพิ่มเพลง</Btn>
        </div>
      )}

      {/* Playing iframe */}
      {playing && (
        <div style={{ marginBottom:12, borderRadius:12, overflow:"hidden", border:"1px solid "+T.border, background:"#000" }}>
          <div style={{ display:"flex", justifyContent:"flex-end", padding:"6px 10px", background:T.surface }}>
            <button onClick={()=>setPlaying(null)} style={{ background:"transparent", border:"none", color:T.muted, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>✕ ปิด</button>
          </div>
          <iframe
            src={ytEmbed(playing)}
            width="100%" height="200"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen style={{ display:"block" }}
            title="YouTube player"
          />
        </div>
      )}

      {(!Array.isArray(playlist) || playlist.length === 0) && (
        <div style={{ textAlign:"center", padding:"14px 0", color:T.muted, fontSize:13 }}>
          {isHost ? "วาง YouTube URL ด้านบนเพื่อเพิ่มเพลง 🎵" : "Host ยังไม่ได้เพิ่มเพลง"}
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {(Array.isArray(playlist) ? playlist : []).map((s,i) => (
          <div key={s.id} style={{ display:"flex", gap:10, alignItems:"center", padding:"9px 12px", borderRadius:12,
            background: playing===s.id ? T.brand+"22" : T.surface,
            border:"1px solid "+(playing===s.id ? T.borderHi : T.border), cursor:"pointer", transition:"all .18s" }}>
            <span style={{ fontSize:13, fontWeight:700, color:T.muted, width:18, textAlign:"center", flexShrink:0 }}>{i+1}</span>
            <img src={s.thumb} alt="" style={{ width:48, height:34, borderRadius:8, objectFit:"cover", flexShrink:0, border:"1px solid "+T.border }}
              onError={e=>e.target.style.display="none"}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.title}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>กดเพื่อเปิดดูในห้อง</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>setPlaying(prev=>prev===s.id?null:s.id)}
                style={{ border:"none", background:"transparent", color:playing===s.id?T.brand2:T.muted, cursor:"pointer", fontSize:16, fontFamily:"inherit" }}>
                {playing===s.id?"⏸":"▶"}
              </button>
              {isHost && <button onClick={()=>{setPlaylist(p=>(Array.isArray(p)?p:[]).filter(x=>x.id!==s.id));if(playing===s.id)setPlaying(null);}}
                style={{ border:"none", background:"transparent", color:T.muted, cursor:"pointer", fontSize:14, fontFamily:"inherit" }}>✕</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Voice Rooms
// ─────────────────────────────────────────────
function VoiceRoomsPage({ user }) {
  const [rooms, setRooms] = useState(INIT_VOICE_ROOMS);
  const [inRoomId, setInRoomId] = useState(null);
  const [myMic, setMyMic] = useState(true);
  const [showPL, setShowPL] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [nameErr, setNameErr] = useState("");

  const inRoom = rooms.find(r=>r.id===inRoomId);
  const isHost = inRoom && inRoom.hostId === (user.init||"ME");

  function join(r) {
    setRooms(prev => prev.map(room => {
      if (room.id !== r.id) return room;
      if (room.members.find(m=>m.init===(user.init||"ME"))) return room;
      return { ...room, members:[...room.members,{init:user.init||"ME",name:user.name,bg:T.card,tc:T.brand2,mic:true}] };
    }));
    setInRoomId(r.id); setMyMic(true); setShowPL(false);
  }
  function leave() { setRooms(prev=>prev.map(r=>r.id!==inRoomId?r:{...r,members:r.members.filter(m=>m.init!==(user.init||"ME"))})); setInRoomId(null); setShowPL(false); }
  function hostToggleMic(init) { if(!isHost)return; setRooms(p=>p.map(r=>r.id!==inRoomId?r:{...r,members:r.members.map(m=>m.init===init?{...m,mic:!m.mic}:m)})); }
  function kick(init) { if(!isHost||init===(user.init||"ME"))return; setRooms(p=>p.map(r=>r.id!==inRoomId?r:{...r,members:r.members.filter(m=>m.init!==init)})); }
  function create() { if(!newName.trim()){setNameErr("ใส่ชื่อห้องก่อนนะ");return;} const r={id:"vr"+Date.now(),name:newName.trim(),vibe:"🎵",hostId:user.init||"ME",members:[{init:user.init||"ME",name:user.name,bg:T.card,tc:T.brand2,mic:true}],playlist:[]}; setRooms(p=>[r,...p]); join(r); setNewName(""); setCreating(false); setNameErr(""); }
  function updatePL(pl) { setRooms(p=>p.map(r=>r.id===inRoomId?{...r,playlist:pl}:r)); }

  return (
    <div>
      {inRoom && (
        <Card style={{ marginBottom:16, border:"1px solid "+T.borderHi }}>
          <div style={{ background:"linear-gradient(135deg,"+T.card+","+T.surface+")", padding:"16px 16px 0" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14, gap:10 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:T.text, display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:T.green, boxShadow:"0 0 8px "+T.green }}/>
                  {inRoom.vibe} {inRoom.name}
                </div>
                <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{isHost?"👑 คุณเป็น Host":"กำลังคุยอยู่"} • {inRoom.members.length} คน</div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <Btn onClick={()=>setShowPL(!showPL)} v={showPL?"primary":"ghost"} sz="sm">🎵</Btn>
                <Btn onClick={()=>setMyMic(!myMic)} v="ghost" sz="sm">{myMic?"🎙️":"🔇"}</Btn>
                <Btn onClick={leave} v="danger" sz="sm">📵</Btn>
              </div>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", paddingBottom:16 }}>
              {inRoom.members.map((m,i)=>{
                const isMe = m.init===(user.init||"ME");
                const speaking = isMe?myMic:m.mic;
                return (
                  <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, position:"relative" }}>
                    {isHost&&!isMe&&(
                      <div style={{ position:"absolute", top:-6, right:-4, display:"flex", gap:2, zIndex:2 }}>
                        <button onClick={()=>hostToggleMic(m.init)} style={{ width:16,height:16,borderRadius:"50%",background:m.mic?"#1A3A2A":"#2A2A1A",border:"1px solid "+T.border,cursor:"pointer",fontSize:8,color:m.mic?T.green:T.yellow,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>{m.mic?"🎙":"🔇"}</button>
                        <button onClick={()=>kick(m.init)} style={{ width:16,height:16,borderRadius:"50%",background:T.redBg,border:"1px solid rgba(244,63,94,.3)",cursor:"pointer",fontSize:8,color:T.red,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>✕</button>
                      </div>
                    )}
                    <div style={{ padding:3, borderRadius:"50%", border:"2.5px solid "+(speaking?T.green:T.border), boxShadow:speaking?"0 0 12px rgba(16,185,129,.4)":"none", transition:"all .3s" }}>
                      <Av init={m.init} bg={m.bg} tc={m.tc} grad={isMe} size={48}/>
                    </div>
                    <div style={{ fontSize:11, color:T.brand2, fontWeight:700, maxWidth:56, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{isMe?"คุณ":m.name}</div>
                    <Chip active={speaking} color={speaking?T.green:undefined}>{speaking?"🎙":"🔇"}</Chip>
                  </div>
                );
              })}
            </div>
          </div>
          {showPL && <div style={{ padding:"0 16px 16px" }}><YoutubePlaylist playlist={inRoom.playlist} setPlaylist={updatePL} isHost={isHost}/></div>}
        </Card>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ fontSize:16, fontWeight:800, color:T.text }}>ห้องเสียง 🎙️</div>
        <Btn onClick={()=>setCreating(!creating)} v={creating?"primary":"outline"} sz="sm">+ ห้องใหม่</Btn>
      </div>

      {creating && (
        <Card style={{ marginBottom:14 }}>
          <div style={{ padding:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:10 }}>🏠 สร้างห้องใหม่</div>
            <Input value={newName} onChange={e=>{setNewName(e.target.value);setNameErr("");}} placeholder="ชื่อห้อง เช่น คืนนี้ใครว่างบ้าง 🌙" onKeyDown={e=>e.key==="Enter"&&create()} style={{marginBottom:8}}/>
            {nameErr && <div style={{ fontSize:12, color:T.red, marginBottom:8 }}>{nameErr}</div>}
            <div style={{ display:"flex", gap:7 }}>
              <Btn onClick={create} v="primary" sz="sm">สร้างห้อง ✨</Btn>
              <Btn onClick={()=>{setCreating(false);setNameErr("");}} v="ghost" sz="sm">ยกเลิก</Btn>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {rooms.map(r=>(
          <Card key={r.id} style={{ border:"1px solid "+(inRoomId===r.id?T.borderHi:T.border) }}>
            <div style={{ padding:"16px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:T.text }}>{r.vibe} {r.name}</div>
                  <div style={{ fontSize:12, color:T.muted, marginTop:4, display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:6,height:6,borderRadius:"50%",background:T.green }}/>{r.members.length} คน
                    {r.playlist.length>0&&<span>• 🎵 {r.playlist.length}</span>}
                  </div>
                </div>
                {inRoomId===r.id ? <Btn onClick={leave} v="danger" sz="sm">ออก</Btn> : <Btn onClick={()=>join(r)} v="primary" sz="sm">เข้าร่วม</Btn>}
              </div>
              <div style={{ display:"flex" }}>
                {r.members.slice(0,7).map((m,i)=>(
                  <div key={i} style={{ width:28,height:28,borderRadius:"50%",background:m.bg,color:m.tc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,border:"2px solid "+T.bg,marginLeft:i>0?-8:0 }}>{m.init}</div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PostCard
// ─────────────────────────────────────────────
function PostCard({ p, onLike, onComment }) {
  const [open, setOpen] = useState(false);
  const [cmt, setCmt] = useState("");
  const [err, setErr] = useState("");
  function submit() { if(!cmt.trim()){setErr("เม้นอะไรก่อนนะ");return;} onComment(p.id,cmt.trim()); setCmt(""); setErr(""); }
  return (
    <Card style={{ marginBottom:12 }}>
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ display:"flex", gap:12, marginBottom:12 }}>
          <Av init={p.init} bg={p.bg} tc={p.tc} size={42}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{p.author}</div>
            <div style={{ fontSize:12, color:T.muted, display:"flex", flexWrap:"wrap", gap:6, marginTop:3 }}>
              <span>{p.time}</span><span>·</span>
              <Chip>{PV_ICO[p.privacy]} {PV_LBL[p.privacy]}</Chip>
              {p.mood && <Chip active color={T.brand}>{p.mood}</Chip>}
            </div>
          </div>
        </div>
        {p.content && <div style={{ fontSize:15, color:T.text, lineHeight:1.75, marginBottom:4 }}>{p.content}</div>}
      </div>
      <ImgGrid images={p.images}/>
      <div style={{ padding:"0 16px 14px" }}>
        <div style={{ borderTop:"1px solid "+T.border, paddingTop:10, display:"flex", gap:7 }}>
          <Btn onClick={()=>onLike(p.id)} v={p.liked?"primary":"ghost"} sz="sm">{p.liked?"❤️":"🤍"} {p.likes}</Btn>
          <Btn onClick={()=>setOpen(!open)} v={open?"outline":"ghost"} sz="sm">💬 {p.comments.length}</Btn>
          <Btn v="ghost" sz="sm">🔗</Btn>
        </div>
        {open && (
          <div style={{ marginTop:12 }}>
            {p.comments.map(c=>(
              <div key={c.id} style={{ display:"flex", gap:9, marginBottom:10 }}>
                <Av init={c.init} bg={c.bg} tc={c.tc} size={30}/>
                <div style={{ background:T.surface, borderRadius:14, padding:"8px 13px", flex:1, border:"1px solid "+T.border }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.text }}>{c.author} <span style={{ fontWeight:400, color:T.muted, fontSize:11 }}>{c.time}</span></div>
                  <div style={{ fontSize:13, color:T.sub, marginTop:3, lineHeight:1.5 }}>{c.text}</div>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:9, alignItems:"center", marginTop:6 }}>
              <Av init="ME" grad size={30}/>
              <input value={cmt} onChange={e=>{setCmt(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()}
                placeholder="เม้นอะไรสักอย่าง..."
                style={{ flex:1, border:"1px solid "+T.border, borderRadius:20, padding:"8px 14px", fontSize:13, outline:"none", background:T.surface, color:T.text, fontFamily:"inherit" }}
                onFocus={e=>e.target.style.borderColor=T.borderHi} onBlur={e=>e.target.style.borderColor=T.border}/>
              <Btn onClick={submit} v="primary" sz="sm">ส่ง</Btn>
            </div>
            {err && <div style={{ fontSize:12, color:T.red, marginTop:6, marginLeft:39 }}>{err}</div>}
          </div>
        )}
      </div>
    </Card>
  );
}

function NewPostBox({ onPost }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [images, setImages] = useState([]);
  const [err, setErr] = useState("");
  const [showM, setShowM] = useState(false);
  const fileRef = useRef();
  function handleFiles(e) { Array.from(e.target.files).forEach(f=>{const r=new FileReader();r.onload=ev=>setImages(p=>[...p,{src:ev.target.result,name:f.name}]);r.readAsDataURL(f);}); e.target.value=""; }
  function submit() { if(!text.trim()&&!images.length){setErr("เขียนหรือเพิ่มรูปก่อนนะ");return;} onPost({text:text.trim(),mood,privacy,images:images.map(i=>i.src)}); setText("");setMood("");setImages([]);setErr("");setShowM(false); }
  return (
    <Card style={{ marginBottom:14 }}>
      <div style={{ padding:"16px" }}>
        <div style={{ display:"flex", gap:12 }}>
          <Av init="ME" grad size={42}/>
          <textarea value={text} onChange={e=>{setText(e.target.value);setErr("");}} placeholder="คุณรู้สึกยังไงวันนี้? 💜"
            style={{ flex:1, border:"1px solid "+T.border, borderRadius:14, padding:"10px 14px", fontSize:14, resize:"none", outline:"none", minHeight:72, lineHeight:1.6, background:T.surface, color:T.text, fontFamily:"inherit", transition:"border .15s" }}
            onFocus={e=>e.target.style.borderColor=T.borderHi} onBlur={e=>e.target.style.borderColor=T.border}/>
        </div>
        {images.length>0 && (
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginTop:10, marginLeft:54 }}>
            {images.map((img,i)=>(
              <div key={i} style={{ position:"relative", width:72, height:72, borderRadius:12, overflow:"hidden", border:"1px solid "+T.border }}>
                <img src={img.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                <button onClick={()=>setImages(imgs=>imgs.filter((_,j)=>j!==i))}
                  style={{ position:"absolute", top:3, right:3, width:18, height:18, borderRadius:"50%", background:"rgba(0,0,0,.7)", border:"none", color:"#fff", cursor:"pointer", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>✕</button>
              </div>
            ))}
          </div>
        )}
        {err && <div style={{ fontSize:12, color:T.red, marginTop:7, marginLeft:54, fontWeight:500 }}>{err}</div>}
        <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:12, marginLeft:54, flexWrap:"wrap" }}>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display:"none" }} onChange={handleFiles}/>
          <Btn onClick={()=>fileRef.current.click()} v="ghost" sz="sm">📷{images.length>0?` (${images.length})`:""}</Btn>
          <Btn onClick={()=>setShowM(!showM)} v={mood?"outline":"ghost"} sz="sm">✦ {mood||"Mood"}</Btn>
          <select value={privacy} onChange={e=>setPrivacy(e.target.value)}
            style={{ padding:"7px 10px", borderRadius:10, border:"1px solid "+T.border, background:T.surface, color:T.sub, fontSize:12, outline:"none", fontFamily:"inherit", cursor:"pointer" }}>
            <option value="public">🌐 สาธารณะ</option>
            <option value="friends">👥 เพื่อนเท่านั้น</option>
            <option value="only_me">🔒 ฉันเท่านั้น</option>
          </select>
          <Btn onClick={submit} v="primary" sz="sm" style={{ marginLeft:"auto" }}>โพสต์</Btn>
        </div>
        {showM && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10, marginLeft:54 }}>
            {MOODS.map(m=><Btn key={m} onClick={()=>{setMood(m);setShowM(false);}} v={mood===m?"outline":"ghost"} sz="sm">{m}</Btn>)}
          </div>
        )}
      </div>
    </Card>
  );
}

function FeedPage({ posts, setPosts }) {
  function handleLike(id){setPosts(ps=>ps.map(p=>p.id===id?{...p,liked:!p.liked,likes:p.liked?p.likes-1:p.likes+1}:p));}
  function handleComment(id,text){setPosts(ps=>ps.map(p=>p.id===id?{...p,comments:[...p.comments,{id:"c"+Date.now(),author:"คุณ",init:"ME",bg:T.card,tc:T.brand2,text,time:"เมื่อกี้"}]}:p));}
  function handlePost({text,mood,privacy,images}){setPosts(ps=>[{id:"p"+Date.now(),author:"คุณ",init:"ME",bg:T.card,tc:T.brand2,time:"เมื่อกี้",content:text,mood,privacy,likes:0,liked:false,images:images||[],comments:[]},...ps]);}
  return (<div><NewPostBox onPost={handlePost}/>{posts.map(p=><PostCard key={p.id} p={p} onLike={handleLike} onComment={handleComment}/>)}</div>);
}

function ChatPage() {
  const [chats,setChats]=useState(INIT_CHATS);
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
  function send(){const txt=input.trim();if(!txt&&!chatImg)return;const nm=[];if(chatImg)nm.push({id:"im"+Date.now(),from:"me",type:"image",src:chatImg});if(txt)nm.push({id:"tx"+Date.now()+1,from:"me",type:"text",text:txt});setChats(c=>({...c,[active]:[...(c[active]||[]),...nm]}));setInput("");setChatImg(null);setTimeout(()=>{const r=AUTO_REPLIES[Math.floor(Math.random()*AUTO_REPLIES.length)];setChats(c=>({...c,[active]:[...(c[active]||[]),{id:"au"+Date.now(),from:"them",type:"text",text:r}]}));},800+Math.random()*500);}
  function toggleVoice(){const nx=!voiceOn;setVoiceOn(nx);const sys={id:"sy"+Date.now(),from:"system",text:nx?`🎙️ เปิดห้องเสียงแล้ว — รอ ${friend.name} รับสาย...`:"📵 วางสายแล้ว"};setChats(c=>({...c,[active]:[...(c[active]||[]),sys]}));if(nx)setTimeout(()=>setChats(c=>({...c,[active]:[...(c[active]||[]),{id:"sy2"+Date.now(),from:"system",text:`✅ ${friend.name} รับสายแล้ว! 💜`}]})),1400);}

  return (
    <div style={{ display:"flex", height:"calc(100dvh - 112px)", overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:64, borderRight:"1px solid "+T.border, background:T.surface, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:10, gap:4, flexShrink:0 }}>
        {FRIENDS.map(f=>(
          <button key={f.id} onClick={()=>setActive(f.id)}
            style={{ background:"transparent", border:"none", cursor:"pointer", padding:"6px 0", opacity:active===f.id?1:.5, transition:"opacity .15s", position:"relative" }}>
            <Av init={f.init} bg={f.bg} tc={f.tc} size={40} online={f.online}/>
            {active===f.id && <div style={{ position:"absolute", left:-0, top:"50%", transform:"translateY(-50%)", width:3, height:28, background:T.brand, borderRadius:"0 3px 3px 0" }}/>}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Header */}
        <div style={{ padding:"10px 14px", borderBottom:"1px solid "+T.border, background:T.surface, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <Av init={friend.init} bg={friend.bg} tc={friend.tc} size={36} online={friend.online}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{friend.name}</div>
            <div style={{ fontSize:12, color:T.muted, display:"flex", alignItems:"center", gap:6 }}>
              {friend.online&&<><div style={{ width:6,height:6,borderRadius:"50%",background:T.green }}/><span>ออนไลน์</span></>}
              {friend.mood && <Chip active color={T.brand}>{friend.mood}</Chip>}
            </div>
          </div>
          <Btn onClick={toggleVoice} v={voiceOn?"primary":"ghost"} sz="sm">🎙️ {voiceOn?"คุยอยู่":"เสียง"}</Btn>
        </div>

        {/* Voice bar */}
        {voiceOn && (
          <div style={{ background:T.brand+"15", borderBottom:"1px solid "+T.borderHi, padding:"10px 14px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.brand2, display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:T.green,boxShadow:"0 0 6px "+T.green }}/>ห้องเสียง
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Btn onClick={()=>setMicOn(!micOn)} v="ghost" sz="sm">{micOn?"🎙️":"🔇"}</Btn>
                <Btn onClick={toggleVoice} v="danger" sz="sm">วางสาย</Btn>
              </div>
            </div>
            <div style={{ display:"flex", gap:14 }}>
              {[{init:"ME",grad:true,name:"คุณ",sp:true},{init:friend.init,bg:friend.bg,tc:friend.tc,name:friend.name,sp:false}].map((u,i)=>(
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ padding:2, borderRadius:"50%", border:"2.5px solid "+(u.sp?T.green:T.border), boxShadow:u.sp?"0 0 10px rgba(16,185,129,.3)":"none" }}>
                    <Av init={u.init} bg={u.bg} grad={u.grad} tc={u.tc} size={40}/>
                  </div>
                  <div style={{ fontSize:11, color:T.brand2, fontWeight:700 }}>{u.name}</div>
                  <Chip active={u.sp} color={u.sp?T.green:undefined}>{u.sp?(micOn?"🎙️":"🔇"):"🎧"}</Chip>
                </div>
              ))}
            </div>
          </div>
        )}

        {chatImg && (
          <div style={{ padding:"8px 14px 0", flexShrink:0 }}>
            <div style={{ position:"relative", display:"inline-block" }}>
              <img src={chatImg} alt="" style={{ height:60, borderRadius:10, objectFit:"cover", border:"1px solid "+T.border }}/>
              <button onClick={()=>setChatImg(null)} style={{ position:"absolute",top:-4,right:-4,width:18,height:18,borderRadius:"50%",background:"#333",border:"none",color:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>✕</button>
            </div>
          </div>
        )}

        <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:8 }}>
          {msgs.map(m=>{
            if(m.from==="system")return<div key={m.id} style={{ textAlign:"center",fontSize:12,color:T.muted,padding:"3px 0" }}>{m.text}</div>;
            const me=m.from==="me";
            return(
              <div key={m.id} style={{ display:"flex", gap:8, alignItems:"flex-end", flexDirection:me?"row-reverse":"row" }}>
                {!me && <Av init={friend.init} bg={friend.bg} tc={friend.tc} size={28}/>}
                <div style={{ maxWidth:"72%" }}>
                  {m.type==="image"?<img src={m.src} alt="" style={{ maxWidth:"100%",borderRadius:14,display:"block",border:"1px solid "+T.border }}/>
                  :<div style={{ padding:"9px 14px", borderRadius:16, fontSize:14, lineHeight:1.55,
                    background:me?T.brandGrad:T.card, color:me?"#fff":T.text,
                    border:me?"none":"1px solid "+T.border,
                    borderBottomLeftRadius:!me?4:16, borderBottomRightRadius:me?4:16,
                    boxShadow:me?"0 2px 12px rgba(124,92,252,.3)":"none" }}>{m.text}</div>}
                </div>
              </div>
            );
          })}
          <div ref={endRef}/>
        </div>

        <div style={{ padding:"10px 14px", borderTop:"1px solid "+T.border, background:T.surface, flexShrink:0 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setChatImg(ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={()=>fileRef.current.click()} style={{ width:36,height:36,borderRadius:"50%",border:"1px solid "+T.border,background:T.card,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit" }}>📷</button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}} placeholder="พิมพ์ข้อความ..."
              style={{ flex:1, border:"1px solid "+T.border, borderRadius:20, padding:"9px 16px", fontSize:14, color:T.text, background:T.card, outline:"none", fontFamily:"inherit" }}
              onFocus={e=>e.target.style.borderColor=T.borderHi} onBlur={e=>e.target.style.borderColor=T.border}/>
            <button onClick={send} style={{ width:38,height:38,borderRadius:"50%",background:T.brandGrad,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",flexShrink:0,fontSize:17,boxShadow:"0 2px 10px rgba(124,92,252,.4)",fontFamily:"inherit" }}>↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Profile (persistent)
// ─────────────────────────────────────────────
function ProfilePage({ user, posts }) {
  const [bio, setBio] = useState(()=>store.get("bio","ชอบคุยเล่น • ฟังเพลง • หาเพื่อนใหม่ 💜"));
  const [mood, setMood] = useState(()=>store.get("mood","สบายดี 😊"));
  const [editing, setEditing] = useState(false);
  const [bioInput, setBioInput] = useState(bio);
  const [showMP, setShowMP] = useState(false);
  const [coverImg, setCoverImg] = useState(()=>store.get("coverImg",""));
  const [avatarImg, setAvatarImg] = useState(()=>store.get("avatarImg",""));
  const coverRef = useRef(); const avatarRef = useRef();
  const myPosts = posts.filter(p=>p.author==="คุณ");

  const saveBio = () => { setBio(bioInput); store.set("bio",bioInput); setEditing(false); };
  const saveMood = m => { setMood(m); store.set("mood",m); setShowMP(false); };
  const saveCover = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>{setCoverImg(ev.target.result);store.set("coverImg",ev.target.result);}; r.readAsDataURL(f); e.target.value=""; };
  const saveAvatar = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>{setAvatarImg(ev.target.result);store.set("avatarImg",ev.target.result);}; r.readAsDataURL(f); e.target.value=""; };

  return (
    <div>
      <Card style={{ marginBottom:14, overflow:"hidden" }}>
        <div style={{ height:120, background:coverImg?`url(${coverImg}) center/cover`:T.brandGrad, position:"relative", cursor:"pointer" }} onClick={()=>coverRef.current.click()}>
          {!coverImg && <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.4)",fontSize:13 }}>✏️ เปลี่ยนรูปปก</div>}
          <input ref={coverRef} type="file" accept="image/*" style={{ display:"none" }} onChange={saveCover}/>
        </div>
        <div style={{ padding:"0 18px 20px", position:"relative" }}>
          <div style={{ position:"absolute", top:-34, left:18, cursor:"pointer" }} onClick={()=>avatarRef.current.click()}>
            {avatarImg
              ? <div style={{ width:68,height:68,borderRadius:"50%",overflow:"hidden",border:"4px solid "+T.bg,boxShadow:"0 4px 16px rgba(124,92,252,.4)" }}><img src={avatarImg} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/></div>
              : <div style={{ width:68,height:68,borderRadius:"50%",background:T.brandGrad,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,border:"4px solid "+T.bg,boxShadow:"0 4px 16px rgba(124,92,252,.4)" }}>สต</div>
            }
            <input ref={avatarRef} type="file" accept="image/*" style={{ display:"none" }} onChange={saveAvatar}/>
          </div>
          <div style={{ paddingTop:42 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:19, fontWeight:800, color:T.text }}>{user.name}</div>
                {user.isGuest && <Chip active color={T.yellow}>👋 ผู้เยี่ยมชม</Chip>}
                {editing
                  ? <div style={{ marginTop:7, display:"flex", gap:7 }}>
                      <Input value={bioInput} onChange={e=>setBioInput(e.target.value)} style={{ width:220, padding:"6px 11px", fontSize:13 }}/>
                      <Btn onClick={saveBio} v="primary" sz="sm">บันทึก</Btn>
                    </div>
                  : <div style={{ fontSize:13, color:T.sub, marginTop:5, lineHeight:1.6 }}>{bio}</div>
                }
                <div style={{ marginTop:9 }}>
                  <Chip active color={T.brand} onClick={()=>setShowMP(!showMP)}>✦ {mood}</Chip>
                </div>
                {showMP && <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:8 }}>{MOODS.map(m=><Btn key={m} onClick={()=>saveMood(m)} v={mood===m?"outline":"ghost"} sz="sm">{m}</Btn>)}</div>}
              </div>
              <Btn onClick={()=>{setEditing(!editing);setBioInput(bio);}} v="ghost" sz="sm">✏️</Btn>
            </div>
            <div style={{ display:"flex", gap:28, marginTop:16, paddingTop:14, borderTop:"1px solid "+T.border }}>
              {[["48","เพื่อน"],[String(myPosts.length),"โพสต์"],["1.2k","เข้าชม"]].map(([n,l])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:19, fontWeight:800, background:T.brandGrad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{n}</div>
                  <div style={{ fontSize:12, color:T.muted }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ padding:"16px 18px" }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.text, marginBottom:14 }}>โพสต์ของฉัน</div>
          {myPosts.length===0 && <div style={{ fontSize:13, color:T.muted, textAlign:"center", padding:"20px 0" }}>ยังไม่มีโพสต์ — ลองโพสต์แรกได้เลย! ✨</div>}
          {myPosts.map(p=>(
            <div key={p.id} style={{ borderBottom:"1px solid "+T.border, paddingBottom:12, marginBottom:12 }}>
              {p.images?.length>0 && <div style={{ display:"flex", gap:5, marginBottom:7, flexWrap:"wrap" }}>{p.images.map((src,i)=><img key={i} src={src} alt="" style={{ width:56,height:56,borderRadius:10,objectFit:"cover",border:"1px solid "+T.border }}/>)}</div>}
              {p.content && <div style={{ fontSize:13, color:T.sub, lineHeight:1.65 }}>{p.content}</div>}
              <div style={{ fontSize:11, color:T.muted, marginTop:5, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                <span>{p.time}</span><span>{PV_ICO[p.privacy]}</span>
                {p.mood && <Chip active color={T.brand}>✦ {p.mood}</Chip>}
                <span>❤️{p.likes}</span><span>💬{p.comments.length}</span>
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
  const Row=({label,desc,k,type,opts})=>(
    <div style={{padding:"13px 0",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
      <div><div style={{fontSize:14,color:T.text,fontWeight:500}}>{label}</div>{desc&&<div style={{fontSize:12,color:T.muted,marginTop:2}}>{desc}</div>}</div>
      {type==="toggle"
        ?<div onClick={()=>set(k,!s[k])} style={{width:46,height:26,borderRadius:13,cursor:"pointer",background:s[k]?T.brand:"#333",position:"relative",transition:"background .2s",flexShrink:0}}>
          <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:s[k]?23:3,transition:"left .22s",boxShadow:"0 1px 4px rgba(0,0,0,.4)"}}/>
         </div>
        :<select value={s[k]} onChange={e=>set(k,e.target.value)} style={{padding:"7px 10px",borderRadius:10,border:"1px solid "+T.border,background:T.surface,color:T.sub,fontSize:13,outline:"none",flexShrink:0,fontFamily:"inherit",cursor:"pointer"}}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>
      }
    </div>
  );
  const Sec=({title,children})=><Card style={{marginBottom:12}}><div style={{padding:"4px 18px"}}><div style={{fontSize:11,fontWeight:700,color:T.muted,padding:"12px 0 4px",textTransform:"uppercase",letterSpacing:1.2}}>{title}</div>{children}</div></Card>;
  return(
    <div>
      <Card style={{marginBottom:14}}><div style={{padding:"18px 20px"}}><div style={{fontSize:17,fontWeight:800,color:T.text}}>ความเป็นส่วนตัว 🔒</div><div style={{fontSize:13,color:T.muted,marginTop:4}}>ปรับว่าใครเห็นอะไรได้บ้าง</div></div></Card>
      <Sec title="โพสต์"><Row label="โพสต์เริ่มต้น" desc="ค่าเริ่มต้นเวลาสร้างโพสต์ใหม่" k="postDef" type="select" opts={pv}/><Row label="ใครเห็นโพสต์" k="whoSee" type="select" opts={pv}/><Row label="ใครเม้นได้" k="whoCmt" type="select" opts={ev}/></Sec>
      <Sec title="โปรไฟล์"><Row label="แสดง Mood" k="showMood" type="toggle"/><Row label="แสดงสถานะออนไลน์" k="showOnline" type="toggle"/><Row label="แสดงเวลาออนไลน์ล่าสุด" k="showLast" type="toggle"/><Row label="ใครเห็นรายชื่อเพื่อน" k="friendList" type="select" opts={pv}/></Sec>
      <Sec title="ข้อความและเสียง"><Row label="ใครส่งข้อความได้" k="whoMsg" type="select" opts={ev}/></Sec>
      <Card><div style={{padding:"18px 20px"}}><div style={{fontSize:14,fontWeight:700,color:T.red,marginBottom:10}}>โซนอันตราย ⚠️</div><Btn v="danger" sz="md" full>ปิดบัญชีชั่วคราว</Btn></div></Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────
const TABS = [
  {key:"feed",   icon:"🏠", label:"ฟีด"},
  {key:"chat",   icon:"💬", label:"แชท"},
  {key:"voice",  icon:"🎙️", label:"เสียง"},
  {key:"profile",icon:"👤", label:"โปรไฟล์"},
  {key:"privacy",icon:"🔒", label:"ส่วนตัว"},
];

export default function App() {
  const [user, setUser] = useState(()=>store.get("user",null));
  const [page, setPage] = useState("feed");
  const [posts, setPosts] = useState(()=>{
    const saved = store.get("posts", SEED_POSTS);
    // ป้องกัน t.map is not a function — ถ้าไม่ใช่ array ให้ reset
    return Array.isArray(saved) ? saved : SEED_POSTS;
  });

  // persist posts
  useEffect(()=>{ store.set("posts",posts); },[posts]);

  function handleLogout() { store.clear("user"); setUser(null); }
  function handleResetData() {
    ["posts","bio","mood","coverImg","avatarImg"].forEach(k => store.clear(k));
    setPosts(SEED_POSTS);
    alert("รีเซ็ตข้อมูลแล้ว ✅");
  }

  if (!user) return <AuthPage onLogin={setUser}/>;

  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", minHeight:"100dvh", background:T.bg, display:"flex", flexDirection:"column", color:T.text, maxWidth:480, margin:"0 auto" }}>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{background:${T.bg};margin:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        input,textarea,select{color-scheme:dark}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>

      {/* Top bar */}
      <div style={{ background:T.glass, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:"1px solid "+T.border, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:30 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:30,height:30,borderRadius:9,background:T.brandGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>💜</div>
          <span style={{ fontSize:18, fontWeight:800, background:T.brandGrad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:-.5 }}>Warmly</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontSize:13, color:T.sub, fontWeight:500 }}>{user.name}</span>
          {user.isGuest && <Chip active color={T.yellow}>Guest</Chip>}
          <button onClick={handleResetData} style={{ border:"1px solid "+T.border,borderRadius:9,background:"transparent",color:T.muted,cursor:"pointer",padding:"4px 9px",fontSize:11,fontFamily:"inherit" }} title="รีเซ็ตถ้าแอปค้าง">🔄</button>
          <button onClick={handleLogout} style={{ border:"1px solid "+T.border,borderRadius:9,background:"transparent",color:T.muted,cursor:"pointer",padding:"4px 9px",fontSize:11,fontFamily:"inherit" }}>ออก</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY: page==="chat"?"hidden":"auto", display:"flex", flexDirection:"column" }}>
        <div style={{ flex:1, padding: page==="chat"?"0":"14px 12px 80px" }}>
          {page==="feed"    && <FeedPage posts={posts} setPosts={setPosts}/>}
          {page==="chat"    && <ChatPage/>}
          {page==="voice"   && <VoiceRoomsPage user={user}/>}
          {page==="profile" && <ProfilePage user={user} posts={posts}/>}
          {page==="privacy" && <PrivacyPage/>}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480,
        background:T.glass, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        borderTop:"1px solid "+T.border, display:"flex", zIndex:30,
        paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setPage(t.key)} style={{ flex:1, padding:"10px 4px 8px", border:"none", background:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, transition:"all .15s", fontFamily:"inherit" }}>
            <span style={{ fontSize:20, lineHeight:1 }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight:page===t.key?700:400, color:page===t.key?T.brand2:T.muted }}>{t.label}</span>
            {page===t.key && <div style={{ width:16,height:2,borderRadius:2,background:T.brandGrad,marginTop:2 }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
