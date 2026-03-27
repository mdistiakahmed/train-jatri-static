import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Train Jatri | Your Data Protection",
  description:
    "Read our Privacy Policy to understand how Train Jatri collects, uses, and protects your personal information when you use our Bangladesh Railway services.",
  keywords:
    "privacy policy, data protection, personal information, train jatri privacy, Bangladesh Railway data",
  openGraph: {
    title: "Privacy Policy - Train Jatri | Your Data Protection",
    description:
      "Learn how Train Jatri handles and protects your personal information when you use our services.",
    url: "https://trainjatri.com/privacy-policy",
    siteName: "Train Jatri",
    locale: "en_US",
    type: "website",
  },
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="mb-8">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Train Jatri. We are committed to protecting your
              privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our services related to
              Bangladesh Railway schedules, tracking, and information.
            </p>
            <p className="">
              By accessing or using our services, you agree to the collection
              and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, and other contact details when you register or
                contact us.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our website and services, including IP address, browser
                type, pages visited, and time spent on pages.
              </li>
              <li>
                <strong>Location Data:</strong> Approximate location information
                for providing relevant train schedules and services.
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong> We use
                cookies and similar technologies to enhance your experience and
                analyze usage patterns.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Providing and maintaining our services</li>
              <li>Notifying you about changes to our services</li>
              <li>Allowing you to participate in interactive features</li>
              <li>Providing customer support</li>
              <li>Gathering analysis to improve our services</li>
              <li>Monitoring the usage of our services</li>
              <li>Detecting, preventing, and addressing technical issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. However, no internet
              transmission or electronic storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              5. Third-Party Services
            </h2>
            <p className="mb-4">
              We may employ third-party companies and individuals to facilitate
              our services, provide services on our behalf, perform
              service-related services, or assist us in analyzing how our
              services are used. These third parties have access to your
              personal information only to perform these tasks on our behalf and
              are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              6. Your Data Protection Rights
            </h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The right to access, update, or delete your information</li>
              <li>
                The right to rectification if your information is inaccurate or
                incomplete
              </li>
              <li>
                The right to object to our processing of your personal data
              </li>
              <li>
                The right to request restriction of processing your personal
                information
              </li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="">
              To exercise any of these rights, please contact us using the
              information in the &quot;Contact Us&quot; section below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold  mb-4">
              7. Children&apos;s Privacy
            </h2>
            <p className=" mb-4">
              Our services are not intended for individuals under the age of 13.
              We do not knowingly collect personally identifiable information
              from children under 13. If you are a parent or guardian and you
              are aware that your child has provided us with personal
              information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <p className=" mb-4">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date at the top of this
              Privacy Policy.
            </p>
            <p className="">
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:randzyx62@gmail.com"
                className="text-blue-600 hover:underline"
              >
                randzyx62@gmail.com
              </a>
              .
            </p>
            <p className=" mt-4">
              For more information about our practices, please visit our{" "}
              <a href="/about-us" className="text-blue-600 hover:underline">
                About Us
              </a>{" "}
              page or contact us using the information provided on our{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact
              </a>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
