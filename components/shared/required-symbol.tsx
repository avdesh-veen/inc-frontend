export function RequiredSymbol() {
  return (
    <span>
      <span className="text-red-500 ms-1" aria-hidden="true">
        *
      </span>
      <span className="sr-only">Required</span>
    </span>
  );
}