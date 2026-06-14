import React, { createContext, useContext, useState, useEffect } from 'react'

const FormContext = createContext(null)

const STORAGE_KEY = 'job_portal_draft'

const initialData = {
  firstName: '', lastName: '', email: '', phone: '', dob: '', gender: '', address: '', city: '', state: '',
  department: '', jobRole: '', experienceLevel: 'Entry Level',
  institution: '', degree: '', fieldOfStudy: '', grade: '', startYear: '', endYear: '',
  technicalSkills: [], softSkills: [], certifications: [], languages: [],
  githubUrl: '', linkedinUrl: '', portfolioUrl: '', coverLetter: '',
  resume: null, profileImage: null,
}

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...initialData, ...JSON.parse(saved) } : initialData
    } catch { return initialData }
  })
  const [currentStep, setCurrentStep] = useState(0)

  // Auto-save (exclude file objects)
  useEffect(() => {
    const { resume, profileImage, ...saveable } = formData
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveable))
  }, [formData])

  const updateForm = (data) => setFormData(prev => ({ ...prev, ...data }))

  const clearForm = () => {
    setFormData(initialData)
    localStorage.removeItem(STORAGE_KEY)
    setCurrentStep(0)
  }

  return (
    <FormContext.Provider value={{ formData, updateForm, clearForm, currentStep, setCurrentStep }}>
      {children}
    </FormContext.Provider>
  )
}

export const useFormCtx = () => useContext(FormContext)
