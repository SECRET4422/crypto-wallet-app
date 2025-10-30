import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Trash2, LogOut } from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import toast from 'react-hot-toast'

export default function Settings() {
  const { activeNetwork, networks, setActiveNetwork, clearAll } = useWalletStore()

  const handleNetworkChange = (network) => {
    setActiveNetwork(network)
    toast.success(`Switched to ${networks[network].name}`)
  }

  const handleClearWallet = () => {
    if (confirm('Are you sure you want to remove all wallets? This action cannot be undone.')) {
      clearAll()
      toast.success('All wallets removed')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-400">Manage your wallet preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Network</h3>
            <div className="space-y-2">
              {Object.entries(networks).map(([key, network]) => (
                <button
                  key={key}
                  onClick={() => handleNetworkChange(key)}
                  className={`w-full text-left p-4 rounded-xl transition ${
                    activeNetwork === key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'glass hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{network.name}</p>
                      <p className="text-sm text-gray-400">Chain ID: {network.chainId}</p>
                    </div>
                    {activeNetwork === key && (
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="font-semibold mb-3 text-red-400">Danger Zone</h3>
            <button
              onClick={handleClearWallet}
              className="w-full glass hover:bg-red-500/20 text-red-400 p-4 rounded-xl transition flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Remove All Wallets</span>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card text-center"
      >
        <p className="text-sm text-gray-400 mb-2">Crypto Wallet Pro v2.0</p>
        <p className="text-xs text-gray-500">Built by Bhindi AI - Full Power Demonstration</p>
      </motion.div>
    </div>
  )
}