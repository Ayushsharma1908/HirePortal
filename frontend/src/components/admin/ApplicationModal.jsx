import React, { useState } from 'react'
import {
  X, Download, ExternalLink, GraduationCap, Briefcase,
  Zap, Star, Award, User, Mail, Phone, MapPin, Calendar,
  Github, Linkedin, Globe, FileText, ChevronRight, CheckCircle2,
  Clock, ThumbsUp, ThumbsDown, Loader2, MessageSquare, BookOpen
} from 'lucide-react'
import { STATUS_OPTIONS } from '../../utils/constants'
import api from '../../utils/api'
import toast from 'react-hot-toast'

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  'New':         { color: '#6B7280', bg: 'bg-gray-100',   text: 'text-gray-700',  border: 'border-gray-200',  dot: 'bg-gray-400',    active: 'bg-gray-800 text-white border-gray-800' },
  'In Review':   { color: '#D97706', bg: 'bg-amber-50',   text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400',   active: 'bg-amber-500 text-white border-amber-500' },
  'Shortlisted': { color: '#0D9488', bg: 'bg-teal-50',    text: 'text-teal-700',  border: 'border-teal-200',  dot: 'bg-teal-400',    active: 'bg-teal text-white border-teal' },
  'Hired':       { color: '#059669', bg: 'bg-green-50',   text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-400',   active: 'bg-green-600 text-white border-green-600' },
  'Rejected':    { color: '#DC2626', bg: 'bg-red-50',     text: 'text-red-700',   border: 'border-red-200',   dot: 'bg-red-400',     active: 'bg-red-500 text-white border-red-500' },
}

const STATUS_ICONS = {
  'New':         Clock,
  'In Review':   Loader2,
  'Shortlisted': ThumbsUp,
  'Hired':       CheckCircle2,
  'Rejected':    ThumbsDown,
}

// ── Tabs config ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'Profile',       icon: User,           label: 'Profile' },
  { id: 'Education & Exp', icon: GraduationCap, label: 'Education' },
  { id: 'Skills',        icon: Zap,            label: 'Skills' },
  { id: 'Evaluate',      icon: MessageSquare,  label: 'Evaluate' },
]

// ── Avatar initials color ──────────────────────────────────────────────────
const AVATAR_COLORS = [
  'from-teal to-teal-dark', 'from-violet-500 to-purple-600',
  'from-amber-400 to-orange-500', 'from-blue-500 to-indigo-600',
  'from-rose-500 to-pink-600', 'from-emerald-500 to-green-600',
]
function avatarColor(name = '') {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ApplicationModal({ application: app, onClose, onStatusChange }) {
  const [status, setStatus]   = useState(app.status)
  const [notes, setNotes]     = useState(app.adminNotes || '')
  const [saving, setSaving]   = useState(false)
  const [tab, setTab]         = useState('Profile')

  const save = async () => {
    setSaving(true)
    try {
      const res = await api.patch(`/applications/${app._id}/status`, { status, notes })
      onStatusChange(res.data)
      toast.success('Evaluation saved!')
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  // Normalise education data (handle both plural and singular backend fields)
  const educations = app.educations?.length > 0
    ? app.educations
    : app.education?.length > 0
    ? app.education
    : app.institution
      ? [{ institution: app.institution, degree: app.degree, fieldOfStudy: app.fieldOfStudy, grade: app.grade }]
      : []

  const experiences = app.experiences || app.workExperience || []

  const initials = `${app.firstName?.[0] || ''}${app.lastName?.[0] || ''}`.toUpperCase()
  const gradClass = avatarColor(app.firstName || '')
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['New']
  const currentCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG['New']

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm"
        style={{ background: 'rgba(28,29,33,0.45)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right overflow-hidden">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 bg-gradient-to-br from-[#1C1D21] to-[#2d2f36] px-6 pt-5 pb-6 relative overflow-hidden">
          {/* subtle grid texture */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 24px,#fff 24px,#fff 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,#fff 24px,#fff 25px)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all z-10"
          >
            <X size={15} />
          </button>

          {/* Resume download shortcut */}
          {app.resumePath && (
            <a
              href={`/uploads/${app.resumePath}`}
              download={app.resumeOriginalName || 'resume'}
              target="_blank" rel="noreferrer"
              className="absolute top-4 right-11 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all z-10"
              title="Download Resume"
            >
              <Download size={15} />
            </a>
          )}

          <div className="flex items-center gap-4 relative z-10">
            {/* Avatar */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradClass} flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0`}>
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-white font-semibold text-base leading-tight truncate">
                {app.firstName} {app.lastName}
              </h2>
              <p className="text-white/60 text-xs mt-0.5 truncate">{app.jobRole} · {app.department}</p>
              <p className="text-white/40 text-[11px] mt-0.5 truncate">{app.email}</p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${currentCfg.bg} ${currentCfg.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentCfg.dot}`} />
              {app.status}
            </span>
            <span className="text-white/30 text-[11px]">·</span>
            <span className="text-white/40 text-[11px]">
              {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            {app.experienceLevel && (
              <>
                <span className="text-white/30 text-[11px]">·</span>
                <span className="text-white/40 text-[11px]">{app.experienceLevel}</span>
              </>
            )}
          </div>
        </div>

        {/* ── TAB BAR ───────────────────────────────────────────────────── */}
        <div className="flex border-b border-ink-100 flex-shrink-0 bg-white">
          {TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-all border-b-2 ${
                tab === id
                  ? 'border-teal text-teal'
                  : 'border-transparent text-ink-300 hover:text-ink-500 hover:border-ink-200'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa]">

          {/* ── PROFILE TAB ── */}
          {tab === 'Profile' && (
            <div className="p-5 space-y-4 animate-fade-in">

              {/* Personal Details card */}
              <SectionCard title="Personal Details" icon={User}>
                <DetailRow icon={<Mail size={12} />}     label="Email"    value={app.email} />
                <DetailRow icon={<Phone size={12} />}    label="Phone"    value={app.phone} />
                <DetailRow icon={<MapPin size={12} />}   label="Location" value={[app.city, app.state].filter(Boolean).join(', ')} />
                <DetailRow icon={<User size={12} />}     label="Gender"   value={app.gender} />
                <DetailRow icon={<Calendar size={12} />} label="Applied"  value={new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} />
              </SectionCard>

              {/* Links card */}
              {(app.githubUrl || app.linkedinUrl || app.portfolioUrl ||
                app.socialLinks?.github || app.socialLinks?.linkedin || app.socialLinks?.portfolio) && (
                <SectionCard title="Links & Profiles" icon={ExternalLink}>
                  {(app.githubUrl || app.socialLinks?.github) && (
                    <LinkDetail icon={<Github size={12} />} label="GitHub" url={app.githubUrl || app.socialLinks?.github} />
                  )}
                  {(app.linkedinUrl || app.socialLinks?.linkedin) && (
                    <LinkDetail icon={<Linkedin size={12} />} label="LinkedIn" url={app.linkedinUrl || app.socialLinks?.linkedin} />
                  )}
                  {(app.portfolioUrl || app.socialLinks?.portfolio) && (
                    <LinkDetail icon={<Globe size={12} />} label="Portfolio" url={app.portfolioUrl || app.socialLinks?.portfolio} />
                  )}
                </SectionCard>
              )}

              {/* Cover Letter card */}
              {app.coverLetter && (
                <SectionCard title="Cover Letter" icon={FileText}>
                  <p className="px-4 py-3 text-xs text-ink-600 leading-relaxed whitespace-pre-line">
                    {app.coverLetter}
                  </p>
                </SectionCard>
              )}

              {/* Resume download */}
              {app.resumePath && (
                <a
                  href={`/uploads/${app.resumePath}`}
                  download={app.resumeOriginalName || 'resume'}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-ink text-white text-xs px-4 py-3 w-full hover:bg-ink-800 transition-colors rounded-lg font-medium"
                >
                  <Download size={13} /> Download Resume
                </a>
              )}
            </div>
          )}

          {/* ── EDUCATION & EXP TAB ── */}
          {tab === 'Education & Exp' && (
            <div className="p-5 space-y-4 animate-fade-in">

              {/* Education */}
              <SectionCard title={`Qualifications (${educations.length})`} icon={GraduationCap}>
                {educations.length === 0 ? (
                  <EmptyState icon={<BookOpen size={24} />} text="No qualifications added" />
                ) : (
                  <div className="divide-y divide-ink-50">
                    {educations.map((edu, i) => (
                      <div key={i} className="px-4 py-3 flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-teal/10 text-teal flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-ink leading-snug">
                            {edu.degree}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ''}
                          </p>
                          <p className="text-xs text-ink-500 mt-0.5">{edu.institution}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            {edu.grade && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal/10 text-teal text-[10px] font-semibold">
                                {edu.grade}
                              </span>
                            )}
                            {(edu.startYear || edu.endYear) && (
                              <span className="text-[10px] text-ink-300 font-medium">
                                {edu.startYear} – {edu.endYear || 'Present'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Work Experience */}
              <SectionCard title={`Work Experience (${experiences.length})`} icon={Briefcase}>
                {experiences.length === 0 ? (
                  <EmptyState icon={<Briefcase size={24} />} text="No experience added — may be a fresher" />
                ) : (
                  <div className="divide-y divide-ink-50">
                    {experiences.map((exp, i) => (
                      <div key={i} className="px-4 py-3 flex gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-7 h-7 rounded-lg bg-ink/8 flex items-center justify-center text-xs font-bold text-ink flex-shrink-0" style={{ background: 'rgba(28,29,33,0.08)' }}>
                            {i + 1}
                          </div>
                          {i < experiences.length - 1 && (
                            <div className="w-px flex-1 bg-ink-100 min-h-[16px]" />
                          )}
                        </div>
                        <div className="min-w-0 pb-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-ink">{exp.jobTitle}</p>
                              <p className="text-xs text-ink-500 font-medium">{exp.company}</p>
                            </div>
                            {exp.employmentType && (
                              <span className="text-[10px] bg-ink-50 border border-ink-100 text-ink-400 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                                {exp.employmentType}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-ink-300">
                            {exp.location && <span>{exp.location} ·</span>}
                            <span>
                              {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                              {' – '}
                              {exp.isCurrentJob || exp.current
                                ? <span className="text-teal font-semibold">Present</span>
                                : exp.endDate
                                  ? new Date(exp.endDate + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                                  : '—'
                              }
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-[11px] text-ink-400 leading-relaxed mt-1.5 line-clamp-3">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          )}

          {/* ── SKILLS TAB ── */}
          {tab === 'Skills' && (
            <div className="p-5 space-y-4 animate-fade-in">

              {app.technicalSkills?.length > 0 && (
                <SectionCard title={`Technical Skills · ${app.technicalSkills.length}`} icon={Zap}>
                  <div className="px-4 py-3 flex flex-wrap gap-2">
                    {app.technicalSkills.map(s => (
                      <span key={s}
                        className="inline-flex items-center px-3 py-1.5 bg-ink text-white text-[11px] font-medium rounded-lg hover:bg-teal transition-colors duration-150">
                        {s}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}

              {app.softSkills?.length > 0 && (
                <SectionCard title={`Soft Skills · ${app.softSkills.length}`} icon={Star}>
                  <div className="px-4 py-3 flex flex-wrap gap-2">
                    {app.softSkills.map(s => (
                      <span key={s}
                        className="inline-flex items-center px-3 py-1.5 border border-ink-200 bg-white text-ink text-[11px] rounded-lg hover:border-teal hover:text-teal transition-colors duration-150">
                        {s}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}

              {app.certifications?.length > 0 && (
                <SectionCard title="Certifications" icon={Award}>
                  <div className="px-4 py-3 flex flex-wrap gap-2">
                    {app.certifications.map(c => (
                      <span key={c}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal/8 border border-teal/20 text-teal-dark text-[11px] rounded-lg font-medium"
                        style={{ background: 'rgba(13,148,136,0.06)' }}>
                        <Award size={10} /> {c}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}

              {!app.technicalSkills?.length && !app.softSkills?.length && !app.certifications?.length && (
                <EmptyState icon={<Zap size={28} />} text="No skills recorded for this applicant" padded />
              )}
            </div>
          )}

          {/* ── EVALUATE TAB ── */}
          {tab === 'Evaluate' && (
            <div className="p-5 space-y-4 animate-fade-in">

              {/* Status selector */}
              <SectionCard title="Update Status" icon={CheckCircle2}>
                <div className="p-3 grid grid-cols-1 gap-2">
                  {STATUS_OPTIONS.map(s => {
                    const c = STATUS_CONFIG[s] || {}
                    const Icon = STATUS_ICONS[s] || Clock
                    const isActive = status === s
                    return (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                          isActive ? c.active + ' shadow-sm' : `bg-white ${c.border} ${c.text} hover:opacity-80`
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'opacity-80' : ''} />
                        <span className="text-xs font-semibold flex-1">{s}</span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[10px] opacity-70">
                            <CheckCircle2 size={10} /> Selected
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </SectionCard>

              {/* Admin Notes */}
              <SectionCard title="Admin Notes" icon={MessageSquare}>
                <div className="p-3">
                  <textarea
                    className="w-full border border-ink-200 rounded-xl p-3 text-xs text-ink resize-none focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 transition-all placeholder:text-ink-300 bg-white"
                    rows={5}
                    placeholder="Add evaluation notes, interview feedback or reasons for decision…"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </SectionCard>

              {/* Save button */}
              <button
                onClick={save}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-ink text-white text-xs py-3.5 rounded-xl hover:bg-teal transition-colors font-semibold disabled:opacity-50 shadow-sm"
              >
                {saving
                  ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
                  : <><CheckCircle2 size={13} /> Save Evaluation</>
                }
              </button>

              {app.resumePath && (
                <a
                  href={`/uploads/${app.resumePath}`}
                  download={app.resumeOriginalName || 'resume'}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 border-2 border-ink-200 text-ink text-xs px-4 py-3 w-full rounded-xl hover:border-ink hover:bg-ink hover:text-white transition-all font-medium"
                >
                  <Download size={13} /> Download Resume
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-50">
        <span className="text-teal"><Icon size={13} /></span>
        <p className="text-[10px] uppercase tracking-widest font-bold text-ink-400">{title}</p>
      </div>
      {children}
    </div>
  )
}

function DetailRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-ink-50 last:border-0">
      <span className="text-ink-300 flex-shrink-0">{icon}</span>
      <span className="text-[11px] text-ink-400 w-16 flex-shrink-0">{label}</span>
      <span className="text-xs text-ink font-medium flex-1 truncate">{value}</span>
    </div>
  )
}

function LinkDetail({ icon, label, url }) {
  if (!url) return null
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-ink-50 last:border-0">
      <span className="text-ink-300 flex-shrink-0">{icon}</span>
      <span className="text-[11px] text-ink-400 w-16 flex-shrink-0">{label}</span>
      <a
        href={url} target="_blank" rel="noreferrer"
        className="text-xs text-teal hover:underline flex items-center gap-1 flex-1 truncate font-medium"
      >
        {url.replace(/^https?:\/\//, '').slice(0, 36)}
        <ExternalLink size={10} className="flex-shrink-0" />
      </a>
    </div>
  )
}

function EmptyState({ icon, text, padded }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${padded ? 'py-16' : 'py-8 px-4'}`}>
      <span className="text-ink-200 mb-2">{icon}</span>
      <p className="text-xs text-ink-300 italic">{text}</p>
    </div>
  )
}