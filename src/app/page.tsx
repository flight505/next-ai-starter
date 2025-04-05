import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto font-mono">
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
          <h2 className="text-2xl font-bold mb-4 text-green-300">Latest Blog Posts</h2>
          <p className="mb-4">
            Coming soon - blog posts powered by Notion.
          </p>
          <p>
            <Link href="/blog" className="text-green-400 hover:text-green-300 underline">
              Check out my blog →
            </Link>
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-green-300">Get in Touch</h2>
          <p className="mb-4">
            Have a project in mind or just want to chat? I'd love to hear from you.
          </p>
          <p>
            <Link href="/contact" className="text-green-400 hover:text-green-300 underline">
              Contact me →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
