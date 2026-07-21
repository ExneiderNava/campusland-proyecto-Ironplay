// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');

    // Usuario por defecto (se crea si no existe)
    const DEFAULT_USER = {
        username: 'admin',
        password: '1234'
    };

    // Inyectar usuario ficticio en localStorage si no existe
    function seedDefaultUser() {
        const stored = localStorage.getItem('ironplay_user');
        if (!stored) {
            localStorage.setItem('ironplay_user', JSON.stringify(DEFAULT_USER));
        }
    }

    // Validar credenciales contra localStorage
    function validateCredentials(username, password) {
        const stored = localStorage.getItem('ironplay_user');
        if (!stored) return false;
        try {
            const user = JSON.parse(stored);
            return user.username === username && user.password === password;
        } catch (_) {
            return false;
        }
    }

    // Manejar el envío del formulario
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Limpiar mensaje de error previo
        errorEl.textContent = '';

        // Validaciones simples
        if (!username || !password) {
            errorEl.textContent = 'Por favor, completa todos los campos.';
            return;
        }

        if (validateCredentials(username, password)) {
            // Credenciales correctas → redirigir al dashboard (admin.html)
            window.location.href = 'admin.html';
        } else {
            errorEl.textContent = 'Usuario o contraseña incorrectos.';
            // Opcional: limpiar campos
            document.getElementById('password').value = '';
        }
    });

    // Enlace para crear/restablecer el usuario predeterminado (opcional)
    const createLink = document.getElementById('createDefaultUser');
    if (createLink) {
        createLink.addEventListener('click', (e) => {
            e.preventDefault();
            seedDefaultUser();
            errorEl.textContent = 'Usuario predeterminado creado (admin / 1234).';
            errorEl.style.color = '#4ade80'; // verde
            setTimeout(() => {
                errorEl.style.color = '';
                errorEl.textContent = '';
            }, 3000);
        });
    }

    // Semilla inicial al cargar la página
    seedDefaultUser();
});