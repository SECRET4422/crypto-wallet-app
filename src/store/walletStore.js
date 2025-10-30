import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ethers } from 'ethers'

export const useWalletStore = create(
  persist(
    (set, get) => ({
      wallets: [],
      activeWallet: null,
      networks: {
        ethereum: {
          name: 'Ethereum',
          rpc: 'https://eth-mainnet.g.alchemy.com/v2/demo',
          chainId: 1,
          symbol: 'ETH',
          explorer: 'https://etherscan.io'
        },
        polygon: {
          name: 'Polygon',
          rpc: 'https://polygon-rpc.com',
          chainId: 137,
          symbol: 'MATIC',
          explorer: 'https://polygonscan.com'
        },
        bsc: {
          name: 'BSC',
          rpc: 'https://bsc-dataseed.binance.org',
          chainId: 56,
          symbol: 'BNB',
          explorer: 'https://bscscan.com'
        },
        arbitrum: {
          name: 'Arbitrum',
          rpc: 'https://arb1.arbitrum.io/rpc',
          chainId: 42161,
          symbol: 'ETH',
          explorer: 'https://arbiscan.io'
        },
        optimism: {
          name: 'Optimism',
          rpc: 'https://mainnet.optimism.io',
          chainId: 10,
          symbol: 'ETH',
          explorer: 'https://optimistic.etherscan.io'
        }
      },
      activeNetwork: 'ethereum',
      
      addWallet: (wallet, name) => {
        const wallets = get().wallets
        const newWallet = {
          id: Date.now().toString(),
          name: name || `Wallet ${wallets.length + 1}`,
          address: wallet.address,
          privateKey: wallet.privateKey,
          createdAt: new Date().toISOString()
        }
        set({ 
          wallets: [...wallets, newWallet],
          activeWallet: newWallet
        })
      },
      
      setActiveWallet: (walletId) => {
        const wallet = get().wallets.find(w => w.id === walletId)
        if (wallet) set({ activeWallet: wallet })
      },
      
      removeWallet: (walletId) => {
        const wallets = get().wallets.filter(w => w.id !== walletId)
        const activeWallet = get().activeWallet
        set({ 
          wallets,
          activeWallet: activeWallet?.id === walletId ? wallets[0] || null : activeWallet
        })
      },
      
      setActiveNetwork: (network) => set({ activeNetwork: network }),
      
      getProvider: () => {
        const network = get().networks[get().activeNetwork]
        return new ethers.JsonRpcProvider(network.rpc)
      },
      
      getSigner: () => {
        const activeWallet = get().activeWallet
        if (!activeWallet) return null
        const wallet = new ethers.Wallet(activeWallet.privateKey)
        return wallet.connect(get().getProvider())
      },
      
      clearAll: () => set({ wallets: [], activeWallet: null })
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)