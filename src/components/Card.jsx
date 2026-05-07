import React, { useState } from 'react'
import { Trash2, Edit2, Square, MoreHorizontal } from 'lucide-react'
import { updateCard, deleteCard } from '../services/api'

const getColumnStatusBadge = (index) => {
  const badges = [
    { label: 'Active', bg: 'bg-emerald-500', text: 'text-white' },
    { label: 'In Progress', bg: 'bg-amber-500', text: 'text-white' },
    { label: 'Struggling', bg: 'bg-rose-500', text: 'text-white' },
    { label: 'On Hold', bg: 'bg-slate-500', text: 'text-white' },
    { label: 'Completed', bg: 'bg-red-500', text: 'text-white' },
  ]
  return badges[index % badges.length] || badges[0]
}

const getPriorityBadge = (id) => {
  // Derive priority from card id for visual variety
  const isHigh = id % 2 === 1
  return {
    label: isHigh ? 'High' : 'Medium',
    dot: isHigh ? 'bg-rose-500' : 'bg-amber-400',
    text: isHigh ? 'text-rose-600' : 'text-amber-600'
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '/')
}

const getInitials = (title) => {
  return title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const getAvatarColor = (id) => {
  const colors = [
    'from-pink-400 to-rose-400',
    'from-orange-400 to-amber-400',
    'from-emerald-400 to-teal-400',
    'from-blue-400 to-indigo-400',
    'from-purple-400 to-violet-400',
  ]
  return colors[id % colors.length] || colors[0]
}

const Card = ({ card, onCardUpdated, onCardDeleted, isHistoricalView, columnIndex = 0 }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editDescription, setEditDescription] = useState(card.description || '')
  const [showActions, setShowActions] = useState(false)

  const priority = getPriorityBadge(card.id)
  const status = getColumnStatusBadge(columnIndex)
  const avatarGradient = getAvatarColor(card.id)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditTitle(card.title)
    setEditDescription(card.description || '')
  }

  const handleSave = async () => {
    try {
      await updateCard(card.id, {
        title: editTitle,
        description: editDescription
      })
      setIsEditing(false)
      onCardUpdated()
    } catch (error) {
      console.error('Error updating card:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteCard(card.id)
        onCardDeleted()
      } catch (error) {
        console.error('Error deleting card:', error)
      }
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-md border-2 border-indigo-300">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full font-semibold text-gray-900 mb-3 p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
          placeholder="Ticket title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full text-sm text-gray-600 p-3 border-2 border-gray-200 rounded-lg resize-none focus:border-indigo-500 focus:outline-none transition-colors"
          rows={3}
          placeholder="Description (optional)"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 rounded-lg shadow-md transition-all"
          >
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-4">
        {/* Top row: checkbox + more actions */}
        <div className="flex items-start justify-between mb-2">
          <Square size={14} className="text-slate-300 mt-0.5 flex-shrink-0" />
          {!isHistoricalView && (
            <div className={`transition-opacity duration-150 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleEdit}
                className="p-1 text-slate-300 hover:text-indigo-600 rounded transition-colors"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
          {isHistoricalView && <MoreHorizontal size={14} className="text-slate-300" />}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 pl-0">{card.title}</h3>

        {/* Date */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] text-slate-400 font-medium">{formatDate(card.created_at)}</span>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] text-slate-400 font-medium">Priority:</span>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          <span className={`text-[10px] font-semibold ${priority.text}`}>{priority.label}</span>
        </div>

        {/* Status badge */}
        <div className="mb-3">
          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Avatars + description */}
        <div className="flex items-end justify-between pt-2 border-t border-slate-100">
          <div className="flex -space-x-2">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center border-2 border-white shadow-sm`}>
              <span className="text-[8px] font-bold text-white">{getInitials(card.title)}</span>
            </div>
          </div>
          {card.description && (
            <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2 max-w-[60%] text-right">
              {card.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
