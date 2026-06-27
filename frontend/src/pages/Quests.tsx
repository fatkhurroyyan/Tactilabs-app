import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Search, Filter, Play } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  topic: string;
  xpReward: number;
  orderIndex: number;
  progress: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  };
}

export const Quests: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const user = useAppStore(state => state.user);
  const token = useAppStore(state => state.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchQuests = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/quests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setQuests(data.quests);
          setFilteredQuests(data.quests);
        }
      } catch (error) {
        console.error('Failed to fetch quests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, [user, token, navigate]);

  useEffect(() => {
    let result = quests;

    if (search) {
      result = result.filter(q => 
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (difficultyFilter !== 'ALL') {
      result = result.filter(q => q.difficulty === difficultyFilter);
    }

    setFilteredQuests(result);
  }, [search, difficultyFilter, quests]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat Quests...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen color="var(--cyan)" /> Daftar Modul Pembelajaran
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Pilih tantangan sirkuit Anda dan kumpulkan XP untuk menaikkan level.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px', padding: '16px' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari quest..."
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={16} color="var(--text-secondary)" />
          <select 
            value={difficultyFilter} 
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="ALL">Semua Kesulitan</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Grid of Quests */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredQuests.map((quest) => {
          const isCompleted = quest.progress.status === 'COMPLETED';
          const isLocked = quest.orderIndex > 1 && quests.find(q => q.orderIndex === quest.orderIndex - 1)?.progress.status !== 'COMPLETED';

          return (
            <div 
              key={quest.id} 
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isLocked ? 0.6 : 1,
                pointerEvents: isLocked ? 'none' : 'auto',
                borderTop: isCompleted ? '4px solid #00bcac' : (isLocked ? '4px solid #555' : '4px solid var(--cyan-neon)')
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: quest.difficulty === 'BEGINNER' ? 'rgba(0,162,154,0.15)' : (quest.difficulty === 'INTERMEDIATE' ? 'rgba(255,215,0,0.1)' : 'rgba(255,59,48,0.1)'),
                    color: quest.difficulty === 'BEGINNER' ? 'var(--cyan-neon)' : (quest.difficulty === 'INTERMEDIATE' ? 'var(--gold)' : 'var(--red-neon)')
                  }}>
                    {quest.difficulty}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--cyan-neon)', fontWeight: 'bold' }}>+{quest.xpReward} XP</span>
                </div>

                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'white' }}>{quest.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4', marginBottom: '20px' }}>
                  {quest.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Topik: {quest.topic}</span>
                {isCompleted ? (
                  <span style={{ color: '#00bcac', fontWeight: 'bold', fontSize: '14px' }}>Selesai</span>
                ) : isLocked ? (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Terkunci</span>
                ) : (
                  <Link to={`/quests/${quest.id}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Play size={12} fill="white" /> Mulai
                  </Link>
                )}
              </div>
            </div>

          );
        })}
      </div>
    </div>
  );
};
