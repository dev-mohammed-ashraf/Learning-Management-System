export type NavSection =
  | 'home'
  | 'library'
  | 'diplomas'
  | 'paths'
  | 'goals'
  | 'assessments'
  | 'projects'
  | 'groups'
  | 'ai-tools'
  | 'dashboard'
  | 'profile'
  | 'fellowships'
  | 'about'
  | 'letters'
  | 'contact';

export type PageRoute =
  | 'home'
  | 'library'
  | 'programs'
  | 'paths'
  | 'goals'
  | 'assessments'
  | 'projects'
  | 'groups'
  | 'ai-tools'
  | 'dashboard'
  | 'profile';

export type CourseProgressStatus = 'in_progress' | 'completed';

export type LibraryFilterTab = 'all' | 'in_progress' | 'completed' | 'saved';

export interface CourseEnrollmentRecord {
  programId: string;
  status: CourseProgressStatus;
  completedModuleIndices: number[];
  lastModuleIndex: number;
  enrolledAt: string;
  updatedAt: string;
}

export type GoalStatus = 'active' | 'completed';

export interface LearningGoal {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
  status: GoalStatus;
  relatedProgramId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentDefinition {
  id: string;
  programId: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  questionCount: number;
  durationMinutes: number;
  sampleTopicsAr: string[];
  sampleTopicsEn: string[];
}

export type ProjectStatus = 'not_started' | 'in_progress' | 'submitted' | 'reviewed';

export interface ProjectDefinition {
  id: string;
  programId: string;
  pathId?: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  deliverablesAr: string[];
  deliverablesEn: string[];
}

export interface ProjectProgressRecord {
  projectId: string;
  status: ProjectStatus;
  submissionNote: string;
  updatedAt: string;
}

export interface StudyGroupDefinition {
  id: string;
  programId?: string;
  pathId?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  focusAr: string;
  focusEn: string;
}

export interface LearningPathDefinition {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  programIds: string[];
  status: 'active' | 'upcoming';
  durationAr: string;
  durationEn: string;
}

export type AiToolId =
  | 'concept-explainer'
  | 'content-summarizer'
  | 'review-questions'
  | 'study-planner'
  | 'idea-organizer';

export interface AiToolDefinition {
  id: AiToolId;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  promptPlaceholderAr: string;
  promptPlaceholderEn: string;
  exampleTopicAr: string;
  exampleTopicEn: string;
}

export type ActivityType =
  | 'enroll'
  | 'save'
  | 'module'
  | 'goal'
  | 'project'
  | 'group'
  | 'assessment'
  | 'account';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  titleAr: string;
  titleEn: string;
  timestamp: string;
}

export interface StudentAccount {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  avatarId: 'orbit' | 'compass' | 'book' | 'award';
  signedIn: boolean;
}

export interface StudentPreferences {
  reminderCadence: 'daily' | 'weekly' | 'off';
  preferredStudyTime: 'evening' | 'morning' | 'flexible';
}

export interface StudentPlatformState {
  account: StudentAccount;
  preferences: StudentPreferences;
  enrollments: Record<string, CourseEnrollmentRecord>;
  savedCourseIds: string[];
  goals: LearningGoal[];
  projectProgress: Record<string, ProjectProgressRecord>;
  joinedGroupIds: string[];
  selfCheckDoneIds: string[];
  activity: ActivityEntry[];
}

export interface DashboardMetrics {
  enrolledCount: number;
  completedCount: number;
  creditHoursEnrolled: number;
  overallProgressPct: number;
  activeGoalsCount: number;
  completedGoalsCount: number;
}
