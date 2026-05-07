import React from 'react'
import { Clock, RotateCcw } from 'lucide-react'

const Timeline = ({ events, selectedTimestamp, onChange }) => {
  if (!events || events.length === 0) {
    return null
  }

  const firstEvent = events[0]
  const lastEvent = events[events.length - 1]
  const now = new Date()

  const minTime = new Date(firstEvent.timestamp).getTime()
  const maxTime = now.getTime()
  const selectedTime = selectedTimestamp ? selectedTimestamp.getTime() : maxTime

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value)
    const timestamp = new Date(value)
    
    if (value === maxTime) {
      onChange(null)
    } else {
      onChange(timestamp)
    }
  }

  const handleReset = () => {
    onChange(null)
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Live'
    return new Date(timestamp).toLocaleString()
  }

  const getPercentage = () => {
    if (selectedTimestamp === null) return 100
    return ((selectedTime - minTime) / (maxTime - minTime)) * 100
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Clock size={16} className="text-white/70" />
          </div>
          <h2 className="font-semibold text-white text-sm tracking-wide">Time Travel</h2>
        </div>
        {selectedTimestamp && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors border border-white/10"
          >
            <RotateCcw size={13} />
            Return to Live
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs font-medium text-white/50">
          <span>{formatTime(minTime)}</span>
          <span className={`${selectedTimestamp ? 'text-purple-300' : 'text-emerald-300'}`}>
            {formatTime(selectedTimestamp)}
          </span>
          <span>{formatTime(maxTime)}</span>
        </div>

        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-purple-400/50 rounded-full transition-all duration-75"
            style={{ width: `${getPercentage()}%` }}
          />
          <input
            type="range"
            min={minTime}
            max={maxTime}
            value={selectedTime}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-purple-400 rounded-full shadow-sm transition-all duration-75 pointer-events-none"
            style={{ left: `calc(${getPercentage()}% - 8px)` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-wider font-medium">
          <span>Board Created</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  )
}

export default Timeline
