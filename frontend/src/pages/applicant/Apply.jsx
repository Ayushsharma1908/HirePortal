import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FormProvider } from '../../context/FormContext'
import { useFormCtx } from '../../context/FormContext'
import StepProgress from '../../components/shared/StepProgress'
import StepPersonal from '../../components/applicant/StepPersonal'
import StepEducation from '../../components/applicant/StepEducation'
import StepSkills from '../../components/applicant/StepSkills'
import StepDocuments from '../../components/applicant/StepDocuments'
import StepReview from '../../components/applicant/StepReview'
import { ArrowLeft, Briefcase } from 'lucide-react'

function MultiStepForm() {
  const { currentStep, setCurrentStep, updateForm, formData } = useFormCtx()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const role = searchParams.get('role')
    const dept = searchParams.get('dept')
    const exp  = searchParams.get('exp')

    if (role || dept) {
      // Coming from a specific job card — pre-fill and lock
      updateForm({
        jobRole:         role || formData.jobRole,
        department:      dept || formData.department,
        experienceLevel: exp  || formData.experienceLevel,
        _lockedJob: true,
      })
    } else {
      // Open application — always clear any stale lock from previous session
      updateForm({
        jobRole: '',
        department: '',
        _lockedJob: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const next = () => setCurrentStep(s => s + 1)
  const back = () => setCurrentStep(s => s - 1)

  const steps = [
    <StepPersonal onNext={next} />,
    <StepEducation onNext={next} onBack={back} />,
    <StepSkills onNext={next} onBack={back} />,
    <StepDocuments onNext={next} onBack={back} />,
    <StepReview onBack={back} />,
  ]

  const role = searchParams.get('role')
  const dept = searchParams.get('dept')

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top bar */}
      <div className="bg-white border-b border-ink-100 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink transition-colors">
          <ArrowLeft size={13} /> Back to openings
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-ink flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="6" width="14" height="10" rx="1" stroke="white" strokeWidth="1.4"/>
              <path d="M6 6V5a3 3 0 016 0v1" stroke="white" strokeWidth="1.4"/>
            </svg>
          </div>
          <span className="text-xs font-semibold text-ink">HirePortal</span>
        </div>
        <span className="text-xs text-ink-300">Step {currentStep + 1} of 5</span>
      </div>

      {/* Job context banner — only shown for specific role applications */}
      {role && dept && (
        <div className="bg-ink border-b border-ink-800">
          <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-2">
            <Briefcase size={12} className="text-ink-300 flex-shrink-0" />
            <p className="text-xs text-ink-300">
              Applying for <span className="text-white font-medium">{role}</span>
              <span className="text-ink-400"> · </span>
              <span className="text-teal">{dept}</span>
            </p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <StepProgress current={currentStep} />
        </div>

        <div className="bg-white border border-ink-100 p-8">
          {steps[currentStep]}
        </div>

        <p className="text-center text-xs text-ink-300 mt-4">
          Your progress is auto-saved. All fields marked * are required.
        </p>
      </div>
    </div>
  )
}

export default function Apply() {
  return (
    <FormProvider>
      <MultiStepForm />
    </FormProvider>
  )
}