import Link from "next/link";

export default function Home() {
  return (
    <div className="container py-12">
      <div className="max-w-2xl font-mono">
        <h1 className="text-4xl font-bold text-green-400 mb-8">
          Welcome to My ASCII Portfolio
        </h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-green-300">About Me</h2>
          <p className="mb-4">
            I'm a developer who loves ASCII art and retro aesthetics.
            This site showcases my work and experiments with ASCII animations.
          </p>
          <p>
            <Link href="/about" className="text-green-400 hover:text-green-300 underline">
              Learn more about me →
            </Link>
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-green-300">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-green-800 p-4">
              <h3 className="text-xl font-bold mb-2">ASCII Animations</h3>
              <p className="mb-2">Creative coding experiments with text-based graphics.</p>
              <p className="text-green-600">[ JavaScript, Canvas, React ]</p>
            </div>
            <div className="border border-green-800 p-4">
              <h3 className="text-xl font-bold mb-2">Interactive Art</h3>
              <p className="mb-2">User-responsive digital art installations.</p>
              <p className="text-green-600">[ TypeScript, Three.js, WebGL ]</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
