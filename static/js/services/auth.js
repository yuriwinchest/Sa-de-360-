// /frontend/static/js/services/auth.js
const authService = {
    user: null,

    async init() {
        // Verificar se há um usuário na sessão
        const userData = localStorage.getItem('user');
        if (userData) {
            this.user = JSON.parse(userData);
            return true;
        }
        return false;
    },

    async login(credentials) {
        // Simular login para o protótipo
        const mockUser = {
            id: '123',
            name: 'Maria Raimunda',
            cns: '123.4567.8901.2345',
            photo_url: '/static/assets/images/profile.jpg'
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        this.user = mockUser;
        return true;
    },

    async logout() {
        localStorage.removeItem('user');
        this.user = null;
        window.location.href = '/login';
    }
};

// Inicializar o serviço de autenticação
document.addEventListener('DOMContentLoaded', () => {
    authService.init();
});