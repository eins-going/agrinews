
// 전역 변수로 기사 배열 선언
let articles = [];

// JSON 파일에서 기사 데이터 로드
async function loadArticlesData() {
    try {
        const response = await fetch('articles.json');
        const data = await response.json();
        articles = Array.isArray(data) ? data : (data.articles || []);
        console.log('기사 데이터 로드 완료:', articles.length, '개');
        return articles;
    } catch (error) {
        console.error('기사 데이터 로드 실패:', error);
        articles = [];
        return [];
    }
}

// 페이지 로드 시 데이터 로드
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드 완료, 데이터 로드 시작');
    loadArticlesData();
});

function decodeHtmlEntities(text) {
    if (!text) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

// 전역 함수로 showModal 선언
function showModal(index) {
    console.log('showModal 호출됨, index:', index);
    
    // 기사 데이터가 로드되지 않았으면 다시 로드
    if (articles.length === 0) {
        console.log('기사 데이터가 없어서 다시 로드합니다.');
        loadArticlesData().then(() => {
            setTimeout(() => {
                if (articles.length > 0) {
                    showModal(index);
                } else {
                    alert('기사 데이터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
                }
            }, 100);
        });
        return;
    }
    
    const article = articles[index];
    if (!article) {
        console.error('Article not found for index:', index);
        alert('기사를 찾을 수 없습니다.');
        return;
    }
    
    console.log('선택된 기사:', article);
    
    // 제목 설정
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        modalTitle.textContent = decodeHtmlEntities(article.title);
    }
    
    // 출처 설정
    const modalSource = document.getElementById('modal-source');
    if (modalSource) {
        modalSource.textContent = article.source;
        modalSource.className = 'modal-source ' + (article.source.includes('농림축산식품부') ? 'source-mafra' : (article.source.includes('농민신문') ? 'source-nongmin' : (article.source.includes('농어민신문') ? 'source-agrinet' : 'source-rnd')));
    }
    
    // 날짜 설정
    const modalDate = document.getElementById('modal-date');
    if (modalDate) {
        let displayDate = article.date || article.pub_date;
        if (displayDate) {
            // ISO 형식의 날짜를 한국 형식으로 변환
            if (displayDate.includes('T')) {
                const date = new Date(displayDate);
                displayDate = `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            }
        }
        modalDate.textContent = displayDate;
    }
    
    // 본문 설정
    const modalContent = document.getElementById('modal-content-text');
    if (modalContent) {
        modalContent.textContent = decodeHtmlEntities(article.content);
    }
    
    // 원문 링크 설정
    const modalLink = document.getElementById('modal-original-link');
    if (modalLink) {
        modalLink.href = article.link;
    }
    
    // 모달 표시
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('모달이 표시되었습니다.');
    }
}

// 전역 함수로 closeModal 선언
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('모달이 닫혔습니다.');
    }
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// 전역 함수들이 제대로 로드되었는지 확인
console.log('JavaScript 모달 함수들이 로드되었습니다.');
console.log('showModal 함수:', typeof showModal);
console.log('closeModal 함수:', typeof closeModal);
        