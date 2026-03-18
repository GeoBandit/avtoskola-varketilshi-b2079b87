const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-muted-foreground text-sm">Last updated: March 18, 2026</p>

      <section className="space-y-4 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold mb-2">1. Data Collection</h2>
          <p>We do not collect, store, or share any personal data from our users. The app functions without requiring any personal information.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">2. Local Storage</h2>
          <p>Your exam results and progress are stored locally on your device only. This data never leaves your device and is not accessible to us.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">3. Third-Party Services</h2>
          <p>The app does not use any third-party analytics, tracking, or advertising services.</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">4. Contact</h2>
          <p>If you have questions about this privacy policy, contact us at the phone number provided in the app.</p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
