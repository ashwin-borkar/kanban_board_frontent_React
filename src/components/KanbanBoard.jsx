import React, { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import Column from './Column'
import CardForm from './CardForm'
import { moveCard, reorderCard } from '../services/api'

const KanbanBoard = ({ columns, onCardAction, isHistoricalView }) => {
  const [showCardForm, setShowCardForm] = useState(null)
  const [boardColumns, setBoardColumns] = useState(columns)

  React.useEffect(() => {
    setBoardColumns(columns)
  }, [columns])

  const handleDragEnd = async (result) => {
    if (isHistoricalView) return

    const { source, destination, draggableId } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const sourceColumn = boardColumns.find(col => col.id.toString() === source.droppableId)
    const destColumn = boardColumns.find(col => col.id.toString() === destination.droppableId)

    if (source.droppableId === destination.droppableId) {
      // Reorder within same column
      const newCards = Array.from(sourceColumn.cards)
      const [movedCard] = newCards.splice(source.index, 1)
      newCards.splice(destination.index, 0, movedCard)

      // Update positions
      newCards.forEach((card, index) => {
        card.position = index + 1
      })

      const newColumns = boardColumns.map(col => {
        if (col.id.toString() === source.droppableId) {
          return { ...col, cards: newCards }
        }
        return col
      })

      setBoardColumns(newColumns)

      // API call for the moved card
      try {
        await reorderCard(draggableId, destination.index + 1)
        onCardAction()
      } catch (error) {
        console.error('Error reordering card:', error)
      }
    } else {
      // Move to different column
      const sourceCards = Array.from(sourceColumn.cards)
      const destCards = Array.from(destColumn.cards)
      const [movedCard] = sourceCards.splice(source.index, 1)
      destCards.splice(destination.index, 0, movedCard)

      // Update positions in both columns
      sourceCards.forEach((card, index) => {
        card.position = index + 1
      })
      destCards.forEach((card, index) => {
        card.position = index + 1
      })

      const newColumns = boardColumns.map(col => {
        if (col.id.toString() === source.droppableId) {
          return { ...col, cards: sourceCards }
        }
        if (col.id.toString() === destination.droppableId) {
          return { ...col, cards: destCards }
        }
        return col
      })

      setBoardColumns(newColumns)

      // API call
      try {
        await moveCard(draggableId, destination.droppableId, destination.index + 1)
        onCardAction()
      } catch (error) {
        console.error('Error moving card:', error)
      }
    }
  }

  const handleAddCard = (columnId) => {
    if (!isHistoricalView) {
      setShowCardForm(columnId)
    }
  }

  return (
    <div className="overflow-x-auto pb-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 min-w-max">
          {boardColumns.map((column, index) => (
            <Column
              key={column.id}
              column={column}
              index={index}
              onAddCard={handleAddCard}
              showCardForm={showCardForm === column.id}
              onCancelAddCard={() => setShowCardForm(null)}
              onCardCreated={onCardAction}
              isHistoricalView={isHistoricalView}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default KanbanBoard
