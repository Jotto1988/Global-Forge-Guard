/**
 * FORGE-GUARD: GLOBAL FORENSIC SHIELD v2.5
 * Architected by Forge Vertical | Sovereign Industrial Tech
 * * Logic: Checks against a hardcoded Safe List + fetches a 
 * community-driven Blacklist from GitHub.
 */

// 1. DATA INITIALIZATION
const SAFE_LIST = [
    "fiverr.com", "google.com", "github.com", "linkedin.com", 
    "microsoft.com", "zoom.us", "slack.com", "wetransfer.com",
    "dropbox.com", "trello.com", "canva.com", "adobe.com"
];

let GLOBAL_BLACKLIST = [];

// 2. REMOTE THREAT SYNC
// Replace 'Jotto1988' with your actual GitHub username once the repo is live
const THREAT_DB_URL = 'https://raw.githubusercontent.com/Jotto1988/Global-Forge-Guard/main/threat-db.json';

async function syncThreats() {
    try {
        const response = await fetch(THREAT_DB_URL);
        if (response.ok) {
            const data = await response.json();
            GLOBAL_BLACKLIST = data.blacklisted_domains || [];
            console.log("Forge-Guard: Global Threat Database Synced Successfully.");
        }
    } catch (e) {
        console.warn("Forge-Guard: Threat Sync Failed. Running on Local Heuristics.");
    }
}

// 3. CORE AUDIT LOGIC
function auditIntegrity() {
    // Audit anchor tags (links)
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        try {
            const url = new URL(link.href);
            const domain = url.hostname.replace('www.', '');
            
            // Logic A: Check Global Blacklist (High Priority)
            if (GLOBAL_BLACKLIST.some(bad => domain.includes(bad))) {
                applyQuarantine(link, `KNOWN MALICIOUS DOMAIN: ${domain}`);
            } 
            // Logic B: Check Safe List (Low Priority / Global Auditor)
            else if (!SAFE_LIST.some(safe => domain.endsWith(safe))) {
                applyQuarantine(link, `UNVERIFIED DOMAIN: ${domain}`);
            }
        } catch (e) { /* Invalid URL */ }
    });

    // Audit plain text for suspicious domain strings
    const textNodes = document.querySelectorAll('p, span, div, li, .message-text, .msg-body');
    textNodes.forEach(node => {
        if (node.children.length === 0 && node.innerText.length > 5) {
            const text = node.innerText;
            
            // Check for the 'lnformation' lowercase L trick
            if (text.includes('lnform') || text.includes('lntell')) {
                applyQuarantine(node, "HOMOGRAPH ATTACK DETECTED (l vs I)");
            }

            // Check for blacklisted words in plain text
            GLOBAL_BLACKLIST.forEach(bad => {
                if (text.toLowerCase().includes(bad.toLowerCase())) {
                    applyQuarantine(node, "SUSPICIOUS THREAT SIGNATURE DETECTED");
                }
            });
        }
    });
}

// 4. VISUAL QUARANTINE UI
function applyQuarantine(element, reason) {
    // Navigate up to the nearest container for a cleaner UI look
    const container = element.closest('.message-box, .msg-body, .message-text, .db-message-body') || element;
    
    if (!container.dataset.flagged) {
        container.style.backgroundColor = "#2d0a0a"; // Dark Maroon
        container.style.border = "2px solid #ff0055";
        container.style.padding = "15px";
        container.style.borderRadius = "8px";
        container.style.margin = "10px 0";
        container.dataset.flagged = "true";

        const alertHeader = `
            <div style="color: #ff0055; font-weight: bold; font-family: 'Courier New', monospace; border-bottom: 1px solid #ff0055; margin-bottom: 8px; font-size: 12px; letter-spacing: 1px;">
                [!] FORGE-GUARD FORENSIC ALERT: ${reason}
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', alertHeader);
        
        // Safety switch for links
        if (container.tagName === 'A') {
            container.onclick = (e) => {
                if (!confirm(`WARNING: ${reason}\n\nThis source is not verified. Proceed at your own risk?`)) {
                    e.preventDefault();
                }
            };
        }
    }
}

// 5. INITIALIZATION PULSE
syncThreats(); // Initial Sync
setInterval(auditIntegrity, 1500); // Audit every 1.5s
setInterval(syncThreats, 3600000); // Re-sync with GitHub every hour
console.log("Forge-Guard Global Perimeter: ACTIVE");
