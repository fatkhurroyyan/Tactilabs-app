import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BookOpen, Clock, Play, BarChart2, Award, Zap, ChevronRight, Compass, Lightbulb, RefreshCw, Lock, Check, X } from 'lucide-react';

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
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  
  const user = useAppStore(state => state.user);
  const token = useAppStore(state => state.accessToken);
  const logout = useAppStore(state => state.logout);
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
        
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }

        const data = await response.json();
        if (response.ok) {
          // Sort quests by orderIndex to keep path chronological
          const sortedQuests = data.quests.sort((a: Quest, b: Quest) => a.orderIndex - b.orderIndex);
          setQuests(sortedQuests);
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

  // Find node coordinates
  // Nodes will alternate horizontally: left: 30%, 70%, 30%, 70%...
  const nodePositions = quests.map((q, idx) => {
    const x = idx % 2 === 0 ? 30 : 70;
    const y = 80 + idx * 160;
    return { x, y, quest: q };
  });

  // Build SVG path coordinate strings
  const pathD = nodePositions.map((node, idx) => (idx === 0 ? `M ${node.x}% ${node.y}` : `L ${node.x}% ${node.y}`)).join(' ');

  // Active path traces up to the active (first uncompleted) quest
  const activeNodes = [];
  for (let i = 0; i < nodePositions.length; i++) {
    activeNodes.push(nodePositions[i]);
    if (nodePositions[i].quest.progress.status !== 'COMPLETED') {
      break;
    }
  }
  const activePathD = activeNodes.map((node, idx) => (idx === 0 ? `M ${node.x}% ${node.y}` : `L ${node.x}% ${node.y}`)).join(' ');

  // Find details of currently selected node position
  const selectedNodePos = nodePositions.find(n => n.quest.id === selectedQuest?.id);

  return (
    <div style={{ position: 'relative', minHeight: '90vh', overflow: 'hidden', paddingBottom: '80px' }}>
      
      {/* Dynamic Ambient Background Glows */}
      <div style={{
        position: 'absolute',
        top: '-5%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 162, 154, 0.04) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        
        {/* Profile Card Header (Clean & Minimalist, No Glowing green box shadow) */}
        <div className="glass-card" style={{ 
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
          boxShadow: '0 20px 40px rgba(0,0,0,0.02)',
        }}>
          {/* Left details */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--cyan) 0%, #00d2c4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 8px 20px rgba(0, 162, 154, 0.25)',
              fontFamily: 'var(--font-heading)'
            }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                WELCOME BACK, ARCHITECT
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', margin: '4px 0 6px', color: 'var(--text-primary)' }}>
                {user?.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                Level up sirkuit Anda! Selesaikan tantangan phygital berikutnya untuk meraih badge berharga.
              </p>
            </div>
          </div>

          {/* Right level ring */}
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
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {xpInCurrentLevel} / {nextLevelXP} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>XP</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--cyan-neon)', fontWeight: '600', marginTop: '2px' }}>
                {nextLevelXP - xpInCurrentLevel} XP menuju Lv.{ (user?.level || 1) + 1 }
              </div>
            </div>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="84" height="84" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="6"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#progress-grad)" strokeWidth="6"
                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progressPercent / 100)}
                        strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}/>
                <defs>
                  <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
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

        {/* Asymmetric Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* LEFT: Gamified Roadmap Path (Skill Tree) */}
          <div className="glass-card" style={{ 
            padding: '40px 24px',
            background: 'rgba(252, 252, 251, 0.65)',
            borderRadius: '24px',
            position: 'relative'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '40px', textAlign: 'center', color: 'var(--text-primary)' }}>
              Peta Jalan Sirkuit Phygital
            </h2>

            {/* Tree Path Container */}
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: `${quests.length * 160 + 80}px`,
              margin: '0 auto'
            }}>
              {/* SVG connection lines with flow indicator */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
                {quests.length > 1 && (
                  <>
                    {/* Inactive track */}
                    <path d={pathD} fill="none" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Active flowing track */}
                    <path d={activePathD} fill="none" stroke="var(--cyan)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 12" className="animate-electron-flow" style={{ filter: 'drop-shadow(0 0 3px rgba(0, 162, 154, 0.4))' }} />
                  </>
                )}
              </svg>

              {/* Quest Nodes */}
              {nodePositions.map((node, idx) => {
                const quest = node.quest;
                const isCompleted = quest.progress.status === 'COMPLETED';
                const isLocked = quest.orderIndex > 1 && quests.find(q => q.orderIndex === quest.orderIndex - 1)?.progress.status !== 'COMPLETED';
                const isActive = !isCompleted && !isLocked;

                // Pick theme based on difficulty
                let colorGradients = 'linear-gradient(135deg, #a1a1aa 0%, #71717a 100%)'; // locked
                let nodeBorder = '3px solid rgba(255,255,255,0.8)';
                let iconColor = '#ffffff';

                if (isCompleted) {
                  colorGradients = 'linear-gradient(135deg, #00bcac 0%, #00968b 100%)';
                  nodeBorder = '3px solid rgba(255,255,255,0.8)';
                } else if (isActive) {
                  if (quest.difficulty === 'BEGINNER') {
                    colorGradients = 'linear-gradient(135deg, var(--cyan) 0%, #00d2c4 100%)';
                  } else if (quest.difficulty === 'INTERMEDIATE') {
                    colorGradients = 'linear-gradient(135deg, var(--gold) 0%, #f59e0b 100%)';
                  } else {
                    colorGradients = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
                  }
                  nodeBorder = '3px solid var(--text-primary)';
                }

                return (
                  <div 
                    key={quest.id}
                    style={{
                      position: 'absolute',
                      left: `${node.x}%`,
                      top: `${node.y}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 3,
                    }}
                  >
                    <button 
                      onClick={() => setSelectedQuest(selectedQuest?.id === quest.id ? null : quest)}
                      style={{
                        width: isActive ? '72px' : '64px',
                        height: isActive ? '72px' : '64px',
                        borderRadius: '50%',
                        background: colorGradients,
                        border: nodeBorder,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        boxShadow: isActive 
                          ? '0 10px 20px rgba(0, 162, 154, 0.25)' 
                          : '0 4px 12px rgba(0,0,0,0.06)',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s',
                        zIndex: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        if (isActive) {
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 162, 154, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = isActive 
                          ? '0 10px 20px rgba(0, 162, 154, 0.25)' 
                          : '0 4px 12px rgba(0,0,0,0.06)';
                      }}
                    >
                      {isCompleted ? (
                        <Check size={26} color={iconColor} strokeWidth={3} />
                      ) : isLocked ? (
                        <Lock size={22} color="rgba(255,255,255,0.7)" />
                      ) : (
                        quest.difficulty === 'BEGINNER' ? (
                          <Zap size={26} color={iconColor} fill={iconColor} />
                        ) : quest.difficulty === 'INTERMEDIATE' ? (
                          <Compass size={26} color={iconColor} />
                        ) : (
                          <Award size={26} color={iconColor} />
                        )
                      )}
                    </button>

                    {/* Simple indicator text under node */}
                    <div style={{
                      position: 'absolute',
                      top: isActive ? '80px' : '72px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}>
                      {quest.title.split(':')[0]}
                    </div>
                  </div>
                );
              })}

              {/* Floating Node Popover Details (Glassmorphic) */}
              {selectedQuest && selectedNodePos && (
                <div className="glass-card" style={{
                  position: 'absolute',
                  left: `${selectedNodePos.x}%`,
                  top: `${selectedNodePos.y - 76}px`,
                  transform: 'translate(-50%, -100%)',
                  width: '290px',
                  zIndex: 10,
                  padding: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  background: 'rgba(252, 252, 251, 0.98)',
                  borderRadius: '20px',
                  animation: 'animotion-fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {/* Arrow decoration */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid rgba(252, 252, 251, 0.98)',
                  }} />

                  {/* Header info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '0.05em',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: selectedQuest.difficulty === 'BEGINNER' ? 'rgba(0,162,154,0.1)' : (selectedQuest.difficulty === 'INTERMEDIATE' ? 'rgba(217,119,6,0.1)' : 'rgba(186,26,26,0.1)'),
                      color: selectedQuest.difficulty === 'BEGINNER' ? 'var(--cyan-neon)' : (selectedQuest.difficulty === 'INTERMEDIATE' ? 'var(--gold)' : 'var(--red-neon)')
                    }}>
                      {selectedQuest.difficulty}
                    </span>
                    <button 
                      onClick={() => setSelectedQuest(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em', lineHeight: '1.3' }}>
                    {selectedQuest.title}
                  </h3>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
                    {selectedQuest.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Reward</span>
                      <strong style={{ color: 'var(--cyan-neon)', fontSize: '15px', fontFamily: 'var(--font-mono)' }}>+{selectedQuest.xpReward} XP</strong>
                    </div>

                    {selectedQuest.progress.status === 'COMPLETED' ? (
                      <span style={{
                        background: 'rgba(0, 188, 172, 0.08)',
                        color: '#00bcac',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '12px',
                        border: '1px solid rgba(0, 188, 172, 0.2)'
                      }}>
                        Selesai
                      </span>
                    ) : selectedQuest.orderIndex > 1 && quests.find(q => q.orderIndex === selectedQuest.orderIndex - 1)?.progress.status !== 'COMPLETED' ? (
                      <span style={{
                        background: 'rgba(0,0,0,0.02)',
                        color: 'var(--text-secondary)',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '12px',
                        border: '1px solid var(--border-glass)'
                      }}>
                        Terkunci
                      </span>
                    ) : (
                      <Link to={`/lab/${selectedQuest.id}`} className="btn-primary" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #000 0%, #1e1e1e 100%)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}>
                        <Play size={10} fill="white" /> <span>Buka Lab</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT: Stacked stats and tips sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Stats Summary Vertical Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Stat card 1 */}
              <div className="glass-card" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '24px',
                background: 'rgba(252, 252, 251, 0.8)',
                borderRadius: '16px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.05em' }}>QUEST SELESAI</span>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
                    {completedCount} <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '500' }}>/ {totalCount}</span>
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0, 162, 154, 0.08)', color: 'var(--cyan-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} />
                </div>
              </div>

              {/* Stat card 2 */}
              <div className="glass-card" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '24px',
                background: 'rgba(252, 252, 251, 0.8)',
                borderRadius: '16px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.05em' }}>STREAK BELAJAR</span>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
                    12 <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '500' }}>Hari</span>
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.08)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} fill="var(--gold)" />
                </div>
              </div>

              {/* Stat card 3 */}
              <div className="glass-card" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '24px',
                background: 'rgba(252, 252, 251, 0.8)',
                borderRadius: '16px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.05em' }}>BADGE DIRENTAK</span>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
                    15 <span style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '500' }}>Lencana</span>
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.08)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} />
                </div>
              </div>

            </div>

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
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', lineHeight: '1.5' }}>
                  <Zap size={16} color="var(--cyan-neon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Hubungkan catu daya baterai 5V paling akhir untuk menjaga keamanan sirkuit dari hubungan pendek.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', lineHeight: '1.5' }}>
                  <Lightbulb size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Resistor diletakkan sebelum LED untuk membatasi laju elektron dan menjaga LED tidak terbakar.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', lineHeight: '1.5' }}>
                  <RefreshCw size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
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
