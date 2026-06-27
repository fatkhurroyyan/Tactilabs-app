import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BookOpen, Plus, Trash2, Edit3, X, Save } from 'lucide-react';

interface QuestData {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  xpReward: number;
  orderIndex: number;
  prerequisiteQuestId?: string;
  circuitConfig: any;
  instructions: string[];
  hint?: string;
  isPremium: boolean;
}

export const Content: React.FC = () => {
  const token = useAppStore(state => state.accessToken);

  const [quests, setQuests] = useState<QuestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('OHM_LAW');
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [xpReward, setXpReward] = useState('100');
  const [orderIndex, setOrderIndex] = useState('1');
  const [prerequisiteQuestId, setPrerequisiteQuestId] = useState('');
  const [circuitConfigStr, setCircuitConfigStr] = useState('{"components":["BATTERY","RESISTOR","LED"],"validation":{"minCurrentMA":10,"maxCurrentMA":50}}');
  const [instructionsStr, setInstructionsStr] = useState('["Hubungkan baterai ke sirkuit","Pasang resistor 220 Ohm","Pasang lampu LED dan perhatikan aliran elektron"]');
  const [hint, setHint] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const fetchQuests = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/quests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setQuests(data.quests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchQuests();
    }
  }, [token]);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setTopic('OHM_LAW');
    setDifficulty('BEGINNER');
    setXpReward('100');
    setOrderIndex(String(quests.length + 1));
    setPrerequisiteQuestId('');
    setCircuitConfigStr('{"components":["BATTERY","RESISTOR","LED"],"validation":{"minCurrentMA":10,"maxCurrentMA":50}}');
    setInstructionsStr('["Hubungkan baterai ke sirkuit","Pasang resistor 220 Ohm","Pasang lampu LED dan perhatikan aliran elektron"]');
    setHint('');
    setIsPremium(false);
    setMsg('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (q: QuestData) => {
    setEditingId(q.id);
    setTitle(q.title);
    setDescription(q.description);
    setTopic(q.topic);
    setDifficulty(q.difficulty);
    setXpReward(String(q.xpReward));
    setOrderIndex(String(q.orderIndex));
    setPrerequisiteQuestId(q.prerequisiteQuestId || '');
    setCircuitConfigStr(typeof q.circuitConfig === 'string' ? q.circuitConfig : JSON.stringify(q.circuitConfig));
    setInstructionsStr(typeof q.instructions === 'string' ? q.instructions : JSON.stringify(q.instructions));
    setHint(q.hint || '');
    setIsPremium(q.isPremium || false);
    setMsg('');
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setError('');

    // Validate JSONs
    try {
      JSON.parse(circuitConfigStr);
    } catch (e) {
      setError('JSON Circuit Config tidak valid.');
      return;
    }

    try {
      JSON.parse(instructionsStr);
    } catch (e) {
      setError('JSON array langkah instruksi tidak valid.');
      return;
    }

    const payload = {
      title,
      description,
      topic,
      difficulty,
      xpReward,
      orderIndex,
      prerequisiteQuestId: prerequisiteQuestId || null,
      circuitConfig: circuitConfigStr,
      instructions: instructionsStr,
      hint,
      isPremium
    };

    try {
      const url = editingId 
        ? `http://localhost:4002/api/admin/quests/${editingId}`
        : 'http://localhost:4002/api/admin/quests';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(editingId ? 'Quest berhasil diperbarui!' : 'Quest berhasil ditambahkan!');
        setIsModalOpen(false);
        fetchQuests();
      } else {
        setError(data.message || 'Gagal menyimpan quest.');
      }
    } catch (err) {
      setError('Kesalahan koneksi ke server.');
    }
  };

  const handleDeleteQuest = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus quest ini?')) return;
    setMsg('');
    try {
      const res = await fetch(`http://localhost:4002/api/admin/quests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMsg('Quest berhasil dihapus.');
        fetchQuests();
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menghapus quest.');
      }
    } catch (err) {
      alert('Kesalahan koneksi ke server.');
    }
  };

  const loadTemplate = (type: 'LED' | 'OHM') => {
    if (type === 'LED') {
      setCircuitConfigStr('{"components":["BATTERY","RESISTOR","LED"],"validation":{"minCurrentMA":10,"maxCurrentMA":50}}');
      setInstructionsStr('["Hubungkan baterai ke sirkuit","Pasang resistor 220 Ohm","Pasang LED dan perhatikan lampu menyala"]');
    } else {
      setCircuitConfigStr('{"components":["BATTERY","RESISTOR"],"validation":{"minCurrentMA":15,"maxCurrentMA":25}}');
      setInstructionsStr('["Hubungkan baterai","Pasang hambatan resistor agar arus berada di rentang target 15-25 mA"]');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
      
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Manajemen Konten & Kurikulum</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Buat, perbarui, atau atur modul quest praktikum sirkuit virtual dan kriteria telemetri sensor.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={openCreateModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Buat Quest Baru
        </button>
      </div>

      <div className="glass-card">
        <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--cyan)" /> Library Quest Terdaftar
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Memuat kurikulum...</p>
        ) : quests.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Belum ada quest terdaftar.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '12px 8px' }}>Urutan</th>
                <th style={{ padding: '12px 8px' }}>Judul Quest</th>
                <th style={{ padding: '12px 8px' }}>Topik</th>
                <th style={{ padding: '12px 8px' }}>Kesulitan</th>
                <th style={{ padding: '12px 8px' }}>XP</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quests.map(q => (
                <tr key={q.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>#{q.orderIndex}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{q.title}</td>
                  <td style={{ padding: '12px 8px' }}>{q.topic}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 'bold', 
                      background: q.difficulty === 'BEGINNER' ? 'rgba(0,162,154,0.1)' : q.difficulty === 'INTERMEDIATE' ? 'rgba(217,119,6,0.1)' : 'rgba(186,26,26,0.1)',
                      color: q.difficulty === 'BEGINNER' ? 'var(--cyan)' : q.difficulty === 'INTERMEDIATE' ? 'var(--gold)' : 'var(--red-neon)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--cyan-neon)', fontWeight: 'bold' }}>+{q.xpReward} XP</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditModal(q)} style={{ background: 'none', color: 'var(--text-secondary)', padding: '6px' }} title="Edit">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDeleteQuest(q.id)} style={{ background: 'none', color: 'var(--red-neon)', padding: '6px' }} title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CRUD Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 25, 41, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            border: '1px solid var(--border-glass)'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: 'var(--text-secondary)', padding: 0 }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '22px' }}>{editingId ? 'Edit Quest' : 'Tambah Quest Baru'}</h2>

            {error && (
              <div style={{ background: 'rgba(186,26,26,0.1)', border: '1px solid var(--red-neon)', color: 'var(--red-neon)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSaveQuest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Judul Quest</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Hukum Ohm: Rangkaian Seri" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Urutan Indeks</label>
                  <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Deskripsi Singkat</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Deskripsikan misi yang harus diselesaikan mahasiswa..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Topik</label>
                  <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                    <option value="CURRENT">Current</option>
                    <option value="VOLTAGE">Voltage</option>
                    <option value="RESISTANCE">Resistance</option>
                    <option value="OHM_LAW">Ohm's Law</option>
                    <option value="LOGIC_GATE">Logic Gate</option>
                    <option value="TRANSISTOR">Transistor</option>
                    <option value="CAPACITOR">Capacitor</option>
                    <option value="MIXED">Mixed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Kesulitan</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Imbalan XP</label>
                  <input type="number" value={xpReward} onChange={(e) => setXpReward(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Prasyarat Quest ID (Optional)</label>
                  <select value={prerequisiteQuestId} onChange={(e) => setPrerequisiteQuestId(e.target.value)}>
                    <option value="">Tanpa Prasyarat</option>
                    {quests.filter(q => q.id !== editingId).map(q => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                  <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} style={{ width: 'auto' }} />
                  <label style={{ fontSize: '13px' }}>Akses Premium B2B</label>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Circuit Config (JSON Target Validation)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => loadTemplate('LED')} style={{ padding: '2px 8px', fontSize: '10px', background: 'var(--bg-secondary)', color: 'white' }}>Preset LED</button>
                    <button type="button" onClick={() => loadTemplate('OHM')} style={{ padding: '2px 8px', fontSize: '10px', background: 'var(--bg-secondary)', color: 'white' }}>Preset Ohm</button>
                  </div>
                </div>
                <textarea rows={3} value={circuitConfigStr} onChange={(e) => setCircuitConfigStr(e.target.value)} required style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Langkah Instruksi (JSON string array)</label>
                <textarea rows={2} value={instructionsStr} onChange={(e) => setInstructionsStr(e.target.value)} required style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Petunjuk / Hint (Optional)</label>
                <input type="text" value={hint} onChange={(e) => setHint(e.target.value)} placeholder="Periksa kembali apakah arah polaritas sirkuit Anda benar..." />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={16} /> Simpan Quest
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Batal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
