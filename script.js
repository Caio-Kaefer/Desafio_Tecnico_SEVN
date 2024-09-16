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
                <div class="team">${game.team_home_name}</div>
                <div class="score">${game.team_home_score} - ${game.team_away_score}</div>
                <div class="team">${game.team_away_name}</div>
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
});
