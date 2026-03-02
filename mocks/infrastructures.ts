import { Infrastructure, InfrastructureType, InfrastructureStatus, Field, InfrastructureField } from '@/types/infrastructure';
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

// Generate infrastructure types
export const mockInfrastructureTypes: InfrastructureType[] = [
    {
        id: 'infra-type-001',
        name: 'High-Performance Computing Cluster',
        description: 'High-performance computing servers and clusters for intensive computational tasks',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-002',
        name: 'GPU Server',
        description: 'Graphics processing unit servers for machine learning and parallel computing',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-003',
        name: 'Security Testing Lab',
        description: 'Dedicated laboratory space for cybersecurity testing and vulnerability assessment',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-004',
        name: 'Network Infrastructure',
        description: 'Networking equipment including switches, routers, and security appliances',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-005',
        name: 'Cloud Compute Resources',
        description: 'Cloud-based computing resources and services',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-006',
        name: 'Graphics Workstation',
        description: 'High-end workstations optimized for graphics design and media production',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-007',
        name: '3D Printer',
        description: '3D printing equipment for rapid prototyping and manufacturing',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-008',
        name: 'VR/AR Equipment',
        description: 'Virtual and augmented reality headsets and development equipment',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-009',
        name: 'Design Studio',
        description: 'Dedicated studio space for design work and creative projects',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-010',
        name: 'Conference Room',
        description: 'Meeting and conference rooms with presentation equipment',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-011',
        name: 'Collaboration Space',
        description: 'Open collaboration spaces for team meetings and group work',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-012',
        name: 'Data Analytics Workstation',
        description: 'Workstations configured for data analysis and business intelligence',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-013',
        name: 'Software License',
        description: 'Software licenses and subscriptions for various applications',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-014',
        name: 'Warehouse Simulation Space',
        description: 'Physical space for simulating warehouse and logistics operations',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-015',
        name: 'IoT Sensor Network',
        description: 'Internet of Things sensors and devices for logistics and supply chain monitoring',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-016',
        name: 'RFID System',
        description: 'Radio-frequency identification systems for tracking and inventory management',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-017',
        name: 'Robotics Laboratory',
        description: 'Dedicated laboratory space for robotics development and testing',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-018',
        name: 'FPGA Development Board',
        description: 'Field-programmable gate array development boards for hardware design',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-019',
        name: 'Chip Testing Equipment',
        description: 'Equipment for testing and validating integrated circuit designs',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-020',
        name: 'Sensor Array',
        description: 'Collection of sensors for robotics and embedded systems development',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-021',
        name: 'Learning Space',
        description: 'Dedicated spaces for educational activities and workshops',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-022',
        name: 'Presentation Equipment',
        description: 'Equipment for presentations including projectors, interactive displays, and audio systems',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'infra-type-023',
        name: 'Educational Software Platform',
        description: 'Software platforms and learning management systems for education',
        isEnable: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
];

// Generate fields (optional, for InfrastructureField relationships)
export const mockFields: Field[] = [
    {
        id: 'field-001',
        name: 'Artificial Intelligence',
        description: 'AI-related research and development',
        isAction: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'field-002',
        name: 'Cybersecurity',
        description: 'Cybersecurity and information security',
        isAction: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'field-003',
        name: 'Business Innovation',
        description: 'Business model innovation and entrepreneurship',
        isAction: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'field-004',
        name: 'Digital Design',
        description: 'Digital media and graphic design',
        isAction: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'field-005',
        name: 'Supply Chain Management',
        description: 'Logistics and supply chain optimization',
        isAction: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'field-006',
        name: 'Robotics',
        description: 'Robotics and autonomous systems',
        isAction: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'field-007',
        name: 'Semiconductor Design',
        description: 'Chip design and integrated circuits',
        isAction: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
    {
        id: 'field-008',
        name: 'Educational Technology',
        description: 'Technology-enhanced learning and education',
        isAction: true,
        createdDate: new Date('2020-01-01'),
        updatedDate: new Date('2024-01-01'),
    },
];

// Generate infrastructure for a lab
const generateInfrastructuresForLab = (labId: string): Infrastructure[] => {
    const users = getUsersByLab(labId);
    const director = users.find(u => u.role === 'DIRECTOR');
    const lecturers = users.filter(u => u.role === 'LECTURER');
    const allMembers = [director, ...lecturers].filter((u): u is NonNullable<typeof u> => Boolean(u));

    const lab = mockLabs.find(l => l.id === labId);
    if (!lab) return [];

    const infrastructures: Infrastructure[] = [];
    let infraCounter = 1;

    // Seed base based on labId
    let seedBase = 0;
    for (let i = 0; i < labId.length; i++) {
        seedBase += labId.charCodeAt(i);
    }
    seedBase *= 2000;

    const baseDate = lab.createdDate;
    const fixedNow = new Date('2025-01-01T12:00:00Z');

    // Lab-specific infrastructure data
    const labInfrastructures: Record<string, Array<{
        typeId: string;
        name: string;
        description: string;
        specifications: string;
        coverImageUrl: string;
        referenceUrl: string;
    }>> = {
        'lab-001': [
            {
                typeId: 'infra-type-002',
                name: 'NVIDIA A100 GPU Server Cluster',
                description: 'High-performance GPU server cluster equipped with NVIDIA A100 Tensor Core GPUs for deep learning and AI model training. Supports distributed training and large-scale neural network development.',
                specifications: '4x NVIDIA A100 80GB GPUs, 256GB RAM, 2x AMD EPYC 7763 CPUs, 10TB NVMe SSD, InfiniBand HDR interconnect, Ubuntu 22.04 LTS, CUDA 12.0, cuDNN 8.9',
                coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.nvidia.com/en-us/data-center/a100/',
            },
            {
                typeId: 'infra-type-003',
                name: 'Penetration Testing Lab',
                description: 'Isolated network environment for cybersecurity testing, vulnerability assessment, and penetration testing. Includes various operating systems, vulnerable applications, and security tools.',
                specifications: 'Isolated network segment, 20 virtual machines (Windows, Linux, Android), Metasploit Framework, Burp Suite Pro, Wireshark, Nmap, OWASP ZAP, Kali Linux, custom vulnerable applications',
                coverImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.offensive-security.com/',
            },
            {
                typeId: 'infra-type-004',
                name: 'Enterprise Network Security Stack',
                description: 'Complete network security infrastructure including firewalls, intrusion detection systems, and network monitoring tools for research and testing.',
                specifications: 'Cisco ASA Firewall, Palo Alto Next-Generation Firewall, Snort IDS/IPS, pfSense, Network TAPs, Gigabit switches, Network monitoring server with ELK stack',
                coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.paloaltonetworks.com/',
            },
        ],
        'lab-002': [
            {
                typeId: 'infra-type-012',
                name: 'Business Analytics Workstation Suite',
                description: 'Dedicated workstations configured with business intelligence and data analytics software for market research and business model analysis.',
                specifications: '10x Dell Precision workstations, Intel Core i9, 64GB RAM, NVIDIA RTX 4060, Tableau Desktop Pro, Power BI Premium, SPSS, R Studio, Python analytics stack, SQL Server',
                coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.tableau.com/',
            },
            {
                typeId: 'infra-type-011',
                name: 'Startup Incubation Space',
                description: 'Flexible collaboration space designed for startup teams, business model workshops, and entrepreneurial activities.',
                specifications: 'Open space: 200 sqm, modular furniture, 6 collaboration pods, whiteboard walls, high-speed Wi-Fi, presentation screen, kitchenette, breakout areas',
                coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
                referenceUrl: '',
            },
        ],
        'lab-003': [
            {
                typeId: 'infra-type-006',
                name: 'Creative Workstation Studio',
                description: 'High-end graphics workstations optimized for video editing, 3D modeling, and digital media production.',
                specifications: '8x Apple Mac Studio (M2 Ultra), 128GB unified memory, 2TB SSD, Apple Studio Display (32-inch), Wacom Cintiq Pro 32 graphics tablets, Color-calibrated monitors',
                coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.apple.com/mac-studio/',
            },
            {
                typeId: 'infra-type-008',
                name: 'VR/AR Development Studio',
                description: 'Complete VR/AR development setup with multiple headsets and motion tracking systems for immersive experience development.',
                specifications: '10x Meta Quest 3 headsets, 5x HTC Vive Pro 2, OptiTrack motion capture system (12 cameras), Unity Pro licenses, Unreal Engine, SteamVR, VR development computers',
                coverImageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.meta.com/quest/',
            },
            {
                typeId: 'infra-type-013',
                name: 'Adobe Creative Cloud License Suite',
                description: 'Complete Adobe Creative Cloud licenses for all design and media production software.',
                specifications: 'Adobe Creative Cloud All Apps (25 licenses), includes Photoshop, Illustrator, InDesign, After Effects, Premiere Pro, XD, Substance 3D, Dimension, and more',
                coverImageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.adobe.com/creativecloud.html',
            },
        ],
        'lab-004': [
            {
                typeId: 'infra-type-014',
                name: 'Smart Warehouse Simulation Space',
                description: 'Physical warehouse simulation area with automated storage and retrieval systems for logistics research.',
                specifications: '500 sqm simulation space, automated conveyor system, RFID-enabled storage racks, AGV (Automated Guided Vehicle), barcode scanners, inventory management software, temperature-controlled zones',
                coverImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
                referenceUrl: '',
            },
            {
                typeId: 'infra-type-015',
                name: 'IoT Sensor Network for Logistics',
                description: 'Comprehensive IoT sensor network for real-time monitoring of logistics operations, temperature, humidity, and asset tracking.',
                specifications: '100+ IoT sensors (temperature, humidity, motion, GPS), LoRaWAN gateway, MQTT broker, cloud data platform, real-time dashboard, sensor calibration equipment',
                coverImageUrl: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop',
                referenceUrl: 'https://lora-alliance.org/',
            },
            {
                typeId: 'infra-type-016',
                name: 'RFID Tracking System',
                description: 'Complete RFID system for inventory management, asset tracking, and supply chain visibility research.',
                specifications: 'UHF RFID readers (20 units), RFID tags (10,000+), handheld scanners, fixed portals, middleware software, database system, analytics dashboard',
                coverImageUrl: 'https://images.unsplash.com/photo-1614064641938-2c92d47b58c3?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.zebra.com/us/en/products/rfid.html',
            },
        ],
        'lab-005': [
            {
                typeId: 'infra-type-017',
                name: 'Robotics Development Lab',
                description: 'Large robotics laboratory with obstacle courses, testing areas, and multiple robot platforms for development and experimentation.',
                specifications: '300 sqm lab space, 10x TurtleBot3 robots, 5x Universal Robots UR5e arms, ROS-enabled workstations, obstacle course, camera tracking system, safety equipment',
                coverImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.robotis.us/turtlebot-3/',
            },
            {
                typeId: 'infra-type-018',
                name: 'FPGA Development Kit Collection',
                description: 'Collection of FPGA development boards and tools for chip design and hardware acceleration research.',
                specifications: 'Xilinx Zynq UltraScale+ ZCU104, Intel Stratix 10 GX, Lattice ECP5, Vivado Design Suite, Quartus Prime, development tools, debug probes, evaluation boards',
                coverImageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.xilinx.com/products/boards-and-kits/zcu104.html',
            },
            {
                typeId: 'infra-type-019',
                name: 'Chip Testing and Validation Equipment',
                description: 'Professional equipment for testing integrated circuits, measuring performance, and validating chip designs.',
                specifications: 'Logic analyzer (Keysight), oscilloscope (Tektronix MSO), power analyzer, thermal imaging camera, probe station, signal generators, test fixtures, calibration equipment',
                coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.keysight.com/',
            },
        ],
        'lab-006': [
            {
                typeId: 'infra-type-021',
                name: 'Interactive Learning Classroom',
                description: 'Modern classroom designed for educational technology research with interactive displays and flexible seating.',
                specifications: 'Capacity: 40 students, 3x 75-inch interactive whiteboards, student response system (clickers), flexible seating, wireless presentation, recording equipment, observation room',
                coverImageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
                referenceUrl: '',
            },
            {
                typeId: 'infra-type-023',
                name: 'Learning Management System Platform',
                description: 'Enterprise learning management system with analytics capabilities for educational research and course delivery.',
                specifications: 'Canvas LMS (unlimited users), Moodle server, learning analytics dashboard, SCORM-compliant authoring tools, video streaming server, assessment tools, mobile app access',
                coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
                referenceUrl: 'https://www.instructure.com/canvas',
            },
        ],
    };

    const labInfras = labInfrastructures[labId] || [];
    const statusOptions: InfrastructureStatus[] = ['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'MAINTENANCE', 'UNAVAILABLE']; // Mostly available
    const contactPersonOptions = allMembers.map(u => u.fullname);

    labInfras.forEach((infraData, index) => {
        const seed = seedBase + index * 100;

        const memberCount = allMembers.length || 1;
        const contactCount = contactPersonOptions.length || 1;
        const statusCount = statusOptions.length;

        const createdBy = allMembers[getDeterministicInt(0, memberCount - 1, seed)]?.id || director?.id || 'unknown';
        const contactPerson = contactPersonOptions[getDeterministicInt(0, contactCount - 1, seed + 1)] || 'Lab Director';
        const status = statusOptions[getDeterministicInt(0, statusCount - 1, seed + 2)];

        const createdDate = getDeterministicDate(baseDate, new Date('2024-06-01'), seed + 3);
        const updatedDate = getDeterministicDate(createdDate, fixedNow, seed + 4);

        // Generate contact email based on lab
        const emailDomain = lab.contactEmail.replace('@innovationlabs.com', '');
        const contactEmail = `${contactPerson.toLowerCase().replace(/\s+/g, '.')}@${emailDomain}`;

        infrastructures.push({
            id: `infra-${labId}-${String(infraCounter).padStart(3, '0')}`,
            labId: labId,
            typeId: infraData.typeId,
            coverImageUrl: infraData.coverImageUrl,
            description: infraData.description,
            specifications: infraData.specifications,
            status: status,
            contactPerson: contactPerson,
            contactEmail: contactEmail,
            referenceUrl: infraData.referenceUrl,
            displayOrder: index + 1,
            createdBy: createdBy,
            createdDate: createdDate,
            updatedDate: updatedDate,
        });
        infraCounter++;
    });

    return infrastructures;
};

// Generate all infrastructures for all labs
export const mockInfrastructures: Infrastructure[] = mockLabs.flatMap(lab => generateInfrastructuresForLab(lab.id));

// Helper function to get infrastructures by lab
export const getInfrastructuresByLab = (labId: string): Infrastructure[] => {
    return mockInfrastructures.filter(infra => infra.labId === labId);
};

// Helper function to get infrastructures by type
export const getInfrastructuresByType = (typeId: string): Infrastructure[] => {
    return mockInfrastructures.filter(infra => infra.typeId === typeId);
};

// Helper function to get infrastructures by status
export const getInfrastructuresByStatus = (status: InfrastructureStatus): Infrastructure[] => {
    return mockInfrastructures.filter(infra => infra.status === status);
};

// Helper function to get available infrastructures
export const getAvailableInfrastructures = (): Infrastructure[] => {
    return mockInfrastructures.filter(infra => infra.status === 'AVAILABLE');
};
