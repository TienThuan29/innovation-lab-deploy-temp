import { ResearchGuide, ResearchGuideStatus } from '@/types/research-guide';
import { mockLabs } from './labs';
import { getUsersByLab } from './users';

// Helper function to generate random date
const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate recent date
const recentDate = (daysAgo: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
};

// Generate research guides for a lab
const generateResearchGuidesForLab = (labId: string): ResearchGuide[] => {
    const users = getUsersByLab(labId);
    const director = users.find(u => u.role === 'DIRECTOR');
    const lecturers = users.filter(u => u.role === 'LECTURER');
    const allMembers = [director, ...lecturers].filter(Boolean);

    const guides: ResearchGuide[] = [];
    let guideCounter = 1;

    // Lab-specific research guide data
    const labGuides: Record<string, Array<{ title: string; summary: string; content: string }>> = {
        'lab-001': [
            {
                title: 'Getting Started with AI-Powered Cybersecurity Research',
                summary: 'A comprehensive guide for new researchers entering the field of AI and cybersecurity',
                content: `# Getting Started with AI-Powered Cybersecurity Research

![AI Cybersecurity Header](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop)

## Introduction
Welcome to the AI & Cybersecurity Laboratory! This guide will help you get started with research in AI-powered cybersecurity.

![Cybersecurity Lab](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop)

## Prerequisites
- Strong programming skills in Python
- Understanding of machine learning fundamentals
- Basic knowledge of cybersecurity concepts
- Familiarity with network protocols

![Python Programming](https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop)

## Research Areas
Our lab focuses on several key areas:

![Threat Detection](https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop)
1. **Threat Detection**: Using ML to identify security threats in real-time

![Automated Response](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop)
2. **Automated Response**: AI systems that respond to security incidents

![Network Security](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop)
3. **Network Security**: Protecting network infrastructure with intelligent systems

![Cryptography](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop)
4. **Cryptography**: AI-assisted cryptographic protocol analysis

## Getting Started
1. Set up your development environment with Python, TensorFlow, and security tools
2. Review our lab's recent publications to understand current research directions
3. Join our weekly lab meetings to connect with other researchers
4. Start with a small project to familiarize yourself with our tools and methodologies

![Development Environment](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)

## Resources
- Lab GitHub repository with code examples
- Access to security datasets and tools
- Mentorship from senior researchers
- Conference and workshop opportunities

![Research Resources](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop)

## Next Steps
Contact your lab director to discuss your research interests and get assigned to a project.`,
            },
            {
                title: 'Machine Learning for Threat Detection: Best Practices',
                summary: 'Best practices and methodologies for applying ML to cybersecurity threat detection',
                content: `# Machine Learning for Threat Detection: Best Practices

![ML Threat Detection](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=600&fit=crop)

## Overview
This guide covers best practices for developing machine learning models for cybersecurity threat detection.

## Data Collection
![Data Collection](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
- Use diverse datasets from multiple sources
- Ensure proper labeling and annotation
- Handle class imbalance in attack vs. normal traffic
- Maintain data privacy and security

## Model Development
![ML Models](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop)
- Start with baseline models (Random Forest, SVM)
- Experiment with deep learning architectures
- Use ensemble methods for improved accuracy
- Implement proper cross-validation

![Deep Learning](https://images.unsplash.com/photo-1527477396000-e77106ef6b3c?w=800&h=600&fit=crop)

## Evaluation Metrics
![Evaluation Metrics](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
- Focus on precision and recall, not just accuracy
- Consider false positive rates
- Test on real-world scenarios
- Monitor model performance over time

## Deployment Considerations
![Deployment](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop)
- Real-time processing requirements
- Model interpretability for security analysts
- Continuous learning and model updates
- Integration with existing security infrastructure

## Common Challenges
![Challenges](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop)
- Adversarial attacks on ML models
- Concept drift in attack patterns
- Scalability for large networks
- Balancing security and usability`,
            },
            {
                title: 'Writing and Publishing Security Research Papers',
                summary: 'Guidelines for writing high-quality research papers in cybersecurity',
                content: `# Writing and Publishing Security Research Papers

![Research Writing](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop)

## Target Venues
Our lab targets top-tier venues including:
- **Conferences**: CCS, NDSS, USENIX Security, S&P
- **Journals**: IEEE TIFS, Computers & Security, ACM TOSN

![Academic Venues](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop)

## Paper Structure
![Paper Structure](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
1. **Abstract**: Clear problem statement and contributions
2. **Introduction**: Motivation and research questions
3. **Related Work**: Comprehensive literature review
4. **Methodology**: Detailed approach and algorithms
5. **Evaluation**: Experimental setup and results
6. **Discussion**: Limitations and future work
7. **Conclusion**: Summary and impact

## Key Elements
![Key Elements](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Clear problem statement
- Novel contributions
- Rigorous evaluation
- Reproducible experiments
- Ethical considerations

## Writing Tips
![Writing Tips](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Be precise and technical
- Use clear figures and tables
- Provide code and data when possible
- Address reviewer concerns proactively
- Follow venue-specific formatting guidelines`,
            },
        ],
        'lab-002': [
            {
                title: 'Introduction to Business and Entrepreneurship Research',
                summary: 'A guide for researchers new to business and entrepreneurship studies',
                content: `# Introduction to Business and Entrepreneurship Research

![Business Research Header](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop)

## Welcome
Welcome to the Business & Entrepreneurship Laboratory! This guide will help you navigate business research.

![Entrepreneurship Lab](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop)

## Research Focus Areas
![Business Innovation](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop)
1. **Business Model Innovation**: Developing new business models

![Startup Ecosystem](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop)
2. **Startup Ecosystems**: Understanding startup development

![Market Analysis](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
3. **Market Analysis**: Analyzing market trends and opportunities

![Digital Transformation](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop)
4. **Digital Transformation**: Technology adoption in businesses

![Strategic Planning](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop)
5. **Strategic Planning**: Long-term business strategy development

## Research Methodologies
![Research Methods](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop)
- **Case Studies**: In-depth analysis of specific businesses
- **Surveys**: Quantitative data collection
- **Interviews**: Qualitative insights from entrepreneurs
- **Data Analytics**: Market and business data analysis
- **Experimental Design**: Testing business hypotheses

## Getting Started
![Getting Started](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop)
1. Identify your research interest within business/entrepreneurship
2. Review relevant literature and case studies
3. Connect with industry partners and startups
4. Develop your research question and methodology
5. Begin data collection and analysis

## Resources
![Business Resources](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop)
- Access to business databases (Bloomberg, FactSet)
- Industry connections and partnerships
- Startup incubator programs
- Business case study library`,
            },
            {
                title: 'Conducting Market Research: A Practical Guide',
                summary: 'Step-by-step guide to conducting effective market research',
                content: `# Conducting Market Research: A Practical Guide

![Market Research](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop)

## Overview
Market research is fundamental to understanding business opportunities and customer needs.

## Research Planning
![Research Planning](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop)
1. **Define Objectives**: What do you want to learn?
2. **Identify Target Market**: Who are your customers?
3. **Choose Methodology**: Primary vs. secondary research
4. **Develop Timeline**: Set realistic deadlines

## Data Collection Methods
![Data Collection Methods](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
- **Surveys**: Online and offline questionnaires
- **Interviews**: One-on-one discussions
- **Focus Groups**: Group discussions
- **Observation**: Watching customer behavior
- **Secondary Data**: Existing reports and studies

![Survey Analysis](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)

## Analysis Techniques
![Analysis Techniques](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
- Statistical analysis of survey data
- Thematic analysis of interviews
- Competitive analysis
- Trend identification
- Market sizing and segmentation

## Common Tools
![Research Tools](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop)
- Survey platforms (SurveyMonkey, Qualtrics)
- Analytics tools (Google Analytics, Tableau)
- Statistical software (R, SPSS)
- Database access (industry reports)

## Best Practices
![Best Practices](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop)
- Ensure sample representativeness
- Maintain objectivity
- Validate findings with multiple sources
- Consider ethical implications
- Present findings clearly and actionably`,
            },
            {
                title: 'Publishing Business Research: Venues and Guidelines',
                summary: 'Guide to publishing research in top business and management journals',
                content: `# Publishing Business Research: Venues and Guidelines

![Publishing Research](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop)

## Target Journals
![Business Journals](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop)
- **Top Tier**: Strategic Management Journal, Academy of Management Journal
- **Specialized**: Journal of Business Research, Entrepreneurship Theory and Practice
- **Applied**: Harvard Business Review, MIT Sloan Management Review

## Research Contribution Types
![Research Types](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop)
1. **Theoretical**: New frameworks and models
2. **Empirical**: Data-driven insights
3. **Methodological**: New research methods
4. **Practical**: Actionable business insights

## Writing Structure
![Writing Structure](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Clear research question
- Literature review and theoretical foundation
- Methodology and data sources
- Results and analysis
- Discussion and implications
- Limitations and future research

## Key Success Factors
![Success Factors](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop)
- Relevance to business practice
- Rigorous methodology
- Clear writing and presentation
- Practical implications
- Contribution to knowledge`,
            },
        ],
        'lab-003': [
            {
                title: 'Getting Started with Creative Media and Design Research',
                summary: 'Guide for new researchers in digital media and design',
                content: `# Getting Started with Creative Media and Design Research

![Creative Design Header](https://images.unsplash.com/photo-1561070791-2526d2fc2c68?w=1200&h=600&fit=crop)

## Welcome
Welcome to the Creative Media & Design Laboratory! Explore the intersection of technology and creativity.

![Design Lab](https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=600&fit=crop)

## Research Areas
![UI UX Design](https://images.unsplash.com/photo-1561070791-2526d2fc2c68?w=800&h=600&fit=crop)
1. **UI/UX Design**: User interface and experience design

![Digital Media](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop)
2. **Digital Media**: Multimedia content creation

![3D Animation](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop)
3. **3D Modeling & Animation**: 3D graphics and animation

![AR VR](https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=600&fit=crop)
4. **AR/VR Development**: Immersive experiences

![Interactive Design](https://images.unsplash.com/photo-1561070791-2526d2fc2c68?w=800&h=600&fit=crop)
5. **Interactive Design**: Engaging user interactions

## Essential Skills
![Design Skills](https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop)
- Design thinking and user research
- Proficiency in design tools (Figma, Adobe Creative Suite)
- Programming for creative applications
- Understanding of human-computer interaction
- Visual communication principles

![Design Tools](https://images.unsplash.com/photo-1561070791-2526d2fc2c68?w=800&h=600&fit=crop)

## Getting Started
![Getting Started Design](https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop)
1. Build your design portfolio
2. Learn industry-standard tools
3. Study design principles and trends
4. Participate in design critiques
5. Work on real projects

## Resources
![Design Resources](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop)
- Design software licenses
- Access to design libraries and assets
- Hardware for AR/VR development
- Design critique sessions
- Industry connections and internships`,
            },
            {
                title: 'Design Research Methodology: From Concept to Prototype',
                summary: 'Methodology guide for conducting design research and creating prototypes',
                content: `# Design Research Methodology: From Concept to Prototype

![Design Methodology](https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=600&fit=crop)

## Design Process
![Design Process](https://images.unsplash.com/photo-1561070791-2526d2fc2c68?w=800&h=600&fit=crop)
1. **Research**: Understand users and context
2. **Ideation**: Generate creative solutions
3. **Prototyping**: Build and test concepts
4. **Iteration**: Refine based on feedback
5. **Implementation**: Finalize and deploy

## User Research Methods
![User Research](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop)
- User interviews and surveys
- Observation and ethnography
- Persona development
- User journey mapping
- Usability testing

![Personas](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop)

## Prototyping Tools
![Prototyping](https://images.unsplash.com/photo-1561070791-2526d2fc2c68?w=800&h=600&fit=crop)
- **Low-fidelity**: Paper sketches, wireframes
- **Medium-fidelity**: Figma, Sketch mockups
- **High-fidelity**: Interactive prototypes, coded demos
- **3D/AR/VR**: Unity, Unreal Engine, Blender

![Wireframes](https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop)

## Testing and Evaluation
![Usability Testing](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop)
- Usability testing sessions
- A/B testing for design variations
- Accessibility evaluation
- Performance testing
- User feedback collection

## Best Practices
![Best Practices Design](https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop)
- Start with user needs, not technology
- Iterate quickly and frequently
- Test with real users early
- Consider accessibility from the start
- Document your design decisions`,
            },
            {
                title: 'Publishing Design Research: Academic and Industry Venues',
                summary: 'Guide to publishing design research in academic and industry publications',
                content: `# Publishing Design Research: Academic and Industry Venues

![Publishing Design](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop)

## Academic Venues
![Academic Conferences](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop)
- **Top Conferences**: CHI, SIGGRAPH, UIST
- **Journals**: ACM TOCHI, Design Studies, International Journal of Design

## Industry Venues
![Industry Venues](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop)
- Design blogs and publications
- Industry conferences (UX Week, Design+Research)
- Portfolio showcases
- Case study publications

## Research Contribution Types
![Contribution Types](https://images.unsplash.com/photo-1561070791-2526d2fc2c68?w=800&h=600&fit=crop)
- New design methods or frameworks
- User studies and evaluations
- Design systems and guidelines
- Tools and technologies
- Case studies and best practices

## Writing for Design Research
![Design Writing](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Visual documentation is crucial
- Include design process and rationale
- Show iterations and evolution
- Provide actionable insights
- Connect to broader design theory

## Portfolio Development
![Portfolio](https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop)
- Document your design process
- Showcase final outcomes
- Explain design decisions
- Include user feedback and results
- Demonstrate impact and value`,
            },
        ],
        'lab-004': [
            {
                title: 'Introduction to Logistics and Supply Chain Research',
                summary: 'Comprehensive guide for researchers in logistics and supply chain management',
                content: `# Introduction to Logistics and Supply Chain Research

![Supply Chain Header](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop)

## Welcome
Welcome to the Logistics and Supply Chain Laboratory! Learn about optimizing supply chain operations.

![Logistics Lab](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop)

## Research Focus Areas
![Supply Chain Optimization](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop)
1. **Supply Chain Optimization**: Improving efficiency and reducing costs

![Warehouse Management](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop)
2. **Warehouse Management**: Automated and smart warehouses

![Transportation](https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop)
3. **Transportation Logistics**: Route optimization and fleet management

![Inventory Management](https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop)
4. **Inventory Management**: Demand forecasting and stock optimization

![IoT Logistics](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop)
5. **IoT in Logistics**: Connected devices and real-time tracking

## Key Research Methods
![Research Methods Logistics](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
- **Optimization**: Mathematical modeling and algorithms
- **Simulation**: Modeling supply chain systems
- **Data Analytics**: Analyzing logistics data
- **Case Studies**: Real-world implementations
- **Field Research**: Observing operations

## Getting Started
![Getting Started Logistics](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop)
1. Understand supply chain fundamentals
2. Learn optimization techniques
3. Study logistics software and systems
4. Connect with industry partners
5. Identify research opportunities

## Resources
![Logistics Resources](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop)
- Access to logistics databases
- Simulation software (Arena, AnyLogic)
- Industry partnerships for field research
- Optimization tools and libraries
- Case study repository`,
            },
            {
                title: 'Supply Chain Optimization: Methods and Tools',
                summary: 'Guide to optimization methods and tools for supply chain management',
                content: `# Supply Chain Optimization: Methods and Tools

![Optimization Methods](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop)

## Optimization Problems
![Optimization Problems](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop)
- Vehicle routing problems (VRP)
- Inventory optimization
- Warehouse layout design
- Network design
- Production planning

![Vehicle Routing](https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop)

## Optimization Techniques
![Linear Programming](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
- **Linear Programming**: For resource allocation
- **Integer Programming**: For discrete decisions
- **Heuristics**: For complex problems
- **Metaheuristics**: Genetic algorithms, simulated annealing
- **Machine Learning**: For demand forecasting

![Machine Learning Logistics](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop)

## Software Tools
![Software Tools Logistics](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
- **Optimization**: CPLEX, Gurobi, OR-Tools
- **Simulation**: Arena, AnyLogic, Simio
- **Analytics**: Python (pandas, scipy), R
- **ERP Integration**: SAP, Oracle

## Implementation Steps
![Implementation Steps](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop)
1. Define the problem clearly
2. Collect and prepare data
3. Build mathematical model
4. Solve using appropriate method
5. Validate and test solution
6. Implement and monitor

## Best Practices
![Best Practices Logistics](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop)
- Start with simple models
- Validate with real data
- Consider practical constraints
- Test sensitivity to parameters
- Document assumptions clearly`,
            },
            {
                title: 'Publishing Logistics Research: Academic Venues',
                summary: 'Guide to publishing research in logistics and operations journals',
                content: `# Publishing Logistics Research: Academic Venues

![Publishing Logistics](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop)

## Target Journals
![Logistics Journals](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop)
- **Top Tier**: Transportation Science, Operations Research
- **Specialized**: International Journal of Production Research, EJOR
- **Applied**: Supply Chain Management Review, Logistics Management

## Research Contribution Types
![Contribution Types Logistics](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop)
- New optimization algorithms
- Empirical studies of supply chains
- Case studies of implementations
- Methodological advances
- Industry applications

## Paper Structure
![Paper Structure Logistics](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Problem motivation and importance
- Literature review
- Methodology and model
- Data and experimental setup
- Results and analysis
- Managerial insights
- Conclusions and future work

## Key Elements
![Key Elements Logistics](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Clear problem statement
- Rigorous methodology
- Real-world relevance
- Computational efficiency
- Practical implications

## Writing Tips
![Writing Tips Logistics](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Use clear mathematical notation
- Include computational results
- Provide sensitivity analysis
- Connect to industry practice
- Highlight contributions clearly`,
            },
        ],
        'lab-005': [
            {
                title: 'Getting Started with Robotics and Chip Design Research',
                summary: 'Comprehensive guide for new researchers in robotics and hardware design',
                content: `# Getting Started with Robotics and Chip Design Research

![Robotics Header](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop)

## Welcome
Welcome to the Robotics & Chip Laboratory! Explore robotics systems and semiconductor design.

![Robotics Lab](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop)

## Research Areas
![Robotic Systems](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop)
1. **Robotic Systems**: Autonomous navigation, manipulation, control

![Chip Design](https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop)
2. **Chip Design**: Low-power, edge AI, embedded systems

![Sensor Integration](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop)
3. **Sensor Integration**: Multi-modal sensing and fusion

![Hardware Software](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
4. **Hardware-Software Co-design**: Optimizing across layers

![Human Robot Interaction](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop)
5. **Human-Robot Interaction**: Safe and intuitive interfaces

## Essential Skills
![Robotics Skills](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
- Programming (C++, Python, ROS)
- Electronics and circuit design
- Mechanical design and CAD
- Control theory and algorithms
- Embedded systems development

![ROS Programming](https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop)

## Getting Started
![Getting Started Robotics](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop)
1. Set up development environment (ROS, CAD tools)
2. Learn basic robotics concepts
3. Work with lab robots and hardware
4. Study recent research papers
5. Join lab projects

## Resources
![Robotics Resources](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop)
- Robotics lab with various robots
- Electronics lab and equipment
- CAD software licenses
- Simulation tools (Gazebo, V-REP)
- Hardware components and sensors`,
            },
            {
                title: 'Robotics Development Workflow: From Simulation to Deployment',
                summary: 'Step-by-step guide to developing and deploying robotic systems',
                content: `# Robotics Development Workflow: From Simulation to Deployment

![Robotics Workflow](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop)

## Development Stages
![Development Stages](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop)
1. **Simulation**: Test algorithms in virtual environment
2. **Prototyping**: Build and test hardware prototypes
3. **Integration**: Combine hardware and software
4. **Testing**: Validate in controlled environment
5. **Deployment**: Real-world implementation

![Simulation to Deployment](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop)

## Simulation Tools
![Simulation Tools](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
- **Gazebo**: Physics-based simulation
- **V-REP/CoppeliaSim**: Robot simulation
- **MATLAB/Simulink**: Control system simulation
- **ROS**: Robot Operating System

![Gazebo Simulation](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop)

## Hardware Development
![Hardware Development](https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop)
- Circuit design and PCB layout
- Component selection and sourcing
- Prototyping and testing
- Integration with software
- Safety and reliability testing

![PCB Design](https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop)

## Software Development
![Software Development Robotics](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
- ROS node development
- Sensor drivers and interfaces
- Control algorithms
- Navigation and planning
- User interfaces

## Best Practices
![Best Practices Robotics](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop)
- Test in simulation first
- Use version control (Git)
- Document hardware and software
- Follow safety protocols
- Iterate and refine continuously`,
            },
            {
                title: 'Chip Design for Edge AI: A Practical Guide',
                summary: 'Guide to designing low-power chips for edge AI applications',
                content: `# Chip Design for Edge AI: A Practical Guide

![Edge AI Chip](https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop)

## Overview
Edge AI requires specialized chip designs that balance performance and power consumption.

![Chip Design Overview](https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop)

## Design Considerations
![Design Considerations](https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop)
- **Power Budget**: Strict power constraints
- **Performance**: Meet computational requirements
- **Area**: Minimize chip size and cost
- **Memory**: Efficient memory hierarchy
- **Thermal**: Manage heat dissipation

![Power Optimization](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop)

## Design Flow
![Design Flow](https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop)
1. **Specification**: Define requirements
2. **Architecture**: High-level design
3. **RTL Design**: Register-transfer level
4. **Synthesis**: Convert to gates
5. **Place & Route**: Physical layout
6. **Verification**: Test and validate

![RTL Design](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)

## Tools and Technologies
![EDA Tools](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
- **HDL**: Verilog, VHDL
- **EDA Tools**: Cadence, Synopsys, Xilinx
- **Simulation**: ModelSim, VCS
- **FPGA**: For prototyping

![FPGA Prototyping](https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop)

## Optimization Techniques
![Optimization Techniques](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop)
- Algorithm-hardware co-design
- Approximate computing
- Memory optimization
- Parallel processing
- Low-power design techniques

## Best Practices
![Best Practices Chip Design](https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop)
- Start with FPGA prototyping
- Profile and optimize critical paths
- Consider system-level trade-offs
- Validate with real workloads
- Document design decisions`,
            },
        ],
        'lab-006': [
            {
                title: 'Introduction to Educational Technology Research',
                summary: 'Guide for researchers entering the field of educational technology',
                content: `# Introduction to Educational Technology Research

![EdTech Header](https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop)

## Welcome
Welcome to the Education & Society Laboratory! Explore how technology transforms education.

![Education Lab](https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop)

## Research Focus Areas
![Learning Platforms](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)
1. **Learning Platforms**: E-learning systems and LMS

![Adaptive Learning](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop)
2. **Adaptive Learning**: Personalized education through AI

![Learning Analytics](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
3. **Learning Analytics**: Data-driven insights into learning

![Educational Games](https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop)
4. **Educational Games**: Gamification and game-based learning

![Social Impact](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)
5. **Social Impact**: Technology's role in educational equity

## Research Methodologies
![Research Methodologies EdTech](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop)
- **User Studies**: Testing with students and teachers
- **Experimental Design**: Controlled studies
- **Data Analytics**: Learning analytics and mining
- **Case Studies**: Real-world implementations
- **Mixed Methods**: Combining quantitative and qualitative

![User Studies](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)

## Getting Started
![Getting Started EdTech](https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop)
1. Understand educational theories and pedagogy
2. Learn about learning management systems
3. Study human-computer interaction in education
4. Connect with educators and schools
5. Identify research questions

## Resources
![EdTech Resources](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)
- Access to learning platforms
- Educational datasets
- Partnerships with schools
- User testing facilities
- Educational content library`,
            },
            {
                title: 'Conducting Educational Technology Research: Best Practices',
                summary: 'Best practices for designing and conducting research in educational technology',
                content: `# Conducting Educational Technology Research: Best Practices

![EdTech Best Practices](https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop)

## Research Design
![Research Design EdTech](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)
- **Research Questions**: Clear and focused
- **Participants**: Students, teachers, administrators
- **Context**: Realistic learning environments
- **Duration**: Sufficient for meaningful results
- **Ethics**: IRB approval and informed consent

![Classroom Research](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)

## Data Collection Methods
![Data Collection EdTech](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop)
- **Surveys**: Student and teacher feedback
- **Interviews**: In-depth insights
- **Observations**: Classroom behavior
- **Learning Analytics**: System-generated data
- **Assessments**: Learning outcomes

![Student Surveys](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)

## Analysis Techniques
![Analysis EdTech](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
- Statistical analysis of learning outcomes
- Qualitative analysis of interviews
- Learning analytics and data mining
- Comparative studies
- Longitudinal analysis

## Evaluation Metrics
![Evaluation Metrics EdTech](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
- Learning effectiveness
- User engagement and motivation
- Usability and user experience
- Accessibility and inclusivity
- Scalability and sustainability

## Ethical Considerations
![Ethics EdTech](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)
- Student privacy and data protection
- Informed consent from all participants
- Minimize disruption to learning
- Fair access to technology
- Responsible data use`,
            },
            {
                title: 'Publishing Educational Technology Research',
                summary: 'Guide to publishing research in educational technology venues',
                content: `# Publishing Educational Technology Research

![Publishing EdTech](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop)

## Target Venues
![EdTech Venues](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop)
- **Top Conferences**: CHI, LAK, EDM, AIED
- **Journals**: Computers & Education, BJET, ETR&D
- **Specialized**: International Journal of Educational Technology

## Research Contribution Types
![Contribution Types EdTech](https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop)
- New learning technologies or platforms
- Pedagogical innovations
- Learning analytics methods
- Evaluation studies
- Theoretical frameworks

## Paper Structure
![Paper Structure EdTech](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Clear educational problem
- Technology or method description
- Evaluation methodology
- Results and findings
- Educational implications
- Limitations and future work

## Key Elements
![Key Elements EdTech](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Educational relevance and impact
- Rigorous evaluation
- Clear pedagogical grounding
- Practical applicability
- Consideration of diverse learners

## Writing Tips
![Writing Tips EdTech](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop)
- Connect technology to learning theory
- Include educational context
- Show impact on learning outcomes
- Address accessibility and equity
- Provide actionable insights for educators`,
            },
        ],
    };

    const labGuideData = labGuides[labId] || [];
    const baseDate = new Date('2020-01-01');

    labGuideData.forEach((guideData, index) => {
        const createdBy = allMembers[Math.floor(Math.random() * allMembers.length)]?.id || director?.id || 'unknown';
        const createdDate = randomDate(baseDate, new Date());
        const status: ResearchGuideStatus = index === 0 ? 'PUBLISHED' : (Math.random() > 0.3 ? 'PUBLISHED' : 'DRAFT');

        guides.push({
            id: `guide-${labId}-${String(guideCounter).padStart(3, '0')}`,
            labId: labId,
            createdBy: createdBy,
            title: guideData.title,
            summary: guideData.summary,
            content: guideData.content,
            status: status,
            createdDate: createdDate,
            updatedDate: recentDate(Math.floor(Math.random() * 30)),
        });
        guideCounter++;
    });

    return guides;
};

// Generate all research guides for all labs
export const mockResearchGuides: ResearchGuide[] = mockLabs.flatMap(lab => generateResearchGuidesForLab(lab.id));

// Helper function to get research guides by lab
export const getResearchGuidesByLab = (labId: string): ResearchGuide[] => {
    return mockResearchGuides.filter(guide => guide.labId === labId);
};

// Helper function to get published research guides
export const getPublishedResearchGuides = (): ResearchGuide[] => {
    return mockResearchGuides.filter(guide => guide.status === 'PUBLISHED');
};

// Helper function to get research guides by lab and status
export const getResearchGuidesByLabAndStatus = (labId: string, status: ResearchGuideStatus): ResearchGuide[] => {
    return mockResearchGuides.filter(guide => guide.labId === labId && guide.status === status);
};

