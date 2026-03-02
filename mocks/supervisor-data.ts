// --- TYPES ---

export type MemberRole = 'PI' | 'Co-PI' | 'Advisor' | 'Leader' | 'RA';
export type ProjectStatus = 'draft' | 'ongoing' | 'completed' | 'archived' | 'cancelled';
export type LabStatus = 'active' | 'stopped';
export type OpportunityType = 'internship' | 'thesis' | 'research_assistant' | 'scholarship' | 'event';
export type OpportunityStatus = 'draft' | 'open' | 'closed';
export type ActivityStatus = 'draft' | 'open' | 'completed' | 'cancelled';
export type GuideStatus = 'draft' | 'published' | 'archived';
export type PartnerType = 'university' | 'company' | 'lab';

export interface ProjectMember {
    project_id: string;
    user_id: string;
    member_role: MemberRole;
    responsibilities: string;
    assigned_by: string;
    assigned_date: string;
    updated_date: string;
    user_name: string;
    user_avatar: string; // Helper for UI
}

export interface Project {
    id: string;
    lab_id: string;
    partner_id?: string;
    name: string;
    summary: string;
    description: string;
    status: ProjectStatus;
    start_date: string;
    end_date?: string;
    funding_source: string;
    funding_description: string;
    budget: number;
    created_date: string;
    updated_date: string;
}

export interface Lab {
    id: string;
    name: string;
    short_name: string;
    description: string;
    mission: string;
    scope: string;
    tech_stacks: string[];
    contact_email: string;
    contact_phone: string;
    cover_image_url: string;
    address: string;
    status: LabStatus;
    created_date: string;
    updated_date: string;
}

export interface Opportunity {
    id: string;
    lab_id: string;
    title: string;
    description: string;
    benefits: string;
    requirements: string;
    location: string;
    type: OpportunityType;
    start_date: string;
    end_date: string;
    status: OpportunityStatus;
    created_by: string; // FK
    created_date: string;
    updated_date?: string;
}

export interface Activity {
    id: string;
    lab_id: string;
    title: string;
    summary: string;
    content: string;
    activity_type_id: string; // FK
    type_name?: string; // Helper for UI
    status: ActivityStatus;
    is_featured: boolean;
    start_date: string;
    duration: string;
    is_online: boolean;
    meet_url?: string;
    is_public: boolean;
    created_date: string;
    updated_date?: string;
}

export interface ActivityType {
    id: string;
    name: string;
    description: string;
    is_enable: boolean;
    created_date: string;
    updated_date?: string;
}

export interface ResearchGuide {
    id: string;
    lab_id: string;
    title: string;
    summary: string;
    content: string; // HTML or Markdown
    status: GuideStatus;
    created_date: string;
    updated_date: string;
}

export interface Partner {
    id: string;
    lab_id: string;
    name: string;
    partner_type: PartnerType;
    description: string;
    website_url: string;
    logo_url: string; // helper
    contact_person: string;
    is_public: boolean;
}

export interface JoinLabApplication {
    id: string;
    lab_id: string;
    applicant_email: string;
    target_role: string; // Student / Research Assistant
    self_description: string;
    motivation: string;
    skills: string;
    cv_file: string;
    portfolio_url: string;
    status: 'accepted' | 'rejected' | 'pending';
    decision_note?: string;
    submitted_date: string;
    reviewed_date?: string;
}

export interface InfrastructureType {
    id: string;
    name: string;
    description: string;
    is_enable: boolean;
}

export interface Infrastructure {
    id: string;
    lab_id: string;
    type_id: string;
    type_name: string; // Helper
    cover_image_url: string;
    description: string;
    specifications: string;
    status: 'available' | 'maintenance' | 'unavailable';
    contact_person: string;
    contact_email: string;
    display_order: number;
}

// --- MOCK DATA ---
// NOTE: Global mocks (Labs, Activities, Infrastructures, Publications) are now in @/mocks/*.
// This file retains Supervisor-specific data: Projects, ProjectMembers, JoinLabApplications.

export const mockProjects: Project[] = [
    {
        id: "proj_001",
        lab_id: "lab_ai",
        name: "Neural Architecture Search v4",
        summary: "Automated optimization of neural network architectures.",
        description: "Developing a new evolutionary algorithm for finding optimal neural network architectures with constrained compute resources. This project explores genetic algorithms combined with reinforcement learning to traverse the architecture search space more efficiently than traditional methods.",
        status: "ongoing",
        start_date: "2024-03-01",
        end_date: "2025-06-30",
        funding_source: "National Science Foundation",
        funding_description: "Grant #AI-2024-001 for automated ML research.",
        budget: 250000,
        created_date: "2024-02-15",
        updated_date: "2024-12-10",
        partner_id: "part_001"
    },
    {
        id: "proj_002",
        lab_id: "lab_ai",
        name: "Ethical LLM Alignment Framework",
        summary: "Framework for aligning Large Language Models with human values.",
        description: "Creating a robust RLHF (Reinforcement Learning from Human Feedback) pipeline to minimize toxicity and bias in open-source LLMs. The project involves creating a diverse dataset of ethical dilemmas and training reward models to guide the LLM's responses.",
        status: "ongoing", // changed to ongoing for active view
        start_date: "2025-01-01",
        funding_source: "Tech Corp Inc.",
        funding_description: "Industry partnership for ethical AI development.",
        budget: 150000,
        created_date: "2024-11-20",
        updated_date: "2024-12-28",
        partner_id: "part_002"
    },
    {
        id: "proj_005", // New AI project
        lab_id: "lab_ai",
        name: "Computer Vision for Healthcare",
        summary: "Early detection of anomalies in medical imaging using CNNs.",
        description: "Applying advanced Convolutional Neural Networks to detect early signs of diabetic retinopathy and other conditions from retinal scans. Collaboration with City Hospital.",
        status: "completed",
        start_date: "2023-06-01",
        end_date: "2024-06-01",
        funding_source: "HealthTech Grants",
        funding_description: "Medical imaging innovation fund.",
        budget: 120000,
        created_date: "2023-05-15",
        updated_date: "2024-06-15",
    },
    {
        id: "proj_003",
        lab_id: "lab_cyber",
        name: "Zero Trust Network Protocol",
        summary: "Next-gen protocol for zero trust architecture.",
        description: "Designing a lightweight protocol for IoT devices to participate in Zero Trust networks.",
        status: "ongoing",
        start_date: "2024-01-15",
        end_date: "2024-12-31",
        funding_source: "Cyber Defense Grant",
        funding_description: "Federal security research initiative.",
        budget: 180000,
        created_date: "2023-12-10",
        updated_date: "2024-06-20",
    },
    {
        id: "proj_006",
        lab_id: "lab_ai",
        name: "Neuro-Symbolic Reasoning",
        summary: "Combining neural networks with symbolic logic for robust reasoning.",
        description: "A hybrid AI system that integrates deep learning perception with symbolic reasoning to solve multi-step problems in math and coding.",
        status: "ongoing",
        start_date: "2024-05-01",
        end_date: "2026-04-30",
        funding_source: "DARPA",
        funding_description: "Neuro-symbolic AI initiative.",
        budget: 450000,
        created_date: "2024-04-10",
        updated_date: "2024-12-28",
        partner_id: "part_001"
    },
    {
        id: "proj_007",
        lab_id: "lab_ai",
        name: "Generative Media Synthesis",
        summary: "High-fidelity video generation from text descriptions.",
        description: "Developing efficient diffusion models for temporal consistency in long-form video generation.",
        status: "draft",
        start_date: "2025-02-01",
        funding_source: "Creative Arts Council",
        funding_description: "Future of media grant.",
        budget: 90000,
        created_date: "2024-12-20",
        updated_date: "2024-12-29",
    },
    {
        id: "proj_008",
        lab_id: "lab_ai",
        name: "Robotic Manipulation with VLM",
        summary: "Using Vision-Language Models for dexterous robotic manipulation.",
        description: "Training robotic arms to understand natural language commands and manipulate novel objects using VLM reasoning.",
        status: "ongoing",
        start_date: "2024-08-15",
        funding_source: "NSF Robotics",
        funding_description: "Automation and Control systems.",
        budget: 320000,
        created_date: "2024-07-01",
        updated_date: "2024-12-15",
        partner_id: "part_002"
    }
];

export const mockProjectMembers: ProjectMember[] = [
    {
        project_id: "proj_001",
        user_id: "user_001",
        user_name: "Dr. Alex Mercer",
        user_avatar: "https://ui-avatars.com/api/?name=Alex+Mercer&background=0D8ABC&color=fff",
        member_role: "PI",
        responsibilities: "Overall project direction, funding management, architecture design.",
        assigned_by: "admin",
        assigned_date: "2024-03-01",
        updated_date: "2024-03-01",
    },
    {
        project_id: "proj_001",
        user_id: "user_002",
        user_name: "Sarah Chen",
        user_avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=random",
        member_role: "Leader",
        responsibilities: "Lead researcher, algorithm implementation, experiment tracking.",
        assigned_by: "user_001",
        assigned_date: "2024-03-05",
        updated_date: "2024-03-05",
    },
    {
        project_id: "proj_002",
        user_id: "user_003",
        user_name: "Michael Ross",
        user_avatar: "https://ui-avatars.com/api/?name=Michael+Ross&background=random",
        member_role: "RA",
        responsibilities: "Dataset curation and RLHF model fine-tuning.",
        assigned_by: "user_001",
        assigned_date: "2025-01-05",
        updated_date: "2025-01-05",
    },
    {
        project_id: "proj_003",
        user_id: "user_005",
        user_name: "John Smith",
        user_avatar: "https://ui-avatars.com/api/?name=John+Smith&background=random",
        member_role: "PI",
        responsibilities: "Protocol design and security verification.",
        assigned_by: "admin",
        assigned_date: "2024-01-15",
        updated_date: "2024-01-15",
    },
    {
        project_id: "proj_006",
        user_id: "user_006",
        user_name: "Dr. Emily Zhang",
        user_avatar: "https://ui-avatars.com/api/?name=Emily+Zhang&background=random",
        member_role: "PI",
        responsibilities: "Logic formalization and neuro-symbolic integration.",
        assigned_by: "admin",
        assigned_date: "2024-05-01",
        updated_date: "2024-05-01",
    },
    {
        project_id: "proj_006",
        user_id: "user_007",
        user_name: "David Kim",
        user_avatar: "https://ui-avatars.com/api/?name=David+Kim&background=random",
        member_role: "Leader",
        responsibilities: "Neural module implementation.",
        assigned_by: "user_006",
        assigned_date: "2024-05-05",
        updated_date: "2024-05-05",
    },
    {
        project_id: "proj_008",
        user_id: "user_008",
        user_name: "Prof. Robert Lang",
        user_avatar: "https://ui-avatars.com/api/?name=Robert+Lang&background=random",
        member_role: "Advisor",
        responsibilities: "Robotics control theory guidance.",
        assigned_by: "admin",
        assigned_date: "2024-08-01",
        updated_date: "2024-08-01",
    }
];

export const mockPartners: Partner[] = [
    {
        id: "part_001",
        lab_id: "lab_ai",
        name: "Google DeepMind",
        partner_type: "company",
        description: "Strategic partnership for AGI research and access to cloud TPU resources.",
        website_url: "https://deepmind.google",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/DeepMind_logo.png/1200px-DeepMind_logo.png",
        contact_person: "Research Director",
        is_public: true,
    },
    {
        id: "part_002",
        lab_id: "lab_ai",
        name: "Stanford HAI",
        partner_type: "university",
        description: "Collaboration on Human-Centered AI ethics guidelines.",
        website_url: "https://hai.stanford.edu",
        logo_url: "https://hai.stanford.edu/themes/custom/hai/logo.svg", // Placeholder link
        contact_person: "Dr. Li",
        is_public: true,
    },
    {
        id: "part_003",
        lab_id: "lab_ai",
        name: "OpenAI",
        partner_type: "company",
        description: "Access to GPT-4 API for experimental benchmarking.",
        website_url: "https://openai.com",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
        contact_person: "API Team",
        is_public: true,
    }
];



export const mockJoinLabApplications: JoinLabApplication[] = [
    {
        id: "app_001",
        lab_id: "lab_ai",
        applicant_email: "student1@univ.edu",
        target_role: "Research Assistant",
        self_description: "Final year CS undergrad interested in NLP.",
        motivation: "I want to work on LLM alignment.",
        skills: "Python, PyTorch, NLTK",
        cv_file: "cv_student1.pdf",
        portfolio_url: "github.com/student1",
        status: "pending",
        submitted_date: "2024-12-28T10:00:00",
    },
    {
        id: "app_002",
        lab_id: "lab_ai",
        applicant_email: "student2@univ.edu",
        target_role: "Student",
        self_description: "Master student looking for thesis topic.",
        motivation: "Interested in Computer Vision.",
        skills: "OpenCV, TensorFlow",
        cv_file: "cv_student2.pdf",
        portfolio_url: "github.com/student2",
        status: "accepted",
        decision_note: "Strong background, assigned to Dr. Smith.",
        submitted_date: "2024-12-20T14:30:00",
        reviewed_date: "2024-12-25T09:00:00",
    },
    {
        id: "app_003",
        lab_id: "lab_ai",
        applicant_email: "student3@other.edu",
        target_role: "Intern",
        self_description: "Sophomore with strong math skills.",
        motivation: "Learning ML basics.",
        skills: "Math, Python",
        cv_file: "cv_student3.pdf",
        portfolio_url: "github.com/student3",
        status: "rejected",
        decision_note: "Too early for research role, apply next year.",
        submitted_date: "2024-12-15T11:20:00",
        reviewed_date: "2024-12-18T16:00:00",
    },
    // Distributed historical data for chart (Last 4 years to support drill-down)
    ...Array.from({ length: 200 }).map((_, i) => {
        // Generate dates distributed over the last 4 years (~1460 days)
        const daysAgo = Math.floor(Math.random() * 1460);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        return {
            id: `app_hist_${i}`,
            lab_id: "lab_ai",
            applicant_email: `applicant${i}@test.com`,
            target_role: Math.random() > 0.7 ? "Research Assistant" : "Student",
            self_description: "Test application",
            motivation: "Research",
            skills: "Python",
            cv_file: "cv.pdf",
            portfolio_url: "github.com",
            status: Math.random() > 0.6 ? 'accepted' : Math.random() > 0.3 ? 'rejected' : 'pending',
            submitted_date: date.toISOString(),
        };
    }) as JoinLabApplication[]
];


