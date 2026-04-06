let GLOBAL_BLACKLIST = [];

// Fetch the latest community-driven threat list from your GitHub
async function updateThreatDatabase() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Jotto1988/Global-Forge-Guard/main/threat-db.json');
        const data = await response.json();
        GLOBAL_BLACKLIST = data.blacklisted_domains;
        console.log("Forge-Guard: Global Threat Database Synced.");
    } catch (e) {
        console.error("Forge-Guard: Offline mode active.");
    }
}

updateThreatDatabase();
