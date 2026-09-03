import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([
    {
      id: 1,
      initials: 'NK',
      name: 'หนูนก',
      time: '2 นาทีที่แล้ว',
      mood: '+ เหงา 🌙',
      content: 'วันนี้เหงามากเลย ใครว่างคุยด้วยบ้าง 🌙',
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
      content: 'อากาศดีมากวันนี้ 🌼 ออกไปนั่งข้างนอกสักพัก',
      likes: 16,
      comments: 7,
      liked: false
    }
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'หนูนก', text: 'สวัสดีครับ กำลังทำอะไรอยู่หรอ?' },
    { sender: 'คุณ', text: 'กำลังทดสอบระบบแอป Warmly V2 อยู่ครับ สวยมั้ย!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // ฟังก์ชันสร้างโพสต์ใหม่
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost = {
      id: Date.now(),
      initials: 'ME',
      name: 'คุณ (ผู้ใช้)',
      time: 'เมื่อสักครู่',
      mood: '+ สดใส ☀️',
      content: newPostText,
      likes: 0,
      comments: 0,
      liked: false
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  // ฟังก์ชันกดถูกใจ
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

  // ฟังก์ชันส่งข้อความแชท
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: 'คุณ', text: inputMessage }]);
    setInputMessage('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', padding: '20px', fontFamily: 'sans-serif', color: '#374151' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Navbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', padding: '15px 20px', borderRadius: '25px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: 'bold', fontSize: '1.2rem', marginRight: 'auto' }}>
            ♡ Warmly
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
                <div style={avatarStyleGradient}>สด</div>
                <input 
                  type="text" 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="คุณรู้สึกยังไงวันนี้? บอกเพื่อนๆบ้างนะ 💜" 
                  style={{ flex: 1, border: '1px solid #f3f4f6', borderRadius: '15px', padding: '10px 15px', outline: 'none', background: '#f9fafb', fontSize: '0.95rem' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" style={actionBtnStyle}>📷 Media</button>
                <button type="button" style={{...actionBtnStyle, background: 'linear-gradient(to right, #a78bfa, #c084fc)', color: '#fff', border: 'none'}}>+ Mood</button>
                <button type="button" style={actionBtnStyle}>🌐 สาธารณะ ⌄</button>
                <button type="submit" style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)', marginLeft: '10px' }}>Post ✨</button>
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
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{post.time} • 🌐 สาธารณะ</div>
                    </div>
                  </div>
                  <div style={{ background: 'linear-gradient(to right, #a78bfa, #c084fc)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {post.mood}
                  </div>
                </div>
                <div style={{ marginBottom: '15px', lineHeight: '1.5', color: '#374151' }}>
                  {post.content}
                </div>
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
                <div key={index} style={{ alignSelf: msg.sender === 'คุณ' ? 'flex-end' : 'flex-start', background: msg.sender === 'คุณ' ? '#8b5cf6' : '#e5e7eb', color: msg.sender === 'คุณ' ? '#fff' : '#1f2937', padding: '10px 15px', borderRadius: '15px', maxWidth: '75%', fontSize: '0.9rem' }}>
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
          <div style={{ background: '#fff', borderRadius: '20px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎙️</div>
            <h3 style={{ color: '#111827', marginBottom: '10px' }}>ห้องสนทนาเสียง (Voice Room)</h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '20px' }}>ห้องพูดคุยเปิดไมค์สดร่วมกับเพื่อนๆ ในกลุ่ม</p>
            <button onClick={() => alert('เชื่อมต่อไมโครโฟนจำลองเรียบร้อย!')} style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)' }}>
              🎙️ เปิดไมค์พูดคุย
            </button>
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
