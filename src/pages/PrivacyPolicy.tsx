const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-muted-foreground text-sm">Last updated: March 18, 2026</p>

      <section className="space-y-4 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
          <p>We may collect the following information when you use our app:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email address (if you create an account)</li>
            <li>Exam results and progress data</li>
            <li>Device information and usage analytics</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and maintain the app</li>
            <li>To track your learning progress</li>
            <li>To improve the app experience</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">3. Data Storage</h2>
          <p>Your data is stored securely on our servers. Exam history and progress may be stored locally on your device for offline access.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">4. Third-Party Services</h2>
          <p>We may use third-party services for analytics and authentication. These services have their own privacy policies.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">5. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal data. Contact us to exercise these rights.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">6. Contact</h2>
          <p>If you have questions about this privacy policy, contact us at the phone number provided in the app.</p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
