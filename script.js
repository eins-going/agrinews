
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
    
    // 카드 뉴스에 호버 효과 추가
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

function decodeHtmlEntities(text) {
    if (!text) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

// 카드 뉴스 클릭 시 모달 표시
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
        // 출처별 색상 클래스 설정
        let sourceClass = 'source-rnd';
        if (article.source.includes('농림축산식품부')) {
            sourceClass = 'source-mafra';
        } else if (article.source.includes('농민신문')) {
            sourceClass = 'source-nongmin';
        } else if (article.source.includes('농어민신문')) {
            sourceClass = 'source-agrinet';
        }
        modalSource.className = 'modal-source ' + sourceClass;
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
        const content = decodeHtmlEntities(article.content);
        // 본문을 단락으로 나누어 표시
        const paragraphs = content.split('

').filter(p => p.trim());
        let formattedContent = '';
        
        paragraphs.forEach(paragraph => {
            if (paragraph.trim()) {
                formattedContent += `<p>${paragraph.trim()}</p>`;
            }
        });
        
        modalContent.innerHTML = formattedContent;
    }
    
    // 원문 링크 설정
    const modalLink = document.getElementById('modal-original-link');
    if (modalLink && article.link) {
        modalLink.href = article.link;
        modalLink.style.display = 'inline-block';
    } else if (modalLink) {
        modalLink.style.display = 'none';
    }
    
    // 모달 표시
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 모달 애니메이션
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                modalContent.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
        }
        
        console.log('모달이 표시되었습니다.');
    }
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        } else {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        console.log('모달이 닫혔습니다.');
    }
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

// 전역 함수들이 제대로 로드되었는지 확인
console.log('JavaScript 모달 함수들이 로드되었습니다.');
console.log('showModal 함수:', typeof showModal);
console.log('closeModal 함수:', typeof closeModal);
