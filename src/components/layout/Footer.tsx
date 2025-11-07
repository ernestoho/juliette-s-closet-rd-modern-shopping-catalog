import { Instagram, Facebook, Twitter } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-foreground/60">
              &copy; {new Date().getFullYear()} Juliette's Closet RD. All rights reserved.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-foreground/50">
          <p>Built with ❤️ at Cloudflare</p>
        </div>
      </div>
    </footer>
  );
}