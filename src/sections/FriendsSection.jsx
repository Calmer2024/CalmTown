import { testimonials } from "../data/siteContent";

export default function FriendsSection() {
  return (
    <section className="friends-section section-shell" id="friends">
      <div className="friends-layout">
        <div className="friends-title" data-reveal>
          <p className="kicker">Friends say</p>
          <h2>People notice the quiet parts.</h2>
        </div>

        <div className="quote-stack">
          {testimonials.map((item, index) => (
            <figure
              className="quote-card"
              data-reveal
              style={{ "--delay": `${index * 80}ms` }}
              key={item.name}
            >
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
