document.addEventListener('DOMContentLoaded', () => {
    const gamesContainer = document.getElementById('games');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const pageInfo = document.getElementById('page-info');

    let currentPage = 0;
    let rounds = [];

    const apiUrl = 'https://sevn-pleno-esportes.deno.dev/';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            rounds = data;
            displayRound(currentPage);
            updatePaginationControls();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function displayRound(page) {
        gamesContainer.innerHTML = '';
        const round = rounds[page];
        round.games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('game');
            gameElement.innerHTML = `
                <div class="team">
                ${getShieldIcon()}
                ${game.team_home_name}    
                
                </div>
                <div class="score">${game.team_home_score} - ${game.team_away_score}</div>
                <div class="team">
                    ${game.team_away_name}
                    ${getShieldIcon()}
                </div>
            `;

            gamesContainer.appendChild(gameElement);
        });
        pageInfo.textContent = `Round ${round.round}`;
    }

    function updatePaginationControls() {
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === rounds.length - 1;
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            displayRound(currentPage);
            updatePaginationControls();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < rounds.length - 1) {
            currentPage++;
            displayRound(currentPage);
            updatePaginationControls();
        }
    });

    function getShieldIcon() {
        const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#${gradientId})">
                <defs>
                    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${getRandomColor()};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${getRandomColor()};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M12 2L2 7v6c0 5.25 3.75 10 10 10s10-4.75 10-10V7L12 2z"/>
            </svg>
        `;
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
