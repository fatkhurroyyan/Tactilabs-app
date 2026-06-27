import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Cpu, Play, CheckCircle2, Sliders, Sparkles } from 'lucide-react';
import { ModelCanvas } from '../components/ModelCanvas';


export const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'studio' | 'agents' | 'api'>('studio');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#F7F7F5', 
      color: '#111111',
      fontFamily: '"Geist", "Inter", sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* TOP NAVIGATION */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        borderBottom: '1px solid #E7E7E4',
        backgroundColor: 'rgba(247, 247, 245, 0.8)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '72px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <Link to="/" style={{
              fontSize: '20px',
              fontWeight: '800',
              letterSpacing: '-0.04em',
              color: '#111111',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Zap size={20} color="#000000" fill="#000000" /> Tactilabs
            </Link>
            <div style={{ display: 'none', gap: '24px', alignItems: 'center' }} className="md:flex">
              <a href="#ekosistem" style={{ fontSize: '14px', color: '#6B6B6B', fontWeight: 500 }} className="hover:text-black transition-colors">TactiBlocks</a>
              <a href="#ekosistem" style={{ fontSize: '14px', color: '#6B6B6B', fontWeight: 500 }} className="hover:text-black transition-colors">TactiApp</a>
              <a href="#fitur" style={{ fontSize: '14px', color: '#6B6B6B', fontWeight: 500 }} className="hover:text-black transition-colors">Fitur Lab</a>
              <a href="#harga" style={{ fontSize: '14px', color: '#6B6B6B', fontWeight: 500 }} className="hover:text-black transition-colors">Harga</a>
              <a href="#contact" style={{ fontSize: '14px', color: '#6B6B6B', fontWeight: 500 }} className="hover:text-black transition-colors">Kemitraan CSR</a>
            </div>
          </div>
          <div>
            <Link to="/register" style={{
              background: '#000000',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 600,
              display: 'inline-block',
              transition: 'all 0.2s'
            }} className="hover:opacity-90">
              Mulai Belajar
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT CANVAS */}
      <main style={{ flexGrow: 1, paddingTop: '140px', paddingBottom: '48px' }}>
        
        {/* HERO SECTION */}
        <section style={{ maxWidth: '1280px', margin: '0 auto 100px', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#F3F2EF',
                border: '1px solid #E7E7E4',
                padding: '6px 16px',
                borderRadius: '30px',
                fontSize: '11px',
                color: '#6B6B6B',
                fontWeight: '700',
                letterSpacing: '0.1em',
                width: 'fit-content'
              }}>
                <Zap size={12} fill="#6B6B6B" /> PHYGYTAL STEM INTERACTIVE
              </div>
              
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 5.25rem)',
                lineHeight: '1.05',
                letterSpacing: '-0.04em',
                fontWeight: '800',
                color: '#111111',
                margin: 0
              }}>
                Hardware meets <br />
                higher learning
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                <Link to="/register" style={{
                  background: '#000000',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'inline-block'
                }} className="hover:opacity-90">
                  Get started
                </Link>
                <a href="#demo" style={{
                  background: 'transparent',
                  border: '1px solid #747878',
                  color: '#000000',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'inline-block'
                }} className="hover:bg-zinc-100 transition-colors">
                  Contact sales
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '16px', gap: '24px' }}>
              <p style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#6B6B6B',
                maxWidth: '440px',
                textAlign: 'left',
                margin: 0
              }}>
                Tactilabs menjembatani dunia fisik dan digital secara revolusioner. Hubungkan modul magnetik <strong>TactiBlocks</strong> fisik Anda, dan lihat arus elektron berpendar mengalir seketika di layar dalam visualisasi 3D futuristik.
              </p>
              <div className="glass-card" style={{ width: '100%', maxWidth: '520px', height: '420px', padding: '12px', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                <ModelCanvas />
              </div>
            </div>
          </div>
        </section>

        {/* HERO PRODUCT PANEL - Warm Pastel Orbs Auralis Spec */}
        <section id="demo" style={{ maxWidth: '1280px', margin: '0 auto 140px', padding: '0 32px' }}>
          <div style={{
            backgroundColor: '#F3F2EF',
            borderRadius: '24px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '600px',
            border: '1px solid #E7E7E4'
          }}>
            {/* Top Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, flexWrap: 'wrap', gap: '16px' }}>
              <div style={{
                background: '#FCFCFB',
                padding: '4px',
                borderRadius: '9999px',
                border: '1px solid #E7E7E4',
                display: 'flex',
                gap: '4px'
              }}>
                <button 
                  onClick={() => setActiveTab('studio')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: activeTab === 'studio' ? '#F3F2EF' : 'transparent',
                    color: activeTab === 'studio' ? '#111111' : '#6B6B6B',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  TactiBlocks Studio
                </button>
                <button 
                  onClick={() => setActiveTab('agents')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: activeTab === 'agents' ? '#F3F2EF' : 'transparent',
                    color: activeTab === 'agents' ? '#111111' : '#6B6B6B',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Diagnostic Agents
                </button>
                <button 
                  onClick={() => setActiveTab('api')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: activeTab === 'api' ? '#F3F2EF' : 'transparent',
                    color: activeTab === 'api' ? '#111111' : '#6B6B6B',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  TactiBlocks API
                </button>
              </div>

              <div style={{
                background: '#FCFCFB',
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid #E7E7E4',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#111111'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                <span>Active 3D Telemetry</span>
              </div>
            </div>

            {/* Auralis Style Orb Background Gradients */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 1,
              opacity: 0.95
            }}>
              <div style={{ width: '300px', height: '300px', borderRadius: '50%', background: 'gradient-to-tr from-rose-500 to-orange-400', filter: 'blur(80px)', position: 'absolute', transform: 'translateX(-120px)', opacity: 0.2 }}></div>
              <div style={{ width: '400px', height: '400px', borderRadius: '50%', background: 'gradient-to-tr from-indigo-500 to-purple-500', filter: 'blur(90px)', position: 'absolute', opacity: 0.25 }}></div>
              <div style={{ width: '250px', height: '250px', borderRadius: '50%', background: 'gradient-to-tr from-emerald-500 to-teal-400', filter: 'blur(70px)', position: 'absolute', transform: 'translateX(120px) translateY(80px)', opacity: 0.25 }}></div>
              <div style={{ width: '350px', height: '350px', borderRadius: '50%', background: 'gradient-to-tr from-sky-400 to-blue-500', filter: 'blur(80px)', position: 'absolute', transform: 'translateX(180px) translateY(-50px)', opacity: 0.2 }}></div>
            </div>

            {/* Center Play Button */}
            <div style={{ zIndex: 10, alignSelf: 'center', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Link to="/register" style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#FCFCFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid #E7E7E4',
                transition: 'transform 0.2s',
                color: '#111111'
              }} className="hover:scale-105">
                <Play size={36} fill="#111111" style={{ marginLeft: '6px' }} />
              </Link>
            </div>

            {/* Bottom Info Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10,
              background: 'rgba(252, 252, 251, 0.9)',
              backdropFilter: 'blur(12px)',
              padding: '16px 24px',
              borderRadius: '16px',
              border: '1px solid #E7E7E4',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111111' }}>Ohm's Law Quest</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B6B6B' }}>Series Circuits</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B6B6B' }}>Logic Gates</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B6B6B' }}>Kirchhoff's Laws</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B6B6B' }}>Capacitance</span>
              </div>
              <Link to="/register" style={{
                background: '#000000',
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600
              }}>Hubungkan Kit</Link>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section style={{ maxWidth: '1280px', margin: '0 auto 40px', padding: '0 32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#6B6B6B', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Dipercayai oleh Institusi STEM & Universitas Inovatif
          </h3>
        </section>

        {/* LOGO MARQUEE */}
        <section style={{ width: '100%', overflow: 'hidden', marginBottom: '100px', padding: '16px 0' }}>
          <div style={{ display: 'flex', whiteSpace: 'nowrap', overflow: 'hidden' }} className="group">
            <div className="animate-marquee group-hover:pause-marquee" style={{ display: 'flex', gap: '96px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Cpu size={24} /> Velocity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Zap size={24} /> Nexus</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Sparkles size={24} /> Lumina</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Sliders size={24} /> Orbital</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Cpu size={24} /> Stack</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Zap size={24} /> Scalar</div>
            </div>
            <div aria-hidden="true" className="animate-marquee group-hover:pause-marquee" style={{ display: 'flex', gap: '96px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Cpu size={24} /> Velocity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Zap size={24} /> Nexus</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Sparkles size={24} /> Lumina</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Sliders size={24} /> Orbital</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Cpu size={24} /> Stack</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(0,0,0,0.1)', textTransform: 'uppercase', fontStyle: 'italic' }}><Zap size={24} /> Scalar</div>
            </div>
          </div>
        </section>

        {/* PLATFORM OVERVIEW */}
        <section id="ekosistem" style={{ maxWidth: '1280px', margin: '0 auto 140px', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', maxWidth: '768px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 4rem)', fontWeight: '800', letterSpacing: '-0.03em', color: '#111111', marginBottom: '24px', lineHeight: '1.1' }}>
              Satu ekosistem, dua antarmuka sinergis
            </h2>
            <p style={{ fontSize: '18px', color: '#6B6B6B', lineHeight: '1.6' }}>
              Menghubungkan praktikum motorik di meja laboratorium Anda dengan visualisasi aliran elektron real-time yang memukau di layar.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '48px' }}>
            
            {/* Card 1: TactiBlocks Physical */}
            <div style={{
              backgroundColor: '#FCFCFB',
              borderRadius: '16px',
              border: '1px solid #E7E7E4',
              padding: '32px',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(94, 217, 208, 0.05) 0%, rgba(123, 97, 255, 0.08) 100%)',
                opacity: 0.6
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
                <span style={{ color: '#00a29a' }}><Cpu size={24} /></span>
              </div>
              <div style={{ zIndex: 10 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111111', marginBottom: '8px' }}>TactiBlocks (Fisik)</h4>
                <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: '1.5' }}>
                  Modul komponen elektronik magnetik snap-on yang aman dan kokoh. Dibuat ramah bagi pemula tanpa perlu breadboard kabel jumper yang membingungkan.
                </p>
              </div>
            </div>

            {/* Card 2: TactiApp Digital */}
            <div style={{
              backgroundColor: '#FCFCFB',
              borderRadius: '16px',
              border: '1px solid #E7E7E4',
              padding: '32px',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.08) 0%, rgba(255, 177, 195, 0.08) 100%)',
                opacity: 0.6
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
                <span style={{ color: '#7b61ff' }}><Sliders size={24} /></span>
              </div>
              <div style={{ zIndex: 10 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111111', marginBottom: '8px' }}>TactiApp (Digital)</h4>
                <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: '1.5' }}>
                  Platform web pembelajaran interaktif yang menyajikan visualisasi aliran elektron neon 3D real-time dan sistem petualangan belajar (Quest) berbasis cerita.
                </p>
              </div>
            </div>

          </div>

          {/* Large Monitor Mockup Image & Telemetry overlay widget */}
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: '#F3F2EF',
            borderRadius: '24px',
            border: '1px solid #E7E7E4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Monitor Mockup Grid Lines */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.01) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.8
            }} />

            {/* Glowing Accent Orbs behind widget */}
            <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'rgba(94, 217, 208, 0.1)', borderRadius: '50%', filter: 'blur(80px)', transform: 'translateX(-80px) translateY(-40px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'rgba(123, 97, 255, 0.1)', borderRadius: '50%', filter: 'blur(80px)', transform: 'translateX(80px) translateY(40px)', pointerEvents: 'none' }}></div>

            {/* Auralis Spec Glassmorphic Widget Container */}
            <div style={{
              position: 'relative',
              width: '440px',
              maxWidth: '90%',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(30px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              boxShadow: '0 48px 96px -24px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.4)'
            }}>
              {/* Widget Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(0, 0, 0, 0.4)', marginBottom: '4px' }}>TactiEngine v1.0 PRO</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>Real-time Telemetry Active</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#047857'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} className="animate-pulse"></div>
                  <span>LAB ONLINE</span>
                </div>
              </div>

              {/* Spectral / Volumetric Line Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyItems: 'stretch', justifyContent: 'space-between', height: '96px', gap: '4px' }}>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '25%' }}></div>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '40%' }}></div>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '65%' }}></div>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '55%' }}></div>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '85%' }}></div>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '95%' }}></div>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '70%' }}></div>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '45%' }}></div>
                <div style={{ width: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, #000000 100%)', borderRadius: '9999px', height: '60%' }}></div>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B6B', fontWeight: 600 }}>Latency</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111111' }}>12</span>
                    <span style={{ fontSize: '12px', color: '#6B6B6B' }}>ms</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B6B', fontWeight: 600 }}>Voltage</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111111' }}>5.00</span>
                    <span style={{ fontSize: '12px', color: '#6B6B6B' }}>V</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B6B', fontWeight: 600 }}>Stability</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111111' }}>99.8</span>
                    <span style={{ fontSize: '12px', color: '#6B6B6B' }}>%</span>
                  </div>
                </div>
              </div>

              {/* Playback & Calibration Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.4)', padding: 0, cursor: 'pointer' }} className="hover:text-black">
                    <Sliders size={20} />
                  </button>
                  <button style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }} className="hover:scale-105 transition-transform">
                    <Play size={18} fill="#ffffff" style={{ marginLeft: '2px' }} />
                  </button>
                  <button style={{ background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.4)', padding: 0, cursor: 'pointer' }} className="hover:text-black">
                    <Cpu size={20} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: '#111111', background: 'rgba(0,0,0,0.03)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }}>00:12.45</span>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telemetry active</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TACTILABS STUDIO MODULE */}
        <section id="fitur" style={{ maxWidth: '1280px', margin: '0 auto 140px', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', background: '#F3F2EF', color: '#111111', padding: '6px 16px', borderRadius: '9999px', border: '1px solid #E7E7E4' }}>
              TactiBlocks Studio
            </span>
            <div style={{ height: '1px', background: '#E7E7E4', flexGrow: 1 }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: '800', color: '#111111', lineHeight: '1.2', margin: 0 }}>
              Rancang, hubungkan, & simulasikan sirkuit fisik di satu tempat
            </h2>
            <p style={{ fontSize: '18px', color: '#6B6B6B', lineHeight: '1.6', alignSelf: 'flex-end', margin: 0 }}>
              Antarmuka workspace interaktif yang memudahkan Anda merangkai kode, men-debug voltase pin mikroprosesor, serta memantau sensor sirkuit secara terintegrasi.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            
            {/* Interactive Timeline Card */}
            <div style={{
              backgroundColor: '#FCFCFB',
              border: '1px solid #E7E7E4',
              borderRadius: '16px',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Graphic background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
              
              <div style={{
                position: 'relative',
                zIndex: 10,
                background: 'linear-gradient(to top, #FCFCFB 0%, rgba(252,252,251,0.2) 100%)',
                padding: '24px',
                borderTop: '1px solid #E7E7E4',
                width: '100%'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111111', marginBottom: '6px' }}>Oscilloscope Telemetry</h4>
                <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.4' }}>Grafik fluktuasi sinyal analog pembacaan sensor tegangan waktu-nyata.</p>
              </div>
            </div>

            {/* Code compile Card */}
            <div style={{
              backgroundColor: '#FCFCFB',
              border: '1px solid #E7E7E4',
              borderRadius: '16px',
              padding: '32px',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div>
                <span style={{ color: '#000000' }}><Cpu size={24} /></span>
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111111', marginBottom: '6px' }}>Live Code Compiler</h4>
                <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.4' }}>Compiler otomatis berbasis web untuk menyusun instruksi logika mikrokontroler.</p>
              </div>
            </div>

          </div>

          {/* Quick Component Buttons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', padding: '20px', backgroundColor: '#FCFCFB', border: '1px solid #E7E7E4', borderRadius: '12px' }}>
              <span style={{ fontSize: '20px' }}>🔌</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111111' }}>Resistor Block</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', padding: '20px', backgroundColor: '#FCFCFB', border: '1px solid #E7E7E4', borderRadius: '12px' }}>
              <span style={{ fontSize: '20px' }}>⚡</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111111' }}>Capacitor Block</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', padding: '20px', backgroundColor: '#FCFCFB', border: '1px solid #E7E7E4', borderRadius: '12px' }}>
              <span style={{ fontSize: '20px' }}>🎛️</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111111' }}>Logic IC Gate</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', padding: '20px', backgroundColor: '#FCFCFB', border: '1px solid #E7E7E4', borderRadius: '12px' }}>
              <span style={{ fontSize: '20px' }}>📟</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111111' }}>MCU Board</span>
            </div>
          </div>
        </section>

        {/* TACTILABS AGENTS MODULE */}
        <section style={{ maxWidth: '1280px', margin: '0 auto 100px', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', background: '#F3F2EF', color: '#111111', padding: '6px 16px', borderRadius: '9999px', border: '1px solid #E7E7E4' }}>
              Diagnostic & Gamification
            </span>
            <div style={{ height: '1px', background: '#E7E7E4', flexGrow: 1 }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: '800', color: '#111111', lineHeight: '1.2', margin: 0 }}>
              Sistem petualangan belajar yang cerdas & adaptif
            </h2>
            <p style={{ fontSize: '18px', color: '#6B6B6B', lineHeight: '1.6', alignSelf: 'flex-end', margin: 0 }}>
              Uji pemahaman Anda dengan ratusan level praktikum kelistrikan interaktif yang memiliki asisten virtual otomatis untuk menuntun Anda saat sirkuit tidak bekerja.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* Agent Card 1 */}
            <div style={{
              backgroundColor: '#FCFCFB',
              border: '1px solid #E7E7E4',
              borderRadius: '24px',
              height: '450px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              padding: '32px'
            }}>
              {/* Auralis Style Gradient decoration */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                opacity: 0.15
              }}>
                <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'linear-gradient(to right, #00c6ff, #0072ff)', filter: 'blur(40px)', position: 'absolute', transform: 'translate(-50px, -50px)' }}></div>
                <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'linear-gradient(to right, #f8002f, #0072ff)', filter: 'blur(40px)', position: 'absolute', transform: 'translate(50px, 50px)' }}></div>
              </div>

              <div style={{ zIndex: 10, alignSelf: 'flex-start', background: '#F3F2EF', padding: '6px 16px', borderRadius: '9999px', border: '1px solid #E7E7E4', fontSize: '13px', fontWeight: 600, color: '#111111' }}>
                Interactive Quest Guidance
              </div>

              {/* Chat bubble simulation */}
              <div style={{ zIndex: 10, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🤖
                  </div>
                  <div style={{ background: '#F3F2EF', border: '1px solid #E7E7E4', padding: '12px 16px', borderRadius: '16px', borderTopLeftRadius: '4px', fontSize: '13px', color: '#111111' }}>
                    Sirkuit Anda kelebihan arus! Coba pasang Resistor 220 Ohm.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexDirection: 'row-reverse' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E7E7E4' }}>
                    👤
                  </div>
                  <div style={{ background: '#000000', color: 'white', padding: '12px 16px', borderRadius: '16px', borderTopRightRadius: '4px', fontSize: '13px' }}>
                    Baik, resistor telah saya sambungkan secara magnetik.
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Card 2 */}
            <div style={{
              backgroundColor: '#FCFCFB',
              border: '1px solid #E7E7E4',
              borderRadius: '24px',
              height: '450px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              padding: '32px'
            }}>
              {/* Graphic background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '32px',
                opacity: 0.15
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px', width: '100%', padding: '0 32px' }}>
                  <div style={{ width: '100%', background: '#000000', opacity: 0.05, borderRadius: '2px 2px 0 0', height: '30%' }}></div>
                  <div style={{ width: '100%', background: '#000000', opacity: 0.05, borderRadius: '2px 2px 0 0', height: '50%' }}></div>
                  <div style={{ width: '100%', background: '#000000', opacity: 0.15, borderTop: '2px solid #000000', borderRadius: '2px 2px 0 0', height: '80%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FCFCFB' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div></div>
                  </div>
                  <div style={{ width: '100%', background: '#000000', opacity: 0.05, borderRadius: '2px 2px 0 0', height: '60%' }}></div>
                  <div style={{ width: '100%', background: '#000000', opacity: 0.05, borderRadius: '2px 2px 0 0', height: '40%' }}></div>
                </div>
              </div>

              <div style={{ zIndex: 10, alignSelf: 'flex-start', background: '#F3F2EF', padding: '6px 16px', borderRadius: '9999px', border: '1px solid #E7E7E4', fontSize: '13px', fontWeight: 600, color: '#111111' }}>
                Leaderboard & Achievements
              </div>

              <div style={{ zIndex: 10, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111111', marginBottom: '6px' }}>Real-time Analytics</h4>
                <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.4' }}>Grafik perkembangan skor pemahaman, laju penyelesaian misi sirkuit, dan peringkat kelas.</p>
              </div>
            </div>

          </div>
        </section>
        {/* CSR PARTNERSHIP FORM */}
        <section id="contact" style={{ padding: '0 24px', maxWidth: '1280px', margin: '0 auto 100px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            
            {/* Left: Stats & Brief */}
            <div>
              <span style={{ fontSize: '12px', color: '#7b61ff', fontWeight: 'bold', letterSpacing: '0.1em' }}>KEMITRAAN CSR</span>
              <h2 style={{ fontSize: '36px', marginTop: '8px', marginBottom: '24px', color: '#111111', lineHeight: '1.2' }}>Mari Berkolaborasi untuk STEM Masa Depan</h2>
              <p style={{ color: '#6B6B6B', lineHeight: '1.7', marginBottom: '40px', fontSize: '15px' }}>
                Kami membuka peluang kerja sama dengan sekolah, universitas, dinas pendidikan, maupun CSR perusahaan untuk mendistribusikan modul TactiBlocks ke seluruh pelosok tanah air.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ borderLeft: '3px solid #000000', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111111' }}>10k+</div>
                  <div style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '4px' }}>Siswa Belajar Aktif</div>
                </div>
                <div style={{ borderLeft: '3px solid #7b61ff', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111111' }}>50+</div>
                  <div style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '4px' }}>Sekolah Mitra</div>
                </div>
                <div style={{ borderLeft: '3px solid #000000', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111111' }}>99.8%</div>
                  <div style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '4px' }}>Ketahanan Hardware</div>
                </div>
                <div style={{ borderLeft: '3px solid #7b61ff', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111111' }}>3D</div>
                  <div style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '4px' }}>Visualisasi Real-time</div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div style={{ backgroundColor: '#FCFCFB', border: '1px solid #E7E7E4', borderRadius: '16px', padding: '40px' }}>
              {submitted ? (
                <div style={{ 
                  background: '#F3F2EF', 
                  border: '1px solid #E7E7E4', 
                  color: '#111111', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  Terima kasih! Pesan Anda berhasil terkirim. Tim kemitraan kami akan segera menghubungi Anda.
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold', color: '#6B6B6B', letterSpacing: '0.05em' }}>NAMA LENGKAP / INSTANSI</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama Lengkap Anda" 
                      required
                      style={{
                        backgroundColor: '#FCFCFB',
                        border: '1px solid #E7E7E4',
                        color: '#111111',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold', color: '#6B6B6B', letterSpacing: '0.05em' }}>ALAMAT EMAIL</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@university.edu" 
                      required
                      style={{
                        backgroundColor: '#FCFCFB',
                        border: '1px solid #E7E7E4',
                        color: '#111111',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold', color: '#6B6B6B', letterSpacing: '0.05em' }}>PESAN / RENCANA IMPLEMENTASI</label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Deskripsikan rencana implementasi atau kemitraan Anda di sini..." 
                      required
                      style={{
                        backgroundColor: '#FCFCFB',
                        border: '1px solid #E7E7E4',
                        color: '#111111',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        width: '100%'
                      }}
                    />
                  </div>
                  <button type="submit" style={{ 
                    width: '100%', 
                    marginTop: '10px', 
                    background: '#000000', 
                    color: 'white',
                    padding: '14px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }} className="hover:opacity-90">Kirim Pesan Kemitraan</button>
                </form>
              )}
            </div>

          </div>
        </section>

        {/* SIGN OFF CALLOUT */}
        <section style={{ maxWidth: '1280px', margin: '0 auto 100px', padding: '0 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', color: '#111111', fontWeight: '800', marginBottom: '32px', maxWidth: '768px', lineHeight: '1.2' }}>
            Masa depan pembelajaran STEM dimulai di sini
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" style={{
              background: '#000000',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '9999px',
              fontSize: '15px',
              fontWeight: 600,
              display: 'inline-block'
            }} className="hover:opacity-90">Get started</Link>
            <a href="#contact" style={{
              background: 'transparent',
              border: '1px solid #747878',
              color: '#000000',
              padding: '14px 28px',
              borderRadius: '9999px',
              fontSize: '15px',
              fontWeight: 600,
              display: 'inline-block'
            }} className="hover:bg-zinc-100 transition-colors">Talk to sales</a>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #E7E7E4',
        padding: '48px 32px',
        background: '#FCFCFB',
        fontSize: '14px',
        color: '#6B6B6B'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#111111' }}>Tactilabs</span>
            <span>&copy; {new Date().getFullYear()} Tactilabs. Engineered for physical STEM precision.</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#" className="hover:text-black transition-colors">Twitter</a>
            <a href="#" className="hover:text-black transition-colors">GitHub</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
