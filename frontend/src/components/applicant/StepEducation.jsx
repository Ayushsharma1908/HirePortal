import React from 'react'
import { useForm } from 'react-hook-form'
import { useFormCtx } from '../../context/FormContext'
import FormField from '../shared/FormField'
import { fieldRules, inputClass } from '../../utils/validation'

export default function StepEducation({ onNext, onBack }) {
  const { formData, updateForm } = useFormCtx()
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: formData, mode: 'onTouched' })

  const onSubmit = (data) => {
    updateForm(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in">
      <h2 className="form-step-title mb-1">Education</h2>
      <p className="text-xs text-ink-400 mb-6">Your academic background and professional links</p>

      <FormField label="Institution / University" required error={errors.institution?.message} className="mb-4">
        <input className={inputClass(errors.institution)} placeholder="IIT Bombay" {...register('institution', fieldRules.institution)} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormField label="Degree" required error={errors.degree?.message}>
          <select className={inputClass(errors.degree)} {...register('degree', fieldRules.degree)}>
            <option value="">Select degree</option>
            {['B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'BCA', 'B.Des', 'MBA', 'M.Tech', 'M.Sc', 'MCA', 'PhD', 'Diploma', 'Other'].map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Field of Study" required error={errors.fieldOfStudy?.message}>
          <input className={inputClass(errors.fieldOfStudy)} placeholder="Computer Science" {...register('fieldOfStudy', fieldRules.fieldOfStudy)} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <FormField label="Grade / CGPA" error={errors.grade?.message} hint="e.g. 8.5 or 85%">
          <input className={inputClass(errors.grade)} placeholder="8.5 CGPA" {...register('grade', fieldRules.grade)} />
        </FormField>
        <FormField label="Start Year" error={errors.startYear?.message}>
          <input className={inputClass(errors.startYear)} placeholder="2018" maxLength={4} {...register('startYear', fieldRules.startYear)} />
        </FormField>
        <FormField label="End Year" error={errors.endYear?.message}>
          <input className={inputClass(errors.endYear)} placeholder="2022" maxLength={4} {...register('endYear', fieldRules.endYear)} />
        </FormField>
      </div>

      <div className="form-section mb-6">
        <p className="text-xs uppercase tracking-wide font-medium text-teal-dark mb-4">Social Links</p>
        <div className="space-y-4">
          <FormField label="GitHub URL" error={errors.githubUrl?.message} hint="Optional">
            <input className={inputClass(errors.githubUrl)} placeholder="https://github.com/username" {...register('githubUrl', fieldRules.githubUrl)} />
          </FormField>
          <FormField label="LinkedIn URL" error={errors.linkedinUrl?.message} hint="Optional">
            <input className={inputClass(errors.linkedinUrl)} placeholder="https://linkedin.com/in/username" {...register('linkedinUrl', fieldRules.linkedinUrl)} />
          </FormField>
          <FormField label="Portfolio URL" error={errors.portfolioUrl?.message} hint="Optional">
            <input className={inputClass(errors.portfolioUrl)} placeholder="https://yourportfolio.com" {...register('portfolioUrl', fieldRules.portfolioUrl)} />
          </FormField>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-outline">← Back</button>
        <button type="submit" className="btn-primary px-8">Continue →</button>
      </div>
    </form>
  )
}
