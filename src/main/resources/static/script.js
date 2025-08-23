
const gameListsElement = document.getElementById("game-lists");
const gamesElement = document.getElementById("games");
const gamesTitleElement = document.getElementById("games-title");
let activeListItem = null;

// Função para buscar e exibir as listas de games
async function fetchAndDisplayLists() {
  try {
    const response = await fetch(`/lists`);
    const lists = await response.json();
    gameListsElement.innerHTML = "";
    lists.forEach((list) => {
      const li = document.createElement("li");
      li.textContent = list.name;
      li.dataset.listId = list.id;
      li.addEventListener("click", () => {
        fetchAndDisplayGames(list.id, list.name);
        if (activeListItem) activeListItem.classList.remove("active");
        li.classList.add("active");
        activeListItem = li;
      });
      gameListsElement.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao buscar listas:", error);
    gameListsElement.innerHTML = "<li>Falha ao carregar listas.</li>";
  }
}

// Função para buscar e exibir os games de uma lista específica
async function fetchAndDisplayGames(listId, listName) {
  gamesTitleElement.textContent = `Games da lista: ${listName}`;
  gamesElement.innerHTML = "<p>Carregando...</p>";
  try {
    const response = await fetch(`/lists/${listId}/games`);
    const games = await response.json();
    gamesElement.innerHTML = "";
    if (games.length === 0) {
      gamesElement.innerHTML = "<p>Nenhum game nesta lista.</p>";
      return;
    }

    // Criar um elemento "games" que pode receber o drag and drop
    gamesElement.className = "games";
    games.forEach((game) => {
      const gameCard = document.createElement("div");
      gameCard.className = "game-card";
      gameCard.draggable = true;
      gameCard.dataset.gameId = game.id;

      gameCard.innerHTML = `
        <img src="${game.imgUrl}" alt="${game.title}">
        <h3>${game.title} (${game.year})</h3>
        <p>${game.shortDescription}</p>
      `;
      gamesElement.appendChild(gameCard);
    });

    // Adicionar a lógica de Drag and Drop
    let dragStartIndex;

    const gameCards = gamesElement.querySelectorAll(".game-card");
    gameCards.forEach((card, index) => {
      card.addEventListener("dragstart", () => {
        dragStartIndex = index;
      });

      card.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      card.addEventListener("drop", async (e) => {
        const dropEndIndex = index;
        const sourceIndex = dragStartIndex;
        const destinationIndex = dropEndIndex;

        if (sourceIndex !== destinationIndex) {
          try {
            const moveResponse = await fetch(`${BASE_URL}/lists/${listId}/replacement`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sourceIndex: sourceIndex,
                destinationIndex: destinationIndex,
              }),
            });

            if (moveResponse.ok) {
              fetchAndDisplayGames(listId, listName);
            } else {
              console.error("Erro ao mover o game:", moveResponse.statusText);
            }
          } catch (error) {
            console.error("Falha na requisição de mover o game:", error);
          }
        }
      });
    });
  } catch (error) {
    console.error("Erro ao buscar games:", error);
    gamesElement.innerHTML = "<p>Falha ao carregar os games.</p>";
  }
}

// Inicia o processo quando a página é completamente carregada
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayLists();
});