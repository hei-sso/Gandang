import React, { useState } from 'react';

function Contact() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const newPost = { title, content, id: Date.now() };
      setPosts([newPost, ...posts]);
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="container">
      <h2>건의사항</h2>
      <p>무엇이든 남겨주세요.</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          ></textarea>
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>등록</button>
      </form>

      <div>
        <h3>건의사항 목록</h3>
        {posts.length === 0 ? (
          <p>등록된 글이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {posts.map((post) => (
              <li key={post.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <strong>{post.title}</strong>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Contact;