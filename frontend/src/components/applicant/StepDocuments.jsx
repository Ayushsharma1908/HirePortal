import React, { useState, useRef } from 'react'
import { Upload, FileText, X, Image } from 'lucide-react'
import { useFormCtx } from '../../context/FormContext'
import FormField from '../shared/FormField'
import {
  validateResume,
  validateProfileImage,
  validateCoverLetter,
  MAX_COVER_LETTER,
  MIN_COVER_LETTER,
} from '../../utils/validation'

export default function StepDocuments({ onNext, onBack }) {
  const { formData, updateForm } = useFormCtx()
  const [resume, setResume] = useState(formData.resume || null)
  const [profileImage, setProfileImage] = useState(formData.profileImage || null)
  const [coverLetter, setCoverLetter] = useState(formData.coverLetter || '')
  const [dragging, setDragging] = useState(false)
  const [imgPreview, setImgPreview] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [imageError, setImageError] = useState('')
  const [coverError, setCoverError] = useState('')
  const resumeRef = useRef()
  const imgRef = useRef()

  const handleResumeFile = (file) => {
    const err = validateResume(file)
    if (err) {
      setResumeError(err)
      return
    }
    setResume(file)
    setResumeError('')
  }

  const handleResumeDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleResumeFile(e.dataTransfer.files[0])
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const err = validateProfileImage(file)
    if (err) {
      setImageError(err)
      setProfileImage(null)
      setImgPreview(null)
      return
    }
    setProfileImage(file)
    setImageError('')
    const reader = new FileReader()
    reader.onload = (ev) => setImgPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleCoverChange = (e) => {
    const val = e.target.value
    setCoverLetter(val)
    setCoverError(validateCoverLetter(val))
  }

  const handleNext = () => {
    const resumeErr = resume ? '' : validateResume(null)
    const coverErr = validateCoverLetter(coverLetter)
    setResumeError(resumeErr)
    setCoverError(coverErr)
    if (resumeErr || coverErr || imageError) return
    updateForm({ resume, profileImage, coverLetter })
    onNext()
  }

  return (
    <div className="animate-fade-in">
      <h2 className="form-step-title mb-1">Documents</h2>
      <p className="text-xs text-ink-400 mb-6">Upload your resume and optionally add a cover letter</p>

      <FormField label="Resume / CV" required error={resumeError} className="mb-6">
        {!resume ? (
          <div
            className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragging
                ? 'border-teal bg-teal-muted/60 shadow-outline-teal'
                : resumeError
                  ? 'border-red-300 bg-red-50/30'
                  : 'border-ink-200 hover:border-teal/50 hover:bg-white shadow-soft'
            }`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleResumeDrop}
            onClick={() => resumeRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-2xl border border-ink-100 bg-white flex items-center justify-center mx-auto mb-3 shadow-soft">
              <Upload size={22} className="text-teal" />
            </div>
            <p className="text-sm text-ink-600">
              Drag & drop or <span className="text-teal font-medium">browse</span>
            </p>
            <p className="text-xs text-ink-400 mt-1">PDF, DOC, DOCX — max 5 MB</p>
            <input
              ref={resumeRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={e => handleResumeFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-teal/30 bg-teal-muted/30 p-4 flex items-center justify-between shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-teal/20 flex items-center justify-center">
                <FileText size={18} className="text-teal" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{resume.name}</p>
                <p className="text-xs text-ink-400">{(resume.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setResume(null); setResumeError('') }}
              className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-ink-100 transition-all"
            >
              <X size={14} className="text-ink-400" />
            </button>
          </div>
        )}
      </FormField>

      <FormField label="Profile Photo" error={imageError} hint="Optional — JPG, PNG, WEBP, max 5 MB" className="mb-6">
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-ink-100 bg-ink-50/50">
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center overflow-hidden shadow-soft ${
            imageError ? 'border-red-300 bg-red-50/30' : 'border-ink-200 bg-white'
          }`}>
            {imgPreview ? (
              <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <Image size={20} className="text-ink-300" />
            )}
          </div>
          <div>
            <button type="button" onClick={() => imgRef.current?.click()} className="btn-outline text-xs px-4 py-2">
              {profileImage ? 'Change Photo' : 'Upload Photo'}
            </button>
            {profileImage && (
              <p className="text-xs text-ink-500 mt-1 truncate max-w-[180px]">{profileImage.name}</p>
            )}
            <input ref={imgRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
          </div>
        </div>
      </FormField>

      <FormField
        label="Cover Letter"
        error={coverError}
        hint={`Optional — ${MIN_COVER_LETTER}–${MAX_COVER_LETTER} characters if provided`}
        className="mb-6"
      >
        <textarea
          className={`input resize-none ${coverError ? 'input-error' : ''}`}
          rows={5}
          placeholder="Tell us why you're the perfect fit for this role..."
          value={coverLetter}
          onChange={handleCoverChange}
          maxLength={MAX_COVER_LETTER}
        />
        <p className={`text-xs mt-1.5 flex items-center gap-1 ${
          coverLetter.length > MAX_COVER_LETTER * 0.9 ? 'text-amber-700' : 'text-ink-300'
        }`}>
          {coverLetter.length}/{MAX_COVER_LETTER} characters
          {coverLetter.length > 0 && coverLetter.length < MIN_COVER_LETTER && (
            <span className="text-ink-400"> · min {MIN_COVER_LETTER}</span>
          )}
        </p>
      </FormField>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-outline">← Back</button>
        <button type="button" onClick={handleNext} className="btn-primary px-8">Continue →</button>
      </div>
    </div>
  )
}
