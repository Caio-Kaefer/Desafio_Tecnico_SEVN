document.addEventListener('DOMContentLoaded', () => {
    const gamesContainer = document.getElementById('games');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const pageInfo = document.getElementById('page-info');

    let currentPage = 0;
    let rounds = [];

    const apiUrl = 'https://sevn-pleno-esportes.deno.dev/';

    const teamGradients = {
        'time-a': ['#FF5733', '#FFBD33'],
        'time-b': ['#33FF57', '#33FFBD'],
        'time-c': ['#3357FF', '#33A1FF'],
        'time-d': ['#FF33A1', '#FF33D4'],
        'time-e': ['#A133FF', '#D433FF'],
        'time-f': ['#33FFA1', '#33FFD4'],
        'time-g': ['#FFA133', '#FFD433'],
        'time-h': ['#A1FF33', '#D4FF33']
    };

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
                    ${getShieldIcon(game.team_home_id)}
                    ${game.team_home_name}
                </div>
                <div class="score">${game.team_home_score}<div class="separator">X</div>${game.team_away_score}</div>
                <div class="team">
                    ${game.team_away_name}
                    ${getShieldIcon(game.team_away_id)}
                </div>
            `;

            gamesContainer.appendChild(gameElement);
        });
        pageInfo.textContent = `Rodada ${round.round}`;
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

    function getShieldIcon(teamId) {
        const gradientColors = teamGradients[teamId] || [getRandomColor(), getRandomColor()];
        const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" fill="url(#${gradientId})">
                <defs>
                    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${gradientColors[0]};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${gradientColors[1]};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M16 0C14.8835 1.49628 14.1602 4.31649 9.54496 5.01371C9.11253 5.07638 8.70368 5.10772 8.31056 5.10772C5.38575 5.10772 3.61671 3.51743 3.61671 3.51743L0 7.31688C0 7.31688 5.59803 9.10302 1.11646 25.1156C-1.91843 35.9577 14.5926 37.6028 16 40C17.3995 37.6028 33.9106 35.9577 30.8835 25.1156C26.4098 9.10302 32 7.31688 32 7.31688L28.3754 3.51743C28.3754 3.51743 26.6064 5.10772 23.6816 5.10772C23.2885 5.10772 22.8796 5.07638 22.4472 5.01371C17.8398 4.32432 17.1165 1.49628 15.9921 0L16 0Z"/>
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
