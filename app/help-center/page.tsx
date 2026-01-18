import React from "react";
import { getHelpCenterData } from "@/lib/helpCenter";

export default async function HelpCenterPage() {
  const data = await getHelpCenterData();
  const title = data?.title || "Help Center";
  const subtitle =
    data?.subtitle ||
    "Answers to common questions about purchases, downloads, and accounts.";
  const faqs = data?.faqs?.length
    ? data.faqs
    : [
        {
          question: "How do I download my purchase?",
          answer:
            "Go to My Downloads in your account and click the download button. Your link is available anytime.",
        },
        {
          question: "Can I use a product for multiple clients?",
          answer:
            "Each purchase is per project. If you need it for multiple clients, buy it again for each project.",
        },
        {
          question: "Where can I get support?",
          answer:
            "Use the Help Center contact form or email us at support@raeesvisuals.com.",
        },
      ];

  return (
    <div className="min-h-screen bg-dark">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark to-dark" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter/20 to-dark pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-primary/70 mt-3">{subtitle}</p>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={`${faq.question}-${index}`}
              className="bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                {faq.question}
              </h3>
              <p className="text-text-primary/70 mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-dark-lighter/60 border border-text-primary/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Need more help?
          </h3>
          <p className="text-text-primary/70">
            Email support@raeesvisuals.com and we’ll reply quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
