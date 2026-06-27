import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Clock, Play, BarChart2, Award, Zap, ChevronRight, Compass } from 'lucide-react';

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animotion-flowing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Memuat Dashboard Pembelajaran...</p>
      </div>
    );
  }

  const completedCount = quests.filter(q => q.progress.status === 'COMPLETED').length;
  const totalCount = quests.length;
  const currentXP = user?.xp || 0;
  const nextLevelXP = 500;
  const xpInCurrentLevel = currentXP % nextLevelXP;
  const progressPercent = Math.min((xpInCurrentLevel / nextLevelXP) * 100, 100);

  const nextQuest = quests.find(q => q.progress.status !== 'COMPLETED');

  return (
    <div style={{ position: 'relative', minHeight: '90vh', overflow: 'hidden' }}>
      {/* Dynamic Background Glow Effect */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 162, 154, 0.05) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0, 162, 154, 0.03) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        
        {/* Header Profile Summary (Asymmetric Glassmorphic Widget) */}
        <div className="glass-card animotion-glow-pulse" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1.2fr)', 
          gap: '32px', 
          alignItems: 'center', 
          marginBottom: '40px',
          padding: '32px',
          background: 'rgba(252, 252, 251, 0.75)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
        }}>
          {/* Profile details */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              {/* Outer pulsing ring */}
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                borderRadius: '50%',
                border: '2px solid rgba(0, 162, 154, 0.3)',
                animation: 'animotion-pulse 2s infinite ease-in-out'
              }} />
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--cyan) 0%, #00d2c4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: '800',
                color: 'white',
                boxShadow: '0 8px 24px rgba(0, 162, 154, 0.35)',
                fontFamily: 'var(--font-heading)'
              }}>
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '11px', color: 'var(--cyan-neon)', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                WELCOME BACK, ARCHITECT
              </span>
              <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.03em', margin: '4px 0 8px', color: 'var(--text-primary)' }}>
                {user?.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                Kumpulkan <strong style={{ color: 'var(--text-primary)' }}>{currentXP} XP</strong> di platform dan selesaikan tantangan untuk meraih predikat jawara kelas!
              </p>
            </div>
          </div>

          {/* Level Tracker Ring */}
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            borderLeft: '1px solid var(--border-glass)', 
            paddingLeft: '32px' 
          }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.05em' }}>PROGRES LEVEL</span>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {xpInCurrentLevel} / {nextLevelXP} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>XP</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--cyan-neon)', fontWeight: '600', marginTop: '2px' }}>
                {nextLevelXP - xpInCurrentLevel} XP menuju Lv.{ (user?.level || 1) + 1 }
              </div>
            </div>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="6"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#progress-gradient)" strokeWidth="6"
                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progressPercent / 100)}
                        strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 4px rgba(0, 162, 154, 0.4))' }}/>
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--cyan)" />
                    <stop offset="100%" stopColor="#00d2c4" />
                  </linearGradient>
                </defs>
                <text x="50%" y="46%" textAnchor="middle" fill="var(--text-primary)" fontSize="15px" fontWeight="800" dy=".3em" fontFamily="var(--font-heading)">Lv.{user?.level}</text>
                <text x="50%" y="68%" textAnchor="middle" fill="var(--cyan-neon)" fontSize="10px" fontWeight="800" dy=".3em">{progressPercent.toFixed(0)}%</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Summary Cards (Interactive Glassmorphic modules) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          
          {/* Card 1 */}
          <div className="glass-card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '24px',
            background: 'rgba(252, 252, 251, 0.8)',
            borderRadius: '16px',
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 162, 154, 0.1)';
            e.currentTarget.style.borderColor = 'var(--cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--border-glass)';
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.05em' }}>QUEST SELESAI</span>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-heading)' }}>
                {completedCount} <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>/ {totalCount}</span>
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0, 162, 154, 0.08)', color: 'var(--cyan-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 162, 154, 0.05)' }}>
              <BookOpen size={22} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '24px',
            background: 'rgba(252, 252, 251, 0.8)',
            borderRadius: '16px',
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(217, 119, 6, 0.1)';
            e.currentTarget.style.borderColor = 'var(--gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--border-glass)';
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.05em' }}>STREAK BELAJAR</span>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-heading)' }}>
                12 <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Hari</span>
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(217, 119, 6, 0.08)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.05)' }}>
              <Zap size={22} fill="var(--gold)" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '24px',
            background: 'rgba(252, 252, 251, 0.8)',
            borderRadius: '16px',
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.1)';
            e.currentTarget.style.borderColor = '#7c3aed';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--border-glass)';
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.05em' }}>BADGE DIRENTAK</span>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-heading)' }}>
                15 <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>Lencana</span>
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(124, 58, 237, 0.08)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.05)' }}>
              <Award size={22} />
            </div>
          </div>

        </div>

        {/* Main Content Grid (Asymmetric layout) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '36px', alignItems: 'start' }}>
          
          {/* Left Column: Challenge Library */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
              <Compass size={24} color="var(--cyan)" /> Library Tantangan Sirkuit
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
                      gap: '24px',
                      padding: '28px',
                      opacity: isLocked ? 0.55 : 1,
                      pointerEvents: isLocked ? 'none' : 'auto',
                      background: isCompleted ? 'rgba(252, 252, 251, 0.6)' : 'rgba(252, 252, 251, 0.85)',
                      borderLeft: isCompleted ? '5px solid #00bcac' : (isLocked ? '5px solid #747878' : '5px solid var(--cyan-neon)'),
                      boxShadow: isCompleted ? 'none' : '0 4px 20px rgba(0,0,0,0.01)',
                      transition: 'var(--transition-smooth)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLocked) {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 162, 154, 0.05)';
                        e.currentTarget.style.borderColor = isCompleted ? '#00bcac' : 'var(--cyan)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLocked) {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = isCompleted ? 'none' : '0 4px 20px rgba(0,0,0,0.01)';
                        e.currentTarget.style.borderColor = isCompleted ? '#00bcac' : 'var(--cyan-neon)';
                      }
                    }}
                  >
                    <div style={{ flex: '1', minWidth: '240px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          letterSpacing: '0.05em',
                          padding: '4px 10px',
                          borderRadius: '30px',
                          background: quest.difficulty === 'BEGINNER' ? 'rgba(0,162,154,0.1)' : (quest.difficulty === 'INTERMEDIATE' ? 'rgba(217,119,6,0.1)' : 'rgba(186,26,26,0.1)'),
                          color: quest.difficulty === 'BEGINNER' ? 'var(--cyan-neon)' : (quest.difficulty === 'INTERMEDIATE' ? 'var(--gold)' : 'var(--red-neon)')
                        }}>
                          {quest.difficulty}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>• {quest.topic.replace('_', ' ')}</span>
                      </div>

                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                        {quest.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                        {quest.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--cyan-neon)', fontWeight: '800', fontSize: '15px', fontFamily: 'var(--font-mono)' }}>+{quest.xpReward} XP</span>
                      </div>

                      {isCompleted ? (
                        <span style={{
                          background: 'rgba(0, 188, 172, 0.08)',
                          color: '#00bcac',
                          padding: '12px 24px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '13px',
                          border: '1px solid rgba(0, 188, 172, 0.2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          Selesai
                        </span>
                      ) : isLocked ? (
                        <span style={{
                          background: 'rgba(0,0,0,0.02)',
                          color: 'var(--text-secondary)',
                          padding: '12px 24px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '13px',
                          border: '1px solid var(--border-glass)'
                        }}>
                          Terkunci
                        </span>
                      ) : (
                        <Link to={`/lab/${quest.id}`} className="btn-primary" style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          fontSize: '13px',
                          padding: '12px 24px',
                          borderRadius: '10px',
                          boxShadow: '0 4px 12px rgba(0, 162, 154, 0.25)',
                          background: 'linear-gradient(135deg, #000 0%, #1e1e1e 100%)',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 162, 154, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 162, 154, 0.25)';
                        }}>
                          <Play size={12} fill="white" /> <span>Mulai Lab</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Focus & Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Highlighted next active quest */}
            {nextQuest && (
              <div className="glass-card animotion-glow-pulse" style={{ 
                border: '1px solid rgba(0, 162, 154, 0.3)', 
                background: 'rgba(252, 252, 251, 0.85)',
                borderRadius: '20px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Visual accent backdrop glow */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '100px',
                  height: '100px',
                  background: 'radial-gradient(circle, rgba(0, 162, 154, 0.15) 0%, rgba(0,0,0,0) 70%)',
                  zIndex: 0,
                  pointerEvents: 'none'
                }} />

                <h3 style={{ fontSize: '12px', color: 'var(--cyan-neon)', fontWeight: '800', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', zIndex: 1, position: 'relative' }}>
                  <Clock size={16} /> QUEST BERIKUTNYA
                </h3>
                <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.02em', zIndex: 1, position: 'relative' }}>
                  {nextQuest.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', zIndex: 1, position: 'relative' }}>
                  {nextQuest.description}
                </p>
                <Link to={`/lab/${nextQuest.id}`} className="btn-primary" style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  width: '100%', 
                  gap: '8px',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '14px',
                  background: 'linear-gradient(135deg, var(--cyan) 0%, #00bcac 100%)',
                  boxShadow: '0 4px 14px rgba(0, 162, 154, 0.35)',
                  zIndex: 1,
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 162, 154, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 162, 154, 0.35)';
                }}>
                  <span>Mulai Dikerjakan</span> <ChevronRight size={16} />
                </Link>
              </div>
            )}

            {/* Quick tips list module */}
            <div className="glass-card" style={{ 
              background: 'rgba(252, 252, 251, 0.8)',
              borderRadius: '20px',
              padding: '28px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', letterSpacing: '-0.01em' }}>
                <BarChart2 size={18} color="var(--cyan)" /> Tips Praktikum Phygital
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', padding: 0 }}>
                <li style={{ display: 'flex', gap: '10px', lineHeight: '1.5' }}>
                  <span style={{ color: 'var(--cyan-neon)', fontWeight: 'bold' }}>🔌</span>
                  <span>Hubungkan catu daya baterai 5V paling akhir untuk menjaga keamanan sirkuit dari hubungan pendek.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', lineHeight: '1.5' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>💡</span>
                  <span>Resistor diletakkan sebelum LED untuk membatasi laju elektron dan menjaga LED tidak terbakar.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', lineHeight: '1.5' }}>
                  <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>🔄</span>
                  <span>Gunakan filter pencarian quest jika ingin mengeksplor topik tertentu secara fokus.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
