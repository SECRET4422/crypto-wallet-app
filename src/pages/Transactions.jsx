import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export default function Transactions() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-sm text-gray-400">View all your past transactions</p>
          </div>
        </div>

        <div className="text-center py-16">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Transactions Yet</h3>
          <p className="text-gray-400">
            Your transaction history will appear here once you start sending or receiving crypto.
          </p>
        </div>
      </motion.div>
    </div>
  )
}