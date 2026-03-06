import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-700 mb-4">
                Welcome to DevTrack ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              <p className="text-slate-700 mb-4">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.1 Information You Provide</h3>
              <p className="text-slate-700 mb-4">
                We collect information that you voluntarily provide when using our service:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Email address, password (encrypted), and authentication credentials</li>
                <li><strong>Profile Information:</strong> Name and other optional profile details</li>
                <li><strong>Project Data:</strong> Project names, descriptions, dates, tech stacks, and related information</li>
                <li><strong>Account References:</strong> Gmail and GitHub account information you choose to track</li>
                <li><strong>Technology Stack Data:</strong> Information about technologies you use in your projects</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-slate-700 mb-4">
                When you access our service, we automatically collect certain information:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Log Data:</strong> IP address, browser type, operating system, and access times</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns</li>
                <li><strong>Device Information:</strong> Device type, unique device identifiers</li>
                <li><strong>Cookies:</strong> Session cookies for authentication and functionality</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.3 Third-Party Authentication</h3>
              <p className="text-slate-700 mb-4">
                If you choose to authenticate using Google or GitHub, we receive:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Your email address</li>
                <li>Profile information (name, profile picture)</li>
                <li>Authentication tokens (stored securely)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-700 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our service</li>
                <li><strong>Account Management:</strong> To create and manage your account</li>
                <li><strong>Authentication:</strong> To verify your identity and secure your account</li>
                <li><strong>Data Storage:</strong> To store and organize your project information</li>
                <li><strong>Communication:</strong> To send service-related notifications and updates</li>
                <li><strong>Analytics:</strong> To understand how users interact with our service</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Storage and Security</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.1 Data Storage</h3>
              <p className="text-slate-700 mb-4">
                Your data is stored securely using Supabase, a secure PostgreSQL database platform. We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Encrypted data transmission (SSL/TLS)</li>
                <li>Encrypted password storage</li>
                <li>Row-level security policies</li>
                <li>Regular security updates and patches</li>
                <li>Secure authentication tokens</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.2 Data Retention</h3>
              <p className="text-slate-700 mb-4">
                We retain your information for as long as your account is active or as needed to provide you services. You can request deletion of your account and data at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Information Sharing and Disclosure</h2>
              <p className="text-slate-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Service Providers:</strong> With trusted third-party service providers (Supabase, Vercel) who assist in operating our service</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Your Privacy Rights</h2>
              <p className="text-slate-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Export your project data in CSV format</li>
                <li><strong>Opt-Out:</strong> Opt-out of non-essential communications</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              </ul>
              <p className="text-slate-700 mb-4">
                To exercise these rights, please contact us through the service or our support channels.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-slate-700 mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Analyze service usage</li>
                <li>Improve user experience</li>
              </ul>
              <p className="text-slate-700 mb-4">
                You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Third-Party Services</h2>
              <p className="text-slate-700 mb-4">
                Our service integrates with third-party services:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Supabase:</strong> Database and authentication services</li>
                <li><strong>Vercel:</strong> Hosting and deployment</li>
                <li><strong>Google OAuth:</strong> Optional authentication</li>
                <li><strong>GitHub OAuth:</strong> Optional authentication</li>
              </ul>
              <p className="text-slate-700 mb-4">
                These services have their own privacy policies. We encourage you to review them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Children's Privacy</h2>
              <p className="text-slate-700 mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. International Data Transfers</h2>
              <p className="text-slate-700 mb-4">
                Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our service, you consent to such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Data Breach Notification</h2>
              <p className="text-slate-700 mb-4">
                In the event of a data breach that affects your personal information, we will notify you and relevant authorities as required by applicable law, typically within 72 hours of becoming aware of the breach.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Contact Us</h2>
              <p className="text-slate-700 mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us through:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Our website contact form</li>
                <li>Support channels within the application</li>
                <li>Email support (if provided)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Your Consent</h2>
              <p className="text-slate-700 mb-4">
                By using our service, you consent to our Privacy Policy and agree to its terms.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              This Privacy Policy is effective as of the date stated at the top of this policy. Your continued use of the service after any changes indicates your acceptance of the updated policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
