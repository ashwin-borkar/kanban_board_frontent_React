import React, { useState, useEffect } from 'react'
import KanbanBoard from './components/KanbanBoard'
import Timeline from './components/Timeline'
import ActivityLog from './components/ActivityLog'
import { fetchBoardState, fetchBoardEvents } from './services/api'
import { Layout, History, ChevronLeft, Search, Bell, Grid3X3, Plus, Home, ChevronRight, Star } from 'lucide-react'

function App() {
  const [columns, setColumns] = useState([])
  const [events, setEvents] = useState([])
  const [selectedTimestamp, setSelectedTimestamp] = useState(null)
  const [isHistoricalView, setIsHistoricalView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const loadBoardState = async (timestamp = null) => {
    try {
      setLoading(true)
      let data
      if (timestamp) {
        data = await fetchBoardState(timestamp)
      } else {
        data = await fetchBoardState()
      }
      setColumns(data)
    } catch (error) {
      console.error('Error loading board state:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    try {
      const data = await fetchBoardEvents()
      setEvents(data)
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  useEffect(() => {
    loadBoardState()
    loadEvents()
  }, [])

  const handleTimelineChange = async (timestamp) => {
    if (timestamp === null) {
      setSelectedTimestamp(null)
      setIsHistoricalView(false)
      await loadBoardState()
    } else {
      setSelectedTimestamp(timestamp)
      setIsHistoricalView(true)
      await loadBoardState(timestamp)
    }
  }

  const handleCardAction = async () => {
    await loadBoardState()
    await loadEvents()
  }

  const filteredColumns = searchQuery.trim()
    ? columns.map(col => ({
        ...col,
        cards: col.cards.filter(card =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }))
    : columns

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d1b4e] via-[#4a1c6b] to-[#8b2c5c]">
      {/* Top Navigation Bar */}
      <header className="bg-[#1e1330]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center h-14 px-4">
          {/* Left: Logo + Back + Breadcrumb */}
          <div className="flex items-center gap-3 flex-1">
            <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ChevronLeft size={16} className="text-white/70" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/60">
              <Home size={14} />
              <ChevronRight size={12} />
              <span className="hover:text-white/90 cursor-pointer transition-colors">Projects</span>
              <ChevronRight size={12} />
              <span className="text-white/90 font-medium">Kanban Board</span>
              <Star size={12} className="text-yellow-400 ml-1" />
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/25 focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors relative">
              <Grid3X3 size={14} className="text-white/70" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors relative">
              <Bell size={14} className="text-white/70" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">5</span>
            </button>
            <button className="flex items-center gap-2 px-4 h-9 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20">
              <Plus size={14} />
              Create New
            </button>
          </div>
        </div>
      </header>

      {/* Sub Navigation Bar */}
      <div className="bg-[#1e1330]/60 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-md bg-white/10 text-white/90 text-xs font-medium hover:bg-white/15 transition-colors">
            <Plus size={12} />
            New Task
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-md bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-colors">
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-md bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-colors">
            All Tasks
          </button>
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-md bg-white/10 text-white/90 text-xs font-medium hover:bg-white/15 transition-colors">
            <Layout size={12} />
            Kanban View
          </button>
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-md bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-colors">
            Drag & Drop
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-md bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-colors">
            Status
          </button>
          <button className="flex items-center gap-1.5 px-3 h-8 rounded-md bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-colors border border-white/10">
            <Star size={12} />
            Save View
          </button>
          <div className="flex-1" />
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-48 h-8 pl-8 pr-3 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all"
            />
          </div>
        </div>
      </div>

      <main className="p-6">
        {isHistoricalView && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg max-w-fit">
            <History size={14} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-300">Historical View — Read Only</span>
          </div>
        )}

        <Timeline
          events={events}
          selectedTimestamp={selectedTimestamp}
          onChange={handleTimelineChange}
        />

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-sm text-white/60 font-medium">Loading board...</p>
            </div>
          </div>
        ) : (
          <KanbanBoard
            columns={filteredColumns}
            onCardAction={handleCardAction}
            isHistoricalView={isHistoricalView}
          />
        )}

        <ActivityLog events={events} />
      </main>
    </div>
  )
}

export default App
