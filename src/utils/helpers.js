import { ethers } from 'ethers'
import axios from 'axios'

export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatBalance = (balance, decimals = 4) => {
  if (!balance) return '0'
  const num = parseFloat(balance)
  return num.toFixed(decimals)
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    return false
  }
}

export const validateAddress = (address) => {
  try {
    return ethers.isAddress(address)
  } catch {
    return false
  }
}

export const getTokenPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
    )
    return response.data[symbol]?.usd || 0
  } catch {
    return 0
  }
}

export const estimateGas = async (provider, transaction) => {
  try {
    const gasEstimate = await provider.estimateGas(transaction)
    const feeData = await provider.getFeeData()
    const gasCost = gasEstimate * feeData.gasPrice
    return {
      gasLimit: gasEstimate.toString(),
      gasPrice: ethers.formatUnits(feeData.gasPrice, 'gwei'),
      totalCost: ethers.formatEther(gasCost)
    }
  } catch (err) {
    return null
  }
}

export const getTransactionHistory = async (address, network) => {
  // Mock implementation - in production, use Etherscan/Alchemy API
  return []
}

export const getTokenBalance = async (provider, tokenAddress, walletAddress) => {
  try {
    const abi = ['function balanceOf(address) view returns (uint256)']
    const contract = new ethers.Contract(tokenAddress, abi, provider)
    const balance = await contract.balanceOf(walletAddress)
    return balance
  } catch {
    return ethers.BigNumber.from(0)
  }
}