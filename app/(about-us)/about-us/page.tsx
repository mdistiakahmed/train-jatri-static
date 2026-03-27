import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Train Jatri | Your Trusted Bangladesh Railway Guide",
  description:
    "Learn about Train Jatri - your comprehensive guide to Bangladesh Railway. Discover our mission, vision, and commitment to making train travel easier in Bangladesh.",
  keywords:
    "Bangladesh Railway, train schedule, train tracking, about us, train travel Bangladesh, railway information",
  openGraph: {
    title: "About Us - Train Jatri | Your Trusted Bangladesh Railway Guide",
    description:
      "Learn about Train Jatri - your comprehensive guide to Bangladesh Railway. Discover our mission and vision.",
    url: "https://trainjatri.com/about-us",
    siteName: "Train Jatri",
    locale: "en_US",
    type: "website",
  },
};

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-white ">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            About Train Jatri
          </h1>
          <p className="text-lg ">
            Your trusted companion for navigating Bangladesh Railway. Our
            mission is to make train travel easier, smarter, and more reliable.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Mission */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">🎯 Our Mission</h2>
          <p className="mb-4 leading-relaxed">
            At Train Jatri, we are dedicated to simplifying train travel in
            Bangladesh. Our mission is to provide accurate, up-to-date
            information about Bangladesh Railway schedules, routes, and services
            to help travelers plan their journeys with confidence.
          </p>
          <p className="leading-relaxed">
            We understand the challenges of train travel in Bangladesh, and
            we&apos;re committed to making the process smoother, more
            transparent, and more accessible for everyone.
          </p>
        </div>

        {/* Our Team */}
        <section className="bg-gray-50 p-8 rounded-xl shadow-sm mt-12">
          <h2 className="text-3xl font-semibold mb-6">👥 Our Team</h2>

          <p className="leading-relaxed mb-6">
            Train Jatri is built and maintained by a passionate team of
            professionals who care deeply about improving train travel in
            Bangladesh. We bring together diverse expertise to create a reliable
            and user-centric platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-medium text-blue-700 mb-2">
                🛠️ Software Engineers
              </h3>
              <p className="text-sm leading-relaxed">
                Our developers build and maintain the platform with a focus on
                performance, usability, and security — ensuring a seamless
                experience for every user.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-medium text-blue-700 mb-2">
                📊 Data Engineers
              </h3>
              <p className="text-sm leading-relaxed">
                We collect, process, and structure vast amounts of railway data
                to keep the platform accurate and updated in real time.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-medium text-blue-700 mb-2">
                📈 Business Analysts
              </h3>
              <p className="text-sm leading-relaxed">
                Our analysts identify key traveler needs and optimize the
                platform based on usage insights and user feedback.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="bg-gray-50 p-8 rounded-xl shadow-sm">
          <h2 className="text-3xl font-semibold mb-6">📦 What We Offer</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <span className="text-blue-600 text-xl mt-1">🕒</span>
              <div>
                <h3 className="font-medium text-lg">Live Train Schedules</h3>
                <p className="text-sm">
                  Access real-time train schedules and route availability across
                  Bangladesh Railway with just a few clicks.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <span className="text-blue-600 text-xl mt-1">🚆</span>
              <div>
                <h3 className="font-medium text-lg">
                  Real-Time Train Tracking
                </h3>
                <p className="text-sm">
                  Get up-to-the-minute updates on train locations, delays, and
                  estimated arrival times.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <span className="text-blue-600 text-xl mt-1">📍</span>
              <div>
                <h3 className="font-medium text-lg">Station & Platform Info</h3>
                <p className="text-sm">
                  Find detailed information about train stations, platform
                  numbers, and facilities available for travelers.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <span className="text-blue-600 text-xl mt-1">🧭</span>
              <div>
                <h3 className="font-medium text-lg">Route Recommendations</h3>
                <p className="text-sm">
                  Explore popular and efficient travel routes tailored for both
                  regular and first-time passengers.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <span className="text-blue-600 text-xl mt-1">💡</span>
              <div>
                <h3 className="font-medium text-lg">Travel Tips</h3>
                <p className="text-sm">
                  Learn safety precautions, what to carry, and how to make your
                  train journeys more convenient and enjoyable.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <span className="text-blue-600 text-xl mt-1">📊</span>
              <div>
                <h3 className="font-medium text-lg">Data-Driven Insights</h3>
                <p className="text-sm">
                  Make informed travel decisions with curated insights based on
                  traffic, peak times, and past performance data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-semibold mb-6">🤝 Our Commitment</h2>

          <div className="space-y-6">
            <p className="leading-relaxed">
              At Train Jatri, we hold ourselves to the highest standards of
              accuracy, reliability, and user experience. Our platform is built
              with the goal of empowering train travelers across Bangladesh with
              the information they need — when they need it.
            </p>

            <p className="leading-relaxed">
              Our dedicated team of engineers, data analysts, and railway
              enthusiasts work around the clock to ensure every schedule, route,
              and update is thoroughly verified and regularly refreshed. We
              actively monitor Bangladesh Railway announcements to deliver
              real-time updates and eliminate outdated information.
            </p>

            <p className="leading-relaxed">
              Transparency and trust are the core pillars of our service. We
              know how frustrating travel uncertainty can be — which is why
              we&apos;re committed to clarity and consistency across all our
              tools.
            </p>

            <p className="leading-relaxed">
              We believe in community-driven growth. If you ever come across an
              error, outdated data, or if you have ideas to improve the
              experience — we want to hear from you. Your feedback is crucial in
              helping us evolve.
            </p>

            <div className="mt-4">
              <a
                href="/contact"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Share Your Feedback
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            📬 Connect With Us
          </h2>
          <p className="leading-relaxed">
            Have questions or need assistance? Visit our{" "}
            <a
              href="/contact"
              className="text-blue-600 hover:underline font-medium"
            >
              Contact page
            </a>{" "}
            to get in touch with our team.
          </p>
        </div>
      </section>
    </main>
  );
}
