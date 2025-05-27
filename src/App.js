import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Predict from './components/Predict';
import Login from './components/Login';
import Signup from './components/Signup';
import MyPage from './components/MyPage';
import Contact from './components/Contact';
import './App.css';

function App() {
  // 로그인 상태를 관리 (DB 연결 X, 예시로 사용)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1 className="logo">간당간당</h1>
          <nav className="nav">
            <Link className="navItem" to="/">홈</Link>
            <Link className="navItem" to="/predict">지각 예측</Link>
            {!isLoggedIn ? (
              <>
                <Link className="navItem" to="/login">로그인</Link>
                <Link className="navItem" to="/signup">회원가입</Link>
              </>
            ) : (
              <Link className="navItem" to="/mypage">마이페이지</Link>
            )}
            <Link className="navItem" to="/contact">건의사항</Link>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />
            {isLoggedIn && <Route path="/mypage" element={<MyPage />} />}
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