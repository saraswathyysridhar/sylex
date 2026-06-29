import axios from 'axios'

const BASE = 'https://api.rawg.io/api'
// Replace with your RAWG API key from https://rawg.io/apidocs
const API_KEY = import.meta.env.VITE_RAWG_API_KEY || 'YOUR_RAWG_API_KEY'

const rawg = axios.create({
  baseURL: BASE,
  params: { key: API_KEY },
})

const formatGame = (g) => ({
  id: g.id,
  title: g.name,
  name: g.name,
  poster: g.background_image,
  image: g.background_image,
  rating: g.rating,
  year: g.released ? g.released.split('-')[0] : '',
  genres: g.genres?.map(ge => ge.name) || [],
  platforms: g.platforms?.map(p => p.platform.name).slice(0, 3) || [],
  tags: g.tags?.map(t => t.name).slice(0, 3) || [],
  trending: g.added > 10000,
  metacritic: g.metacritic,
  description: g.description_raw || '',
  url: `https://rawg.io/games/${g.slug}`,
  type: 'game',
})

export const getPopularGames = async (page = 1) => {
  const r = await rawg.get('/games', {
    params: { ordering: '-added', page, page_size: 20 },
  })
  return r.data.results.map(formatGame)
}

export const getTrendingGames = async () => {
  const r = await rawg.get('/games', {
    params: { ordering: '-rating', page_size: 20, dates: '2020-01-01,2024-12-31' },
  })
  return r.data.results.map(formatGame)
}

export const getTopRatedGames = async (page = 1) => {
  const r = await rawg.get('/games', {
    params: { ordering: '-metacritic', page, page_size: 20 },
  })
  return r.data.results.map(formatGame)
}

export const searchGames = async (query, page = 1) => {
  const r = await rawg.get('/games', { params: { search: query, page, page_size: 20 } })
  return r.data.results.map(formatGame)
}

export const getGameDetails = async (id) => {
  const r = await rawg.get(`/games/${id}`)
  return formatGame(r.data)
}

export const getGamesByGenre = async (genreSlug, page = 1) => {
  const r = await rawg.get('/games', {
    params: { genres: genreSlug, ordering: '-rating', page, page_size: 20 },
  })
  return r.data.results.map(formatGame)
}

export const GAME_GENRES = [
  { id: 'action', label: 'Action' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'role-playing-games-rpg', label: 'RPG' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'shooter', label: 'Shooter' },
  { id: 'puzzle', label: 'Puzzle' },
  { id: 'indie', label: 'Indie' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'sports', label: 'Sports' },
  { id: 'racing', label: 'Racing' },
]
