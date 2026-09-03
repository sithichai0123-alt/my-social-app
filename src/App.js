import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');

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

        {/* Post Box */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1)' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={avatarStyleGradient}>สด</div>
            <input type="text" placeholder="คุณรู้สึกยังไงวันนี้? บอกเพื่อนๆบ้างนะ 💜" style={{ flex: 1, border: '1px solid #f3f4f6', borderRadius: '15px', padding: '10px 15px', outline: 'none', background: '#f9fafb', fontSize: '0.95rem' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button style={actionBtnStyle}>📷 Media</button>
            <button style={{...actionBtnStyle, background: 'linear-gradient(to right, #a78bfa, #c084fc)', color: '#fff', border: 'none'}}>+ Mood</button>
            <button style={actionBtnStyle}>🌐 Privacy ⌄</button>
            <button style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)', marginLeft: '10px' }}>Post ✨</button>
          </div>
        </div>

        {/* Feed Cards */}
        <FeedCard
          initials="NK"
          name="หนูนก"
          time="2 นาทีที่แล้ว"
          mood="+ เหงา 🌙"
          content="วันนี้เหงามากเลย ใครว่างคุยด้วยบ้าง 🌙"
          likes="12"
          comments="1"
        />
        <FeedCard
          initials="BR"
          name="ไบรท์"
          time="1 ชม."
          mood="+ สงบ ✨"
          content="อากาศดีมากวันนี้ 🌼 ออกไปนั่งข้างนอกสักพัก"
          likes="16"
          comments="7"
        />
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

function FeedCard({ initials, name, time, mood, content, likes, comments }) {
  return (
    <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '15px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={avatarStyleGradient}>{initials}</div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#111827' }}>{name}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{time} • 🌐 สาธารณะ</div>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(to right, #a78bfa, #c084fc)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {mood}
        </div>
      </div>
      <div style={{ marginBottom: '15px', lineHeight: '1.5', color: '#374151' }}>
        {content}
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', marginBottom: '15px' }} />
      <div style={{ display: 'flex', gap: '15px' }}>
        <button style={actionBtnStyle}>💜 {likes}</button>
        <button style={actionBtnStyle}>💬 {comments}</button>
        <button style={actionBtnStyle}>🔗 แชร์</button>
      </div>
    </div>
  );
}
