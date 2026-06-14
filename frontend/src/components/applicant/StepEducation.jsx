import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormCtx } from '../../context/FormContext'
import FormField from '../shared/FormField'
import { fieldRules, inputClass } from '../../utils/validation'
import { Plus, Trash2, Award, BookOpen } from 'lucide-react'

export default function StepEducation({ onNext, onBack }) {
  const { formData, updateForm } = useFormCtx()
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    defaultValues: formData, 
    mode: 'onTouched' 
  })

  // Multiple education entries
  const [educations, setEducations] = useState(formData.educations || [{
    id: Date.now(),
    institution: '',
    degree: '',
    fieldOfStudy: '',
    grade: '',
    startYear: '',
    endYear: ''
  }])

  // Additional qualifications
  const [qualifications, setQualifications] = useState(formData.additionalQualifications || [])

  const addEducation = () => {
    setEducations([...educations, {
      id: Date.now() + Math.random(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      grade: '',
      startYear: '',
      endYear: ''
    }])
  }

  const removeEducation = (id) => {
    if (educations.length === 1) return
    setEducations(educations.filter(edu => edu.id !== id))
  }

  const updateEducation = (id, field, value) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  const addQualification = () => {
    setQualifications([...qualifications, {
      id: Date.now() + Math.random(),
      title: '',
      issuer: '',
      date: '',
      description: ''
    }])
  }

  const removeQualification = (id) => {
    setQualifications(qualifications.filter(q => q.id !== id))
  }

  const updateQualification = (id, field, value) => {
    setQualifications(qualifications.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const onSubmit = (data) => {
    updateForm({ 
      ...data, 
      educations,
      additionalQualifications: qualifications 
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in">
      <h2 className="text-base font-semibold text-ink mb-1">Education & Qualifications</h2>
      <p className="text-xs text-ink-400 mb-6">Add your academic background and additional certifications</p>

      {/* Education Entries */}
      <div className="space-y-6 mb-8">
        {educations.map((edu, index) => (
          <div key={edu.id} className="relative border border-ink-200 p-5 bg-white">
            {/* Delete button */}
            {educations.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="absolute top-3 right-3 p-1.5 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                title="Remove education"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-teal" />
              <span className="text-sm font-medium text-ink">
                {index === 0 ? 'Primary Education' : `Additional Education ${index}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Institution / University" required={index === 0}>
                <input 
                  className={inputClass()}
                  placeholder="IIT Bombay"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                />
              </FormField>

              <FormField label="Degree" required={index === 0}>
                <select 
                  className={inputClass()}
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                >
                  <option value="">Select degree</option>
                  {['B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'BCA', 'B.Des', 'MBA', 'M.Tech', 'M.Sc', 'MCA', 'PhD', 'Diploma', 'Other'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Field of Study" required={index === 0}>
                <input 
                  className={inputClass()}
                  placeholder="Computer Science"
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                />
              </FormField>

              <FormField label="Grade / CGPA" hint="e.g. 8.5 or 85%">
                <input 
                  className={inputClass()}
                  placeholder="8.5 CGPA"
                  value={edu.grade}
                  onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                />
              </FormField>

              <FormField label="Start Year">
                <input 
                  className={inputClass()}
                  placeholder="2018"
                  maxLength={4}
                  value={edu.startYear}
                  onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                />
              </FormField>

              <FormField label="End Year">
                <input 
                  className={inputClass()}
                  placeholder="2022"
                  maxLength={4}
                  value={edu.endYear}
                  onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                />
              </FormField>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addEducation}
          className="w-full py-3 border-2 border-dashed border-ink-300 text-ink-400 hover:border-teal hover:text-teal transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Add Another Education
        </button>
      </div>

      {/* Additional Qualifications */}
      <div className="border-t border-ink-200 pt-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award size={16} className="text-teal" />
          <h3 className="text-sm font-semibold text-ink">Additional Qualifications</h3>
        </div>
        <p className="text-xs text-ink-400 mb-4">Certifications, courses, or other qualifications</p>

        <div className="space-y-4">
          {qualifications.map((qual) => (
            <div key={qual.id} className="relative border border-ink-200 p-4 bg-ink-50">
              <button
                type="button"
                onClick={() => removeQualification(qual.id)}
                className="absolute top-2 right-2 p-1 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
              >
                <Trash2 size={14} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Qualification Title" required>
                  <input 
                    className={inputClass()}
                    placeholder="e.g., AWS Solutions Architect"
                    value={qual.title}
                    onChange={(e) => updateQualification(qual.id, 'title', e.target.value)}
                  />
                </FormField>

                <FormField label="Issuing Organization">
                  <input 
                    className={inputClass()}
                    placeholder="e.g., Amazon Web Services"
                    value={qual.issuer}
                    onChange={(e) => updateQualification(qual.id, 'issuer', e.target.value)}
                  />
                </FormField>

                <FormField label="Date Obtained">
                  <input 
                    type="date"
                    className={inputClass()}
                    value={qual.date}
                    onChange={(e) => updateQualification(qual.id, 'date', e.target.value)}
                  />
                </FormField>

                <FormField label="Description (Optional)">
                  <input 
                    className={inputClass()}
                    placeholder="Brief description"
                    value={qual.description}
                    onChange={(e) => updateQualification(qual.id, 'description', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQualification}
            className="w-full py-2.5 border-2 border-dashed border-ink-300 text-ink-400 hover:border-teal hover:text-teal transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} />
            Add Qualification
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div className="border-t border-ink-200 pt-6 mb-6">
        <p className="text-xs uppercase tracking-wide font-medium text-ink mb-4">Social Links</p>
        <div className="space-y-4">
          <FormField label="GitHub URL" hint="Optional">
            <input className={inputClass()} placeholder="https://github.com/username" {...register('githubUrl', fieldRules.githubUrl)} />
          </FormField>
          <FormField label="LinkedIn URL" hint="Optional">
            <input className={inputClass()} placeholder="https://linkedin.com/in/username" {...register('linkedinUrl', fieldRules.linkedinUrl)} />
          </FormField>
          <FormField label="Portfolio URL" hint="Optional">
            <input className={inputClass()} placeholder="https://yourportfolio.com" {...register('portfolioUrl', fieldRules.portfolioUrl)} />
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