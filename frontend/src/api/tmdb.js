import axios from 'axios'

const BASE = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'
// Replace with your TMDB API key from https://www.themoviedb.org/settings/api
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY'

const tmdb = axios.create({
  baseURL: BASE,
  params: { api_key: API_KEY, language: 'en-US' },
})

const poster = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null

const backdrop = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : null

const formatMovie = (m) => ({
  id: m.id,
  title: m.title || m.name,
  poster: poster(m.poster_path),
  banner: backdrop(m.backdrop_path),
  rating: m.vote_average,
  year: m.release_date ? m.release_date.split('-')[0] : '',
  description: m.overview,
  genres: m.genre_ids || [],
  language: m.original_language || 'en',
  trending: m.popularity > 500,
  type: 'movie',
})

export const getTrending = async (page = 1) => {
  const r = await tmdb.get('/trending/movie/week', { params: { page } })
  return r.data.results.map(formatMovie)
}

export const getPopular = async (page = 1) => {
  const r = await tmdb.get('/movie/popular', { params: { page } })
  return r.data.results.map(formatMovie)
}

export const getTopRated = async (page = 1) => {
  const r = await tmdb.get('/movie/top_rated', { params: { page } })
  return r.data.results.map(formatMovie)
}

export const getNowPlaying = async () => {
  const r = await tmdb.get('/movie/now_playing')
  return r.data.results.map(formatMovie)
}

export const searchMovies = async (query, page = 1) => {
  const r = await tmdb.get('/search/movie', { params: { query, page } })
  return r.data.results.map(formatMovie)
}

export const getMovieDetails = async (id) => {
  const r = await tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'videos,similar' },
  })
  const d = r.data
  const trailer = d.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  return {
    ...formatMovie(d),
    runtime: d.runtime ? `${d.runtime} min` : null,
    genres: d.genres?.map(g => g.name) || [],
    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
    similar: d.similar?.results?.slice(0, 6).map(formatMovie) || [],
    director: d.credits?.crew?.find(c => c.job === 'Director')?.name || null,
  }
}

export const getByLanguage = async (lang, page = 1) => {
  const r = await tmdb.get('/discover/movie', {
    params: { with_original_language: lang, sort_by: 'popularity.desc', 'vote_count.gte': 80, page },
  })
  return r.data.results.map(formatMovie)
}

export const getClassics = async (page = 1) => {
  const r = await tmdb.get('/discover/movie', {
    params: { sort_by: 'vote_count.desc', 'primary_release_date.lte': '2002-12-31', 'primary_release_date.gte': '1975-01-01', 'vote_count.gte': 500, page },
  })
  return r.data.results.map(formatMovie)
}

export const discoverByGenre = async (genreId, page = 1) => {
  const r = await tmdb.get('/discover/movie', {
    params: { with_genres: genreId, sort_by: 'popularity.desc', page },
  })
  return r.data.results.map(formatMovie)
}

export const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
}
