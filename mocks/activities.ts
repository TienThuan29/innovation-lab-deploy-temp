import { Activity, ActivityType, ActivityStatus } from '@/types/activity';
import { mockLabs } from './labs';
import { getUsersByLab } from './users';

// Deterministic pseudo-random helper
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

// Helper function to generate number in range deterministically
const getDeterministicInt = (min: number, max: number, seed: number): number => {
    return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
};

// Helper function to generate deterministic date
const getDeterministicDate = (start: Date, end: Date, seed: number): Date => {
    return new Date(
        start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime()),
    );
};

// Helper function to generate consistent recent date
const getRecentDate = (daysAgo: number): Date => {
    const date = new Date('2025-01-01T12:00:00Z'); // Fixed anchor
    date.setDate(date.getDate() - daysAgo);
    return date;
};

// Generate activity types
export const mockActivityTypes: ActivityType[] = [
    {
        id: 'activity-type-001',
        name: 'Workshop',
        description: 'Hands-on training sessions and skill development workshops',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'activity-type-002',
        name: 'Seminar',
        description: 'Academic seminars and research presentations',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'activity-type-003',
        name: 'Conference',
        description: 'Research conferences and academic meetings',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'activity-type-004',
        name: 'Lab Meeting',
        description: 'Regular lab meetings and progress updates',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'activity-type-005',
        name: 'Guest Lecture',
        description: 'Invited talks from industry experts and researchers',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'activity-type-006',
        name: 'Hackathon',
        description: 'Coding competitions and innovation challenges',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'activity-type-007',
        name: 'Field Trip',
        description: 'Industry visits and field research activities',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
];

// Generate activities for a lab
const generateActivitiesForLab = (labId: string): Activity[] => {
    const users = getUsersByLab(labId);
    const director = users.find(u => u.role === 'DIRECTOR');
    const lecturers = users.filter(u => u.role === 'LECTURER');
    const allMembers = [director, ...lecturers].filter(Boolean);

    const activities: Activity[] = [];
    let activityCounter = 1;

    // Seed base based on labId
    let seedBase = 0;
    for (let i = 0; i < labId.length; i++) {
        seedBase += labId.charCodeAt(i);
    }
    seedBase *= 1000;

    // Lab-specific activity data
    const labActivities: Record<string, Array<{ title: string; summary: string; content: string; typeName: string; duration: number; isOnline: boolean; startDate?: Date }>> = {
        'lab-001': [
            {
                title: 'AI-Powered Threat Detection Workshop',
                summary: 'Hands-on workshop on building AI models for cybersecurity threat detection',
                content: 'This comprehensive workshop covers the fundamentals of using machine learning and deep learning for cybersecurity. Participants will learn to build threat detection models, analyze network traffic patterns, and implement automated response systems. The workshop includes practical exercises with real-world datasets and security tools.',
                typeName: 'Workshop',
                duration: 180, // 3 hours
                isOnline: false,
            },
            {
                title: 'Cybersecurity Research Seminar: Latest Trends in AI Security',
                summary: 'Monthly research seminar discussing recent advances in AI and cybersecurity',
                content: 'Join us for our monthly research seminar where lab members present their latest findings and discuss cutting-edge research in AI-powered cybersecurity. This session will cover recent publications, ongoing projects, and future research directions.',
                typeName: 'Seminar',
                duration: 90, // 1.5 hours
                isOnline: true,
            },
            {
                title: 'Guest Lecture: Zero-Day Vulnerability Detection',
                summary: 'Invited talk from industry expert on detecting zero-day vulnerabilities using AI',
                content: 'We are honored to host Dr. Sarah Chen from TechSec Inc. who will share insights on using artificial intelligence to detect zero-day vulnerabilities. The lecture will cover advanced techniques, real-world case studies, and future challenges in vulnerability detection.',
                typeName: 'Guest Lecture',
                duration: 60,
                isOnline: true,
            },
            {
                title: 'Cybersecurity Hackathon 2024',
                summary: 'Annual hackathon focusing on building innovative security solutions',
                content: 'Join our annual cybersecurity hackathon! Teams will compete to build innovative security solutions addressing real-world challenges. Prizes will be awarded for the most creative and effective solutions. Open to all students and researchers interested in cybersecurity.',
                typeName: 'Hackathon',
                duration: 1440, // 24 hours
                isOnline: false,
            },
            {
                title: 'Lab Meeting: Project Progress Review',
                summary: 'Weekly lab meeting to review project progress and discuss challenges',
                content: 'Regular lab meeting where all members present their project progress, discuss challenges, and share updates. This is an opportunity for collaboration and knowledge sharing among lab members.',
                typeName: 'Lab Meeting',
                duration: 60,
                isOnline: true,
            },
            {
                title: 'Penetration Testing Workshop: Ethical Hacking Fundamentals',
                summary: 'Learn ethical hacking and penetration testing techniques in a controlled environment',
                content: 'This intensive workshop introduces participants to penetration testing methodologies, vulnerability assessment, and ethical hacking practices. Hands-on labs will cover network scanning, exploitation techniques, and security assessment tools. Perfect for cybersecurity students and professionals.',
                typeName: 'Workshop',
                duration: 240,
                isOnline: false,
            },
            {
                title: 'Guest Lecture: Cloud Security Best Practices',
                summary: 'Industry expert shares insights on securing cloud infrastructure and applications',
                content: 'Join us for an informative lecture by a cloud security architect from a leading tech company. Learn about cloud security architecture, identity and access management, data encryption, and compliance requirements in cloud environments.',
                typeName: 'Guest Lecture',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Seminar: Blockchain Security and Smart Contract Auditing',
                summary: 'Exploring security challenges in blockchain technology and smart contracts',
                content: 'Our monthly seminar focuses on blockchain security, covering smart contract vulnerabilities, consensus mechanism security, and cryptographic security in distributed systems. Researchers will present recent findings and discuss emerging threats.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Cybersecurity Capture The Flag Competition',
                summary: 'Competitive event where teams solve security challenges and capture flags',
                content: 'Test your cybersecurity skills in our CTF competition! Teams will solve challenges covering cryptography, web security, reverse engineering, and forensics. Prizes and certificates will be awarded to top performers. All skill levels welcome!',
                typeName: 'Hackathon',
                duration: 480,
                isOnline: true,
            },
            {
                title: 'Workshop: Incident Response and Digital Forensics',
                summary: 'Hands-on training on responding to security incidents and conducting forensic analysis',
                content: 'Learn how to effectively respond to cybersecurity incidents and conduct digital forensics investigations. This workshop covers incident response procedures, evidence collection, malware analysis, and reporting. Real-world case studies will be discussed.',
                typeName: 'Workshop',
                duration: 300,
                isOnline: false,
            },
            {
                title: 'Lab Meeting: Quarterly Research Review',
                summary: 'Quarterly meeting to review research progress and plan upcoming projects',
                content: 'Quarterly comprehensive review meeting where lab members present their research progress, discuss publications, and plan future research directions. This is a key strategic meeting for the lab.',
                typeName: 'Lab Meeting',
                duration: 120,
                isOnline: true,
            },
            {
                title: 'Guest Lecture: IoT Security Challenges and Solutions',
                summary: 'Expert discusses security risks in Internet of Things devices and mitigation strategies',
                content: 'As IoT devices become ubiquitous, security becomes critical. This lecture explores common vulnerabilities in IoT devices, attack vectors, and best practices for securing IoT ecosystems. Real-world examples and case studies will be presented.',
                typeName: 'Guest Lecture',
                duration: 75,
                isOnline: true,
            },
            {
                title: 'Seminar: Machine Learning for Malware Detection',
                summary: 'Research presentation on using ML algorithms to detect and classify malware',
                content: 'This seminar presents cutting-edge research on applying machine learning techniques for malware detection. Topics include feature engineering, model selection, adversarial ML attacks, and performance evaluation. Open discussion session included.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Field Trip: Security Operations Center Visit',
                summary: 'Visit to a professional SOC to observe real-world security operations',
                content: 'Experience a day in the life of security professionals by visiting a real Security Operations Center. Observe threat monitoring, incident handling, and security tool operations. This field trip provides invaluable insights into professional cybersecurity practices.',
                typeName: 'Field Trip',
                duration: 240,
                isOnline: false,
            },
            {
                title: 'Workshop: Secure Software Development Lifecycle',
                summary: 'Learn to integrate security practices throughout the software development process',
                content: 'This workshop covers secure coding practices, threat modeling, security testing, and DevSecOps integration. Participants will learn to identify security requirements, implement secure coding standards, and conduct security testing throughout development.',
                typeName: 'Workshop',
                duration: 360,
                isOnline: false,
            },
            {
                title: 'Guest Lecture: Quantum Cryptography and Post-Quantum Security',
                summary: 'Expert lecture on quantum computing threats and quantum-safe cryptographic solutions',
                content: 'With quantum computing on the horizon, understanding quantum cryptography becomes essential. This lecture covers quantum key distribution, post-quantum cryptography algorithms, migration strategies, and the future of cryptographic security.',
                typeName: 'Guest Lecture',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Seminar: Privacy-Preserving Technologies and Zero-Knowledge Proofs',
                summary: 'Exploring cryptographic techniques for privacy protection in digital systems',
                content: 'This seminar delves into privacy-preserving technologies including zero-knowledge proofs, homomorphic encryption, and secure multi-party computation. Researchers will present recent advances and discuss applications in cybersecurity.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Cybersecurity Career Development Workshop',
                summary: 'Guidance on building a career in cybersecurity, certifications, and skill development',
                content: 'Learn about career paths in cybersecurity, industry certifications (CISSP, CEH, OSCP, etc.), required skills, and how to build your professional network. Panel discussion with industry professionals and recent graduates sharing their experiences.',
                typeName: 'Workshop',
                duration: 180,
                isOnline: true,
            },
            {
                title: 'Lab Meeting: Journal Paper Writing Workshop',
                summary: 'Training session on writing and submitting high-quality research papers',
                content: 'This special lab meeting focuses on academic writing skills, paper structure, journal selection, peer review process, and response to reviewers. Experienced researchers will share tips and best practices for successful publications.',
                typeName: 'Lab Meeting',
                duration: 120,
                isOnline: true,
            },
            {
                title: 'Guest Lecture: Ransomware Attack Prevention and Response',
                summary: 'Industry expert shares insights on preventing and mitigating ransomware attacks',
                content: 'Ransomware remains a critical threat to organizations. This lecture covers attack vectors, prevention strategies, backup and recovery procedures, incident response for ransomware attacks, and business continuity planning.',
                typeName: 'Guest Lecture',
                duration: 75,
                isOnline: true,
            },
            // 2026 Future Activities
            {
                title: 'AI Security Summit 2026',
                summary: 'Annual conference on artificial intelligence security, ethics, and best practices',
                content: 'Join leading researchers and practitioners for our annual AI Security Summit. This comprehensive conference will cover AI model security, adversarial machine learning, privacy-preserving AI, and the latest developments in AI security research. Keynote speakers from top tech companies and academic institutions.',
                typeName: 'Conference',
                duration: 1440,
                isOnline: false,
                startDate: new Date('2026-03-15T09:00:00'),
            },
            {
                title: 'Workshop: Next-Generation Intrusion Detection Systems',
                summary: 'Advanced workshop on building modern IDS using deep learning and behavioral analysis',
                content: 'Explore cutting-edge intrusion detection techniques using deep learning, behavioral analytics, and real-time threat intelligence. Participants will build their own IDS systems, learn to detect advanced persistent threats, and understand modern attack patterns. Hands-on labs with industry-standard tools.',
                typeName: 'Workshop',
                duration: 480,
                isOnline: false,
                startDate: new Date('2026-05-20T09:00:00'),
            },
            {
                title: 'Guest Lecture: Post-Quantum Cryptography Implementation',
                summary: 'Expert guidance on migrating to quantum-resistant cryptographic algorithms',
                content: 'With quantum computers advancing rapidly, organizations need to prepare for post-quantum cryptography. This lecture provides practical guidance on evaluating, selecting, and implementing quantum-resistant algorithms. Learn about migration strategies, hybrid solutions, and industry timelines.',
                typeName: 'Guest Lecture',
                duration: 90,
                isOnline: true,
                startDate: new Date('2026-07-10T14:00:00'),
            },
            {
                title: 'Cybersecurity Hackathon 2026: Defending Critical Infrastructure',
                summary: 'Annual hackathon focused on securing critical infrastructure systems',
                content: 'Our 2026 hackathon challenges teams to build innovative security solutions for critical infrastructure including power grids, water systems, and transportation networks. Special focus on SCADA security, industrial control systems, and resilience against nation-state attacks. Grand prize and internship opportunities available.',
                typeName: 'Hackathon',
                duration: 2880,
                isOnline: false,
                startDate: new Date('2026-09-12T09:00:00'),
            },
            {
                title: 'Seminar: AI-Powered Social Engineering Defense',
                summary: 'Research presentation on using AI to detect and prevent social engineering attacks',
                content: 'Social engineering remains one of the most effective attack vectors. This seminar presents research on using machine learning and natural language processing to detect phishing attempts, vishing calls, and other social engineering tactics. Discussion on behavioral analysis and user awareness training.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
                startDate: new Date('2026-11-05T10:00:00'),
            },
        ],
        'lab-002': [
            {
                title: 'Business Model Innovation Workshop',
                summary: 'Workshop on developing innovative business models for startups',
                content: 'Learn how to design and validate innovative business models in this hands-on workshop. We will cover business model canvas, value proposition design, customer discovery, and lean startup methodologies. Perfect for aspiring entrepreneurs and researchers.',
                typeName: 'Workshop',
                duration: 240, // 4 hours
                isOnline: false,
            },
            {
                title: 'Entrepreneurship Seminar: Startup Success Stories',
                summary: 'Monthly seminar featuring successful startup founders and their journeys',
                content: 'Our monthly entrepreneurship seminar brings together successful founders, investors, and researchers to share insights and experiences. This month, we will hear from founders who have scaled their startups from idea to market leaders.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Guest Lecture: Digital Transformation in SMEs',
                summary: 'Expert talk on how small businesses can leverage digital transformation',
                content: 'Join us for an insightful lecture by industry expert on digital transformation strategies for small and medium enterprises. Learn about practical approaches, common challenges, and success factors in digital adoption.',
                typeName: 'Guest Lecture',
                duration: 60,
                isOnline: true,
            },
            {
                title: 'Field Trip: Startup Incubator Visit',
                summary: 'Visit to local startup incubator to learn about the startup ecosystem',
                content: 'We will visit a leading startup incubator to observe how they support early-stage startups, understand their programs, and network with entrepreneurs and mentors. This field trip provides valuable insights into the startup ecosystem.',
                typeName: 'Field Trip',
                duration: 180,
                isOnline: false,
            },
            {
                title: 'Lab Meeting: Market Analysis Discussion',
                summary: 'Weekly meeting to discuss market trends and research opportunities',
                content: 'Regular lab meeting focusing on market analysis, industry trends, and research opportunities. Members will share their findings and collaborate on identifying new research directions.',
                typeName: 'Lab Meeting',
                duration: 60,
                isOnline: true,
            },
        ],
        'lab-003': [
            {
                title: 'UI/UX Design Workshop: Modern Design Principles',
                summary: 'Comprehensive workshop on contemporary UI/UX design principles and tools',
                content: 'This workshop covers modern UI/UX design principles, user research methods, prototyping techniques, and design tools. Participants will work on real design challenges and receive feedback from experienced designers.',
                typeName: 'Workshop',
                duration: 300, // 5 hours
                isOnline: false,
            },
            {
                title: 'Creative Media Seminar: AR/VR Development',
                summary: 'Seminar on developing augmented and virtual reality applications',
                content: 'Explore the world of AR/VR development in this seminar. We will discuss development frameworks, design considerations, user experience in immersive environments, and showcase recent projects from the lab.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Guest Lecture: Future of Digital Media',
                summary: 'Industry expert shares insights on emerging trends in digital media',
                content: 'Join us for a fascinating lecture on the future of digital media, covering emerging technologies, design trends, and the evolving landscape of creative technology. Perfect for designers, developers, and media professionals.',
                typeName: 'Guest Lecture',
                duration: 60,
                isOnline: true,
            },
            {
                title: 'Design Hackathon: Accessibility Challenge',
                summary: 'Hackathon focused on creating accessible digital experiences',
                content: 'Participate in our design hackathon focused on accessibility! Teams will design and prototype solutions that make digital experiences more accessible to people with disabilities. Winners will receive prizes and recognition.',
                typeName: 'Hackathon',
                duration: 1440,
                isOnline: false,
            },
            {
                title: 'Lab Meeting: Portfolio Review',
                summary: 'Monthly meeting to review and critique portfolios',
                content: 'Join us for our monthly portfolio review session where lab members showcase their recent work, receive feedback, and discuss design challenges and solutions. This is a great opportunity for professional development.',
                typeName: 'Lab Meeting',
                duration: 90,
                isOnline: true,
            },
        ],
        'lab-004': [
            {
                title: 'Supply Chain Optimization Workshop',
                summary: 'Workshop on using data analytics for supply chain optimization',
                content: 'Learn how to apply data analytics and optimization techniques to improve supply chain performance. This workshop covers demand forecasting, inventory management, route optimization, and warehouse management systems.',
                typeName: 'Workshop',
                duration: 240,
                isOnline: false,
            },
            {
                title: 'Logistics Research Seminar: IoT in Supply Chain',
                summary: 'Seminar discussing the application of IoT technologies in logistics',
                content: 'Our monthly research seminar focuses on IoT applications in supply chain management. We will discuss smart warehouses, real-time tracking, predictive maintenance, and the future of connected logistics.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Guest Lecture: Blockchain in Supply Chain',
                summary: 'Expert talk on using blockchain for supply chain transparency',
                content: 'Learn about blockchain technology and its applications in supply chain management. The lecture will cover transparency, traceability, smart contracts, and real-world implementation case studies.',
                typeName: 'Guest Lecture',
                duration: 60,
                isOnline: true,
            },
            {
                title: 'Field Trip: Smart Warehouse Visit',
                summary: 'Visit to an automated warehouse to see logistics technology in action',
                content: 'We will visit a state-of-the-art automated warehouse to observe IoT sensors, robotics, and automation systems in action. This field trip provides hands-on experience with modern logistics technology.',
                typeName: 'Field Trip',
                duration: 240,
                isOnline: false,
            },
            {
                title: 'Lab Meeting: Project Updates and Collaboration',
                summary: 'Weekly meeting for project updates and collaborative discussions',
                content: 'Regular lab meeting where members share project updates, discuss research challenges, and explore collaboration opportunities. This is a key forum for knowledge exchange and team coordination.',
                typeName: 'Lab Meeting',
                duration: 60,
                isOnline: true,
            },
        ],
        'lab-005': [
            {
                title: 'Robotics Programming Workshop: ROS Fundamentals',
                summary: 'Hands-on workshop on Robot Operating System (ROS) programming',
                content: 'This comprehensive workshop introduces participants to ROS, the industry-standard framework for robotics development. Learn to program robots, work with sensors, implement navigation algorithms, and build autonomous systems.',
                typeName: 'Workshop',
                duration: 360, // 6 hours
                isOnline: false,
            },
            {
                title: 'Robotics Seminar: Autonomous Navigation Systems',
                summary: 'Research seminar on recent advances in autonomous robot navigation',
                content: 'Join us for our monthly research seminar focusing on autonomous navigation. We will discuss SLAM algorithms, path planning, obstacle avoidance, and showcase recent research from the lab.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Guest Lecture: Chip Design for Edge AI',
                summary: 'Expert lecture on designing low-power chips for edge AI applications',
                content: 'Learn about the latest trends in chip design for edge AI from industry experts. The lecture covers architecture design, power optimization, and hardware-software co-design approaches.',
                typeName: 'Guest Lecture',
                duration: 60,
                isOnline: true,
            },
            {
                title: 'Robotics Hackathon: Autonomous Challenge',
                summary: 'Hackathon where teams build autonomous robots to complete challenges',
                content: 'Participate in our robotics hackathon! Teams will build and program autonomous robots to complete various challenges including navigation, object manipulation, and task execution. Prizes for the best performing robots.',
                typeName: 'Hackathon',
                duration: 2880, // 48 hours
                isOnline: false,
            },
            {
                title: 'Lab Meeting: Hardware and Software Integration',
                summary: 'Weekly meeting discussing hardware-software integration challenges',
                content: 'Regular lab meeting focusing on hardware-software integration, embedded systems development, and robotics project updates. Members share progress and collaborate on technical challenges.',
                typeName: 'Lab Meeting',
                duration: 90,
                isOnline: true,
            },
        ],
        'lab-006': [
            {
                title: 'Educational Technology Workshop: Building Learning Platforms',
                summary: 'Workshop on developing effective e-learning platforms and tools',
                content: 'Learn how to design and develop educational technology platforms in this hands-on workshop. We will cover learning management systems, adaptive learning algorithms, user experience design for education, and assessment tools.',
                typeName: 'Workshop',
                duration: 300,
                isOnline: false,
            },
            {
                title: 'Education Research Seminar: Learning Analytics',
                summary: 'Seminar on using data analytics to improve learning outcomes',
                content: 'Our monthly research seminar explores learning analytics and its applications in education. We will discuss predictive models, student engagement analysis, personalized learning, and educational data mining.',
                typeName: 'Seminar',
                duration: 90,
                isOnline: true,
            },
            {
                title: 'Guest Lecture: Digital Literacy in the Modern Age',
                summary: 'Expert talk on promoting digital literacy and its societal impact',
                content: 'Join us for an important lecture on digital literacy, its importance in modern society, and strategies for promoting digital skills across different demographics. This lecture addresses both educational and social perspectives.',
                typeName: 'Guest Lecture',
                duration: 60,
                isOnline: true,
            },
            {
                title: 'Field Trip: Rural School Technology Integration',
                summary: 'Visit to rural schools to observe technology integration in education',
                content: 'We will visit rural schools to observe how educational technology is being integrated into classrooms, understand challenges and opportunities, and identify research needs in underserved communities.',
                typeName: 'Field Trip',
                duration: 360,
                isOnline: false,
            },
            {
                title: 'Lab Meeting: Educational Impact Assessment',
                summary: 'Weekly meeting to discuss research findings and educational impact',
                content: 'Regular lab meeting where members share research findings, discuss educational impact assessments, and plan future research directions. This is a collaborative space for advancing educational technology research.',
                typeName: 'Lab Meeting',
                duration: 60,
                isOnline: true,
            },
        ],
    };

    const labActs = labActivities[labId] || [];
    const baseDate = new Date('2023-01-01');
    // FIXED: Use deterministic "now"
    const fixedNow = new Date('2025-01-01T12:00:00Z');

    labActs.forEach((actData, index) => {
        const seed = seedBase + index * 100;
        // Deterministic random selection
        const memberCount = allMembers.length || 1;
        const memberIndex = getDeterministicInt(0, memberCount - 1, seed);

        const createdBy = allMembers[memberIndex]?.id || director?.id || 'unknown';

        const activityType = mockActivityTypes.find(t => t.name === actData.typeName) || mockActivityTypes[0];

        // Use provided startDate or generate a deterministic one relative to fixedNow
        const futureLimit = new Date(fixedNow.getTime() + 90 * 24 * 60 * 60 * 1000);

        const startDate = actData.startDate || getDeterministicDate(baseDate, futureLimit, seed + 1);
        const createdDate = getDeterministicDate(new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000), startDate, seed + 2);

        // Determine status based on date vs fixedNow
        let status: ActivityStatus = 'DRAFT';

        if (startDate < fixedNow) {
            status = seededRandom(seed + 3) > 0.3 ? 'COMPLETED' : 'CANCELLED';
        } else {
            status = 'FUTURE';
        }

        activities.push({
            id: `activity-${labId}-${String(activityCounter).padStart(3, '0')}`,
            labId: labId,
            title: actData.title,
            summary: actData.summary,
            content: actData.content,
            activityTypeId: activityType.id,
            status: status,
            isFeatured: index < 2, // First 2 activities are featured
            startDate: startDate,
            duration: actData.duration,
            isOnline: actData.isOnline,
            meetUrl: actData.isOnline ? `https://meet.innovationlabs.com/${labId}-${activityCounter}` : '',
            isPublic: index < 3, // First 3 activities are public
            createdDate: createdDate,
            updatedDate: getRecentDate(getDeterministicInt(1, 30, seed + 4)),
        });
        activityCounter++;
    });

    return activities;
};

// Generate all activities for all labs
export const mockActivities: Activity[] = mockLabs.flatMap(lab => generateActivitiesForLab(lab.id));

// Helper function to get activities by lab
export const getActivitiesByLab = (labId: string): Activity[] => {
    return mockActivities.filter(activity => activity.labId === labId);
};

// Helper function to get activities by status
export const getActivitiesByStatus = (status: ActivityStatus): Activity[] => {
    return mockActivities.filter(activity => activity.status === status);
};

// Helper function to get featured activities
export const getFeaturedActivities = (): Activity[] => {
    return mockActivities.filter(activity => activity.isFeatured);
};

// Helper function to get public activities
export const getPublicActivities = (): Activity[] => {
    return mockActivities.filter(activity => activity.isPublic);
};
