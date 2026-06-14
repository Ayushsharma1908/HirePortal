import React, { useState, useRef, useEffect } from 'react'
import { useFormCtx } from '../../context/FormContext'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Loader2, RefreshCw, ShieldCheck, Briefcase, Award, BookOpen } from 'lucide-react'

// ─── Canvas CAPTCHA (Keep same as before) ───
function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function CaptchaCanvas({ code }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    ctx.fillStyle = '#f5f5f7'
    ctx.fillRect(0, 0, W, H)

    for (let i = 0; i < 120; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(28,29,33,${Math.random() * 0.12})`
      ctx.fill()
    }

    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * W, Math.random() * H)
      ctx.bezierCurveTo(
        Math.random() * W, Math.random() * H,
        Math.random() * W, Math.random() * H,
        Math.random() * W, Math.random() * H
      )
      ctx.strokeStyle = `rgba(13,148,136,${Math.random() * 0.25 + 0.05})`
      ctx.lineWidth = Math.random() * 1.5 + 0.5
      ctx.stroke()
    }

    const fonts = ['bold', '600', '500']
    const colors = ['#1C1D21', '#0d9488', '#854F0B', '#4c1d95', '#0F6E56', '#185FA5']
    const charW = W / (code.length + 1)

    code.split('').forEach((ch, i) => {
      const x = charW * (i + 0.8) + (Math.random() * 6 - 3)
      const y = H / 2 + (Math.random() * 10 - 5)
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180)
      const size = Math.floor(Math.random() * 8 + 20)

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.font = `${fonts[Math.floor(Math.random() * fonts.length)]} ${size}px Poppins, sans-serif`
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      ctx.shadowColor = 'rgba(0,0,0,0.15)'
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      ctx.fillText(ch, 0, 0)
      ctx.restore()
    })

    for (let i = 0; i < 40; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * W, Math.random() * H, Math.random(), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(28,29,33,${Math.random() * 0.08})`
      ctx.fill()
    }
  }, [code])

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={64}
      className="border border-ink-200 select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    />
  )
}

function CaptchaBox({ onVerify }) {
  const [code, setCode] = useState(() => generateCode())
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle')
  const [attempts, setAttempts] = useState(0)

  const refresh = () => {
    setCode(generateCode())
    setInput('')
    setStatus('idle')
    onVerify(false)
  }

  const verify = () => {
    if (input.trim() === code) {
      setStatus('success')
      onVerify(true)
    } else {
      setStatus('error')
      setAttempts(a => a + 1)
      onVerify(false)
      if (attempts >= 1) {
        setTimeout(() => {
          setCode(generateCode())
          setInput('')
          setStatus('idle')
          setAttempts(0)
        }, 900)
      }
    }
  }

  return (
    <div className="border border-ink-200 p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-ink uppercase tracking-wide flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-teal" />
          Human Verification
        </p>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1 text-xs text-ink-400 hover:text-ink transition-colors"
        >
          <RefreshCw size={11} /> New code
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <CaptchaCanvas code={code} />
          {status === 'success' && (
            <div className="absolute inset-0 bg-teal/10 border border-teal flex items-center justify-center">
              <ShieldCheck size={22} className="text-teal" />
            </div>
          )}
        </div>
        <p className="text-xs text-ink-300 leading-relaxed max-w-[100px]">
          Type the characters — case-sensitive
        </p>
      </div>

      {status !== 'success' && (
        <div className="flex gap-2">
          <input
            className={`input flex-1 text-sm tracking-widest font-medium ${status === 'error' ? 'border-red-300 bg-red-50' : ''}`}
            placeholder="Enter code"
            value={input}
            maxLength={8}
            onChange={e => { setInput(e.target.value); if (status === 'error') setStatus('idle') }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); verify() } }}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={verify}
            disabled={!input.trim()}
            className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verify
          </button>
        </div>
      )}

      {status === 'error' && (
        <p className="text-xs text-red-500 mt-1.5">✗ Incorrect — try again {attempts >= 1 && '(refreshing…)'}</p>
      )}
      {status === 'success' && (
        <p className="text-xs text-teal mt-1.5 font-medium">✓ Verified successfully</p>
      )}
    </div>
  )
}

// ─── Review Row Component ───
function ReviewRow({ label, value, icon }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="flex gap-3 py-2.5 border-b border-ink-100 last:border-0">
      <span className="text-xs text-ink-400 w-36 flex-shrink-0 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="text-xs text-ink font-medium">
        {Array.isArray(value) ? value.join(', ') : value}
      </span>
    </div>
  )
}

// ─── Main Step ───
export default function StepReview({ onBack }) {
  const { formData, clearForm } = useFormCtx()
  const [verified, setVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!verified) { toast.error('Please complete the CAPTCHA verification first'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      const { resume, profileImage, ...rest } = formData
      fd.append('data', JSON.stringify(rest))
      if (resume) fd.append('resume', resume)
      if (profileImage) fd.append('profileImage', profileImage)

      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      clearForm()
      navigate('/apply/success')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-base font-semibold text-ink mb-1">Review & Submit</h2>
      <p className="text-xs text-ink-400 mb-6">Verify your information before submitting</p>

      {/* Personal Info Section */}
      <div className="border border-ink-200 p-5 mb-4 bg-white">
        <p className="text-xs uppercase tracking-wide font-semibold text-ink-400 mb-3">Personal Information</p>
        <ReviewRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
        <ReviewRow label="Email" value={formData.email} />
        <ReviewRow label="Phone" value={formData.phone} />
        <ReviewRow label="Location" value={`${formData.city}, ${formData.state}`} />
        <ReviewRow label="Applying For" value={`${formData.jobRole} — ${formData.department}`} />
        <ReviewRow label="Experience Level" value={formData.experienceLevel} />
      </div>

      {/* Education Section */}
      <div className="border border-ink-200 p-5 mb-4 bg-white">
        <p className="text-xs uppercase tracking-wide font-semibold text-ink-400 mb-3 flex items-center gap-2">
          <BookOpen size={12} />
          Education
        </p>
        {formData.educations?.map((edu, idx) => (
          <div key={edu.id || idx} className="mb-3 pb-3 border-b border-ink-100 last:mb-0 last:pb-0 last:border-0">
            <p className="text-sm font-medium text-ink">
              {edu.degree} in {edu.fieldOfStudy}
            </p>
            <p className="text-xs text-ink-400">
              {edu.institution} · {edu.startYear} – {edu.endYear} · Grade: {edu.grade || 'N/A'}
            </p>
          </div>
        ))}
        
        {formData.additionalQualifications?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-ink-100">
            <p className="text-xs font-medium text-ink mb-2 flex items-center gap-2">
              <Award size={12} />
              Additional Qualifications
            </p>
            {formData.additionalQualifications.map((qual) => (
              <div key={qual.id} className="text-xs text-ink-400 mb-1">
                <span className="font-medium text-ink">{qual.title}</span>
                {qual.issuer && ` · ${qual.issuer}`}
                {qual.date && ` · ${qual.date}`}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="border border-ink-200 p-5 mb-4 bg-white">
        <p className="text-xs uppercase tracking-wide font-semibold text-ink-400 mb-3">Skills & Expertise</p>
        
        <div className="mb-3">
          <p className="text-xs font-medium text-ink mb-1.5">Technical Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {formData.technicalSkills?.map(skill => (
              <span key={skill} className="px-2 py-1 bg-ink-50 border border-ink-200 text-ink text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {formData.softSkills?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-ink mb-1.5">Soft Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {formData.softSkills?.map(skill => (
                <span key={skill} className="px-2 py-1 bg-teal-50 border border-teal-200 text-teal-dark text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {formData.certifications?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-ink mb-1.5">Certifications</p>
            <div className="flex flex-wrap gap-1.5">
              {formData.certifications?.map(cert => (
                <span key={cert} className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Experience Section */}
      {formData.experiences?.length > 0 && (
        <div className="border border-ink-200 p-5 mb-4 bg-white">
          <p className="text-xs uppercase tracking-wide font-semibold text-ink-400 mb-3 flex items-center gap-2">
            <Briefcase size={12} />
            Work Experience
          </p>
          {formData.experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="mb-3 pb-3 border-b border-ink-100 last:mb-0 last:pb-0 last:border-0">
              <p className="text-sm font-medium text-ink">{exp.jobTitle}</p>
              <p className="text-xs text-ink-400">
                {exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
              </p>
              {exp.description && (
                <p className="text-xs text-ink-400 mt-1">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Documents Section */}
      <div className="border border-ink-200 p-5 mb-5 bg-white">
        <p className="text-xs uppercase tracking-wide font-semibold text-ink-400 mb-3">Documents & Links</p>
        <ReviewRow label="Resume" value={formData.resume?.name || 'Attached'} />
        {formData.githubUrl && <ReviewRow label="GitHub" value={formData.githubUrl} />}
        {formData.linkedinUrl && <ReviewRow label="LinkedIn" value={formData.linkedinUrl} />}
      </div>

      {/* CAPTCHA */}
      <div className="mb-6">
        <CaptchaBox onVerify={setVerified} />
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-outline" disabled={submitting}>
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!verified || submitting}
          className="btn-teal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-8"
        >
          {submitting
            ? <><Loader2 size={14} className="animate-spin" /> Submitting...</>
            : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}