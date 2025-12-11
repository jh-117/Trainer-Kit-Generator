import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>

          <div className="prose prose-sm max-w-none space-y-6">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700">
                TrainerKit GenAI ("the Service") is an AI-powered training material generator. 
                This privacy policy explains how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">User Input Data:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Training Topics:</strong> The subject matter you provide for generating training materials</li>
                <li><strong>Industry Selection:</strong> The industry context you select for customization</li>
                <li><strong>Uploaded Files:</strong> Optional documents you provide for content generation</li>
                <li><strong>Customization Preferences:</strong> Your choices for training material formats and styles</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Usage Information:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Anonymous Usage Data:</strong> General statistics about feature usage and performance</li>
                <li><strong>Session Information:</strong> Temporary data during your active session</li>
              </ul>

              <p className="text-gray-700 mt-4 p-4 bg-blue-50 rounded-lg">
                <strong>Important:</strong> We do <strong>not</strong> collect:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Personal identification information (name, email, company details)</li>
                  <li>Payment information (our service is free)</li>
                  <li>User accounts or login credentials</li>
                  <li>Contact information or demographic data</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Content Generation:</strong> To create training materials (PPT, guides, handouts, flashcards) based on your input</li>
                <li><strong>AI Processing:</strong> To analyze your topic and industry to generate relevant content</li>
                <li><strong>Improvement:</strong> To enhance our AI models and service quality</li>
                <li><strong>Temporary Storage:</strong> To maintain your session while generating materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Processing & AI Services</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Kadosh AI/OpenAI:</strong> Your input data is processed by AI models to generate training content</li>
                <li><strong>Content Analysis:</strong> Uploaded documents are analyzed solely for content extraction and training material generation</li>
                <li><strong>No Training Data:</strong> Your specific inputs are not used to train AI models beyond your immediate session</li>
                <li><strong>Temporary Processing:</strong> Data is processed in real-time and not stored for future model training</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Storage & Retention</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Input Data:</strong> Temporarily stored during your session (deleted after completion)</li>
                <li><strong>Generated Materials:</strong> Available for download only; not stored on our servers</li>
                <li><strong>Uploaded Files:</strong> Processed and deleted after generation completes</li>
                <li><strong>Session Data:</strong> Cleared when you close your browser or end your session</li>
                <li><strong>Anonymous Analytics:</strong> Aggregated usage statistics retained for service improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Secure transmission using HTTPS/SSL encryption</li>
                <li>No permanent storage of personal or sensitive information</li>
                <li>Regular security monitoring and updates</li>
                <li>Automatic data cleanup of temporary files</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Third-Party Services</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>AI Providers:</strong> Content generation powered by Kadosh AI/OpenAI (subject to their privacy policies)</li>
                <li><strong>Hosting Services:</strong> Secure cloud infrastructure for application hosting</li>
                <li><strong>No Data Sharing:</strong> We do not sell, rent, or share your data with third parties for marketing or advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Content & Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Your Inputs:</strong> You retain all rights to the topics and documents you provide</li>
                <li><strong>Generated Materials:</strong> You own the training materials generated from your inputs</li>
                <li><strong>AI-Generated Content:</strong> Content created by AI is provided for your use without restrictions</li>
                <li><strong>Responsibility:</strong> You are responsible for ensuring your inputs and use of generated materials comply with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
              <p className="text-gray-700">
                Our service is intended for professional training purposes and is not designed for 
                or directed at children under 18 years of age. We do not knowingly collect any 
                information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this privacy policy to reflect changes in our practices or legal requirements. 
                The updated version will be posted here with a revised "Last Updated" date. 
                We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or our data practices, please contact:<br />
                <strong>Email:</strong> privacy@trainerkit.ai<br />
                <strong>Website:</strong> trainerkit.ai
              </p>
            </section>

            <section className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Summary</h2>
              <ul className="space-y-2 text-gray-700">
                <li>✓ <strong>No accounts required</strong> - use instantly without registration</li>
                <li>✓ <strong>No personal data collected</strong> - we don't ask for names or emails</li>
                <li>✓ <strong>Your inputs are temporary</strong> - deleted after generation</li>
                <li>✓ <strong>You own the output</strong> - generated materials are yours to use</li>
                <li>✓ <strong>100% anonymous</strong> - no tracking or profiling</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;