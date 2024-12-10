import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-green-50 to-white px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900">
              About Zelene
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              Driving innovation in sustainability and environmental solutions
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600">
              At Zelene, we're committed to creating sustainable solutions that
              make a real difference in the world. Our mission is to innovate
              and implement environmentally conscious practices that benefit
              both people and planet.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Our Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Innovation
              </h3>
              <p className="text-gray-600">
                Constantly pushing boundaries to find better solutions
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Sustainability
              </h3>
              <p className="text-gray-600">
                Making choices that benefit our environment's future
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Community
              </h3>
              <p className="text-gray-600">
                Building strong relationships with our stakeholders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Join Us in Making a Difference
          </h2>
          <Link
            href="/"
            className="inline-block rounded-full bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
