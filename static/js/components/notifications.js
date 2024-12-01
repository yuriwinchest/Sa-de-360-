// Sistema de Notificações
function showNotification(title, message, type = 'info') {
    const notificationContainer = document.getElementById('notification-system');

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <strong>${title}</strong>
        <p>${message}</p>
        <button class="close-notification">×</button>
    `;

    notificationContainer.appendChild(notification);

    // Remove após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);

    // Botão para fechar manualmente
    notification.querySelector('.close-notification').onclick = () => {
        notification.remove();
    };
}
