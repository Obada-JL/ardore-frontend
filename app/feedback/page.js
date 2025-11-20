"use client";

import { useState, useEffect } from "react";
import { feedbackAPI } from "@/lib/api";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function FeedbackPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    perfumeCode: "",
    answers: {
      q2: "", // Buy again/recommend
      q3: "", // Price vs Quality
      q3Other: "", // Price vs Quality other text
      q4: "", // Bottle/Packaging rating (1-5)
      q5: "", // Fragrance strength rating (1-5)
      q6: "", // Fragrance scent rating (1-5)
      q7: "", // Longevity
      q8: "", // Perfume size
      q8Other: "", // Perfume size other text
      q9: "", // Comments
    },
  });

  // Load messages when language is selected
  useEffect(() => {
    if (selectedLanguage) {
      loadMessages(selectedLanguage);
    }
  }, [selectedLanguage]);

  const loadMessages = async (locale) => {
    try {
      const response = await fetch(`/api/feedback-messages?locale=${locale}`);
      if (!response.ok) {
        throw new Error("Failed to load messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Failed to load language data");
    }
  };

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
  };

  const handleAnswerChange = (questionKey, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        answers: {
          ...prev.answers,
          [questionKey]: value,
        },
      };
      console.log(
        `Updated ${questionKey}:`,
        value,
        "Full answers:",
        updated.answers
      );
      return updated;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const t = messages?.feedback || {};

    // Validate required fields
    if (!formData.perfumeCode) {
      setError(
        t.form?.perfumeCode
          ? `${t.form.perfumeCode} ${t.form?.required || "is required"}`
          : "Perfume code is required"
      );
      setLoading(false);
      return;
    }

    if (!formData.answers.q2) {
      setError(
        t.questions?.q2
          ? `${t.questions.q2} ${t.form?.required || "is required"}`
          : "Question 2 is required"
      );
      setLoading(false);
      return;
    }

    if (!formData.answers.q3) {
      setError(
        t.questions?.q3
          ? `${t.questions.q3} ${t.form?.required || "is required"}`
          : "Question 3 is required"
      );
      setLoading(false);
      return;
    }

    // Prepare answers object, filtering out empty values except for q3Other and q8Other
    const answersToSubmit = {
      q1: formData.perfumeCode,
      q2: formData.answers.q2,
      q3: formData.answers.q3,
      ...(formData.answers.q3Other && { q3Other: formData.answers.q3Other }),
      ...(formData.answers.q4 && { q4: formData.answers.q4 }),
      ...(formData.answers.q5 && { q5: formData.answers.q5 }),
      ...(formData.answers.q6 && { q6: formData.answers.q6 }),
      ...(formData.answers.q7 && { q7: formData.answers.q7 }),
      ...(formData.answers.q8 && { q8: formData.answers.q8 }),
      ...(formData.answers.q8Other && { q8Other: formData.answers.q8Other }),
      ...(formData.answers.q9 && { q9: formData.answers.q9 }),
    };

    console.log("Submitting feedback:", {
      language: selectedLanguage,
      answers: answersToSubmit,
      userName: formData.name || undefined,
    });

    try {
      await feedbackAPI.createFeedback({
        language: selectedLanguage,
        answers: answersToSubmit,
        userName: formData.name || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(
        messages?.feedback?.form?.errorMessage || "Failed to submit feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen font-serif text-white bg-gradient-to-b from-black to-[#050505] flex items-center justify-center p-4 bg-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[#e8b600]/5 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8b600]/30 to-transparent"></div>

        <div className="max-w-md w-full bg-gradient-to-b from-[#0a0a0a] to-[#111] border border-[#e8b600]/50 p-8 relative z-10 shadow-xl shadow-black/50">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#e8b600]/50"></div>
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#e8b600]/50"></div>
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#e8b600]/50"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#e8b600]/50"></div>

          <h1 className="text-3xl font-light text-white mb-2 text-center">
            Feedback
          </h1>
          <div className="w-16 h-px bg-[#e8b600]/50 mx-auto mb-6"></div>
          <p className="text-gray-400 mb-8 text-center">
            Please select your preferred language to continue
          </p>
          <div className="space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="w-full flex items-center justify-between p-4 border border-[#e8b600]/50 bg-black/30 hover:border-[#e8b600] hover:bg-black/50 transition-all duration-300 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#e8b600]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="text-2xl relative z-10">{lang.flag}</span>
                <span className="text-lg font-light text-white group-hover:text-[#e8b600] transition-colors duration-300 relative z-10">
                  {lang.name}
                </span>
                <span className="text-gray-400 group-hover:text-[#e8b600] transition-colors duration-300 relative z-10">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!messages) {
    return (
      <div className="min-h-screen font-serif text-white bg-gradient-to-b from-black to-[#050505] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e8b600] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#e8b600]">Loading...</p>
        </div>
      </div>
    );
  }

  const t = messages.feedback || {};
  const dir = selectedLanguage === "ar" ? "rtl" : "ltr";

  if (submitted) {
    return (
      <div
        className="min-h-screen font-serif text-white bg-gradient-to-b from-black to-[#050505] flex items-center justify-center p-4 bg-black relative overflow-hidden"
        dir={dir}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-[#e8b600]/5 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8b600]/30 to-transparent"></div>

        <div className="max-w-md w-full bg-gradient-to-b from-[#0a0a0a] to-[#111] border border-[#e8b600]/50 p-8 text-center relative z-10 shadow-xl shadow-black/50">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#e8b600]/50"></div>
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#e8b600]/50"></div>
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#e8b600]/50"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#e8b600]/50"></div>

          <div className="text-[#e8b600] text-4xl mb-4 animate-pulse-slow">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-2xl font-light text-white mb-2">
            {t.form?.success || "Thank you!"}
          </h2>
          <div className="w-16 h-px bg-[#e8b600]/50 mx-auto mb-4"></div>
          <p className="text-gray-400 mb-6">
            {t.form?.successMessage ||
              "Your feedback has been submitted successfully."}
          </p>
          <button
            onClick={() => {
              setSelectedLanguage(null);
              setMessages(null);
              setSubmitted(false);
              setFormData({
                name: "",
                perfumeCode: "",
                answers: {
                  q2: "",
                  q3: "",
                  q3Other: "",
                  q4: "",
                  q5: "",
                  q6: "",
                  q7: "",
                  q8: "",
                  q8Other: "",
                  q9: "",
                },
              });
            }}
            className="bg-[#e8b600] text-black px-6 py-2 hover:bg-white transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
          >
            <span className="relative z-10">Submit Another</span>
            <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-serif text-white bg-gradient-to-b from-black to-[#050505] py-12 px-4 bg-black relative overflow-hidden"
      dir={dir}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#e8b600]/5 mix-blend-overlay"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8b600]/30 to-transparent"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-[#111] border border-[#e8b600]/50 p-8 shadow-xl shadow-black/50 relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#e8b600]/50"></div>
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#e8b600]/50"></div>
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#e8b600]/50"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#e8b600]/50"></div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-light text-white">
              {t.title || "Feedback"}
            </h1>
            <button
              onClick={() => {
                setSelectedLanguage(null);
                setMessages(null);
                setFormData({
                  name: "",
                  perfumeCode: "",
                  answers: {
                    q2: "",
                    q3: "",
                    q3Other: "",
                    q4: "",
                    q5: "",
                    q6: "",
                    q7: "",
                    q8: "",
                    q8Other: "",
                    q9: "",
                  },
                });
              }}
              className="text-gray-400 hover:text-[#e8b600] text-sm transition-colors duration-300"
            >
              {selectedLanguage === "ar"
                ? "← تغيير اللغة"
                : "Change Language →"}
            </button>
          </div>
          <div className="w-24 h-px bg-[#e8b600]/50 mb-6"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name (Optional) */}
            <div>
              <label className="block text-sm font-light text-gray-300 mb-2">
                {t.form?.name || "Name (Optional)"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t.form?.namePlaceholder || "Enter your name"}
                className="w-full bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300"
              />
            </div>

            {/* Question 1: Perfume Code (Required) */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q1 || "What perfume code are you using?"}{" "}
                <span className="text-[#e8b600]">*</span>
              </label>
              <input
                type="text"
                value={formData.perfumeCode}
                onChange={(e) =>
                  handleInputChange("perfumeCode", e.target.value)
                }
                placeholder={
                  t.form?.perfumeCodePlaceholder || "Enter perfume code"
                }
                required
                className="w-full bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300"
              />
            </div>

            {/* Question 2: Buy again/Recommend */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q2 ||
                  "Will you buy again or recommend to others?"}{" "}
                <span className="text-[#e8b600]">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {["definitely", "maybe", "no"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswerChange("q2", option)}
                    className={`p-3 border transition-all duration-300 ${
                      formData.answers.q2 === option
                        ? "border-[#e8b600] bg-black/50 text-[#e8b600]"
                        : "border-[#e8b600]/50 bg-black/30 text-gray-300 hover:border-[#e8b600] hover:text-white"
                    }`}
                  >
                    {t.answers?.[option] || option}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Price vs Quality */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q3 ||
                  "Do you think the price is appropriate for the quality?"}{" "}
                <span className="text-[#e8b600]">*</span>
              </label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {["definitely", "no", "other"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswerChange("q3", option)}
                      className={`p-3 border transition-all duration-300 ${
                        formData.answers.q3 === option
                          ? "border-[#e8b600] bg-black/50 text-[#e8b600]"
                          : "border-[#e8b600]/50 bg-black/30 text-gray-300 hover:border-[#e8b600] hover:text-white"
                      }`}
                    >
                      {t.answers?.[option] || option}
                    </button>
                  ))}
                </div>
                {formData.answers.q3 === "other" && (
                  <input
                    type="text"
                    value={formData.answers.q3Other || ""}
                    onChange={(e) =>
                      handleAnswerChange("q3Other", e.target.value)
                    }
                    placeholder="Please specify..."
                    className="w-full bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300 mt-2"
                  />
                )}
              </div>
            </div>

            {/* Question 4: Bottle/Packaging Rating (1-5) */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q4 || "Rate the bottle and packaging?"}{" "}
                <span className="text-[#e8b600]">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleAnswerChange("q4", rating.toString())}
                    className={`p-4 border transition-all duration-300 text-xl ${
                      formData.answers.q4 === rating.toString()
                        ? "border-[#e8b600] bg-black/50 text-[#e8b600]"
                        : "border-[#e8b600]/50 bg-black/30 text-gray-300 hover:border-[#e8b600] hover:text-white"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 5: Fragrance Strength Rating (1-5) */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q5 || "Rate the fragrance strength/spread?"}{" "}
                <span className="text-[#e8b600]">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleAnswerChange("q5", rating.toString())}
                    className={`p-4 border transition-all duration-300 text-xl ${
                      formData.answers.q5 === rating.toString()
                        ? "border-[#e8b600] bg-black/50 text-[#e8b600]"
                        : "border-[#e8b600]/50 bg-black/30 text-gray-300 hover:border-[#e8b600] hover:text-white"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 6: Fragrance Scent Rating (1-5) */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q6 || "Rate the fragrance scent?"}{" "}
                <span className="text-[#e8b600]">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleAnswerChange("q6", rating.toString())}
                    className={`p-4 border transition-all duration-300 text-xl ${
                      formData.answers.q6 === rating.toString()
                        ? "border-[#e8b600] bg-black/50 text-[#e8b600]"
                        : "border-[#e8b600]/50 bg-black/30 text-gray-300 hover:border-[#e8b600] hover:text-white"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 7: Longevity */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q7 ||
                  "How would you describe the fragrance longevity (how many hours does it last)?"}{" "}
                <span className="text-[#e8b600]">*</span>
              </label>
              <input
                type="text"
                value={formData.answers.q7 || ""}
                onChange={(e) => handleAnswerChange("q7", e.target.value)}
                placeholder={
                  t.form?.longevityPlaceholder ||
                  "How many hours does the fragrance last?"
                }
                className="w-full bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300"
              />
            </div>

            {/* Question 8: Perfume Size */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q8 || "What size perfume are you using?"}{" "}
                <span className="text-[#e8b600]">*</span>
              </label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "size100ml",
                    "size50ml",
                    "size50mlB",
                    "sizeSmall",
                    "other",
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswerChange("q8", option)}
                      className={`p-3 border transition-all duration-300 ${
                        formData.answers.q8 === option
                          ? "border-[#e8b600] bg-black/50 text-[#e8b600]"
                          : "border-[#e8b600]/50 bg-black/30 text-gray-300 hover:border-[#e8b600] hover:text-white"
                      }`}
                    >
                      {t.answers?.[option] || option}
                    </button>
                  ))}
                </div>
                {formData.answers.q8 === "other" && (
                  <input
                    type="text"
                    value={formData.answers.q8Other || ""}
                    onChange={(e) =>
                      handleAnswerChange("q8Other", e.target.value)
                    }
                    placeholder="Please specify..."
                    className="w-full bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300 mt-2"
                  />
                )}
              </div>
            </div>

            {/* Question 9: Comments/Suggestions */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                {t.questions?.q9 ||
                  "Your opinion matters! Share any notes or suggestions"}
              </label>
              <textarea
                value={formData.answers.q9 || ""}
                onChange={(e) => handleAnswerChange("q9", e.target.value)}
                placeholder={t.questions?.q9 || "Please share your thoughts..."}
                rows={4}
                className="w-full bg-black/50 border border-[#e8b600]/50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8b600] focus:border-transparent text-white focus:bg-black/80 transition-all duration-300"
              />
            </div>

            {error && (
              <div className="border border-red-500/50 bg-red-500/10 text-red-300 px-4 py-3">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e8b600] text-black py-3 font-light hover:bg-white hover:text-[#e8b600] transition-all duration-300 shadow-lg shadow-[#e8b600]/20 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e8b600]/30 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="relative z-10">
                {loading
                  ? t.form?.submitting || "Submitting..."
                  : t.form?.submit || "Submit Feedback"}
              </span>
              <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"></span>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
