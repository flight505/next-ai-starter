import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="z-20 fixed top-0 left-0 right-0 p-4 flex justify-center">
      <div className="bg-background/80 dark:bg-background/80 border border-accent px-6 py-2">
        <ul className="flex space-x-8 font-mono text-foreground">
          <li>
            <Link href="/" className="hover:text-accent-hover transition-colors">
              HOME
            </Link>
          </li>
          <li className="font-mono mx-3">
            <Link href="/about" className="hover:text-accent-hover">ABOUT</Link>
          </li>
          <li className="font-mono mx-3">
            <Link href="/projects" className="hover:text-accent-hover">PROJECTS</Link>
          </li>
          <li className="font-mono mx-3">
            <Link href="/contact" className="hover:text-accent-hover">CONTACT</Link>
          </li>
          <li>
            <Link href="/engine-demo" className="hover:text-accent-hover">Engine Demo</Link>
          </li>
          <li className="font-mono mx-3">
            <Link href="/background-demo" className="hover:text-accent-hover">Background Demo</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
} 