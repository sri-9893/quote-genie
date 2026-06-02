export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="loader-ring" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}