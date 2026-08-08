import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/useAuthStore'
import './auth.css'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuthStore()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  const validate = () => {
    const errs = {}
    if (!formData.username.trim()) {
      errs.username = 'Username is required'
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.email)) {
      errs.email = 'Invalid email format'
    }
    if (!formData.password) {
      errs.password = 'Password is required'
    } else {
      if (!/[A-Z]/.test(formData.password)) {
        errs.password = 'Must contain at least one uppercase letter'
      } else if (!/[a-z]/.test(formData.password)) {
        errs.password = 'Must contain at least one lowercase letter'
      } else if (!/[!@#$%^&*()_+\-=\[\]{}|;':",.\/<>?]/.test(formData.password)) {
        errs.password = 'Must contain at least one special character'
      }
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    try {
      await register(formData)
      toast.success('Account created successfully')
      navigate('/login')
    } catch (err) {
      // Map backend error to specific field if possible
      if (err.includes('Username')) {
        setErrors({ username: err })
      } else if (err.includes('email') || err.includes('Email')) {
        setErrors({ email: err })
      } else if (err.includes('Password') || err.includes('password')) {
        setErrors({ password: err })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Start forecasting your cash flow</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className={`auth-input ${errors.username ? 'error' : ''}`}
            />
            {errors.username && (
              <div className="auth-error-row">
                <AlertCircle />
                {errors.username}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`auth-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && (
              <div className="auth-error-row">
                <AlertCircle />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`auth-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && (
              <div className="auth-error-row">
                <AlertCircle />
                {errors.password}
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="spinner" />}
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In.</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
