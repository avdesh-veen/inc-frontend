/**
 * Clients Not Found Page
 * 
 * Displayed when the clients route cannot be found.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClientsNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Clients Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The clients page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
