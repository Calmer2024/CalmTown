export default function SectionHeading({ title, number, id, className = "" }) {
  return (
    <div className={`section-heading${className ? ` ${className}` : ""}`}>
      <h2 id={id}>{title}</h2>
      <span className="section-heading-number" aria-hidden="true">
        {number}
      </span>
    </div>
  );
}
