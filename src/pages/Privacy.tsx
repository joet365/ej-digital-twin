import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              PRIVACY POLICY
            </h1>
            <p className="text-gray-500">
              Last Updated: December 17, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to Conquer365 (<a href="https://www.conquer365.com" className="text-primary hover:underline">www.conquer365.com</a>). Conquer365 is committed to protecting your privacy and safeguarding the personal information processed through our marketing and client communication platform. This Privacy Policy explains how Conquer365 collects, uses, shares, and protects information when you access or use the Services.
              </p>
              <p className="leading-relaxed mt-4">
                By using the Services, you agree to the practices described in this Privacy Policy. If you do not agree, please discontinue use of the Services.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">a. Information You Provide Directly</h3>
              <p className="leading-relaxed mb-4">
                Depending on how you use the Services, Conquer365 may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Account Information:</strong> Name, email address, business name, role, phone number, and password.</li>
                <li><strong>Billing Information:</strong> Billing address and payment method details, processed securely by third-party payment processors (e.g., Stripe, PayPal, or similar services).</li>
                <li><strong>Content and Configuration:</strong> Chat scripts, FAQs, workflows, templates, and other content you upload or configure.</li>
                <li><strong>Communications:</strong> Messages, support requests, feedback, and other communications you send to Conquer365.</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">b. Information Collected Automatically</h3>
              <p className="leading-relaxed mb-4">
                When you access the Services, Conquer365 may automatically collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and similar technical data.</li>
                <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, links clicked, and other usage patterns within the platform.</li>
                <li><strong>Cookies and Tracking Technologies:</strong> Cookies, web beacons, and similar technologies to operate the site, remember preferences, and analyze usage (see Section 6).</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">c. Information from Third-Party Sources</h3>
              <p className="leading-relaxed mb-4">
                Conquer365 may receive information from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Processors:</strong> Limited payment-related information (e.g., transaction status) from Stripe, PayPal, or similar providers.</li>
                <li><strong>Analytics Providers:</strong> Aggregated or de-identified analytics from tools like Google Analytics or similar services.</li>
                <li><strong>Integrated Services:</strong> Data from third-party tools you connect to Conquer365 (e.g., CRM, email, or messaging platforms), as authorized by you.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="leading-relaxed mb-4">
                Conquer365 uses the information it collects for the following purposes:
              </p>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">a. Service Delivery</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Provide, operate, and maintain the Conquer365 platform and Services.</li>
                <li>Configure and power your live chat, messaging, and marketing workflows.</li>
                <li>Process payments, manage subscriptions, and provide account management.</li>
                <li>Provide customer support and respond to your inquiries.</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">b. Communication and Marketing</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Send transactional emails and messages (e.g., account notices, billing, security alerts).</li>
                <li>Send you product updates, offers, and marketing communications where permitted by law and your preferences.</li>
                <li>Conduct surveys and gather feedback to improve the Services.</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">c. Improvement and Analytics</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Analyze usage and performance to maintain, secure, and improve the Services.</li>
                <li>Develop new features and functionality for the Conquer365 platform.</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">d. Legal and Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with legal obligations and respond to lawful requests.</li>
                <li>Detect, prevent, and investigate fraud, abuse, or security incidents.</li>
                <li>Enforce our Terms & Conditions and protect the rights, property, or safety of Conquer365, its users, or the public.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. TCPA and Marketing Consent
              </h2>
              <p className="leading-relaxed mb-4">
                By providing a phone number or email address, you may consent to receive: automated or prerecorded calls, SMS/MMS text messages, and promotional and transactional emails from Conquer365. Consent is not a condition of purchase, message and data rates may apply, and message frequency may vary.
              </p>
              <p className="leading-relaxed mb-2 font-medium">To opt out:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reply STOP to SMS messages to unsubscribe from texts.</li>
                <li>Use the "Unsubscribe" link in promotional emails.</li>
                <li>Contact <a href="mailto:support@conquer365.com" className="text-primary hover:underline">support@conquer365.com</a> to manage communication preferences.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. How We Share Your Information
              </h2>
              <p className="leading-relaxed mb-4">
                Conquer365 does not sell your personal information. Conquer365 may share information in the following situations:
              </p>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">a. Service Providers</h3>
              <p className="leading-relaxed mb-4">
                With trusted third-party vendors that help operate the Services, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Payment processors.</li>
                <li>Hosting and cloud infrastructure providers.</li>
                <li>Email, SMS, and communication platforms.</li>
                <li>Analytics and security providers.</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">b. Legal and Compliance</h3>
              <p className="leading-relaxed mb-6">
                Where Conquer365 is required to do so by law or reasonably believes such disclosure is necessary to: comply with legal processes; enforce the Terms; or protect the rights, property, or safety of Conquer365, users, or others.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">c. Business Transfers</h3>
              <p className="leading-relaxed mb-6">
                In connection with any merger, sale of assets, financing, or acquisition of all or a portion of Conquer365's business, information may be transferred to a successor entity.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">d. With Your Direction or Consent</h3>
              <p className="leading-relaxed">
                Conquer365 may share information with third parties when you ask or consent, including when you integrate Conquer365 with other platforms.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="leading-relaxed mb-4">
                Conquer365 uses cookies and similar technologies for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Essential Functions:</strong> To enable core site functionality such as login and security.</li>
                <li><strong>Analytics:</strong> To understand how the Services are used and to improve performance.</li>
                <li><strong>Preferences:</strong> To remember settings and user preferences.</li>
              </ul>
              <p className="leading-relaxed">
                Most browsers allow you to manage or disable cookies, but doing so may limit certain features of the Services.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Data Security
              </h2>
              <p className="leading-relaxed">
                Conquer365 uses industry-standard administrative, technical, and physical safeguards to protect personal information, including encryption in transit (SSL/TLS) and restricted access based on role and necessity. However, no method of transmission or storage is completely secure, and Conquer365 cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <p className="leading-relaxed">
                Conquer365 retains personal information only as long as necessary to provide the Services, fulfill legitimate business or legal purposes, resolve disputes, and enforce agreements. When information is no longer needed, Conquer365 will delete or de-identify it in accordance with applicable law.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <p className="leading-relaxed">
                The Services are not directed to children under 13, and Conquer365 does not knowingly collect personal information from children under 13. If Conquer365 becomes aware that such data has been collected, it will take steps to delete it.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Your Privacy Rights
              </h2>
              <p className="leading-relaxed">
                Depending on your location, you may have rights such as: access, correction, deletion, restriction or objection to certain processing, and data portability. To exercise these rights, contact <a href="mailto:support@conquer365.com" className="text-primary hover:underline">support@conquer365.com</a>, and Conquer365 will respond within the time required by applicable law.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. International Users
              </h2>
              <p className="leading-relaxed">
                If you access the Services from outside the United States, your information may be transferred to and processed in the United States or other countries where Conquer365 or its service providers operate, which may have different data protection laws. By using the Services, you consent to such transfer and processing.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. State-Specific Privacy Rights (U.S.)
              </h2>
              <p className="leading-relaxed mb-4">
                If applicable, residents of certain U.S. states (such as California, Virginia, Colorado, and others) may have additional rights under state privacy laws, including the right to know, delete, correct, and opt out of certain processing. Conquer365 does not sell personal information as defined by these laws.
              </p>
              <p className="leading-relaxed">
                To submit a request, contact <a href="mailto:support@conquer365.com" className="text-primary hover:underline">support@conquer365.com</a> and indicate your state of residence and the nature of your request.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed">
                Conquer365 may update this Privacy Policy from time to time to reflect changes in practices, technologies, or legal requirements. Any updates will be posted on this page with an updated "Last Updated" date, and your continued use of the Services after such changes indicates your acceptance.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Third-Party Sites and Services
              </h2>
              <p className="leading-relaxed">
                The Services may contain links to third-party websites, tools, or integrations. Conquer365 is not responsible for the privacy practices of those third parties and encourages you to review their privacy policies.
              </p>
            </section>

            {/* Section 15 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. Contact Us
              </h2>
              <p className="leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy, please contact:
              </p>
              <div className="leading-relaxed">
                <p className="font-medium">Brandigy Promedia LLC (Conquer365)</p>
                <p>22136 Westheimer Pkwy #936</p>
                <p>Katy, TX 77450</p>
                <p>Email: <a href="mailto:support@conquer365.com" className="text-primary hover:underline">support@conquer365.com</a></p>
              </div>
            </section>

            {/* Final Statement */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="leading-relaxed text-gray-600 italic">
                By using Conquer365, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
