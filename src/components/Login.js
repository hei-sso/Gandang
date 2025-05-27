import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      setIsLoggedIn(true);
      navigate('/mypage'); // 로그인 후 마이페이지로 이동
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="container">
      <h2>로그인</h2>
      <input 
        type="text" 
        placeholder="아이디" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="비밀번호" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button className="button" onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default Login;