export enum EnglishLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student' | 'admin';
  academyId: string;
  currentEnglishLevel?: EnglishLevel;
  avatar?: string;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName?: string;
  level: EnglishLevel;
  teacherId: string;
  teacherName?: string;
  questions: Question[];
  totalPoints: number;
  oxfordReference?: string;
  createdAt: Date;
  dueDate: Date;
  status: 'draft' | 'published' | 'closed';
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'open_text' | 'essay' | 'listening' | 'speaking';
  questionText: string;
  points: number;
  correctAnswer?: string;
  rubric?: Rubric;
}

export interface Rubric {
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle?: string;
  studentId: string;
  studentName?: string;
  imageUrl: string;
  ocrText?: string;
  ocrConfidence?: number;
  ocrProcessed: boolean;
  needsReview: boolean;
  submittedAt: Date;
  status: 'uploaded' | 'ocr_processing' | 'ocr_completed' | 'needs_review' | 'ready_to_grade' | 'graded';
  gradedAt?: Date;
  totalScore?: number;
  teacherComments?: string;
}

export interface Course {
  id: string;
  name: string;
  level: EnglishLevel;
  academyId: string;
  teacherId: string;
  teacherName?: string;
  startDate: Date;
  endDate: Date;
  studentCount?: number;
  oxfordMaterials?: {
    bookTitle?: string;
    isbn?: string;
    units?: string[];
  };
}

export interface DashboardStats {
  totalExams: number;
  pendingGrading: number;
  completedGrading: number;
  totalStudents: number;
  totalTeachers: number;
  examsByLevel: {
    level: EnglishLevel;
    count: number;
    pending: number;
  }[];
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'exam_created' | 'exam_graded' | 'submission_uploaded' | 'ocr_completed';
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
}

export interface TeacherGradingProfile {
  teacherId: string;
  totalGradings: number;
  averageGradingTime: number;
  preferences: {
    feedbackStyle: 'concise' | 'detailed' | 'encouraging' | 'critical';
    commonPhrases: string[];
    strictness: number;
    focusAreas: string[];
  };
  modelVersion: string;
  lastTrainingDate: Date;
}

export interface GradingSuggestion {
  questionId: string;
  suggestedScore: number;
  confidence: number;
  suggestedFeedback: string;
  reasoning: string;
  similarPastGradings: any[];
}

