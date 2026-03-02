import { StudentAssignment } from "@/types/assignment";

export const mockAssignments: StudentAssignment[] = [
  {
    id: "assign-001",
    studentId: "student-001",
    suppervisorId: "user-lab-001-dir",
    labId: "lab-001",
    name: "Machine Learning Research Project",
    description:
      "Develop and train a neural network model for image classification. The project involves data preprocessing, model selection, hyperparameter tuning, and evaluation.",
    finalScore: 95,
    feedback:
      "Excellent work! Your implementation is well-structured and achieves state-of-the-art results.",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-04-30"),
    createdDate: new Date("2024-01-10"),
    updatedDate: new Date("2024-05-15"),
    status: "COMPLETED",
  },
  {
    id: "assign-002",
    studentId: "student-002",
    suppervisorId: "user-lab-001-dir",
    labId: "lab-001",
    name: "Cybersecurity Threat Analysis",
    description:
      "Analyze and document common cybersecurity threats in enterprise networks. Propose mitigation strategies and implement security hardening measures.",
    finalScore: 88,
    feedback:
      "Good analysis and practical recommendations. Consider exploring more advanced intrusion detection techniques.",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-31"),
    createdDate: new Date("2024-01-25"),
    updatedDate: new Date("2024-06-10"),
    status: "COMPLETED",
  },
  {
    id: "assign-003",
    studentId: "student-003",
    suppervisorId: "user-lab-002-res-1",
    labId: "lab-002",
    name: "Cloud Infrastructure Deployment",
    description:
      "Design and deploy a scalable cloud infrastructure using AWS/Azure. Implement auto-scaling, load balancing, and disaster recovery mechanisms.",
    finalScore: 0,
    feedback: "",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-08-31"),
    createdDate: new Date("2024-02-20"),
    updatedDate: new Date("2024-12-20"),
    status: "ONGOING",
  },
  {
    id: "assign-004",
    studentId: "student-004",
    suppervisorId: "user-lab-001-dir",
    labId: "lab-001",
    name: "Data Mining and Visualization",
    description:
      "Extract insights from large datasets and create interactive visualizations. Focus on pattern recognition and trend analysis.",
    finalScore: 92,
    feedback:
      "Impressive visualizations! Your insights are valuable for business decision-making.",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2023-12-15"),
    createdDate: new Date("2023-08-25"),
    updatedDate: new Date("2023-12-20"),
    status: "COMPLETED",
  },
  {
    id: "assign-005",
    studentId: "student-005",
    suppervisorId: "user-lab-002-res-1",
    labId: "lab-002",
    name: "Business Process Optimization",
    description:
      "Analyze and optimize company business processes. Implement lean methodologies and automation using RPA tools.",
    finalScore: 65,
    feedback:
      "Basic understanding demonstrated, but lacks depth in automation implementation. Recommend revisiting advanced RPA concepts.",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    createdDate: new Date("2023-12-15"),
    updatedDate: new Date("2024-04-05"),
    status: "COMPLETED",
  },
  {
    id: "assign-006",
    studentId: "student-006",
    suppervisorId: "user-lab-001-dir",
    labId: "lab-001",
    name: "IoT Smart Home System",
    description:
      "Design and implement a smart home IoT system with sensors, actuators, and a central control system. Include mobile app interface.",
    finalScore: 0,
    feedback: "",
    startDate: new Date("2024-05-15"),
    endDate: new Date("2024-10-30"),
    createdDate: new Date("2024-05-01"),
    updatedDate: new Date("2024-12-20"),
    status: "ONGOING",
  },
];
