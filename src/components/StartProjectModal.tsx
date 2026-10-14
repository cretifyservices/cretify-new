import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Check, Sparkles, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStartProjectModal } from '../context/StartProjectModalContext';
import { useSound } from '../context/SoundContext';

export const StartProjectModal: React.FC = () => {
  const { isOpen, closeStartProjectModal } = useStartProjectModal();
  const { playPop, playSuccess, playSnap } = useSound();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['Website']);
  const [notes, setNotes] = useState('');

  const [isSavingStep2, setIsSavingStep2] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableServices = [
    'Website',
    'E-commerce',
    'Web App',
    'Logo & branding',
    'Video editing',
    'AI Automation'
  ];

  const handleClose = () => {
    playSnap();
    closeStartProjectModal();
    // Reset state after exit
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      setPhoneError('');
      setIsSavingStep2(false);
    }, 400);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playPop();
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (countryCode === '+91' && cleanPhone.length !== 10) {
      setPhoneError('ENTER A 10-DIGIT INDIAN MOBILE NUMBER.');
      return;
    }
    if (cleanPhone.length < 8) {
      setPhoneError('PLEASE ENTER A VALID PHONE NUMBER.');
      return;
    }

    setPhoneError('');
    setIsSavingStep2(true);
    playSnap();

    setTimeout(() => {
      setIsSavingStep2(false);
      setStep(3);
    }, 700);
  };

  const toggleService = (srv: string) => {
    playSnap();
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleStep3Next = () => {
    playPop();
    setStep(4);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // POST directly to Formspree so it drops immediately into the client's email
      const formspreePromise = fetch('https://formspree.io/f/xkjworpg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: `${countryCode} ${phone.trim()}`,
          services: selectedServices.join(', '),
          notes: notes.trim() || 'No additional notes provided.',
          _subject: `New Cretify Lead: ${name.trim()} (${countryCode} ${phone.trim()})`,
          submission_time: new Date().toLocaleString()
        })
      });

      // Also save to server.ts backend store for admin portal
      const localPromise = fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: `${countryCode} ${phone.trim()}`,
          services: selectedServices,
          notes: notes.trim()
        })
      });

      await Promise.allSettled([formspreePromise, localPromise]);
    } catch (err) {
      console.warn('Inquiry dispatch error:', err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    playSuccess();

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF5A00', '#6B4DFF', '#27E3A4', '#FF5DA2', '#FFC72C']
      });
    } catch {}
  };

  const getWhatsAppDirectUrl = () => {
    const text = encodeURIComponent(
      `Hey Cretify! I just filled out your project form:
• Name: ${name}
• Phone: ${countryCode} ${phone}
• Looking for: ${selectedServices.join(', ')}
${notes ? `• Details: ${notes}` : ''}

Looking forward to connecting!`
    );
    return `https://wa.me/917061899513?text=${text}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-[#14110F]/75 backdrop-blur-md"
      />

      {/* Modal Dialog Card (Matching reference video exactly) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 25 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-[480px] rounded-[28px] sm:rounded-[32px] bg-white border-3 border-[#14110F] p-5 sm:p-8 shadow-brutal-lg z-10 select-none overflow-hidden box-border"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#14110F] bg-white hover:bg-[#FF5A00] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-brutal-sm"
          aria-label="Close modal"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {!isSuccess ? (
          <div>
            {/* Step 1: WHAT SHOULD WE CALL YOU? */}
            {step === 1 && (
              <form onSubmit={handleStep1Next} className="flex flex-col gap-5 sm:gap-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-black block mb-1.5">
                    STEP 1 OF 4
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-3xl text-[#14110F] tracking-tight uppercase leading-tight">
                    WHAT SHOULD WE CALL YOU?
                  </h3>
                  <p className="font-space text-xs text-[#14110F]/65 mt-1 font-medium">
                    First name is plenty.
                  </p>
                </div>

                <input
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full min-w-0 px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus:bg-white focus:outline-none focus:border-[#FF5A00] font-space text-sm sm:text-base text-[#14110F] transition-all shadow-inner box-border"
                />

                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#FF5A00] disabled:bg-[#FF5A00]/50 text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#14110F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer"
                >
                  NEXT
                </button>
              </form>
            )}

            {/* Step 2: YOUR PHONE NUMBER? */}
            {step === 2 && (
              <form onSubmit={handleStep2Next} className="flex flex-col gap-5 sm:gap-6 w-full box-border">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-black block mb-1.5">
                    STEP 2 OF 4
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-3xl text-[#14110F] tracking-tight uppercase leading-tight">
                    YOUR PHONE NUMBER?
                  </h3>
                  <p className="font-space text-xs text-[#14110F]/65 mt-1 font-medium">
                    So we can reach you. We do not spam.
                  </p>
                </div>

                <div className="w-full box-border">
                  <div className="flex items-center w-full rounded-xl sm:rounded-2xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus-within:bg-white focus-within:border-[#FF5A00] transition-all shadow-inner overflow-hidden box-border">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="shrink-0 bg-transparent py-3 sm:py-3.5 pl-3 pr-2 font-mono text-xs font-bold text-[#14110F] focus:outline-none cursor-pointer border-r-2 border-[#14110F]/20 text-center"
                    >
                      <option value="+91">IN +91</option>
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+971">UAE +971</option>
                      <option value="+61">AU +61</option>
                      <option value="+65">SG +65</option>
                    </select>

                    <input
                      type="tel"
                      autoFocus
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) setPhoneError('');
                      }}
                      placeholder="10 digit mobile"
                      className="flex-1 min-w-0 w-0 bg-transparent px-3 py-3 sm:py-3.5 font-mono text-xs sm:text-base text-[#14110F] focus:outline-none placeholder:text-[#14110F]/40 border-0 outline-none"
                    />
                  </div>
                </div>

                {phoneError && (
                  <motion.span
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-[10px] sm:text-[11px] font-bold text-red-600 block -mt-2 sm:-mt-3 uppercase"
                  >
                    {phoneError}
                  </motion.span>
                )}

                <button
                  type="submit"
                  disabled={isSavingStep2}
                  className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#FF5A00] text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#14110F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSavingStep2 ? (
                    <span>SAVING...</span>
                  ) : (
                    <span>NEXT</span>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: WHAT ARE YOU LOOKING FOR? */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-black block mb-2">
                    STEP 3 OF 4
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-[#14110F] tracking-tight uppercase leading-tight">
                    WHAT ARE YOU LOOKING FOR?
                  </h3>
                  <p className="font-space text-xs text-[#14110F]/65 mt-1 font-medium">
                    Pick as many as you like.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {availableServices.map((srv) => {
                    const isSelected = selectedServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleService(srv)}
                        className={`px-4 py-2.5 rounded-full font-display font-bold text-xs uppercase tracking-wide border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF5A00] text-white border-[#14110F] shadow-brutal-sm'
                            : 'bg-[#FFF4E6] text-[#14110F] border-[#14110F]/30 hover:border-[#14110F]'
                        }`}
                      >
                        {srv}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleStep3Next}
                  className="w-full py-4 rounded-2xl bg-[#FF5A00] text-white font-display font-black text-sm uppercase tracking-wider border-2 border-[#14110F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer"
                >
                  NEXT
                </button>
              </div>
            )}

            {/* Step 4: REASON / NOTES */}
            {step === 4 && (
              <form onSubmit={handleSubmitFinal} className="flex flex-col gap-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-black block mb-2">
                    STEP 4 OF 4
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-[#14110F] tracking-tight uppercase leading-tight">
                    TELL US A BIT MORE
                  </h3>
                  <p className="font-space text-xs text-[#14110F]/65 mt-1 font-medium">
                    Any deadlines, reference links, or notes? (Optional)
                  </p>
                </div>

                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need to launch our new website in 2 weeks..."
                  className="w-full px-5 py-3 rounded-2xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus:bg-white focus:outline-none focus:border-[#FF5A00] font-space text-sm text-[#14110F] transition-all shadow-inner resize-none"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#FF5A00] text-white font-display font-black text-sm uppercase tracking-wider border-2 border-[#14110F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>LAUNCHING BRIEF...</span>
                  ) : (
                    <span>SUBMIT BRIEF 🚀</span>
                  )}
                </button>
              </form>
            )}

            {/* Step Dots Indicators: ● ○ ○ ○ */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3, 4].map((s) => (
                <span
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step === s
                      ? 'w-6 bg-[#FF5A00]'
                      : 'w-2 bg-[#14110F]/20'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Submission Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-4 gap-5"
          >
            <div className="w-16 h-16 rounded-full bg-[#27E3A4] text-white flex items-center justify-center border-2 border-[#14110F] shadow-brutal">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#27E3A4] font-black block mb-1">
                INQUIRY SAVED
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#14110F] tracking-tight uppercase">
                WE'VE GOT YOUR BRIEF, {name}!
              </h3>
              <p className="font-space text-xs sm:text-sm text-[#14110F]/75 mt-2 leading-relaxed">
                Our founders are already reviewing your project. We'll message you on WhatsApp at <strong className="text-[#FF5A00]">{countryCode} {phone}</strong> within 2 hours.
              </p>
            </div>

            <div className="w-full flex flex-col gap-3 pt-2">
              <a
                href={getWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playPop}
                className="w-full py-4 rounded-2xl bg-[#25D366] text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#14110F] shadow-brutal hover:shadow-brutal-sm flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle size={18} className="fill-white" />
                <span>Continue on WhatsApp Now</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-2xl bg-white border-2 border-[#14110F] text-[#14110F] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#FFF4E6] transition-all"
              >
                Done / Back to Website
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
