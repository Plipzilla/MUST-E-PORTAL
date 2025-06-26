// Authentication and navigation system
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    
    // Function to update navigation and auth buttons
    function updateAuthState(isLoggedIn) {
        // Update auth-only navigation items
        const authOnlyItems = document.querySelectorAll('nav li.auth-only');
        authOnlyItems.forEach(item => {
            if (isLoggedIn) {
                item.classList.add('logged-in');
            } else {
                item.classList.remove('logged-in');
            }
        });
        
        // Update auth buttons
        if (isLoggedIn) {
            if (loginBtn) {
                loginBtn.style.visibility = 'hidden';
                loginBtn.style.opacity = '0';
                loginBtn.style.pointerEvents = 'none';
            }
            if (signupBtn) {
                signupBtn.style.visibility = 'hidden';
                signupBtn.style.opacity = '0';
                signupBtn.style.pointerEvents = 'none';
            }
            if (logoutBtn) {
                logoutBtn.style.visibility = 'visible';
                logoutBtn.style.opacity = '1';
                logoutBtn.style.pointerEvents = 'auto';
            }
        } else {
            if (logoutBtn) {
                logoutBtn.style.visibility = 'hidden';
                logoutBtn.style.opacity = '0';
                logoutBtn.style.pointerEvents = 'none';
            }
            if (loginBtn) {
                loginBtn.style.visibility = 'visible';
                loginBtn.style.opacity = '1';
                loginBtn.style.pointerEvents = 'auto';
            }
            if (signupBtn) {
                signupBtn.style.visibility = 'visible';
                signupBtn.style.opacity = '1';
                signupBtn.style.pointerEvents = 'auto';
            }
        }
        updateDashboardNavState(isLoggedIn);
    }
    
    // Initialize navigation and button states immediately
    if (currentUser) {
        updateAuthState(true);
        
        // Update user name in dashboard
        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = currentUser.name;
        }
        
        // Load user's applications
        loadUserApplications();
        
        // Check for drafts
        checkForDrafts();
        
        injectDashboardSidebar(currentUser);
    } else {
        updateAuthState(false);
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                // Simulate login success
                const user = {
                    name: email.split('@')[0],
                    email: email
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Update buttons immediately
                updateAuthState(true);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Please enter both email and password');
            }
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (name && email && password) {
                // Simulate signup success
                const user = {
                    name: name,
                    email: email
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Update buttons immediately
                updateAuthState(true);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! Our team will contact you shortly.');
            contactForm.reset();
        });
    }
    
    // New application button
    const newAppBtn = document.getElementById('new-application-btn');
    if (newAppBtn) {
        newAppBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to application form page instead of opening modal
            window.location.href = 'application.html';
        });
    }
    
    // Continue draft button
    const continueDraftBtn = document.getElementById('continue-draft-btn');
    if (continueDraftBtn) {
        continueDraftBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'application.html?loadDraft=true';
        });
    }
    
    // Application Form Page Functionality
    const applicationForm = document.getElementById('application-form');
    if (applicationForm && window.location.pathname.includes('application.html')) {
        initializeApplicationForm();
    }
    
    function initializeApplicationForm() {
        const formSections = document.querySelectorAll('.form-section');
        const progressBar = document.getElementById('form-progress');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');
        const saveDraftBtn = document.getElementById('save-draft');
        const statementPurpose = document.getElementById('statement-purpose');
        const wordCount = document.getElementById('word-count');
        
        let currentSection = 1;
        const totalSections = formSections.length;
        
        // Initialize form
        showSection(currentSection);
        updateProgress();
        
        // Check if we should load draft
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('loadDraft') === 'true') {
            loadApplicationDraft();
        }
        
        // Pre-fill email if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && document.getElementById('email')) {
            document.getElementById('email').value = currentUser.email;
        }
        
        // Auto-calculate age from date of birth
        const dateOfBirth = document.getElementById('date-of-birth');
        const ageField = document.getElementById('age');
        if (dateOfBirth && ageField) {
            dateOfBirth.addEventListener('change', function() {
                const birthDate = new Date(this.value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    ageField.value = age - 1;
                } else {
                    ageField.value = age;
                }
            });
        }
        
        // Word count for statement of purpose
        if (statementPurpose && wordCount) {
            statementPurpose.addEventListener('input', function() {
                const words = this.value.trim().split(/\s+/).filter(word => word.length > 0);
                wordCount.textContent = words.length;
                
                if (words.length < 500) {
                    wordCount.style.color = '#dc3545';
                } else {
                    wordCount.style.color = '#0056b3';
                }
            });
        }
        
        // Next button functionality
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (validateCurrentSection()) {
                    if (currentSection < totalSections) {
                        currentSection++;
                        showSection(currentSection);
                        updateProgress();
                        updateNavigationButtons();
                    }
                }
            });
        }
        
        // Previous button functionality
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentSection > 1) {
                    currentSection--;
                    showSection(currentSection);
                    updateProgress();
                    updateNavigationButtons();
                }
            });
        }
        
        // Save draft functionality
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', function(e) {
                e.preventDefault();
                saveApplicationDraft();
            });
        }
        
        // Form submission
        if (applicationForm) {
            applicationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                submitApplication();
            });
        }
        
        function showSection(sectionNumber) {
            formSections.forEach((section, index) => {
                if (index + 1 === sectionNumber) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        }
        
        function updateProgress() {
            if (progressBar) {
                const progress = (currentSection / totalSections) * 100;
                progressBar.style.width = progress + '%';
            }
        }
        
        function updateNavigationButtons() {
            if (prevBtn) {
                prevBtn.style.display = currentSection > 1 ? 'inline-flex' : 'none';
            }
            
            if (nextBtn && submitBtn) {
                if (currentSection === totalSections) {
                    nextBtn.style.display = 'none';
                    submitBtn.style.display = 'inline-flex';
                } else {
                    nextBtn.style.display = 'inline-flex';
                    submitBtn.style.display = 'none';
                }
            }
        }
        
        function validateCurrentSection() {
            const currentSectionElement = document.querySelector(`[data-section="${currentSection}"]`);
            const requiredFields = currentSectionElement.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e1e5e9';
                }
            });
            
            // Special validation for statement of purpose
            if (currentSection === 7 && statementPurpose) {
                const words = statementPurpose.value.trim().split(/\s+/).filter(word => word.length > 0);
                if (words.length < 500) {
                    alert('Statement of Purpose must be at least 500 words.');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                alert('Please fill in all required fields in this section.');
            }
            
            return isValid;
        }
        
        function saveApplicationDraft() {
            const formData = new FormData(applicationForm);
            const draftData = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                draftData[key] = value;
            }
            
            // Add current section to draft
            draftData.currentSection = currentSection;
            
            // Save to localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                const userDrafts = JSON.parse(localStorage.getItem('userDrafts') || '{}');
                userDrafts[currentUser.email] = draftData;
                localStorage.setItem('userDrafts', JSON.stringify(userDrafts));
                
                alert('Application draft saved successfully!');
            } else {
                alert('Please log in to save drafts.');
            }
        }
        
        function submitApplication() {
            // Validate all sections
            let allValid = true;
            for (let i = 1; i <= totalSections; i++) {
                const sectionElement = document.querySelector(`[data-section="${i}"]`);
                const requiredFields = sectionElement.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = '#dc3545';
                        allValid = false;
                    }
                });
            }
            
            if (!allValid) {
                alert('Please fill in all required fields before submitting.');
                return;
            }
            
            // Show loading state
            applicationForm.classList.add('form-loading');
            
            // Simulate form submission
            setTimeout(() => {
                const formData = new FormData(applicationForm);
                const applicationData = {};
                
                // Convert FormData to object
                for (let [key, value] of formData.entries()) {
                    applicationData[key] = value;
                }
                
                // Generate application ID
                const applicationId = 'MUST-APP-' + new Date().getFullYear() + '-' + 
                                    String(Math.floor(Math.random() * 1000)).padStart(3, '0');
                
                // Save application to localStorage
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) {
                    const userApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
                    const newApplication = {
                        id: applicationId,
                        ...applicationData,
                        status: 'pending',
                        submittedDate: new Date().toISOString(),
                        lastUpdated: new Date().toISOString()
                    };
                    userApplications.push(newApplication);
                    localStorage.setItem('userApplications', JSON.stringify(userApplications));
                    
                    // Remove loading state
                    applicationForm.classList.remove('form-loading');
                    
                    // Show success message
                    alert(`Application submitted successfully!\nApplication ID: ${applicationId}\n\nYou will receive a confirmation email shortly.`);
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Please log in to submit an application.');
                    applicationForm.classList.remove('form-loading');
                }
            }, 2000);
        }
        
        function loadApplicationDraft() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                const userDrafts = JSON.parse(localStorage.getItem('userDrafts') || '{}');
                const draft = userDrafts[currentUser.email];
                
                if (draft) {
                    // Pre-fill form fields
                    Object.keys(draft).forEach(key => {
                        if (key !== 'currentSection') {
                            const field = document.getElementById(key);
                            if (field) {
                                field.value = draft[key];
                            }
                        }
                    });
                    
                    // Go to the section where user left off
                    if (draft.currentSection) {
                        currentSection = draft.currentSection;
                        showSection(currentSection);
                        updateProgress();
                        updateNavigationButtons();
                    }
                    
                    alert('Draft loaded successfully!');
                }
            }
        }
    }
    
    // Check for existing drafts and show continue draft button
    function checkForDrafts() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const userDrafts = JSON.parse(localStorage.getItem('userDrafts') || '{}');
            const hasDraft = userDrafts[currentUser.email];
            
            if (hasDraft && continueDraftBtn) {
                continueDraftBtn.style.display = 'inline-flex';
            }
        }
    }
    
    // Load user's applications
    function loadUserApplications() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const userApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
            const applicationCount = userApplications.length;
            
            // Update statistics
            updateApplicationStats(userApplications);
            
            // Display applications
            displayApplications(userApplications);
        }
    }
    
    function updateApplicationStats(applications) {
        const stats = {
            total: applications.length,
            accepted: applications.filter(app => app.status === 'accepted').length,
            review: applications.filter(app => app.status === 'review').length,
            pending: applications.filter(app => app.status === 'pending').length
        };
        
        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card h3');
        if (statCards.length >= 4) {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.accepted;
            statCards[2].textContent = stats.review;
            statCards[3].textContent = stats.pending;
        }
    }
    
    function displayApplications(applications) {
        const applicationsContainer = document.querySelector('.dashboard-section:first-of-type');
        if (!applicationsContainer) return;
        
        // Find the applications area (after the section header)
        const existingCards = applicationsContainer.querySelectorAll('.application-card');
        existingCards.forEach(card => card.remove());
        
        if (applications.length === 0) {
            // Show empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-file-alt" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No Applications Yet</h3>
                    <p>You haven't submitted any applications yet. Click "New Application" to get started!</p>
                </div>
            `;
            applicationsContainer.appendChild(emptyState);
        } else {
            // Display each application
            applications.forEach(app => {
                const appCard = createApplicationCard(app);
                applicationsContainer.appendChild(appCard);
            });
        }
    }
    
    function createApplicationCard(application) {
        const card = document.createElement('div');
        card.className = 'application-card';
        
        const statusClass = application.status === 'accepted' ? 'accepted' : 
                           application.status === 'review' ? 'review' : 'pending';
        
        const statusText = application.status === 'accepted' ? 'Accepted' :
                          application.status === 'review' ? 'In Review' : 'Pending';
        
        const submittedDate = new Date(application['app-submitted-date'] || application.submittedDate).toLocaleDateString();
        
        card.innerHTML = `
            <div class="app-header">
                <div class="app-title">${application['app-degree'] || 'Application'}</div>
                <div class="app-status ${statusClass}">${statusText}</div>
            </div>
            <p>${application['app-faculty'] || 'Faculty'}</p>
            <div class="app-details">
                <div class="detail-item">
                    <p>Application ID</p>
                    <h4>${application.id}</h4>
                </div>
                <div class="detail-item">
                    <p>Submitted Date</p>
                    <h4>${submittedDate}</h4>
                </div>
                <div class="detail-item">
                    <p>Program Type</p>
                    <h4>${application['app-program'] || 'N/A'}</h4>
                </div>
            </div>
            <div class="app-actions">
                ${application.status === 'accepted' ? 
                    '<button class="btn-action"><i class="fas fa-download"></i> Offer Letter</button>' : 
                    '<button class="btn-action"><i class="fas fa-eye"></i> View Details</button>'
                }
                <button class="btn-action"><i class="fas fa-print"></i> Print</button>
            </div>
        `;
        
        return card;
    }
    
    // Simple animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animElements = document.querySelectorAll('.feature-card, .step-card, .program-card, .testimonial, .stat-card, .application-card');
    animElements.forEach(el => {
        observer.observe(el);
    });
    
    setupSocialAuth();

    // Make Dashboard nav link gray and unclickable if not logged in
    function updateDashboardNavState(isLoggedIn) {
        const dashboardNav = document.querySelector('nav li.auth-only a[href="dashboard.html"]');
        if (dashboardNav) {
            if (!isLoggedIn) {
                dashboardNav.classList.add('disabled-dashboard');
                dashboardNav.setAttribute('tabindex', '-1');
                dashboardNav.setAttribute('aria-disabled', 'true');
            } else {
                dashboardNav.classList.remove('disabled-dashboard');
                dashboardNav.removeAttribute('tabindex');
                dashboardNav.removeAttribute('aria-disabled');
            }
        }
    }

    // Add click handler to dashboard nav link to redirect to login if not logged in
    function setupDashboardNavHandler() {
        const dashboardNav = document.querySelector('nav li.auth-only a[href="dashboard.html"]');
        if (dashboardNav) {
            dashboardNav.addEventListener('click', function(e) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (!currentUser) {
                    e.preventDefault();
                    window.location.href = 'login.html';
                }
            });
        }
    }

    // Call these functions on DOMContentLoaded
    updateDashboardNavState(!!currentUser);
    setupDashboardNavHandler();
});

// --- Persistent Dashboard Sidebar ---
function injectDashboardSidebar(user) {
    if (document.getElementById('dashboard-sidebar')) return;
    
    // Use Facebook profile picture if available, otherwise generate avatar
    const profileImage = user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=ff9800&color=fff`;
    
    const sidebar = document.createElement('div');
    sidebar.className = 'dashboard-sidebar';
    sidebar.id = 'dashboard-sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <h3>MUST Dashboard</h3>
        </div>
        <div class="sidebar-user">
            <img src="${profileImage}" alt="User">
            <h4>${user.name || 'User'}</h4>
            <p>${user.email}</p>
            ${user.provider ? `<small>Signed in with ${user.provider}</small>` : ''}
        </div>
        <nav class="sidebar-nav">
            <ul>
                <li><a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="application.html"><i class="fas fa-file-alt"></i> Application</a></li>
                <li><a href="index.html"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="contact.html"><i class="fas fa-envelope"></i> Contact</a></li>
                <li><a href="#" id="sidebar-logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </nav>
    `;
    document.body.appendChild(sidebar);
    setTimeout(() => sidebar.classList.add('active'), 10);
    document.body.classList.add('sidebar-open');
    
    // Logout from sidebar
    sidebar.querySelector('#sidebar-logout').onclick = function(e) {
        e.preventDefault();
        // Logout from Facebook if user signed in with Facebook
        if (user.provider === 'facebook' && typeof FB !== 'undefined') {
            FB.logout(function(response) {
                console.log('Facebook logout:', response);
            });
        }
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };
}

// --- Facebook Authentication ---
function initializeFacebookSDK() {
    window.fbAsyncInit = function() {
        FB.init({
            appId: '123456789012345', // Replace with your actual Facebook App ID
            cookie: true,
            xfbml: true,
            version: 'v19.0'
        });
        
        // Check login status on page load
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    };
}

function statusChangeCallback(response) {
    console.log('Facebook login status:', response);
    if (response.status === 'connected') {
        // User is logged in and has authorized your app
        getUserInfo();
    }
}

function getUserInfo() {
    FB.api('/me', {fields: 'name,email,picture'}, function(response) {
        console.log('Facebook user info:', response);
        if (response.name && response.email) {
            const user = {
                name: response.name,
                email: response.email,
                picture: response.picture?.data?.url,
                provider: 'facebook'
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        }
    });
}

function loginWithFacebook() {
    FB.login(function(response) {
        console.log('Facebook login response:', response);
        if (response.authResponse) {
            // User successfully logged in
            getUserInfo();
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'email,public_profile'});
}

// --- Social Auth Setup ---
function setupSocialAuth() {
    // Initialize Facebook SDK
    initializeFacebookSDK();
    
    // Setup Facebook login buttons
    const facebookContainers = document.querySelectorAll('#facebook-login-container');
    facebookContainers.forEach(container => {
        container.onclick = function(e) {
            e.preventDefault();
            loginWithFacebook();
        };
    });
    
    // Setup Google login (simulated for now)
    const googleBtns = document.querySelectorAll('.social-btn.google');
    googleBtns.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            // Simulate Google login (replace with real Google OAuth later)
            const user = { 
                name: 'Google User', 
                email: 'googleuser@example.com',
                provider: 'google'
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        };
    });
}