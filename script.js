// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile view
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle navigation
        nav.classList.toggle('nav-active');
        
        // Animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger animation
        burger.classList.toggle('toggle');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for header height
                behavior: 'smooth'
            });
            
            // Close mobile menu if it's open
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });
    
    // Form submission handling
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
            
            // In a real application, you would send this data to your server
            // For this demo, we'll simulate a server response
            const formData = {
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            };
            
            // Simulate sending to database
            saveToDatabase('messages', formData)
                .then(response => {
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                })
                .catch(error => {
                    showNotification('Failed to send message. Please try again.', 'error');
                });
        });
    }
    
    // Load projects from database
    loadProjects();
    
    // Resume download button
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Resume download started!', 'success');
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Database simulation
const db = {
    projects: [
        {
            id: 1,
            title: 'E-commerce Website',
            description: 'A fully responsive e-commerce platform with shopping cart functionality',
            image: '/api/placeholder/600/400',
            tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
            liveUrl: '#',
            codeUrl: '#'
        },
        {
            id: 2,
            title: 'Weather App',
            description: 'Real-time weather application using OpenWeather API',
            image: '/api/placeholder/600/400',
            tags: ['JavaScript', 'API', 'CSS'],
            liveUrl: '#',
            codeUrl: '#'
        },
        {
            id: 3,
            title: 'Task Manager',
            description: 'A productivity application for managing daily tasks with drag-and-drop UI',
            image: '/api/placeholder/600/400',
            tags: ['React', 'MongoDB', 'Express'],
            liveUrl: '#',
            codeUrl: '#'
        }
    ],
    messages: []
};

// Function to simulate loading data from database
function getFromDatabase(collection) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            if (db[collection]) {
                resolve(db[collection]);
            } else {
                reject(new Error(`Collection ${collection} not found`));
            }
        }, 800);
    });
}

// Function to simulate saving data to database
function saveToDatabase(collection, data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            if (db[collection]) {
                db[collection].push(data);
                resolve({ success: true, id: Date.now() });
            } else {
                reject(new Error(`Collection ${collection} not found`));
            }
        }, 1200);
    });
}

// Function to load projects from database
function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    
    if (!projectsContainer) return;
    
    // Display loading state
    projectsContainer.innerHTML = '<div class="project-loader">Loading projects...</div>';
    
    // Fetch projects
    getFromDatabase('projects')
        .then(projects => {
            // Clear loading message
            projectsContainer.innerHTML = '';
            
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

// Add scroll animations
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('active');
        }
    });
});

// Add CSS for notifications and animations
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        background-color: #333;
        color: white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1001;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        background-color: #28a745;
    }
    
    .notification.error {
        background-color: #dc3545;
    }
    
    .notification.info {
        background-color: #17a2b8;
    }
    
    .project-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    section {
        opacity: 0.8;
        transform: translateY(20px);
        transition: all 0.8s ease;
    }
    
    section.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

// Theme switcher
const themeColors = {
    blue: {
        primary: '#4d5cfe',
        secondary: '#2d3fe0',
        dark: '#1a2033'
    },
    green: {
        primary: '#28a745',
        secondary: '#218838',
        dark: '#1e2b22'
    },
    purple: {
        primary: '#6f42c1',
        secondary: '#5e37a6',
        dark: '#2a1f33'
    }
};

// Initialize theme from localStorage or default
function initTheme() {
    const savedTheme = localStorage.getItem('portfolioTheme') || 'blue';
    setTheme(savedTheme);
}

function setTheme(theme) {
    const colors = themeColors[theme];
    if (!colors) return;
    
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--dark-color', colors.dark);
    
    localStorage.setItem('portfolioTheme', theme);
}

// Call initTheme when the script loads
initTheme();