import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="z-20 fixed top-0 left-0 right-0 p-4 flex justify-center">
      <div className="bg-black/80 border border-green-500 px-6 py-2">
        <ul className="flex space-x-8 font-mono text-green-500">
          <li>
            <Link href="/" className="hover:text-green-400 transition-colors">
              HOME
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-green-400 transition-colors">
              ABOUT
            </Link>
          </li>
          <li>
            <Link href="/projects" className="hover:text-green-400 transition-colors">
              PROJECTS
            </Link>
          </li>
          <li>
            <Link href="/sand" className="hover:text-green-400 transition-colors">
              SAND
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-green-400 transition-colors">
              CONTACT
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
} 