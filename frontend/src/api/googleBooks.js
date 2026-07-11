import axios from 'axios'

const BASE = 'https://www.googleapis.com/books/v1'
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || ''

// Google Books frequently omits `description` — fall back to subtitle, then
// a synthesized one-liner, so every book always has a summary to show.
function summarize(info) {
  if (info.description) return info.description.slice(0, 400)
  if (info.subtitle) return info.subtitle
  const author = info.authors?.join(', ')
  const genre  = info.categories?.[0]
  const bits = [genre ? `A ${genre.toLowerCase()} title` : 'A title', author ? `by ${author}` : null].filter(Boolean)
  return `${bits.join(' ')}. No official synopsis is available for this book yet.`
}

const formatBook = (b) => {
  if (!b || !b.id) return null
  const info = b.volumeInfo || {}
  const cover = info.imageLinks?.extraLarge
    || info.imageLinks?.large
    || info.imageLinks?.medium
    || info.imageLinks?.thumbnail
    || info.imageLinks?.smallThumbnail
    || null

  return {
    id: b.id,
    title:       info.title || 'Unknown Title',
    name:        info.title || 'Unknown Title',
    author:      info.authors?.join(', ') || 'Unknown Author',
    poster:      cover ? cover.replace('http:', 'https:').replace('&edge=curl', '') : null,
    image:       cover ? cover.replace('http:', 'https:').replace('&edge=curl', '') : null,
    cover:       cover ? cover.replace('http:', 'https:').replace('&edge=curl', '') : null,
    description: summarize(info),
    publisher:   info.publisher || '',
    year:        info.publishedDate?.split('-')[0] || '',
    genres:      info.categories || [],
    tags:        info.categories?.slice(0, 2) || [],
    rating:      info.averageRating || null,
    pages:       info.pageCount || null,
    url:         info.infoLink || null,
    language:    info.language || 'en',
    type:        'book',
  }
}

const buildParams = (extra = {}) => {
  const p = { maxResults: 20, printType: 'books', langRestrict: 'en', ...extra }
  if (API_KEY) p.key = API_KEY
  return p
}

export const searchBooks = async (query, page = 0) => {
  try {
    const r = await axios.get(`${BASE}/volumes`, {
      params: buildParams({ q: query, startIndex: page * 20, orderBy: 'relevance' }),
      timeout: 8000,
    })
    return (r.data.items || []).map(formatBook).filter(Boolean)
  } catch {
    return []
  }
}

export const getBooksBySubject = async (subject, page = 0) => {
  try {
    const r = await axios.get(`${BASE}/volumes`, {
      params: buildParams({ q: `subject:${subject}`, startIndex: page * 20 }),
      timeout: 8000,
    })
    return (r.data.items || []).map(formatBook).filter(Boolean)
  } catch {
    return []
  }
}

// Sequential to avoid rate limiting
export const getTrendingBooks = async () => {
  const queries = ['fiction bestseller', 'science popular', 'biography 2023']
  const results = []
  for (const q of queries) {
    try {
      const data = await searchBooks(q)
      results.push(...data.slice(0, 8))
      await new Promise(r => setTimeout(r, 150))
    } catch { /* skip */ }
  }
  // deduplicate by id
  const seen = new Set()
  return results.filter(b => { if (seen.has(b.id)) return false; seen.add(b.id); return true })
}

export const getBookDetails = async (id) => {
  try {
    const params = {}
    if (API_KEY) params.key = API_KEY
    const r = await axios.get(`${BASE}/volumes/${id}`, { params, timeout: 8000 })
    return formatBook(r.data)
  } catch {
    return null
  }
}

export const BOOK_CATEGORIES = [
  'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller',
  'Romance', 'Biography', 'History', 'Science', 'Self-Help',
  'Philosophy', 'Psychology', 'Business', 'Technology', 'Cooking',
]
