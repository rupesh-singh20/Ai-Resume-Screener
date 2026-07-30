const { GoogleGenerativeAI } = require('@google/generative-ai');

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not defined. Using mock AI service responses.');
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

const callGemini = async (prompt, systemInstruction = '') => {
  const model = getModel();
  if (!model) return null;

  try {
    const fullPrompt = systemInstruction 
      ? `${systemInstruction}\n\nUser Input:\n${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    return null;
  }
};

const cleanJson = (text) => {
  if (!text) return null;
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.substring(7);
    } else if (clean.startsWith('```')) {
      clean = clean.substring(3);
    }
    if (clean.endsWith('```')) {
      clean = clean.substring(0, clean.length - 3);
    }
    return JSON.parse(clean.trim());
  } catch (e) {
    console.error('Failed to parse clean JSON from Gemini response:', text);
    // Attempt regex extraction
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (innerError) {
      console.error('Regex parse fallback failed:', innerError);
    }
    return null;
  }
};

// -------------------------------------------------------------
// Mock Response Generators (Fallback when API key is missing)
// -------------------------------------------------------------
const getMockAnalysis = (resumeText) => {
  const lowerText = resumeText.toLowerCase();
  
  // Custom skills extraction mock
  const techOptions = ['javascript', 'react', 'node.js', 'python', 'java', 'html', 'css', 'sql', 'mongodb', 'express', 'git', 'docker', 'aws', 'typescript'];
  const softOptions = ['communication', 'teamwork', 'leadership', 'problem solving', 'adaptability', 'critical thinking', 'time management'];
  
  const extractedTech = techOptions.filter(skill => lowerText.includes(skill));
  const extractedSoft = softOptions.filter(skill => lowerText.includes(skill));
  
  if (extractedTech.length === 0) extractedTech.push('HTML', 'CSS', 'JavaScript');
  if (extractedSoft.length === 0) extractedSoft.push('Communication', 'Problem Solving');

  const randomScore = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return {
    score: randomScore(70, 92),
    structure: randomScore(75, 95),
    contactInfo: lowerText.includes('@') || lowerText.includes('phone') ? 95 : 60,
    technicalSkills: extractedTech.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    softSkills: extractedSoft.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    experience: randomScore(65, 88),
    projects: randomScore(70, 90),
    education: lowerText.includes('degree') || lowerText.includes('bachelor') || lowerText.includes('university') ? 90 : 50,
    certifications: lowerText.includes('certificate') || lowerText.includes('certified') ? ['AWS Certified Developer', 'Scrum Master'] : ['Google Analytics Certificate'],
    keywords: ['Agile', 'Full-stack development', 'REST API', 'Version Control'],
    grammar: randomScore(80, 98),
    formatting: randomScore(75, 90),
    compatibility: randomScore(70, 90),
    summary: 'The candidate displays a solid understanding of software development principles with a core concentration on front-end/full-stack practices. Their projects demonstrate hands-on experience, although their work experience section could use deeper metric-driven descriptions.',
    suggestions: [
      'Quantify achievements in your work experience (e.g., \"improved page speed by 40%\" rather than \"worked on page speed\").',
      'Add more industry-recognized keywords related to cloud architecture if applicable.',
      'Ensure contact information is clearly visible at the top of the first page.'
    ],
    missingSkills: ['TypeScript', 'Docker', 'Jest (Testing)'],
    learningRoadmap: [
      {
        step: 'Master TypeScript Foundations',
        description: 'Learn strict typing, interfaces, generics, and compiler configurations.',
        resource: 'TypeScript Deep Dive (Online Guide) & official docs.'
      },
      {
        step: 'Containerization with Docker',
        description: 'Understand containerization, Dockerfiles, and compose configurations for server-side environments.',
        resource: 'Docker & Kubernetes: The Practical Guide (Udemy).'
      },
      {
        step: 'Unit and Integration Testing',
        description: 'Add tests to your existing React applications using Jest and React Testing Library.',
        resource: 'Testing JavaScript by Kent C. Dodds.'
      }
    ],
    careerRecommendation: 'Junior to Mid-Level Full Stack Developer. Given the profile structure, they are best suited for product-led startups where they can own features end-to-end.'
  };
};

const aiService = {
  // 1. Full Resume Analysis
  analyzeResume: async (resumeText) => {
    const prompt = `Analyze the following resume text and grade it based on professional recruitment criteria.
You must return a raw JSON object (with no markdown wrappers) matching the exact schema below:
{
  "score": 0 to 100 integer,
  "structure": 0 to 100 integer,
  "contactInfo": 0 to 100 integer,
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "experience": 0 to 100 integer,
  "projects": 0 to 100 integer,
  "education": 0 to 100 integer,
  "certifications": ["cert1", "cert2"],
  "keywords": ["keyword1", "keyword2"],
  "grammar": 0 to 100 integer,
  "formatting": 0 to 100 integer,
  "compatibility": 0 to 100 integer,
  "summary": "overall candidate description summary string",
  "suggestions": ["suggestion1", "suggestion2"],
  "missingSkills": ["missing1", "missing2"],
  "learningRoadmap": [
    { "step": "step name", "description": "detail", "resource": "suggested source" }
  ],
  "careerRecommendation": "recommendation title string"
}

Resume Text:
${resumeText}`;

    const systemInstruction = "You are a professional HR Screening Agent and ATS parsing engine. Extract details and grade the resume accurately. Return ONLY the raw JSON string.";
    
    const response = await callGemini(prompt, systemInstruction);
    const parsed = cleanJson(response);
    
    if (parsed) return parsed;
    // Return mock fallback
    return getMockAnalysis(resumeText);
  },

  // 2. Job Description Match
  matchJobDescription: async (resumeText, jobDescription) => {
    const prompt = `Evaluate the match between the resume text and the job description.
Return a raw JSON object matching the exact schema below:
{
  "score": 0 to 100 integer,
  "matchStatus": "High Match" | "Moderate Match" | "Low Match",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "fitExplanation": "detailed explanation of fit",
  "recommendedUpgrades": ["upgrade1", "upgrade2"],
  "experienceMatch": 0 to 100 integer,
  "projectMatch": 0 to 100 integer,
  "educationMatch": 0 to 100 integer,
  "resumeQuality": 0 to 100 integer,
  "learningRoadmap": [
    { "step": "step name", "description": "detail", "resource": "suggested source", "duration": "estimated duration" }
  ]
}

Resume:
${resumeText}

Job Description:
${jobDescription}`;

    const systemInstruction = "You are a recruitment screening bot. Compare the candidate's profile with the requirements and report the metrics in JSON format only.";
    
    const response = await callGemini(prompt, systemInstruction);
    const parsed = cleanJson(response);
    if (parsed) return parsed;

    // Mock response if API fails/missing
    return {
      score: 78,
      matchStatus: 'Moderate Match',
      matchingSkills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
      missingSkills: ['Node.js', 'MongoDB', 'AWS Deployment'],
      fitExplanation: 'The candidate is strong in front-end technologies and has worked with React and standard style tools, which matches the UI needs. However, the job requests full-stack capacity including Express/Mongoose services, which are missing from the resume.',
      recommendedUpgrades: [
        'Add details regarding backend database integration (MongoDB/SQL) to the resume.',
        'Highlight REST API architecture or microservices experience.',
        'Include credentials or projects demonstrating Node.js/Express service construction.'
      ],
      experienceMatch: 80,
      projectMatch: 75,
      educationMatch: 100,
      resumeQuality: 92,
      learningRoadmap: [
        {
          step: 'Node.js & Express REST APIs',
          description: 'Construct server-side middleware, handles validation, dynamic endpoints, and error control.',
          resource: 'Node.js Complete Guide (Maximilian Schwarzmüller / Udemy)',
          duration: '2 Weeks'
        },
        {
          step: 'MongoDB & Mongoose Schemas',
          description: 'Model relational-like properties using standard mongoose schemas and integrate queries.',
          resource: 'MongoDB - The Complete Developer\'s Guide (Udemy)',
          duration: '1 Week'
        },
        {
          step: 'AWS Deployment Orchestration',
          description: 'Deploy code containers onto AWS EC2 instances, manage security groups, and use environment configuration files.',
          resource: 'AWS Developer Associate training path',
          duration: '2 Weeks'
        }
      ]
    };
  },

  // 3. Cover Letter Generator
  generateCoverLetter: async (resumeText, jobTitle, companyName) => {
    const prompt = `Write a professional, highly-tailored cover letter for the role of "${jobTitle}" at "${companyName}" based on the qualifications listed in this resume:
${resumeText}

The cover letter should be engaging, structured professionally, and keep a length of 3-4 paragraphs. Don't add placeholder texts (like [Date]). Just output the final written letter.`;

    const response = await callGemini(prompt);
    if (response) return response.trim();

    return `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${companyName}. With my extensive background in front-end development, hands-on project creation, and strong technical foundations in modern JavaScript tools, I am confident in my ability to make an immediate impact on your team.

In my previous projects, I have consistently focused on building user-centric, high-performance web components using React and responsive design templates. I take pride in writing clean, modular code and working within agile environments to deliver features on schedule.

The opportunity to join ${companyName} is exciting to me because of your commitment to technical innovation and engineering excellence. I am eager to apply my troubleshooting skills and collaborative spirit to help solve your complex client problems.

Thank you for your time and consideration. I look forward to the possibility of discussing how my experiences and career aspirations align with the requirements of this role.

Sincerely,
Job Seeker`;
  },

  // 4. Mock Interview Question & Answer Assistant
  generateInterviewQuestions: async (resumeText, count = 5) => {
    const prompt = `Generate ${count} technical and behavioral interview questions tailored to the following candidate profile:
${resumeText}

Return a raw JSON array of strings, e.g.:
["question1", "question2", "question3"]`;

    const response = await callGemini(prompt);
    const parsed = cleanJson(response);
    if (parsed && Array.isArray(parsed)) return parsed;

    return [
      "Can you describe a challenging project you built using React and how you managed application state?",
      "In your resume, you listed JavaScript skills. Explain the event loop and how asynchronous callbacks are processed.",
      "How do you approach optimizing a slow web page or improving load times?",
      "Tell me about a time you had to learn a new programming tool under a tight project deadline.",
      "How do you handle disagreement with a designer or product manager regarding how a feature should be implemented?"
    ];
  },

  gradeInterviewAnswer: async (question, answer, resumeContext = '') => {
    const prompt = `Evaluate the candidate's answer to the given interview question.
Question: ${question}
Candidate Answer: ${answer}
(Optional Context of candidate: ${resumeContext})

Return a raw JSON object matching the exact schema below:
{
  "rating": 1 to 5 integer,
  "feedback": "constructive analysis of the answer",
  "keyMissingPoints": ["point1", "point2"],
  "improvedAnswer": "exemplary version of how the candidate could answer"
}`;

    const response = await callGemini(prompt);
    const parsed = cleanJson(response);
    if (parsed) return parsed;

    return {
      rating: 4,
      feedback: 'Good structured answer. You explained your logic clearly and named key hooks like useEffect and custom handlers. However, you could make it stronger by citing a specific situation where you resolved a rendering bottleneck.',
      keyMissingPoints: [
        'Mentioning the use of React.memo or useMemo to prevent unnecessary child re-renders.',
        'Sharing an actual quantitative result (e.g., \"reduced render count by 50%\").'
      ],
      improvedAnswer: `In React, I manage state using local state for components, Context API for lightweight global properties, or Redux Toolkit for complex structures. To optimize renders, I keep state localized. For instance, when troubleshooting a render delay in a dashboard lists component, I refactored the states, applied React.memo to sub-items, and memorized callbacks with useCallback, which cut page render times in half.`
    };
  },

  // 5. Rank Multiple Candidates
  rankCandidates: async (candidates, jobDescription) => {
    // candidates is an array of { id, name, text }
    const candidateSummaries = candidates.map((c, idx) => `Candidate #${idx + 1} (ID: ${c.id}, Name: ${c.name}):\n${c.text.substring(0, 1500)}`).join('\n\n---\n\n');
    
    const prompt = `You are an executive recruiter. Rank the following candidates against the job description.
Job Description:
${jobDescription}

Candidates list:
${candidateSummaries}

Provide the ranking as a JSON array of objects sorted from highest matching to lowest. Match schema:
[
  { "id": "candidate ID string", "rank": 1, "score": 95, "reason": "why they are ranked here" }
]`;

    const response = await callGemini(prompt);
    const parsed = cleanJson(response);
    if (parsed && Array.isArray(parsed)) return parsed;

    // Fallback ranking if API key is not active
    return candidates.map((c, index) => ({
      id: c.id,
      rank: index + 1,
      score: 90 - (index * 8),
      reason: 'Analyzed match based on core skills and listed projects. Candidate shows relevant knowledge matching the requirements.'
    })).sort((a, b) => b.score - a.score);
  },

  // 6. Generate Complete Preparation Hub Data
  generatePrepHubData: async (resumeText, jobDescription, companyName) => {
    const prompt = `You are a professional HR Screening Agent and Technical Interviewer.
Generate a comprehensive interview preparation dataset for a candidate with the following resume details applying to the job described below at "${companyName}".

Resume details:
${resumeText}

Job Description:
${jobDescription}

You must return a raw JSON object (with no markdown wrappers) matching the exact schema below:
{
  "roleQuestions": [
    { "question": "question string", "answer": "detailed sample answer", "tip": "interview tip", "commonMistakes": "common mistakes to avoid" }
  ],
  "companyQuestions": [
    { "question": "company core value or specific question", "answer": "detailed sample answer", "companyContext": "why this company asks this" }
  ],
  "resumeQuestions": [
    { "question": "question about their specific project or experience", "answer": "suggested answer connecting to the job", "resumeContext": "reference to resume part" }
  ],
  "codingChallenges": [
    { "title": "challenge title", "description": "detailed technical/system design prompt", "difficulty": "Easy" | "Medium" | "Hard", "starterCode": "starter function skeleton or template", "solution": "correct sample code or key architectural steps", "systemDesign": true | false }
  ]
}

Make sure to generate exactly 3 items for each of the lists.`;

    const systemInstruction = "You are a senior hiring manager. Compare the candidate's profile with the requirements and company name to output structured preparation materials in JSON format only.";
    
    const response = await callGemini(prompt, systemInstruction);
    const parsed = cleanJson(response);
    if (parsed) return parsed;

    // Fallback Mock Response if Gemini API fails or is not active
    return {
      roleQuestions: [
        {
          question: "How do you optimize state updates and avoid unnecessary renders in a React-based client dashboard?",
          answer: "State updates can be optimized by keeping state local where possible, memoizing complex list components with React.memo, caching expensive computations via useMemo, and stabilizing function dependencies using useCallback. Additionally, for dashboard updates, state batching or throttling WebSocket inputs can prevent rendering loops.",
          tip: "Focus on describing the virtual DOM diffing process and cite specific hooks that directly manage component re-renders.",
          commonMistakes: "Failing to explain how React determines whether to re-render, or recommending Redux globally for issues that are purely layout-driven."
        },
        {
          question: "Describe your experience implementing middleware in Express.js for authentication or error logging.",
          answer: "In Node.js, Express middleware intercepts requests before they hit controllers. For auth, a custom middleware parses the Authorization header, validates the JWT, and appends the decoded payload to req.user. For logging, we write handlers to log HTTP methods, response codes, and errors using Winston or Morgan logger setups.",
          tip: "Explicitly trace the req, res, next sequence and discuss error handling middleware signature (4 parameters: err, req, res, next).",
          commonMistakes: "Forgetting to call next(), which hangs the request indefinitely, or storing global state inside middleware variables."
        },
        {
          question: "Explain the differences between SQL and MongoDB databases and how you decide which to use.",
          answer: "SQL is relational, structured, and strictly enforces schema validation, making it ideal for transaction-heavy or highly relational architectures. MongoDB is document-based, flexible, and horizontal-scaling, perfect for content management, user-defined forms, or rapid iterations where schema requirements change frequently.",
          tip: "Discuss ACID compliance for SQL versus the document structure and dynamic JSON schemas in MongoDB.",
          commonMistakes: "Claiming MongoDB has 'no schema structure at all' (it has validation options) or saying SQL database setups cannot scale."
        }
      ],
      companyQuestions: [
        {
          question: `Why do you want to work at ${companyName} specifically, and how do your skills align with our business?`,
          answer: `I am highly motivated to join ${companyName} because of your focus on technical innovation and building developer-centric applications. My expertise in React web layouts, REST API middlewares, and structured database queries aligns directly with your platform's core services. I enjoy working in product-led environments where front-end optimization directly translates to higher user activation.`,
          companyContext: "This helps evaluate candidate motivations, brand alignment, and whether they understand the target customer profile."
        },
        {
          question: `How do you handle rapid scope changes and product updates at ${companyName}?`,
          answer: "I handle shift changes by keeping code modular, writing thorough unit tests that document functionality, and communicating proactively with project leads. Breaking down tasks into smaller, incremental deliverables ensures that even if goals shift, the code remains clean and progress can be salvaged.",
          companyContext: "Evaluates agility, adaptability, and standard team interaction methods inside product teams."
        },
        {
          question: "Describe a time you solved an ambiguous technical problem with limited instruction.",
          answer: "In a previous project, I had to implement a local fallback database when MongoDB connections dropped. I researched localized JSON file sync systems, designed a file-read/write controller structure, and verified that client endpoints successfully failover and self-heal when database connectivity returned. I documented the logic and shared it with my team.",
          companyContext: "Tests self-direction, execution capability, and problem-solving drive."
        }
      ],
      resumeQuestions: [
        {
          question: "In your profile, you describe working with JavaScript and web layouts. Walk me through a challenging UI bug you resolved.",
          answer: "I once encountered a rendering lag on a data grid populated with hundreds of candidates. Inspecting Chrome DevTools showed layout thrashing. I fixed it by virtualizing the list (only rendering visible rows), resulting in a 65% reduction in frame paint times and a completely fluid scrolling experience.",
          resumeContext: "Front-end list optimization and browser performance audit."
        },
        {
          question: "You listed Node.js. How did you structure your backend files to keep them clean as features expanded?",
          answer: "I structure my backend using the MVC architecture: routes handle mapping, controllers contain validation and process orchestration, services handle third-party APIs (like Gemini), and models define database fields. This separation of concerns makes testing and refactoring codebase chunks very clean.",
          resumeContext: "Modular MVC backend architecture."
        },
        {
          question: "How do you handle security parameters, such as managing your GEMINI_API_KEY or JWT credentials?",
          answer: "I store all private credentials inside a root-level .env file which is added to gitignore so it never gets committed to git. On the server, we retrieve them via process.env and validate JWT inputs using signed header tokens with standard expiration durations.",
          resumeContext: "Secure environment configuration."
        }
      ],
      codingChallenges: [
        {
          title: "Verify Balanced Parentheses in a Code String",
          description: "Write a function `isValidParentheses(str)` that takes a string of bracket characters and returns `true` if all brackets are properly balanced and closed in the correct order, otherwise return `false`.",
          difficulty: "Easy",
          starterCode: "function isValidParentheses(str) {\n  // Write your code here\n  return false;\n}",
          solution: "function isValidParentheses(str) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (let char of str) {\n    if (['(', '{', '['].includes(char)) {\n      stack.push(char);\n    } else if ([')', '}', ']'].includes(char)) {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
          systemDesign: false
        },
        {
          title: "Scale a Global API Rate Limiter",
          description: "Design a scalable API Rate Limiter that can handle up to 10,000 requests per second. Explain which algorithm you would use (e.g. Token Bucket, Sliding Window Log) and draft key components for storing IP address metrics.",
          difficulty: "Medium",
          starterCode: "// Outline your architectural tiers and system components here:\n// 1. Data Store:\n// 2. Algorithm:\n// 3. Middlewares:",
          solution: "1. Data Store: Use Redis for fast in-memory key-value lookups with TTL expiration.\n2. Algorithm: Token Bucket or Sliding Window Counter to allow burst traffic while strictly limiting total requests.\n3. Middleware: Express middleware extracts client IP, checks Redis count, increments, and returns 429 Too Many Requests if limit is exceeded.",
          systemDesign: true
        },
        {
          title: "Find Duplicate Items in an Array",
          description: "Write a function `findDuplicates(arr)` that finds all duplicate values inside a given array and returns them as a new array of unique values.",
          difficulty: "Easy",
          starterCode: "function findDuplicates(arr) {\n  // Write your code here\n  return [];\n}",
          solution: "function findDuplicates(arr) {\n  const seen = new Set();\n  const duplicates = new Set();\n  for (let item of arr) {\n    if (seen.has(item)) {\n      duplicates.add(item);\n    }\n    seen.add(item);\n  }\n  return Array.from(duplicates);\n}",
          systemDesign: false
        }
      ]
    };
  }
};

module.exports = aiService;
