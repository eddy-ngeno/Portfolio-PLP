// File to replace the database simulation in script.js
// This would connect to your actual backend API

// API endpoints
const API_URL = 'http://localhost:5000/api';

// Function to fetch projects from the API
function fetchProjects() {
    return fetch(`${API_URL}/projects`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

// Function to send a contact message to the API
function sendMessage(formData) {
    return fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}

// Update the loadProjects function to use the API
function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    
    if (!projectsContainer) return;
    
    // Display loading state
    projectsContainer.innerHTML = '<div class="project-loader">Loading projects...</div>';
    
    // Fetch projects from API
    fetchProjects()
        .then(projects => {
            // Clear loading message
            projectsContainer.innerHTML = '';
            
            if (projects.length === 0) {
                projectsContainer.innerHTML = '<div class="project-loader">No projects found.</div>';
                return;
            }
            
            // Create project cards
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}">
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${project.liveUrl}" class="project-link">Live Demo</a>
                            <a href="${project.codeUrl}" class="project-link">View Code</a>
                        </div>
                    </div>
                `;
                
                projectsContainer.appendChild(projectCard);
            });
            
            // Add animation to project cards
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        })
        .catch(error => {
            projectsContainer.innerHTML = `
                <div class="project-error">
                    <p>Failed to load projects. Please try again later.</p>
                    <button class="btn" onclick="loadProjects()">Retry</button>
                </div>
            `;
            console.error('Error loading projects:', error);
        });
}

// Update the contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Prepare data for API
            const formData = {
                name,
                email,
                message
            };
            
            // Send to API
            sendMessage(formData)
                .then(response => {
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                })
                .catch(error => {
                    showNotification('Failed to send message. Please try again.', 'error');
                    console.error('Error sending message:', error);
                });
        });
    }
});