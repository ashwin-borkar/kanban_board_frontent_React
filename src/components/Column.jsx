import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Card from './Card'
import CardForm from './CardForm'
import { Plus } from 'lucide-react'

const getColumnHeaderStyle = (index) => {
  const styles = [
    { bg: 'bg-emerald-500', text: 'text-white', countBg: 'bg-emerald-400', countText: 'text-emerald-900' },
    { bg: 'bg-amber-500', text: 'text-white', countBg: 'bg-amber-400', countText: 'text-amber-900' },
    { bg: 'bg-rose-500', text: 'text-white', countBg: 'bg-rose-400', countText: 'text-rose-900' },
    { bg: 'bg-slate-500', text: 'text-white', countBg: 'bg-slate-400', countText: 'text-slate-900' },
    { bg: 'bg-red-500', text: 'text-white', countBg: 'bg-red-400', countText: 'text-red-900' },
  ]
  return styles[index % styles.length] || styles[0]
}

const Column = ({ column, onAddCard, showCardForm, onCancelAddCard, onCardCreated, isHistoricalView, index }) => {
  const headerStyle = getColumnHeaderStyle(index)

  return (
    <div className="flex flex-col h-full w-[320px]">
      {/* Colored Column Header */}
      <div className={`${headerStyle.bg} rounded-lg px-4 py-2.5 mb-3 flex items-center justify-between shadow-sm`}>
        <h2 className={`font-semibold text-sm ${headerStyle.text}`}>{column.name}</h2>
        <span className={`text-xs font-bold ${headerStyle.countBg} ${headerStyle.countText} px-2 py-0.5 rounded`}>
          {column.cards.length}
        </span>
      </div>

      <Droppable droppableId={column.id.toString()}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[150px] space-y-3 transition-all duration-200 rounded-lg ${
              snapshot.isDraggingOver ? 'bg-white/10' : ''
            }`}
          >
            {column.cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24 text-white/30 text-xs font-medium">
                No tasks
              </div>
            )}
            {column.cards.map((card, cardIndex) => (
              <Draggable key={card.id} draggableId={card.id.toString()} index={cardIndex} isDragDisabled={isHistoricalView}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'opacity-90 rotate-1 scale-[1.02]' : ''}
                  >
                    <Card card={card} onCardUpdated={onCardCreated} onCardDeleted={onCardCreated} isHistoricalView={isHistoricalView} columnIndex={index} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {!isHistoricalView && (
        <div className="mt-3">
          {showCardForm ? (
            <CardForm
              columnId={column.id}
              onCancel={onCancelAddCard}
              onCreated={onCardCreated}
            />
          ) : (
            <button
              onClick={() => onAddCard(column.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-white/70 
                         bg-white/10 border border-dashed border-white/20 hover:border-white/40 hover:text-white
                         hover:bg-white/15 rounded-lg transition-all duration-200"
            >
              <Plus size={14} />
              Add Task
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Column
