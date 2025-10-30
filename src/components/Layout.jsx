import { Link, useLocation } from 'react-router-dom'
import { Home, Send, Download, Clock, Settings, Wallet } from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { formatAddress } from '../utils/helpers'

export default function Layout({ children }) {
  const location = useLocation()
  const { activeWallet, activeNetwork, networks } = useWalletStore()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/send', icon: Send, label: 'Send' },
    { path: '/receive', icon: Download, label: 'Receive' },
    { path: '/transactions', icon: Clock, label: 'History' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Crypto Wallet Pro</h1>
                <p className="text-xs text-gray-400">by Bhindi AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="glass px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-400">Network</p>
                <p className="font-semibold">{networks[activeNetwork].name}</p>
              </div>
              <div className="glass px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-400">Address</p>
                <p className="font-mono font-semibold">{formatAddress(activeWallet.address)}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="glass-dark border-t border-white/10 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-4">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center space-y-1 px-6 py-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}