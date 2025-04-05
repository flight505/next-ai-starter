import AsciiBackground from "@/components/AsciiBackground";

export default function AboutPage() {
  return (
    <>
      <AsciiBackground mode="sand" userWord="SAND" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto font-mono">
          <h1 className="text-4xl font-bold text-green-400 mb-8">
            About Me
          </h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-300">Background</h2>
            <p className="mb-4">
              I'm a developer passionate about creating unique digital experiences.
              With a background in both design and programming, I enjoy crafting
              interfaces that are both functional and delightful.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-300">Skills</h2>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Frontend Development (React, Next.js, TypeScript)</li>
              <li>Creative Coding and Generative Art</li>
              <li>UI/UX Design</li>
              <li>ASCII Art and Animations</li>
              <li>Node.js Backend Development</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-green-300">Sand Game</h2>
            <p className="mb-4">
              Try clicking anywhere on the screen! The ASCII letters will fall and
              interact with each other like sand. This is a simple physics simulation
              running entirely in the browser.
            </p>
            <p className="text-green-500 italic">
              Hint: Click near the top of the screen for the best effect.
            </p>
          </section>
        </div>
      </div>
    </>
  );
} 