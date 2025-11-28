import { uid } from '../utils/id'

// Mock API for transactions
export const mockApi = {
  async listTransactions() {
    // Return empty array - will be populated by user
    return []
  },

  async createTransaction(data) {
    return {
      id: uid('tx_'),
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    }
  },

  async updateTransaction(id, changes) {
    return {
      id,
      ...changes,
      updatedAt: new Date().toISOString()
    }
  },

  async deleteTransaction(id) {
    return { success: true, id }
  }
}
