import { Publication, PublicationType } from '@/types/publication';
import { mockLabs } from './labs';
import { getUsersByLab } from './users';

// Deterministic pseudo-random helper (copied for consistency, typically should be in shared utils)
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

// Generate publications for a lab
const generatePublicationsForLab = (labId: string): Publication[] => {
    const users = getUsersByLab(labId);
    const director = users.find(u => u.role === 'DIRECTOR');
    const lecturers = users.filter(u => u.role === 'LECTURER');
    const researchers = users.filter(u => u.role === 'RESEARCHER');
    const allMembers = [director, ...lecturers, ...researchers].filter(Boolean);

    const publications: Publication[] = [];
    let pubCounter = 1;
    const seedBase = labId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 100;

    // Lab-specific publication data
    const labPublications: Record<string, Array<{ title: string; abstract: string; venue: string; type: PublicationType; year: number }>> = {
        'lab-001': [ // AI & Cybersecurity
            {
                title: 'Attention Is All You Need: Advanced Transformer Architectures',
                abstract: 'We propose a novel variation of the Transformer architecture that improves computational efficiency by 40% while maintaining state-of-the-art performance on NLP benchmarks.',
                venue: 'NeurIPS',
                type: 'CONFERENCE',
                year: 2024,
            },
            {
                title: 'Ethical Alignment of Large Language Models via RLHF',
                abstract: 'This paper presents a robust framework for aligning LLMs with human values using Reinforcement Learning from Human Feedback. We introduce a new reward modeling technique that reduces toxicity.',
                venue: 'ICLR',
                type: 'CONFERENCE',
                year: 2024,
            },
            {
                title: 'Deep Learning-Based Intrusion Detection System for Network Security',
                abstract: 'This paper presents a novel deep learning approach for real-time intrusion detection in network environments. We propose a hybrid CNN-LSTM architecture that achieves 98.5% accuracy in detecting various attack patterns including DDoS, malware, and unauthorized access attempts.',
                venue: 'IEEE Transactions on Information Forensics and Security',
                type: 'JOURNAL',
                year: 2024,
            },
            {
                title: 'Vision-Language Models for Medical Imaging',
                abstract: 'A systematic review of deep learning applications in medical imaging, focusing on early detection of diabetic retinopathy and tumor segmentation.',
                venue: 'IEEE Transactions on Medical Imaging',
                type: 'JOURNAL',
                year: 2023,
            },
        ],
        'lab-004': [ // Logistics (Data)
            {
                title: 'Big Data Analytics for Smart City Infrastructure',
                abstract: 'A framework for analyzing sensor data from smart city IoT networks to optimize traffic flow and energy consumption.',
                venue: 'Journal of Big Data',
                type: 'JOURNAL',
                year: 2024,
            },
            {
                title: 'Predictive Modeling of Consumer Behavior',
                abstract: 'Using ensemble learning techniques to predict consumer purchasing patterns in e-commerce platforms.',
                venue: 'KDD',
                type: 'CONFERENCE',
                year: 2024,
            }
        ],
        'lab-005': [ // Robotics
            {
                title: 'Autonomous Navigation System for Mobile Robots',
                abstract: 'This paper presents a deep reinforcement learning-based navigation system for autonomous mobile robots.',
                venue: 'IEEE Transactions on Robotics',
                type: 'JOURNAL',
                year: 2024,
            },
            {
                title: 'Low-Power Chip Design for Edge AI',
                abstract: 'We propose a novel chip architecture optimized for edge AI applications.',
                venue: 'ISSCC',
                type: 'CONFERENCE',
                year: 2024,
            }
        ],
        'lab-006': [ // Education (Bio? Maybe not, keeping Bio as extra or mapped to 006 for now)
            {
                title: 'Personalized Learning via AI',
                abstract: 'Adapting curriculum using AI based on student performance metrics.',
                venue: 'Computers & Education',
                type: 'JOURNAL',
                year: 2024,
            }
        ],
    };

    const labPubs = labPublications[labId] || [];
    const baseDate = new Date('2018-01-01');

    // Generate some random historical publications (2018-2023)
    // to populate the chart with more years
    if (labId === 'lab-001' || labId === 'lab_ai') { // Add extra for the main demo lab
        for (let y = 2018; y <= 2023; y++) {
            const count = Math.floor(seededRandom(seedBase + y) * 5) + -2; // 2-6 pubs per year
            for (let i = 0; i < count; i++) {
                labPubs.push({
                    title: `Historical Research Paper ${y}-${i + 1}`,
                    abstract: 'Abstract of historical paper...',
                    venue: i % 2 === 0 ? 'IEEE ' + y : 'ACM ' + y,
                    type: i % 3 === 0 ? 'JOURNAL' : 'CONFERENCE',
                    year: y
                });
            }
        }
    }

    // Track showcase counts by year to ensure distribution
    const showcaseCountByYear: Record<number, number> = {};

    labPubs.forEach((pubData, index) => {
        const seed = seedBase + index * 50;
        // Deterministic member selection
        const memberIndex = Math.floor(seededRandom(seed) * allMembers.length);
        const createdBy = allMembers[memberIndex]?.id || director?.id || 'unknown';

        // Deterministic dates
        const createdDate = new Date(baseDate.getTime() + seededRandom(seed + 1) * (new Date().getTime() - baseDate.getTime()));
        const publishedDate = new Date(pubData.year, Math.floor(seededRandom(seed + 2) * 12), Math.floor(seededRandom(seed + 3) * 28) + 1);
        const doi = `10.1000/${labId.replace('lab-', '')}.${pubData.year}.${String(pubCounter).padStart(3, '0')}`;

        // Mark as showcased if from 2022, 2023, or 2024, with priority for recent years
        // Showcase up to 2 publications per year from these years
        const showcaseYears = [2024, 2023, 2022];
        const isShowcaseYear = showcaseYears.includes(pubData.year);
        const yearCount = showcaseCountByYear[pubData.year] || 0;
        const isSelectedForShowcase = isShowcaseYear && yearCount < 2;

        if (isSelectedForShowcase) {
            showcaseCountByYear[pubData.year] = yearCount + 1;
        }

        // Deterministic authors selection (2-4 authors)
        const authorCount = Math.floor(seededRandom(seed + 5) * 3) + 2;
        const pubAuthors = [];
        for (let i = 0; i < authorCount; i++) {
            const index = Math.floor(seededRandom(seed + 6 + i) * allMembers.length);
            pubAuthors.push(allMembers[index]?.fullname || 'Unknown Author');
        }

        publications.push({
            id: `pub-${labId}-${String(pubCounter).padStart(3, '0')}`,
            labId: labId,
            createdBy: createdBy,
            title: pubData.title,
            abstract: pubData.abstract,
            poster: `https://picsum.photos/800/600?random=${labId}-${pubCounter}`,
            type: pubData.type,
            venue: pubData.venue,
            year: pubData.year,
            doi: doi,
            url: `https://doi.org/${doi}`,
            intellectualProperty: 'Copyright © ' + pubData.year + ' Innovation Labs. All rights reserved.',
            citationText: `"${pubData.title}", ${pubData.venue}, ${pubData.year}, DOI: ${doi}`,
            publishedDate: publishedDate,
            createdDate: createdDate,
            updatedDate: new Date(new Date().getTime() - Math.floor(seededRandom(seed + 4) * 30 * 24 * 60 * 60 * 1000)),
            isSelectedForShowcase: isSelectedForShowcase,
            authors: pubAuthors, // Added real author names
        });
        pubCounter++;
    });

    return publications;
};

// Generate all publications for all labs
export const mockPublications: Publication[] = mockLabs.flatMap(lab => generatePublicationsForLab(lab.id));

// Helper function to get publications by lab
export const getPublicationsByLab = (labId: string): Publication[] => {
    return mockPublications.filter(pub => pub.labId === labId);
};

// Helper function to get publications by type
export const getPublicationsByType = (type: PublicationType): Publication[] => {
    return mockPublications.filter(pub => pub.type === type);
};

// Helper function to get showcased publications
export const getShowcasedPublications = (): Publication[] => {
    return mockPublications.filter(pub => pub.isSelectedForShowcase);
};

