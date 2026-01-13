import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              TERMS AND CONDITIONS
            </h1>
            <p className="text-gray-500">
              Last Updated: December 17, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing or using Conquer365 (<a href="https://www.conquer365.com" className="text-primary hover:underline">www.conquer365.com</a>) and any related products, services, or content (collectively, the "Services"), you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use immediately.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Service Description
              </h2>
              <p className="leading-relaxed">
                Conquer365 provides a marketing and client communication platform designed for law firms and other businesses, including live chat, lead capture, omni-channel messaging, and related sales and client management tools ("Services"). Conquer365 may modify, suspend, or discontinue any part of the Services at any time without prior notice.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Account Registration and Security
              </h2>
              <p className="leading-relaxed">
                To use certain features of the Services, you may be required to create an account. You agree to: (a) provide accurate, current, and complete information; (b) maintain the confidentiality of your login credentials; and (c) immediately notify Conquer365 of any unauthorized use of your account. You are responsible for all activities that occur under your account, and Conquer365 may suspend or terminate accounts for violation of these Terms or suspected fraudulent activity.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. TCPA Consent for Communications
              </h2>
              <p className="leading-relaxed mb-4">
                By providing your phone number and/or email address, you expressly consent to receive: (a) automated, prerecorded, or artificial voice calls; (b) SMS/MMS text messages; and (c) emails regarding promotional offers, updates, and service-related information from Conquer365. You understand that consent is not a condition of purchase, message and data rates may apply, and message frequency may vary based on your activity and promotions.
              </p>
              <p className="leading-relaxed mb-2 font-medium">To opt out:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reply STOP to any SMS to unsubscribe from text messages.</li>
                <li>Click "Unsubscribe" in any promotional email.</li>
                <li>Contact us at <a href="mailto:support@conquer365.com" className="text-primary hover:underline">support@conquer365.com</a> to revoke consent.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Purchases and Payment
              </h2>
              <p className="leading-relaxed">
                All purchases, subscriptions, and usage-based fees for the Services are processed securely through third-party payment processors such as Stripe, PayPal, or similar providers. By submitting a payment method, you represent that you have the legal right to use that method, that all information is accurate and current, and you authorize Conquer365 (and its processors) to charge all applicable fees, including recurring subscription fees where applicable.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Subscription / Credit or Usage System (If Applicable)
              </h2>
              <p className="leading-relaxed mb-4">
                If Conquer365 uses a subscription, seat-based, credit-based, or usage-based billing model, the following applies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Purchased subscriptions, credits, or usage allowances are non-transferable and have no cash value.</li>
                <li>Conquer365 may modify pricing, billing plans, or included features on renewal, with notice as required by applicable law.</li>
                <li>Unless otherwise stated in an order form or subscription agreement, fees paid are non-refundable, except as expressly provided in these Terms.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. User Content and Client Data
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">a. User Content</h3>
              <p className="leading-relaxed mb-4">
                You may upload or submit content to the Services, such as text, images, scripts, FAQs, templates, or other materials to power live chat, marketing, or client communication ("User Content"). You represent and warrant that you own or have all necessary rights to User Content and that it does not infringe any third-party rights or violate applicable law.
              </p>
              <p className="leading-relaxed">
                You grant Conquer365 a non-exclusive, worldwide, royalty-free license to host, store, reproduce, and process User Content solely as necessary to provide and improve the Services to you and your organization.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">b. Client / End-User Data</h3>
              <p className="leading-relaxed">
                Conquer365 may process information relating to your leads, prospects, or clients (for example, data collected through live chat, forms, or messaging channels) as part of the Services ("Client Data"). You are solely responsible for obtaining all required consents and providing any legally required notices to your clients and end users whose data you submit or process through the Services.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">c. Platform Ownership</h3>
              <p className="leading-relaxed">
                All intellectual property rights in and to the Conquer365 platform, including its software, design, logos, trademarks, and underlying technology, remain the exclusive property of Conquer365 and its licensors. Except for the limited rights expressly granted in these Terms, no rights are granted to you by implication or otherwise.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Acceptable Use Policy
              </h2>
              <p className="leading-relaxed mb-4">
                You agree not to use the Services for any unlawful, harmful, or prohibited activities, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uploading or transmitting content that is defamatory, obscene, harassing, hateful, or otherwise objectionable.</li>
                <li>Violating privacy, publicity, or other rights of any person.</li>
                <li>Sending spam or unsolicited messages in violation of applicable anti-spam or marketing laws.</li>
                <li>Attempting to gain unauthorized access to the platform or interfering with its security or operation.</li>
                <li>Using bots, scraping tools, or automated scripts to access or overload the Services.</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Conquer365 may suspend or terminate access for violations and may take any action permitted by law.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Refund and Cancellation Policy
              </h2>
              <p className="leading-relaxed mb-4">
                Unless otherwise stated in an order form or subscription agreement, all fees for Services are non-refundable once the billing period has started or usage has occurred. Conquer365 may, at its sole discretion, consider refunds in limited circumstances such as verified duplicate charges or clear technical failures attributable solely to Conquer365 that prevent use of the Services.
              </p>
              <p className="leading-relaxed">
                To request a refund or to cancel your subscription, contact <a href="mailto:support@conquer365.com" className="text-primary hover:underline">support@conquer365.com</a> within the timeframe specified in your order or welcome materials.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Privacy and Data Protection
              </h2>
              <p className="leading-relaxed">
                Your use of the Services is also governed by the Conquer365 <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, which describes how personal information is collected, used, and protected. By using the Services, you consent to the data practices described in the Privacy Policy.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Disclaimer of Warranties
              </h2>
              <p className="leading-relaxed uppercase">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. CONQUER365 DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT ANY DEFECTS WILL BE CORRECTED.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Limitation of Liability
              </h2>
              <p className="leading-relaxed uppercase">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CONQUER365 AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND PARTNERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES. IN NO EVENT SHALL CONQUER365'S TOTAL LIABILITY ARISING OUT OF OR RELATED TO THE SERVICES EXCEED THE AMOUNTS YOU PAID FOR THE SERVICES IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR ONE HUNDRED DOLLARS (US$100), WHICHEVER IS LESS.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Indemnification
              </h2>
              <p className="leading-relaxed">
                You agree to indemnify, defend, and hold harmless Conquer365 and its affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of the Services; (b) your violation of these Terms; (c) your infringement of any third-party rights; or (d) User Content or Client Data you submit to or process through the Services.
              </p>
            </section>

            {/* Section 14 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Dispute Resolution, Arbitration, and Governing Law
              </h2>
              <p className="leading-relaxed mb-4">
                Before initiating any formal dispute, you agree to first contact Conquer365 at <a href="mailto:support@conquer365.com" className="text-primary hover:underline">support@conquer365.com</a> to attempt informal resolution. If the dispute cannot be resolved informally, you agree that it will be resolved through binding arbitration administered by the American Arbitration Association (AAA), on an individual basis and not as part of any class or representative proceeding, except where prohibited by law.
              </p>
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to conflict-of-law rules.
              </p>
            </section>

            {/* Section 15 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. Modifications to Terms
              </h2>
              <p className="leading-relaxed">
                Conquer365 may update these Terms from time to time. Changes will be effective when posted on this page with an updated "Last Updated" date, and your continued use of the Services after changes become effective constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 16 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                16. Termination
              </h2>
              <p className="leading-relaxed">
                Conquer365 may suspend or terminate your account or access to the Services at any time, with or without notice, for any violation of these Terms, suspected fraudulent activity, or other reasons in its sole discretion. Upon termination, your right to use the Services will immediately cease, and you remain responsible for any outstanding payment obligations.
              </p>
            </section>

            {/* Section 17 */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                17. Contact Information
              </h2>
              <p className="leading-relaxed mb-4">
                If you have questions about these Terms & Conditions, please contact:
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
                By using Conquer365, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
