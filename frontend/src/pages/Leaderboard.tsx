import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Trophy, Users, Globe } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  institutionName: string;
}

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [scope, setScope] = useState<'global' | 'institution'>('global');
  const [loading, setLoading] = useState(true);

  const currentUser = useAppStore(state => state.user);
  const token = useAppStore(state => state.accessToken);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const url = scope === 'institution' && currentUser?.institutionId
          ? `http://localhost:4002/api/leaderboard?scope=institution&institutionId=${currentUser.institutionId}`
          : 'http://localhost:4002/api/leaderboard?scope=global';

        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [scope, token, currentUser]);

  const topThree = leaderboard.slice(0, 3);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header and Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Trophy color="var(--gold)" /> Papan Peringkat Pioneer
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Lihat persaingan belajar dan peringkat XP Anda saat ini.</p>
        </div>

        {/* Filter Toggle */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-glass)',
          padding: '4px',
          borderRadius: '30px'
        }}>
          <button
            onClick={() => setScope('global')}
            style={{
              background: scope === 'global' ? 'var(--cyan)' : 'transparent',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Globe size={14} /> Global
          </button>
          <button
            onClick={() => setScope('institution')}
            style={{
              background: scope === 'institution' ? 'var(--cyan)' : 'transparent',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            disabled={!currentUser?.institutionId}
          >
            <Users size={14} /> Institusi
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Memuat peringkat...</p>
        </div>
      ) : (
        <>
          {/* Podium for top 3 */}
          {topThree.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-end', 
              gap: '24px', 
              marginBottom: '48px',
              paddingTop: '40px',
              flexWrap: 'wrap'
            }}>
              
              {/* Rank 2 (Left) */}
              {topThree[1] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--silver)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    border: '3px solid #e0e0e0',
                    boxShadow: '0 0 15px rgba(224, 224, 224, 0.4)',
                    marginBottom: '12px'
                  }}>
                    2
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '600', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topThree[1].name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{topThree[1].xp} XP</div>
                  <div style={{ height: '80px', width: '100px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderBottom: 'none', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', marginTop: '12px' }} />
                </div>
              )}

              {/* Rank 1 (Center) */}
              {topThree[0] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-15px)' }}>
                  <div style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '32px',
                    border: '4px solid #fff275',
                    boxShadow: '0 0 25px rgba(255, 215, 0, 0.6)',
                    marginBottom: '12px'
                  }}>
                    1
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 'bold', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topThree[0].name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--cyan-neon)', fontWeight: '600' }}>{topThree[0].xp} XP</div>
                  <div style={{ height: '110px', width: '120px', background: 'rgba(0, 162, 154, 0.1)', border: '1px solid rgba(0, 162, 154, 0.3)', borderBottom: 'none', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', marginTop: '12px' }} />
                </div>
              )}

              {/* Rank 3 (Right) */}
              {topThree[2] && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--bronze)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    border: '3px solid #d2b48c',
                    boxShadow: '0 0 15px rgba(205, 127, 50, 0.4)',
                    marginBottom: '12px'
                  }}>
                    3
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '600', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {topThree[2].name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{topThree[2].xp} XP</div>
                  <div style={{ height: '60px', width: '100px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderBottom: 'none', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', marginTop: '12px' }} />
                </div>
              )}

            </div>
          )}

          {/* Table Leaderboard */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '16px 24px' }}>Rank</th>
                  <th style={{ padding: '16px 24px' }}>Nama</th>
                  <th style={{ padding: '16px 24px' }}>Institusi</th>
                  <th style={{ padding: '16px 24px' }}>Level</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Total XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((u) => {
                  const isCurrent = u.id === currentUser?.id;
                  return (
                    <tr 
                      key={u.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        background: isCurrent ? 'rgba(0, 162, 154, 0.06)' : 'transparent',
                        fontWeight: isCurrent ? 'bold' : 'normal',
                        borderLeft: isCurrent ? '4px solid var(--cyan-neon)' : 'none'
                      }}
                    >
                      <td style={{ padding: '16px 24px', color: isCurrent ? 'var(--cyan-neon)' : 'var(--text-secondary)' }}>#{u.rank}</td>
                      <td style={{ padding: '16px 24px' }}>{u.name} {isCurrent && ' (Anda)'}</td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{u.institutionName}</td>
                      <td style={{ padding: '16px 24px' }}>Lv. {u.level}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--cyan-neon)' }}>{u.xp} XP</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
};
