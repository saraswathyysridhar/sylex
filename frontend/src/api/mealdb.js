import axios from 'axios'

const BASE = 'https://www.themealdb.com/api/json/v1/1'

const formatMeal = (m) => ({
  id: m.idMeal,
  title: m.strMeal,
  name: m.strMeal,
  image: m.strMealThumb,
  poster: m.strMealThumb,
  cuisine: m.strArea,
  category: m.strCategory,
  tags: m.strTags ? m.strTags.split(',').map(t => t.trim()).filter(Boolean) : [],
  genres: [m.strCategory, m.strArea].filter(Boolean),
  description: m.strInstructions ? m.strInstructions.slice(0, 300) + '...' : '',
  url: m.strSource || null,
  youtube: m.strYoutube || null,
  ingredients: getIngredients(m),
  type: 'recipe',
})

const getIngredients = (m) => {
  const list = []
  for (let i = 1; i <= 20; i++) {
    const ing = m[`strIngredient${i}`]
    const mea = m[`strMeasure${i}`]
    if (ing && ing.trim()) list.push({ ingredient: ing, measure: mea || '' })
  }
  return list
}

export const searchMeals = async (query) => {
  const r = await axios.get(`${BASE}/search.php`, { params: { s: query } })
  return (r.data.meals || []).map(formatMeal)
}

export const getMealsByCategory = async (category) => {
  const r = await axios.get(`${BASE}/filter.php`, { params: { c: category } })
  const basic = (r.data.meals || []).slice(0, 20)
  return basic.map(m => ({
    id: m.idMeal,
    title: m.strMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    poster: m.strMealThumb,
    category,
    genres: [category],
    tags: [],
    type: 'recipe',
  }))
}

export const getCategories = async () => {
  const r = await axios.get(`${BASE}/categories.php`)
  return r.data.categories || []
}

export const getMealsByArea = async (area) => {
  const r = await axios.get(`${BASE}/filter.php`, { params: { a: area } })
  return (r.data.meals || []).slice(0, 20).map(m => ({
    id: m.idMeal,
    title: m.strMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    poster: m.strMealThumb,
    cuisine: area,
    genres: [area],
    tags: [],
    type: 'recipe',
  }))
}

export const getMealDetails = async (id) => {
  const r = await axios.get(`${BASE}/lookup.php`, { params: { i: id } })
  const meals = r.data.meals
  return meals ? formatMeal(meals[0]) : null
}

export const getRandomMeals = async (count = 6) => {
  const promises = Array.from({ length: count }, () =>
    axios.get(`${BASE}/random.php`).then(r => formatMeal(r.data.meals[0]))
  )
  return Promise.all(promises)
}

export const getMealsByIngredients = async (ingredients) => {
  if (!ingredients.length) return []
  const searches = await Promise.allSettled(
    ingredients.slice(0, 3).map(ing => {
      const normalized = ing.trim().replace(/\s+/g, '_')
      return axios.get(`${BASE}/filter.php`, { params: { i: normalized } })
        .then(r => r.data.meals || [])
    })
  )
  const valid = searches
    .filter(r => r.status === 'fulfilled' && r.value.length > 0)
    .map(r => r.value)
  if (!valid.length) return []

  const idSets = valid.map(meals => new Set(meals.map(m => m.idMeal)))
  let matched = valid[0]
  for (let i = 1; i < idSets.length; i++) {
    matched = matched.filter(m => idSets[i].has(m.idMeal))
  }
  if (!matched.length) matched = valid[0]

  return matched.slice(0, 20).map(m => ({
    id: m.idMeal,
    title: m.strMeal,
    name: m.strMeal,
    image: m.strMealThumb,
    poster: m.strMealThumb,
    genres: [],
    tags: [],
    type: 'recipe',
  }))
}

export const MEAL_CATEGORIES = [
  'Beef', 'Chicken', 'Dessert', 'Lamb', 'Miscellaneous',
  'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 'Vegan', 'Vegetarian',
]
