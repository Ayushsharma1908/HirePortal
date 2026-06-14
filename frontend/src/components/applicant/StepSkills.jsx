import React, { useState } from 'react'
import { useFormCtx } from '../../context/FormContext'
import SkillChip from '../shared/SkillChip'
import { SKILL_CATEGORIES, SOFT_SKILLS } from '../../utils/constants'
import { Plus } from 'lucide-react'

const CATEGORY_KEYS = ['All', ...Object.keys(SKILL_CATEGORIES)]

export default function StepSkills({ onNext, onBack }) {
  const { formData, updateForm } = useFormCtx()

  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedSkills, setSelectedSkills] = useState(formData.technicalSkills || [])
  const [softSkills, setSoftSkills]         = useState(formData.softSkills || [])
  const [certifications, setCertifications] = useState(formData.certifications || [])

  // Custom skill input state
  const [customSkillInput, setCustomSkillInput]   = useState('')
  const [certInput, setCertInput]                 = useState('')
  const [softInput, setSoftInput]                 = useState('')

  const [error, setError] = useState('')

  // ── Skills pool for active category tab ──────────────────────────────
  const poolSkills = activeCategory === 'All'
    ? Object.values(SKILL_CATEGORIES).flatMap(c => c.skills)
    : SKILL_CATEGORIES[activeCategory]?.skills || []

  const visibleSuggestions = poolSkills.filter(s => !selectedSkills.includes(s))

  // ── Handlers ─────────────────────────────────────────────────────────
  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
    setError('')
  }

  const addCustomSkill = () => {
    const val = customSkillInput.trim()
    if (!val) return
    if (!selectedSkills.includes(val)) setSelectedSkills(p => [...p, val])
    setCustomSkillInput('')
    setError('')
  }

  const addSoftSkill = (skill) => {
    if (!softSkills.includes(skill)) setSoftSkills(p => [...p, skill])
  }
  const addCustomSoft = () => {
    const val = softInput.trim()
    if (!val) return
    if (!softSkills.includes(val)) setSoftSkills(p => [...p, val])
    setSoftInput('')
  }

  const addCert = () => {
    const val = certInput.trim()
    if (!val) return
    if (!certifications.includes(val)) setCertifications(p => [...p, val])
    setCertInput('')
  }

  const handleNext = () => {
    if (selectedSkills.length === 0) { setError('Add at least one skill to continue'); return }
    updateForm({ technicalSkills: selectedSkills, softSkills, certifications })
    onNext()
  }

  const softSuggestions = SOFT_SKILLS.filter(s => !softSkills.includes(s))

  return (
    <div className="animate-fade-in">
      <h2 className="text-base font-semibold text-ink mb-1">Skills & Expertise</h2>
      <p className="text-xs text-ink-400 mb-5">
        Select from the category that matches your field, or type any skill below.
      </p>

      {/* ── Category tab bar ── */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {CATEGORY_KEYS.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs border transition-all ${
              activeCategory === cat
                ? 'bg-ink text-white border-ink'
                : 'bg-white border-ink-200 text-ink-400 hover:border-ink hover:text-ink'
            }`}
          >
            {cat === 'All' ? 'All Skills' : SKILL_CATEGORIES[cat].label}
          </button>
        ))}
      </div>

      {/* ── Selected skills (always visible) ── */}
      {selectedSkills.length > 0 && (
        <div className="mb-4 p-3 bg-ink-50 border border-ink-100">
          <p className="text-xs text-ink-400 mb-2 uppercase tracking-wide font-medium">
            Selected ({selectedSkills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(s => (
              <SkillChip key={s} label={s} onRemove={() => toggleSkill(s)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Skill suggestion grid ── */}
      <div className="mb-3">
        <p className="text-xs text-ink-400 mb-2">
          {activeCategory === 'All' ? 'All categories' : SKILL_CATEGORIES[activeCategory]?.label} — click to add
        </p>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
          {visibleSuggestions.map(s => (
            <SkillChip key={s} label={s} suggested onAdd={() => toggleSkill(s)} />
          ))}
          {visibleSuggestions.length === 0 && (
            <p className="text-xs text-ink-300 py-2">All skills in this category are selected.</p>
          )}
        </div>
      </div>

      {/* ── Custom skill input ── */}
      <div className="mb-6">
        <label className="label">Can't find your skill? Add it manually</label>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="e.g. Blender, Canva, Selenium, Zapier..."
            value={customSkillInput}
            onChange={e => setCustomSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill() } }}
          />
          <button type="button" onClick={addCustomSkill}
            className="btn-outline px-4 flex items-center gap-1.5">
            <Plus size={12} /> Add
          </button>
        </div>
        {error && <p className="error-msg mt-1.5">{error}</p>}
      </div>

      {/* ── Soft Skills ── */}
      <div className="border-t border-ink-100 pt-5 mb-6">
        <label className="label">Soft Skills</label>
        {softSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {softSkills.map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-ink-50 border border-ink-100 text-ink">
                {s}
                <button type="button" onClick={() => setSoftSkills(p => p.filter(x => x !== s))}
                  className="hover:text-red-400 transition-colors">×</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-3">
          {softSuggestions.map(s => (
            <SkillChip key={s} label={s} suggested onAdd={() => addSoftSkill(s)} />
          ))}
        </div>
        {/* Custom soft skill */}
        <div className="flex gap-2 mt-2">
          <input
            className="input flex-1"
            placeholder="Add a soft skill, e.g. Negotiation, Empathy..."
            value={softInput}
            onChange={e => setSoftInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSoft() } }}
          />
          <button type="button" onClick={addCustomSoft}
            className="btn-outline px-4 flex items-center gap-1.5">
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      {/* ── Certifications ── */}
      <div className="border-t border-ink-100 pt-5 mb-6">
        <label className="label">Certifications</label>
        {certifications.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {certifications.map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-teal-muted text-teal-dark border border-teal/20">
                {c}
                <button type="button" onClick={() => setCertifications(p => p.filter(x => x !== c))}
                  className="hover:text-red-500 transition-colors">×</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="e.g. AWS Solutions Architect, Google Analytics, PMP..."
            value={certInput}
            onChange={e => setCertInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCert() } }}
          />
          <button type="button" onClick={addCert}
            className="btn-outline px-4 flex items-center gap-1.5">
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-outline">← Back</button>
        <button type="button" onClick={handleNext} className="btn-primary">Continue →</button>
      </div>
    </div>
  )
}