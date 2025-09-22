import CV from '@/components/CV';

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Filip Csupka</h1>
            <div className="space-x-6 hidden md:flex">
              <a href="#cv" className="text-gray-600 hover:text-gray-900 transition">CV</a>
              <a href="#projects" className="text-gray-600 hover:text-gray-900 transition">Projects</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition">Contact</a>
            </div>
          </nav>
        </header>

        <main className="flex-grow container mx-auto px-6 py-12">
          <section id="hero" className="text-center py-20">
            <h2 className="text-5xl font-extrabold text-gray-900">DevOps & SRE Professional</h2>
            <p className="text-xl text-gray-600 mt-4">Building reliable and scalable infrastructure.</p>
          </section>

          <div className="space-y-16">
            <CV />

            <section id="projects" className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Projects</h3>
              <p className="text-gray-700">This section will showcase the projects you've worked on and the specific tasks you handled.</p>
            </section>

            <section id="contact" className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Contact</h3>
              <p className="text-gray-700">Your contact information will go here. Include links to your LinkedIn, GitHub, or email.</p>
            </section>
          </div>
        </main>

        <footer className="bg-white mt-12">
          <div className="container mx-auto px-6 py-4 text-center text-gray-600">
            <p>&copy; 2025 Filip Csupka</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
