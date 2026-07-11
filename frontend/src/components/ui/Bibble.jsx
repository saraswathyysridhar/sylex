import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X, Send } from 'lucide-react'

/* ─── Recommendation database ─────────────────────────────── */
const RECS = {
  movie: {
    scifi:       ['Interstellar', 'Dune (2021)', 'Arrival', 'Blade Runner 2049', 'Ex Machina', 'The Martian'],
    romance:     ['La La Land', 'About Time', 'Before Sunrise', 'Eternal Sunshine', 'Pride & Prejudice (2005)', 'Her'],
    horror:      ['Hereditary', 'Get Out', 'A Quiet Place', 'Midsommar', 'The Conjuring', 'It Follows'],
    thriller:    ['Gone Girl', 'Parasite', 'Knives Out', 'Prisoners', 'Shutter Island', 'Zodiac'],
    comedy:      ['The Grand Budapest Hotel', 'Game Night', 'The Nice Guys', 'Palm Springs', 'What We Do in the Shadows'],
    action:      ['John Wick', 'Mad Max: Fury Road', 'Top Gun: Maverick', 'The Raid', 'Mission: Impossible – Fallout'],
    fantasy:     ["Pan's Labyrinth", 'The Lord of the Rings', 'Everything Everywhere All at Once', 'Princess Mononoke', 'Stardust'],
    drama:       ['The Shawshank Redemption', 'Whiplash', 'Marriage Story', 'Boyhood', 'Good Will Hunting'],
    anime:       ['Spirited Away', 'Your Name', 'Demon Slayer – Mugen Train', 'Fullmetal Alchemist: Brotherhood', 'Akira'],
    documentary: ['Free Solo', "Won't You Be My Neighbor?", 'The Social Dilemma', 'Icarus', 'Making a Murderer'],
    tamil: [
      { title: 'Vikram',                             genre: ['action', 'thriller'] },
      { title: 'Ponniyin Selvan I & II',              genre: ['drama'] },
      { title: '96',                                  genre: ['romance', 'drama'] },
      { title: 'Kaithi',                              genre: ['action', 'thriller'] },
      { title: 'Master',                              genre: ['action', 'thriller'] },
      { title: 'Soorarai Pottru',                     genre: ['drama'] },
      { title: 'Asuran',                              genre: ['action', 'drama'] },
      { title: 'Pisaasu',                             genre: ['horror'] },
      { title: 'Demonte Colony',                      genre: ['horror'] },
      { title: 'Aranmanai',                           genre: ['horror', 'comedy'] },
      { title: 'Kanchana',                            genre: ['horror', 'comedy'] },
      { title: 'Ratsasan',                             genre: ['thriller', 'horror'] },
      { title: 'Naduvula Konjam Pakkatha Kaanom',     genre: ['comedy'] },
    ],
    hindi: [
      { title: '3 Idiots',                    genre: ['comedy', 'drama'] },
      { title: 'Dangal',                       genre: ['drama'] },
      { title: 'Zindagi Na Milegi Dobara',     genre: ['comedy', 'drama'] },
      { title: 'Gully Boy',                    genre: ['drama'] },
      { title: 'Dil Chahta Hai',               genre: ['comedy', 'drama'] },
      { title: 'Taare Zameen Par',             genre: ['drama'] },
      { title: 'Stree',                        genre: ['horror', 'comedy'] },
      { title: 'Bhool Bhulaiyaa',              genre: ['horror', 'comedy'] },
      { title: 'Tumbbad',                       genre: ['horror'] },
      { title: 'Pari',                          genre: ['horror'] },
    ],
    korean: [
      { title: 'Parasite',              genre: ['thriller', 'drama'] },
      { title: 'Oldboy',                 genre: ['thriller', 'action'] },
      { title: 'Train to Busan',        genre: ['horror', 'action'] },
      { title: 'Decision to Leave',     genre: ['thriller', 'romance'] },
      { title: 'Burning',                genre: ['thriller', 'drama'] },
      { title: 'The Handmaiden',        genre: ['thriller', 'romance'] },
      { title: 'The Wailing',            genre: ['horror'] },
      { title: 'A Tale of Two Sisters', genre: ['horror'] },
    ],
    japanese: [
      { title: 'Spirited Away',    genre: ['fantasy', 'anime'] },
      { title: 'Battle Royale',    genre: ['thriller', 'action'] },
      { title: 'Shoplifters',       genre: ['drama'] },
      { title: 'Rurouni Kenshin',  genre: ['action'] },
      { title: 'Confessions',       genre: ['thriller', 'drama'] },
      { title: 'Ju-On: The Grudge', genre: ['horror'] },
      { title: 'Ringu',              genre: ['horror'] },
    ],
    telugu: [
      { title: 'Baahubali: The Beginning', genre: ['action', 'fantasy'] },
      { title: 'RRR',                       genre: ['action', 'drama'] },
      { title: 'Pushpa: The Rise',          genre: ['action', 'thriller'] },
      { title: 'Arjun Reddy',               genre: ['romance', 'drama'] },
      { title: 'Eega',                       genre: ['fantasy', 'action'] },
    ],
    malayalam: [
      { title: 'Drishyam',                   genre: ['thriller'] },
      { title: 'Premam',                      genre: ['romance', 'comedy'] },
      { title: 'Kumbalangi Nights',          genre: ['drama'] },
      { title: 'The Great Indian Kitchen',   genre: ['drama'] },
      { title: 'Bangalore Days',              genre: ['comedy', 'drama'] },
      { title: 'Maheshinte Prathikaram',     genre: ['comedy', 'drama'] },
    ],
    chill:       ['Julie & Julia', 'The Secret Life of Walter Mitty', 'Amélie', 'Chef', 'Midnight in Paris'],
    sad:         ['Good Will Hunting', 'Her', 'Eternal Sunshine', 'Manchester by the Sea', 'The Pursuit of Happyness'],
    happy:       ['Knives Out', 'The Princess Bride', 'About Time', 'Paddington 2', 'Yes Man'],
    romantic:    ['La La Land', 'Before Sunrise', 'Eternal Sunshine', 'Call Me by Your Name', 'Pride & Prejudice (2005)'],
  },
  game: {
    rpg:         ['Elden Ring', "Baldur's Gate 3", 'The Witcher 3', 'Persona 5 Royal', 'Final Fantasy XVI', 'Cyberpunk 2077'],
    indie:       ['Hollow Knight', 'Celeste', 'Hades', 'Stardew Valley', 'Disco Elysium', 'Undertale', 'Dead Cells'],
    shooter:     ['Valorant', 'CS2', 'Apex Legends', 'Destiny 2', 'Titanfall 2', 'Battlefield V'],
    strategy:    ['Civilization VI', 'Age of Empires IV', 'XCOM 2', 'Into the Breach', 'Crusader Kings III'],
    multiplayer: ['Minecraft', 'It Takes Two', 'Deep Rock Galactic', 'Overcooked 2', 'Rocket League', 'Among Us'],
    action:      ['God of War', 'Ghost of Tsushima', 'Red Dead Redemption 2', 'Spider-Man 2', 'Batman: Arkham Knight'],
    chill:       ['Stardew Valley', 'Animal Crossing', 'A Short Hike', 'Journey', 'Firewatch', 'Alba: A Wildlife Adventure'],
    horror:      ['Resident Evil 4', 'Amnesia: The Bunker', 'Alien: Isolation', 'Phasmophobia', 'SOMA'],
    scifi:       ['Mass Effect Legendary Edition', 'Outer Wilds', 'Control', 'Subnautica', 'Dead Space (2023)'],
    fantasy:     ["Baldur's Gate 3", 'Divinity: Original Sin 2', 'Dark Souls III', 'Dragon Age: Origins', "Ori and the Will of the Wisps"],
    romance:     ['Stardew Valley', 'Persona 5 Royal', 'Fire Emblem: Three Houses', 'Spiritfarer', 'Coffee Talk'],
    sports:      ['EA FC 25', 'NBA 2K25', 'Gran Turismo 7', 'Tony Hawk Pro Skater 1+2', 'Rocket League'],
    puzzle:      ['Portal 2', 'The Witness', 'Baba Is You', 'Return of the Obra Dinn', 'Antichamber'],
  },
  recipe: {
    indian:      ['Butter Chicken', 'Dal Makhani', 'Biryani', 'Palak Paneer', 'Chole Bhature', 'Aloo Paratha'],
    italian:     ['Pasta Carbonara', 'Cacio e Pepe', 'Risotto ai Funghi', 'Margherita Pizza', 'Tiramisu'],
    quick:       ['Aglio e Olio (15 min)', 'Egg Fried Rice', 'Shakshuka', 'Grilled Cheese', 'Avocado Toast'],
    vegetarian:  ['Palak Paneer', 'Mushroom Risotto', 'Falafel Bowl', 'Caprese Salad', 'Vegetable Stir Fry'],
    dessert:     ['Chocolate Lava Cake', 'Tiramisu', 'Crème Brûlée', 'Basque Cheesecake', 'Mango Sticky Rice'],
    romantic:    ['Lobster Pasta', 'Beef Wellington', 'Oysters Rockefeller', 'Chocolate Fondant', 'Strawberry Pavlova'],
    chill:       ['Tomato Soup + Grilled Cheese', 'Mac & Cheese', 'Khichdi', 'Ramen', 'Vegetable Soup'],
    breakfast:   ['Pancake Stack', 'Eggs Benedict', 'Avocado Toast', 'French Toast', 'Shakshuka'],
    asian:       ['Pad Thai', 'Ramen', 'Bibimbap', 'Chicken Tikka Masala', 'Miso Soup + Rice'],
    french:      ['Coq au Vin', 'Ratatouille', 'Beef Bourguignon', 'Quiche Lorraine', 'Crème Brûlée'],
    mexican:     ['Tacos al Pastor', 'Guacamole', 'Enchiladas', 'Chiles Rellenos', 'Elote'],
    mediterranean: ['Greek Salad', 'Hummus', 'Falafel', 'Moussaka', 'Tabbouleh'],
    filipino:    ['Chicken Adobo', 'Pancit', 'Lumpia', 'Sinigang', 'Halo-Halo'],
    british:     ['Fish and Chips', "Shepherd's Pie", 'Sunday Roast', 'Bangers and Mash', 'Sticky Toffee Pudding'],
    american:    ['Classic Cheeseburger', 'BBQ Ribs', 'Mac and Cheese', 'Buffalo Wings', 'Apple Pie'],
    south_indian: ['Masala Dosa', 'Idli Sambar', 'Medu Vada', 'Uttapam', 'Rasam', 'Pongal'],
    north_indian: ['Butter Chicken', 'Dal Makhani', 'Tandoori Chicken', 'Chole Bhature', 'Aloo Paratha'],
    albanian:    ['Tavë Kosi', 'Byrek', 'Fërgesë', 'Flija'],
    south_african: ['Bobotie', 'Bunny Chow', 'Chakalaka', 'Malva Pudding'],
  },
  book: {
    scifi:    ['Dune – Frank Herbert', 'Project Hail Mary – Andy Weir', 'Foundation – Isaac Asimov', 'The Martian – Andy Weir', "Ender's Game – Orson Scott Card"],
    romance:  ['Pride & Prejudice – Jane Austen', 'The Hating Game – Sally Thorne', 'Beach Read – Emily Henry', 'It Ends with Us – Colleen Hoover', 'The Kiss Quotient'],
    fantasy:  ['The Name of the Wind – Rothfuss', 'The Way of Kings – Sanderson', 'ACOTAR – Sarah J. Maas', 'The Hobbit – Tolkien', 'Mistborn – Sanderson'],
    thriller: ['Gone Girl – Gillian Flynn', 'The Silent Patient – Alex Michaelides', 'Big Little Lies – Moriarty', 'The Girl with the Dragon Tattoo'],
    drama:    ['Normal People – Sally Rooney', 'The Kite Runner – Hosseini', 'A Little Life – Hanya Yanagihara', 'Educated – Tara Westover'],
  },
  drink: {
    cocktail:  ['Negroni', 'Aperol Spritz', 'Old Fashioned', 'Espresso Martini', 'Margarita', 'Mojito'],
    mocktail:  ['Virgin Mojito', 'Passion Fruit Cooler', 'Cucumber Mint Lemonade', 'Watermelon Slush', 'Mango Cooler'],
    coffee:    ['Dalgona Coffee', 'Cold Brew', 'Espresso Tonic', 'Cortado', 'Iced Caramel Latte', 'Pour Over'],
    tea:       ['Masala Chai', 'Matcha Latte', 'Earl Grey', 'Chamomile Honey', 'Jasmine Green Tea'],
    smoothie:  ['Mango Lassi', 'Açaí Smoothie', 'Green Detox', 'Strawberry Banana', 'Peanut Butter Banana'],
    romantic:  ['Champagne', 'Rosé', 'Espresso Martini', 'Elderflower Spritz', 'Bellini'],
    chill:     ['Hot Chocolate', 'Chamomile Tea', 'Warm Apple Cider', 'Golden Milk', 'Masala Chai'],
    morning:   ['Dalgona Coffee', 'Matcha Latte', 'Green Smoothie', 'Fresh Orange Juice', 'Bulletproof Coffee'],
    party:     ['Aperol Spritz', 'Mojito', 'Piña Colada', 'Paloma', 'Cosmopolitan'],
    wellness:  ['Golden Turmeric Latte', 'Thandai', 'Chaas (Spiced Buttermilk)', 'Ginger Kombucha Fizz'],
  },
  music: {
    focus:    ['Lo-fi Hip Hop', 'Classical Study', 'Ambient Focus', 'Jazz Café', 'Piano Concentration'],
    chill:    ['Bedroom Pop', 'Acoustic Indie', 'Neo-Soul Vibes', 'Soft Jazz', 'Lo-fi Chill Beats'],
    workout:  ['Hip Hop Hype', 'EDM Energy', 'Rock Anthems', 'Trap Workout', 'Pop Fitness Hits'],
    romantic: ['Soft Jazz', 'R&B Slow Jams', 'Acoustic Love Songs', 'Indie Romance', 'Classical Piano'],
    party:    ['Pop Hits', 'Dance EDM', 'Hip Hop Party', 'Reggaeton', 'Afrobeats'],
    sad:      ['Sad Indie', 'Heartbreak R&B', 'Emotional Piano', 'Melancholy Acoustic', 'Rainy Day Mix'],
    morning:  ['Morning Acoustic', 'Uplifting Pop', 'Feel-Good Indie', 'Jazz Morning', 'Lo-fi Wake Up'],
    night:    ['Late Night Jazz', 'Dark R&B', 'Midnight Indie', 'Night Drive Playlist', 'Ambient Night'],
    hindi:    ['Bollywood Classics', 'Arijit Singh Essentials', 'Retro Bollywood', 'New Bollywood Hits', 'Sufi Hits'],
    tamil:    ['Tamil Kuthu', 'Ilaiyaraaja Classics', 'A.R. Rahman Best', 'Kollywood Beats', 'Tamil Melody Hits'],
    telugu:   ['Telugu Hits 2025', 'Telugu Melody', 'Tollywood Beats', 'S.S. Thaman Best', 'Telugu Folk Hits'],
  },
  activity: {
    outdoor:  ['Sunrise hike', 'Cycling trail ride', 'Picnic in the park', 'Outdoor yoga', 'Beach day'],
    indoor:   ['Board game night', 'Home cooking challenge', 'Movie marathon', 'Paint by numbers', 'Home workout'],
    solo:     ['Journaling', 'Learn something new online', 'Read a good book', 'Meditation session', 'Solo hike'],
    social:   ['Escape room with friends', 'Dinner party', 'Trivia night', 'Karaoke', 'Potluck cooking'],
    creative: ['Sketching or drawing', 'Photography walk', 'Write a short story', 'Learn guitar basics', 'Pottery class'],
    chill:    ['Long bath with music', 'Cook a favourite recipe', 'Walk with no destination', 'Nap + good book', 'Watch a comfort show'],
    bored:    ['Try a cuisine you\'ve never cooked', 'Explore a new part of your city', 'Start a challenge', 'Learn a magic trick', 'Build a playlist for every mood'],
  },
}

/* ─── Tag detection ──────────────────────────────────────────── */
function detectTags(text) {
  const t = text.toLowerCase()
  const tags = new Set()

  // Medium
  if (/\b(movie|film|cinema|watch|series|show|streaming)\b/.test(t))      tags.add('movie')
  if (/\b(game|gaming|play|gamer|xbox|ps5|switch|pc game)\b/.test(t))     tags.add('game')
  if (/\b(book|read|novel|story|fiction|literature)\b/.test(t))            tags.add('book')
  if (/\b(recipe|cook|eat|meal|dinner|lunch|food|dish)\b/.test(t))        tags.add('recipe')
  if (/\b(drink|cocktail|coffee|tea|smoothie|juice|mocktail|beverage)\b/.test(t)) tags.add('drink')
  if (/\b(music|song|playlist|listen|artist|album|beats|vibe)\b/.test(t)) tags.add('music')
  if (/\b(activity|activities|outdoor|indoor|exercise|hobby|things to do)\b/.test(t)) tags.add('activity')

  // Movie / book genre
  if (/\b(sci.?fi|science.?fiction|space|futuristic)\b/.test(t))           tags.add('scifi')
  if (/\b(romance|love story|chick.?flick|date movie)\b/.test(t))          tags.add('romance')
  if (/\b(horror|scary|spooky|creepy)\b/.test(t))                           tags.add('horror')
  if (/\b(thriller|suspense|mystery|psychological)\b/.test(t))              tags.add('thriller')
  if (/\b(comedy|funny|laugh|humor|feel.?good|lighthearted)\b/.test(t))    tags.add('comedy')
  if (/\b(action|adventure|fight|epic)\b/.test(t))                          tags.add('action')
  if (/\b(fantasy|magic|wizard|dragon|mythical)\b/.test(t))                 tags.add('fantasy')
  if (/\b(drama|emotional|deep|meaningful)\b/.test(t))                      tags.add('drama')
  if (/\b(anime|animated|cartoon|manga)\b/.test(t))                         tags.add('anime')
  if (/\b(documentary|real|true story|based on)\b/.test(t))                 tags.add('documentary')

  // Game genres
  if (/\b(rpg|role.?playing)\b/.test(t))                                    tags.add('rpg')
  if (/\b(indie|independent)\b/.test(t))                                     tags.add('indie')
  if (/\b(shooter|fps|first.?person)\b/.test(t))                            tags.add('shooter')
  if (/\b(strategy|tactics|rts|turn.?based)\b/.test(t))                     tags.add('strategy')
  if (/\b(multiplayer|online|co.?op|friends)\b/.test(t))                    tags.add('multiplayer')
  if (/\b(sports|football|basketball|racing|fifa)\b/.test(t))               tags.add('sports')
  if (/\b(puzzle|brain|logic)\b/.test(t))                                    tags.add('puzzle')

  // Language
  if (/\b(tamil|kollywood)\b/.test(t))                                       tags.add('tamil')
  if (/\b(hindi|bollywood)\b/.test(t))                                       tags.add('hindi')
  if (/\b(indian)\b/.test(t) && !tags.has('recipe'))                         tags.add('hindi')
  if (/\b(korean|k.?drama|kdrama)\b/.test(t))                               tags.add('korean')
  if (/\b(japanese|j.?drama)\b/.test(t))                                     tags.add('japanese')
  if (/\b(telugu|tollywood)\b/.test(t))                                      tags.add('telugu')
  if (/\b(malayalam|mollywood)\b/.test(t))                                   tags.add('malayalam')

  // Food specifics
  if (/\b(indian|curry|spicy|masala|desi)\b/.test(t) && tags.has('recipe'))  tags.add('indian')
  if (/\b(italian|pasta|pizza|risotto)\b/.test(t))                            tags.add('italian')
  if (/\b(quick|fast|easy|simple|\d+.?min)\b/.test(t))                       tags.add('quick')
  if (/\b(vegetarian|vegan|plant.?based)\b/.test(t))                         tags.add('vegetarian')
  if (/\b(dessert|sweet|cake|chocolate)\b/.test(t))                           tags.add('dessert')
  if (/\b(asian|chinese|thai)\b/.test(t) && tags.has('recipe'))              tags.add('asian')
  if (/\b(breakfast|brunch)\b/.test(t))                                       tags.add('breakfast')
  if (/\b(french|coq au vin|ratatouille|croissant)\b/.test(t))               tags.add('french')
  if (/\b(mexican|taco|burrito|guacamole|enchilada)\b/.test(t))              tags.add('mexican')
  if (/\b(mediterranean|greek|hummus|falafel|tabbouleh)\b/.test(t))          tags.add('mediterranean')
  if (/\b(filipino|adobo|pancit|lumpia|sinigang)\b/.test(t))                 tags.add('filipino')
  if (/\b(british|fish and chips|shepherd.?s pie|bangers)\b/.test(t))       tags.add('british')
  if (/\b(american|cheeseburger|bbq ribs|buffalo wings)\b/.test(t))          tags.add('american')
  if (/\b(albanian|tav[ëe] kosi|byrek|f[ëe]rges[ëe])\b/.test(t))            tags.add('albanian')
  if (/\b(south african|bobotie|bunny chow|chakalaka)\b/.test(t))            tags.add('south_african')

  // Specific dish names — recognized on their own, without needing a generic
  // trigger word like "cook" or "eat" first.
  if (/\b(dosa|idli|sambar|medu vada|uttapam|rasam|pongal|upma|bisi bele|chettinad|payasam)\b/.test(t)) {
    tags.add('recipe'); tags.add('south_indian')
  }
  if (/\b(butter chicken|dal makhani|tandoori|chole bhature|aloo paratha|baingan bharta|palak paneer|chana masala|rogan josh|matar paneer|naan|biryani)\b/.test(t)) {
    tags.add('recipe'); tags.add('indian')
  }
  // Ingredients / preparations that imply a specific drink even without the word "drink"
  if (/\b(turmeric|golden latte|golden milk)\b/.test(t)) { tags.add('drink'); tags.add('wellness') }

  // Drink subtypes
  if (/\b(cocktail|cocktails|alcohol|spirits|beer|wine)\b/.test(t))          tags.add('cocktail')
  if (/\b(mocktail|non.?alcoholic|alcohol.?free)\b/.test(t))                 tags.add('mocktail')
  if (/\b(coffee|espresso|latte|cappuccino|cold brew|americano)\b/.test(t))  tags.add('coffee')
  if (/\b(tea|chai|matcha|herbal|oolong)\b/.test(t))                         tags.add('tea')
  if (/\b(smoothie|shake|blend)\b/.test(t))                                   tags.add('smoothie')

  // Music moods
  if (/\b(focus|study|concentrate|work|productivity)\b/.test(t))             tags.add('focus')
  if (/\b(workout|gym|exercise|run|training|fitness)\b/.test(t))             tags.add('workout')
  if (/\b(party|dance|club|hype|banger)\b/.test(t))                          tags.add('party')

  // Activity subtypes
  if (/\b(outdoor|outside|nature|hike|walk|park)\b/.test(t))                tags.add('outdoor')
  if (/\b(indoor|inside|home|at home)\b/.test(t))                           tags.add('indoor')
  if (/\b(solo|alone|by myself)\b/.test(t))                                  tags.add('solo')
  if (/\b(social|friends|group|together)\b/.test(t))                        tags.add('social')
  if (/\b(creative|art|draw|paint|create|craft)\b/.test(t))                 tags.add('creative')

  // Mood
  if (/\b(sad|down|upset|lonely|cry|depressed|low)\b/.test(t))              tags.add('sad')
  if (/\b(happy|excited|celebrate|great|amazing|good mood)\b/.test(t))      tags.add('happy')
  if (/\b(bored|boring|nothing to do|restless)\b/.test(t))                   tags.add('bored')
  if (/\b(tired|exhausted|sleepy|rest|relax|chill|unwind)\b/.test(t))       tags.add('chill')
  if (/\b(romantic|date night|love|couple|anniversary)\b/.test(t))           tags.add('romantic')
  if (/\b(hungry|starving|snack)\b/.test(t))                                 tags.add('hungry')
  if (/\b(morning|wake up|start the day)\b/.test(t))                         tags.add('morning')
  if (/\b(night|evening|midnight|late night)\b/.test(t))                     tags.add('night')
  if (/\b(weekend|sunday|saturday|day off)\b/.test(t))                       tags.add('weekend')

  // Meta
  if (/\b(hi|hello|hey|hiya|sup|howdy)\b/.test(t))                          tags.add('greeting')
  if (/\b(thanks|thank you|ty|thx)\b/.test(t))                               tags.add('thanks')
  if (/\b(help|what can you|capabilities|what do you)\b/.test(t))            tags.add('help')

  return [...tags]
}

/* ─── Intro text maps ────────────────────────────────────────── */
const MOVIE_INTROS = {
  scifi:       "Sci-fi picks that'll genuinely blow your mind 🚀",
  romance:     "Romance films that actually hit different 💛",
  horror:      "Horror that will keep you up tonight 👁️",
  thriller:    "Thrillers you won't be able to pause ⚡",
  comedy:      "Comedies that are actually funny 😄",
  action:      "Action films worth every minute 💥",
  fantasy:     "Fantasy worlds you'll want to live in ✨",
  drama:       "Dramas that stick with you for weeks 🎭",
  anime:       "Anime that converts even non-anime fans 🎌",
  documentary: "Documentaries that change how you see the world 🌍",
  tamil:       "Tamil cinema at its absolute best 🎬",
  hindi:       "Hindi/Bollywood films that are genuinely great 🎬",
  korean:      "Korean cinema — some of the best filmmaking alive 🎬",
  japanese:    "Japanese films with stunning storytelling 🎬",
  telugu:      "Telugu/Tollywood films that go all out 🎬",
  malayalam:   "Malayalam cinema — some of India's best storytelling 🎬",
}

const GAME_INTROS = {
  rpg:         "Best RPGs you can sink hundreds of hours into 🗡️",
  indie:       "Indie gems that punch way above their weight 💎",
  shooter:     "Shooters worth installing right now 🎯",
  strategy:    "Strategy games for big-brain moments 🧠",
  multiplayer: "Multiplayer games to play with friends 🎮",
  action:      "Action games with incredible gameplay 💥",
  chill:       "Games you can play completely stress-free 🌿",
  horror:      "Horror games to genuinely terrify you 👻",
  scifi:       "Sci-fi games with worlds you won't want to leave 🚀",
  fantasy:     "Fantasy worlds to get completely lost in ⚔️",
  romance:     "Games with beautiful romance and story 💛",
  sports:      "Sports games worth playing right now ⚽",
  puzzle:      "Puzzle games that'll bend your brain 🧩",
}

const RECIPE_INTROS = {
  indian:     "Indian recipes that taste like the real deal 🍛",
  italian:    "Italian recipes that'll impress anyone 🍝",
  quick:      "Quick recipes for when you don't have all day ⚡",
  vegetarian: "Vegetarian dishes that are genuinely satisfying 🌱",
  dessert:    "Desserts worth every single calorie 🍫",
  romantic:   "Dishes to cook for a very special evening 🌹",
  chill:      "Comfort food for when you need a warm hug 🫂",
  breakfast:  "Breakfast recipes to start the day right ☀️",
  asian:      "Asian recipes packed with flavour 🥢",
  french:     "French recipes that feel like a bistro at home 🥖",
  mexican:    "Mexican recipes bursting with flavour 🌮",
  mediterranean: "Mediterranean dishes, fresh and vibrant 🫒",
  filipino:   "Filipino recipes worth discovering 🍚",
  british:    "British classics, comforting and hearty 🥧",
  american:   "American classics done right 🍔",
  south_indian: "South Indian dishes — dosa to rasam 🥥",
  north_indian: "North Indian classics, rich and comforting 🍛",
  albanian:   "Albanian dishes, hearty and homestyle 🥘",
  south_african: "South African dishes packed with character 🍖",
}

const BOOK_INTROS = {
  scifi:    "Sci-fi books that genuinely expand your mind 🚀",
  romance:  "Romance books you'll read in one sitting 💛",
  fantasy:  "Fantasy series you'll never want to end ⚔️",
  thriller: "Thrillers that won't let you put them down 😰",
  drama:    "Dramas that will make you feel deeply 💙",
}

const DRINK_INTROS = {
  cocktail:  "Classic cocktails worth mixing tonight 🍸",
  mocktail:  "Beautiful mocktails — all the fun, zero the alcohol 🍹",
  coffee:    "Coffee drinks that go beyond basic ☕",
  tea:       "Tea recipes for every mood 🍵",
  smoothie:  "Smoothies that actually taste amazing 🥤",
  romantic:  "Drinks to set the mood for a special evening 🥂",
  chill:     "Warm, cozy drinks for unwinding 🫖",
  morning:   "Morning drinks to start the day right ☀️",
  party:     "Crowd-pleasing drinks for a great night 🎉",
  wellness:  "Wellness drinks that actually make you feel good 🌿",
}

const MUSIC_INTROS = {
  focus:    "Perfect playlists for deep focus and flow 🎧",
  chill:    "Chill playlists for when you just want to drift 🌿",
  workout:  "Workout playlists to push through every rep 💪",
  romantic: "Music to set a romantic mood 🌹",
  party:    "Party playlists guaranteed to get people moving 🎉",
  sad:      "Playlists for when you need to feel it all 💙",
  morning:  "Morning music to ease into the day ☀️",
  night:    "Late night vibes — moody and atmospheric 🌙",
  hindi:    "Best Bollywood and Hindi music picks 🎵",
  tamil:    "Best Tamil music — kuthu to melody 🎵",
  telugu:   "Best Telugu/Tollywood music picks 🎵",
}

const ACTIVITY_INTROS = {
  outdoor:  "Outdoor activities to get you moving and breathing fresh air 🌿",
  indoor:   "Indoor activities for any weather or mood 🏠",
  solo:     "Solo activities that are actually fulfilling 🧘",
  social:   "Social activities perfect for groups and friends 🎉",
  creative: "Creative activities to make something cool 🎨",
  chill:    "Low-effort, high-satisfaction things to do 🌙",
  bored:    "Activities guaranteed to snap you out of a slump 😄",
}

/* ─── Response builder ───────────────────────────────────────── */
const MEDIUMS   = ['movie', 'game', 'book', 'recipe', 'drink', 'music', 'activity']
const GENRES    = ['scifi', 'romance', 'horror', 'thriller', 'comedy', 'action', 'fantasy', 'drama', 'anime', 'documentary']
const GAME_TAGS = ['rpg', 'indie', 'shooter', 'strategy', 'multiplayer', 'action', 'chill', 'horror', 'scifi', 'fantasy', 'romance', 'sports', 'puzzle']
const LANG_TAGS = ['tamil', 'hindi', 'korean', 'japanese', 'telugu', 'malayalam']
const FOOD_TAGS = ['indian', 'italian', 'quick', 'vegetarian', 'dessert', 'asian', 'breakfast', 'french', 'mexican', 'mediterranean', 'filipino', 'british', 'american', 'south_indian', 'north_indian', 'albanian', 'south_african']
const DRINK_SUB = ['cocktail', 'mocktail', 'coffee', 'tea', 'smoothie', 'wellness']
const MUSIC_SUB = ['focus', 'workout', 'party', 'chill', 'sad', 'romantic', 'morning', 'night', 'hindi', 'tamil', 'telugu']
const ACT_SUB   = ['outdoor', 'indoor', 'solo', 'social', 'creative', 'chill', 'bored']
const MOOD_TAGS = ['sad', 'happy', 'bored', 'chill', 'romantic', 'hungry', 'morning', 'night', 'weekend']

function pick(category, tag, n = 5) {
  const list = RECS[category]?.[tag]
  if (!list) return []
  return list.slice(0, n).map(item => typeof item === 'string' ? item : item.title)
}

function pickByGenre(category, tag, genre, n = 5) {
  const list = RECS[category]?.[tag]
  if (!list) return []
  return list
    .filter(item => typeof item === 'object' && item.genre?.includes(genre))
    .slice(0, n)
    .map(item => item.title)
}

function buildResponse(tags) {
  const t = new Set(tags)

  if (t.has('greeting')) return {
    text: "Hey! I'm Bibble 🐶 Ask me for real recommendations — 'good sci-fi movies', 'best RPG games', 'Tamil horror films', 'cocktail ideas', 'chill music playlist', 'quick Indian recipes'...",
    recs: [], actions: [],
  }
  if (t.has('thanks')) return { text: "Always! ✨ Come back whenever you need a pick.", recs: [], actions: [] }
  if (t.has('help')) return {
    text: "Try asking me things like:",
    recs: ['Good sci-fi movies', 'Quick Indian recipes', 'Best RPG games', 'Tamil action films', 'Cocktail recommendations', 'Chill music playlist', 'Creative solo activities'],
    actions: [],
  }

  const medium  = MEDIUMS.find(m => t.has(m))
  const genre   = GENRES.find(g => t.has(g))
  const lang    = LANG_TAGS.find(l => t.has(l))
  const foodTag = FOOD_TAGS.find(f => t.has(f))
  const mood    = MOOD_TAGS.find(m => t.has(m))

  // ── MOVIES ──────────────────────────────────────────────────
  if (medium === 'movie' || (!medium && (genre || lang))) {
    const path = '/movies'
    if (lang && genre) {
      const langLabel = lang.charAt(0).toUpperCase() + lang.slice(1)
      const genreMatches = pickByGenre('movie', lang, genre)
      if (genreMatches.length) return {
        text: `${langLabel} ${genre} — great combo. Here are the best picks:`,
        recs: genreMatches, actions: [{ label: 'Browse Movies →', path }],
      }
      return {
        text: `I don't have ${langLabel}-specific ${genre} picks yet, but here's the best of ${langLabel} cinema:`,
        recs: pick('movie', lang), actions: [{ label: 'Browse Movies →', path }],
      }
    }
    if (lang)   return { text: MOVIE_INTROS[lang],   recs: pick('movie', lang),  actions: [{ label: 'Browse Movies →', path }] }
    if (genre)  return { text: MOVIE_INTROS[genre] ?? `Here are some ${genre} films:`, recs: pick('movie', genre), actions: [{ label: 'Browse Movies →', path }] }
    if (mood && RECS.movie[mood]) return {
      text: { sad: "Something warm for a tough day 💛", happy: "Films to match your energy 🎉", chill: "Slow-burn films for a relaxed evening 🌙", romantic: "Romance films for a special night 🌹" }[mood] ?? "Here's what I'd watch:",
      recs: pick('movie', mood), actions: [{ label: 'Browse Movies →', path }],
    }
    return { text: "What genre? Sci-fi, romance, horror, thriller, comedy, fantasy, anime... or a language like Tamil, Telugu, Malayalam, Hindi, Korean? 🎬", recs: [], actions: [{ label: 'Browse Movies →', path }] }
  }

  // ── GAMES ──────────────────────────────────────────────────
  if (medium === 'game') {
    const path = '/games'
    const tag = GAME_TAGS.find(g => t.has(g)) || (mood === 'chill' ? 'chill' : null)
    if (tag && RECS.game[tag]) return { text: GAME_INTROS[tag] ?? `Great ${tag} games:`, recs: pick('game', tag), actions: [{ label: 'Explore Games →', path }] }
    return { text: "What kind of games? RPG, indie, shooter, strategy, multiplayer, chill, horror, sci-fi, fantasy, sports, puzzle? 🎮", recs: [], actions: [{ label: 'Explore Games →', path }] }
  }

  // ── RECIPES ────────────────────────────────────────────────
  if (medium === 'recipe' || t.has('hungry') || (!medium && foodTag)) {
    const path = '/recipes'
    const tag = foodTag || (mood === 'romantic' ? 'romantic' : mood === 'chill' ? 'chill' : t.has('morning') ? 'breakfast' : null)
    if (tag && RECS.recipe[tag]) return { text: RECIPE_INTROS[tag] ?? `Here are some ${tag} recipes:`, recs: pick('recipe', tag), actions: [{ label: 'See Recipes →', path }] }
    return { text: "What are you feeling? Indian, South Indian, Italian, French, Mexican, Mediterranean, quick & easy, vegetarian, dessert? 🍽️", recs: [], actions: [{ label: 'See Recipes →', path }] }
  }

  // ── BOOKS ──────────────────────────────────────────────────
  if (medium === 'book') {
    const path = '/books'
    const tag = ['scifi', 'romance', 'fantasy', 'thriller', 'drama'].find(g => t.has(g))
    if (tag && RECS.book[tag]) return { text: BOOK_INTROS[tag], recs: pick('book', tag), actions: [{ label: 'Find a Book →', path }] }
    return { text: "What genre? Sci-fi, romance, fantasy, thriller, or drama? 📚", recs: [], actions: [{ label: 'Find a Book →', path }] }
  }

  // ── DRINKS ─────────────────────────────────────────────────
  if (medium === 'drink') {
    const path = '/drinks'
    const drinkType = DRINK_SUB.find(d => t.has(d))
    const moodDrink = mood === 'romantic' ? 'romantic' : mood === 'chill' ? 'chill' : t.has('morning') ? 'morning' : t.has('party') ? 'party' : null
    const tag = drinkType || moodDrink
    if (tag && RECS.drink[tag]) return { text: DRINK_INTROS[tag], recs: pick('drink', tag), actions: [{ label: 'Browse Drinks →', path }] }
    return { text: "What's the vibe? Cocktail, mocktail, coffee, tea, smoothie, wellness — or a mood like chill, morning, party, romantic ☕🍸", recs: [], actions: [{ label: 'Browse Drinks →', path }] }
  }

  // ── MUSIC ──────────────────────────────────────────────────
  if (medium === 'music') {
    const path = '/music'
    const moodMusic = mood === 'chill' ? 'chill' : mood === 'sad' ? 'sad' : mood === 'romantic' ? 'romantic' : mood === 'happy' ? 'party' : t.has('morning') ? 'morning' : t.has('night') ? 'night' : null
    const tag = MUSIC_SUB.find(m => t.has(m)) || moodMusic
    if (tag && RECS.music[tag]) return { text: MUSIC_INTROS[tag] ?? `Here are some ${tag} playlists:`, recs: pick('music', tag), actions: [{ label: 'Find Music →', path }] }
    return { text: "What's the vibe? Focus, chill, workout, party, romantic, sad, morning, night, Hindi, Tamil? 🎵", recs: [], actions: [{ label: 'Find Music →', path }] }
  }

  // ── ACTIVITIES ─────────────────────────────────────────────
  if (medium === 'activity') {
    const path = '/activities'
    const moodAct = mood === 'chill' ? 'chill' : mood === 'bored' ? 'bored' : mood === 'happy' ? 'social' : mood === 'romantic' ? 'social' : null
    const tag = ACT_SUB.find(a => t.has(a)) || moodAct
    if (tag && RECS.activity[tag]) return { text: ACTIVITY_INTROS[tag] ?? `Here are some ${tag} activities:`, recs: pick('activity', tag), actions: [{ label: 'See Activities →', path }] }
    return { text: "What kind of activity? Outdoor, indoor, solo, social, creative, chill? 🌿", recs: [], actions: [{ label: 'See Activities →', path }] }
  }

  // ── Mood-only ───────────────────────────────────────────────
  if (t.has('bored')) return {
    text: "Bored? Let's fix that — something you'd never normally do 😄",
    recs: pick('activity', 'bored'), actions: [{ label: 'Games 🎮', path: '/games' }, { label: 'Activities 🌿', path: '/activities' }],
  }
  if (t.has('sad')) return {
    text: "Hey, it's okay 💛 Here's some comfort viewing:",
    recs: pick('movie', 'sad'), actions: [{ label: 'Comfort Films 🎬', path: '/movies' }, { label: 'Cozy Recipes 🍝', path: '/recipes' }],
  }
  if (t.has('romantic')) return {
    text: "Romance mode 🌹 Here's what I'd pick for a perfect evening:",
    recs: pick('movie', 'romantic'), actions: [{ label: 'Romantic Films 🎬', path: '/movies' }, { label: 'Dinner Recipes 🍝', path: '/recipes' }],
  }
  if (t.has('chill')) return {
    text: "Rest mode. Here's how to actually unwind 🌙",
    recs: pick('movie', 'chill'), actions: [{ label: 'Chill Films 🎬', path: '/movies' }, { label: 'Warm Drinks ☕', path: '/drinks' }],
  }
  if (t.has('morning')) return {
    text: "Let's start the day right ☀️",
    recs: pick('recipe', 'breakfast'), actions: [{ label: 'Morning Drinks ☕', path: '/drinks' }, { label: 'Breakfast Recipes 🍳', path: '/recipes' }],
  }
  if (t.has('night')) return {
    text: "The best hours of the day 🌙",
    recs: pick('drink', 'night'), actions: [{ label: 'Night Films 🎬', path: '/movies' }, { label: 'Cocktails 🍸', path: '/drinks' }],
  }
  if (t.has('weekend')) return {
    text: "Weekend mode! Make it count 🎊",
    recs: [], actions: [{ label: 'Collections ✨', path: '/collections' }, { label: 'Activities 🌿', path: '/activities' }],
  }

  return null
}

/* ─── Fallbacks ──────────────────────────────────────────────── */
const FALLBACKS = [
  "Try asking like: 'good sci-fi movies', 'quick Indian recipes', 'best RPG games', 'Tamil horror films', or 'cocktail ideas' — I'll give you real picks! 🎯",
  "Not sure I caught that! Give me a medium + genre — 'horror movies', 'indie games', 'vegetarian recipes', 'chill music', 'outdoor activities' 😊",
  "Tell me more — films, food, games, books, drinks, music, activities? And any genre or vibe? ✨",
  "Try something like 'chill games to play tonight' or 'romantic Hindi films' and I'll nail it 🐶",
]

const QUICK_CHIPS = [
  { label: 'Sci-fi movies 🚀',  input: 'good sci-fi movies' },
  { label: 'Tamil films 🎬',    input: 'best Tamil movies' },
  { label: 'RPG games 🗡️',    input: 'best RPG games' },
  { label: 'Cocktails 🍸',      input: 'cocktail recommendations' },
  { label: 'Quick recipes ⚡',  input: 'quick easy recipes' },
  { label: 'Chill music 🎵',    input: 'chill music playlist' },
]

let fallbackIdx = 0

/* ─── Bibble avatar — cute SVG puppy ────────────────────────── */
function BibbleAvatar({ size = 32 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 6px rgba(196,154,108,0.5))' }}
    >
      {/* Left floppy ear */}
      <ellipse cx="19" cy="50" rx="17" ry="24" fill="#B8864A" transform="rotate(-18 19 50)" />
      <ellipse cx="19" cy="52" rx="10" ry="16" fill="#D4A070" transform="rotate(-18 19 52)" />
      {/* Right floppy ear */}
      <ellipse cx="81" cy="50" rx="17" ry="24" fill="#B8864A" transform="rotate(18 81 50)" />
      <ellipse cx="81" cy="52" rx="10" ry="16" fill="#D4A070" transform="rotate(18 81 52)" />
      {/* Head */}
      <circle cx="50" cy="55" r="38" fill="#DDB070" />
      {/* Top darker patch */}
      <ellipse cx="50" cy="34" rx="22" ry="14" fill="#B8864A" opacity="0.45" />
      {/* Left eye white */}
      <circle cx="35" cy="51" r="9.5" fill="#FFFAF5" />
      {/* Left pupil */}
      <circle cx="37" cy="52" r="6.5" fill="#150E04" />
      {/* Left eye shine */}
      <circle cx="39.5" cy="49" r="2.5" fill="white" />
      {/* Right eye white */}
      <circle cx="65" cy="51" r="9.5" fill="#FFFAF5" />
      {/* Right pupil */}
      <circle cx="67" cy="52" r="6.5" fill="#150E04" />
      {/* Right eye shine */}
      <circle cx="69.5" cy="49" r="2.5" fill="white" />
      {/* Snout */}
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#C8916A" opacity="0.55" />
      {/* Nose */}
      <ellipse cx="50" cy="63" rx="7" ry="5.5" fill="#1A0E04" />
      <ellipse cx="48" cy="61.5" rx="2.2" ry="1.4" fill="white" opacity="0.4" />
      {/* Mouth */}
      <path d="M 44 70 Q 50 76 56 70" stroke="#1A0E04" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="50" cy="76" rx="6.5" ry="5.5" fill="#FF8C94" />
      <line x1="50" y1="71" x2="50" y2="81" stroke="#D06878" strokeWidth="1.5" />
      {/* Blush left */}
      <ellipse cx="25" cy="63" rx="9" ry="5.5" fill="#FFB0B8" opacity="0.4" />
      {/* Blush right */}
      <ellipse cx="75" cy="63" rx="9" ry="5.5" fill="#FFB0B8" opacity="0.4" />
    </svg>
  )
}

/* ─── Main component ─────────────────────────────────────────── */
export default function Bibble() {
  const navigate                        = useNavigate()
  const [open, setOpen]                 = useState(false)
  const [messages, setMessages]         = useState([])
  const [input, setInput]               = useState('')
  const [typing, setTyping]             = useState(false)
  const [notif, setNotif]               = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const didInit   = useRef(false)

  useEffect(() => {
    if (open && !didInit.current) {
      didInit.current = true
      setMessages([{
        id: 1, from: 'bibble',
        text: "Hi! I'm Bibble 🐶 Ask me for real picks — 'good sci-fi movies', 'best RPG games', 'Tamil horror', 'cocktail ideas', 'chill music', 'quick Indian recipes'...",
        recs: [], actions: [],
      }])
    } else if (!open && !didInit.current) {
      const timer = setTimeout(() => setNotif(true), 3500)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 320) }, [open])

  const pushUser   = (text) => setMessages(prev => [...prev, { id: Date.now(), from: 'user', text }])
  const pushBibble = (text, recs = [], actions = []) =>
    setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bibble', text, recs, actions }])

  const reply = (text) => {
    pushUser(text)
    setTyping(true)
    const tags = detectTags(text)
    const resp = buildResponse(tags)
    const delay = 400 + Math.min(text.length * 12, 800)
    setTimeout(() => {
      setTyping(false)
      if (resp) pushBibble(resp.text, resp.recs, resp.actions)
      else { pushBibble(FALLBACKS[fallbackIdx % FALLBACKS.length], [], []); fallbackIdx++ }
    }, delay)
  }

  const handleSend   = () => { const t = input.trim(); if (!t) return; setInput(''); reply(t) }
  const handleKey    = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }
  const handleAction = (path) => { navigate(path); setOpen(false) }
  const handleOpen   = () => { setOpen(true); setNotif(false) }

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', bottom: 88, right: 24, zIndex: 9999,
              width: 370, maxWidth: 'calc(100vw - 48px)',
              borderRadius: 20,
              background: '#FAF7F3',
              boxShadow: '0 24px 64px rgba(14,10,6,0.22), 0 4px 16px rgba(14,10,6,0.1)',
              border: '1px solid rgba(196,154,108,0.22)',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>

            {/* Header */}
            <div style={{ background: '#0C0A08', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <BibbleAvatar size={34} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#FDFAF6', fontFamily: '"Bodoni Moda", Georgia, serif', letterSpacing: '-0.01em' }}>Bibble</p>
                <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,240,220,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your Sylex guide</p>
              </div>
              <button onClick={() => setOpen(false)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,240,220,0.5)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360 }}>
              {messages.map(msg => (
                <div key={msg.id}>
                  <div style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                    {msg.from === 'bibble' && <BibbleAvatar size={26} />}
                    <div style={{
                      maxWidth: '82%',
                      background: msg.from === 'user' ? '#C49A6C' : '#EDE5D8',
                      color: msg.from === 'user' ? '#1A0E08' : '#2A1E10',
                      borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '10px 13px',
                      fontSize: 13.5, lineHeight: 1.55,
                      fontFamily: '"Inter", system-ui, sans-serif',
                    }}>
                      {msg.text}
                      {msg.recs?.length > 0 && (
                        <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {msg.recs.map((r, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5 }}>
                              <span style={{ color: '#C49A6C', flexShrink: 0, fontWeight: 700, marginTop: 1 }}>▸</span>
                              <span style={{ color: msg.from === 'user' ? '#1A0E08' : '#3A2510' }}>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.actions?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingLeft: 34 }}>
                      {msg.actions.map((a, i) => (
                        <button key={i} onClick={() => handleAction(a.path)}
                          style={{
                            background: '#fff', border: '1.5px solid rgba(196,154,108,0.45)',
                            borderRadius: 100, padding: '6px 13px', fontSize: 12, fontWeight: 600,
                            color: '#7A4A18', cursor: 'pointer', fontFamily: '"Inter", sans-serif',
                            transition: 'all 0.18s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#C49A6C'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#C49A6C' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#7A4A18'; e.currentTarget.style.borderColor = 'rgba(196,154,108,0.45)' }}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <BibbleAvatar size={26} />
                  <div style={{ background: '#EDE5D8', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: 6, height: 6, borderRadius: '50%', background: '#C49A6C', display: 'block',
                        animation: `bibbleDot 1.2s ${i * 0.2}s ease-in-out infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick chips */}
            <div style={{ padding: '0 14px 10px', overflowX: 'auto', display: 'flex', gap: 7, scrollbarWidth: 'none' }}>
              {QUICK_CHIPS.map((c, i) => (
                <button key={i} onClick={() => reply(c.input)}
                  style={{
                    flexShrink: 0, background: 'rgba(196,154,108,0.1)', border: '1px solid rgba(196,154,108,0.25)',
                    borderRadius: 100, padding: '5px 11px', fontSize: 11.5, fontWeight: 500, color: '#7A4A18',
                    cursor: 'pointer', fontFamily: '"Inter", sans-serif', whiteSpace: 'nowrap', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,154,108,0.22)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,154,108,0.1)' }}>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '0 14px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask Bibble for picks…"
                style={{
                  flex: 1, background: '#fff', border: '1.5px solid rgba(196,154,108,0.3)',
                  borderRadius: 12, padding: '10px 14px', fontSize: 13.5,
                  color: '#2A1E10', outline: 'none', fontFamily: '"Inter", system-ui, sans-serif',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#C49A6C'}
                onBlur={e => e.target.style.borderColor = 'rgba(196,154,108,0.3)'}
              />
              <button onClick={handleSend} disabled={!input.trim()}
                style={{
                  width: 40, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: input.trim() ? '#C49A6C' : 'rgba(196,154,108,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', flexShrink: 0,
                }}>
                <Send size={16} color={input.trim() ? '#1A0E08' : 'rgba(196,154,108,0.5)'} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ── */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: open ? '#0C0A08' : 'linear-gradient(135deg, #B8864A 0%, #E8C080 50%, #B8864A 100%)',
          boxShadow: open ? '0 4px 20px rgba(14,10,6,0.3)' : '0 6px 28px rgba(196,154,108,0.55), 0 2px 8px rgba(196,154,108,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.25s, box-shadow 0.25s',
        }}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.18 }}><X size={20} color="#C49A6C" /></motion.span>
            : <motion.div key="b" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.18 }}><BibbleAvatar size={36} /></motion.div>
          }
        </AnimatePresence>

        {notif && !open && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            style={{
              position: 'absolute', top: 2, right: 2, width: 14, height: 14,
              borderRadius: '50%', background: '#FF5555', border: '2px solid #FAF7F3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, color: '#fff', fontWeight: 700,
            }}>
            1
          </motion.span>
        )}
      </motion.button>

      <style>{`
        @keyframes bibbleDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1.1); opacity: 1;   }
        }
      `}</style>
    </>
  )
}
