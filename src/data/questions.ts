export interface Question {
  id: number;
  question: string;
  questionEn?: string;
  answers: string[];
  answersEn?: string[];
  correctAnswer: number;
  subjectId: number;
  image?: string;
}

export interface Subject {
  id: number;
  name: string;
  nameEn: string;
  questionCount: number;
}

export interface VehicleCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const vehicleCategories: VehicleCategory[] = [
  { id: 'b', name: 'B, B1', icon: 'car', description: 'მსუბუქი ავტომობილი' },
  { id: 'c', name: 'C', icon: 'truck', description: 'სატვირთო ავტომობილი' },
  { id: 'd', name: 'D', icon: 'bus', description: 'ავტობუსი' },
  { id: 'ts', name: 'TS', icon: 'tractor', description: 'ტრაქტორი' },
];

export const subjects: Subject[] = [
  { id: 1, name: '1. მძოლი, მგზავრი და ქვეითი, ნიშნები, კონვეცია', nameEn: '1. Driver, Passenger and Pedestrian, Signs, Convention', questionCount: 92 },
  { id: 2, name: '2. უნარივრობა და მართვის პირობები', nameEn: '2. Safety and Driving Conditions', questionCount: 85 },
  { id: 3, name: '3. გაფრთხილებელი ნიშნები', nameEn: '3. Warning Signs', questionCount: 78 },
  { id: 4, name: '4. პრიორიტეტის ნიშნები', nameEn: '4. Priority Signs', questionCount: 65 },
  { id: 5, name: '5. ამკრძალავი ნიშნები', nameEn: '5. Prohibitory Signs', questionCount: 94 },
  { id: 6, name: '6. მიმთითებელი ნიშნები', nameEn: '6. Mandatory Signs', questionCount: 72 },
  { id: 7, name: '7. საინფორმაციო-მაჩვენებელი ნიშნები', nameEn: '7. Informational Signs', questionCount: 88 },
  { id: 8, name: '8. სერვისის ნიშნები', nameEn: '8. Service Signs', questionCount: 45 },
  { id: 9, name: '9. დამატებითი ინფორმაციის ნიშნები', nameEn: '9. Additional Information Signs', questionCount: 56 },
  { id: 10, name: '10. შუქნიშნის სიგნალები', nameEn: '10. Traffic Light Signals', questionCount: 68 },
  { id: 11, name: '11. მარეგულირებლის სიგნალები', nameEn: '11. Traffic Controller Signals', questionCount: 42 },
  { id: 12, name: '12. გზის მონიშვნა', nameEn: '12. Road Markings', questionCount: 76 },
  { id: 13, name: '13. მოძრაობის დაწყება და მანევრირება', nameEn: '13. Starting Movement and Maneuvering', questionCount: 89 },
  { id: 14, name: '14. სიჩქარე და დისტანცია', nameEn: '14. Speed and Distance', questionCount: 54 },
  { id: 15, name: '15. გასწრება და შემხვედრი მოძრაობა', nameEn: '15. Overtaking and Oncoming Traffic', questionCount: 67 },
];

export const sampleQuestions: Question[] = [
  {
    id: 1,
    question: 'როგორ შეიძლება საბურავების ცვეთის ინტენსივობის შემცირება?',
    questionEn: 'How can tire wear intensity be reduced?',
    answers: [
      'საბურავებში არსებული ჰაერის წნევის დადგენილ დონეზე შენარჩუნებით',
      'მაღალი სიჩქარით მოძრაობით',
      'ზამთრის საბურავების ზაფხულში გამოყენებით'
    ],
    answersEn: [
      'By maintaining the air pressure in tires at the established level',
      'By driving at high speed',
      'By using winter tires in summer'
    ],
    correctAnswer: 0,
    subjectId: 1
  },
  {
    id: 2,
    question: 'დასახლებულ პუნქტში ფარა-პროჟექტორით და ფარა-მაძიებლით სარგებლობა შეუძლია:',
    questionEn: 'In a populated area, headlight-projector and headlight-seeker can be used by:',
    answers: [
      'მხოლოდ ოპერატიული და სპეციალური სამსახურების სატრანსპორტო საშუალებათა მძოლებს სამსახურებრივი მოვალეობის შესრულებისას',
      'მხოლოდ სახიფათო ტვირთის გადამტანი ავტოსატრანსპორტო საშუალებების მძოლებს',
      'ნებისმიერ მძოლს, სურვილის შემთხვევაში'
    ],
    answersEn: [
      'Only drivers of operational and special service vehicles when performing official duties',
      'Only drivers of vehicles carrying dangerous cargo',
      'Any driver, if desired'
    ],
    correctAnswer: 0,
    subjectId: 1
  },
  {
    id: 3,
    question: 'რა არის მძღოლის მოვალეობა მოძრაობის დაწყებისას?',
    questionEn: 'What is the driver\'s obligation when starting movement?',
    answers: [
      'დარწმუნდეს რომ მოძრაობა უსაფრთხოა',
      'ჩართოს საავარიო სიგნალი',
      'მისცეს ხმოვანი სიგნალი'
    ],
    answersEn: [
      'Make sure that the movement is safe',
      'Turn on the hazard signal',
      'Give an audible signal'
    ],
    correctAnswer: 0,
    subjectId: 13
  },
  {
    id: 4,
    question: 'რა არის ნებადართული მაქსიმალური სიჩქარე დასახლებულ პუნქტში?',
    questionEn: 'What is the maximum permitted speed in a populated area?',
    answers: [
      '60 კმ/სთ',
      '80 კმ/სთ',
      '40 კმ/სთ'
    ],
    answersEn: [
      '60 km/h',
      '80 km/h',
      '40 km/h'
    ],
    correctAnswer: 0,
    subjectId: 14
  },
  {
    id: 5,
    question: 'როდის არის აკრძალული გასწრება?',
    questionEn: 'When is overtaking prohibited?',
    answers: [
      'ქვეითთა გადასასვლელზე',
      'გზის სწორ მონაკვეთზე',
      'როცა წინ მოძრავი ავტომობილი შეანელებს'
    ],
    answersEn: [
      'At a pedestrian crossing',
      'On a straight section of the road',
      'When the vehicle ahead slows down'
    ],
    correctAnswer: 0,
    subjectId: 15
  },
  {
    id: 6,
    question: 'წითელი შუქნიშანი ნიშნავს:',
    questionEn: 'A red traffic light means:',
    answers: [
      'მოძრაობა აკრძალულია',
      'მოძრაობა ნებადართულია',
      'სიფრთხილე'
    ],
    answersEn: [
      'Movement is prohibited',
      'Movement is permitted',
      'Caution'
    ],
    correctAnswer: 0,
    subjectId: 10
  },
  {
    id: 7,
    question: 'ყვითელი მოციმციმე შუქი ნიშნავს:',
    questionEn: 'A flashing yellow light means:',
    answers: [
      'გადაიარეთ სიფრთხილით',
      'მოძრაობა აკრძალულია',
      'გაჩერდით'
    ],
    answersEn: [
      'Proceed with caution',
      'Movement is prohibited',
      'Stop'
    ],
    correctAnswer: 0,
    subjectId: 10
  },
  {
    id: 8,
    question: 'რას ნიშნავს მარეგულირებლის მარჯვენა ხელი ზევით აწეული?',
    questionEn: 'What does the traffic controller\'s right hand raised up mean?',
    answers: [
      'ყველა მოძრაობა აკრძალულია',
      'მოძრაობა ნებადართულია',
      'მხოლოდ მარჯვნივ მოხვევა'
    ],
    answersEn: [
      'All movement is prohibited',
      'Movement is permitted',
      'Right turn only'
    ],
    correctAnswer: 0,
    subjectId: 11
  },
  {
    id: 9,
    question: 'გაფრთხილებელი ნიშნის ფორმა არის:',
    questionEn: 'The shape of a warning sign is:',
    answers: [
      'სამკუთხედი',
      'წრე',
      'მართკუთხედი'
    ],
    answersEn: [
      'Triangle',
      'Circle',
      'Rectangle'
    ],
    correctAnswer: 0,
    subjectId: 3
  },
  {
    id: 10,
    question: 'პრიორიტეტის ნიშანი "გზა დაეთმე" ნიშნავს:',
    questionEn: 'Priority sign "Give Way" means:',
    answers: [
      'უპირატესობა მიანიჭეთ სხვა ავტომობილს',
      'თქვენ გაქვთ უპირატესობა',
      'გზა დაკეტილია'
    ],
    answersEn: [
      'Give priority to other vehicles',
      'You have priority',
      'Road is closed'
    ],
    correctAnswer: 0,
    subjectId: 4
  }
];

// Generate more questions for each subject
export const generateQuestionsForSubject = (subjectId: number, count: number = 30): Question[] => {
  const baseQuestions = sampleQuestions.filter(q => q.subjectId === subjectId);
  const questions: Question[] = [...baseQuestions];
  
  for (let i = baseQuestions.length; i < count; i++) {
    questions.push({
      id: subjectId * 1000 + i,
      question: `კითხვა #${i + 1} თემიდან ${subjectId}`,
      questionEn: `Question #${i + 1} from subject ${subjectId}`,
      answers: ['პასუხი 1', 'პასუხი 2', 'პასუხი 3'],
      answersEn: ['Answer 1', 'Answer 2', 'Answer 3'],
      correctAnswer: Math.floor(Math.random() * 3),
      subjectId
    });
  }
  
  return questions;
};

export const getAllQuestions = (): Question[] => {
  let allQuestions: Question[] = [];
  subjects.forEach(subject => {
    allQuestions = [...allQuestions, ...generateQuestionsForSubject(subject.id, subject.questionCount)];
  });
  return allQuestions;
};
