import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Calendar, BookOpen, UserCheck } from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
}

export const Assignments: React.FC = () => {
  const token = useAppStore(state => state.accessToken);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [questsList, setQuestsList] = useState<any[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignQuestId, setAssignQuestId] = useState('');
  const [assignDeadline, setAssignDeadline] = useState('');
  
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchClassesAndQuests = async () => {
    try {
      // Fetch classes
      const resClasses = await fetch('http://localhost:4002/api/educator/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataClasses = await resClasses.json();
      if (resClasses.ok) {
        setClasses(dataClasses.classes || []);
      }

      // Fetch quests
      const resQuests = await fetch('http://localhost:4002/api/quests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataQuests = await resQuests.json();
      if (resQuests.ok) {
        setQuestsList(dataQuests.quests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClassesAndQuests();
    }
  }, [token]);

  const handleAssignQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!selectedClassId || !assignQuestId || !assignDeadline) {
      setMsg('Harap lengkapi semua isian penugasan');
      return;
    }
    try {
      const res = await fetch('http://localhost:4002/api/educator/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          classId: selectedClassId,
          questId: assignQuestId,
          deadline: assignDeadline
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Quest berhasil ditugaskan ke kelas!');
        setSelectedClassId('');
        setAssignQuestId('');
        setAssignDeadline('');
      } else {
        setMsg(data.message || 'Gagal membuat penugasan');
      }
    } catch (err) {
      setMsg('Kesalahan koneksi');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Tugaskan Modul Sirkuit</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Berikan tantangan praktikum quest tertentu ke kelas terkelola dengan batas waktu pengumpulan.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      <div className="glass-card">
        <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--cyan)" /> Buat Penugasan Baru
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Memuat data penugasan...</p>
        ) : (
          <form onSubmit={handleAssignQuest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Pilih Kelas Penerima</label>
              <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} required>
                <option value="">-- Pilih Kelas --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Pilih Quest Modul</label>
              <select value={assignQuestId} onChange={(e) => setAssignQuestId(e.target.value)} required>
                <option value="">-- Pilih Quest --</option>
                {questsList.map(q => (
                  <option key={q.id} value={q.id}>{q.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Batas Waktu (Deadline)</label>
              <input type="date" value={assignDeadline} onChange={(e) => setAssignDeadline(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <UserCheck size={18} /> Tugaskan Sekarang
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
