import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Mail, Phone, CheckCircle2, Send, Sparkles, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSound } from '../context/SoundContext';

export const ContactPage: React.FC = () => {
  const { playPop, playSuccess, playSnap } = useSound();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Website Development']);
  const [selectedBudget, setSelectedBudget] = useState<string>('₹50K – ₹1.5L / $1K – $3K');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const needsList = [
    'Website Development',
    'E-commerce Store',
    'Web App / Portal',
    'Maintenance Retainer',
    'Video & Motion Design',
    'Custom Automation'
  ];

  const budgetList = [
    '₹30K – ₹75K / < $1K',
    '₹75K – ₹2L / $1K – $3K',
    '₹2L – ₹5L / $3K – $7K',
    'Enterprise / Custom'
  ];

  const toggleNeed = (need: string) => {
    playSnap();
    if (selectedNeeds.includes(need)) {
      setSelectedNeeds(selectedNeeds.filter((n) => n !== need));
    } else {
      setSelectedNeeds([...selectedNeeds, need]);
    }
  };

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingForm(true);

    try {
      const formspreePromise = fetch('https://formspree.io/f/xkjworpg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Not provided',
          services: selectedNeeds.join(', '),
          budget: selectedBudget,
          message: formData.message,
          _subject: `New Detailed Brief from ${formData.name}`,
          submission_time: new Date().toLocaleString()
        })
      });

      const localPromise = fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone || formData.email,
          services: selectedNeeds,
          notes: `[Budget: ${selectedBudget}] Email: ${formData.email} - ${formData.message}`
        })
      });

      await Promise.allSettled([formspreePromise, localPromise]);
    } catch (err) {
      console.warn('Formspree dispatch error:', err);
    }

    setIsSubmittingForm(false);
    playSuccess();
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5A00', '#6B4DFF', '#27E3A4', '#FF5DA2']
      });
    } catch {}
  };

  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`Project Inquiry from ${formData.name || 'Client'}`);
    const body = encodeURIComponent(
      `Hi Cretify Team,

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Services Needed: ${selectedNeeds.join(', ')}
Budget: ${selectedBudget}

Message:
${formData.message}`
    );
    return `mailto:services@cretify.in?subject=${subject}&body=${body}`;
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hey Cretify! I'm interested in starting a project:
• Name: ${formData.name || 'Friend'}
• Services: ${selectedNeeds.join(', ')}
• Budget: ${selectedBudget}
• Note: ${formData.message || 'Looking forward to chatting!'}`
    );
    return `https://wa.me/917061899513?text=${text}`;
  };

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 sm:px-12 bg-[#FFF4E6] text-[#14110F]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
            LET'S COLLABORATE
          </span>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-[#14110F] tracking-tight mt-2">
            Start a{' '}
            <span className="font-serif-accent font-normal italic text-[#FF5A00]">
              project.
            </span>
          </h1>
          <p className="font-space text-base sm:text-lg text-[#14110F]/75 mt-4 max-w-xl mx-auto">
            Tell us about what you want to build. We review every brief within 24 hours and respond with clear next steps and timeline estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[36px] bg-white border-4 border-[#14110F] p-8 sm:p-12 shadow-brutal">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Select what you need as selectable chips */}
                    <div className="flex flex-col gap-3">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#14110F]/60 font-semibold">
                        What do you need built? (Select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {needsList.map((need) => {
                          const isSelected = selectedNeeds.includes(need);
                          return (
                            <button
                              key={need}
                              type="button"
                              onClick={() => toggleNeed(need)}
                              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#FF5A00] text-white border-[#FF5A00] shadow-brutal-sm'
                                  : 'bg-[#FFF4E6] text-[#14110F] border-[#14110F]/20 hover:border-[#14110F]'
                              }`}
                            >
                              {need}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Budget Range Chips */}
                    <div className="flex flex-col gap-3">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#14110F]/60 font-semibold">
                        Estimated Budget Bracket
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {budgetList.map((budget) => {
                          const isSelected = selectedBudget === budget;
                          return (
                            <button
                              key={budget}
                              type="button"
                              onClick={() => {
                                playSnap();
                                setSelectedBudget(budget);
                              }}
                              className={`p-3 rounded-xl text-xs font-mono border-2 text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#14110F] text-[#FFF4E6] border-[#14110F] shadow-brutal-sm font-bold'
                                  : 'bg-white text-[#14110F]/80 border-[#14110F]/20 hover:border-[#14110F]'
                              }`}
                            >
                              {budget}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-xs text-[#14110F]/70 font-semibold">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus:bg-white focus:outline-none focus:border-[#FF5A00] font-space text-sm"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-xs text-[#14110F]/70 font-semibold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus:bg-white focus:outline-none focus:border-[#FF5A00] font-space text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-[#14110F]/70 font-semibold">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 or international code"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus:bg-white focus:outline-none focus:border-[#FF5A00] font-space text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-[#14110F]/70 font-semibold">
                        Tell us about the project *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="What are your goals? Any deadlines or inspirations you love?"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus:bg-white focus:outline-none focus:border-[#FF5A00] font-space text-sm resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingForm}
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF5A00] disabled:bg-[#FF5A00]/60 text-white font-display font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                      >
                        <Send size={16} />
                        <span>{isSubmittingForm ? 'Sending to Inbox...' : 'Send Project Brief'}</span>
                      </button>

                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#25D366] text-white font-display font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-brutal-sm hover:shadow-brutal transition-all"
                      >
                        <MessageCircle size={16} className="fill-white" />
                        <span>Send via WhatsApp</span>
                      </a>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 gap-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#27E3A4] text-white flex items-center justify-center shadow-brutal">
                      <CheckCircle2 size={40} />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-3xl text-[#14110F]">
                        Brief Received! 🎉
                      </h3>
                      <p className="font-space text-base text-[#14110F]/80 mt-2 max-w-md">
                        Thank you, {formData.name || 'friend'}! We're already reviewing your requirements and will reply to <span className="font-bold text-[#FF5A00]">{formData.email || 'your inbox'}</span> within 24 hours.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={getMailtoUrl()}
                        className="px-6 py-3 rounded-full bg-[#14110F] text-[#FFF4E6] font-display font-bold text-xs uppercase tracking-wide shadow-brutal-sm flex items-center gap-2"
                      >
                        <Mail size={16} />
                        <span>Open in Email App</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-3 rounded-full bg-white border-2 border-[#14110F] text-[#14110F] font-display font-bold text-xs uppercase tracking-wide"
                      >
                        Send Another Note
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Direct Contact Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Direct WhatsApp Card */}
            <div className="p-8 rounded-[32px] bg-[#14110F] text-[#FFF4E6] border-3 border-[#14110F] shadow-brutal flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#25D366] font-bold">
                FASTEST RESPONSE
              </span>
              <h3 className="font-display font-black text-2xl text-white">
                Chat Directly on WhatsApp
              </h3>
              <p className="font-space text-sm text-[#FFF4E6]/75 leading-relaxed">
                Skip the formalities. Send a voice note, Figma link, or quick message straight to our engineering team.
              </p>
              <div className="pt-2 flex flex-col gap-2 font-mono text-xs text-[#FFF4E6]/90">
                <div className="flex items-center gap-2 text-[#25D366]">
                  <Phone size={14} />
                  <span>+91 70618 99513</span>
                </div>
                <div className="flex items-center gap-2 text-[#25D366]">
                  <Phone size={14} />
                  <span>+91 74850 94642</span>
                </div>
              </div>
              <a
                href="https://wa.me/917061899513?text=Hey%20Cretify!%20Let's%20talk%20about%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                onClick={playPop}
                className="mt-2 w-full py-3.5 px-6 rounded-full bg-[#25D366] text-white font-display font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-brutal-sm hover:brightness-110 transition-all"
              >
                <MessageCircle size={16} className="fill-white" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Direct Email Card */}
            <div className="p-8 rounded-[32px] bg-white border-3 border-[#14110F] shadow-brutal flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-bold">
                OFFICIAL INBOX
              </span>
              <h3 className="font-display font-black text-2xl text-[#14110F]">
                Email Us Directly
              </h3>
              <p className="font-space text-sm text-[#14110F]/75 leading-relaxed">
                Prefer sending a formal RFP or PDF scope of work? Drop us a note anytime.
              </p>
              <a
                href="mailto:services@cretify.in"
                className="font-mono font-bold text-base text-[#FF5A00] hover:underline flex items-center gap-2"
              >
                <Mail size={16} />
                <span>services@cretify.in</span>
              </a>
              <span className="font-mono text-xs text-[#14110F]/50">
                Guaranteed human reply within 24 hours.
              </span>
            </div>

            {/* Studio Hours */}
            <div className="p-6 rounded-[24px] bg-[#FFF4E6] border-2 border-[#14110F] flex items-center justify-between">
              <div>
                <span className="font-display font-bold text-sm text-[#14110F] block">
                  Studio Hours
                </span>
                <span className="font-mono text-xs text-[#14110F]/60">
                  Mon – Fri: 10:00 AM – 7:30 PM IST
                </span>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
