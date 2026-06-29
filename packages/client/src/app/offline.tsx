import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gameedge-dark-900 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">You&apos;re Offline</h1>
        <p className="text-muted-foreground mb-8">
          It looks like you&apos;ve lost your internet connection. Check your connection and try again.
        </p>
        <Link href="/">
          <button className="px-6 py-3 bg-gameedge-primary text-white rounded-lg font-medium hover:bg-gameedge-primary/90 transition-colors">
            Try Again
          </button>
        </Link>
      </div>
    </div>
  );
}
