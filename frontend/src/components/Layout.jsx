import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, List, BookOpen, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/trades', label: 'Trades', icon: List },
    { path: '/journal', label: 'Journal', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="p-2 rounded-md text-white hover:bg-indigo-700 transition-colors mr-3"
                aria-label="Toggle menu"
              >
                {isDrawerOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white">TradeMindAI</h1>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </button>
              
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">User Menu</p>
                      <p className="text-xs text-gray-500">{user?.email || 'trader@trademindai.com'}</p>
                    </div>
                    <div className="border-t border-gray-200 mt-1 pt-1">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          logout()
                          navigate('/login')
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-lg font-bold text-white">Menu</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 rounded-md text-white hover:bg-indigo-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Overlay when drawer is open */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

