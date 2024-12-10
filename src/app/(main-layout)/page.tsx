import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900">
              Welcome to Zelene
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              Empowering sustainable solutions for a better tomorrow
            </p>
            <Link
              href="/contact"
              className="rounded-full bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Sustainable Solutions
              </h3>
              <p className="text-gray-600">
                Innovative approaches to environmental challenges
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Expert Team
              </h3>
              <p className="text-gray-600">
                Dedicated professionals committed to excellence
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 text-center">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Global Impact
              </h3>
              <p className="text-gray-600">
                Making a difference across communities worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Ready to Join Us?
          </h2>
          <Link
            href="/about"
            className="inline-block rounded-full bg-gray-900 px-8 py-3 font-medium text-white transition-colors hover:bg-gray-800"
          >
            Learn More
          </Link>
        </div>
      </section>
    </main>
  );
}
