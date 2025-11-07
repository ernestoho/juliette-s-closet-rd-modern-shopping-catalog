import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
export function NotFoundPage() {
  return (
    <AppLayout>
      <div className="flex-grow flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-8xl md:text-9xl font-bold font-display text-primary">404</h1>
          <p className="mt-4 text-2xl md:text-3xl font-semibold text-foreground">Page Not Found</p>
          <p className="mt-2 text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <Button asChild className="mt-8">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go back home
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}