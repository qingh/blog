import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login } from '@pages/login'
import NotFound from '@pages/404'
import { Home } from '@pages/common/layout'

export function App () {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Home />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
