import React from 'react'
import { Activity, Plus, Pencil, ArrowLeftRight, ArrowUpDown, Trash2 } from 'lucide-react'

const ActivityLog = ({ events }) => {
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'card_created': return <Plus size={12} className="text-emerald-500" />
      case 'card_updated': return <Pencil size={12} className="text-amber-500" />
      case 'card_moved': return <ArrowLeftRight size={12} className="text-blue-500" />
      case 'card_reordered': return <ArrowUpDown size={12} className="text-violet-500" />
      case 'card_deleted': return <Trash2 size={12} className="text-rose-500" />
      default: return <Activity size={12} className="text-slate-400" />
    }
  }

  const getEventBg = (eventType) => {
    switch (eventType) {
      case 'card_created': return 'bg-emerald-50 border-emerald-100'
      case 'card_updated': return 'bg-amber-50 border-amber-100'
      case 'card_moved': return 'bg-blue-50 border-blue-100'
      case 'card_reordered': return 'bg-violet-50 border-violet-100'
      case 'card_deleted': return 'bg-rose-50 border-rose-100'
      default: return 'bg-slate-50 border-slate-100'
    }
  }

  const formatEventMessage = (event) => {
    const cardTitle = event.new_title || event.old_title || 'Unknown ticket'

    switch (event.event_type) {
      case 'card_created':
        return `Ticket '${cardTitle}' created`
      case 'card_updated':
        return `Ticket '${cardTitle}' updated`
      case 'card_moved':
        return `Ticket '${cardTitle}' moved`
      case 'card_reordered':
        return `Ticket '${cardTitle}' reordered`
      case 'card_deleted':
        return `Ticket '${event.old_title}' deleted`
      default:
        return 'Unknown event'
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!events || events.length === 0) {
    return null
  }

  const recentEvents = events.slice(-20).reverse()

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Activity size={16} className="text-white/70" />
          </div>
          <h2 className="font-semibold text-white text-sm tracking-wide">Activity Log</h2>
        </div>
        <span className="text-xs text-white/40 font-medium">{events.length} events</span>
      </div>

      <div className="max-h-[320px] overflow-y-auto p-3 space-y-2">
        {recentEvents.map((event) => (
          <div key={event.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors`}>
            <div className="flex-shrink-0 w-6 h-6 mt-0.5 bg-white/10 rounded-md flex items-center justify-center">
              {getEventIcon(event.event_type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80 leading-snug">{formatEventMessage(event)}</p>
              <p className="text-[10px] text-white/40 mt-0.5 font-medium">{formatTimestamp(event.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityLog
