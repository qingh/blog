import { Routes, Route } from 'react-router-dom'
import { history } from '@router/history'
import { CustomRouter } from '@router/customRouter'
import { Login } from '@pages/login'
import NotFound from '@pages/404'
import { Home } from '@pages/common/layout'

export function App () {
  return (
    <CustomRouter history={history}>
      <Routes>
        <Route path="*" element={<Home />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CustomRouter>
  )
}
