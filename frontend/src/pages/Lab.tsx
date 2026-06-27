import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { CircuitCanvas } from '../components/CircuitCanvas';
import { RotateCcw, AlertOctagon, CheckCircle2, ArrowLeft, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuestDetail {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  xpReward: number;
  circuitConfig: {
    components: string[];
    validation: {
      minCurrentMA?: number;
      maxCurrentMA?: number;
      minVoltageV?: number;
      maxVoltageV?: number;
    };
  };
  instructions: string[];
  hint?: string;
}

export const Lab: React.FC = () => {
  const { questId } = useParams<{ questId?: string }>();
  const navigate = useNavigate();
  
  const user = useAppStore(state => state.user);
  const token = useAppStore(state => state.accessToken);
  const sensorData = useAppStore(state => state.sensorData);
  const connectSocket = useAppStore(state => state.connectSocket);
  const disconnectSocket = useAppStore(state => state.disconnectSocket);
  const updateCircuitStateInHardware = useAppStore(state => state.updateCircuitStateInHardware);
  const updateUserStats = useAppStore(state => state.updateUserStats);

  const [quest, setQuest] = useState<QuestDetail | null>(null);
  const [successChecked, setSuccessChecked] = useState(false);
  const [celebration, setCelebration] = useState<{ xpGained: number; newLevel: number } | null>(null);

  // Initialize socket connections
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Connect user socket
    connectSocket(user.id, questId);

    // Fetch quest information if in Quest Mode
    if (questId) {
      const fetchQuest = async () => {
        try {
          const response = await fetch(`http://localhost:4002/api/quests/${questId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setQuest(data.quest);
          }
        } catch (error) {
          console.error('Error fetching quest:', error);
        }
      };
      fetchQuest();
    }

    return () => {
      disconnectSocket();
    };
  }, [questId, user, connectSocket, disconnectSocket, navigate, token]);

  // Check quest completion criteria against current sensor data
  useEffect(() => {
    if (!quest || !sensorData || successChecked) return;

    const { validation } = quest.circuitConfig;
    const { voltage, current, components } = sensorData;

    // Verify components list matches target configuration
    const componentsMatch = quest.circuitConfig.components.every(comp => components.includes(comp));
    
    let statsMatch = true;
    if (validation.minCurrentMA !== undefined && current < validation.minCurrentMA) statsMatch = false;
    if (validation.maxCurrentMA !== undefined && current > validation.maxCurrentMA) statsMatch = false;
    if (validation.minVoltageV !== undefined && voltage < validation.minVoltageV) statsMatch = false;
    if (validation.maxVoltageV !== undefined && voltage > validation.maxVoltageV) statsMatch = false;

    if (componentsMatch && statsMatch && sensorData.isComplete) {
      setSuccessChecked(true);
      triggerQuestSuccess();
    }
  }, [sensorData, quest, successChecked]);

  const triggerQuestSuccess = async () => {
    if (!questId || !token) return;

    // Confetti effect burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    try {
      const response = await fetch(`http://localhost:4002/api/quests/${questId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'COMPLETED',
          timeSpentSeconds: 60, // Mock time spent
          sensorDataSnapshot: sensorData
        })
      });

      const data = await response.json();
      if (response.ok) {
        // Update user stats locally
        if (data.rewards) {
          updateUserStats(data.rewards.newXp, data.rewards.newLevel);
          setCelebration({
            xpGained: data.rewards.xpGained,
            newLevel: data.rewards.newLevel
          });
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Simulation controls helpers (inject virtual state stream)
  const addComponentVirtual = (comp: string) => {
    if (!sensorData) return;
    const currentList = [...sensorData.components];
    if (!currentList.includes(comp)) {
      currentList.push(comp);
      updateCircuitStateInHardware(sensorData.state, currentList);
    }
  };

  const removeComponentVirtual = (comp: string) => {
    if (!sensorData) return;
    const currentList = sensorData.components.filter(c => c !== comp);
    updateCircuitStateInHardware(sensorData.state, currentList);
  };

  const toggleShortCircuit = () => {
    if (!sensorData) return;
    const nextState = sensorData.state === 'SHORT_CIRCUIT' ? 'CONNECTED' : 'SHORT_CIRCUIT';
    updateCircuitStateInHardware(nextState, sensorData.components);
  };

  const resetCircuit = () => {
    updateCircuitStateInHardware('CONNECTED', ['BATTERY']);
    setSuccessChecked(false);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={18} /> Kembali ke Dashboard
        </button>
        {quest && (
          <h1 style={{ fontSize: '20px', color: 'white' }}>Quest: {quest.title}</h1>
        )}
      </div>

      {/* Lab Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) 1.2fr', gap: '24px', alignItems: 'stretch' }}>
        
        {/* Three.js Circuit Area */}
        <div className="glass-card" style={{ padding: '0', height: '60vh', position: 'relative' }}>
          <CircuitCanvas
            components={sensorData?.components || ['BATTERY']}
            current={sensorData?.current || 0}
            circuitState={sensorData?.state || 'CONNECTED'}
          />
        </div>

        {/* Info panel & controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Real-time metrics readouts */}
          <div className="glass-card">
            <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px', letterSpacing: '0.05em' }}>DATA KELISTRIKAN SENSOR</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(10, 25, 41, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TEGANGAN (V)</span>
                <div style={{ fontSize: '28px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--cyan-neon)', marginTop: '4px' }}>
                  {sensorData?.voltage || '0.00'} V
                </div>
              </div>
              <div style={{ background: 'rgba(10, 25, 41, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ARUS (mA)</span>
                <div style={{ fontSize: '28px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: sensorData?.state === 'SHORT_CIRCUIT' ? 'var(--red-neon)' : 'var(--cyan-neon)', marginTop: '4px' }}>
                  {sensorData?.current || '0.0'} mA
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(10, 25, 41, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>DAYA (mW)</span>
              <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'white', marginTop: '4px' }}>
                {sensorData?.power || '0.0'} mW
              </div>
            </div>
          </div>

          {/* Interactive virtual board options */}
          <div className="glass-card">
            <h3 style={{ fontSize: '15px', color: 'white', marginBottom: '14px' }}>Simulator Rangkaian Offline</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => addComponentVirtual('RESISTOR')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  disabled={sensorData?.components.includes('RESISTOR')}
                >
                  + Resistor
                </button>
                <button 
                  onClick={() => addComponentVirtual('LED')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  disabled={sensorData?.components.includes('LED')}
                >
                  + LED
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => removeComponentVirtual('RESISTOR')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  disabled={!sensorData?.components.includes('RESISTOR')}
                >
                  - Resistor
                </button>
                <button 
                  onClick={() => removeComponentVirtual('LED')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                  disabled={!sensorData?.components.includes('LED')}
                >
                  - LED
                </button>
              </div>

              <button 
                onClick={toggleShortCircuit}
                className="btn-secondary" 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  fontSize: '12px',
                  borderColor: sensorData?.state === 'SHORT_CIRCUIT' ? 'var(--red-neon)' : 'var(--border-glass)',
                  color: sensorData?.state === 'SHORT_CIRCUIT' ? 'var(--red-neon)' : 'white'
                }}
              >
                <AlertOctagon size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                {sensorData?.state === 'SHORT_CIRCUIT' ? 'Buka Proteksi Short' : 'Simulasi Korsleting (Short)'}
              </button>

              <button 
                onClick={resetCircuit}
                className="btn-secondary" 
                style={{ width: '100%', padding: '8px', fontSize: '12px' }}
              >
                <RotateCcw size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Reset Sirkuit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Guide & instructions bottom panel */}
      {quest && (
        <div className="glass-card" style={{ marginTop: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            <div>
              <h2 style={{ fontSize: '18px', color: 'var(--cyan-neon)', marginBottom: '12px' }}>Instruksi Misi</h2>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                {quest.instructions.map((inst, index) => (
                  <li key={index}>{inst}</li>
                ))}
              </ol>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '32px' }}>
              <h2 style={{ fontSize: '18px', color: 'white', marginBottom: '12px' }}>Kriteria Keberhasilan</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: sensorData?.components.includes('RESISTOR') ? '#00bcac' : 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} /> Resistor Terpasang
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: sensorData?.components.includes('LED') ? '#00bcac' : 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} /> LED Terpasang
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: sensorData?.isComplete ? '#00bcac' : 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} /> Rangkaian Tertutup & Menyala
                </div>
              </div>

              {quest.hint && (
                <div style={{ marginTop: '24px', background: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <strong>Petunjuk:</strong> {quest.hint}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quest celebration modal popup */}
      {celebration && (
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
            maxWidth: '480px', 
            width: '100%', 
            textAlign: 'center',
            border: '2px solid var(--cyan)',
            boxShadow: '0 0 30px rgba(0, 162, 154, 0.4)'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '16px',
              borderRadius: '50%',
              background: 'rgba(0, 162, 154, 0.1)',
              color: 'var(--cyan-neon)',
              marginBottom: '20px'
            }}>
              <Award size={48} />
            </div>

            <h2 style={{ fontSize: '32px', marginBottom: '12px', color: 'white' }}>Quest Selesai!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '24px' }}>
              Selamat! Sirkuit Anda telah terhubung secara akurat dan valid.
            </p>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid var(--border-glass)', 
              padding: '16px', 
              borderRadius: '12px',
              marginBottom: '32px'
            }}>
              <div style={{ color: 'var(--cyan-neon)', fontSize: '20px', fontWeight: 'bold' }}>+{celebration.xpGained} XP</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>XP ditambahkan ke profil Anda</div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary" 
                style={{ flex: 1 }}
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
