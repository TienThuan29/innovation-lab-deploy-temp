"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Progress,
  Badge,
} from "flowbite-react";
import Image from "next/image";
import Header from "@/components/header";
import { mockLabs } from "@/mocks/labs";
import { TargetRole } from "@/types/application";
import { useToast } from "@/contexts/ToastContext";

type StepKey = 0 | 1 | 2 | 3;

function JoinLabApplicationContent() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<StepKey>(0);
  const [formData, setFormData] = useState({
    labId: "",
    applicantEmail: "",
    targetRole: "" as TargetRole | "",
    selfDescription: "",
    motivation: "",
    skills: "",
    portfolioUrl: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill labId from query parameter
  useEffect(() => {
    const labIdFromQuery = searchParams.get("labId");
    if (labIdFromQuery && !formData.labId) {
      // Verify that the lab exists and is active
      const lab = mockLabs.find(
        (lab) => lab.id === labIdFromQuery && lab.status === "ACTIVE",
      );
      if (lab) {
        setFormData((prev) => ({ ...prev, labId: labIdFromQuery }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const selectedLab = useMemo(
    () => mockLabs.find((lab) => lab.id === formData.labId),
    [formData.labId],
  );

  const steps = [
    { title: "Choose Lab & Target Role", desc: "Pick a lab & role" },
    { title: "Contact Information", desc: "Email & portfolio" },
    { title: "Self Description", desc: "Background & motivation" },
    { title: "Motivation", desc: "Upload & submit" },
    { title: "Skills & Experience", desc: "Upload & submit" },
    { title: "CV / Resume", desc: "Upload & submit" },
  ];

  const completion = Math.round(((step + 1) / steps.length) * 100);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.showError("File size must be less than 10MB");
        return;
      }
      if (file.type !== "application/pdf") {
        toast.showError("Please upload a PDF file");
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const isStepValid = (s: StepKey) => {
    if (s === 0) return !!formData.labId && !!formData.targetRole;
    if (s === 1) return !!formData.applicantEmail;
    if (s === 2)
      return (
        !!formData.selfDescription && !!formData.motivation && !!formData.skills
      );
    if (s === 3) return !!cvFile;
    return true;
  };

  const goNext = () => {
    if (!isStepValid(step)) {
      toast.showWarning("Please complete required fields before continuing.");
      return;
    }
    setStep((prev) => (prev < 3 ? ((prev + 1) as StepKey) : prev));
  };

  const goBack = () =>
    setStep((prev) => (prev > 0 ? ((prev - 1) as StepKey) : prev));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid(3)) {
      toast.showWarning("Please upload your CV (PDF) before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Form data:", formData);
      console.log("CV file:", cvFile);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.showSuccess(
        "Application submitted successfully! We will review your application and get back to you soon.",
      );

      setFormData({
        labId: "",
        applicantEmail: "",
        targetRole: "" as TargetRole | "",
        selfDescription: "",
        motivation: "",
        skills: "",
        portfolioUrl: "",
      });
      setCvFile(null);
      setCvFileName("");
      setStep(0);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.showError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabels: Record<string, string> = {
    STUDENT: "Student",
    RESEARCH_ASSISTANT: "Research Assistant",
  };

  const formattedRole =
    (formData.targetRole ?? "")
      .split(",")
      .map((role) => roleLabels[role.trim()] || role.trim())
      .filter(Boolean)
      .join(". ") || "Not selected";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* HERO */}
        <section className="relative -mt-36 flex h-[500px] w-full items-center justify-center overflow-hidden pt-36 md:h-[600px]">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop"
              alt="Laboratory research"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
          </div>
          <div className="max-w-8xl relative z-10 mx-auto flex w-full flex-col items-center gap-4 px-4 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              <Badge
                color="info"
                className="rounded-full border-0 bg-blue-600/90 px-3 py-1 text-white"
              >
                AI-First Research Workflow
              </Badge>
              <Badge
                color="gray"
                className="rounded-full border-0 bg-white/90 px-3 py-1 text-gray-900"
              >
                Reproducible
              </Badge>
              <Badge
                color="gray"
                className="rounded-full border-0 bg-white/90 px-3 py-1 text-gray-900"
              >
                Cost-Optimized
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Join Our Lab
            </h1>
            <p className="max-w-2xl text-base text-white/90 md:text-lg">
              Join one of our specialized laboratories and collaborate with
              researchers, work on cutting-edge projects, and contribute to
              impactful innovation.
            </p>
          </div>
        </section>

        <div className="max-w-8xl container mx-auto px-4 pt-10 pb-16">
          {/* PROGRESS + STEPS */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Step {step + 1}/{steps.length}:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {steps[step].title}
                </span>
                <span className="ml-2 hidden sm:inline">
                  — {steps[step].desc}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {completion}%
              </div>
            </div>
            <Progress progress={completion} />
            <ol className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {steps.map((st, idx) => {
                const active = idx === step;
                const done = idx < step;
                return (
                  <li
                    key={st.title}
                    className={[
                      "rounded-lg border px-2 py-1.5 text-xs transition",
                      active
                        ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : done
                          ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                          : "border-gray-200 bg-white/60 dark:border-gray-700 dark:bg-gray-800/60",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={[
                          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          active
                            ? "bg-blue-600 text-white"
                            : done
                              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
                        ].join(" ")}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate font-medium text-gray-900 dark:text-white">
                        {st.title}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* 2-COLUMN */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
            {/* FORM */}
            <div className="xl:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10 dark:border-gray-700 dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* STEP 0 */}
                  {step === 0 && (
                    <>
                      <div>
                        <Label htmlFor="labId" className="mb-2 block">
                          Select Laboratory{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          id="labId"
                          name="labId"
                          value={formData.labId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Choose a laboratory</option>
                          {mockLabs
                            .filter((lab) => lab.status === "ACTIVE")
                            .map((lab) => (
                              <option key={lab.id} value={lab.id}>
                                {lab.name} ({lab.shortName})
                              </option>
                            ))}
                        </Select>

                        {/* {selectedLab && (
                          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {selectedLab.name} ({selectedLab.shortName})
                            </div>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {selectedLab.description}
                            </div>
                          </div>
                        )} */}
                      </div>

                      <div>
                        <Label className="mb-3 block">
                          Target Role <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {[
                            {
                              id: "STUDENT",
                              label: "Student",
                              hint: "Learn & contribute to ongoing projects",
                            },
                            {
                              id: "RESEARCH_ASSISTANT",
                              label: "Research Assistant",
                              hint: "Help experiments, papers, and tooling",
                            },
                          ].map((r) => {
                            const checked =
                              formData.targetRole === (r.id as TargetRole);
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() =>
                                  setFormData((p) => ({
                                    ...p,
                                    targetRole: r.id as TargetRole,
                                  }))
                                }
                                className={[
                                  "rounded-xl border p-4 text-left transition",
                                  checked
                                    ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40",
                                ].join(" ")}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {r.label}
                                  </div>
                                  <div
                                    className={
                                      checked
                                        ? "h-3 w-3 rounded-full bg-blue-600"
                                        : "h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600"
                                    }
                                  />
                                </div>
                                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  {r.hint}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {/* hidden input để giữ required semantics */}
                        <input
                          type="text"
                          name="targetRole"
                          value={formData.targetRole}
                          readOnly
                          required
                          className="hidden"
                        />
                      </div>
                    </>
                  )}

                  {/* STEP 1 */}
                  {step === 1 && (
                    <>
                      <div>
                        <Label htmlFor="applicantEmail" className="mb-2 block">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <TextInput
                          id="applicantEmail"
                          name="applicantEmail"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.applicantEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="portfolioUrl" className="mb-2 block">
                          Portfolio URL{" "}
                          <span className="text-gray-500">(Optional)</span>
                        </Label>
                        <TextInput
                          id="portfolioUrl"
                          name="portfolioUrl"
                          type="url"
                          placeholder="https://github.com/yourname"
                          value={formData.portfolioUrl}
                          onChange={handleInputChange}
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          GitHub / Google Scholar / personal site…
                        </p>
                      </div>
                    </>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <>
                      <div>
                        <Label htmlFor="selfDescription" className="mb-2 block">
                          Self Description{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="selfDescription"
                          name="selfDescription"
                          placeholder="Tell us about yourself, your background, and interests..."
                          value={formData.selfDescription}
                          onChange={handleInputChange}
                          required
                          rows={4}
                        />
                        <div className="mt-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Brief intro about you</span>
                          <span>{formData.selfDescription.length}/600</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="motivation" className="mb-2 block">
                          Motivation <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="motivation"
                          name="motivation"
                          placeholder="Why do you want to join this laboratory?"
                          value={formData.motivation}
                          onChange={handleInputChange}
                          required
                          rows={4}
                        />
                        <div className="mt-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Your motivation</span>
                          <span>{formData.motivation.length}/800</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="skills" className="mb-2 block">
                          Skills <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="skills"
                          name="skills"
                          placeholder="List your technical skills, tools, and relevant experience..."
                          value={formData.skills}
                          onChange={handleInputChange}
                          required
                          rows={4}
                        />
                        <div className="mt-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Relevant skills</span>
                          <span>{formData.skills.length}/800</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <>
                      <div>
                        <Label htmlFor="cvFile" className="mb-2 block">
                          CV / Resume (PDF){" "}
                          <span className="text-red-500">*</span>
                        </Label>

                        <label
                          htmlFor="cvFile"
                          className="block cursor-pointer rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/40"
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {cvFileName
                              ? "File selected:"
                              : "Drop your PDF here, or click to upload"}
                          </div>
                          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {cvFileName ? cvFileName : "Max 10MB · PDF only"}
                          </div>

                          <input
                            type="file"
                            id="cvFile"
                            name="cvFile"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            required={step === 3}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-4">
                                                <div className="font-semibold text-gray-900 dark:text-white mb-2">Review</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                    <div><span className="font-medium">Lab:</span> {selectedLab ? `${selectedLab.name} (${selectedLab.shortName})` : '-'}</div>
                                                    <div><span className="font-medium">Role:</span> {formData.targetRole || '-'}</div>
                                                    <div><span className="font-medium">Email:</span> {formData.applicantEmail || '-'}</div>
                                                    <div><span className="font-medium">Portfolio:</span> {formData.portfolioUrl || '-'}</div>
                                                </div>
                                            </div> */}
                    </>
                  )}

                  {/* NAV */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                    <Button
                      type="button"
                      color="gray"
                      onClick={goBack}
                      disabled={step === 0}
                    >
                      Back
                    </Button>

                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={goNext}
                        className="sm:min-w-[160px]"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer border-0 from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 sm:min-w-[200px]"
                        size="xl"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    )}
                  </div>

                  {/* <div className="pt-2 text-center">
                    <Link
                      href="/"
                      className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      ← Back to Home
                    </Link>
                  </div> */}
                </form>
              </div>
            </div>

            {/* PDF PREVIEW */}
            <aside className="xl:col-span-3">
              <div className="xl:sticky xl:top-28">
                <div className="rounded-2xl border border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-800">
                  {/* PDF Header Bar */}
                  <div className="mb-0 flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Application Preview
                    </div>
                  </div>

                  {/* PDF Content */}
                  <div className="max-h-[calc(100vh-200px)] min-h-[600px] overflow-y-auto rounded-b-lg bg-white p-6 shadow-inner dark:bg-gray-900">
                    {/* Document Header */}
                    <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
                      <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
                        Laboratory Application Form Preview
                      </h1>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Please, check the information below to ensure accuracy
                        before submitting your application!
                      </p>
                    </div>

                    {/* Application Information */}
                    <div className="space-y-6">
                      {/* Lab Information */}
                      <div>
                        <h2 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Laboratory Information
                        </h2>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Selected Laboratory:
                            </span>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                              {selectedLab
                                ? `${selectedLab.name} (${selectedLab.shortName})`
                                : "Not selected"}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Target Role:
                            </span>
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                              {formattedRole}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h2 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Contact Information
                        </h2>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Email Address:
                            </span>
                            <p className="text-base text-gray-900 dark:text-white">
                              {formData.applicantEmail || "Not provided"}
                            </p>
                          </div>
                          {formData.portfolioUrl && (
                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Portfolio URL:
                              </span>
                              <p className="text-base break-all text-blue-600 dark:text-blue-400">
                                {formData.portfolioUrl}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Self Description */}
                      {formData.selfDescription && (
                        <div>
                          <h2 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            Self Description
                          </h2>
                          <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-white">
                            {formData.selfDescription}
                          </p>
                        </div>
                      )}

                      {/* Motivation */}
                      {formData.motivation && (
                        <div>
                          <h2 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            Motivation
                          </h2>
                          <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-white">
                            {formData.motivation}
                          </p>
                        </div>
                      )}

                      {/* Skills */}
                      {formData.skills && (
                        <div>
                          <h2 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                            Skills & Experience
                          </h2>
                          <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-white">
                            {formData.skills}
                          </p>
                        </div>
                      )}

                      {/* CV File */}
                      <div>
                        <h2 className="mb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Attachments
                        </h2>
                        <p className="text-base text-gray-900 dark:text-white">
                          {cvFileName
                            ? `CV/Resume: ${cvFileName}`
                            : "No CV uploaded"}
                        </p>
                      </div>

                      {/* Empty State */}
                      {!formData.labId &&
                        !formData.applicantEmail &&
                        !formData.selfDescription && (
                          <div className="py-12 text-center text-gray-400 dark:text-gray-500">
                            <svg
                              className="mx-auto mb-4 h-12 w-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <p className="text-sm">
                              Start filling the form to see preview
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default function JoinLabApplicationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <JoinLabApplicationContent />
    </Suspense>
  );
}
