export default function BrandIcon({ icon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
}
