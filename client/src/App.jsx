import { Route, Routes } from 'react-router-dom'
//import './App.css'
import './App.css'
import IndexPage from './pages/IndexPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Layout from './Layout.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import axios from 'axios'
import AccountPage from './pages/AccountPage.jsx'
import PlacesPage from './pages/PlacesPage.jsx'
import PlacesForm from './pages/PlacesForm.jsx'
import PlacePage from './pages/PlacePage.jsx'
import BookingsPage from './pages/BookingsPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import { UserContextProvider } from './UserContextProvider.jsx'
axios.defaults.baseURL='http://localhost:3000'
axios.defaults.withCredentials=true

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/account" element={<AccountPage/>} />
          <Route path="/account/places" element={<PlacesPage/>} />
          <Route path="/account/places/new" element={<PlacesForm/>} />
          <Route path="/account/places/:id" element={<PlacesForm/>} />
          <Route path="/place/:id" element={<PlacePage/>} />
          <Route path="/account/bookings" element={<BookingsPage/>} />
          <Route path="/account/bookings/:id" element={<BookingPage/>} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
