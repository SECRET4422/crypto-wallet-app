import { useState } from 'react'
import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { Wallet, Key, Sparkles } from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import toast from 'react-hot-toast'

export default function WalletSetup() {
  const [mode, setMode] = useState(null)
  const [privateKey, setPrivateKey] = useState('')
  const [walletName, setWalletName] = useState('')
  const [loading, setLoading] = useState(false)
  const { addWallet } = useWalletStore()

  const createWallet = async () => {
    setLoading(true)
    try {
      const wallet = ethers.Wallet.createRandom()
      addWallet(wallet, walletName || 'My Wallet')
      toast.success('Wallet created successfully!')
    } catch (error) {
      toast.error('Failed to create wallet')
    } finally {
      setLoading(false)
    }
  }

  const importWallet = async () => {
    if (!privateKey) {
      toast.error('Please enter a private key')
      return
    }
    
    setLoading(true)
    try {
      const wallet = new ethers.Wallet(privateKey)
      addWallet(wallet, walletName || 'Imported Wallet')
      toast.success('Wallet imported successfully!')
    } catch (error) {
      toast.error('Invalid private key')
    } finally {
      setLoading(false)
    }
  }

  if (!mode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            >
              <Wallet className="w-10 h-10" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to Crypto Wallet Pro
            </h1>
            <p className="text-xl text-gray-400">
              Your gateway to decentralized finance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('create')}
              className="card-hover p-8 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Create New Wallet</h2>
              <p className="text-gray-400">
                Generate a new wallet with a secure random private key. Perfect for getting started.
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('import')}
              className="card-hover p-8 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Key className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Import Wallet</h2>
              <p className="text-gray-400">
                Already have a wallet? Import it using your private key to access your funds.
              </p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-md w-full"
      >
        <button
          onClick={() => setMode(null)}
          className="mb-6 text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>

        <div className="card">
          <h2 className="text-3xl font-bold mb-6">
            {mode === 'create' ? 'Create New Wallet' : 'Import Wallet'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Wallet Name (Optional)
              </label>
              <input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="My Wallet"
                className="input-field"
              />
            </div>

            {mode === 'import' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Private Key *
                </label>
                <input
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="0x..."
                  className="input-field"
                />
              </div>
            )}

            <button
              onClick={mode === 'create' ? createWallet : importWallet}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Processing...' : mode === 'create' ? 'Create Wallet' : 'Import Wallet'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-sm text-yellow-200">
              <strong>⚠️ Security Notice:</strong> Never share your private key. Store it securely offline.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}