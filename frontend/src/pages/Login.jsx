import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/useAuthStore'
import './auth.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [formData, setFormData] = useState({
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
    if (!formData.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.email)) {
      errs.email = 'Invalid email format'
    }
    if (!formData.password) {
      errs.password = 'Password is required'
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
      await login(formData)
      toast.success('Login successful')
      navigate('/home')
    } catch (err) {
      if (err.includes('email') || err.includes('Email')) {
        setErrors({ email: err })
      } else if (err.includes('password') || err.includes('Password')) {
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
          <h1>Welcome Back</h1>
          <p>Log in to see your forecast</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create Account.</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
