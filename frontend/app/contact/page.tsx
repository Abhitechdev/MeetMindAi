"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GradientBackground from "../components/gradient-background";

const SUPPORT_EMAIL = "meetmindai.help@zohomail.in";

const contactCategories = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    title: "General Support",
    description: "Technical issues, feature questions, or getting started help.",
    subject: "General Support",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: "Billing & Payments",
    description: "Subscription questions, refunds, or payment issues.",
    subject: "Billing Inquiry",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Privacy & Data",
    description: "Data deletion requests, privacy concerns, or GDPR inquiries.",
    subject: "Privacy Request",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: "Feedback & Ideas",
    description: "Feature requests, suggestions, or general feedback.",
    subject: "Feedback",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-6.135 23.848 23.848 0 01.158-2.946c.086-.553-.36-1.059-.92-1.059H5.707c-.56 0-1.006.506-.92 1.059.143.915.207 1.85.158 2.946a23.91 23.91 0 01-1.152 6.135C5.353 13.258 8.117 12.75 12 12.75zM9.75 8.25h4.5" />
      </svg>
    ),
    title: "Bug Reports",
    description: "Found something broken? Help us fix it.",
    subject: "Bug Report",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    title: "Partnerships",
    description: "Business collaborations, integrations, or media inquiries.",
    subject: "Partnership Inquiry",
  },
];

const faqs = [
  {
    q: "How quickly do you respond?",
    a: "We aim to respond within 24–48 hours on business days. Urgent billing or privacy matters are prioritized.",
  },
  {
    q: "Can I request my data to be deleted?",
    a: "Yes. Send us an email with the subject 'Data Deletion Request' and we'll process it within 72 hours.",
  },
  {
    q: "Is my meeting audio stored permanently?",
    a: "No. Audio files are processed in real-time and deleted immediately after transcription. Only the generated text is stored.",
  },
  {
    q: "How do I cancel or change my subscription?",
    a: "Email us with your account email and we'll assist with any plan changes or cancellations.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCategoryClick = (subject: string) => {
    setForm((prev) => ({ ...prev, subject }));
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) throw new Error("Missing Web3Forms Access Key");

      // ponytail: client-side fetch directly to web3forms (free plan requirement)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name,
          email: form.email,
          subject: `[Contact Form] ${form.subject} from ${form.name}`,
          message: form.message,
          from_name: "MeetMind AI Contact Form"
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" }); // Reset form
      setTimeout(() => setSent(false), 4000);
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try emailing us directly.");
    } finally {
      setSending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="relative min-h-screen">
      <GradientBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-medium tracking-wide uppercase mb-6">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            How Can We <span className="gradient-text">Help You?</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Have a question, found a bug, or just want to say hi? We&apos;re here to help.
            Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        {/* Email Badge */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => {
              navigator.clipboard.writeText(SUPPORT_EMAIL);
              setCopiedEmail(true);
              setTimeout(() => setCopiedEmail(false), 2000);
            }}
            className="group glass-card glass-card-hover flex items-center gap-3 px-6 py-3.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-purple/10 group-hover:bg-accent-purple/20 transition-colors">
              <svg className="h-5 w-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs text-muted font-medium uppercase tracking-wider">{copiedEmail ? "Copied to clipboard!" : "Email us anytime"}</p>
              <p className="text-sm font-semibold text-foreground group-hover:text-accent-purple transition-colors">
                {SUPPORT_EMAIL}
              </p>
            </div>
            {copiedEmail ? (
              <svg className="h-4 w-4 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-muted group-hover:text-accent-purple group-hover:translate-x-0.5 transition-all ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )}
          </button>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-xl font-semibold text-foreground text-center mb-8"
            variants={itemVariants}
          >
            What do you need help with?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactCategories.map((cat) => (
              <motion.button
                key={cat.title}
                variants={itemVariants}
                onClick={() => handleCategoryClick(cat.subject)}
                className={`glass-card glass-card-hover p-5 text-left group transition-all ${
                  form.subject === cat.subject
                    ? "border-accent-purple/40 bg-accent-purple/5"
                    : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg mb-3 transition-colors ${
                  form.subject === cat.subject
                    ? "bg-accent-purple/20 text-accent-purple"
                    : "bg-foreground/5 text-muted group-hover:bg-accent-purple/10 group-hover:text-accent-purple"
                }`}>
                  {cat.icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{cat.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{cat.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          id="contact-form"
          className="glass-card p-6 sm:p-8 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-1">Send us a Message</h2>
          <p className="text-sm text-muted mb-6">
            Fill in the form below and your email client will open with a pre-filled message.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-card-border bg-surface/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:border-accent-purple/50 focus:outline-none focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wider">
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-card-border bg-surface/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:border-accent-purple/50 focus:outline-none focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wider">
                Subject
              </label>
              <select
                id="contact-subject"
                required
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                className="w-full rounded-lg border border-card-border bg-surface/50 px-4 py-2.5 text-sm text-foreground focus:border-accent-purple/50 focus:outline-none focus:ring-1 focus:ring-accent-purple/30 transition-colors appearance-none"
              >
                <option value="" disabled>Select a topic...</option>
                {contactCategories.map((cat) => (
                  <option key={cat.subject} value={cat.subject}>
                    {cat.title}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="Tell us more about your question or issue..."
                className="w-full rounded-lg border border-card-border bg-surface/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:border-accent-purple/50 focus:outline-none focus:ring-1 focus:ring-accent-purple/30 transition-colors resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent-purple px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {sending ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending Message...
                </>
              ) : sent ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Message Sent!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="glass-card p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-purple/10 text-accent-purple text-[10px] font-bold mt-0.5">
                    Q
                  </span>
                  {faq.q}
                </h3>
                <p className="text-sm text-muted leading-relaxed pl-7">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-sm text-muted">
            Prefer email directly?{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent-purple hover:underline font-medium"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p className="text-xs text-muted/60 mt-2">
            We typically respond within 24–48 hours.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
