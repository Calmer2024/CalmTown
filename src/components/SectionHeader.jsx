export default function SectionHeader({ kicker, title, children }) {
  return (
    <div className="section-header" data-reveal>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}
