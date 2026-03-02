"use client";
import { useState, useMemo } from "react";
import { faqs } from "../../mocks/faqs";
import { mockLabs } from "../../mocks/labs";
import Header from "@/components/header";

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedLabId, setSelectedLabId] = useState<string>("all");

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = useMemo(() => {
    if (selectedLabId === "all") return faqs;
    return faqs.filter((faq) => faq.labId === selectedLabId);
  }, [selectedLabId]);

  return (
    <>
      <Header />
      <section className="py-24 dark:bg-gray-900 min-h-screen transition-colors duration-300 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-y-10 lg:flex-row lg:gap-x-16 xl:gap-24 items-start">

            {/* Content Section */}
            <div className="w-full">
              <div className="mb-8 text-center lg:text-left">
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-semibold mb-4 tracking-wide uppercase">
                  Support Center
                </span>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                  Frequently Asked <span className="text-indigo-600 dark:text-indigo-400">Questions</span>
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Find answers related to our specific labs or general inquiries.
                </p>
              </div>

              {/* Lab Filter */}
              <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedLabId("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${selectedLabId === "all"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-700"
                      }`}
                  >
                    All Labs
                  </button>
                  {mockLabs.map((lab) => (
                    <button
                      key={lab.id}
                      onClick={() => setSelectedLabId(lab.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${selectedLabId === lab.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-700"
                        }`}
                    >
                      {lab.shortName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className={`group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg dark:hover:shadow-indigo-900/10 ${openIndex === index ? "ring-2 ring-indigo-50 dark:ring-indigo-900/20 border-transparent shadow-md" : ""
                        }`}
                    >
                      <button
                        className="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none"
                        onClick={() => toggleAccordion(index)}
                      >
                        <span className={`text-lg font-medium transition-colors duration-300 pr-4 ${openIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                          }`}>
                          {faq.question}
                        </span>
                        <span className={`flex-shrink-0 ml-4 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                          <svg
                            className={`w-6 h-6 ${openIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                      >
                        <div className="px-6 pb-6 text-base text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No FAQs found for this lab yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}


