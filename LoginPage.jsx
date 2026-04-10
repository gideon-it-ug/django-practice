import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // useNavigate lets us go to a different page
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: username,
        password: password,
      })

      // Save tokens
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('username', username)

      // Go to dashboard
      navigate('/dashboard')

    } catch (error) {
      setError('Wrong username or password. Try again.')
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px',
                  border: '1px solid #ccc', borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>

      <h2 style={{ textAlign: 'center', color: '#1F3864', marginBottom: '25px' }}>
        🎓 ILES — Login
      </h2>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Username</label>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Enter your username'
          style={{ width: '100%', padding: '10px', marginTop: '5px',
                   border: '1px solid #ccc', borderRadius: '4px',
                   boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
          style={{ width: '100%', padding: '10px', marginTop: '5px',
                   border: '1px solid #ccc', borderRadius: '4px',
                   boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ width: '100%', padding: '12px', backgroundColor: '#2E75B6',
                 color: 'white', border: 'none', borderRadius: '4px',
                 cursor: loading ? 'not-allowed' : 'pointer',
                 fontSize: '16px', fontWeight: 'bold' }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

    </div>
  )
}
export default LoginPage
