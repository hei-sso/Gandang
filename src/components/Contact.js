import React, { useState } from 'react';

function Contact() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [openPostId, setOpenPostId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const finalAuthor = isAnonymous ? '익명' : author.trim();
      if (!finalAuthor) {
        alert('작성자를 입력하거나 익명으로 선택해 주세요.');
        return;
      }

      const newPost = {
        id: Date.now(),
        title,
        content,
        author: finalAuthor,
        date: new Date().toLocaleString(),
        views: 0,
      };
      setPosts([newPost, ...posts]);
      setTitle('');
      setContent('');
      setAuthor('');
      setIsAnonymous(false);
    }
  };

  const togglePost = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, views: post.views + (openPostId === id ? 0 : 1) }
          : post
      )
    );
    setOpenPostId(openPostId === id ? null : id);
  };

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h2>📬건의사항 게시판</h2>
      <p>여러분의 소중한 의견을 남겨주세요.</p>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          required
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
            disabled={isAnonymous}
          />
          <label style={{ whiteSpace: 'nowrap' }}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
            />{' '}
            익명
          </label>
        </div>
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          style={textareaStyle}
          required
        ></textarea>
        <button type="submit" style={buttonStyle}>등록</button>
      </form>

      {/* 게시글 테이블 */}
      <div>
        <h3>📄건의사항 목록</h3>
        {posts.length === 0 ? (
          <p>등록된 글이 없습니다.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>번호</th>
                <th style={thTdStyle}>제목</th>
                <th style={thTdStyle}>작성자</th>
                <th style={thTdStyle}>작성일</th>
                <th style={thTdStyle}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <tr
                    onClick={() => togglePost(post.id)}
                    style={{ cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                  >
                    <td style={thTdStyle}>{posts.length - index}</td>
                    <td style={thTdStyle}>{post.title}</td>
                    <td style={thTdStyle}>{post.author}</td>
                    <td style={thTdStyle}>{post.date}</td>
                    <td style={thTdStyle}>{post.views}</td>
                  </tr>
                  {openPostId === post.id && (
                    <tr>
                      <td colSpan="5" style={{ backgroundColor: '#f9f9f9', padding: '10px' }}>
                        <p style={{ margin: 0 }}>{post.content}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// 스타일
const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
};

const buttonStyle = {
  padding: '10px 20px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thTdStyle = {
  padding: '10px',
  borderBottom: '1px solid #ccc',
  textAlign: 'left',
};

export default Contact;
