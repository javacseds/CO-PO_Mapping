export interface CourseOutcome {
  id: string; // e.g. "CO1"
  description: string;
}

export interface Outcome {
  id: string; // e.g. "PO1" or "PSO1"
  name: string;
  description: string;
}

export interface SubjectTemplate {
  subjectName: string;
  subjectCode: string;
  department: string;
  regulation: string;
  program: string;
  semester: string;
  year: string;
  credits: number;
  academicYear: string;
  facultyName: string;
  courseOutcomes: CourseOutcome[];
  psos: Outcome[];
  psoEnabled: boolean;
  syllabus: string;
}

export const DEFAULT_POS: Outcome[] = [
  {
    id: "PO1",
    name: "Engineering Knowledge",
    description: "Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems."
  },
  {
    id: "PO2",
    name: "Problem Analysis",
    description: "Identify, formulate, review literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences."
  },
  {
    id: "PO3",
    name: "Design/Development of Solutions",
    description: "Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations."
  },
  {
    id: "PO4",
    name: "Conduct Investigations of Complex Problems",
    description: "Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions."
  },
  {
    id: "PO5",
    name: "Modern Tool Usage",
    description: "Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations."
  },
  {
    id: "PO6",
    name: "The Engineer and Society",
    description: "Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice."
  },
  {
    id: "PO7",
    name: "Environment and Sustainability",
    description: "Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development."
  },
  {
    id: "PO8",
    name: "Ethics",
    description: "Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice."
  },
  {
    id: "PO9",
    name: "Individual and Team Work",
    description: "Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings."
  },
  {
    id: "PO10",
    name: "Communication",
    description: "Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions."
  },
  {
    id: "PO11",
    name: "Project Management and Finance",
    description: "Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments."
  },
  {
    id: "PO12",
    name: "Life-long Learning",
    description: "Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change."
  }
];

export const DEPARTMENT_TEMPLATES: Record<string, SubjectTemplate> = {
  "CSE": {
    subjectName: "Data Structures and Algorithms",
    subjectCode: "20A05301T",
    department: "Computer Science & Engineering",
    regulation: "R20",
    program: "B.Tech",
    semester: "III",
    year: "II",
    credits: 3,
    academicYear: "2026-27",
    facultyName: "Dr. A. Ramakrishna",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Understand and analyze the time and space complexity of sorting and searching algorithms." },
      { id: "CO2", description: "Design and implement stack and queue data structures for real-world application modeling." },
      { id: "CO3", description: "Develop and traverse trees and binary search trees to manage hierarchical data systems." },
      { id: "CO4", description: "Apply hash table techniques and resolve collisions to optimize dictionary search times." },
      { id: "CO5", description: "Construct graph structures and implement shortest path algorithms for network routing solutions." },
      { id: "CO6", description: "Collaborate in teams to build a software system utilizing custom heap-based priority queues." }
    ],
    psos: [
      { id: "PSO1", name: "Software Systems", description: "Design, develop, and test high-performance system software and applications in diverse domains." },
      { id: "PSO2", name: "Computational Methods", description: "Apply theoretical computer science principles and mathematical techniques to analyze complex computational models." },
      { id: "PSO3", name: "Modern Technologies", description: "Adopt advanced technologies like AI, Cloud Computing, and Cybersecurity to solve industry-relevant challenges." }
    ],
    syllabus: "Unit 1: Introduction to Analysis of Algorithms, Sorting (Bubble, Quick, Merge, Heap) and Searching (Binary, Linear). Complexity notations.\nUnit 2: Linear Data Structures: Stacks and Queues operations, applications (expression evaluation, recursion).\nUnit 3: Hierarchical Structures: Binary Trees, BST traversals, AVL trees, insertion and deletion.\nUnit 4: Hashing: Hash functions, Collision resolution strategies, HashMap implementations.\nUnit 5: Graphs: Representations (Matrix, List), Traversals (BFS, DFS), Shortest Path (Dijkstra, Prim's) and Applications."
  },
  "ECE": {
    subjectName: "Microprocessors & Microcontrollers",
    subjectCode: "20A04501T",
    department: "Electronics & Communication Engineering",
    regulation: "R20",
    program: "B.Tech",
    semester: "V",
    year: "III",
    credits: 3,
    academicYear: "2026-27",
    facultyName: "Prof. S. Muralidhar",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Differentiate between the architectures of 8086 microprocessor and 8051 microcontroller." },
      { id: "CO2", description: "Write assembly level programs to solve mathematical computations and memory manipulation." },
      { id: "CO3", description: "Design interface circuits for LEDs, LCDs, motors, and keyboard using peripheral chips like 8255." },
      { id: "CO4", description: "Configure interrupts and timers of microcontrollers to handle external hardware events." },
      { id: "CO5", description: "Develop embedded system prototypes using modern IDEs and debug board connections." }
    ],
    psos: [
      { id: "PSO1", name: "Hardware & VLSI Design", description: "Design, simulate and test analog/digital electronic systems using modern EDA tools." },
      { id: "PSO2", name: "Communication Systems", description: "Analyze and implement signal processing and high-speed communication systems using microprocessors." }
    ],
    syllabus: "Unit 1: 8086 Architecture, register organization, memory segmentation, instruction set.\nUnit 2: Assembly Language Programming of 8086: loops, subroutines, arithmetic and logical instructions.\nUnit 3: 8255 PPI, interfacing with LED, 7-Segment, Stepper Motor, DAC/ADC converters.\nUnit 4: 8051 Architecture: I/O Ports, memory mapping, interrupt structure, timers/counters.\nUnit 5: Introduction to Embedded C and prototyping platforms (Keil IDE)."
  },
  "EEE": {
    subjectName: "Power System Analysis",
    subjectCode: "20A02601T",
    department: "Electrical & Electronics Engineering",
    regulation: "R20",
    program: "B.Tech",
    semester: "VI",
    year: "III",
    credits: 3,
    academicYear: "2026-27",
    facultyName: "Dr. K. Venkatesh",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Formulate impedance and admittance matrices (Y-bus and Z-bus) for large electrical networks." },
      { id: "CO2", description: "Solve load flow equations using Gauss-Seidel and Newton-Raphson numerical methods." },
      { id: "CO3", description: "Analyze symmetrical and unsymmetrical faults on transmission lines using symmetrical components." },
      { id: "CO4", description: "Assess steady-state and transient stability limits of power systems under contingency states." },
      { id: "CO5", description: "Utilize simulation tools like MATLAB/MiPower to analyze voltage profiles and system security." }
    ],
    psos: [
      { id: "PSO1", name: "Electrical Infrastructure", description: "Analyze and design electrical machines, power grid architectures and distribution networks." },
      { id: "PSO2", name: "Green Energy & Grid Control", description: "Apply control algorithms and power electronics to integrate renewable energy resources into smart grids." }
    ],
    syllabus: "Unit 1: Graph theory in power systems, formation of Y-bus matrix using direct inspection and singular transformation.\nUnit 2: Power Flow Studies: Gauss-Seidel, Newton-Raphson, and Fast Decoupled methods. Comparison.\nUnit 3: Symmetrical Faults: Transients on transmission lines, short-circuit calculations. Unsymmetrical faults analysis.\nUnit 4: Power System Stability: Rotor dynamics, swing equation, equal area criterion, critical clearing angle.\nUnit 5: Computer-aided power system analysis: Contingency analysis and grid monitoring."
  },
  "Mechanical": {
    subjectName: "Design of Machine Elements",
    subjectCode: "20A03504T",
    department: "Mechanical Engineering",
    regulation: "R20",
    program: "B.Tech",
    semester: "V",
    year: "III",
    credits: 4,
    academicYear: "2026-27",
    facultyName: "Prof. P. Veerendra",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Apply static and dynamic theories of failure to design mechanical components under loads." },
      { id: "CO2", description: "Design temporary and permanent joints including riveted, welded, and bolted connections." },
      { id: "CO3", description: "Calculate dimensions of transmission shafts, keys, and coupling components for torque transmission." },
      { id: "CO4", description: "Design helical springs and power screws considering fatigue limits and stress concentrations." },
      { id: "CO5", description: "Conduct structural stress analysis of machine elements using CAD/FEA simulation software." }
    ],
    psos: [
      { id: "PSO1", name: "Mechanical Design & FEA", description: "Apply computer-aided engineering (CAD/CAM/FEA) tools to design and analyze mechanical components." },
      { id: "PSO2", name: "Manufacturing & Thermal", description: "Synthesize manufacturing processes, material science, and thermal engineering concepts to optimize production." }
    ],
    syllabus: "Unit 1: Design considerations, materials, limits, fits, tolerances. Theories of failure under static and dynamic loading.\nUnit 2: Design of riveted, welded and bolted joints. Eccentric loading considerations.\nUnit 3: Shafts, keys, and couplings: design for strength and rigidity. ASME code.\nUnit 4: Springs: Helical, leaf, torsional. Power screws: design, efficiency, self-locking.\nUnit 5: Stress concentration, fatigue strength, S-N curve, Soderberg and Goodman lines."
  },
  "Civil": {
    subjectName: "Reinforced Concrete Structures",
    subjectCode: "20A01501T",
    department: "Civil Engineering",
    regulation: "R20",
    program: "B.Tech",
    semester: "V",
    year: "III",
    credits: 4,
    academicYear: "2026-27",
    facultyName: "Dr. G. Srinivas",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Understand structural safety principles using limit state method of concrete design." },
      { id: "CO2", description: "Design singly, doubly reinforced, and flanged beams for shear, flexure, and torsion limits." },
      { id: "CO3", description: "Design one-way and two-way slabs with different boundary conditions under service loads." },
      { id: "CO4", description: "Design axially loaded short and slender concrete columns and combined shallow foundations." },
      { id: "CO5", description: "Review designs according to Indian Standard codes (IS 456:2000) for structural integrity." }
    ],
    psos: [
      { id: "PSO1", name: "Structural Engineering", description: "Analyze and design safe, sustainable infrastructure (bridges, buildings, dams) conforming to code rules." },
      { id: "PSO2", name: "Geotech & Environment", description: "Evaluate soil behaviors, water treatment plants, and environmental impacts of construction projects." }
    ],
    syllabus: "Unit 1: Limit State Method: Philosophy, IS 456 rules. Analysis of beams for flexure.\nUnit 2: Design of Beams for Shear, Bond, and Torsion. Limit state of serviceability.\nUnit 3: Design of slabs: One-way, Two-way, continuous slabs. Detailing of reinforcement.\nUnit 4: Columns: Classification, design of short rectangular and circular columns under axial load.\nUnit 5: Footings: Design of isolated square, rectangular and circular footings under load."
  },
  "AI&ML": {
    subjectName: "Machine Learning Foundations",
    subjectCode: "20A30502T",
    department: "Artificial Intelligence & Machine Learning",
    regulation: "R20",
    program: "B.Tech",
    semester: "V",
    year: "III",
    credits: 3,
    academicYear: "2026-27",
    facultyName: "Dr. M. Swetha",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Differentiate between supervised, unsupervised, and reinforcement learning paradigms." },
      { id: "CO2", description: "Apply regression, decision trees, and SVM algorithms to perform classification and prediction." },
      { id: "CO3", description: "Implement clustering algorithms (K-Means, PCA) to discover patterns in unlabeled datasets." },
      { id: "CO4", description: "Evaluate model performance using confusion matrices, ROC-AUC, and cross-validation techniques." },
      { id: "CO5", description: "Formulate neural network solutions for image and sequential text analysis tasks." }
    ],
    psos: [
      { id: "PSO1", name: "AI Model Development", description: "Build, deploy and optimize intelligent algorithms and deep neural networks for complex classification tasks." },
      { id: "PSO2", name: "Data Engineering", description: "Process large-scale datasets, construct data pipelines, and extract insights using statistical computing." }
    ],
    syllabus: "Unit 1: Concept Learning, Decision Trees, Linear and Logistic Regression, Gradient Descent.\nUnit 2: Support Vector Machines (SVM), Naive Bayes classifier, K-Nearest Neighbors (KNN).\nUnit 3: Unsupervised Learning: Clustering (K-Means, Hierarchical), Dimensionality Reduction (PCA).\nUnit 4: Model Evaluation: Precision, Recall, F1-Score, ROC, Cross-validation. Bias-Variance tradeoff.\nUnit 5: Artificial Neural Networks: Perceptron, Backpropagation, Introduction to Deep Learning."
  },
  "Data Science": {
    subjectName: "Big Data Technologies",
    subjectCode: "20A32601T",
    department: "Data Science",
    regulation: "R20",
    program: "B.Tech",
    semester: "VI",
    year: "III",
    credits: 3,
    academicYear: "2026-27",
    facultyName: "Prof. R. Anand",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Understand the core architecture of Hadoop Distributed File System (HDFS) and MapReduce." },
      { id: "CO2", description: "Formulate MapReduce algorithms to process semi-structured and unstructured data dumps." },
      { id: "CO3", description: "Write optimized Spark SQL queries to execute parallel processing in memory." },
      { id: "CO4", description: "Design NoSQL database structures (HBase, MongoDB) for high-velocity data ingestion." },
      { id: "CO5", description: "Analyze real-time sensor streams using Kafka and Spark Streaming tools." }
    ],
    psos: [
      { id: "PSO1", name: "Big Data Processing", description: "Create scalable pipelines to store, process, and analyze petabyte-scale structured/unstructured datasets." },
      { id: "PSO2", name: "Analytical Models", description: "Apply predictive modeling, business intelligence tools and data visualizations to solve business problems." }
    ],
    syllabus: "Unit 1: Introduction to Big Data, HDFS architecture, block replication, NameNode/DataNode mechanisms.\nUnit 2: MapReduce: Programming model, execution flow, mapper, reducer, combiner, partitioner.\nUnit 3: Apache Spark: Core architecture, RDDs, transformations and actions, Spark SQL, DataFrames.\nUnit 4: NoSQL Databases: Key-Value, Document, Columnar, Graph stores. HBase and MongoDB basics.\nUnit 5: Real-time Analytics: Apache Kafka, Spark Streaming integration, processing window operations."
  },
  "Cyber Security": {
    subjectName: "Cryptography & Network Security",
    subjectCode: "20A33501T",
    department: "Computer Science (Cyber Security)",
    regulation: "R20",
    program: "B.Tech",
    semester: "V",
    year: "III",
    credits: 3,
    academicYear: "2026-27",
    facultyName: "Dr. P. Rajesh",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Understand and evaluate active and passive security threats and vulnerability matrices." },
      { id: "CO2", description: "Implement symmetric key encryption (AES, DES) and analyze cryptographic robustness." },
      { id: "CO3", description: "Apply public key algorithms (RSA, ECC) and digital signatures for authentication security." },
      { id: "CO4", description: "Configure secure network protocols (SSL/TLS, IPsec) to protect web data channels." },
      { id: "CO5", description: "Construct security shields including firewalls, IDSs, and honey-pots to prevent network intrusions." }
    ],
    psos: [
      { id: "PSO1", name: "Cryptographic Architecture", description: "Design and implement security protocols, cipher mechanisms, and secure access systems for systems and networks." },
      { id: "PSO2", name: "Vulnerability & Auditing", description: "Conduct security audits, penetration testing, and incident response to mitigate cyber threats." }
    ],
    syllabus: "Unit 1: Security Services, Mechanisms, Classical Encryption Techniques (Substitution, Transposition). Stream vs Block Ciphers.\nUnit 2: Block Ciphers: Data Encryption Standard (DES), Advanced Encryption Standard (AES), block cipher modes.\nUnit 3: Public Key Cryptography: RSA, Diffie-Hellman Key Exchange, Elliptic Curve Cryptography (ECC).\nUnit 4: Message Authentication: Hash Functions (SHA-512), Message Authentication Codes (MAC), Digital Signatures.\nUnit 5: Network Security: IPsec, SSL/TLS, Firewalls configuration, Intrusion Detection Systems."
  },
  "IoT": {
    subjectName: "IoT Architecture & Protocols",
    subjectCode: "20A34602T",
    department: "Computer Science (IoT)",
    regulation: "R20",
    program: "B.Tech",
    semester: "VI",
    year: "III",
    credits: 3,
    academicYear: "2026-27",
    facultyName: "Mr. B. Harish",
    psoEnabled: true,
    courseOutcomes: [
      { id: "CO1", description: "Classify layers of standard IoT reference architectures and sensor communication types." },
      { id: "CO2", description: "Implement sensor interfaces and analog data logging using Raspberry Pi or Arduino." },
      { id: "CO3", description: "Select appropriate application layer protocols (MQTT, CoAP, HTTP) for IoT device telemetry." },
      { id: "CO4", description: "Design wireless sensor networks utilizing ZigBee, Bluetooth, and LoRa protocols." },
      { id: "CO5", description: "Develop cloud-integrated IoT projects featuring dashboard telemetry and threshold alert controls." }
    ],
    psos: [
      { id: "PSO1", name: "IoT Hardware & Nodes", description: "Design, interface and program microcontroller-based smart sensor nodes and gateway devices." },
      { id: "PSO2", name: "Telecommunication & Networks", description: "Configure wireless communication stacks, low-power mesh networks, and IoT cloud platforms." }
    ],
    syllabus: "Unit 1: IoT Introduction, physical and logical designs, IoT levels, standard architectures (M2M, WSN).\nUnit 2: Interfacing: Sensors (Temperature, Humidity, Ultrasonic), Actuators. Programming Arduino and Raspberry Pi.\nUnit 3: IoT Application Layer Protocols: MQTT architecture, broker, publish/subscribe, CoAP messages, HTTP REST.\nUnit 4: Wireless Stacks: IEEE 802.15.4, ZigBee, Bluetooth Low Energy (BLE), LoRaWAN architectures.\nUnit 5: IoT Cloud Integration: AWS IoT, ThingSpeak, dashboard setup, web hook alerts, data storage."
  }
};
