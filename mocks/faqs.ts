import { FAQ } from "../types/faq";

export const faqs: FAQ[] = [
    // AI & Cybersecurity Laboratory
    {
        id: "faq-001",
        labId: "lab-001",
        question: "How does AIC detect new threats?",
        answer: "Our AIC lab uses advanced machine learning models trained on vast datasets of network traffic and system logs. These models can identify anomalous patterns and potential zero-day exploits in real-time, allowing for immediate mitigation.",
        displayOrder: 1,
        createdDate: new Date("2023-01-10"),
        updateDate: new Date("2023-06-15")
    },
    {
        id: "faq-002",
        labId: "lab-001",
        question: "Can I collaborate on security research?",
        answer: "Yes, we welcome collaborations with researchers and industry partners. Please contact us via email to discuss potential joint research projects or data sharing agreements.",
        displayOrder: 2,
        createdDate: new Date("2023-02-20"),
        updateDate: new Date("2023-02-20")
    },

    // Business & Entrepreneurship Laboratory
    {
        id: "faq-003",
        labId: "lab-002",
        question: "What support does BEL offer to startups?",
        answer: "BEL provides a comprehensive incubation program including mentorship from experienced entrepreneurs, access to co-working spaces, and assistance with business model development and market analysis.",
        displayOrder: 1,
        createdDate: new Date("2023-03-05"),
        updateDate: new Date("2023-03-05")
    },
    
    // Creative Media & Design Laboratory
    {
        id: "faq-004",
        labId: "lab-003",
        question: "What software tools are available in the CMD lab?",
        answer: "Our lab is equipped with the full Adobe Creative Suite, Figma, Blender, Unity, and Unreal Engine. We also have high-end workstations and drawing tablets for digital art and design work.",
        displayOrder: 1,
        createdDate: new Date("2023-04-12"),
        updateDate: new Date("2023-04-12")
    },

    // Logistics and Supply Chain Laboratory
    {
        id: "faq-005",
        labId: "lab-004",
        question: "How does LSC optimize supply chains?",
        answer: "We utilize data analytics and simulation software to model supply chain networks. By analyzing historical data and current trends, we identify bottlenecks and propose optimized routing and inventory strategies.",
        displayOrder: 1,
        createdDate: new Date("2023-05-20"),
        updateDate: new Date("2023-05-20")
    },

    // Robotics & Chip Laboratory
    {
        id: "faq-006",
        labId: "lab-005",
        question: "Can students access the robotics hardware?",
        answer: "Yes, students enrolled in relevant courses or research projects can access our robotics kits, 3D printers, and testing areas under supervision. Training is required before operating complex machinery.",
        displayOrder: 1,
        createdDate: new Date("2023-06-01"),
        updateDate: new Date("2023-06-01")
    },

      // Education & Society Laboratory
    {
        id: "faq-007",
        labId: "lab-006",
        question: "What is the focus of ESL research?",
        answer: "ESL focuses on how digital transformation impacts education and society. We research effective e-learning strategies, digital literacy, and the social implications of widespread technology adoption.",
        displayOrder: 1,
        createdDate: new Date("2023-07-15"),
        updateDate: new Date("2023-07-15")
    },
     {
        id: "faq-008",
        labId: "lab-006",
        question: "Are there any community outreach programs?",
        answer: "We regularly organize workshops and seminars for local schools and community centers to promote digital literacy and introduce students to emerging technologies.",
        displayOrder: 2,
        createdDate: new Date("2023-08-10"),
        updateDate: new Date("2023-08-10")
    },
];
