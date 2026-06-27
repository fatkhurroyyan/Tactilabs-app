import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Play, Award, HelpCircle } from 'lucide-react';

export const QuestDetail: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const token = useAppStore(state => state.accessToken);

  const [quest, setQuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestDetail = async () => {
      try {
        const res = await fetch(`http://localhost:4002/api/quests/${questId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setQuest(data.quest);
        } else {
          setError(data.message || 'Gagal memuat detail quest.');
        }
      } catch (err) {
        setError('Kesalahan koneksi ke server.');
      } finally {
        setLoading(false);
      }
    };
    if (token && questId) {
      fetchQuestDetail();
    }
  }, [questId, token]);

  if (loading) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Memuat detail quest...
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--red-neon)', marginBottom: '16px' }}>{error || 'Quest tidak ditemukan.'}</p>
        <Link to="/quests" className="btn-secondary">Kembali ke Daftar Quest</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <Link to="/quests" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Kembali ke Library
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 'bold', 
            background: quest.difficulty === 'BEGINNER' ? 'rgba(0,162,154,0.1)' : quest.difficulty === 'INTERMEDIATE' ? 'rgba(217,119,6,0.1)' : 'rgba(186,26,26,0.1)',
            color: quest.difficulty === 'BEGINNER' ? 'var(--cyan)' : quest.difficulty === 'INTERMEDIATE' ? 'var(--gold)' : 'var(--red-neon)',
            padding: '4px 10px',
            borderRadius: '6px',
            textTransform: 'uppercase'
          }}>
            {quest.difficulty}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Topik: {quest.topic}</span>
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{quest.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>{quest.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Left: Quest Steps / Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card">
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Langkah-Langkah Praktikum</h2>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: '1.5' }}>
              {JSON.parse(quest.instructions || '[]').map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {quest.hint && (
            <div className="glass-card" style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <HelpCircle size={20} color="var(--gold)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Petunjuk Pengerjaan</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{quest.hint}</p>
              </div>
            </div>
          )}

        </div>

        {/* Right: Reward Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Award size={48} color="var(--cyan)" />
            <h3 style={{ fontSize: '18px' }}>Imbalan XP & Prestasi</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--cyan-neon)' }}>+{quest.xpReward} XP</div>
          </div>

          <button 
            onClick={() => navigate(`/lab/${quest.id}`)} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
          >
            <Play size={16} fill="white" /> Mulai Praktikum
          </button>
        </div>

      </div>

    </div>
  );
};
