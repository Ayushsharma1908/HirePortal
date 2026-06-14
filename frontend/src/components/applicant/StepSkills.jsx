import React, { useState } from 'react'
import { useFormCtx } from '../../context/FormContext'
import SkillChip from '../shared/SkillChip'
import { SKILL_CATEGORIES, SOFT_SKILLS } from '../../utils/constants'
import { Plus, Trash2, Briefcase, Code, Users } from 'lucide-react'

const CATEGORY_KEYS = ['All', ...Object.keys(SKILL_CATEGORIES)]

export default function StepSkillsAndExperience({ onNext, onBack }) {
  const { formData, updateForm } = useFormCtx()

  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedSkills, setSelectedSkills] = useState(formData.technicalSkills || [])
  const [softSkills, setSoftSkills] = useState(formData.softSkills || [])
  const [certifications, setCertifications] = useState(formData.certifications || [])

  // Experience entries
  const [experiences, setExperiences] = useState(formData.experiences || [])

  // Custom input states
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [certInput, setCertInput] = useState('')
  const [softInput, setSoftInput] = useState('')
  const [error, setError] = useState('')

  // Skills pool for active category tab
  const poolSkills = activeCategory === 'All'
    ? Object.values(SKILL_CATEGORIES).flatMap(c => c.skills)
    : SKILL_CATEGORIES[activeCategory]?.skills || []

  const visibleSuggestions = poolSkills.filter(s => !selectedSkills.includes(s))

  // ── Skill Handlers ──
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

  // ── Experience Handlers ──
  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now() + Math.random(),
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      skills: []
    }])
  }

  const removeExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id))
  }

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const handleNext = () => {
    if (selectedSkills.length === 0) { 
      setError('Add at least one skill to continue')
      return 
    }
    updateForm({ 
      technicalSkills: selectedSkills, 
      softSkills, 
      certifications,
      experiences 
    })
    onNext()
  }

  const softSuggestions = SOFT_SKILLS.filter(s => !softSkills.includes(s))

  return (
    <div className="animate-fade-in">
      <h2 className="text-base font-semibold text-ink mb-1">Skills & Experience</h2>
      <p className="text-xs text-ink-400 mb-5">
        Showcase your technical expertise and professional background
      </p>

      {/* ── Technical Skills Section ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Code size={16} className="text-teal" />
          <h3 className="text-sm font-semibold text-ink">Technical Skills</h3>
        </div>

        {/* Category tab bar */}
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

        {/* Selected skills */}
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

        {/* Skill suggestion grid */}
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

        {/* Custom skill input */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Add custom skill (e.g., Blender, Selenium)"
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
      </div>

      {/* ── Soft Skills Section ── */}
      <div className="border-t border-ink-200 pt-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-teal" />
          <h3 className="text-sm font-semibold text-ink">Soft Skills</h3>
        </div>
        
        {softSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {softSkills.map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-teal-50 border border-teal-200 text-teal-dark">
                {s}
                <button type="button" onClick={() => setSoftSkills(p => p.filter(x => x !== s))}
                  className="hover:text-red-400 transition-colors ml-1">×</button>
              </span>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {softSuggestions.map(s => (
            <SkillChip key={s} label={s} suggested onAdd={() => addSoftSkill(s)} />
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Add a soft skill (e.g., Negotiation)"
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

      {/* ── Experience Section ── */}
      <div className="border-t border-ink-200 pt-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-teal" />
            <h3 className="text-sm font-semibold text-ink">Work Experience</h3>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="text-xs text-teal hover:text-teal-dark flex items-center gap-1 font-medium"
          >
            <Plus size={14} /> Add Experience
          </button>
        </div>

        {experiences.length === 0 ? (
          <p className="text-xs text-ink-400 py-4 text-center border border-dashed border-ink-200">
            No experience added yet. Click "Add Experience" if applicable.
          </p>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative border border-ink-200 p-4 bg-white">
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-2 right-2 p-1.5 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                >
                  <Trash2 size={14} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-ink mb-1 block">Company Name *</label>
                    <input
                      className="input w-full"
                      placeholder="e.g., Google"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink mb-1 block">Job Title *</label>
                    <input
                      className="input w-full"
                      placeholder="e.g., Senior Developer"
                      value={exp.jobTitle}
                      onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink mb-1 block">Start Date</label>
                    <input
                      type="month"
                      className="input w-full"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-ink mb-1 block">End Date</label>
                    <div className="space-y-1">
                      <input
                        type="month"
                        className="input w-full"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                      <label className="flex items-center gap-1.5 text-xs text-ink-400">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => {
                            updateExperience(exp.id, 'current', e.target.checked)
                            if (e.target.checked) updateExperience(exp.id, 'endDate', '')
                          }}
                          className="rounded border-ink-300"
                        />
                        Currently working here
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-ink mb-1 block">Description (Optional)</label>
                    <textarea
                      className="input w-full"
                      rows={2}
                      placeholder="Brief description of your role and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Certifications ── */}
      <div className="border-t border-ink-200 pt-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-teal" />
          <h3 className="text-sm font-semibold text-ink">Certifications</h3>
        </div>
        
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
            placeholder="e.g., AWS Solutions Architect, PMP..."
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

// Need to import Award icon
import { Award } from 'lucide-react'