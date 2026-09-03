import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  
  // State สำหรับโปรไฟล์ผู้ใช้ปัจจุบัน (จำลองการเข้าสู่ระบบด้วยชื่อ)
  const [username, setUsername] = useState('คุณ (ผู้ใช้)');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // State สำหรับฟีดโพสต์
  const [posts, setPosts] = useState([
    {
      id: 1,
      initials: 'NK',
      name: 'หนูนก',
      time: '2 นาทีที่แล้ว',
      mood: '+ เหงา 🌙',
      privacy: 'สาธารณะ 🌐',
      content: 'วันนี้เหงามากเลย ใครว่างคุยด้วยบ้าง 🌙',
      mediaUrl: '',
      mediaType: '',
      likes: 12,
      comments: 1,
      liked: false
    },
    {
      id: 2,
      initials: 'BR',
      name: 'ไบรท์',
      time: '1 ชม.',
      mood: '+ สงบ ✨',
      privacy: 'เพื่อนเท่านั้น 👥',
      content: 'อากาศดีมากวันนี้ 🌼 ออกไปนั่งข้างนอกสักพัก',
      mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      mediaType: 'image',
      likes: 16,
      comments: 7,
      liked: false
    }
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState(''); // 'image' หรือ 'video'
  const [postPrivacy, setPostPrivacy] = useState('สาธารณะ 🌐');
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  // State สำหรับห้องแชท
  const [chatMessages, setChatMessages] = useState([
    { sender: 'หนูนก', text: 'สวัสดีครับ ทุกคนทำอะไรกันอยู่บ้าง?' },
    { sender: 'คุณ', text: 'กำลังทดสอบระบบโพสต์รูปและวิดีโอในแอป Warmly V2 ครับ' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // State สำหรับห้องเสียง
  const [isHost, setIsHost] = useState(true);
  const [voiceUsers, setVoiceUsers] = useState([
    { id: 1, name: 'คุณ (Host)', isMuted: false },
    { id: 2, name: 'หนูนก', isMuted: false },
    { id: 3, name: 'ไบรท์', isMuted: true },
    { id: 4, name: 'สมชาย', isMuted: false }
  ]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('5qap5aO4i9A');

  // ฟังก์ชันสร้างโพสต์ใหม่ (รองรับข้อความ รูปภาพ/วิดีโอ และความเป็นส่วนตัว)
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !newMediaUrl.trim()) return;
    
    const newPost = {
      id: Date.now(),
      initials: username.substring(0, 2).toUpperCase(),
      name: username,
      time: 'เมื่อสักครู่',
      mood: '+ สดใส ☀️',
      privacy: postPrivacy,
      content: newPostText,
      mediaUrl: newMediaUrl,
      mediaType: newMediaType,
      likes: 0,
      comments: 0,
      liked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setNewMediaUrl('');
    setNewMediaType('');
  };

  const handleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  // ฟังก์ชันแชท
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: username, text: inputMessage }]);
    setInputMessage('');
  };

  // ฟังก์ชันห้องเสียง
  const toggleMuteUser = (id) => {
    if (!isHost) return;
    setVoiceUsers(voiceUsers.map(u => u.id === id ? { ...u, isMuted: !u.isMuted } : u));
  };

  const kickUser = (id) => {
    if (!isHost) return;
    setVoiceUsers(voiceUsers.filter(u => u.id !== id));
  };

  const handlePlayYoutube = (e) => {
    e.preventDefault();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = youtubeUrl.match(regExp);
    if (match && match[2].length === 11) {
      setCurrentVideoId(match[2]);
      setYoutubeUrl('');
    } else {
      alert('ลิงก์ YouTube ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', padding: '20px', fontFamily: 'sans-serif', color: '#374151' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Navbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', padding: '15px 20px', borderRadius: '25px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: 'bold', fontSize: '1.2rem', marginRight: 'auto' }}>
            ♡ Warmly <span style={{ fontSize: '0.75rem', background: '#ede9fe', padding: '2px 8px', borderRadius: '10px', color: '#7c3aed' }}>{username}</span>
          </div>
          <div style={{ display: 'flex', gap: '5px', background: '#f3f4f6', padding: '5px', borderRadius: '20px' }}>
            <button style={tabStyle(activeTab === 'feed')} onClick={() => setActiveTab('feed')}>🏠 ฟีด</button>
            <button style={tabStyle(activeTab === 'chat')} onClick={() => setActiveTab('chat')}>💬 แชท</button>
            <button style={tabStyle(activeTab === 'voice')} onClick={() => setActiveTab('voice')}>🎙️ ห้องเสียง</button>
          </div>
        </div>

        {/* --- หน้าฟีด (Feed) --- */}
        {activeTab === 'feed' && (
          <>
            {/* Post Box */}
            <form onSubmit={handleCreatePost} style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1)' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={avatarStyleGradient}>{username.substring(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="คุณรู้สึกยังไงวันนี้? บอกเพื่อนๆบ้างนะ 💜" 
                    style={{ width: '100%', border: '1px solid #f3f4f6', borderRadius: '15px', padding: '10px 15px', outline: 'none', background: '#f9fafb', fontSize: '0.95rem', boxSizing: 'border-box' }} 
                  />
                  
                  {/* ช่องใส่ลิงก์รูปภาพหรือวิดีโอ (เพิ่มเข้ามาใหม่) */}
                  <input 
                    type="text" 
                    value={newMediaUrl}
                    onChange={(e) => {
                      setNewMediaUrl(e.target.value);
                      if (e.target.value.includes('youtube') || e.target.value.includes('youtu.be') || e.target.value.endsWith('.mp4')) {
                        setNewMediaType('video');
                      } else {
                        setNewMediaType('image');
                      }
                    }}
                    placeholder="🔗 วางลิงก์รูปภาพ หรือวิดีโอ (ถ้ามี)..." 
                    style={{ width: '100%', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '8px 12px', outline: 'none', background: '#fdfcfe', fontSize: '0.85rem', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                {/* เลือกความเป็นส่วนตัว สาธารณะ / เพื่อนเท่านั้น */}
                <div style={{ position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                    style={actionBtnStyle}
                  >
                    🔒 {postPrivacy} ▾
                  </button>
                  {showPrivacyDropdown && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, marginTop: '5px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                      <div onClick={() => { setPostPrivacy('สาธารณะ 🌐'); setShowPrivacyDropdown(false); }} style={{ padding: '8px 15px', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '1px solid #f3f4f6' }}>🌐 สาธารณะ</div>
                      <div onClick={() => { setPostPrivacy('เพื่อนเท่านั้น 👥'); setShowPrivacyDropdown(false); }} style={{ padding: '8px 15px', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '1px solid #f3f4f6' }}>👥 เพื่อนเท่านั้น</div>
                      <div onClick={() => { setPostPrivacy('เฉพาะฉัน 🔒'); setShowPrivacyDropdown(false); }} style={{ padding: '8px 15px', cursor: 'pointer', fontSize: '0.85rem' }}>🔒 เฉพาะฉัน</div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" style={actionBtnStyle}>+ Mood</button>
                  <button type="submit" style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)' }}>Post ✨</button>
                </div>
              </div>
            </form>

            {/* Feed Cards List */}
            {posts.map((post) => (
              <div key={post.id} style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '15px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={avatarStyleGradient}>{post.initials}</div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#111827' }}>{post.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{post.time} • 🔒 {post.privacy}</div>
                    </div>
                  </div>
                  <div style={{ background: 'linear-gradient(to right, #a78bfa, #c084fc)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {post.mood}
                  </div>
                </div>

                <div style={{ marginBottom: '15px', lineHeight: '1.5', color: '#374151' }}>
                  {post.content}
                </div>

                {/* แสดงรูปภาพหรือวิดีโอในโพสต์ (ถ้ามี) */}
                {post.mediaUrl && (
                  <div style={{ marginBottom: '15px', borderRadius: '15px', overflow: 'hidden', background: '#000', maxHeight: '300px' }}>
                    {post.mediaType === 'video' ? (
                      <video src={post.mediaUrl} controls style={{ width: '100%', maxHeight: '300px', display: 'block' }} />
                    ) : (
                      <img src={post.mediaUrl} alt="Post media" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                    )}
                  </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', marginBottom: '15px' }} />
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    onClick={() => handleLike(post.id)} 
                    style={{ ...actionBtnStyle, color: post.liked ? '#ec4899' : '#4b5563', borderColor: post.liked ? '#f472b6' : '#e5e7eb' }}
                  >
                    💜 {post.likes}
                  </button>
                  <button style={actionBtnStyle}>💬 {post.comments}</button>
                  <button style={actionBtnStyle} onClick={() => alert('คัดลอกลิงก์โพสต์เรียบร้อย!')}>🔗 แชร์</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* --- หน้าแชท (Chat) --- */}
        {activeTab === 'chat' && (
          <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ color: '#111827', marginBottom: '15px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>💬 แชทกลุ่มเพื่อน Warmly</h3>
            <div style={{ height: '300px', overflowY: 'auto', background: '#f9fafb', borderRadius: '15px', padding: '15px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map((msg, index) => (
                <div key={index} style={{ alignSelf: msg.sender === username ? 'flex-end' : 'flex-start', background: msg.sender === username ? '#8b5cf6' : '#e5e7eb', color: msg.sender === username ? '#fff' : '#1f2937', padding: '10px 15px', borderRadius: '15px', maxWidth: '75%', fontSize: '0.9rem' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '2px' }}>{msg.sender}</div>
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                placeholder="พิมพ์ข้อความส่งในแชท..." 
                style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '15px', padding: '10px 15px', outline: 'none', background: '#f9fafb' }} 
              />
              <button type="submit" style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>ส่ง</button>
            </form>
          </div>
        )}

        {/* --- หน้าห้องเสียง (Voice Room) --- */}
        {activeTab === 'voice' && (
          <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>
              <h3 style={{ color: '#111827', margin: 0 }}>🎙️ ห้องเสียง & ฟังเพลงร่วมกัน</h3>
              <span style={{ background: isHost ? '#ede9fe' : '#f3f4f6', color: isHost ? '#7c3aed' : '#4b5563', padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {isHost ? '👑 เจ้าของห้อง (Host)' : '🎧 สมาชิก'}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ borderRadius: '15px', overflow: 'hidden', background: '#000', position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe 
                  src={`https://www.youtube.com/embed/${currentVideoId}`} 
                  title="YouTube video player" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <form onSubmit={handlePlayYoutube} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input 
                  type="text" 
                  value={youtubeUrl} 
                  onChange={(e) => setYoutubeUrl(e.target.value)} 
                  placeholder="วางลิงก์ YouTube เพื่อเปิดฟังร่วมกันในห้อง..." 
                  style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px 12px', fontSize: '0.85rem', outline: 'none', background: '#f9fafb' }} 
                />
                <button type="submit" style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>เปิดเพลง</button>
              </form>
            </div>

            <h4 style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '10px' }}>สมาชิกในห้องเสียง ({voiceUsers.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {voiceUsers.map((user) => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', padding: '10px 15px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#111827' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: user.isMuted ? '#ef4444' : '#10b981' }}>
                        {user.isMuted ? '🔇 ปิดไมค์อยู่' : '🎙️ เปิดไมค์พูดคุย'}
                      </div>
                    </div>
                  </div>

                  {isHost && user.id !== 1 && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => toggleMuteUser(user.id)}
                        style={{ background: user.isMuted ? '#fee2e2' : '#f3f4f6', color: user.isMuted ? '#dc2626' : '#374151', border: 'none', padding: '5px 10px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        {user.isMuted ? 'เปิดไมค์' : 'ปิดไมค์'}
                      </button>
                      <button 
                        onClick={() => kickUser(user.id)}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 10px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        เตะออก
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => alert('สลับสถานะไมโครโฟนของคุณเรียบร้อย')} 
                style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)', fontSize: '0.9rem' }}
              >
                🎙️ เปิด/ปิดไมค์ของฉัน
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const tabStyle = (isActive) => ({
  padding: '6px 16px',
  borderRadius: '15px',
  border: 'none',
  background: isActive ? '#8b5cf6' : 'transparent',
  color: isActive ? '#fff' : '#6b7280',
  fontWeight: isActive ? 'bold' : 'normal',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '0.9rem'
});

const avatarStyleGradient = {
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #8b5cf6, #ec4899) border-box',
  border: '3px solid transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  color: '#8b5cf6',
  flexShrink: 0
};

const actionBtnStyle = {
  padding: '6px 14px',
  borderRadius: '20px',
  border: '1px solid #e5e7eb',
  background: '#fff',
  color: '#4b5563',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.2s'
};
