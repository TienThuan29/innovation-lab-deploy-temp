import { ResearchTier } from '@/types/research-tier';
import { mockLabs } from './labs';
import { getUsersByLab } from './users';

// Helper function to generate recent date
const recentDate = (daysAgo: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
};

// Generate research tiers for a lab
const generateResearchTiersForLab = (labId: string): ResearchTier[] => {
    const users = getUsersByLab(labId);
    const director = users.find(u => u.role === 'DIRECTOR');
    const createdBy = director?.id || 'unknown';
    const baseDate = new Date('2020-01-01');

    // Common research tier structure with lab-specific descriptions
    const tierTemplates = [
        {
            name: 'Intern',
            minYear: 1,
            maxYear: 1,
            description: 'Entry-level position for students and beginners',
            conditions: 'Currently enrolled in university or recent graduate',
            benefits: 'Mentorship, hands-on experience, certificate of completion',
        },
        {
            name: 'Junior Researcher',
            minYear: 2,
            maxYear: 3,
            description: 'For researchers with basic experience',
            conditions: 'Bachelor\'s degree or equivalent, 1+ year of research experience',
            benefits: 'Research stipend, conference attendance support, publication opportunities',
        },
        {
            name: 'Senior Researcher',
            minYear: 4,
            maxYear: 6,
            description: 'For experienced researchers leading projects',
            conditions: 'Master\'s degree or equivalent, 3+ years of research experience, publications',
            benefits: 'Higher stipend, project leadership opportunities, international conference funding',
        },
        {
            name: 'Lead Researcher',
            minYear: 7,
            maxYear: 10,
            description: 'For senior researchers leading major initiatives',
            conditions: 'PhD or equivalent, 5+ years of research experience, significant publication record',
            benefits: 'Competitive compensation, research grant opportunities, team leadership, sabbatical options',
        },
    ];

    // Lab-specific customizations
    const labCustomizations: Record<string, Record<string, { description: string; conditions: string; benefits: string }>> = {
        'lab-001': {
            'Intern': {
                description: 'Entry-level position for students interested in AI and cybersecurity',
                conditions: 'Currently enrolled in Computer Science, Cybersecurity, or related field',
                benefits: 'Mentorship from security experts, hands-on experience with security tools, access to security labs',
            },
            'Junior Researcher': {
                description: 'For researchers working on AI-powered security solutions',
                conditions: 'Bachelor\'s in CS/Cybersecurity, knowledge of ML/AI, 1+ year experience',
                benefits: 'Research stipend, access to security datasets, participation in security competitions',
            },
            'Senior Researcher': {
                description: 'Leading research projects in threat detection and AI security',
                conditions: 'Master\'s in CS/Cybersecurity, 3+ years, publications in security/AI venues',
                benefits: 'Higher stipend, lead security research projects, present at top-tier security conferences',
            },
            'Lead Researcher': {
                description: 'Leading major initiatives in AI-driven cybersecurity',
                conditions: 'PhD in CS/Cybersecurity, 5+ years, strong publication record in top venues',
                benefits: 'Competitive compensation, lead research grants, build security research teams, industry collaborations',
            },
        },
        'lab-002': {
            'Intern': {
                description: 'Entry-level position for students interested in business and entrepreneurship',
                conditions: 'Currently enrolled in Business, Economics, or related field',
                benefits: 'Mentorship from business experts, hands-on experience with startups, networking opportunities',
            },
            'Junior Researcher': {
                description: 'For researchers working on business model innovation and market analysis',
                conditions: 'Bachelor\'s in Business/Economics, analytical skills, 1+ year experience',
                benefits: 'Research stipend, access to business databases, participation in startup incubator programs',
            },
            'Senior Researcher': {
                description: 'Leading research projects in digital transformation and innovation',
                conditions: 'Master\'s in Business/Management, 3+ years, publications in business journals',
                benefits: 'Higher stipend, lead business research projects, present at top business conferences',
            },
            'Lead Researcher': {
                description: 'Leading major initiatives in entrepreneurship and business innovation',
                conditions: 'PhD in Business/Management, 5+ years, strong publication record, industry experience',
                benefits: 'Competitive compensation, lead business grants, build research teams, industry partnerships',
            },
        },
        'lab-003': {
            'Intern': {
                description: 'Entry-level position for students interested in creative media and design',
                conditions: 'Currently enrolled in Design, Media Arts, or related field',
                benefits: 'Mentorship from design experts, hands-on experience with design tools, portfolio development',
            },
            'Junior Researcher': {
                description: 'For researchers working on UI/UX design and digital media',
                conditions: 'Bachelor\'s in Design/Media Arts, design portfolio, 1+ year experience',
                benefits: 'Research stipend, access to design software, participation in design competitions',
            },
            'Senior Researcher': {
                description: 'Leading research projects in interactive design and media innovation',
                conditions: 'Master\'s in Design/Media Arts, 3+ years, strong portfolio, publications',
                benefits: 'Higher stipend, lead design research projects, present at design conferences, exhibition opportunities',
            },
            'Lead Researcher': {
                description: 'Leading major initiatives in creative technology and design innovation',
                conditions: 'PhD in Design/Media Arts or equivalent, 5+ years, significant creative work and publications',
                benefits: 'Competitive compensation, lead creative grants, build design teams, industry collaborations',
            },
        },
        'lab-004': {
            'Intern': {
                description: 'Entry-level position for students interested in logistics and supply chain',
                conditions: 'Currently enrolled in Logistics, Supply Chain, or related field',
                benefits: 'Mentorship from logistics experts, hands-on experience with supply chain systems, industry visits',
            },
            'Junior Researcher': {
                description: 'For researchers working on supply chain optimization and logistics',
                conditions: 'Bachelor\'s in Logistics/Operations, analytical skills, 1+ year experience',
                benefits: 'Research stipend, access to logistics databases, participation in industry projects',
            },
            'Senior Researcher': {
                description: 'Leading research projects in supply chain management and optimization',
                conditions: 'Master\'s in Logistics/Operations, 3+ years, publications in operations journals',
                benefits: 'Higher stipend, lead logistics research projects, present at operations conferences',
            },
            'Lead Researcher': {
                description: 'Leading major initiatives in logistics innovation and supply chain transformation',
                conditions: 'PhD in Logistics/Operations, 5+ years, strong publication record, industry experience',
                benefits: 'Competitive compensation, lead logistics grants, build research teams, industry partnerships',
            },
        },
        'lab-005': {
            'Intern': {
                description: 'Entry-level position for students interested in robotics and chip design',
                conditions: 'Currently enrolled in Robotics, Electrical Engineering, or related field',
                benefits: 'Mentorship from robotics experts, hands-on experience with robots and hardware, lab access',
            },
            'Junior Researcher': {
                description: 'For researchers working on robotic systems and embedded design',
                conditions: 'Bachelor\'s in Robotics/EE, programming skills, 1+ year experience',
                benefits: 'Research stipend, access to robotics lab, participation in robotics competitions',
            },
            'Senior Researcher': {
                description: 'Leading research projects in autonomous systems and chip design',
                conditions: 'Master\'s in Robotics/EE, 3+ years, publications in robotics/hardware venues',
                benefits: 'Higher stipend, lead robotics projects, present at top robotics conferences',
            },
            'Lead Researcher': {
                description: 'Leading major initiatives in robotics and semiconductor technology',
                conditions: 'PhD in Robotics/EE, 5+ years, strong publication record, hardware experience',
                benefits: 'Competitive compensation, lead robotics grants, build research teams, industry collaborations',
            },
        },
        'lab-006': {
            'Intern': {
                description: 'Entry-level position for students interested in education and society',
                conditions: 'Currently enrolled in Education, Social Sciences, or related field',
                benefits: 'Mentorship from education experts, hands-on experience with educational technology, field work',
            },
            'Junior Researcher': {
                description: 'For researchers working on educational technology and learning platforms',
                conditions: 'Bachelor\'s in Education/Social Sciences, teaching experience, 1+ year research',
                benefits: 'Research stipend, access to educational platforms, participation in education projects',
            },
            'Senior Researcher': {
                description: 'Leading research projects in educational innovation and social impact',
                conditions: 'Master\'s in Education/Social Sciences, 3+ years, publications in education journals',
                benefits: 'Higher stipend, lead education research projects, present at education conferences',
            },
            'Lead Researcher': {
                description: 'Leading major initiatives in educational technology and social transformation',
                conditions: 'PhD in Education/Social Sciences, 5+ years, strong publication record, teaching experience',
                benefits: 'Competitive compensation, lead education grants, build research teams, policy influence',
            },
        },
    };

    const customizations = labCustomizations[labId] || {};
    const createdDate = new Date('2020-01-01');

    return tierTemplates.map((tier, index) => {
        const customization = customizations[tier.name] || {};
        return {
            id: `tier-${labId}-${String(index + 1).padStart(2, '0')}`,
            labId: labId,
            name: tier.name,
            minYear: tier.minYear,
            maxYear: tier.maxYear,
            description: customization.description || tier.description,
            conditions: customization.conditions || tier.conditions,
            benefits: customization.benefits || tier.benefits,
            createdBy: createdBy,
            createdDate: createdDate,
            updatedDate: recentDate(Math.floor(Math.random() * 30)),
        };
    });
};

// Generate all research tiers for all labs
export const mockResearchTiers: ResearchTier[] = mockLabs.flatMap(lab => generateResearchTiersForLab(lab.id));

// Helper function to get research tiers by lab
export const getResearchTiersByLab = (labId: string): ResearchTier[] => {
    return mockResearchTiers.filter(tier => tier.labId === labId);
};

// Helper function to get research tier by name and lab
export const getResearchTierByName = (labId: string, name: string): ResearchTier | undefined => {
    return mockResearchTiers.find(tier => tier.labId === labId && tier.name === name);
};

