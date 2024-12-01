// /frontend/static/js/components/login.js
class LoginController {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('remember');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupOAuthHandlers();
        this.loadSavedCredentials();
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        try {
            const success = await authService.login({
                username,
                password,
                remember: this.rememberMeCheckbox.checked
            });

            if (success) {
                window.location.href = '/perfil';
            }
        } catch (error) {
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }
    }

    setupOAuthHandlers() {
        const govBrButton = document.querySelector('.oauth-govbr');
        const googleButton = document.querySelector('.oauth-google');

        govBrButton?.addEventListener('click', () => this.handleOAuthLogin('govbr'));
        googleButton?.addEventListener('click', () => this.handleOAuthLogin('google'));
    }

    async handleOAuthLogin(provider) {
        try {
            const authURL = await authService.getOAuthURL(provider);
            window.location.href = authURL;
        } catch (error) {
            alert(`Erro ao iniciar autenticação com ${provider}`);
        }
    }

    loadSavedCredentials() {
        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername) {
            this.usernameInput.value = savedUsername;
            this.rememberMeCheckbox.checked = true;
        }
    }
}

// Inicializar o controlador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new LoginController();
});