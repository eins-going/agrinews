
document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('news-grid');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-button');
    let articles = [];

    // 헬퍼 함수
    const getSourceClass = (source) => {
        if (!source) return 'source-default';
        if (source.includes('농림축산식품부')) return 'source-mafra';
        if (source.includes('농촌진흥청')) return 'source-rnd';
        if (source.includes('농민신문')) return 'source-nongmin';
        if (source.includes('한국농어민신문')) return 'source-agrinet';
        if (source.includes('농정신문')) return 'source-nongjung';
        return 'source-default';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '날짜 없음';
        try {
            const dt = new Date(dateStr);
            return `${dt.getFullYear()}년 ${String(dt.getMonth() + 1).padStart(2, '0')}월 ${String(dt.getDate()).padStart(2, '0')}일 ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
        } catch (e) { return dateStr; }
    };

    // 모달 열기
    const showModal = (article) => {
        document.getElementById('modal-source').textContent = article.source;
        document.getElementById('modal-source').className = `modal-source card-source ${getSourceClass(article.source)}`;
        document.getElementById('modal-title').textContent = article.title;
        document.getElementById('modal-date').textContent = formatDate(article.created_at);
        document.getElementById('modal-content-text').innerHTML = article.content.replace(/
/g, '<br>');
        document.getElementById('modal-original-link').href = article.link;
        modal.style.display = 'block';
    };

    // 모달 닫기
    const closeModal = () => { modal.style.display = 'none'; };
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    // 데이터 로드 및 카드 생성
    fetch('articles.json')
        .then(response => response.json())
        .then(data => {
            articles = data;
            newsGrid.innerHTML = ''; // 기존 내용 초기화
            articles.forEach((article, index) => {
                const sourceClass = getSourceClass(article.source);
                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="card-source ${sourceClass}">${article.source || '출처 없음'}</div>
                        <div class="card-date">${formatDate(article.created_at)}</div>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${article.title || '제목 없음'}</h3>
                    </div>
                `;
                card.addEventListener('click', () => showModal(article));
                newsGrid.appendChild(card);
            });
        })
        .catch(error => {
            newsGrid.innerHTML = '<p>기사를 불러오는 데 실패했습니다.</p>';
            console.error('Error loading articles:', error);
        });
});
