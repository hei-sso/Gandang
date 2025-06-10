import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Predict from './components/Predict';
import Result from './components/Result';
import Contact from './components/Contact';
import logo from './assets/logo.png'
import './App.css';

function App() {

  return (
    <Router>
      <div className="container">
        <header className="header">
          {/* 로고 이미지로 변경 */}
          <img src={logo} alt="간당간당 로고" className="logo" />
          <nav className="nav">
            <Link className="navItem" to="/">홈</Link>
            <Link className="navItem" to="/predict">지각 예측</Link>
            <Link className="navItem" to="/result">예측 결과</Link>
            <Link className="navItem" to="/contact">건의사항</Link>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/result" element={<Result />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2025 간당간당. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
