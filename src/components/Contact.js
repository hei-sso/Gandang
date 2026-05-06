import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [openPostId, setOpenPostId] = useState(null);

  const [adminId, setAdminId] = useState('');
  const [inputAdminId, setInputAdminId] = useState('');
  const [answerInputs, setAnswerInputs] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // 페이지네이션 번호 그룹 관련 상태
  const [pageGroup, setPageGroup] = useState(1);
  const pageGroupSize = 5;

  const db = getFirestore();
  const CONTACT_COLLECTION = 'contact';
  const ADMIN_ID = 'admin123'; // 관리자 ID

  useEffect(() => {
    const fetchPosts = async () => {
      const snap = await getDocs(collection(db, CONTACT_COLLECTION));
      const result = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      result.sort((a, b) => b.date?.seconds - a.date?.seconds);
      setPosts(result);
    };
    fetchPosts();
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await addDoc(collection(db, CONTACT_COLLECTION), {
        title: title.trim(),
        content: content.trim(),
        date: serverTimestamp(),
      });
      setTitle('');
      setContent('');
      setCurrentPage(1);
      setPageGroup(1);
      window.location.reload();
    } catch (err) {
      console.error('등록 실패:', err);
    }
  };

  const togglePost = (id) => {
    setOpenPostId(openPostId === id ? null : id);
  };

  const handleAnswerChange = (id, text) => {
    setAnswerInputs(prev => ({ ...prev, [id]: text }));
  };

  const saveAnswer = async (id) => {
    const answer = answerInputs[id];
    if (!answer.trim()) return;

    try {
      await updateDoc(doc(db, CONTACT_COLLECTION, id), { answer: answer.trim() });
      window.location.reload();
    } catch (err) {
      console.error('답변 저장 실패:', err);
    }
  };

  const isAdmin = adminId === ADMIN_ID;

  // 페이지네이션 관련
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 페이지 그룹 번호 계산
  const startPage = (pageGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const newPageGroup = Math.ceil(pageNumber / pageGroupSize);
    setPageGroup(newPageGroup);
  };

  // 이전 페이지 버튼 (한 페이지씩 이동)
  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      const newPageGroup = Math.ceil(newPage / pageGroupSize);
      setPageGroup(newPageGroup);
    }
  };

  // 다음 페이지 버튼 (한 페이지씩 이동)
  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      const newPageGroup = Math.ceil(newPage / pageGroupSize);
      setPageGroup(newPageGroup);
    }
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
          <>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thTdStyle}>번호</th>
                  <th style={thTdStyle}>제목</th>
                  <th style={thTdStyle}>작성일</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post, index) => (
                  <React.Fragment key={post.id}>
                    <tr
                      onClick={() => togglePost(post.id)}
                      style={{ cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                    >
                      <td style={thTdStyle}>{posts.length - (indexOfFirstPost + index)}</td>
                      <td style={thTdStyle}>{post.title}</td>
                      <td style={thTdStyle}>
                        {post.date?.toDate().toLocaleString() ?? ''}
                      </td>
                    </tr>
                    {openPostId === post.id && (
                      <tr>
                        <td colSpan="3" style={{ backgroundColor: '#f9f9f9', padding: '10px' }}>
                          <p><strong>내용:</strong> {post.content}</p>

                          {post.answer && (
                            <div style={{ marginTop: '10px', padding: '10px', background: '#eef' }}>
                              <strong>📢 관리자 답변:</strong>
                              <p style={{ margin: 0 }}>{post.answer}</p>
                            </div>
                          )}

                          {isAdmin && (
                            <div style={{ marginTop: '15px' }}>
                              <textarea
                                placeholder="관리자 답변 입력"
                                rows="3"
                                value={answerInputs[post.id] || ''}
                                onChange={(e) => handleAnswerChange(post.id, e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                              />
                              <button onClick={() => saveAnswer(post.id)} style={{ marginTop: '5px' }}>
                                답변 등록
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 버튼 */}
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                style={pageButtonStyle}
              >
                &lt;
              </button>
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  style={{
                    ...pageButtonStyle,
                    backgroundColor: pageNum === currentPage ? '#0366d6' : '#f0f0f0',
                    color: pageNum === currentPage ? '#fff' : '#000',
                  }}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                style={pageButtonStyle}
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>

      {/* 관리자 로그인 */}
      <div style={{ marginTop: "30px" }}>
        <h4>🔐 관리자 로그인</h4>
        <input
          type="text"
          placeholder="관리자 ID 입력"
          value={inputAdminId}
          onChange={(e) => setInputAdminId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setAdminId(inputAdminId);
            }
          }}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={() => setAdminId(inputAdminId)} style={{ padding: "8px 16px" }}>
          로그인
        </button>
        {isAdmin && <span style={{ marginLeft: "10px", color: "green" }}>✔ 관리자 로그인됨</span>}
      </div>
    </div>
  );
};

// 스타일 정의 (기존과 동일)
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

const pageButtonStyle = {
  margin: '0 5px',
  padding: '6px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Contact;
