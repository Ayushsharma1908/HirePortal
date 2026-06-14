/** Shared validation rules for react-hook-form and manual checks */

export const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
export const PHONE_REGEX = /^[6-9]\d{9}$/
export const NAME_REGEX = /^[a-zA-Z\s'-]{2,}$/
export const YEAR_REGEX = /^\d{4}$/
export const GITHUB_REGEX = /^https?:\/\/(www\.)?github\.com\/.+/i
export const LINKEDIN_REGEX = /^https?:\/\/(www\.)?linkedin\.com\/.+/i
export const URL_REGEX = /^https?:\/\/.+\..+/i

export const MAX_RESUME_BYTES = 5 * 1024 * 1024
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_COVER_LETTER = 1000
export const MIN_COVER_LETTER = 50

export const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const fieldRules = {
  firstName: {
    required: 'First name is required',
    minLength: { value: 2, message: 'First name must be at least 2 characters' },
    pattern: { value: NAME_REGEX, message: 'First name can only contain letters' },
  },
  lastName: {
    required: 'Last name is required',
    minLength: { value: 2, message: 'Last name must be at least 2 characters' },
    pattern: { value: NAME_REGEX, message: 'Last name can only contain letters' },
  },
  email: {
    required: 'Email is required',
    pattern: { value: GMAIL_REGEX, message: 'Email must be a valid @gmail.com address' },
  },
  phone: {
    required: 'Phone number is required',
    pattern: { value: PHONE_REGEX, message: 'Enter a valid 10-digit mobile number (starts with 6–9)' },
    minLength: { value: 10, message: 'Phone number must be exactly 10 digits' },
    maxLength: { value: 10, message: 'Phone number must be exactly 10 digits' },
  },
  city: {
    required: 'City is required',
    minLength: { value: 2, message: 'City must be at least 2 characters' },
  },
  state: {
    required: 'State is required',
    minLength: { value: 2, message: 'State must be at least 2 characters' },
  },
  department: { required: 'Please select a department' },
  jobRole: {
    required: 'Job role is required',
    minLength: { value: 2, message: 'Job role must be at least 2 characters' },
  },
  institution: {
    required: 'Institution is required',
    minLength: { value: 2, message: 'Institution must be at least 2 characters' },
  },
  degree: { required: 'Please select a degree' },
  fieldOfStudy: {
    required: 'Field of study is required',
    minLength: { value: 2, message: 'Field of study must be at least 2 characters' },
  },
  grade: {
    validate: (val) => {
      if (!val?.trim()) return true
      const v = val.trim()
      if (/^\d+(\.\d+)?%$/.test(v)) {
        const n = parseFloat(v)
        return (n > 0 && n <= 100) || 'Percentage must be between 1 and 100'
      }
      if (/^\d+(\.\d+)?$/.test(v)) {
        const n = parseFloat(v)
        return (n > 0 && n <= 10) || 'CGPA must be between 1 and 10'
      }
      return 'Enter valid CGPA (e.g. 8.5) or percentage (e.g. 85%)'
    },
  },
  startYear: {
    validate: (val) => {
      if (!val?.trim()) return true
      if (!YEAR_REGEX.test(val.trim())) return 'Enter a valid 4-digit start year'
      const y = parseInt(val, 10)
      return (y >= 1950 && y <= new Date().getFullYear()) || 'Enter a realistic start year'
    },
  },
  endYear: {
    validate: (val, formValues) => {
      if (!val?.trim()) return true
      if (!YEAR_REGEX.test(val.trim())) return 'Enter a valid 4-digit end year'
      const y = parseInt(val, 10)
      if (y < 1950 || y > new Date().getFullYear() + 6) return 'Enter a realistic end year'
      if (formValues.startYear && YEAR_REGEX.test(formValues.startYear)) {
        if (parseInt(val, 10) < parseInt(formValues.startYear, 10)) {
          return 'End year cannot be before start year'
        }
      }
      return true
    },
  },
  githubUrl: {
    validate: (val) => !val?.trim() || GITHUB_REGEX.test(val.trim()) || 'Enter a valid GitHub URL (https://github.com/…)',
  },
  linkedinUrl: {
    validate: (val) => !val?.trim() || LINKEDIN_REGEX.test(val.trim()) || 'Enter a valid LinkedIn URL (https://linkedin.com/in/…)',
  },
  portfolioUrl: {
    validate: (val) => !val?.trim() || URL_REGEX.test(val.trim()) || 'Enter a valid URL starting with http:// or https://',
  },
  dob: {
    validate: (val) => {
      if (!val) return true
      const dob = new Date(val)
      if (Number.isNaN(dob.getTime())) return 'Enter a valid date of birth'
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const m = today.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
      return age >= 18 || 'You must be at least 18 years old'
    },
  },
}

export function validateResume(file) {
  if (!file) return 'Please upload your resume'
  if (!RESUME_TYPES.includes(file.type)) return 'Only PDF, DOC, or DOCX files are allowed'
  if (file.size > MAX_RESUME_BYTES) return 'Resume must be under 5 MB'
  if (file.size < 1024) return 'Resume file appears too small — please upload a valid document'
  return ''
}

export function validateProfileImage(file) {
  if (!file) return ''
  if (!IMAGE_TYPES.includes(file.type)) return 'Only JPG, PNG, or WEBP images are allowed'
  if (file.size > MAX_IMAGE_BYTES) return 'Profile photo must be under 5 MB'
  return ''
}

export function validateCoverLetter(text) {
  if (!text?.trim()) return ''
  if (text.length < MIN_COVER_LETTER) return `Cover letter must be at least ${MIN_COVER_LETTER} characters`
  if (text.length > MAX_COVER_LETTER) return `Cover letter cannot exceed ${MAX_COVER_LETTER} characters`
  return ''
}

export function inputClass(hasError) {
  return hasError ? 'input input-error' : 'input'
}
