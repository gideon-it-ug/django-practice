import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function StudentDashboard() {
  const [logs, setLogs] = useState([])         // stores weekly logs from Django
  const [loading, setLoading] = useState(true)  // shows loading while fetching
  const [error, setError] = useState('')

  const navigate = useNavigate()

  // Get the saved username and token from localStorage
  const username = localStorage.getItem('username')
  const token = localStorage.getItem('access_token')

  // useEffect runs when the page loads
  useEffect(() => {
    // If no token, go back to login
    if (!token) {
      navigate('/')
      return
    }

    // Fetch weekly logs from Django
    fetchLogs()
  }, [])  // empty [] means run only once when page loads

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/logs/', {
        headers: {
          // Send the JWT token with every request
          Authorization: 'Bearer ' + token
        }
      })
      setLogs(response.data)
    } catch (error) {
      setError('Could not load your logs. Please try again.')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    // Clear everything from localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    // Go back to login page
    navigate('/')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '30px',
                    padding: '15px', backgroundColor: '#1F3864',
                    borderRadius: '8px', color: 'white' }}>
        <h2 style={{ margin: 0 }}>🎓 ILES Student Dashboard</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {username}</span>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', backgroundColor: '#E74C3C',
                     color: 'white', border: 'none', borderRadius: '4px',
                     cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Weekly Logs Section */}
      <h3 style={{ color: '#2E75B6' }}>My Weekly Logs</h3>

      {loading && <p>Loading your logs...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && logs.length === 0 && (
        <p style={{ color: '#777', fontStyle: 'italic' }}>
          No logs yet. Your weekly logs will appear here.
        </p>
      )}

      {logs.map((log) => (
        <div key={log.id} style={{ border: '1px solid #ccc', borderRadius: '8px',
                                   padding: '15px', marginBottom: '15px',
                                   backgroundColor: '#F9F9F9' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1F3864' }}>
            Week {log.week_number}
          </h4>
          <p><strong>Activities:</strong> {log.activities}</p>
          <p><strong>Status:</strong>
            <span style={{ marginLeft: '8px', padding: '2px 8px',
                           backgroundColor: log.status === 'approved' ? '#27AE60' :
                                            log.status === 'submitted' ? '#2E75B6' : '#F39C12',
                           color: 'white', borderRadius: '4px', fontSize: '12px' }}>
              {log.status}
            </span>
          </p>
          {log.challenges && <p><strong>Challenges:</strong> {log.challenges}</p>}
        </div>
      ))}

    </div>
  )
}

export default StudentDashboard
