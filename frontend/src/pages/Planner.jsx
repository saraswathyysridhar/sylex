import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react'

const SERIF = '"Bodoni Moda", "Cormorant Garamond", Georgia, serif'
const GOLD  = '#C49A6C'
const DARK  = '#0C0A08'
const CREAM = '#F7F3EE'
const INK   = '#2A1E10'

// ── Step options ─────────────────────────────────────────────────────────────
const ENERGY_OPTS = [
  { id: 'low',  emoji: '😮‍💨', label: 'Running on Empty', desc: 'Low-effort mode only' },
  { id: 'mid',  emoji: '😌',   label: 'Steady & Calm',    desc: 'Balanced and at ease' },
  { id: 'high', emoji: '⚡',   label: 'Fully Charged',    desc: 'Ready for anything' },
]

const COMPANY_OPTS = [
  { id: 'solo',    emoji: '🧘', label: 'Just Me',  desc: 'A night entirely for myself' },
  { id: 'partner', emoji: '💛', label: 'Partner',  desc: 'Quality time for two' },
  { id: 'friends', emoji: '🎉', label: 'Friends',  desc: 'The crew is all here' },
  { id: 'family',  emoji: '🏠', label: 'Family',   desc: 'All together now' },
]

const VIBE_OPTS = [
  { id: 'cozy',        emoji: '🌙', label: 'Cozy',        desc: 'Warm, soft, indulgent' },
  { id: 'romantic',    emoji: '🌹', label: 'Romantic',    desc: 'Atmosphere & intimacy' },
  { id: 'adventurous', emoji: '🌿', label: 'Adventurous', desc: 'Explore & discover' },
  { id: 'creative',    emoji: '🎨', label: 'Creative',    desc: 'Make or get inspired' },
  { id: 'social',      emoji: '🎊', label: 'Social',      desc: 'High energy & fun' },
  { id: 'focused',     emoji: '🔭', label: 'Focused',     desc: 'Deep work or flow state' },
]

const STEPS = [
  { q: "What's your energy like right now?",  sub: "Be honest — we'll match the plan to it.", opts: ENERGY_OPTS,  cols: 3, key: 'energy'  },
  { q: "Who are you spending time with?",      sub: "This shapes everything.",                 opts: COMPANY_OPTS, cols: 4, key: 'company' },
  { q: "What's the vibe you're after?",        sub: "Pick the one that feels right.",          opts: VIBE_OPTS,    cols: 3, key: 'vibe'    },
]

// ── 24 hand-curated plans: every vibe × company combo ────────────────────────
const PLANS = {
  cozy_solo: {
    title: 'A Cozy Night In',
    tagline: 'Just you, warmth, and something wonderful.',
    movie:    { name: 'Amélie (2001)',                      note: 'Whimsical and quietly life-affirming' },
    recipe:   { name: 'Ramen from Scratch',                 note: 'Warm, meditative, deeply satisfying' },
    drink:    { name: 'Chamomile Honey Tea',                note: 'Calms the mind, warms the soul' },
    music:    { name: 'Lo-fi Chill Beats',                  note: 'The perfect soft background' },
    activity: { name: 'Long bath + your comfort show after', note: 'Full reset mode — no guilt' },
    book:     { name: 'The Midnight Library – Matt Haig',   note: 'Magical and deeply comforting' },
  },
  cozy_partner: {
    title: 'A Warm Evening for Two',
    tagline: 'No plans. Just each other.',
    movie:    { name: 'Julie & Julia (2009)',                note: 'Food, love, and real life' },
    recipe:   { name: 'Pasta Carbonara',                    note: 'Classic, rich — make it together' },
    drink:    { name: 'Mulled Wine',                        note: 'Warming and celebratory' },
    music:    { name: 'Acoustic Love Songs',                note: 'Soft background that says everything' },
    activity: { name: 'Cook dinner together, then board games', note: 'The best kind of date night' },
    book:     { name: 'The Hating Game – Sally Thorne',     note: 'Cozy enemies-to-lovers — read a chapter aloud' },
  },
  cozy_friends: {
    title: 'Cozy Squad Night',
    tagline: 'Good company, better food.',
    movie:    { name: 'Game Night (2018)',                   note: 'Funny, clever, group-friendly' },
    recipe:   { name: 'Mac & Cheese Bake',                  note: 'Classic crowd-pleaser' },
    drink:    { name: 'Hot Apple Cider Punch',               note: 'Warming and perfect to share' },
    music:    { name: 'Bedroom Pop Playlist',               note: 'Easy background everyone enjoys' },
    activity: { name: 'Trivia night at home',               note: 'Competitive but completely low-effort' },
    book:     { name: 'Skip the book — you have company',  note: '' },
  },
  cozy_family: {
    title: 'Family Movie Night',
    tagline: 'The classics never get old.',
    movie:    { name: 'Spirited Away (2001)',                note: 'Perfect for literally every age' },
    recipe:   { name: 'Homemade Pizza Night',               note: 'Everyone builds their own — that\'s the fun' },
    drink:    { name: 'Sparkling Apple Lemonade',           note: 'Festive and family-friendly' },
    music:    { name: 'Feel-Good Family Playlist',          note: 'Songs everyone knows at least some of' },
    activity: { name: 'Board game after the film',          note: 'Keeps the evening going' },
    book:     { name: 'The Little Prince – Saint-Exupéry', note: 'Read aloud — works for every age' },
  },
  romantic_solo: {
    title: 'A Romantic Solo Affair',
    tagline: 'Self-love is the best love.',
    movie:    { name: 'Her (2013)',                         note: 'Beautiful, emotional, thought-provoking' },
    recipe:   { name: 'Pasta Aglio e Olio',                 note: 'Simple, elegant, deeply satisfying' },
    drink:    { name: 'Espresso Martini',                   note: 'Treat yourself tonight' },
    music:    { name: 'Late Night Jazz',                    note: 'Moody and atmospheric' },
    activity: { name: 'Candlelit journaling',               note: 'Check in with yourself — really check in' },
    book:     { name: 'Normal People – Sally Rooney',       note: 'Intimate and deeply felt' },
  },
  romantic_partner: {
    title: 'A Perfect Romantic Evening',
    tagline: 'Slow down and be present together.',
    movie:    { name: 'La La Land (2016)',                  note: 'Gorgeous and emotionally real' },
    recipe:   { name: 'Beef Wellington',                    note: 'A true special-occasion showstopper' },
    drink:    { name: 'Champagne',                          note: 'Because tonight deserves it' },
    music:    { name: 'Soft Jazz',                          note: 'The perfect dinner atmosphere' },
    activity: { name: 'Cook together, then stargazing',     note: 'Tactile + wonder in one evening' },
    book:     { name: 'Before I Fall – Lauren Oliver',      note: 'Read a chapter together before bed' },
  },
  romantic_friends: {
    title: 'Romantic Dinner Party',
    tagline: 'Love is better shared.',
    movie:    { name: 'Crazy Rich Asians (2018)',           note: 'Glamorous, funny, feel-good' },
    recipe:   { name: 'Spaghetti Bolognese (big batch)',    note: 'Classic, generous, Italian' },
    drink:    { name: 'Aperol Spritz',                      note: 'Pretty and universally loved' },
    music:    { name: 'R&B Dinner Party Playlist',          note: 'Soulful and smooth' },
    activity: { name: 'Wine + deep conversation',           note: 'Just being together is enough' },
    book:     { name: 'Skip it — it\'s a dinner party',   note: '' },
  },
  romantic_family: {
    title: 'A Lovely Family Evening',
    tagline: 'Warmth and togetherness.',
    movie:    { name: 'The Princess Bride (1987)',          note: 'True love for every generation' },
    recipe:   { name: 'Homemade Pasta Night',               note: 'Making it together is the memory' },
    drink:    { name: 'Elderflower Spritz (mocktail)',      note: 'Fancy and everyone can enjoy it' },
    music:    { name: 'Classical Piano Playlist',           note: 'Elegant, calm, beautiful' },
    activity: { name: 'Family cooking competition',         note: 'Who makes the best dish tonight?' },
    book:     { name: 'Love You Forever – Robert Munsch',  note: 'A family classic — have tissues ready' },
  },
  adventurous_solo: {
    title: 'A Solo Expedition',
    tagline: 'You were made for this.',
    movie:    { name: 'The Martian (2015)',                  note: 'Resourceful, hopeful, genuinely thrilling' },
    recipe:   { name: 'Pad Thai from Scratch',              note: 'Try a cuisine you don\'t usually make' },
    drink:    { name: 'Matcha Latte',                       note: 'Focus + calm before you set out' },
    music:    { name: 'Indie Explorer Playlist',            note: 'Songs that feel like moving forward' },
    activity: { name: 'Walk somewhere you\'ve never been', note: 'The simplest adventure possible' },
    book:     { name: 'Into the Wild – Jon Krakauer',      note: 'For the wandering spirit' },
  },
  adventurous_partner: {
    title: 'An Adventure for Two',
    tagline: 'Somewhere you\'ve never been together.',
    movie:    { name: 'Dune (2021)',                        note: 'Epic, immersive world-building' },
    recipe:   { name: 'Korean BBQ Night',                   note: 'Interactive, exciting, different' },
    drink:    { name: 'Espresso Tonic',                     note: 'Unexpected and surprisingly great' },
    music:    { name: 'Cinematic Adventure Playlist',       note: 'Feel like you\'re in a film' },
    activity: { name: 'Explore a new neighborhood together', note: 'Discovery without leaving the city' },
    book:     { name: 'The Alchemist – Paulo Coelho',      note: 'About following your own path' },
  },
  adventurous_friends: {
    title: 'Squad Adventure Mode',
    tagline: "The best stories start with 'let's just…'",
    movie:    { name: 'Mad Max: Fury Road (2015)',           note: 'Insane, iconic, unforgettable' },
    recipe:   { name: 'Build-Your-Own Taco Bar',            note: 'Chaotic and perfect for groups' },
    drink:    { name: 'Rum Punch (batch)',                   note: 'Made to share, made to go fast' },
    music:    { name: 'Road Trip Playlist',                 note: 'Gets everyone going instantly' },
    activity: { name: 'Escape room',                        note: 'Adrenaline + teamwork' },
    book:     { name: 'Skip the book — you\'re busy',      note: '' },
  },
  adventurous_family: {
    title: 'Family Adventure Day',
    tagline: 'Make memories worth telling.',
    movie:    { name: 'Moana (2016)',                       note: 'Adventure, heart, and a perfect soundtrack' },
    recipe:   { name: 'Fish Tacos',                         note: 'Tropical, fun to assemble, a little messy' },
    drink:    { name: 'Mango Smoothies',                    note: 'Bright and everyone loves it' },
    music:    { name: 'Feel-Good Adventure Playlist',       note: 'Keep that energy high all day' },
    activity: { name: 'Park picnic + frisbee',              note: 'Simple, active, outdoors' },
    book:     { name: 'Where the Wild Things Are – Sendak', note: 'Adventure spirit for every age' },
  },
  creative_solo: {
    title: 'A Creative Flow Session',
    tagline: 'Let your mind make something.',
    movie:    { name: 'Whiplash (2014)',                    note: 'An electrifying tribute to making things' },
    recipe:   { name: 'Shakshuka',                          note: 'Creative, quick, deeply satisfying' },
    drink:    { name: 'Espresso Tonic',                     note: 'Sharp focus in a glass' },
    music:    { name: 'Ambient Focus',                      note: 'Disappear into the work' },
    activity: { name: 'Photography walk',                   note: 'See your world differently' },
    book:     { name: 'Big Magic – Elizabeth Gilbert',     note: 'About living a creative life' },
  },
  creative_partner: {
    title: 'Creative Date Night',
    tagline: 'Make something together.',
    movie:    { name: 'Chef (2014)',                        note: 'About passion, food, and rediscovery' },
    recipe:   { name: 'Homemade Sushi',                     note: 'A project you build side by side' },
    drink:    { name: 'Sake or Sparkling Wine',             note: 'Pairs with the creative vibe' },
    music:    { name: 'Jazz Café',                          note: 'Creative, intimate, exactly right' },
    activity: { name: 'Paint something together (no rules)', note: 'It\'s about the process, not the result' },
    book:     { name: 'Salt Fat Acid Heat – Samin Nosrat', note: 'Food as a creative practice' },
  },
  creative_friends: {
    title: 'Creative Crew Night',
    tagline: 'Channel the collective energy.',
    movie:    { name: 'Everything Everywhere All at Once', note: 'Wildly creative, emotional, mind-bending' },
    recipe:   { name: 'Cooking competition — one dish each', note: 'Chaotic, fun, endlessly surprising' },
    drink:    { name: 'Mojitos',                            note: 'Fresh, easy, everyone can make one' },
    music:    { name: 'Eclectic Mix Playlist',              note: 'No rules, just vibes' },
    activity: { name: 'Sketch portraits of each other',    note: 'Ridiculous, hilarious, and oddly bonding' },
    book:     { name: 'Skip it — the art is the evening', note: '' },
  },
  creative_family: {
    title: 'Family Creative Session',
    tagline: 'Make things, make memories.',
    movie:    { name: 'Ratatouille (2007)',                 note: 'Anyone can cook. Anyone.' },
    recipe:   { name: 'Decorate your own cupcakes',         note: 'Creative, delicious, and pleasantly messy' },
    drink:    { name: 'Fruit Mocktail Bar',                 note: 'Everyone concocts their own creation' },
    music:    { name: 'Feel-Good Classics',                 note: 'Upbeat backdrop for the project' },
    activity: { name: 'Family art project on one canvas',  note: 'Collaborative and lasting' },
    book:     { name: 'The Dot – Peter H. Reynolds',       note: '"Just make a dot and see where it takes you."' },
  },
  social_solo: {
    title: 'Recharge Before the Next One',
    tagline: 'Even social butterflies need quiet time.',
    movie:    { name: 'The Secret Life of Walter Mitty',   note: 'Dreamy, hopeful, just you and your thoughts' },
    recipe:   { name: 'Easy Buddha Bowl',                  note: 'Healthy, restorative, ten minutes' },
    drink:    { name: 'Matcha Latte',                      note: 'Calm focus for the soul' },
    music:    { name: 'Neo-Soul Vibes',                    note: 'Smooth and soulful, perfect solo' },
    activity: { name: 'Plan something exciting for soon',  note: 'Anticipation is half the fun' },
    book:     { name: 'The Great Gatsby – Fitzgerald',    note: 'Parties, glamour, and longing' },
  },
  social_partner: {
    title: 'A Glamorous Night for Two',
    tagline: 'Get dressed up. Even if it\'s just dinner.',
    movie:    { name: 'Crazy Rich Asians (2018)',           note: 'Glamorous, funny, feel-good' },
    recipe:   { name: 'Lobster Pasta',                      note: 'Worth the occasion — go all in' },
    drink:    { name: 'Espresso Martini',                   note: 'Sophisticated and genuinely fun' },
    music:    { name: 'Dance Pop Playlist',                note: 'Start the dancing at home' },
    activity: { name: 'Home cocktail challenge',            note: 'Who makes the better drink tonight?' },
    book:     { name: 'The Hating Game – Sally Thorne',   note: 'Quick, fun, satisfying' },
  },
  social_friends: {
    title: 'The Best Night In',
    tagline: 'Turn your living room into a party.',
    movie:    { name: 'Knives Out (2019)',                  note: 'Crowd-pleaser, endlessly quotable' },
    recipe:   { name: 'Nacho & Dips Spread',               note: 'Everyone grazes, no one cooks' },
    drink:    { name: 'Aperol Spritz Batch',                note: 'Make a pitcher, keep it flowing' },
    music:    { name: 'Party Hits → Dance EDM',            note: 'Start chill, escalate naturally' },
    activity: { name: 'Karaoke or group trivia',           note: 'Memories are made right here' },
    book:     { name: 'Skip it — this IS the story',      note: '' },
  },
  social_family: {
    title: 'The Big Family Get-Together',
    tagline: 'Loud, warm, and irreplaceable.',
    movie:    { name: 'Guardians of the Galaxy (2014)',     note: 'Action, humor, heart — everyone wins' },
    recipe:   { name: 'BBQ Spread + Sides',                note: 'Food that brings people together' },
    drink:    { name: 'Lemonade + Sparkling Water Bar',    note: 'Simple, refreshing, festive' },
    music:    { name: 'Cross-Generation Pop Hits',         note: 'Everyone knows at least one song' },
    activity: { name: 'Backyard games',                    note: 'The originals never get old' },
    book:     { name: 'Skip it — it\'s family time',      note: '' },
  },
  focused_solo: {
    title: 'A Deep Focus Session',
    tagline: 'Disappear into the work.',
    movie:    { name: 'Arrival (2016)',                     note: 'Save it for after — cerebral and beautiful' },
    recipe:   { name: 'Avocado Toast + Poached Eggs',      note: 'Brain fuel, fast' },
    drink:    { name: 'Cold Brew or Pour Over Coffee',     note: 'Precision + the right caffeine hit' },
    music:    { name: 'Classical Study or Lo-fi Focus',    note: 'Best thing ever invented for focused work' },
    activity: { name: '90-min deep work sprint + walk',   note: 'Structured, intentional, effective' },
    book:     { name: 'Atomic Habits – James Clear',       note: 'Read during breaks to stay inspired' },
  },
  focused_partner: {
    title: 'Parallel Play Evening',
    tagline: 'Together, each in your own world.',
    movie:    { name: 'Interstellar (2014)',                note: 'Watch together after — big ideas to discuss' },
    recipe:   { name: 'Bibimbap Bowls (prep-ahead)',       note: 'Healthy, quick, minimal disruption' },
    drink:    { name: 'Matcha Lattes',                     note: 'Calm focus for two' },
    music:    { name: 'Ambient Focus (shared playlist)',   note: 'The soundtrack to shared silence' },
    activity: { name: 'Separate projects, same table',    note: '"Parallel play" — deeply intimate' },
    book:     { name: 'Essentialism – Greg McKeown',       note: 'About focus and doing less, better' },
  },
  focused_friends: {
    title: 'Study Session with Friends',
    tagline: 'Better together, but quieter.',
    movie:    { name: 'The Social Network (2010)',          note: 'Perfect post-session watch' },
    recipe:   { name: 'Quick Grain Bowls',                 note: 'Fuel, not a project — ten minutes max' },
    drink:    { name: 'Coffee Station',                    note: 'Everyone gets exactly what they need' },
    music:    { name: 'Lo-fi Hip Hop',                     note: 'Universal agreement on focus music' },
    activity: { name: 'Co-working + 5-min check-ins',     note: 'Accountability + just enough social' },
    book:     { name: 'Whatever you\'re working on',       note: 'That\'s the whole point tonight' },
  },
  focused_family: {
    title: 'A Productive Family Day',
    tagline: 'Tackle something together.',
    movie:    { name: 'The Martian (2015)',                 note: 'Science, problem-solving, teamwork' },
    recipe:   { name: 'Easy Sheet-Pan Dinner',             note: 'Quick, healthy, zero effort while working' },
    drink:    { name: 'Smoothies',                          note: 'Nutritious and fast' },
    music:    { name: 'Uplifting Instrumental',            note: 'Motivating without distracting' },
    activity: { name: 'Household project together',         note: 'Work as a team, celebrate after' },
    book:     { name: 'Wonder – R.J. Palacio',             note: 'About choosing kindness — read it any time' },
  },
}

// ── Category display ──────────────────────────────────────────────────────────
const CAT_CONFIG = [
  { key: 'movie',    emoji: '🎬', label: 'Film',     color: '#5A9FBF' },
  { key: 'recipe',   emoji: '🍽️', label: 'Recipe',   color: '#C4703A' },
  { key: 'drink',    emoji: '🥂', label: 'Drink',    color: '#D4956A' },
  { key: 'music',    emoji: '🎵', label: 'Music',    color: '#3A9B7A' },
  { key: 'activity', emoji: '✨', label: 'Activity', color: '#4D7A52' },
  { key: 'book',     emoji: '📚', label: 'Book',     color: '#8B5E3C' },
]

// ── Option tile component ─────────────────────────────────────────────────────
function OptionTile({ opt, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '28px 16px', borderRadius: 20,
        background: selected ? 'rgba(196,154,108,0.09)' : '#FFFFFF',
        border: `2px solid ${selected ? GOLD : 'rgba(42,30,16,0.1)'}`,
        cursor: 'pointer', outline: 'none', width: '100%',
        boxShadow: selected
          ? '0 8px 32px rgba(196,154,108,0.22)'
          : '0 2px 12px rgba(42,30,16,0.06)',
        transition: 'border-color 0.18s, background 0.18s, box-shadow 0.18s',
      }}
    >
      <span style={{ fontSize: 44, marginBottom: 14, display: 'block', lineHeight: 1 }}>
        {opt.emoji}
      </span>
      <span style={{
        fontFamily: SERIF, fontSize: 19, fontWeight: 600, marginBottom: 6, display: 'block',
        color: selected ? '#7A4A18' : INK,
      }}>
        {opt.label}
      </span>
      <span style={{ fontSize: 12, color: 'rgba(42,30,16,0.45)', lineHeight: 1.45, display: 'block' }}>
        {opt.desc}
      </span>
    </motion.button>
  )
}

// ── Results view ──────────────────────────────────────────────────────────────
function ResultsView({ plan, onRestart, navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: DARK, paddingTop: '140px', paddingBottom: '100px' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(196,154,108,0.04)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(90,159,191,0.04)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 56 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Sparkles style={{ width: 13, height: 13, color: GOLD }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>
              Your Perfect Evening
            </span>
          </div>
          <h1 style={{
            fontFamily: SERIF, fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
            color: '#FDFAF6', lineHeight: 0.9, letterSpacing: '-0.03em',
            fontWeight: 600, marginBottom: 16,
          }}>
            {plan.title}
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,240,220,0.4)', lineHeight: 1.6, maxWidth: 500 }}>
            {plan.tagline}
          </p>
        </motion.div>

        {/* Category cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {CAT_CONFIG.map((cat, i) => {
            const item = plan[cat.key]
            if (!item) return null
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '28px 26px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Color top bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: cat.color, opacity: 0.75,
                }} />

                {/* Corner glow */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: 120, height: 120,
                  background: `radial-gradient(circle at top right, ${cat.color}14 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
                  <span style={{ fontSize: 22 }}>{cat.emoji}</span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: cat.color,
                  }}>
                    {cat.label}
                  </span>
                </div>

                {/* Name */}
                <div style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.15rem, 1.8vw, 1.5rem)',
                  color: '#FDFAF6', lineHeight: 1.2, fontWeight: 600, marginBottom: 12,
                }}>
                  {item.name}
                </div>

                {/* Note */}
                {item.note && (
                  <div style={{
                    fontSize: 12.5, color: 'rgba(255,240,220,0.36)',
                    fontStyle: 'italic', lineHeight: 1.55,
                  }}>
                    {item.note}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{ display: 'flex', gap: 14, marginTop: 52, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <button
            onClick={onRestart}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 26px', borderRadius: 100,
              border: '1.5px solid rgba(255,255,255,0.14)',
              background: 'transparent', color: 'rgba(255,240,220,0.55)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: '"Inter", sans-serif', letterSpacing: '0.01em',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,240,220,0.85)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,240,220,0.55)' }}
          >
            <RefreshCw size={13} /> Try a Different Plan
          </button>
          <button
            onClick={() => navigate('/collections')}
            style={{
              padding: '12px 30px', borderRadius: 100, border: 'none',
              background: GOLD, color: '#1A0E08',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: '"Inter", sans-serif', letterSpacing: '0.02em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#D4A87A' }}
            onMouseLeave={e => { e.currentTarget.style.background = GOLD }}
          >
            Explore Collections →
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// ── Main Planner component ────────────────────────────────────────────────────
export default function Planner() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(0)
  const [dir, setDir]         = useState(1)
  const [answers, setAnswers] = useState({ energy: null, company: null, vibe: null })
  const [plan, setPlan]       = useState(null)

  const currentStep = STEPS[step]

  const choose = (key, id) => {
    const next = { ...answers, [key]: id }
    setAnswers(next)
    setDir(1)
    if (step < 2) {
      setTimeout(() => setStep(s => s + 1), 180)
    } else {
      const planKey = `${next.vibe}_${next.company}`
      setPlan(PLANS[planKey] ?? PLANS['cozy_solo'])
      setTimeout(() => setStep(3), 180)
    }
  }

  const goBack = () => {
    setDir(-1)
    setStep(s => s - 1)
  }

  const restart = () => {
    setDir(-1)
    setAnswers({ energy: null, company: null, vibe: null })
    setPlan(null)
    setStep(0)
  }

  if (step === 3 && plan) {
    return <ResultsView plan={plan} onRestart={restart} navigate={navigate} />
  }

  return (
    <div style={{ minHeight: '100vh', background: CREAM, paddingTop: '130px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

        {/* Back */}
        {step > 0 && (
          <button
            onClick={goBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(42,30,16,0.45)', fontSize: 13, fontWeight: 600,
              fontFamily: '"Inter", sans-serif', padding: 0, transition: 'color 0.18s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = INK}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(42,30,16,0.45)'}
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              height: 3, flex: 1, borderRadius: 2,
              background: i <= step ? GOLD : 'rgba(196,154,108,0.2)',
              transition: 'background 0.4s',
            }} />
          ))}
        </div>

        {/* Step header */}
        <div style={{ marginBottom: 44 }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: GOLD, marginBottom: 14,
            fontFamily: '"Inter", sans-serif',
          }}>
            Step {step + 1} of 3
          </div>
          <h1 style={{
            fontFamily: SERIF, fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            color: INK, lineHeight: 1.05, letterSpacing: '-0.02em',
            fontWeight: 600, marginBottom: 10,
          }}>
            {currentStep.q}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(42,30,16,0.42)', lineHeight: 1.5 }}>
            {currentStep.sub}
          </p>
        </div>

        {/* Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: dir * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -48 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: currentStep.opts.length === 3
                ? 'repeat(3, 1fr)'
                : currentStep.opts.length === 4
                  ? 'repeat(4, 1fr)'
                  : 'repeat(3, 1fr)',
              gap: 16,
            }}
              className="planner-grid"
            >
              {currentStep.opts.map(opt => (
                <OptionTile
                  key={opt.id}
                  opt={opt}
                  selected={answers[currentStep.key] === opt.id}
                  onSelect={() => choose(currentStep.key, opt.id)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 640px) {
          .planner-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .planner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
