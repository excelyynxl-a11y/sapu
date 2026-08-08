import { Link } from 'react-router-dom'
import './landing.css'

function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Sapu logo and intro */}
        <div className="landing-intro">
          <img src="/sapu.png" alt="Sapu logo" className="landing-logo" />
          <h1 className="landing-title">Sapu</h1>
          <p className="landing-subtitle">
            Plug in your income and recurring bills, and see your projected balance across the month so you know when things get tight.
          </p>
        </div>

        {/* login / register buttons */}
        <div className="landing-actions">
          <div className="landing-card">
            <h2 className="landing-card-title">
              Get started
            </h2>
            <p className="landing-card-text">Track your cash flow and avoid surprises.</p>
            <div className="landing-button-group">
              <Link to="/login" className="landing-button landing-button-primary">
                Sign in
              </Link>
              <Link to="/signup" className="landing-button landing-button-secondary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
