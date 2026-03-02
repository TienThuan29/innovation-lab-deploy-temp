import { User, UserProfile, Role } from "@/types/user";

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
  // Use a fixed reference date or just current date if acceptable (rendering same day)
  // For hydration safety better to use fixed date relative to build/run or consistent logic
  const date = new Date();
  // To avoid hydration mismatch on "seconds", we might want to floor it, 
  // but usually generic "days ago" is fine if Date.now() doesn't drift between server/client render significantly (seconds might).
  // Safest is to use a fixed anchor if possible, but for now let's just accept slight possible drift or use a fixed "now"
  // Actually, Date.now() differs on server vs client.
  // Best to Mock a "Today" as fixed date regarding the mocks initialization.
  const FIXED_NOW = new Date('2025-01-01T12:00:00Z');
  const d = new Date(FIXED_NOW);
  d.setDate(d.getDate() - daysAgo);
  return d;
};

// Academic titles by role
const getAcademicTitle = (role: Role, index: number): string => {
  if (role === "DIRECTOR" || role === "SUPER_DIRECTOR") {
    return ["Prof.", "Dr.", "Professor"][index % 3];
  }
  if (role === "LECTURER") {
    return ["Dr.", "PhD", "Assoc. Prof.", "Asst. Prof."][index % 4];
  }
  if (role === "RESEARCHER") {
    return ["PhD", "Dr.", "M.Sc.", "MSc"][index % 4];
  }
  return "Student";
};

// Generate research interests based on lab focus
const getResearchInterests = (labId: string, role: Role, seed: number): string => {
  const interests: Record<string, string[]> = {
    "lab-001": [
      "AI-Powered Security",
      "Threat Detection",
      "Machine Learning in Cybersecurity",
      "Network Security",
      "Cryptography",
      "Automated Incident Response",
    ],
    "lab-002": [
      "Business Model Innovation",
      "Startup Incubation",
      "Market Analysis",
      "Digital Transformation",
      "Strategic Planning",
      "Innovation Management",
    ],
    "lab-003": [
      "UI/UX Design",
      "Digital Media",
      "Graphic Design",
      "3D Modeling",
      "Animation",
      "AR/VR Development",
    ],
    "lab-004": [
      "Supply Chain Optimization",
      "Warehouse Management",
      "Transportation Logistics",
      "Inventory Management",
      "Demand Forecasting",
      "IoT in Logistics",
    ],
    "lab-005": [
      "Robotic Systems",
      "Chip Design",
      "Embedded Systems",
      "Autonomous Navigation",
      "Sensor Integration",
      "Hardware-Software Co-design",
    ],
    "lab-006": [
      "Educational Technology",
      "E-Learning Platforms",
      "Learning Analytics",
      "Social Impact Research",
      "Digital Literacy",
      "Curriculum Development",
    ],
  };

  const labInterests = interests[labId] || [];
  if (role === "STUDENT") {
    return labInterests.slice(0, 2).join(", ");
  }
  // Deterministic slice
  const count = getDeterministicInt(3, 5, seed);
  return labInterests.slice(0, count).join(", ");
};

// Generate user profiles
const generateProfile = (
  userId: string,
  labId: string,
  role: Role,
  index: number,
  joinDate: Date,
  seed: number
): UserProfile => {
  const profileId = `profile-${userId}`;
  const orcid = `0000-000${getDeterministicInt(1000, 9999, seed)}-${getDeterministicInt(1000, 9999, seed + 1)}-${getDeterministicInt(1, 9, seed + 2)}`;

  return {
    id: profileId,
    academicTitle: getAcademicTitle(role, index),
    researchInterests: getResearchInterests(labId, role, seed),
    publicEmail: `researcher${index}@${labId}.innovationlabs.com`,
    publicPhone: `+84-24-${getDeterministicInt(1000, 9999, seed + 3)}-${getDeterministicInt(1000, 9999, seed + 4)}`,
    researchGateUrl: `https://www.researchgate.net/profile/${userId}`,
    googleScholarUrl: `https://scholar.google.com/citations?user=${userId}`,
    orcid: `https://orcid.org/${orcid}`,
    linkedinUrl: `https://www.linkedin.com/in/${userId}`,
    joinDate: joinDate,
    leaveDate:
      role === "STUDENT"
        ? getDeterministicDate(new Date(joinDate), new Date('2025-01-01'), seed + 5)
        : new Date("2099-12-31"),
    createdDate: joinDate,
    updatedDate: getRecentDate(getDeterministicInt(1, 30, seed + 6)),
  };
};

// Names database
const firstNames = {
  male: [
    "James", "Robert", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Christopher", "Daniel",
    "Matthew", "Anthony", "Mark", "Donald", "Steven", "Andrew", "Paul", "Joshua", "Kenneth", "Kevin",
    "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary",
  ],
  female: [
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Emily", "Donna", "Michelle",
    "Carol", "Amanda", "Melissa", "Deborah", "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia", "Kathleen",
  ],
};

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee",
  "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
  "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson",
  "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
];

const getDeterministicName = (seed: number): {
  first: string;
  last: string;
  gender: "male" | "female";
} => {
  const gender = seededRandom(seed) > 0.5 ? "male" : "female";
  const fList = firstNames[gender];
  const first = fList[Math.floor(seededRandom(seed + 1) * fList.length)];
  const last = lastNames[Math.floor(seededRandom(seed + 2) * lastNames.length)];
  return { first, last, gender };
};

// Generate users for a lab
const generateUsersForLab = (labId: string, labIndex: number): User[] => {
  const users: User[] = [];
  let userCounter = 1;
  let seedBase = labIndex * 1000;

  const baseCreatedDate = getDeterministicDate(
    new Date("2017-01-01"),
    new Date("2022-01-01"),
    seedBase
  );

  // 1 Director
  const dirName = getDeterministicName(seedBase + 100);
  const dirId = `user-${labId}-dir`;

  // Set specific avatar and fullname for lab-001 director
  const directorAvatarUrl =
    labId === "lab-001"
      ? "https://res.cloudinary.com/dvvwi2qhe/image/upload/v1766926151/view_jl3u6x.webp"
      : `https://i.pravatar.cc/300?img=${((labIndex * 100 + userCounter) % 70) + 1}`;

  const directorFullname =
    labId === "lab-001"
      ? "Huynh Cong Viet Ngu"
      : `${dirName.first} ${dirName.last}`;

  users.push({
    id: dirId,
    email: `director@${labId}.innovationlabs.com`,
    password: "hashed_password_123", // In real app, this would be hashed
    fullname: directorFullname,
    avartarUrl: directorAvatarUrl,
    isEnable: true,
    profile: generateProfile(
      dirId,
      labId,
      "DIRECTOR",
      userCounter,
      baseCreatedDate,
      seedBase + 101
    ),
    role: "DIRECTOR",
    labId: labId,
    lastLoginDate: getRecentDate(getDeterministicInt(1, 7, seedBase + 102)),
    createdDate: baseCreatedDate,
    updatedDate: getRecentDate(getDeterministicInt(1, 30, seedBase + 103)),
  });
  userCounter++;

  // 1-3 Lecturers (deterministic)
  const lecturerCount = getDeterministicInt(1, 3, seedBase + 150);
  for (let i = 0; i < lecturerCount; i++) {
    const seed = seedBase + 200 + i * 10;
    const lecName = getDeterministicName(seed);
    const lecId = `user-${labId}-lec-${i + 1}`;
    users.push({
      id: lecId,
      email: `lecturer${i + 1}@${labId}.innovationlabs.com`,
      password: "hashed_password_123",
      fullname: `${getAcademicTitle("LECTURER", i)} ${lecName.first} ${lecName.last}`,
      avartarUrl: `https://i.pravatar.cc/300?img=${((labIndex * 100 + userCounter) % 70) + 1}`,
      isEnable: true,
      profile: generateProfile(
        lecId,
        labId,
        "LECTURER",
        userCounter,
        getDeterministicDate(baseCreatedDate, new Date("2023-01-01"), seed + 1),
        seed + 2
      ),
      role: "LECTURER",
      labId: labId,
      lastLoginDate: getRecentDate(getDeterministicInt(1, 14, seed + 3)),
      createdDate: getDeterministicDate(baseCreatedDate, new Date("2023-06-01"), seed + 4),
      updatedDate: getRecentDate(getDeterministicInt(1, 30, seed + 5)),
    });
    userCounter++;
  }

  // Fixed 8 Researchers for consistency
  const researcherCount = 8;
  for (let i = 0; i < researcherCount; i++) {
    const seed = seedBase + 300 + i * 10;
    const resName = getDeterministicName(seed);
    const resId = `user-${labId}-res-${i + 1}`;
    users.push({
      id: resId,
      email: `researcher${i + 1}@${labId}.innovationlabs.com`,
      password: "hashed_password_123",
      fullname: `${resName.first} ${resName.last}`,
      avartarUrl: `https://i.pravatar.cc/300?img=${((labIndex * 100 + userCounter) % 70) + 1}`,
      isEnable: true,
      profile: generateProfile(
        resId,
        labId,
        "RESEARCHER",
        userCounter,
        getDeterministicDate(baseCreatedDate, new Date("2024-01-01"), seed + 1),
        seed + 2
      ),
      role: "RESEARCHER",
      labId: labId,
      lastLoginDate: getRecentDate(getDeterministicInt(1, 30, seed + 3)),
      createdDate: getDeterministicDate(baseCreatedDate, new Date("2024-06-01"), seed + 4),
      updatedDate: getRecentDate(getDeterministicInt(1, 30, seed + 5)),
    });
    userCounter++;
  }

  return users;
};

// Generate all users for all labs
// Fixed Super Director account for login testing
const superDirector: User = {
  id: "user-super-director",
  email: "superdirector@innovationlabs.com",
  password: "123456",
  fullname: "Super Director",
  avartarUrl: "https://i.pravatar.cc/300?img=1",
  isEnable: true,
  profile: generateProfile(
    "user-super-director",
    "lab-001",
    "SUPER_DIRECTOR",
    0,
    new Date("2017-01-01"),
    1000
  ),
  role: "SUPER_DIRECTOR",
  labId: "lab-001",
  lastLoginDate: getRecentDate(1),
  createdDate: new Date("2017-01-01"),
  updatedDate: getRecentDate(7),
};

// Fixed Directors, Lecturers, and Students for each lab
const fixedLabIds = [
  "lab-001",
  "lab-002",
  "lab-003",
  "lab-004",
  "lab-005",
  "lab-006",
] as const;

const fixedDirectors: User[] = fixedLabIds.map((labId, idx) => {
  const id = `fixed-${labId}-director`;
  const join = new Date("2018-01-01");
  return {
    id,
    email: `director.test@${labId}.innovationlabs.com`,
    password: "123456",
    fullname: `Director Test ${idx + 1}`,
    avartarUrl: `https://i.pravatar.cc/300?img=${10 + idx}`,
    isEnable: true,
    profile: generateProfile(id, labId, "DIRECTOR", idx + 1, join, 2000 + idx * 10),
    role: "DIRECTOR",
    labId,
    lastLoginDate: getRecentDate(2),
    createdDate: join,
    updatedDate: getRecentDate(5),
  };
});

const fixedLecturersAndStudents: User[] = fixedLabIds.flatMap(
  (labId, labIdx) => {
    const users: User[] = [];
    for (let i = 1; i <= 2; i++) {
      const lecId = `fixed-${labId}-lecturer-${i}`;
      const lecJoin = new Date("2019-01-01");
      users.push({
        id: lecId,
        email: `lecturer${i}.test@${labId}.innovationlabs.com`,
        password: "123456",
        fullname: `Lecturer Test ${labIdx + 1}.${i}`,
        avartarUrl: `https://i.pravatar.cc/300?img=${20 + labIdx * 2 + i}`,
        isEnable: true,
        profile: generateProfile(lecId, labId, "LECTURER", i, lecJoin, 3000 + labIdx * 100 + i * 10),
        role: "LECTURER",
        labId,
        lastLoginDate: getRecentDate(3),
        createdDate: lecJoin,
        updatedDate: getRecentDate(6),
      });

      for (let j = 1; j <= 2; j++) {
        const stuId = `fixed-${labId}-lecturer-${i}-student-${j}`;
        const stuJoin = new Date("2021-01-01");
        users.push({
          id: stuId,
          email: `student${j}.lec${i}.test@${labId}.innovationlabs.com`,
          password: "123456",
          fullname: `Student Test ${labIdx + 1}.${i}.${j}`,
          avartarUrl: `https://i.pravatar.cc/300?img=${40 + labIdx * 4 + (i - 1) * 2 + j}`,
          isEnable: true,
          profile: generateProfile(stuId, labId, "STUDENT", j, stuJoin, 4000 + labIdx * 100 + i * 10 + j),
          role: "STUDENT",
          labId,
          lastLoginDate: getRecentDate(4),
          createdDate: stuJoin,
          updatedDate: getRecentDate(7),
        });
      }
    }
    return users;
  },
);

export const mockUsers: User[] = [
  // Fixed accounts for login testing
  superDirector,
  ...fixedDirectors,
  ...fixedLecturersAndStudents,

  // Lab 001 - AI & Cybersecurity Lab (AIC)
  ...generateUsersForLab("lab-001", 1),

  // Lab 002 - Business & Entrepreneurship Lab (BEL)
  ...generateUsersForLab("lab-002", 2),

  // Lab 003 - Creative Media & Design Lab (CMD)
  ...generateUsersForLab("lab-003", 3),

  // Lab 004 - Logistics and Supply Chain Lab (LSC)
  ...generateUsersForLab("lab-004", 4),

  // Lab 005 - Robotics & Chip Lab (Robochip)
  ...generateUsersForLab("lab-005", 5),

  // Lab 006 - Education & Society Lab (ESL)
  ...generateUsersForLab("lab-006", 6),
];

// Helper function to get users by lab
export const getUsersByLab = (labId: string): User[] => {
  return mockUsers.filter((user) => user.labId === labId);
};

// Helper function to get users by role
export const getUsersByRole = (role: Role): User[] => {
  return mockUsers.filter((user) => user.role === role);
};

// Convenience subsets by role
export const mockDirectors = getUsersByRole("DIRECTOR");
export const mockLecturers = getUsersByRole("LECTURER");
export const mockResearchers = getUsersByRole("RESEARCHER");
