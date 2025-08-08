
document.addEventListener('DOMContentLoaded', () => {
    let articles = [];
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-button');

    // 데이터 로드
    fetch('articles.json')
        .then(response => response.json())
        .then(data => {
            articles = data;
        })
        .catch(error => console.error('Error loading articles:', error));

    // 뉴스 카드에 이벤트 리스너 추가
    document.getElementById('news-grid').addEventListener('click', (event) => {
        const card = event.target.closest('.news-card');
        if (!card) return;

        const articleIndex = card.dataset.index;
        const article = articles[articleIndex];

        if (article) {
            document.getElementById('modal-source').textContent = article.source;
            document.getElementById('modal-source').className = `modal-source card-source ${get_source_class_js(article.source)}`;
            document.getElementById('modal-title').textContent = article.title;
            document.getElementById('modal-date').textContent = format_date_js(article.created_at);
            document.getElementById('modal-content-text').innerHTML = article.content.replace(/
/g, '<br>');
            document.getElementById('modal-original-link').href = article.link;
            modal.style.display = 'block';
        }
    });

    // 모달 닫기
    closeModalBtn.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    // JS 헬퍼 함수
    function get_source_class_js(source) {
        if (!source) return 'source-default';
        if (source.includes('농림축산식품부')) return 'source-mafra';
        if (source.includes('농촌진흥청')) return 'source-rnd';
        if (source.includes('농민신문')) return 'source-nongmin';
        if (source.includes('한국농어민신문')) return 'source-agrinet';
        if (source.includes('농정신문')) return 'source-nongjung';
        return 'source-default';
    }

    function format_date_js(dateStr) {
        if (!dateStr) return '날짜 없음';
        try {
            const dt = new Date(dateStr);
            return `${dt.getFullYear()}년 ${String(dt.getMonth() + 1).padStart(2, '0')}월 ${String(dt.getDate()).padStart(2, '0')}일 ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
        } catch (e) {
            return dateStr;
        }
    }
});
