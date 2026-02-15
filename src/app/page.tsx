'use client';

import {
  FileText, BarChart3, Plus, ArrowRight, Search,
  Package, Ship, TrendingUp, Zap, Clock, Shield
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { INVOICE_TYPES } from '@/lib/customerConfig';

export default function DashboardPage() {
  const feeTypes = INVOICE_TYPES.filter(t => t.isFee);
  const nonFeeTypes = INVOICE_TYPES.filter(t => !t.isFee);

  return (
    <>
      {/* ── Hero Section ────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(26, 127, 212, 0.12) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(26, 127, 212, 0.06) 100%)',
        border: '1px solid rgba(26, 127, 212, 0.15)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 36px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '180px', height: '180px',
          background: 'radial-gradient(circle, rgba(26, 127, 212, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30px', left: '20%',
          width: '120px', height: '120px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Image
              src="/logo.png"
              alt="PT Tunggal Mandiri Logistik"
              width={64}
              height={64}
              style={{ objectFit: 'contain' }}
              priority
            />
            <div>
              <h1 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-300) 60%, var(--accent-400) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                PT Tunggal Mandiri Logistik
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', letterSpacing: '0.02em' }}>
                Sistem Manajemen Invoice — Jasa Angkutan Darat (Trucking)
              </p>
            </div>
          </div>
          {/* ── Tracking Search Bar ───────────────────────────────── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
              if (val) window.location.href = `/rekap?q=${encodeURIComponent(val)}`;
            }}
            style={{ marginTop: '24px', maxWidth: '480px', position: 'relative', zIndex: 10 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'var(--bg-input)', // Matches theme
              borderRadius: 'var(--radius-pill)',
              padding: '6px 6px 6px 20px',
              border: '1px solid var(--border-primary)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
            }}>
              <Search size={20} color="var(--text-muted)" />
              <input
                name="q"
                type="text"
                placeholder="Lacak No. Invoice / Mobil (B 1234 XX)"
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  padding: '10px 12px', fontSize: '14px', outline: 'none',
                  color: 'var(--text-primary)',
                }}
              />
              <button type="submit" style={{
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)',
                padding: '10px 24px', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', transition: 'transform 0.1s',
              }}>
                Cari
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', paddingLeft: '20px' }}>
              Contoh: INV/2023/X/001 atau B 9876 XYZ
            </p>
          </form>
        </div>
      </div>

      {/* ── Wave Divider ────────────────────────────────────── */}
      <div className="wave-divider" style={{ marginTop: '-40px', marginBottom: '32px', zIndex: 0 }}>
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" style={{ fill: 'var(--bg-primary)' }}></path>
          <path fillOpacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" style={{ fill: 'var(--accent-400)', opacity: 0.1 }}></path>
        </svg>
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {/* Buat Invoice Card */}
        <Link href="/invoice" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-600) 100%)',
            border: '1px solid rgba(26, 127, 212, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            display: 'flex', alignItems: 'center', gap: '20px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
            className="action-card"
          >
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '100px', height: '100px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />
            <div style={{
              width: '52px', height: '52px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Plus size={24} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px', fontWeight: 700, color: '#fff',
                marginBottom: '4px', letterSpacing: '0.03em',
              }}>
                Buat Invoice Baru
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                Pilih dari 16 tipe invoice — kolom otomatis menyesuaikan
              </p>
            </div>
            <ArrowRight size={20} color="rgba(255,255,255,0.6)" />
          </div>
        </Link>

        {/* Rekapitulasi Card */}
        <Link href="/rekap" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-700) 0%, var(--accent-600) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            display: 'flex', alignItems: 'center', gap: '20px',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
            className="action-card"
          >
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '100px', height: '100px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />
            <div style={{
              width: '52px', height: '52px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <BarChart3 size={24} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px', fontWeight: 700, color: '#fff',
                marginBottom: '4px', letterSpacing: '0.03em',
              }}>
                Lihat Rekapitulasi
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                Riwayat, filter, sorting — semua invoice tercatat
              </p>
            </div>
            <ArrowRight size={20} color="rgba(255,255,255,0.6)" />
          </div>
        </Link>
      </div>

      {/* ── Features Highlights ─────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
        marginBottom: '36px',
      }}>
        {[
          { icon: Zap, label: 'Template Otomatis', desc: '16 tipe kolom', color: 'var(--primary-400)' },
          { icon: Shield, label: 'FEE Handling', desc: 'Auto potongan', color: 'var(--accent-400)' },
          { icon: FileText, label: 'PDF Instan', desc: 'Generate langsung', color: 'var(--gold-500)' },
          { icon: Clock, label: 'Rekapitulasi', desc: 'Filter & search', color: '#a78bfa' },
        ].map((feat, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 16px',
            textAlign: 'center',
            transition: 'all 0.25s ease',
          }}
            className="feature-card"
          >
            <div style={{
              width: '40px', height: '40px', margin: '0 auto 10px',
              background: `${feat.color}18`,
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <feat.icon size={18} color={feat.color} />
            </div>
            <h4 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px', fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '3px', letterSpacing: '0.03em',
            }}>
              {feat.label}
            </h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Invoice Types Overview ──────────────────────────── */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px',
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '16px', fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.03em',
              marginBottom: '2px',
            }}>
              Tipe Invoice Tersedia
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {INVOICE_TYPES.length} tipe — klik untuk langsung membuat invoice
            </p>
          </div>
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '28px', fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {INVOICE_TYPES.length}
          </span>
        </div>

        {/* Non-FEE types */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--primary-400)',
            fontFamily: "'Montserrat', sans-serif",
            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Package size={12} /> Standar ({nonFeeTypes.length} tipe)
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px',
          }}>
            {nonFeeTypes.map(t => (
              <Link href="/invoice" key={t.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                  className="type-item"
                >
                  <div style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: 'var(--primary-400)',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: '12px', color: 'var(--text-secondary)',
                    fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {t.name}
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontSize: '10px',
                    color: 'var(--text-muted)', flexShrink: 0,
                  }}>
                    {t.columns.length} col
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FEE types */}
        <div>
          <div style={{
            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#f59e0b',
            fontFamily: "'Montserrat', sans-serif",
            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <TrendingUp size={12} /> FEE — Harga −150rb ({feeTypes.length} tipe)
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px',
          }}>
            {feeTypes.map(t => (
              <Link href="/invoice" key={t.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                  className="type-item"
                >
                  <span style={{
                    fontSize: '8px', fontWeight: 700,
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    padding: '2px 5px',
                    borderRadius: '3px',
                    flexShrink: 0,
                  }}>
                    FEE
                  </span>
                  <span style={{
                    fontSize: '12px', color: 'var(--text-secondary)',
                    fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {t.name}
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontSize: '10px',
                    color: 'var(--text-muted)', flexShrink: 0,
                  }}>
                    {t.columns.length} col
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Info Row ─────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        {/* Layanan */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <h4 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px', fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '12px', letterSpacing: '0.03em',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Ship size={14} color="var(--primary-400)" /> Layanan Kami
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Handling Import', 'Handling Export', 'Trucking Kontainer', 'Pribadi Import'].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '12px', color: 'var(--text-secondary)',
              }}>
                <div style={{
                  width: '5px', height: '5px',
                  borderRadius: '50%',
                  background: i % 2 === 0 ? 'var(--primary-400)' : 'var(--accent-400)',
                }} />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* FEE Rules Compact */}
        <div className="glass-card" style={{
          padding: '20px 24px',
          borderLeft: '3px solid #f59e0b',
        }}>
          <h4 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px', fontWeight: 700,
            color: '#f59e0b',
            marginBottom: '12px', letterSpacing: '0.03em',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Zap size={14} /> Aturan FEE
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Harga otomatis −Rp 150.000',
              'Footer: Total − DP = Jumlah',
              'Admin input DP manual',
            ].map((rule, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '12px', color: 'var(--text-secondary)',
              }}>
                <div style={{
                  width: '5px', height: '5px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                }} />
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hover Styles (injected) ─────────────────────────── */}
      <style jsx>{`
        .action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }
        .feature-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-glow);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .type-item:hover {
          border-color: var(--border-glow) !important;
          background: var(--bg-card-hover) !important;
        }
      `}</style>
    </>
  );
}
