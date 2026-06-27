import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ArrowLeft, Users, Mail, Award, Clock } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  completedQuests: number;
}

export const ClassDetail: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const token = useAppStore(state => state.accessToken);

  const [classDetails, setClassDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClassDetails = async () => {
    try {
      const res = await fetch(`http://localhost:4002/api/educator/classes/${classId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setClassDetails(data);
      } else {
        setError(data.message || 'Gagal memuat detail kelas.');
      }
    } catch (err) {
      setError('Kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && classId) {
      fetchClassDetails();
    }
  }, [token, classId]);

  if (loading) {
    return <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat data kelas...</div>;
  }

  if (error || !classDetails) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--red-neon)', marginBottom: '16px' }}>{error || 'Kelas tidak ditemukan.'}</p>
        <Link to="/educator/classes" className="btn-secondary">Kembali ke Daftar Kelas</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <Link to="/educator/classes" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Kembali ke Kelas
        </Link>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{classDetails.class.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Kode Undangan Kelas: <strong style={{ color: 'var(--cyan-neon)' }}>{classDetails.class.inviteCode}</strong></p>
      </div>

      <div className="glass-card">
        <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="var(--cyan)" /> Daftar Mahasiswa Terdaftar
        </h2>

        {classDetails.students.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Belum ada mahasiswa yang bergabung di kelas ini.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '12px 8px' }}>Nama</th>
                <th style={{ padding: '12px 8px' }}>Level</th>
                <th style={{ padding: '12px 8px' }}>Total XP</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Quest Selesai</th>
              </tr>
            </thead>
            <tbody>
              {classDetails.students.map((student: StudentData) => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ fontWeight: 'bold' }}>{student.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{student.email}</div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>Lv. {student.level}</td>
                  <td style={{ padding: '12px 8px' }}>{student.xp}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--cyan-neon)', fontWeight: 'bold' }}>{student.completedQuests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
