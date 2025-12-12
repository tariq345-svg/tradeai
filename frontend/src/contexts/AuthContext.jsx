import { createContext, useContext, useState, useEffect } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token')
    const userEmail = localStorage.getItem('userEmail')
    
    if (token && userEmail) {
      // Set default authorization header
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      setUser({ email: userEmail })
    }
    setLoading(false)
  }, [])

  const login = (email, token) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userEmail', email)
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setIsAuthenticated(true)
    setUser({ email })
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    delete client.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

