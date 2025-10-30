import { Routes, Route, Navigate } from 'react-router-dom'
import { useWalletStore } from './store/walletStore'
import WalletSetup from './pages/WalletSetup'
import Dashboard from './pages/Dashboard'
import Send from './pages/Send'
import Receive from './pages/Receive'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'
import Layout from './components/Layout'

function App() {
  const { activeWallet } = useWalletStore()

  if (!activeWallet) {
    return <WalletSetup />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App