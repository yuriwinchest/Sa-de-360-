// Função para alternar a expansão dos cards
function toggleCard(event, cardElement) {
    const clickedElement = event.target;

    // Verifica se o clique foi em um botão interno ou interativo
    if (
        clickedElement.classList.contains('action-button') ||
        clickedElement.closest('.action-button') ||
        clickedElement.tagName === 'SELECT' ||
        clickedElement.tagName === 'INPUT'
    ) {
        event.stopPropagation(); // Previne que o card feche ao interagir com esses elementos
        return;
    }

    const content = cardElement.querySelector('.card-content');
    const isActive = cardElement.classList.contains('active');

    // Fecha todos os outros cards
    document.querySelectorAll('.card').forEach((card) => {
        if (card !== cardElement && card.classList.contains('active')) {
            card.classList.remove('active');
            card.querySelector('.card-content').style.display = 'none';
        }
    });

    // Alterna o estado do card atual
    if (!isActive) {
        cardElement.classList.add('active');
        content.style.display = 'block'; // Mostra o conteúdo
    } else {
        cardElement.classList.remove('active');
        content.style.display = 'none'; // Oculta o conteúdo
    }
}

// Inicializa os eventos de clique
function initializeCards() {
    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', (event) => toggleCard(event, card));
    });
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', initializeCards);
