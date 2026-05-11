// ── 3. GOOGLE LOGIN INTEGRATION ───────────────────────────────────────────────

// Decode the JWT token Google sends back
function decodeJwtResponse(token) {
    let base64Url = token.split('.');
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Handle the response after user successfully logs in with Google
function handleGoogleLogin(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    const googleEmail = responsePayload.email;
    const googleName = responsePayload.name;
    const googleId = responsePayload.sub; 

    let users = getUsers();
    let user = users.find(u => u.email === googleEmail);

    // If user doesn't exist in our localStorage, create them
    if (!user) {
        user = {
            name: googleName,
            email: googleEmail,
            username: googleEmail.split('@'),
            password: googleId,
            role: "user",
            authMethod: "google"
        };
        users.push(user);
        saveUsers(users);
    }

    // Log the user in
    setLoggedInUser(user);
    document.getElementById("loginToggle").checked = false;
    document.getElementById("registerToggle").checked = false;
    updateAccountBanner();
    updateButtons();
    alert("Welcome " + user.name + "!");
}

// Initialize Google Buttons when the window loads
window.addEventListener("load", () => {
    if (window.google?.accounts?.id) {
        google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com",
            callback: handleGoogleLogin
        });

        const loginContainer = document.getElementById("googleLoginBtnContainer");
        if(loginContainer) {
            google.accounts.id.renderButton(
                loginContainer,
                { theme: "outline", size: "large", width: "100%", shape: "rectangular" }
            );
        }

        const registerContainer = document.getElementById("googleRegisterBtnContainer");
        if(registerContainer) {
            google.accounts.id.renderButton(
                registerContainer,
                { theme: "outline", size: "large", width: "100%", shape: "rectangular", text: "signup_with" }
            );
        }
    }
});

(function seedAccounts(){
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if(!users.find(u => u.username === "ajpolles456")){
        users.push({
            name: "Guest User",
            email: "guest@google.con",
            username: "ajpolles456",
            password: "123456789",
            role: "guest"
        });
    }

    if(!users.find(u => u.username === "admin")){
        users.push({
            name: "Administrator",
            email: "admin@google.con",
            username: "admin",
            password: "admin123",
            role: "admin"
        });
    }

    localStorage.setItem("users", JSON.stringify(users));
})();

function getUsers(){return JSON.parse(localStorage.getItem("users")) || [];} 
function saveUsers(users){localStorage.setItem("users", JSON.stringify(users));}
function getLoggedInUser(){return JSON.parse(localStorage.getItem("loggedInUser") || "null");}
function setLoggedInUser(user){localStorage.setItem("loggedInUser", JSON.stringify(user));}
function logout(){
    localStorage.removeItem("loggedInUser");
    updateAccountBanner();
    updateButtons();
    alert("Logged out.");
}
function toggleAccountMenu(){
    const menu = document.getElementById("accountMenu");
    if(menu){
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
}
function updateAccountBanner(){
    const current = getLoggedInUser();
    const users = getUsers();
    const nav = document.getElementById("navAccount");
    if(!nav) return;

    if(current){
        nav.innerHTML = `
            <button id="accountBtn" onclick="toggleAccountMenu()" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);color:#fff;padding:10px 14px;border-radius:999px;cursor:pointer;">${current.username} ▾</button>
            <div id="accountMenu" style="display:none;position:absolute;right:0;top:54px;min-width:220px;padding:12px 14px;background:rgba(8,15,23,0.96);border:1px solid rgba(255,255,255,0.1);border-radius:14px;box-shadow:0 18px 40px rgba(0,0,0,0.35);z-index:12;">
                <div style="margin-bottom:10px;font-size:0.9rem;color:#cbd5e1;">Logged in as <strong>${current.username}</strong></div>
                <div style="margin-bottom:10px;font-size:0.82rem;color:#94a3b8;">Total accounts: ${users.length}</div>
                <button onclick="logout()" style="width:100%;padding:10px;border:none;border-radius:10px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer;">Logout</button>
            </div>
        `;
    } else {
        nav.innerHTML = `<button onclick="document.getElementById('loginToggle').checked=true" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);color:#fff;padding:10px 14px;border-radius:999px;cursor:pointer;">Login</button>`;
    }
}
function updateButtons(){
    const user = getLoggedInUser();
    const startBtn = document.getElementById("startBtn");
    const ctaBtn   = document.getElementById("ctaBtn");

    if(user){
        startBtn.textContent = `Continue as ${user.username}`;
        startBtn.onclick = () => {
            document.getElementById("topics").scrollIntoView({behavior:"smooth"});
        };

        ctaBtn.textContent = "You're Logged In";
        ctaBtn.onclick = () => { alert("You are already logged in."); };
    } else {
        startBtn.textContent = "Start Playing Now";
        startBtn.onclick = () => { document.getElementById("loginToggle").checked = true; };

        ctaBtn.textContent = "Create Free Account";
        ctaBtn.onclick = () => { document.getElementById("registerToggle").checked = true; };
    }
}
function handleStart(){ updateButtons(); }
function handleCTA(){ updateButtons(); }
function requireLogin(event, url){
    const user = localStorage.getItem("loggedInUser");
    if(!user){
        event.preventDefault();
        document.getElementById("loginToggle").checked = true;
    }
}
function togglePassword(id, el){
    const input = document.getElementById(id);
    if(input.type === "password"){
        input.type = "text";
        el.textContent = "🙈";
    } else {
        input.type = "password";
        el.textContent = "👁️";
    }
}
function switchToLogin(){
    document.getElementById("registerToggle").checked = false;
    document.getElementById("loginToggle").checked = true;
}
function switchToRegister(){
    document.getElementById("loginToggle").checked = false;
    document.getElementById("registerToggle").checked = true;
}

document.getElementById("registrationForm")?.addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirm  = document.getElementById("confirmPassword").value;
    const error    = document.getElementById("registerError");

    if(!email || !username || !password){
        error.textContent = "All fields are required.";
        return;
    }
    if(password !== confirm){
        error.textContent = "Passwords do not match!";
        return;
    }
    if(username === "admin" || username === "ajpolles456"){
        error.textContent = "That username is reserved.";
        return;
    }

    let users = getUsers();
    if(users.find(u => u.username === username || u.email === email)){
        error.textContent = "Username or email already exists!";
        return;
    }

    const newUser = {name: username, email, username, password, role: "user", authMethod: "local"};
    users.push(newUser);
    saveUsers(users);
    setLoggedInUser(newUser);
    alert("Account created and logged in!");
    error.textContent = "";
    document.getElementById("registerToggle").checked = false;
    updateAccountBanner();
    updateButtons();
});

document.getElementById("loginForm")?.addEventListener("submit", function(e){
    e.preventDefault();
    const userInput = document.getElementById("loginUser").value;
    const password  = document.getElementById("loginPassword").value;
    const error     = document.getElementById("loginError");

    let users = getUsers();
    const user = users.find(u =>
        (u.username === userInput || u.email === userInput) &&
        u.password === password
    );

    if(!user){
        error.textContent = "Invalid credentials!";
        return;
    }

    setLoggedInUser(user);
    error.textContent = "";
    document.getElementById("loginToggle").checked = false;
    updateAccountBanner();
    updateButtons();

    if(user.role === "admin"){
        window.location.href = "../admin/admin page/admin.html";
        return;
    }

    alert("Welcome " + user.username + "!");
});

updateAccountBanner();
updateButtons();

function getGameStatus(){
    return JSON.parse(localStorage.getItem("gameStatuses")) || {};
}

function renderGames(){
    const games = getGameDefs();
    const status = getGameStatus();
    const grid = document.getElementById("gamesGrid");

    if(!grid) return;

    grid.innerHTML = games.map(g => {
        const enabled = status[g.id] !== false;
        if(!enabled) return "";

        const safeURL = g.url ? g.url : "../GamePages/cgame.html";

        return `
        <div class="game-card">
            <a href="${safeURL}" onclick="requireLogin(event, '${safeURL}')">
                <h3>${g.title}</h3>
                <p>${g.desc}</p>
                <span class="difficulty difficulty-${g.difficulty}">
                    ${g.difficulty}
                </span>
            </a>
        </div>`;
    }).join("");
}

setInterval(() => { renderGames(); }, 2000);

window.addEventListener("storage", (event) => {
    if(event.key === "gameStatuses" || event.key === "customGames") {
        renderGames();
    }
});

renderGames();
