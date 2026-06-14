import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import FormField from '../shared/FormField'
import { DEPARTMENTS, JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants'
import { inputClass } from '../../utils/validation'

export default function CreateJobModal({ onClose, onCreated }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onTouched' })
  const [loading, setLoading] = useState(false)
  const [reqInput, setReqInput] = useState('')
  const [requirements, setRequirements] = useState([])
  const [reqError, setReqError] = useState('')

  const addReq = () => {
    const trimmed = reqInput.trim()
    if (!trimmed) return
    if (trimmed.length < 2) {
      setReqError('Requirement must be at least 2 characters')
      return
    }
    setRequirements(p => [...p, trimmed])
    setReqInput('')
    setReqError('')
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await api.post('/jobs', { ...data, requirements })
      onCreated(res.data)
      toast.success('Job posted successfully!')
      onClose()
    } catch {
      toast.error('Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-ink/30 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-ink-100 shadow-lift animate-slide-up">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-ink-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-teal font-medium">New opening</p>
              <h2 className="font-semibold text-sm text-ink">Post New Job</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-ink-50 rounded-xl border border-transparent hover:border-ink-100 transition-all">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <FormField label="Job Title" required error={errors.title?.message}>
              <input
                className={inputClass(errors.title)}
                placeholder="Frontend Developer"
                {...register('title', { required: 'Job title is required', minLength: { value: 2, message: 'Title must be at least 2 characters' } })}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Department" required error={errors.department?.message}>
                <select className={inputClass(errors.department)} {...register('department', { required: 'Select a department' })}>
                  <option value="">Select</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </FormField>
              <FormField label="Location" required error={errors.location?.message}>
                <input
                  className={inputClass(errors.location)}
                  placeholder="Remote"
                  {...register('location', { required: 'Location is required' })}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Job Type">
                <select className="input" {...register('type')}>
                  {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </FormField>
              <FormField label="Experience Level">
                <select className="input" {...register('experienceLevel')}>
                  {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </FormField>
            </div>

            <FormField label="Salary Range" hint="Optional">
              <input className="input" placeholder="₹12-18 LPA" {...register('salary')} />
            </FormField>

            <FormField label="Description" error={errors.description?.message}>
              <textarea
                className={inputClass(errors.description)}
                rows={3}
                placeholder="Describe the role..."
                {...register('description', { minLength: { value: 10, message: 'Description should be at least 10 characters' } })}
              />
            </FormField>

            <FormField label="Requirements" error={reqError} hint="Optional — add key requirements">
              <div className="flex gap-2 mb-2">
                <input
                  className="input flex-1"
                  placeholder="e.g. React, 3+ years"
                  value={reqInput}
                  onChange={e => { setReqInput(e.target.value); setReqError('') }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addReq())}
                />
                <button type="button" onClick={addReq} className="btn-outline text-xs px-4">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {requirements.map(r => (
                  <span key={r} className="px-2.5 py-1 bg-ink-50 text-xs border border-ink-100 rounded-full flex items-center gap-1.5">
                    {r}
                    <button type="button" onClick={() => setRequirements(p => p.filter(x => x !== r))} className="text-ink-300 hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            </FormField>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
