import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Clock, Play, BarChart2 } from 'lucide-react';

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
    attempts: number;
    completedAt: string | null;
  };
}

export const Dashboard: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
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
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setQuests(data.quests);
        }
      } catch (error) {
        console.error('Failed to fetch quests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, [user, token, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Memuat Dashboard Pembelajaran...</p>
      </div>
    );
  }

  // Calculate stats
  const completedCount = quests.filter(q => q.progress.status === 'COMPLETED').length;
  const totalCount = quests.length;
  const currentXP = user?.xp || 0;
  const nextLevelXP = 500; // 500 XP per level
  const xpInCurrentLevel = currentXP % nextLevelXP;
  const progressPercent = Math.min((xpInCurrentLevel / nextLevelXP) * 100, 100);

  // Find next active quest
  const nextQuest = quests.find(q => q.progress.status !== 'COMPLETED');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header Profile Summary - Stitch Spec */}
      <div className="glass-card" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', 
        gap: '40px', 
        alignItems: 'center', 
        marginBottom: '40px',
        borderLeft: '4px solid var(--cyan-neon)'
      }}>
        {/* Left column: profile info */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--cyan) 0%, #00bcac 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 0 20px rgba(0, 162, 154, 0.4)'
          }}>
            {user?.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--cyan-neon)', fontWeight: 'bold', letterSpacing: '0.1em' }}>WELCOME BACK, ARCHITECT</span>
            <h1 style={{ fontSize: '28px', margin: '4px 0 8px', color: 'var(--text-primary)' }}>{user?.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Anda memiliki {currentXP} Total XP • Terus raih XP untuk membuka lencana premium.
            </p>
          </div>
        </div>

        {/* Right column: Circular Level Progress Ring (Stitch Spec) */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'flex-end', borderLeft: window.innerWidth > 768 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none', paddingLeft: window.innerWidth > 768 ? '32px' : '0' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>PROGRES LEVEL</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{xpInCurrentLevel} / {nextLevelXP} XP</div>
            <div style={{ fontSize: '12px', color: 'var(--cyan-neon)', marginTop: '2px' }}>+{nextLevelXP - xpInCurrentLevel} XP untuk naik level</div>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--cyan)" strokeWidth="6"
                      strokeDasharray="263.89" strokeDashoffset={263.89 - (263.89 * progressPercent / 100)}
                      strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.8s ease-in-out', filter: 'drop-shadow(0 0 6px var(--cyan-neon))' }}/>
              <text x="50%" y="45%" textAnchor="middle" fill="var(--text-primary)" fontSize="16px" fontWeight="bold" dy=".3em">Lv.{user?.level}</text>
              <text x="50%" y="68%" textAnchor="middle" fill="var(--cyan-neon)" fontSize="10px" fontWeight="bold" dy=".3em">{progressPercent.toFixed(0)}%</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards Row (Interactive Modules) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>QUESTS COMPLETED</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '6px' }}>{completedCount} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ {totalCount}</span></div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 162, 154, 0.1)', color: 'var(--cyan-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} />
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>ACTIVE STREAK</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '6px' }}>12 <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Hari</span></div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} />
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>BADGES EARNED</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '6px' }}>15 <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Lencana</span></div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(208, 188, 255, 0.1)', color: 'var(--silver)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={20} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Main Quests Section */}
        <div>
          <h2 style={{ fontSize: '22px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--cyan)" /> Library Tantangan Sirkuit
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {quests.map((quest) => {
              const isCompleted = quest.progress.status === 'COMPLETED';
              const isLocked = quest.orderIndex > 1 && quests.find(q => q.orderIndex === quest.orderIndex - 1)?.progress.status !== 'COMPLETED';

              return (
                <div 
                  key={quest.id} 
                  className="glass-card" 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap',
                    gap: '20px',
                    opacity: isLocked ? 0.6 : 1,
                    pointerEvents: isLocked ? 'none' : 'auto',
                    borderLeft: isCompleted ? '4px solid #00bcac' : (isLocked ? '4px solid #555' : '4px solid var(--cyan-neon)')
                  }}
                >
                  <div style={{ flex: '1' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
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
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>• {quest.topic}</span>
                    </div>

                    <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>{quest.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>{quest.description}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--cyan-neon)', fontWeight: 'bold' }}>+{quest.xpReward} XP</span>
                    </div>

                    {isCompleted ? (
                      <span style={{
                        background: 'rgba(0, 188, 172, 0.1)',
                        color: '#00bcac',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        Selesai
                      </span>
                    ) : isLocked ? (
                      <span style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-secondary)',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        Terkunci
                      </span>
                    ) : (
                      <Link to={`/lab/${quest.id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                        <Play size={14} fill="white" /> Mulai Lab
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Focus (Next active target) */}
        <div>
          {nextQuest && (
            <div className="glass-card" style={{ border: '1px solid rgba(0, 255, 216, 0.3)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--cyan-neon)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Clock size={16} /> QUEST BERIKUTNYA
              </h3>
              <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>{nextQuest.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4', marginBottom: '20px' }}>
                {nextQuest.description}
              </p>
              <Link to={`/lab/${nextQuest.id}`} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '8px' }}>
                Mulai Dikerjakan
              </Link>
            </div>
          )}

          {/* Quick link rules card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BarChart2 size={16} color="var(--cyan)" /> Tips Praktikum Phygital
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <li>🔌 Hubungkan catu daya baterai 5V paling akhir untuk menjaga keamanan sirkuit.</li>
              <li>💡 Resistor diletakkan sebelum LED untuk membatasi laju elektron dan menjaga LED tidak terbakar.</li>
              <li>🔄 Gunakan filter pencarian quest jika ingin mengeksplor topik tertentu.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
