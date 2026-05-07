import React, { useState } from 'react'
import { createCard } from '../services/api'

const CardForm = ({ columnId, onCancel, onCreated }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await createCard({
        title,
        description,
        column_id: columnId,
        position: 1 // Will be updated by backend
      })
      setTitle('')
      setDescription('')
      onCreated()
    } catch (error) {
      console.error('Error creating card:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/20">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full font-semibold text-slate-800 mb-2 p-2.5 text-sm border border-slate-200 rounded-md focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none transition-all"
        placeholder="Ticket title"
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full text-xs text-slate-600 p-2.5 border border-slate-200 rounded-md resize-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none transition-all"
        rows={2}
        placeholder="Description (optional)"
      />
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-md shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Add Task'}
        </button>
      </div>
    </form>
  )
}

export default CardForm
