import { 
  vehicleCategories as sourceVehicleCategories, 
  questionCategories,
  Question as SourceQuestion,
  VehicleCategory as SourceVehicleCategory
} from './getdata';

// Transformed interfaces for the app
export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  subjectId: number;
  image?: string;
  explanation?: string;
}

export interface Subject {
  id: number;
  name: string;
  questionCount: number;
}

export interface VehicleCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// Map vehicle categories from source data
export const vehicleCategories: VehicleCategory[] = sourceVehicleCategories.map(cat => ({
  id: cat.id.toLowerCase(),
  name: cat.label,
  icon: cat.id === 'B' ? 'car' : cat.id === 'C' ? 'truck' : cat.id === 'D' ? 'bus' : 'tractor',
  description: cat.gadjet
}));

// Map subjects from source data
export const subjects: Subject[] = questionCategories.map(cat => ({
  id: cat.id,
  name: cat.name,
  questionCount: 0 // Will be calculated dynamically
}));

// Helper to get subject ID from category name
const getSubjectIdFromName = (categoryName: string): number => {
  const match = categoryName.match(/^(\d+)\./);
  return match ? parseInt(match[1], 10) : 1;
};

// Transform source question to app question format
const transformQuestion = (q: SourceQuestion, subjectId: number): Question => {
  const correctIndex = q.answers.findIndex(a => a.isCorrect);
  return {
    id: q._id,
    question: q.desc,
    answers: q.answers.map(a => a.text),
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    subjectId,
    image: q.image && q.image !== 'https://www.starti.ge/exam/shss.png' ? q.image : undefined,
    explanation: q.answeringQuestion
  };
};

// Get all questions for a specific vehicle category
export const getQuestionsForVehicle = (vehicleId: string): Question[] => {
  const vehicleCat = sourceVehicleCategories.find(
    v => v.id.toLowerCase() === vehicleId.toLowerCase()
  );
  
  if (!vehicleCat) return [];
  
  const questions: Question[] = [];
  
  Object.entries(vehicleCat.categoryMappings).forEach(([categoryName, categoryData]) => {
    const subjectId = getSubjectIdFromName(categoryName);
    categoryData.questions.forEach(q => {
      questions.push(transformQuestion(q, subjectId));
    });
  });
  
  return questions;
};

// Get questions for a specific subject within a vehicle category
export const getQuestionsForSubject = (vehicleId: string, subjectId: number): Question[] => {
  const vehicleCat = sourceVehicleCategories.find(
    v => v.id.toLowerCase() === vehicleId.toLowerCase()
  );
  
  if (!vehicleCat) return [];
  
  const questions: Question[] = [];
  
  Object.entries(vehicleCat.categoryMappings).forEach(([categoryName, categoryData]) => {
    const catSubjectId = getSubjectIdFromName(categoryName);
    if (catSubjectId === subjectId) {
      categoryData.questions.forEach(q => {
        questions.push(transformQuestion(q, subjectId));
      });
    }
  });
  
  return questions;
};

// Get subjects with question counts for a specific vehicle
export const getSubjectsForVehicle = (vehicleId: string): Subject[] => {
  const vehicleCat = sourceVehicleCategories.find(
    v => v.id.toLowerCase() === vehicleId.toLowerCase()
  );
  
  if (!vehicleCat) return subjects;
  
  return questionCategories.map(cat => {
    const categoryName = Object.keys(vehicleCat.categoryMappings).find(
      name => getSubjectIdFromName(name) === cat.id
    );
    
    const questionCount = categoryName 
      ? vehicleCat.categoryMappings[categoryName]?.questions?.length || 0 
      : 0;
    
    return {
      id: cat.id,
      name: cat.name,
      questionCount
    };
  }).filter(s => s.questionCount > 0);
};

// Legacy functions for backward compatibility
export const generateQuestionsForSubject = (subjectId: number, count: number = 30): Question[] => {
  // Default to category B for legacy calls
  return getQuestionsForSubject('b', subjectId).slice(0, count);
};

export const getAllQuestions = (): Question[] => {
  // Default to category B for legacy calls
  return getQuestionsForVehicle('b');
};
