import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FilterProvider } from './context/FilterContext'
import ScrollToTop from './components/ui/ScrollToTop'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Recipes from './pages/Recipes'
import Games from './pages/Games'
import Books from './pages/Books'
import Music from './pages/Music'
import Activities from './pages/Activities'
import Collections from './pages/Collections'
import Profile from './pages/Profile'
import Drinks from './pages/Drinks'
import Planner from './pages/Planner'
import VerifyEmail from './pages/VerifyEmail'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FilterProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="movies" element={<Movies />} />
              <Route path="recipes" element={<Recipes />} />
              <Route path="games" element={<Games />} />
              <Route path="books" element={<Books />} />
              <Route path="music" element={<Music />} />
              <Route path="activities" element={<Activities />} />
              <Route path="drinks" element={<Drinks />} />
              <Route path="collections" element={<Collections />} />
              <Route path="planner" element={<Planner />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
