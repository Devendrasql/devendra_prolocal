export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-32">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-sm text-gray-600">
              Building thoughtful software products with a focus on clarity, performance, and long-term maintainability.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition">
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition">
                LinkedIn
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition">
                Twitter
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <a href="mailto:your@email.com" className="text-sm text-gray-600 hover:text-gray-900 transition">
              your@email.com
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
