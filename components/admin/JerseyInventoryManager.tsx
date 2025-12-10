'use client'

import { useState } from 'react'
import { updateJerseyInventory } from '@/app/admin/actions'
import type { JerseyInventory, JerseySize } from '@/lib/types'
import { JERSEY_SIZE_LABELS } from '@/lib/types'

type JerseyInventoryManagerProps = {
  jerseys: JerseyInventory[]
}

export default function JerseyInventoryManager({
  jerseys: initialJerseys,
}: JerseyInventoryManagerProps) {
  const [editingJersey, setEditingJersey] = useState<JerseyInventory | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<JerseySize[]>([])

  const handleEdit = (jersey: JerseyInventory) => {
    setEditingJersey(jersey)
    setSelectedSizes(jersey.sizes)
  }

  const handleSizeToggle = (size: JerseySize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const handleSave = async () => {
    if (editingJersey) {
      await updateJerseyInventory(editingJersey.number, selectedSizes)
      setEditingJersey(null)
      setSelectedSizes([])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Jersey Inventory
      </h2>

      {editingJersey && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            Editing Jersey #{editingJersey.number}
          </h3>
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-700">Available Sizes:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(JERSEY_SIZE_LABELS).map(([value, label]) => (
                <label key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(value as JerseySize)}
                    onChange={() => handleSizeToggle(value as JerseySize)}
                    className="mr-2"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-[#1e3a5f] text-white px-4 py-2 rounded-md hover:bg-[#2a4a7f]"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingJersey(null)
                setSelectedSizes([])
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
        {initialJerseys.map((jersey) => (
          <button
            key={jersey.number}
            onClick={() => handleEdit(jersey)}
            className="p-3 border border-gray-200 rounded hover:bg-gray-50 text-center"
          >
            <div className="font-bold text-[#1e3a5f]">#{jersey.number}</div>
            <div className="text-xs text-gray-500 mt-1">
              {jersey.sizes.length} {jersey.sizes.length === 1 ? 'size' : 'sizes'}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
