import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

const extractError = (err, fallback) => {
  const data = err.response?.data?.error
  if (typeof data === 'string') return data
  if (data && typeof data === 'object' && typeof data.message === 'string') return data.message
  return fallback
}

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null)
  const [favorites, setFavorites] = useState({})
  const [notes, setNotesState]    = useState({})
  const [avatar, setAvatarState]  = useState(null)
  const [clicks, setClicks]       = useState({})
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const stored       = localStorage.getItem('sylex_user')
    const storedFavs   = localStorage.getItem('sylex_favorites')
    const storedNotes  = localStorage.getItem('sylex_notes')
    const storedClicks = localStorage.getItem('sylex_clicks')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      const storedAvatar = localStorage.getItem(`sylex_avatar_${u.id}`)
      if (storedAvatar) setAvatarState(storedAvatar)
      const storedToken = localStorage.getItem('sylex_token')
      if (storedToken) api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
    if (storedFavs)   setFavorites(JSON.parse(storedFavs))
    if (storedNotes)  setNotesState(JSON.parse(storedNotes))
    if (storedClicks) setClicks(JSON.parse(storedClicks))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const userData = res.data.user
      setUser(userData)
      localStorage.setItem('sylex_user', JSON.stringify(userData))
      if (res.data.token) {
        localStorage.setItem('sylex_token', res.data.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      }
      const storedAvatar = localStorage.getItem(`sylex_avatar_${userData.id}`)
      setAvatarState(storedAvatar || null)
      return { success: true }
    } catch (err) {
      return { success: false, error: extractError(err, 'Something went wrong. Please try again.') }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/api/auth/signup', { name, email, password })
      return { success: true, needsVerification: true, message: res.data.message }
    } catch (err) {
      return { success: false, error: extractError(err, 'Something went wrong. Please try again.') }
    }
  }

  const logout = () => {
    setUser(null)
    setFavorites({})
    setAvatarState(null)
    localStorage.removeItem('sylex_user')
    localStorage.removeItem('sylex_token')
    localStorage.removeItem('sylex_favorites')
    delete api.defaults.headers.common['Authorization']
  }

  const toggleFavorite = (item, type) => {
    const key = `${type}_${item.id}`
    const updated = { ...favorites }
    if (updated[key]) {
      delete updated[key]
    } else {
      updated[key] = { ...item, type, savedAt: new Date().toISOString() }
    }
    setFavorites(updated)
    localStorage.setItem('sylex_favorites', JSON.stringify(updated))
  }

  const isFavorite = (id, type) => !!favorites[`${type}_${id}`]

  const getFavoritesByType = (type) =>
    Object.values(favorites).filter(f => f.type === type)

  const setAvatar = (base64) => {
    if (!user) return
    setAvatarState(base64)
    localStorage.setItem(`sylex_avatar_${user.id}`, base64)
  }

  const removeAvatar = () => {
    if (!user) return
    setAvatarState(null)
    localStorage.removeItem(`sylex_avatar_${user.id}`)
  }

  const setNote = (type, id, text) => {
    const key = `${type}_${id}`
    const updated = { ...notes }
    if (text.trim()) {
      updated[key] = text
    } else {
      delete updated[key]
    }
    setNotesState(updated)
    localStorage.setItem('sylex_notes', JSON.stringify(updated))
  }

  const getNote = (type, id) => notes[`${type}_${id}`] || ''

  // ── Click tracking (powers "Trending From Our Users") ────────────────────
  const trackClick = (type, id, itemData = {}) => {
    const key = `${type}_${id}`
    const current = clicks[key] || { count: 0, type, id }
    const updated = {
      ...clicks,
      [key]: {
        ...current,
        count: current.count + 1,
        type,
        id,
        title:  itemData.title  || current.title  || '',
        poster: itemData.poster || current.poster  || '',
        image:  itemData.image  || current.image   || '',
        genres: itemData.genres || current.genres  || [],
        rating: itemData.rating || current.rating  || null,
      },
    }
    setClicks(updated)
    localStorage.setItem('sylex_clicks', JSON.stringify(updated))
  }

  const getTopClicked = (type, limit = 10) =>
    Object.values(clicks)
      .filter(c => !type || c.type === type)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)

  return (
    <AuthContext.Provider value={{
      user, loading, login, signup, logout,
      favorites, toggleFavorite, isFavorite, getFavoritesByType,
      avatar, setAvatar, removeAvatar,
      notes, setNote, getNote,
      trackClick, getTopClicked,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
