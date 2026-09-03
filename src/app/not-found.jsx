import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-muted-foreground/30">404</h1>
        <div className="h-0.5 w-16 bg-border mx-auto" />
        <p className="text-lg font-bold text-foreground">Page not found</p>
        <p className="text-sm text-muted-foreground">This page doesn't exist or has been moved.</p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition"
        >
          Back to Dimetrix
        </Link>
      </div>
    </div>
  );
}
