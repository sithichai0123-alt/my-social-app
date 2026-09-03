{nameErr && <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>{nameErr}</div>}
          </div>
        </Card>
      )}
    </div>
  );
}

// คอมโพเนนต์หลักสำหรับสลับหน้าเว็บ (นำไปวางไว้ล่างสุดของไฟล์)
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
