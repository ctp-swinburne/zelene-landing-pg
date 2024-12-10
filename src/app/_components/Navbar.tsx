import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">Zelene</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden space-x-8 md:flex">
            <Link
              href="/"
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-gray-900"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
