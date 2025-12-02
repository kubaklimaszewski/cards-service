async function isLogged() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    fetch ('http://localhost:3000/api/auth/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async (res) => {
        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
            return;
        }
            return res.json();
    })
    .then(data => {
        localStorage.setItem('user', JSON.stringify(data.user))    })
    .catch(err => {
        console.error(err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';  
    })

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    })
};