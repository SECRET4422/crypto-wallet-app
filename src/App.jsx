import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import WalletCreate from './components/WalletCreate'
import WalletDashboard from './components/WalletDashboard'

function App() {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedWallet = localStorage.getItem('wallet')
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet)
      const restoredWallet = new ethers.Wallet(walletData.privateKey)
      setWallet(restoredWallet)
    }
    setLoading(false)
  }, [])

  const handleWalletCreated = (newWallet) => {
    setWallet(newWallet)
    localStorage.setItem('wallet', JSON.stringify({
      address: newWallet.address,
      privateKey: newWallet.privateKey
    }))
  }

  const handleLogout = () => {
    setWallet(null)
    localStorage.removeItem('wallet')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {!wallet ? (
        <WalletCreate onWalletCreated={handleWalletCreated} />
      ) : (
        <WalletDashboard wallet={wallet} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
