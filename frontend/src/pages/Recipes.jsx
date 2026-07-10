import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import RichCard from '../components/ui/RichCard'
import FilterBar from '../components/ui/FilterBar'
import DetailModal from '../components/ui/DetailModal'
import PageHero from '../components/ui/PageHero'
import PersonalizePanel from '../components/ui/PersonalizePanel'
import { CardSkeletonRow } from '../components/ui/LoadingSkeleton'
import AmbientBg from '../components/ui/AmbientBg'
import ContentTicker from '../components/ui/ContentTicker'
import { getMealsByCategory, getMealsByArea, getMealDetails, getMealsByIngredients } from '../api/mealdb'

const RECIPE_ACCENT = '#C4703A'

const RECIPE_FIELDS = [
  { id: 'cuisine', label: 'Cuisine', options: [
    { label: 'Italian',       value: 'italian' },
    { label: 'French',        value: 'french' },
    { label: 'Asian',         value: 'asian' },
    { label: 'Mexican',       value: 'mexican' },
    { label: 'Indian',        value: 'indian' },
    { label: 'South Indian',  value: 'south_indian' },
    { label: 'North Indian',  value: 'north_indian' },
    { label: 'Mediterranean', value: 'mediterranean' },
    { label: 'Filipino',      value: 'filipino' },
    { label: 'Albanian',      value: 'albanian' },
    { label: 'South African', value: 'south_african' },
    { label: 'British',       value: 'british' },
    { label: 'American',      value: 'american' },
  ]},
  { id: 'type', label: 'What are you making?', options: [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan',      value: 'vegan' },
    { label: 'Chicken',    value: 'chicken' },
    { label: 'Seafood',    value: 'seafood' },
    { label: 'Pasta',      value: 'pasta' },
    { label: 'Dessert',    value: 'dessert' },
    { label: 'Beef',       value: 'beef' },
    { label: 'Lamb',       value: 'lamb' },
    { label: 'Starter',    value: 'starter' },
  ]},
]

// TheMealDB tags newer entries with full country names rather than the
// adjectival area names its own /list.php?a=list endpoint suggests —
// e.g. Indian dishes are stored under area "India", not "Indian", French
// under "France" not "French", American under "United States" not
// "American". Using the adjectival form silently returns zero results.
const CUISINE_AREAS = {
  italian:      ['Italian'],
  french:       ['France'],
  asian:        ['Chinese', 'Japanese', 'Thai', 'Vietnamese'],
  mexican:      ['Mexican'],
  indian:       ['India'],
  south_indian: ['India'],
  north_indian: ['India'],
  american:     ['United States'],
  mediterranean:['Greek', 'Spanish', 'Moroccan'],
  filipino:     ['Filipino'],
  albanian:     ['Albanian'],
  south_african:['South African'],
  british:      ['British'],
}

// TheMealDB's "India" area dishes skew North Indian/Mughlai — these keyword
// lists let us split the pool by dish name instead of showing the same
// undifferentiated set for both South and North Indian filters.
const SOUTH_INDIAN_KEYWORDS = ['dosa', 'idli', 'sambar', 'vada', 'uttapam', 'rasam', 'appam', 'pongal', 'upma', 'payasam', 'chettinad', 'bisi bele', 'avial', 'poriyal', 'coconut chutney']
const NORTH_INDIAN_KEYWORDS = ['tandoori', 'naan', 'paratha', 'paneer', 'dal', 'rogan josh', 'biryani', 'curry', 'masala', 'kebab', 'tikka', 'korma', 'handi', 'mandi']

// TheMealDB currently has zero real matches for these cuisines under any
// spelling — better to show real, hand-picked dishes than nothing or (as
// the code used to do) a different country's food mislabeled as this one.
const CURATED_FALLBACK_RECIPES = {
  south_indian: [
    { id: 'si1', title: 'Masala Dosa', name: 'Masala Dosa', cuisine: 'South Indian', category: 'Vegetarian', genres: ['South Indian', 'Vegetarian'], tags: ['South Indian'], description: 'A crispy rice-and-lentil crepe filled with spiced potato masala, served with sambar and coconut chutney.', ingredients: [], type: 'recipe' },
    { id: 'si2', title: 'Idli Sambar', name: 'Idli Sambar', cuisine: 'South Indian', category: 'Vegetarian', genres: ['South Indian', 'Vegetarian'], tags: ['South Indian'], description: 'Steamed rice-and-lentil cakes served with a tangy, tamarind-based lentil and vegetable stew.', ingredients: [], type: 'recipe' },
    { id: 'si3', title: 'Medu Vada', name: 'Medu Vada', cuisine: 'South Indian', category: 'Vegetarian', genres: ['South Indian', 'Vegetarian'], tags: ['South Indian'], description: 'Crispy, savory lentil doughnuts, traditionally served with sambar and coconut chutney.', ingredients: [], type: 'recipe' },
    { id: 'si4', title: 'Uttapam', name: 'Uttapam', cuisine: 'South Indian', category: 'Vegetarian', genres: ['South Indian', 'Vegetarian'], tags: ['South Indian'], description: 'A thick, savory rice-and-lentil pancake topped with onions, tomatoes, and green chilies.', ingredients: [], type: 'recipe' },
    { id: 'si5', title: 'Rasam', name: 'Rasam', cuisine: 'South Indian', category: 'Vegetarian', genres: ['South Indian', 'Vegetarian'], tags: ['South Indian'], description: 'A tangy, peppery tamarind soup — a South Indian staple, often served with rice.', ingredients: [], type: 'recipe' },
    { id: 'si6', title: 'Bisi Bele Bath', name: 'Bisi Bele Bath', cuisine: 'South Indian', category: 'Vegetarian', genres: ['South Indian', 'Vegetarian'], tags: ['South Indian'], description: 'A Karnataka specialty of spiced rice, lentils, and vegetables cooked together into one comforting dish.', ingredients: [], type: 'recipe' },
    { id: 'si7', title: 'Pongal', name: 'Pongal', cuisine: 'South Indian', category: 'Vegetarian', genres: ['South Indian', 'Vegetarian'], tags: ['South Indian'], description: 'A comforting rice-and-lentil porridge tempered with cumin, pepper, and ghee.', ingredients: [], type: 'recipe' },
    { id: 'si8', title: 'Chettinad Chicken Curry', name: 'Chettinad Chicken Curry', cuisine: 'South Indian', category: 'Chicken', genres: ['South Indian', 'Chicken'], tags: ['South Indian'], description: 'A fiery, aromatic Tamil Nadu chicken curry built on freshly roasted and ground spices.', ingredients: [], type: 'recipe' },
  ],
  albanian: [
    { id: 'al1', title: 'Tavë Kosi', name: 'Tavë Kosi', cuisine: 'Albanian', category: 'Lamb', genres: ['Albanian'], tags: ['Albanian'], description: "Albania's national dish — baked lamb with rice in a tangy baked yogurt sauce.", ingredients: [], type: 'recipe' },
    { id: 'al2', title: 'Byrek', name: 'Byrek', cuisine: 'Albanian', category: 'Vegetarian', genres: ['Albanian', 'Vegetarian'], tags: ['Albanian'], description: 'Flaky layered phyllo pastry filled with cheese, spinach, or minced meat.', ingredients: [], type: 'recipe' },
    { id: 'al3', title: 'Fërgesë', name: 'Fërgesë', cuisine: 'Albanian', category: 'Vegetarian', genres: ['Albanian', 'Vegetarian'], tags: ['Albanian'], description: 'A baked dish of peppers, tomatoes, and cottage cheese, popular around Tirana.', ingredients: [], type: 'recipe' },
    { id: 'al4', title: 'Flija', name: 'Flija', cuisine: 'Albanian', category: 'Dessert', genres: ['Albanian'], tags: ['Albanian'], description: 'A traditional layered pancake-like dish, slow-cooked in layers over an open flame.', ingredients: [], type: 'recipe' },
  ],
  south_african: [
    { id: 'sa1', title: 'Bobotie', name: 'Bobotie', cuisine: 'South African', category: 'Beef', genres: ['South African'], tags: ['South African'], description: "South Africa's signature dish — spiced minced meat baked under a golden egg custard topping.", ingredients: [], type: 'recipe' },
    { id: 'sa2', title: 'Bunny Chow', name: 'Bunny Chow', cuisine: 'South African', category: 'Starter', genres: ['South African'], tags: ['South African'], description: 'A hollowed-out loaf of bread filled with rich curry — a Durban street food classic.', ingredients: [], type: 'recipe' },
    { id: 'sa3', title: 'Chakalaka', name: 'Chakalaka', cuisine: 'South African', category: 'Vegetarian', genres: ['South African', 'Vegetarian'], tags: ['South African'], description: 'A spicy vegetable relish of peppers, tomatoes, and beans, traditionally served with braai.', ingredients: [], type: 'recipe' },
    { id: 'sa4', title: 'Malva Pudding', name: 'Malva Pudding', cuisine: 'South African', category: 'Dessert', genres: ['South African'], tags: ['South African'], description: 'A sticky, caramelized sponge dessert served warm with custard or cream.', ingredients: [], type: 'recipe' },
  ],
}

const TYPE_MAP = {
  chicken: 'Chicken', seafood: 'Seafood', pasta: 'Pasta',
  vegetarian: 'Vegetarian', vegan: 'Vegan', dessert: 'Dessert',
  beef: 'Beef', lamb: 'Lamb', starter: 'Starter',
}

function dedup(arr) {
  const seen = new Set()
  return arr.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true })
}

const INITIAL_CATS = ['Vegetarian', 'Vegan', 'Chicken', 'Seafood']
const ALL_CATS     = ['Vegetarian', 'Vegan', 'Chicken', 'Seafood', 'Pasta', 'Dessert', 'Beef', 'Lamb', 'Starter']

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=2000&q=90',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=2000&q=90',
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=2000&q=90',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=2000&q=90',
]
const FLOATING = [
  { image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', title: 'Pasta Night', sub: 'Italian' },
  { image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', title: 'Sunday Brunch', sub: 'Comfort' },
  { image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', title: 'Fresh Bowl', sub: 'Healthy' },
]
const EMOJIS = {
  Chicken:'🍗', Seafood:'🦐', Pasta:'🍝', Dessert:'🍰',
  Vegetarian:'🥗', Vegan:'🌱', Beef:'🥩', Lamb:'🍖', Starter:'🥙',
}

export default function Recipes() {
  const [sections, setSections]           = useState({})
  const [loading, setLoading]             = useState(true)
  const [selected, setSelected]           = useState(null)
  const [detail, setDetail]               = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [forYou, setForYou]               = useState(null)
  const [forYouLoading, setForYouLoading] = useState(false)
  const [forYouLabel, setForYouLabel]     = useState('For You')

  useEffect(() => {
    setLoading(true)
    Promise.all(INITIAL_CATS.map(c => getMealsByCategory(c)))
      .then(results => {
        const obj = {}
        INITIAL_CATS.forEach((c, i) => { obj[c] = results[i] })
        setSections(obj)
      })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  const loadCategory = async (cat) => {
    if (sections[cat]) return
    try {
      const items = await getMealsByCategory(cat)
      setSections(prev => ({ ...prev, [cat]: items }))
    } catch {}
  }

  const handleClick = async (item) => {
    setSelected(item)
    try { setDetail(await getMealDetails(item.id)) } catch { setDetail(item) }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(150deg, #FEFCF8 0%, #FAF5EC 28%, #F5EDDE 58%, #EDEAD8 88%, #E5E0CA 100%)', position: 'relative', overflow: 'hidden' }}>
      <AmbientBg color1="#A04A20" color2="#7A3010" color3="#C4703A" />
      <PageHero images={BG_IMAGES} eyebrow="Kitchen & Table"
        title={<>Cook<br /><em style={{ fontStyle:'italic', color:'#E8A068' }}>Something</em><br />Beautiful</>}
        subtitle="Dishes from every cuisine — Indian, French, Filipino, South African and beyond."
        headlineFont='"DM Serif Display", serif'
        accentColor="#C4703A" overlayLeft="rgba(20,10,4,0.95)" ambientColor="rgba(196,112,58,0.2)"
        floatingCards={FLOATING}
        stats={[{value:'50K+',label:'Recipes'},{value:'195',label:'Cuisines'},{value:'Free',label:'Always'},{value:'Daily',label:'New Dishes'}]}
        bottomFade="#F7F3EE">
        <div className="flex gap-2.5 flex-wrap">
          <motion.button whileHover={{ y:-2 }} whileTap={{ scale:0.96 }}
            onClick={() => setActiveCategory(null)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{ background: !activeCategory ? '#C4703A' : '#fff', color: !activeCategory ? '#fff' : '#3A3630', border: `1.5px solid ${!activeCategory ? '#C4703A' : '#D4CCBC'}`, boxShadow: !activeCategory ? '0 6px 20px #C4703A40' : '0 1px 4px rgba(28,26,24,0.06)' }}>
            🍽️ All
          </motion.button>
          {ALL_CATS.map(c => (
            <motion.button key={c} whileHover={{ y:-2 }} whileTap={{ scale:0.96 }}
              onClick={() => { setActiveCategory(activeCategory === c ? null : c); loadCategory(c) }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{ background: activeCategory===c ? '#C4703A' : '#fff', color: activeCategory===c ? '#fff' : '#3A3630', border: `1.5px solid ${activeCategory===c ? '#C4703A' : '#D4CCBC'}`, boxShadow: activeCategory===c ? '0 6px 20px #C4703A40' : '0 1px 4px rgba(28,26,24,0.06)' }}>
              {EMOJIS[c]||'🍽️'} {c}
            </motion.button>
          ))}
        </div>
      </PageHero>

      <ContentTicker variant="mosaic"
        items={[
          ...FLOATING.map(f => ({ image: f.image, title: f.title, label: f.sub })),
          { image: BG_IMAGES[0], label: 'Cuisine' }, { image: BG_IMAGES[1], label: 'Dinner' },
          { image: BG_IMAGES[2], label: 'Cook' },    { image: BG_IMAGES[3], label: 'Feast' },
        ]}
        bg="#F7F3EE" accentColor={RECIPE_ACCENT}
      />

      <div className="py-10 space-y-10" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
          <PersonalizePanel
            question="What would you like to cook tonight?"
            fields={RECIPE_FIELDS}
            accentColor={RECIPE_ACCENT}
            showSearch
            searchLabel="Ingredients in your kitchen"
            searchPlaceholder="e.g. chicken, garlic, tomato — type what you have and we'll find recipes"
            onFilter={async (filterData) => {
              const { _description = '', _moodIntensity, _timeBudget, ...chipSel } = filterData
              const ingredients = _description
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)

              const cuisines = chipSel.cuisine || []
              const types    = chipSel.type    || []
              const cats     = types.map(t => TYPE_MAP[t]).filter(Boolean)

              const empty = !ingredients.length && !cuisines.length && !types.length
              if (empty) { setForYou(null); return }

              setForYouLoading(true)
              try {
                if (ingredients.length) {
                  setForYouLabel('From Your Kitchen')
                  const results = await getMealsByIngredients(ingredients)
                  setForYou(results.length ? results : dedup(Object.values(sections).flat()))
                  return
                }

                let pool
                if (cuisines.length) {
                  const perCuisine = await Promise.all(cuisines.map(async (c) => {
                    const areas = CUISINE_AREAS[c] || []
                    const raw = dedup((await Promise.all(areas.map(a => getMealsByArea(a).catch(() => [])))).flat())

                    let items = raw
                    if (c === 'south_indian') {
                      items = raw.filter(r => SOUTH_INDIAN_KEYWORDS.some(k => r.title.toLowerCase().includes(k)))
                    } else if (c === 'north_indian') {
                      const narrowed = raw.filter(r => NORTH_INDIAN_KEYWORDS.some(k => r.title.toLowerCase().includes(k)))
                      if (narrowed.length) items = narrowed
                    }

                    if (!items.length && CURATED_FALLBACK_RECIPES[c]) items = CURATED_FALLBACK_RECIPES[c]
                    return items
                  }))
                  pool = dedup(perCuisine.flat())
                  if (cats.length) {
                    const narrow = pool.filter(r => cats.some(c =>
                      r.category?.toLowerCase() === c.toLowerCase() ||
                      r.genres?.some(g => g.toLowerCase() === c.toLowerCase())
                    ))
                    if (narrow.length > 0) pool = narrow
                  }
                } else {
                  const allLoaded = dedup(Object.values(sections).flat())
                  if (cats.length) {
                    const unloaded = cats.filter(c => !sections[c])
                    if (unloaded.length) {
                      const fetched = await Promise.all(unloaded.map(c => getMealsByCategory(c).catch(() => [])))
                      pool = dedup([...allLoaded, ...fetched.flat()])
                        .filter(r => cats.some(c => r.category?.toLowerCase() === c.toLowerCase()))
                    } else {
                      pool = allLoaded.filter(r => cats.some(c => r.category?.toLowerCase() === c.toLowerCase()))
                    }
                  } else {
                    pool = allLoaded
                  }
                }

                setForYouLabel('For You')
                setForYou(pool.length ? pool : dedup(Object.values(sections).flat()))
              } finally {
                setForYouLoading(false)
              }
            }}
            resultCount={forYou?.length ?? null}
          />
        </div>

        {forYouLoading && (
          <div className="px-6 lg:px-14 max-w-screen-xl mx-auto"><CardSkeletonRow count={6} /></div>
        )}

        {!forYouLoading && forYou && (
          <div className="max-w-screen-xl mx-auto px-6 lg:px-14">
            <div className="flex items-baseline gap-4 mb-6">
              <h2 className="font-display font-semibold text-ink" style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', letterSpacing: '-0.025em' }}>
                {forYouLabel}
              </h2>
              <span style={{ fontSize: '13px', color: RECIPE_ACCENT, fontWeight: 600 }}>{forYou.length} recipes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {forYou.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                  <RichCard item={item} type="recipe" accentColor={RECIPE_ACCENT} onClick={() => handleClick(item)} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!forYou && <div className="max-w-screen-xl mx-auto px-6 lg:px-14"><FilterBar /></div>}
        {!forYou && loading && (
          <div className="px-6 lg:px-14 max-w-screen-xl mx-auto"><CardSkeletonRow count={6} /></div>
        )}
        {!forYou && !loading && (activeCategory
          ? [[activeCategory, sections[activeCategory] || []]]
          : Object.entries(sections)
        ).map(([cat, items]) => (
          <div key={cat}>
            <div className="max-w-screen-xl mx-auto px-6 lg:px-14 mb-5">
              <h2 className="font-display font-semibold text-ink" style={{ fontSize:'clamp(1.8rem,3vw,2.6rem)', letterSpacing:'-0.025em' }}>
                {EMOJIS[cat]||'🍽️'} {cat}
              </h2>
            </div>
            <div className="pl-6 lg:pl-14">
              <Swiper modules={[Navigation,FreeMode]} freeMode slidesPerView="auto" spaceBetween={18} grabCursor className="!overflow-visible">
                {items.map((item, i) => (
                  <SwiperSlide key={`${item.id}-${i}`} style={{width:'230px'}}>
                    <RichCard item={item} type="recipe" accentColor="#C4703A" onClick={()=>handleClick(item)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ))}
      </div>
      <DetailModal item={detail||selected} type="recipe" isOpen={!!selected} onClose={() => { setSelected(null); setDetail(null) }} />
    </div>
  )
}
