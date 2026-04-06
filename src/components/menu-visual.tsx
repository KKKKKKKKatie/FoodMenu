export function MenuVisual({
  title,
  imageUrl,
  compact = false,
}: {
  title: string;
  imageUrl?: string | null;
  compact?: boolean;
}) {
  if (imageUrl) {
    return (
      <div
        className={`menu-visual ${compact ? "menu-visual--compact" : ""}`}
        style={{ backgroundImage: `linear-gradient(rgba(42, 31, 22, 0.14), rgba(42, 31, 22, 0.24)), url(${imageUrl})` }}
        aria-label={title}
      />
    );
  }

  return (
    <div className={`menu-visual menu-visual--placeholder ${compact ? "menu-visual--compact" : ""}`}>
      <span>{title.slice(0, 2)}</span>
    </div>
  );
}
