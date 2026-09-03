"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">Something went wrong</h2>
        <p className="text-xs text-muted-foreground font-mono bg-muted p-3 rounded-lg text-left overflow-auto max-h-40">
          {error?.message}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
