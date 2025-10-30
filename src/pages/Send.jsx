import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send as SendIcon, AlertCircle } from 'lucide-react'
import { useWalletStore } from '../store/walletStore'
import { validateAddress, estimateGas, formatBalance } from '../utils/helpers'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

export default function Send() {
  const { getSigner, activeNetwork, networks } = useWalletStore()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)
  const [gasEstimate, setGasEstimate] = useState(null)

  const handleEstimateGas = async () => {
    if (!recipient || !amount || !validateAddress(recipient)) return
    
    try {
      const signer = getSigner()
      const tx = {
        to: recipient,
        value: ethers.parseEther(amount)
      }
      const estimate = await estimateGas(signer.provider, tx)
      setGasEstimate(estimate)
    } catch (error) {
      toast.error('Failed to estimate gas')
    }
  }

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast.error('Please fill all fields')
      return
    }

    if (!validateAddress(recipient)) {
      toast.error('Invalid recipient address')
      return
    }

    setSending(true)
    try {
      const signer = getSigner()
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount)
      })

      toast.success('Transaction sent! Waiting for confirmation...')
      await tx.wait()
      toast.success('Transaction confirmed!')
      
      setRecipient('')
      setAmount('')
      setGasEstimate(null)
    } catch (error) {
      toast.error(error.message || 'Transaction failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <SendIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Send {networks[activeNetwork].symbol}</h1>
            <p className="text-sm text-gray-400">Transfer crypto to another address</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              onBlur={handleEstimateGas}
              placeholder="0x..."
              className="input-field"
            />
            {recipient && !validateAddress(recipient) && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Invalid address
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Amount ({networks[activeNetwork].symbol})
            </label>
            <input
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={handleEstimateGas}
              placeholder="0.0"
              className="input-field"
            />
          </div>

          {gasEstimate && (
            <div className="glass p-4 rounded-xl space-y-2">
              <h3 className="font-semibold mb-2">Gas Estimate</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Gas Price:</span>
                <span>{gasEstimate.gasPrice} Gwei</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated Cost:</span>
                <span>{formatBalance(gasEstimate.totalCost, 6)} {networks[activeNetwork].symbol}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={sending || !recipient || !amount || !validateAddress(recipient)}
            className="btn-primary w-full"
          >
            {sending ? 'Sending...' : 'Send Transaction'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-200">
            <strong>💡 Tip:</strong> Always double-check the recipient address before sending. Transactions cannot be reversed.
          </p>
        </div>
      </motion.div>
    </div>
  )
}