import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const NETWORKS = {
  ethereum: {
    name: 'Ethereum',
    rpc: 'https://eth-mainnet.g.alchemy.com/v2/demo',
    chainId: 1,
    symbol: 'ETH'
  },
  polygon: {
    name: 'Polygon',
    rpc: 'https://polygon-rpc.com',
    chainId: 137,
    symbol: 'MATIC'
  },
  bsc: {
    name: 'BSC',
    rpc: 'https://bsc-dataseed.binance.org',
    chainId: 56,
    symbol: 'BNB'
  }
}

export default function WalletDashboard({ wallet, onLogout }) {
  const [balance, setBalance] = useState('0')
  const [network, setNetwork] = useState('ethereum')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    loadBalance()
  }, [network])

  const loadBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS[network].rpc)
      const bal = await provider.getBalance(wallet.address)
      setBalance(ethers.formatEther(bal))
    } catch (error) {
      console.error('Error loading balance:', error)
    }
  }

  const sendTransaction = async () => {
    if (!recipient || !amount) return
    
    setSending(true)
    setTxHash('')
    
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS[network].rpc)
      const signer = wallet.connect(provider)
      
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount)
      })
      
      setTxHash(tx.hash)
      await tx.wait()
      loadBalance()
      setRecipient('')
      setAmount('')
    } catch (error) {
      alert('Transaction failed: ' + error.message)
    } finally {
      setSending(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
    alert('Address copied!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
              <p className="text-purple-100">Built by Bhindi AI</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="text-sm text-gray-600 mb-2 block">Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {Object.entries(NETWORKS).map(([key, net]) => (
                <option key={key} value={key}>{net.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Address</span>
              <button
                onClick={copyAddress}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Copy
              </button>
            </div>
            <p className="text-sm font-mono bg-white p-3 rounded-lg break-all">
              {wallet.address}
            </p>
            
            <div className="mt-6">
              <span className="text-gray-600 block mb-2">Balance</span>
              <p className="text-4xl font-bold text-gray-800">
                {parseFloat(balance).toFixed(4)} {NETWORKS[network].symbol}
              </p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Send Transaction
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Amount ({NETWORKS[network].symbol})
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                onClick={sendTransaction}
                disabled={sending || !recipient || !amount}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Transaction'}
              </button>

              {txHash && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 mb-2">
                    ✅ Transaction sent successfully!
                  </p>
                  <p className="text-xs font-mono break-all text-green-700">
                    {txHash}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
