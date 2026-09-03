import React, { useState, useRef, useEffect } from "react";

// ── Design Tokens ─────────────────────────────────────────
const C = {
  brand:   "#8B7CF6",
  brand2:  "#C084FC",
  grad:    "linear-gradient(135deg,#8B7CF6 0%,#C084FC 100%)",
  gradSoft:"linear-gradient(135deg,#EDE9FE 0%,#FAE8FF 100%)",
  gradCard:"linear-gradient(160deg,#F5F3FF 0%,#FDF4FF 100%)",
  surface: "#FFFFFF",
  bg:      "#F8F7FF",
  border:  "#EDE9FE",
  text:    "#1E1B2E",
  sub:     "#7C7B8A",
  muted:   "#B8B6C8",
  green:   "#10B981",
  red:     "#F43F5E",
  redL:    "#FFF1F2",
};

const FRIENDS=[
  {id:1,name:"หนูนก",init:"NK",bg:"#D1FAE5",tc:"#065F46",online:true, mood:"เหงา"},
  {id:2,name:"อาร์ม", init:"AR",bg:"#DBEAFE",tc:"#1E40AF",online:true, mood:"สนุก"},
  {id:3,name:"มิ้นท์",init:"MT",bg:"#FCE7F3",tc:"#831843",online:false,mood:"ง่วง"},
  {id:4,name:"ไบรท์",init:"BR",bg:"#FEF3C7",tc:"#78350F",online:true, mood:"สงบ"},
  {id:5,name:"แพม",  init:"PM",bg:"#D1FAE5",tc:"#064E3B",online:true, mood:"สบายดี"},
];
const MOODS=["สบายดี 😊","เหงา 🌙","สนุก 🎉","เครียด 😮‍💨","ง่วง 😴","สงบ ✨","ตื่นเต้น ⚡","โดดเดี่ยว 🫥"];
const PV_LBL={public:"สาธารณะ",friends:"เพื่อนเท่านั้น",only_me:"ฉันเท่านั้น"};
const PV_ICO={public:"🌐",friends:"👥",only_me:"🔒"};
const AUTO_REPLIES=["อ่อ จริงๆ เหรอ 😊","รู้สึกแบบเดียวกันเลย 💜","ฮ่าๆ น่ารักมาก 🥰","แล้วยังไงต่อล่ะ?","ใช่เลย! เห็นด้วย 100%","555 โอเคมาก","เดี๋ยวเล่าให้ฟังนะ 🎵"];

const PLAYLIST=[
  {id:1,title:"Lofi Chill Beats",artist:"Lofi Girl",emoji:"🌙",duration:"3:42",color:"#8B7CF6"},
  {id:2,title:"Late Night Drive",artist:"Neon Dreams",emoji:"🌃",duration:"4:15",color:"#C084FC"},
  {id:3,title:"Rainy Afternoon",artist:"Café Sounds",emoji:"☕",duration:"3:58",color:"#60A5FA"},
  {id:4,title:"Golden Hour",artist:"Indie Vibes",emoji:"🌅",duration:"4:30",color:"#F59E0B"},
  {id:5,title:"Midnight Feels",artist:"ChillWave",emoji:"🎸",duration:"5:01",color:"#10B981"},
  {id:6,title:"Sunday Morning",artist:"Acoustic Soul",emoji:"🌸",duration:"3:22",color:"#F43F5E"},
];
const VOICE_ROOMS=[
  {id:1,name:"นั่งเงียบๆด้วยกัน",host:"หนูนก",users:[{name:"หนูนก",init:"NK",bg:"#D1FAE5",tc:"#065F46",mic:true},{name:"ไบรท์",init:"BR",bg:"#FEF3C7",tc:"#78350F",mic:false},{name:"แพม",init:"PM",bg:"#D1FAE5",tc:"#064E3B",mic:true}],vibe:"🌙"},
  {id:2,name:"คืนนี้เหงาใครมา", host:"อาร์ม",users:[{name:"อาร์ม",init:"AR",bg:"#DBEAFE",tc:"#1E40AF",mic:true},{name:"มิ้นท์",init:"MT",bg:"#FCE7F3",tc:"#831843",mic:true}],vibe:"💜"},
  {id:3,name:"คุยเล่นก่อนนอน",   host:"แพม",users:[{name:"แพม",init:"PM",bg:"#D1FAE5",tc:"#064E3B",mic:true}],vibe:"☕"},
];
const INIT_POSTS=[
  {id:1,author:"หนูนก",init:"NK",bg:"#D1FAE5",tc:"#065F46",time:"2 นาทีที่แล้ว",content:"วันนี้เหงามากเลย ใครว่างคุยด้วยบ้าง 🌙",mood:"เหงา 🌙",privacy:"public",likes:12,liked:false,images:[],
   comments:[{id:1,author:"แพม",init:"PM",bg:"#D1FAE5",tc:"#064E3B",text:"มาคุยด้วยได้เลยนะ 🌸",time:"1น."}]},
  {id:2,author:"ไบรท์",init:"BR",bg:"#FEF3C7",tc:"#78350F",time:"1 ชม.",content:"อากาศดีมากวันนี้ ☀️ ออกไปนั่งข้างนอกสักพัก",mood:"สงบ ✨",privacy:"friends",likes:24,liked:true,
   images:["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"],comments:[]},
  {id:3,author:"มิ้นท์",init:"MT",bg:"#FCE7F3",tc:"#831843",time:"3 ชม.",content:"ใครชอบดูซีรีส์เกาหลีบ้าง 📺 แนะนำเรื่องหน่อยนะ",mood:"สนุก 🎉",privacy:"public",likes:8,liked:false,images:[],comments:[]},
  {id:4,author:"แพม",init:"PM",bg:"#D1FAE5",tc:"#064E3B",time:"5 ชม.",content:"กาแฟสักแก้วในวันหยุด ☕ ชีวิตดี",mood:"สบายดี 😊",privacy:"public",likes:31,liked:false,
   images:["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80"],comments:[]},
];
const INIT_CHATS={
  1:[{id:1,from:"them",text:"หวัดดีจ้า วันนี้เป็นยังไงบ้าง 😊",type:"text"}],
  2:[{id:1,from:"them",text:"เฮ้ มีอะไรเล่าให้ฟังมั้ย 👂",type:"text"}],
  3:[{id:1,from:"them",text:"ง่วงมากเลยวันนี้ 😴",type:"text"}],
  4:[{id:1,from:"them",text:"อยู่บ้านคนเดียวเหงาๆ เลยแวะมาคุย",type:"text"}],
  5:[{id:1,from:"them",text:"ใครอยากคุยบ้างมั้ย! 🙋",type:"text"}],
};

// ── Shared UI ─────────────────────────────────────────────
function Av({init,bg,tc,size=40,online,grad}){
  return(
    <div style={{position:"relative",flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:"50%",background:grad||bg||"#EDE9FE",color:tc||C.brand,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.33,fontWeight:700,boxShadow:grad?"0 2px 8px rgba(139,124,246,.25)":"none"}}>
        {init}
      </div>
      {online&&<div style={{position:"absolute",bottom:1,right:1,width:Math.max(8,size*.2),height:Math.max(8,size*.2),borderRadius:"50%",background:C.green,border:"2px solid #fff"}}/>}
    </div>
  );
}

function Pill({children,bg,tc,onClick,active}){
  return(
    <span onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:4,background:bg||(active?C.brand:"transparent"),color:tc||(active?"#fff":C.sub),borderRadius:20,padding:"4px 11px",fontSize:12,fontWeight:500,cursor:onClick?"pointer":"default",border:"1px solid "+(active?C.brand:C.border),transition:"all .15s"}}>
      {children}
    </span>
  );
}

function Card({children,style,gradient}){
  return(
    <div style={{background:gradient?C.gradCard:C.surface,border:"1px solid "+C.border,borderRadius:18,overflow:"hidden",boxShadow:"0 2px 12px rgba(139,124,246,.06)",...style}}>
      {children}
    </div>
  );
}

function ImgGrid({images}){
  if(!images||!images.length)return null;
  const n=images.length;
  return(
    <div style={{display:"grid",gap:3,overflow:"hidden",margin:"10px 0",borderRadius:14,
      gridTemplateColumns:n===1?"1fr":"1fr 1fr",
      maxHeight:n===1?320:260}}>
      {images.slice(0,4).map((src,i)=>(
        <div key={i} style={{overflow:"hidden",position:"relative",gridColumn:n===3&&i===0?"1/3":undefined}}>
          <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:130}}/>
          {i===3&&n>4&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:22,fontWeight:700}}>+{n-4}</div>}
        </div>
      ))}
    </div>
  );
}

// ── MusicPlayer (รองรับ YouTube URL) ─────────────────────────
function MusicPlayer(){
  const [playing,setPlaying]=useState(null);
  const [progress,setProgress]=useState({});
  const [ytUrl,setYtUrl]=useState("");
  const [ytEmbedId,setYtEmbedId]=useState("");
  const timers=useRef({});

  function togglePlay(id){
    if(playing===id){
      clearInterval(timers.current[id]);
      setPlaying(null);
    } else {
      if(playing)clearInterval(timers.current[playing]);
      setPlaying(id);
      let p=progress[id]||0;
      timers.current[id]=setInterval(()=>{
        p=Math.min(100,p+0.5);
        setProgress(prev=>({...prev,[id]:p}));
        if(p>=100){clearInterval(timers.current[id]);setPlaying(null);}
      },100);
    }
  }
  useEffect(()=>()=>Object.values(timers.current).forEach(clearInterval),[]);

  function handleYtPlay(){
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = ytUrl.match(regExp);
    if (match && match[2].length === 11) {
      setYtEmbedId(match[2]);
    } else {
      alert("ลิงก์ YouTube ไม่ถูกต้อง กรุณาลองใหม่ครับ");
    }
  }

  return(
    <div style={{marginTop:12}}>
      <div style={{fontSize:13,fontWeight:700,color:C.brand,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
        🎵 เพลงและเสียงในห้อง
      </div>

      {/* ช่องใส่ลิงก์ YouTube */}
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        <input 
          value={ytUrl} 
          onChange={e=>setYtUrl(e.target.value)} 
          placeholder="วางลิงก์ YouTube เช่น https://youtu.be/..." 
          style={{flex:1,border:"1px solid "+C.border,borderRadius:10,padding:"7px 10px",fontSize:12,outline:"none",background:"#fff",color:C.text}}
        />
        <button onClick={handleYtPlay} style={{padding:"7px 12px",borderRadius:10,border:"none",background:C.grad,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>เปิดเพลง YT</button>
      </div>

      {ytEmbedId && (
        <div style={{marginBottom:10,borderRadius:10,overflow:"hidden",height:120,background:"#000"}}>
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${ytEmbedId}?autoplay=1`} 
            title="YouTube audio player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {PLAYLIST.map(s=>{
          const isPlaying=playing===s.id;
          const prog=progress[s.id]||0;
          return(
            <div key={s.id} onClick={()=>togglePlay(s.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:12,background:isPlaying?`linear-gradient(90deg,${s.color}18,${s.color}08)`:C.bg,border:"1px solid "+(isPlaying?s.color:C.border),cursor:"pointer",transition:"all .2s"}}>
              <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${s.color},${s.color}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{s.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.title}</div>
                <div style={{fontSize:11,color:C.sub}}>{s.artist}</div>
                {isPlaying&&(
                  <div style={{marginTop:5,height:3,background:C.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",background:s.color,width:prog+"%",transition:"width .1s",borderRadius:3}}/>
                  </div>
                )}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                <div style={{fontSize:11,color:C.muted}}>{s.duration}</div>
                <div style={{width:26,height:26,borderRadius:"50%",background:isPlaying?s.color:"#EDE9FE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:isPlaying?"#fff":C.brand}}>
                  {isPlaying?"⏸":"▶"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PostCard ──────────────────────────────────────────────
function PostCard({p,onLike,onComment}){
  const [open,setOpen]=useState(false);
  const [cmt,setCmt]=useState("");
  const [err,setErr]=useState("");
  function submit(){
    if(!cmt.trim()){setErr("เม้นอะไรก่อนนะ 😊");return;}
    onComment(p.id,cmt.trim());setCmt("");setErr("");
  }
  return(
    <Card style={{marginBottom:14}}>
      <div style={{padding:"16px 16px 0"}}>
        <div style={{display:"flex",gap:11,marginBottom:12}}>
          <Av init={p.init} bg={p.bg} tc={p.tc} size={40}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{p.author}</div>
            <div style={{fontSize:12,color:C.muted,display:"flex",flexWrap:"wrap",gap:6,marginTop:3}}>
              <span>{p.time}</span><span>·</span>
              <span>{PV_ICO[p.privacy]} {PV_LBL[p.privacy]}</span>
              {p.mood&&<Pill bg={C.gradSoft} tc={C.brand}>✦ {p.mood}</Pill>}
            </div>
          </div>
        </div>
        {p.content&&<div style={{fontSize:15,color:C.text,lineHeight:1.7,marginBottom:4}}>{p.content}</div>}
      </div>
      <ImgGrid images={p.images}/>
      <div style={{padding:"0 16px 14px"}}>
        <div style={{borderTop:"1px solid "+C.border,paddingTop:10,display:"flex",gap:8}}>
          <button onClick={()=>onLike(p.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:20,border:"1px solid "+(p.liked?C.brand:C.border),background:p.liked?C.grad:"transparent",color:p.liked?"#fff":C.sub,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s"}}>
            {p.liked?"❤️":"🤍"} {p.likes}
          </button>
          <button onClick={()=>setOpen(!open)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:20,border:"1px solid "+(open?C.brand:C.border),background:open?"#F5F3FF":"transparent",color:open?C.brand:C.sub,cursor:"pointer",fontSize:13,transition:"all .2s"}}>
            💬 {p.comments.length}
          </button>
          <button style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:20,border:"1px solid "+C.border,background:"transparent",color:C.sub,cursor:"pointer",fontSize:13}}>
            🔗 แชร์
          </button>
        </div>
        {open&&(
          <div style={{marginTop:12}}>
            {p.comments.map(c=>(
              <div key={c.id} style={{display:"flex",gap:8,marginBottom:10}}>
                <Av init={c.init} bg={c.bg} tc={c.tc} size={30}/>
                <div style={{background:C.bg,borderRadius:12,padding:"8px 12px",flex:1,border:"1px solid "+C.border}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text}}>{c.author} <span style={{fontWeight:400,color:C.muted,fontSize:11}}>{c.time}</span></div>
                  <div style={{fontSize:13,color:C.text,marginTop:3}}>{c.text}</div>
                </div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:6}}>
              <Av init="สต" grad={C.grad} tc="#fff" size={30}/>
              <input value={cmt} onChange={e=>{setCmt(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="เม้นอะไรสักอย่าง..." style={{flex:1,border:"1px solid "+C.border,borderRadius:20,padding:"8px 14px",fontSize:13,outline:"none",background:C.bg,color:C.text,fontFamily:"inherit"}}/>
              <button onClick={submit} style={{padding:"8px 16px",borderRadius:20,border:"none",background:C.grad,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600}}>ส่ง</button>
            </div>
            {err&&<div style={{fontSize:12,color:C.red,marginTop:5,marginLeft:38}}>{err}</div>}
          </div>
        )}
      </div>
    </Card>
  );
}

// ── NewPostBox ────────────────────────────────────────────
function NewPostBox({onPost}){
  const [text,setText]=useState("");
  const [mood,setMood]=useState("");
  const [privacy,setPrivacy]=useState("public");
  const [images,setImages]=useState([]);
  const [err,setErr]=useState("");
  const [showM,setShowM]=useState(false);
  const fileRef=useRef();

  function handleFiles(e){
    Array.from(e.target.files).forEach(f=>{
      const r=new FileReader();
      r.onload=ev=>setImages(p=>[...p,{src:ev.target.result,isVideo:f.type.startsWith("video/"),name:f.name}]);
      r.readAsDataURL(f);
    });
    e.target.value="";
  }
  function submit(){
    if(!text.trim()&&!images.length){setErr("เขียนอะไรหรือเพิ่มรูปก่อนนะ");return;}
    onPost({text:text.trim(),mood,privacy,images:images.map(i=>i.src)});
    setText("");setMood("");setImages([]);setErr("");setShowM(false);
  }

  return(
    <Card style={{marginBottom:16}} gradient>
      <div style={{padding:"16px 16px 14px"}}>
        <div style={{display:"flex",gap:11}}>
          <Av init="สต" grad={C.grad} tc="#fff" size={40}/>
          <textarea value={text} onChange={e=>{setText(e.target.value);setErr("");}} placeholder="คุณรู้สึกยังไงวันนี้? บอกเพื่อนๆบ้างนะ 💜" style={{flex:1,border:"1px solid "+C.border,borderRadius:14,padding:"10px 14px",fontSize:14,resize:"none",outline:"none",minHeight:72,lineHeight:1.6,background:"#fff",color:C.text,fontFamily:"inherit"}}/>
        </div>
        {images.length>0&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10,marginLeft:51}}>
            {images.map((img,i)=>(
              <div key={i} style={{position:"relative",width:72,height:72,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
                {img.isVideo
                  ?<div style={{width:"100%",height:"100%",background:"#1a1a1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}><span style={{fontSize:20}}>🎬</span><span style={{fontSize:9,color:"#aaa"}}>{img.name.slice(0,10)}</span></div>
                  :<img src={img.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                }
                <button onClick={()=>setImages(imgs=>imgs.filter((_,j)=>j!==i))} style={{position:"absolute",top:2,right:2,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,.6)",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ))}
          </div>
        )}
        {err&&<div style={{fontSize:12,color:C.red,marginTop:6,marginLeft:51}}>{err}</div>}
        <div style={{display:"flex",alignItems:"center",gap:7,marginTop:12,marginLeft:51,flexWrap:"wrap"}}>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{display:"none"}} onChange={handleFiles}/>
          <button onClick={()=>fileRef.current.click()} style={{padding:"6px 12px",borderRadius:20,border:"1px solid "+C.border,background:"#fff",color:C.sub,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:5,fontFamily:"inherit"}}>
            📷 รูป/วิดีโอ{images.length>0?` (${images.length})`:""}
          </button>
          <button onClick={()=>setShowM(!showM)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid "+(mood?C.brand:C.border),background:mood?C.gradSoft:"#fff",color:mood?C.brand:C.sub,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
            ✦ {mood||"mood"}
          </button>
          <select value={privacy} onChange={e=>setPrivacy(e.target.value)} style={{padding:"6px 10px",borderRadius:20,border:"1px solid "+C.border,background:"#fff",color:C.sub,cursor:"pointer",fontSize:12,outline:"none",fontFamily:"inherit"}}>
            <option value="public">🌐 สาธารณะ</option>
            <option value="friends">👥 เพื่อนเท่านั้น</option>
            <option value="only_me">🔒 ฉันเท่านั้น</option>
          </select>
          <button onClick={submit} style={{marginLeft:"auto",padding:"7px 20px",borderRadius:20,border:"none",background:C.grad,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",boxShadow:"0 2px 8px rgba(139,124,246,.4)"}}>โพสต์ ✨</button>
        </div>
        {showM&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10,marginLeft:51}}>{MOODS.map(m=><button key={m} onClick={()=>{setMood(m);setShowM(false);}} style={{padding:"5px 11px",borderRadius:20,border:"1px solid "+(mood===m?C.brand:C.border),background:mood===m?C.gradSoft:"#fff",color:mood===m?C.brand:C.sub,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>{m}</button>)}</div>}
      </div>
    </Card>
  );
}

// ── Feed ──────────────────────────────────────────────────
function FeedPage({posts,setPosts}){
  function handleLike(id){setPosts(ps=>ps.map(p=>p.id===id?{...p,liked:!p.liked,likes:p.liked?p.likes-1:p.likes+1}:p));}
  function handleComment(id,text){setPosts(ps=>ps.map(p=>p.id===id?{...p,comments:[...p.comments,{id:Date.now(),author:"สิทธิชัย",init:"สต",bg:"#EDE9FE",tc:C.brand,text,time:"เมื่อกี้"}]}:p));}
  function handlePost({text,mood,privacy,images}){setPosts(ps=>[{id:Date.now(),author:"สิทธิชัย",init:"สต",bg:"#EDE9FE",tc:C.brand,time:"เมื่อกี้",content:text,mood,privacy,likes:0,liked:false,images:images||[],comments:[]},...ps]);}
  return(<div><NewPostBox onPost={handlePost}/>{posts.map(p=><PostCard key={p.id} p={p} onLike={handleLike} onComment={handleComment}/>)}</div>);
}

// ── Chat ──────────────────────────────────────────────────
function ChatPage(){
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

  function send(){
    const txt=input.trim();
    if(!txt&&!chatImg)return;
    const newMsgs=[];
    if(chatImg)newMsgs.push({id:Date.now(),from:"me",type:"image",src:chatImg});
    if(txt)newMsgs.push({id:Date.now()+1,from:"me",type:"text",text:txt});
    setChats(c=>({...c,[active]:[...(c[active]||[]),...newMsgs]}));
    setInput("");setChatImg(null);
    setTimeout(()=>{
      const r=AUTO_REPLIES[Math.floor(Math.random()*AUTO_REPLIES.length)];
      setChats(c=>({...c,[active]:[...(c[active]||[]),{id:Date.now()+2,from:"them",type:"text",text:r}]}));
    },900+Math.random()*500);
  }

  function toggleVoice(){
    const next=!voiceOn;setVoiceOn(next);
    if(next){
      setChats(c=>({...c,[active]:[...(c[active]||[]),{id:Date.now(),from:"system",text:`🎙️ เปิดห้องเสียงแล้ว — รอ ${friend.name} รับสาย...`}]}));
      setTimeout(()=>setChats(c=>({...c,[active]:[...(c[active]||[]),{id:Date.now(),from:"system",text:`✅ ${friend.name} รับสายแล้ว! คุยได้เลย 💜`}]})),1400);
    } else {
      setChats(c=>({...c,[active]:[...(c[active]||[]),{id:Date.now(),from:"system",text:"📵 วางสายแล้ว"}]}));
    }
  }

  return(
    <div style={{display:"flex",height:"calc(100vh - 116px)",minHeight:460}}>
      {/* Sidebar */}
      <div style={{width:200,borderRight:"1px solid "+C.border,background:C.surface,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"14px 14px 10px",borderBottom:"1px solid "+C.border}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>ข้อความ</div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {FRIENDS.map(f=>(
            <div key={f.id} onClick={()=>setActive(f.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",background:active===f.id?C.gradSoft:"transparent",borderBottom:"1px solid "+C.border,transition:"background .15s"}}>
              <Av init={f.init} bg={f.bg} tc={f.tc} size={34} online={f.online}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:active===f.id?C.brand:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{f.name}</div>
                <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{(chats[f.id]||[]).filter(m=>m.type==="text").slice(-1)[0]?.text||"..."}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",background:C.bg,minWidth:0}}>
        {/* Header */}
        <div style={{padding:"10px 16px",borderBottom:"1px solid "+C.border,background:C.surface,display:"flex",alignItems:"center",gap:11,flexShrink:0}}>
          <Av init={friend.init} bg={friend.bg} tc={friend.tc} size={36} online={friend.online}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>{friend.name}</div>
            <div style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:6}}>
              {friend.online&&<><div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/><span>ออนไลน์</span></>}
              {friend.mood&&<Pill bg={C.gradSoft} tc={C.brand}>✦ {friend.mood}</Pill>}
            </div>
          </div>
          <button onClick={toggleVoice} style={{padding:"7px 14px",borderRadius:20,border:"1px solid "+(voiceOn?C.brand:C.border),background:voiceOn?C.grad:"#fff",color:voiceOn?"#fff":C.sub,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,boxShadow:voiceOn?"0 2px 8px rgba(139,124,246,.35)":"none",transition:"all .2s"}}>
            🎙️ {voiceOn?"กำลังคุย":"เปิดเสียง"}
          </button>
        </div>

        {/* Voice bar */}
        {voiceOn&&(
          <div style={{background:C.gradSoft,borderBottom:"1px solid "+C.border,padding:"12px 16px",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:C.brand,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
                ห้องเสียง — กำลังคุยกัน
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setMicOn(!micOn)} style={{padding:"5px 11px",borderRadius:20,border:"1px solid "+C.brand,background:"#fff",color:C.brand,cursor:"pointer",fontSize:12,fontWeight:600}}>{micOn?"🎙️ ไมค์เปิด":"🔇 ไมค์ปิด"}</button>
                <button onClick={toggleVoice} style={{padding:"5px 11px",borderRadius:20,border:"1px solid "+C.red,background:C.redL,color:C.red,cursor:"pointer",fontSize:12,fontWeight:600}}>📵 วางสาย</button>
              </div>
            </div>
            <div style={{display:"flex",gap:16}}>
              {[{init:"สต",grad:C.grad,tc:"#fff",name:"คุณ",sp:true},{init:friend.init,bg:friend.bg,tc:friend.tc,name:friend.name,sp:false}].map((u,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{padding:2,borderRadius:"50%",border:"2.5px solid "+(u.sp?C.green:C.brand)}}>
                    <Av init={u.init} bg={u.bg} grad={u.grad} tc={u.tc} size={42}/>
                  </div>
                  <div style={{fontSize:12,color:C.brand,fontWeight:700}}>{u.name}</div>
                  <div style={{fontSize:11,color:C.muted}}>{u.sp?(micOn?"🎙️":"🔇"):"🎧"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {chatImg&&(
          <div style={{padding:"8px 16px 0",flexShrink:0}}>
            <div style={{position:"relative",display:"inline-block"}}>
              <img src={chatImg} alt="" style={{height:64,borderRadius:10,objectFit:"cover",border:"1px solid "+C.border}}/>
              <button onClick={()=>setChatImg(null)} style={{position:"absolute",top:-4,right:-4,width:18,height:18,borderRadius:"50%",background:"#555",border:"none",color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
          </div>
        )}

        <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
          {msgs.map(m=>{
            if(m.from==="system")return<div key={m.id} style={{textAlign:"center",fontSize:12,color:C.muted,padding:"4px 0",background:"transparent"}}>{m.text}</div>;
            const me=m.from==="me";
            return(
              <div key={m.id} style={{display:"flex",gap:8,alignItems:"flex-end",flexDirection:me?"row-reverse":"row"}}>
                {!me&&<Av init={friend.init} bg={friend.bg} tc={friend.tc} size={28}/>}
                <div style={{maxWidth:"70%"}}>
                  {m.type==="image"
                    ?<img src={m.src} alt="" style={{maxWidth:"100%",borderRadius:14,display:"block",border:"1px solid "+C.border}}/>
                    :<div style={{padding:"9px 14px",borderRadius:16,fontSize:14,lineHeight:1.55,background:me?C.grad:"#fff",color:me?"#fff":C.text,border:me?"none":"1px solid "+C.border,borderBottomLeftRadius:!me?4:16,borderBottomRightRadius:me?4:16,boxShadow:me?"0 2px 8px rgba(139,124,246,.3)":"0 1px 4px rgba(0,0,0,.04)"}}>{m.text}</div>
                  }
                </div>
              </div>
            );
          })}
          <div ref={endRef}/>
        </div>

        <div style={{padding:"10px 16px",borderTop:"1px solid "+C.border,background:C.surface,flexShrink:0}}>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setChatImg(ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <button onClick={()=>fileRef.current.click()} style={{width:36,height:36,borderRadius:"50%",border:"1px solid "+C.border,background:C.bg,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>📷</button>
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="พิมพ์ข้อความ..." rows={1} style={{flex:1,border:"1px solid "+C.border,borderRadius:20,padding:"9px 16px",fontSize:14,color:C.text,background:C.bg,outline:"none",resize:"none",fontFamily:"inherit",lineHeight:1.4}}/>
            <button onClick={send} style={{width:38,height:38,borderRadius:"50%",background:C.grad,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",flexShrink:0,fontSize:17,boxShadow:"0 2px 8px rgba(139,124,246,.4)"}}>↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Voice Rooms (เพิ่มระบบ Host จัดการสมาชิก) ────────────────
function VoiceRoomsPage(){
  const [rooms,setRooms]=useState(VOICE_ROOMS);
  const [inRoom,setInRoom]=useState(null);
  const [micOn,setMicOn]=useState(true);
  const [showMusic,setShowMusic]=useState(false);
  const [newName,setNewName]=useState("");
  const [creating,setCreating]=useState(false);
  const [nameErr,setNameErr]=useState("");

  function join(r){setInRoom(JSON.parse(JSON.stringify(r)));setMicOn(true);setShowMusic(false);}
  function leave(){setInRoom(null);setShowMusic(false);}
  
  function createRoom(){
    if(!newName.trim()){setNameErr("ใส่ชื่อห้องก่อนนะ");return;}
    const r={
      id:Date.now(),
      name:newName.trim(),
      host:"คุณ",
      users:[{name:"คุณ",init:"สต",grad:C.grad,tc:"#fff",mic:true,isMe:true}],
      vibe:"🎵"
    };
    setRooms(rs=>[r,...rs]);
    setInRoom(r);
    setNewName("");
    setCreating(false);
    setNameErr("");
  }

  // ฟังก์ชันให้ Host ปิดไมค์สมาชิกคนอื่น
  function toggleUserMic(index){
    if(!inRoom)return;
    const updatedUsers=[...inRoom.users];
    updatedUsers[index].mic=!updatedUsers[index].mic;
    setInRoom({...inRoom,users:updatedUsers});
  }

  // ฟังก์ชันให้ Host เตะคนออกจากห้อง
  function kickUser(index){
    if(!inRoom)return;
    const updatedUsers=inRoom.users.filter((_,i)=>i!==index);
    setInRoom({...inRoom,users:updatedUsers});
  }

  const isHost = inRoom && inRoom.host === "คุณ";

  return(
    <div>
      {/* Active room */}
      {inRoom&&(
        <div style={{background:C.gradSoft,border:"1px solid "+C.brand,borderRadius:18,padding:"16px",marginBottom:16,boxShadow:"0 4px 20px rgba(139,124,246,.15)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,color:C.brand,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:C.green,boxShadow:"0 0 6px "+C.green}}/>
              {inRoom.vibe} {inRoom.name} <span style={{fontSize:11,background:C.brand,color:"#fff",padding:"2px 8px",borderRadius:10}}>Host: {inRoom.host}</span>
            </div>
            <div style={{display:"flex",gap:7}}>
              <button onClick={()=>setShowMusic(!showMusic)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid "+C.brand,background:showMusic?C.brand:"#fff",color:showMusic?"#fff":C.brand,cursor:"pointer",fontSize:12,fontWeight:600}}>🎵 เพลง/YT</button>
              <button onClick={()=>setMicOn(!micOn)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid "+C.brand,background:"#fff",color:C.brand,cursor:"pointer",fontSize:12,fontWeight:600}}>{micOn?"🎙️ เปิดไมค์":"🔇 ปิดไมค์"}</button>
              <button onClick={leave} style={{padding:"6px 12px",borderRadius:20,border:"1px solid "+C.red,background:C.redL,color:C.red,cursor:"pointer",fontSize:12,fontWeight:600}}>📵 ออกจากห้อง</button>
            </div>
          </div>

          {/* รายชื่อคนในห้องพร้อมปุ่มจัดการของ Host */}
          <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:showMusic?14:0}}>
            {inRoom.users.map((u,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"#fff",padding:10,borderRadius:14,border:"1px solid "+C.border}}>
                <div style={{padding:2,borderRadius:"50%",border:"2.5px solid "+(u.mic?C.green:C.muted)}}>
                  <Av init={u.init||u.name.slice(0,2)} bg={u.bg} grad={u.grad} tc={u.tc} size={40}/>
                </div>
                <div style={{fontSize:12,color:C.text,fontWeight:700}}>{u.name}</div>
                <div style={{fontSize:11,color:C.sub}}>{u.mic?"🎙️ พูดอยู่":"🔇 ปิดไมค์"}</div>

                {/* ปุ่มควบคุมเฉพาะ Host */}
                {isHost && !u.isMe && (
                  <div style={{display:"flex",gap:4,marginTop:4}}>
                    <button onClick={()=>toggleUserMic(i)} style={{fontSize:10,padding:"2px 6px",borderRadius:6,border:"1px solid "+C.border,background:C.bg,cursor:"pointer"}}>
                      {u.mic?"ปิดไมค์":"เปิดไมค์"}
                    </button>
                    <button onClick={()=>kickUser(i)} style={{fontSize:10,padding:"2px 6px",borderRadius:6,border:"1px solid "+C.red,background:C.redL,color:C.red,cursor:"pointer"}}>
                      เตะ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showMusic&&<MusicPlayer/>}
        </div>
      )}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:700,color:C.text}}>ห้องเสียงที่เปิดอยู่ 🎙️</div>
        <button onClick={()=>setCreating(!creating)} style={{padding:"7px 16px",borderRadius:20,border:"1px solid "+C.brand,background:creating?C.grad:C.gradSoft,color:creating?"#fff":C.brand,cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:creating?"0 2px 8px rgba(139,124,246,.3)":"none"}}>+ เปิดห้องใหม่</button>
      </div>

      {creating&&(
        <Card style={{marginBottom:14}}>
          <div style={{padding:"14px 16px"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>ชื่อห้องใหม่ที่คุณต้องการสร้าง</div>
            <div style={{display:"flex",gap:8}}>
              <input value={newName} onChange={e=>{setNewName(e.target.value);setNameErr("");}} onKeyDown={e=>e.key==="Enter"&&createRoom()} placeholder="เช่น คืนนี้ใครว่างคุยเล่นกัน 🌙" style={{flex:1,border:"1px solid "+C.border,borderRadius:12,padding:"9px 14px",fontSize:14,outline:"none",background:C.bg,color:C.text,fontFamily:"inherit"}}/>
              <button onClick={createRoom} style={{padding:"9px 18px",borderRadius:12,border:"none",background:C.grad,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700}}>สร้างห้อง</button>
            </div>
            {nameErr && <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>{nameErr}</div>}
          </div>
        </Card>
      )}

      {/* รายการห้องทั้งหมด */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {rooms.map(r=>(
          <div key={r.id} onClick={()=>join(r)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:14,background:C.surface,borderRadius:14,border:"1px solid "+C.border,cursor:"pointer",transition:"all .2s"}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.text}}>{r.vibe} {r.name}</div>
              <div style={{fontSize:12,color:C.sub,marginTop:2}}>เจ้าของห้อง: {r.host} · มีคนอยู่ในห้อง {r.users?.length || 0} คน</div>
            </div>
            <button style={{padding:"6px 14px",borderRadius:20,border:"none",background:C.gradSoft,color:C.brand,fontSize:12,fontWeight:700,cursor:"pointer"}}>เข้าร่วมฟัง/พูด</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App (คอมโพเนนต์หลัก) ───────────────────────────────────────────
export default function App() {
  const [posts, setPosts] = useState(INIT_POSTS);
  const [tab, setTab] = useState("feed");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "sans-serif", background: C.bg, minHeight: "100vh" }}>
      {/* เมนูนำทาง */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, background: C.surface, padding: 15, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Pill active={tab === "feed"} onClick={() => setTab("feed")}>📝 ฟีด</Pill>
        <Pill active={tab === "chat"} onClick={() => setTab("chat")}>💬 แชท</Pill>
        <Pill active={tab === "voice"} onClick={() => setTab("voice")}>🎙️ ห้องเสียง</Pill>
      </div>

      {/* สลับการแสดงผล */}
      {tab === "feed" && <FeedPage posts={posts} setPosts={setPosts} />}
      {tab === "chat" && <ChatPage />}
      {tab === "voice" && <VoiceRoomsPage />}
    </div>
  );
}
