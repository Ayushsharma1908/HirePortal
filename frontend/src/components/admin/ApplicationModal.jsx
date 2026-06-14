import React, { useState } from 'react'
import { X, Download, ExternalLink, GraduationCap, Briefcase, Zap, Star, Award } from 'lucide-react'
import { STATUS_OPTIONS } from '../../utils/constants'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  New:          { active: 'bg-ink text-white border-ink',               idle: 'border-ink-200 text-ink-400 hover:border-ink hover:text-ink' },
  'In Review':  { active: 'bg-amber text-white border-amber',           idle: 'border-amber/40 text-amber-700 hover:border-amber hover:bg-amber-muted' },
  Shortlisted:  { active: 'bg-teal text-white border-teal',             idle: 'border-teal/40 text-teal hover:border-teal hover:bg-teal-muted' },
  Hired:        { active: 'bg-green-600 text-white border-green-600',   idle: 'border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50' },
  Rejected:     { active: 'bg-red-500 text-white border-red-500',       idle: 'border-red-200 text-red-400 hover:border-red-400 hover:bg-red-50' },
}

// Tabs
const TABS = ['Profile', 'Education & Exp', 'Skills', 'Evaluate']

export default function ApplicationModal({ application: app, onClose, onStatusChange }) {
  const [status, setStatus] = useState(app.status)
  const [notes, setNotes] = useState(app.adminNotes || '')
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('Profile')

  const save = async () => {
    setSaving(true)
    try {
      const res = await api.patch(`/applications/${app._id}/status`, { status, notes })
      onStatusChange(res.data)
      toast.success('Status updated')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  const educations = app.educations?.length > 0
    ? app.educations
    : app.education?.length > 0
    ? app.education
    : app.institution ? [{ institution: app.institution, degree: app.degree, fieldOfStudy: app.fieldOfStudy, grade: app.grade }] : []

  const experiences = app.workExperience || []

  return (
    <>
      <div className="fixed inset-0 bg-ink/30 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right">

        {/* Header */}
        <div className="border-b border-ink-100 px-5 py-4 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ink text-white text-sm font-medium flex items-center justify-center flex-shrink-0">
                {`${app.firstName?.[0] || ''}${app.lastName?.[0] || ''}`.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">{app.firstName} {app.lastName}</p>
                <p className="text-xs text-ink-400">{app.jobRole} · {app.department}</p>
                <p className="text-xs text-ink-300">{app.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-ink-50 flex-shrink-0"><X size={15} /></button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-ink-100 flex-shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${tab === t ? 'border-ink text-ink font-medium' : 'border-transparent text-ink-400 hover:text-ink'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* ── PROFILE TAB ── */}
          {tab === 'Profile' && (
            <div className="space-y-4 animate-fade-in">
              <InfoBlock title="Personal Details">
                <InfoRow label="Email"       value={app.email} />
                <InfoRow label="Phone"       value={app.phone} />
                <InfoRow label="Location"    value={[app.city, app.state].filter(Boolean).join(', ')} />
                <InfoRow label="Gender"      value={app.gender} />
                <InfoRow label="Experience"  value={app.experienceLevel} />
                <InfoRow label="Applied On"  value={new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} />
              </InfoBlock>

              {(app.githubUrl || app.linkedinUrl || app.portfolioUrl) && (
                <InfoBlock title="Links">
                  {app.githubUrl && <LinkRow label="GitHub" url={app.githubUrl} />}
                  {app.linkedinUrl && <LinkRow label="LinkedIn" url={app.linkedinUrl} />}
                  {app.portfolioUrl && <LinkRow label="Portfolio" url={app.portfolioUrl} />}
                </InfoBlock>
              )}

              {app.coverLetter && (
                <InfoBlock title="Cover Letter">
                  <p className="text-xs text-ink-600 leading-relaxed whitespace-pre-line">{app.coverLetter}</p>
                </InfoBlock>
              )}

              {app.resumePath && (
                <a href={`/uploads/${app.resumePath}`} download={app.resumeOriginalName || 'resume'}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-ink text-white text-xs px-4 py-3 w-full hover:bg-ink-800 transition-colors">
                  <Download size={13} /> Download Resume
                </a>
              )}
            </div>
          )}

          {/* ── EDUCATION & EXPERIENCE TAB ── */}
          {tab === 'Education & Exp' && (
            <div className="space-y-4 animate-fade-in">
              {/* Education entries */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap size={13} className="text-ink-400" />
                  <p className="text-xs font-semibold text-ink uppercase tracking-wide">
                    Qualifications ({educations.length})
                  </p>
                </div>
                {educations.length === 0 ? (
                  <p className="text-xs text-ink-300 italic">No qualifications added</p>
                ) : (
                  <div className="space-y-2">
                    {educations.map((edu, i) => (
                      <div key={i} className="border border-ink-100 p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="w-5 h-5 bg-ink text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                          <div>
                            <p className="text-xs font-semibold text-ink">{edu.degree}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ''}</p>
                            <p className="text-xs text-ink-600">{edu.institution}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {edu.grade && <span className="text-xs text-teal font-medium">{edu.grade}</span>}
                              {(edu.startYear || edu.endYear) && (
                                <span className="text-xs text-ink-300">{edu.startYear} – {edu.endYear || 'Present'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Work experience entries */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={13} className="text-ink-400" />
                  <p className="text-xs font-semibold text-ink uppercase tracking-wide">
                    Work Experience ({experiences.length})
                  </p>
                </div>
                {experiences.length === 0 ? (
                  <p className="text-xs text-ink-300 italic">No work experience added — may be a fresher</p>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-2.5 top-0 bottom-0 w-px bg-ink-100" />
                    <div className="space-y-3">
                      {experiences.map((exp, i) => (
                        <div key={i} className="relative pl-8">
                          <div className="absolute left-0 top-1 w-5 h-5 bg-teal text-white text-xs flex items-center justify-center rounded-none">{i+1}</div>
                          <div className="border border-ink-100 p-3">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div>
                                <p className="text-xs font-semibold text-ink">{exp.jobTitle}</p>
                                <p className="text-xs text-ink-600 font-medium">{exp.company}</p>
                              </div>
                              <span className="text-xs bg-ink-50 border border-ink-100 text-ink-400 px-2 py-0.5 flex-shrink-0">
                                {exp.employmentType}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-ink-400 mb-1">
                              {exp.location && <span>{exp.location}</span>}
                              <span>
                                {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                {' – '}
                                {exp.isCurrentJob ? <span className="text-teal font-medium">Present</span>
                                  : exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-xs text-ink-500 leading-relaxed border-t border-ink-50 pt-2 mt-2">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SKILLS TAB ── */}
          {tab === 'Skills' && (
            <div className="space-y-4 animate-fade-in">

              {/* Technical Skills */}
              {app.technicalSkills?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={12} className="text-teal" />
                    <p className="text-xs font-semibold text-ink uppercase tracking-wide">Technical Skills</p>
                    <span className="ml-auto text-xs text-ink-300">{app.technicalSkills.length} skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {app.technicalSkills.map(s => (
                      <span key={s} className="inline-flex items-center px-3 py-1.5 bg-ink text-white text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {app.softSkills?.length > 0 && (
                <div className="border-t border-ink-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={12} className="text-amber-500" />
                    <p className="text-xs font-semibold text-ink uppercase tracking-wide">Soft Skills</p>
                    <span className="ml-auto text-xs text-ink-300">{app.softSkills.length} skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {app.softSkills.map(s => (
                      <span key={s} className="inline-flex items-center px-3 py-1.5 border border-ink-200 bg-ink-50 text-ink text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {app.certifications?.length > 0 && (
                <div className="border-t border-ink-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={12} className="text-purple-500" />
                    <p className="text-xs font-semibold text-ink uppercase tracking-wide">Certifications</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {app.certifications.map(c => (
                      <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-muted border border-teal/20 text-teal-dark text-xs">
                        <Award size={10} /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!app.technicalSkills?.length && !app.softSkills?.length && !app.certifications?.length && (
                <div className="py-12 text-center">
                  <Zap size={28} className="mx-auto mb-2 text-ink-200" />
                  <p className="text-xs text-ink-400">No skills recorded for this applicant</p>
                </div>
              )}
            </div>
          )}

          {/* ── EVALUATE TAB ── */}
          {tab === 'Evaluate' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <p className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">Set Status</p>
                <div className="grid grid-cols-1 gap-2">
                  {STATUS_OPTIONS.map(s => {
                    const style = STATUS_STYLES[s]
                    return (
                      <button key={s} onClick={() => setStatus(s)}
                        className={`px-4 py-2.5 text-xs border text-left flex items-center gap-2.5 transition-all ${status === s ? style.active : `bg-white ${style.idle}`}`}>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status === s ? 'bg-white/70' : ''}`}
                          style={status !== s ? { background: s === 'New' ? '#7a7b84' : s === 'In Review' ? '#f59e0b' : s === 'Shortlisted' ? '#0d9488' : s === 'Hired' ? '#16a34a' : '#ef4444' } : {}} />
                        {s}
                        {status === s && <span className="ml-auto text-xs opacity-60">● Selected</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-ink uppercase tracking-wide mb-2">Admin Notes</p>
                <textarea className="input resize-none text-xs" rows={5}
                  placeholder="Add evaluation notes, interview feedback, or reasons for your decision..."
                  value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <button onClick={save} disabled={saving}
                className="w-full bg-ink text-white text-xs py-3 hover:bg-ink-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />Saving...</> : 'Save Evaluation'}
              </button>

              {app.resumePath && (
                <a href={`/uploads/${app.resumePath}`} download={app.resumeOriginalName || 'resume'}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 border border-ink-200 text-ink text-xs px-4 py-2.5 w-full hover:bg-ink hover:text-white transition-colors">
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

function InfoBlock({ title, children }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide font-semibold text-ink-400 mb-2">{title}</p>
      <div className="border border-ink-100 divide-y divide-ink-50">{children}</div>
    </div>
  )
}
function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex px-3 py-2.5 gap-3">
      <span className="text-xs text-ink-400 w-24 flex-shrink-0">{label}</span>
      <span className="text-xs text-ink font-medium flex-1">{value}</span>
    </div>
  )
}
function LinkRow({ label, url }) {
  return (
    <div className="flex px-3 py-2.5 gap-3 items-center">
      <span className="text-xs text-ink-400 w-24 flex-shrink-0">{label}</span>
      <a href={url} target="_blank" rel="noreferrer"
        className="text-xs text-teal hover:underline flex items-center gap-1 flex-1 truncate">
        {url.replace(/^https?:\/\//, '').slice(0, 38)} <ExternalLink size={10} className="flex-shrink-0" />
      </a>
    </div>
  )
}