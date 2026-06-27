import { socialLinks } from "../data/siteContent";

export default function Footer() {
  return (
    <footer className="site-footer section-shell">
      <p>CalmTown by Calmer</p>
      <div>
        {socialLinks.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
