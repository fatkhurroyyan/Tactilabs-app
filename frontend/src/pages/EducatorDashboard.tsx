import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Users, AlertCircle, Plus } from 'lucide-react';

interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  avgQuestsCompleted: number;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  completedQuests: number;
}

interface AttentionStudent {
  id: string;
  name: string;
  email: string;
  className: string;
  completedQuests: number;
  completionRate: number;
}

export const EducatorDashboard: React.FC = () => {
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [needingAttention, setNeedingAttention] = useState<AttentionStudent[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [newClassName, setNewClassName] = useState('');
  const [assignQuestId, setAssignQuestId] = useState('');
  const [assignDeadline, setAssignDeadline] = useState('');
  const [questsList, setQuestsList] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  const token = useAppStore(state => state.accessToken);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/educator/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardSummary(data.summary);
        setClasses(data.classes);
        setNeedingAttention(data.needingAttention);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuests = async () => {
    try {
      const res = await fetch('http://localhost:4002/api/quests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setQuestsList(data.quests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchQuests();
    }
  }, [token]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('http://localhost:4002/api/educator/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newClassName })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Kelas baru berhasil dibuat!');
        setNewClassName('');
        fetchDashboard();
      } else {
        setMsg(data.message || 'Gagal membuat kelas');
      }
    } catch (err) {
      setMsg('Kesalahan koneksi');
    }
  };

  const handleSelectClass = async (classId: string) => {
    setSelectedClassId(classId);
    try {
      const res = await fetch(`http://localhost:4002/api/educator/classes/${classId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedClassDetails(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        setAssignQuestId('');
        setAssignDeadline('');
        handleSelectClass(selectedClassId);
      } else {
        setMsg(data.message || 'Gagal membuat penugasan');
      }
    } catch (err) {
      setMsg('Kesalahan koneksi');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Dashboard Analitik Dosen</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Pantau progres ketuntasan belajar mahasiswa dan kelola penugasan sirkuit.</p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(0,162,154,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan-neon)', padding: '12px', borderRadius: '8px' }}>
          {msg}
        </div>
      )}

      {/* Aggregate Cards */}
      {dashboardSummary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL KELAS ASUPAN</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginTop: '6px' }}>{dashboardSummary.classCount}</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL MAHASISWA</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginTop: '6px' }}>{dashboardSummary.studentCount}</div>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>MODUL QUEST AKTIF</span>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--cyan-neon)', marginTop: '6px' }}>{dashboardSummary.totalQuests}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left column: list of classes & creation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Create class card */}
          <div className="glass-card">
            <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="var(--cyan)" /> Buat Kelas Praktikum Baru
            </h2>
            <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Nama Kelas (Fisika Dasar A)"
                required
              />
              <button type="submit" className="btn-primary">Buat Kelas</button>
            </form>
          </div>

          {/* Classes list */}
          <div className="glass-card">
            <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--cyan)" /> Daftar Kelas Kelolaan
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {classes.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectClass(c.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: selectedClassId === c.id ? 'rgba(0,162,154,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedClassId === c.id ? 'var(--cyan)' : 'var(--border-glass)'}`,
                    padding: '16px',
                    borderRadius: '12px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{c.studentCount} Mahasiswa</div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--cyan-neon)' }}>
                    Avg: {parseFloat(c.avgQuestsCompleted.toFixed(1))} Quests
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: class details or attention list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {selectedClassDetails ? (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '22px' }}>Detail: {selectedClassDetails.class.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Kode Undangan Kelas: <strong style={{ color: 'var(--cyan-neon)' }}>{selectedClassDetails.class.inviteCode}</strong></p>
                </div>
              </div>

              {/* Assignment Form */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Tugaskan Modul Quest</h3>
                <form onSubmit={handleAssignQuest} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <select 
                    value={assignQuestId} 
                    onChange={(e) => setAssignQuestId(e.target.value)}
                    required
                    style={{ flex: 1, minWidth: '150px' }}
                  >
                    <option value="">Pilih Quest</option>
                    {questsList.map(q => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={assignDeadline}
                    onChange={(e) => setAssignDeadline(e.target.value)}
                    required
                    style={{ width: '160px' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>Tugaskan</button>
                </form>
              </div>

              {/* Students Table */}
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Daftar Mahasiswa</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <th style={{ padding: '12px 8px' }}>Nama</th>
                    <th style={{ padding: '12px 8px' }}>Level</th>
                    <th style={{ padding: '12px 8px' }}>XP</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Quest Selesai</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClassDetails.students.map((student: StudentData) => (
                    <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div>{student.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{student.email}</div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>Lv. {student.level}</td>
                      <td style={{ padding: '12px 8px' }}>{student.xp}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--cyan-neon)' }}>{student.completedQuests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ) : (
            /* Attention list card when no class is selected */
            <div className="glass-card">
              <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} color="var(--red-neon)" /> Siswa Perlu Perhatian (Progress &lt; 30%)
              </h2>
              {needingAttention.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Semua siswa berada dalam progress belajar yang aman.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {needingAttention.map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 59, 48, 0.05)', border: '1px solid rgba(255, 59, 48, 0.2)', padding: '12px', borderRadius: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.className} • {s.email}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--red-neon)', fontWeight: 'bold', fontSize: '14px' }}>{s.completionRate}%</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.completedQuests} Quests</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
