import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, QrCode } from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { copyToClipboard } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function Receive() {
  const { activeWallet, activeNetwork, networks } = useWalletStore()

  const handleCopy = async () => {
    const success = await copyToClipboard(activeWallet.address)
    if (success) {
      toast.success('Address copied to clipboard!')
    } else {
      toast.error('Failed to copy address')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Receive {networks[activeNetwork].symbol}</h1>
            <p className="text-sm text-gray-400">Share your address to receive crypto</p>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl mb-6">
          <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center">
            <QrCode className="w-32 h-32 text-gray-800" />
          </div>
          <p className="text-sm text-gray-400 mb-2">Your {networks[activeNetwork].name} Address</p>
          <p className="font-mono text-lg break-all mb-4">{activeWallet.address}</p>
          <button
            onClick={handleCopy}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Address</span>
          </button>
        </div>

        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-left">
          <p className="text-sm text-yellow-200">
            <strong>⚠️ Important:</strong> Only send {networks[activeNetwork].symbol} and {networks[activeNetwork].name} tokens to this address. Sending other assets may result in permanent loss.
          </p>
        </div>
      </motion.div>
    </div>
  )
}