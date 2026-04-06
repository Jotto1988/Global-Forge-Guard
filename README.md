# 🛡️ Global Forge-Guard
**Industrial-grade phishing defense for the freelance economy.**

Global Forge-Guard is an open-source browser extension designed to audit links in real-time across Fiverr, LinkedIn, and social media. It uses a community-driven threat database to quarantine malicious domains before you click.

## 🚀 How it Works
The extension uses a **Safe-List Logic**:
1. It verifies if a link belongs to a trusted platform (Google, GitHub, etc.).
2. If the link is unknown, it checks the `threat-db.json` hosted in this repo.
3. If a match is found, the link is visually quarantined in the browser.

## 🤝 How to Contribute
Spotted a new scammer domain? Help the community:
1. Fork this repository.
2. Add the domain to the `blacklisted_domains` array in `threat-db.json`.
3. Submit a **Pull Request**.

Once your PR is merged, every Forge-Guard user in the world will be protected against that domain automatically on their next sync.

## ⚖️ License
MIT License - Free to use, free to share.
