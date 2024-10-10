// script.js
function navigate(page) {
    const contentDiv = document.getElementById('container');
    contentDiv.innerHTML = '<p>Chargement du contenu...</p>';  // Message de chargement
    
    if (page === 'users') {
        // Charger les utilisateurs via l'API
        loadUsers();
    } else {
        // Charger dynamiquement les fichiers HTML (about.html, contact.html, etc.)
        fetch(`${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Page non trouvée');
                }
                return response.text();
            })
            .then(data => {
                contentDiv.innerHTML = data;
            })
            .catch(error => {
                contentDiv.innerHTML = '<p>Erreur lors du chargement de la page.</p>';
                console.error('Erreur:', error);
            });
    }
    if(this.event.currentTarget.classList){
        updateActiveNav(this.event.currentTarget);
    }
}

async function loadUsers() {
    const contentDiv = document.getElementById('container');
    contentDiv.innerHTML = '<p>Chargement des utilisateurs...</p>';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();

        let userList = '<h1>Liste des utilisateurs</h1>';
        users.forEach(user => {
            userList += `<p>${user.name} - ${user.email}</p>`;
        });
        contentDiv.innerHTML = userList;
    } catch (error) {
        contentDiv.innerHTML = '<p>Erreur lors du chargement des utilisateurs.</p>';
        console.error('Erreur:', error);
    }
}

// Charger la page en fonction du hash dans l'URL
window.addEventListener('load', function () {
    const hash = window.location.hash.substring(1) || 'home';

    // Trouve l'élément de navigation correspondant au hash
    const activeElement = document.querySelector(`.topnav a[href="#${hash}"]`);
    
    if (activeElement) {
        activeElement.classList.add('activeNav'); // Applique la classe active à l'élément correspondant
    }

    navigate(hash);
});

function updateActiveNav(activeItem) {
    document.querySelectorAll('.topnav > a').forEach(item => {
        item.classList.remove('activeNav');  // Retire la classe active de tous les liens
    });
    
    activeItem.classList.add('activeNav');  // Ajoute la classe active à l'élément cliqué
}


async function handleNavClick(event) {
    event.preventDefault();

    // Récupère l'élément ciblé et l'URL associée
    let target = event.target;
    let href = target.getAttribute('href');

    // Met à jour la classe active de la navigation
    updateActiveNav(target);

    // Chemin du fichier à charger
    let path = `${href}.html`;

    try {
        // Récupère le contenu HTML via fetch et l'insère dans le conteneur
        let response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Erreur lors du chargement de la page: ${response.statusText}`);
        }

        let content = await response.text();
        let container = document.getElementById('container');
        container.innerHTML = content;

        // Réinitialise les événements après le chargement du contenu
        initAccordion();

    } catch (error) {
        console.error(error);
        alert('Impossible de charger le contenu de la page. Veuillez réessayer plus tard.');
    }
}
