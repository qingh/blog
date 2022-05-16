import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Login } from './pages/login';
import NotFound from './pages/404';
import { Home } from './pages/common/layout';


/* const Home = () => <div>
  <h1>home</h1>
  <p>2</p>
  <Routes>
    <Route index element={<Product />} />
    <Route path="news" element={<News />} />
    <Route path="about" element={<About />} />
  </Routes>
</div>
const About = () => <h1>about</h1>
const News = () => <h1>news</h1>
const Product = () => <h1>product</h1> */

export function App() {
  return (
    <Router>
      {/* <ul>
        <li>
          <Link to={'/'}>home</Link>
        </li>
        <li>
          <Link to={'/about'}>about</Link>
        </li>
        <li>
          <Link to={'/news'}>news</Link>
        </li>
      </ul> */}
      <Routes>
        <Route path="*" element={<Home />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

