import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchColumns = async () => {
  const response = await api.get('/columns')
  return response.data
}

export const fetchCards = async () => {
  const response = await api.get('/cards')
  return response.data
}

export const fetchBoardState = async (timestamp = null) => {
  if (timestamp) {
    const response = await api.get('/board/state_at', {
      params: { timestamp: timestamp.toISOString() }
    })
    return response.data
  } else {
    const response = await api.get('/board/state')
    return response.data
  }
}

export const fetchBoardEvents = async (limit = 50) => {
  const response = await api.get('/board/events', {
    params: { limit }
  })
  return response.data
}

export const createCard = async (cardData) => {
  const response = await api.post('/cards', { card: cardData })
  return response.data
}

export const updateCard = async (id, cardData) => {
  const response = await api.put(`/cards/${id}`, { card: cardData })
  return response.data
}

export const deleteCard = async (id) => {
  await api.delete(`/cards/${id}`)
}

export const moveCard = async (id, columnId, position) => {
  const response = await api.post(`/cards/${id}/move`, {
    column_id: columnId,
    position
  })
  return response.data
}

export const reorderCard = async (id, position) => {
  const response = await api.post(`/cards/${id}/reorder`, { position })
  return response.data
}
