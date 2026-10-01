import React, { useState } from 'react';
import { X, Shield, FileText, ExternalLink, AlertCircle, CheckCircle, Scale } from 'lucide-react';
import CricPulsLogo from './CricPulsLogo';
import { CopyrightShieldIcon, VerifiedPulseBadge } from './CricPulsIcons';

export default function CopyrightModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('copyright');

  if (!isOpen) return null;

  return (
    <div 
      className="copyright-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
    >
      <div 
        className="copyright-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #090d16 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15)',
          overflow: 'hidden',
          animation: 'fadeInScale 0.25s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(16, 185, 129, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CricPulsLogo variant="icon" size={32} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                  CRICAI Legal &amp; Copyright Notice
                </h3>
                <VerifiedPulseBadge size={16} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0 0' }}>
                Official Intellectual Property, Fair Use &amp; Rights Center
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '0 1rem',
          gap: '4px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'copyright', label: 'Copyright & IP', icon: CopyrightShieldIcon },
            { id: 'fairuse', label: 'Fair Use Disclaimer', icon: Scale },
            { id: 'dmca', label: 'DMCA Takedown', icon: Shield },
            { id: 'credits', label: 'Tech & Open Source', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
                  color: isActive ? '#34d399' : '#94a3b8',
                  padding: '10px 14px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Body Content */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          fontSize: '0.88rem',
          lineHeight: '1.6',
          color: '#cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {activeTab === 'copyright' && (
            <>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <CopyrightShieldIcon size={24} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#34d399', fontSize: '0.95rem', fontWeight: '700' }}>
                    © 2026 CricAi Technologies Inc. All Rights Reserved.
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                    Registration No: CA-2026-INTL-IP • Global Intellectual Property Protection
                  </p>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                  1. Proprietary Brand &amp; Digital Assets
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                  The <strong>CricAi™</strong> name, wordmark, neon cricket ball pulse insignia, user interface architecture, responsive design tokens, live ball simulation engine, and real-time commentary algorithms are protected under international copyright, trademark, and unfair competition laws. Unauthorized copying, reverse engineering, redistribution, scraping, or republication is strictly prohibited.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                  2. Web &amp; Mobile Application License
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                  Permission is granted to access and use CricAi for personal, non-commercial sports viewing and statistical analysis. Commercial retransmission of CricAi live feeds or data endpoints without written authorization constitutes copyright infringement.
                </p>
              </div>
            </>
          )}

          {activeTab === 'fairuse' && (
            <>
              <div style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <Scale size={24} color="#06b6d4" />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#22d3ee', fontSize: '0.95rem', fontWeight: '700' }}>
                    Sports Data &amp; Fair Use Reporting
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                    Editorial accuracy and journalistic freedom in public sports information.
                  </p>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                  Cricket Tournament &amp; Team Marks
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                  All tournament names (including Indian Premier League (IPL), ICC Men's Cricket World Cup, The Ashes, Big Bash League (BBL), Pakistan Super League (PSL), Major League Cricket (MLC)), cricket board crests, player names, and franchise logos are registered trademarks of their respective governing bodies (e.g. BCCI, ICC, Cricket Australia, ECB).
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '0.5rem' }}>
                  CricAi is an independent cricket news, scoring, and statistical platform. Reference to third-party marks is purely nominative fair use for factual identification and sports reporting. CricAi is not sponsored or endorsed by the BCCI or ICC.
                </p>
              </div>
            </>
          )}

          {activeTab === 'dmca' && (
            <>
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <AlertCircle size={24} color="#ef4444" />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#f87171', fontSize: '0.95rem', fontWeight: '700' }}>
                    DMCA / Notice &amp; Takedown Procedure
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                    Fast, responsive intellectual property protection channel.
                  </p>
                </div>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                If you are a copyright or trademark owner and believe content hosted on CricAi infringes upon your exclusive rights, please transmit a formal takedown notice to our designated copyright officer:
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                color: '#34d399'
              }}>
                Email: copyright@cricai.live<br />
                Attn: Legal Department / Copyright Compliance Officer<br />
                Response Time: Under 24 Business Hours
              </div>
            </>
          )}

          {activeTab === 'credits' && (
            <>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '1rem',
              }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '0.92rem' }}>
                  Built with Modern Open Source Architecture
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                  <li>React 19 &amp; Vite Build Tooling</li>
                  <li>Strapi v5 Headless Content Engine</li>
                  <li>Express.js High-Throughput Cricket Score Proxy</li>
                  <li>Lucide Icons &amp; Custom CricPuls Vector Graphics Suite</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>
            CricAi Version 2.4.0 • Built with Passion for Cricket
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '6px 18px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
