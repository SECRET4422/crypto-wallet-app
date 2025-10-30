import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { formatBalance, formatCurrency } from '../utils/helpers'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { activeWallet, activeNetwork, networks, getProvider } = useWalletStore()
  const [balance, setBalance] = useState('0')
  const [usdValue, setUsdValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hideBalance, setHideBalance] = useState(false)
  const [priceChange, setPriceChange] = useState(0)

  const loadBalance = async () => {
    setLoading(true)
    try {
      const provider = getProvider()
      const bal = await provider.getBalance(activeWallet.address)
      const formatted = ethers.formatEther(bal)
      setBalance(formatted)
      
      // Mock USD value - in production, fetch from CoinGecko
      const mockPrice = activeNetwork === 'ethereum' ? 2000 : 
                       activeNetwork === 'polygon' ? 0.8 : 300
      setUsdValue(parseFloat(formatted) * mockPrice)
      setPriceChange(Math.random() * 10 - 5) // Mock price change
      
      toast.success('Balance updated')
    } catch (error) {
      toast.error('Failed to load balance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBalance()
  }, [activeNetwork, activeWallet])

  const stats = [
    {
      label: '24h Change',
      value: `${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
      icon: priceChange > 0 ? TrendingUp : TrendingDown,
      color: priceChange > 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      label: 'Network',
      value: networks[activeNetwork].name,
      icon: null,
      color: 'text-blue-400'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-300">Total Balance</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              {hideBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={loadBalance}
              disabled={loading}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-5xl font-bold">
            {hideBalance ? '••••••' : `${formatBalance(balance, 4)} ${networks[activeNetwork].symbol}`}
          </div>
          <div className="text-2xl text-gray-400">
            {hideBalance ? '••••••' : formatCurrency(usdValue)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="glass p-4 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <div className="flex items-center space-x-2">
                {stat.icon && <stat.icon className={`w-4 h-4 ${stat.color}`} />}
                <p className={`font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <a href="/send" className="card-hover text-center py-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h3 className="font-semibold">Send</h3>
          <p className="text-sm text-gray-400 mt-1">Transfer crypto</p>
        </a>

        <a href="/receive" className="card-hover text-center py-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="font-semibold">Receive</h3>
          <p className="text-sm text-gray-400 mt-1">Get crypto</p>
        </a>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-gray-400">
          <p>No recent transactions</p>
          <p className="text-sm mt-2">Your transaction history will appear here</p>
        </div>
      </motion.div>
    </div>
  )
}