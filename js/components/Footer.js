export function renderFooter() {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    
    const now = new Date();
    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-info">
                <h3>Kino SPA</h3>
                <p>Modern Cinema Solutions</p>
            </div>
            <div class="footer-links">
                <a href="#/">Home</a>
                <a href="#/admin">Admin</a>
            </div>
            <div class="footer-copyright">
                <p>&copy; ${now.getFullYear()} Kino SPA - School Project</p>
            </div>
        </div>
    `;
    
    return footer;
}
