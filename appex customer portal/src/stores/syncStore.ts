import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SyncState, SyncOperation } from '@/types'
import { db } from '@/lib/db'
import api from '@/services/api'
import { liveQuery } from 'dexie'

interface SyncStore extends SyncState {
  setOnlineStatus: (isOnline: boolean) => void
  addToQueue: (operation: Omit<SyncOperation, 'id' | 'createdAt' | 'retryCount' | 'status'>) => Promise<void>
  processQueue: () => Promise<void>
  clearQueue: () => Promise<void>
  updateOperationStatus: (id: string, status: SyncOperation['status']) => Promise<void>
  incrementRetryCount: (id: string) => Promise<void>
  init: () => void
}

export const useSyncStore = create<SyncStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isOnline: navigator.onLine,
      syncQueue: [],
      lastSync: null,
      syncProgress: 0,

      // Actions
      init: () => {
        // Subscribe to live queries from Dexie to keep Zustand state in sync
        liveQuery(() => db.syncQueue.toArray()).subscribe((queue) => {
          set({ syncQueue: queue })
        })

        window.addEventListener('online', () => get().setOnlineStatus(true))
        window.addEventListener('offline', () => get().setOnlineStatus(false))
      },

      setOnlineStatus: (isOnline: boolean) => {
        set({ isOnline })
        if (isOnline) {
          get().processQueue()
        }
      },

      addToQueue: async (operation) => {
        const newOperation: SyncOperation = {
          ...operation,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          retryCount: 0,
          status: 'pending'
        }

        await db.syncQueue.add(newOperation)
        // State updates automatically via liveQuery subscription
      },

      processQueue: async () => {
        const pendingOps = await db.syncQueue
          .where('status')
          .equals('pending')
          .toArray()

        if (pendingOps.length === 0) return

        set({ syncProgress: 0 })

        for (let i = 0; i < pendingOps.length; i++) {
          const operation = pendingOps[i]

          try {
            await get().updateOperationStatus(operation.id, 'syncing')

            // Perform Actual API Call
            await syncOperationToApi(operation)

            await get().updateOperationStatus(operation.id, 'completed')

            // Optionally remove completed items to keep DB small, or keep for log
            // await db.syncQueue.delete(operation.id) 

          } catch (error) {
            console.error('Sync failed:', error)
            await get().incrementRetryCount(operation.id)

            const updatedOp = await db.syncQueue.get(operation.id)
            if (updatedOp && updatedOp.retryCount >= 3) {
              await get().updateOperationStatus(operation.id, 'failed')
            }
          }

          set({ syncProgress: ((i + 1) / pendingOps.length) * 100 })
        }

        set({ lastSync: new Date() })
      },

      clearQueue: async () => {
        await db.syncQueue.clear()
        set({ syncProgress: 0 })
      },

      updateOperationStatus: async (id: string, status: SyncOperation['status']) => {
        await db.syncQueue.update(id, { status })
      },

      incrementRetryCount: async (id: string) => {
        const op = await db.syncQueue.get(id)
        if (op) {
          await db.syncQueue.update(id, { retryCount: op.retryCount + 1 })
        }
      },
    }),
    {
      name: 'sync-storage',
      partialize: (state) => ({
        // Only persist UI state, not the queue which is in IDB
        lastSync: state.lastSync,
      }),
    }
  )
)

// Helper function to handle API calls based on entity and operation
async function syncOperationToApi(op: SyncOperation): Promise<any> {
  const { entityType, operation, data, entityId } = op

  // Construct endpoint based on entity type
  // e.g., /sales, /products, /customers
  const endpoint = `/${entityType}s${operation === 'update' || operation === 'delete' ? `/${entityId}` : ''}`

  switch (operation) {
    case 'create':
      return api.post(endpoint, data)
    case 'update':
      return api.put(endpoint, data)
    case 'delete':
      return api.delete(endpoint)
    default:
      throw new Error(`Unknown operation: ${operation}`)
  }
}
