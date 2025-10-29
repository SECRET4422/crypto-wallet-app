import { useState } from 'react'
import { ethers } from 'ethers'

export default function WalletCreate({ onWalletCreated }) {
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')

  const createNewWallet = () => {
    const wallet = ethers.Wallet.createRandom()
    onWalletCreated(wallet)
  }

  const importWallet = () => {
    try {
      setError('')
      const wallet = new ethers.Wallet(privateKey)
      onWalletCreated(wallet)
    } catch (err) {
      setError('Invalid private key. Please check and try again.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔐 Crypto Wallet
          </h1>
          <p className="text-gray-600">Built by Bhindi AI - Full Power Demo</p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Create New Wallet
            </h2>
            <p className="text-gray-600 mb-4">
              Generate a new wallet with a secure random private key
            </p>
            <button
              onClick={createNewWallet}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
            >
              Create New Wallet
            </button>
          </div>

          <div className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Import Existing Wallet
            </h2>
            <p className="text-gray-600 mb-4">
              Import your wallet using your private key
            </p>
            <input
              type="password"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-purple-500 focus:outline-none"
            />
            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}
            <button
              onClick={importWallet}
              disabled={!privateKey}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import Wallet
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Security Warning:</strong> Never share your private key with anyone. 
            This demo stores keys in browser localStorage for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  )
}
