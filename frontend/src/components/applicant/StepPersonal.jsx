import React from 'react'
import { useForm } from 'react-hook-form'
import { useFormCtx } from '../../context/FormContext'
import { Lock } from 'lucide-react'

export default function StepPersonal({ onNext }) {
  const { formData, updateForm } = useFormCtx()
  const isLockedJob = !!formData._lockedJob

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formData,
  })

  const onSubmit = (data) => {
    // If role is locked from URL, preserve it (don't let empty select overwrite)
    updateForm({
      ...data,
      jobRole:    isLockedJob ? formData.jobRole    : data.jobRole,
      department: isLockedJob ? formData.department : data.department,
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in">
      <h2 className="text-base font-semibold text-ink mb-1">Personal Information</h2>
      <p className="text-xs text-ink-400 mb-6">Tell us about yourself</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">First Name *</label>
          <input className="input" placeholder="Arjun" {...register('firstName', { required: 'Required' })} />
          {errors.firstName && <p className="error-msg">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="label">Last Name *</label>
          <input className="input" placeholder="Sharma" {...register('lastName', { required: 'Required' })} />
          {errors.lastName && <p className="error-msg">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Email Address *</label>
          <input className="input" type="email" placeholder="arjun@email.com"
            {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Phone Number *</label>
          <input className="input" placeholder="9876543210"
            {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })} />
          {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Date of Birth</label>
          <input className="input" type="date" {...register('dob')} />
        </div>
        <div>
          <label className="label">Gender</label>
          <select className="input" {...register('gender')}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Address</label>
        <input className="input" placeholder="123 Main Street" {...register('address')} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="label">City *</label>
          <input className="input" placeholder="Mumbai" {...register('city', { required: 'Required' })} />
          {errors.city && <p className="error-msg">{errors.city.message}</p>}
        </div>
        <div>
          <label className="label">State *</label>
          <input className="input" placeholder="Maharashtra" {...register('state', { required: 'Required' })} />
          {errors.state && <p className="error-msg">{errors.state.message}</p>}
        </div>
      </div>

      {/* ── Applying For section ── */}
      <div className="border-t border-ink-100 pt-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs uppercase tracking-wide font-medium text-ink-400">Applying For</p>
          {isLockedJob && (
            <span className="flex items-center gap-1 text-xs text-teal bg-teal-muted px-2 py-0.5 border border-teal/20">
              <Lock size={9} /> Pre-filled from selected opening
            </span>
          )}
        </div>

        {isLockedJob ? (
          /* Locked: show role + dept as read-only display boxes */
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <div className="input bg-ink-50 text-ink-600 cursor-not-allowed flex items-center gap-2">
                <Lock size={11} className="text-ink-300 flex-shrink-0" />
                {formData.department}
              </div>
            </div>
            <div>
              <label className="label">Job Role</label>
              <div className="input bg-ink-50 text-ink-600 cursor-not-allowed flex items-center gap-2">
                <Lock size={11} className="text-ink-300 flex-shrink-0" />
                {formData.jobRole}
              </div>
            </div>
            <div>
              <label className="label">Experience Level</label>
              <select className="input" {...register('experienceLevel')}>
                {['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'].map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* Open application: editable selects */
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department *</label>
              <select className="input" {...register('department', { required: 'Required' })}>
                <option value="">Select department</option>
                {['Engineering', 'Design', 'Data Science', 'Marketing', 'Product', 'Operations'].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {errors.department && <p className="error-msg">{errors.department.message}</p>}
            </div>
            <div>
              <label className="label">Job Role *</label>
              <input className="input" placeholder="Frontend Developer"
                {...register('jobRole', { required: 'Required' })} />
              {errors.jobRole && <p className="error-msg">{errors.jobRole.message}</p>}
            </div>
            <div>
              <label className="label">Experience Level</label>
              <select className="input" {...register('experienceLevel')}>
                {['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'].map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary">Continue →</button>
      </div>
    </form>
  )
}