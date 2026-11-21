import type { Program } from '../types/program';
import type {
  ActivityEntry,
  CourseEnrollmentRecord,
  DashboardMetrics,
  GoalStatus,
  LearningGoal,
  LearningPathDefinition,
  LibraryFilterTab,
  ProjectStatus,
  StudentAccount,
  StudentPlatformState,
  StudentPreferences,
} from '../types/student';

export function createEmptyStudentState(): StudentPlatformState {
  return {
    account: {
      fullName: '',
      email: '',
      phone: '',
      nationalId: '',
      avatarId: 'orbit',
      signedIn: false,
    },
    preferences: {
      reminderCadence: 'weekly',
      preferredStudyTime: 'evening',
    },
    enrollments: {},
    savedCourseIds: [],
    goals: [],
    projectProgress: {},
    joinedGroupIds: [],
    selfCheckDoneIds: [],
    activity: [],
  };
}

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function computeCourseProgressPct(
  program: Program,
  record?: CourseEnrollmentRecord
): number {
  if (!record) return 0;
  if (record.status === 'completed') return 100;
  const totalModules = program.modulesAr.length;
  if (totalModules <= 0) return 0;
  const validDone = record.completedModuleIndices.filter(
    (idx) => idx >= 0 && idx < totalModules
  ).length;
  return Math.round((validDone / totalModules) * 100);
}

export function computeDashboardMetrics(
  state: StudentPlatformState,
  programs: Program[]
): DashboardMetrics {
  const enrollmentList = Object.values(state.enrollments);
  const enrolledCount = enrollmentList.length;
  const completedCount = enrollmentList.filter((item) => item.status === 'completed').length;

  let totalPctSum = 0;
  let completedCreditHours = 0;

  for (const record of enrollmentList) {
    const program = programs.find((p) => p.id === record.programId);
    if (!program) continue;
    const pct = computeCourseProgressPct(program, record);
    totalPctSum += pct;
    // Standard 30-credit-hour diplomas in the catalog; compute proportional study progress honestly
    completedCreditHours += Math.round((pct / 100) * 30);
  }

  const overallProgressPct =
    enrolledCount > 0 ? Math.round(totalPctSum / enrolledCount) : 0;

  const activeGoalsCount = state.goals.filter((g) => g.status === 'active').length;
  const completedGoalsCount = state.goals.filter((g) => g.status === 'completed').length;

  return {
    enrolledCount,
    completedCount,
    creditHoursEnrolled: completedCreditHours,
    overallProgressPct,
    activeGoalsCount,
    completedGoalsCount,
  };
}

export function filterLibraryCourses(
  state: StudentPlatformState,
  programs: Program[],
  tab: LibraryFilterTab
): Program[] {
  const enrolledIds = new Set(Object.keys(state.enrollments));
  const savedIds = new Set(state.savedCourseIds);

  return programs.filter((program) => {
    const enrollment = state.enrollments[program.id];
    const isSaved = savedIds.has(program.id);

    switch (tab) {
      case 'in_progress':
        return enrollment?.status === 'in_progress';
      case 'completed':
        return enrollment?.status === 'completed';
      case 'saved':
        return isSaved;
      case 'all':
      default:
        return enrolledIds.has(program.id) || isSaved;
    }
  });
}

export function computeLearningPathProgress(
  path: LearningPathDefinition,
  state: StudentPlatformState,
  programs: Program[]
): {
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  progressPct: number;
  nextRecommendedProgramId: string | null;
} {
  const totalCourses = path.programIds.length;
  if (totalCourses === 0) {
    return {
      totalCourses: 0,
      enrolledCourses: 0,
      completedCourses: 0,
      progressPct: 0,
      nextRecommendedProgramId: null,
    };
  }

  let enrolledCourses = 0;
  let completedCourses = 0;
  let totalPctSum = 0;
  let nextRecommendedProgramId: string | null = null;

  for (const programId of path.programIds) {
    const program = programs.find((p) => p.id === programId);
    const record = state.enrollments[programId];
    if (record) {
      enrolledCourses += 1;
      if (record.status === 'completed') {
        completedCourses += 1;
      } else if (!nextRecommendedProgramId) {
        nextRecommendedProgramId = programId;
      }
      if (program) {
        totalPctSum += computeCourseProgressPct(program, record);
      }
    } else if (!nextRecommendedProgramId) {
      nextRecommendedProgramId = programId;
    }
  }

  return {
    totalCourses,
    enrolledCourses,
    completedCourses,
    progressPct: Math.round(totalPctSum / totalCourses),
    nextRecommendedProgramId,
  };
}

function prependActivity(
  existing: ActivityEntry[],
  entry: Omit<ActivityEntry, 'id' | 'timestamp'>,
  nowIso: string
): ActivityEntry[] {
  const next: ActivityEntry = {
    ...entry,
    id: `${entry.type}-${nowIso}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: nowIso,
  };
  return [next, ...existing].slice(0, 20);
}

export function enrollInProgramState(
  state: StudentPlatformState,
  program: Program,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  if (state.enrollments[program.id]) {
    return state;
  }
  const record: CourseEnrollmentRecord = {
    programId: program.id,
    status: 'in_progress',
    completedModuleIndices: [],
    lastModuleIndex: 0,
    enrolledAt: nowIso,
    updatedAt: nowIso,
  };
  return {
    ...state,
    enrollments: {
      ...state.enrollments,
      [program.id]: record,
    },
    activity: prependActivity(
      state.activity,
      {
        type: 'enroll',
        titleAr: `التسجيل في دورة: ${program.titleAr}`,
        titleEn: `Enrolled in: ${program.titleEn}`,
      },
      nowIso
    ),
  };
}

export function toggleSavedProgramState(
  state: StudentPlatformState,
  program: Program,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  const exists = state.savedCourseIds.includes(program.id);
  const nextSaved = exists
    ? state.savedCourseIds.filter((id) => id !== program.id)
    : [program.id, ...state.savedCourseIds];

  return {
    ...state,
    savedCourseIds: nextSaved,
    activity: prependActivity(
      state.activity,
      {
        type: 'save',
        titleAr: exists
          ? `إزالة من المحفوظات: ${program.titleAr}`
          : `حفظ في المكتبة: ${program.titleAr}`,
        titleEn: exists
          ? `Removed from saved: ${program.titleEn}`
          : `Saved to library: ${program.titleEn}`,
      },
      nowIso
    ),
  };
}

export function toggleCourseModuleState(
  state: StudentPlatformState,
  program: Program,
  moduleIndex: number,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  const totalModules = program.modulesAr.length;
  if (moduleIndex < 0 || moduleIndex >= totalModules) {
    return state;
  }

  const baseRecord: CourseEnrollmentRecord = state.enrollments[program.id] ?? {
    programId: program.id,
    status: 'in_progress',
    completedModuleIndices: [],
    lastModuleIndex: moduleIndex,
    enrolledAt: nowIso,
    updatedAt: nowIso,
  };

  const hasIndex = baseRecord.completedModuleIndices.includes(moduleIndex);
  const nextCompleted = hasIndex
    ? baseRecord.completedModuleIndices.filter((i) => i !== moduleIndex)
    : [...baseRecord.completedModuleIndices, moduleIndex].sort((a, b) => a - b);

  const isCompleted = nextCompleted.length >= totalModules && totalModules > 0;

  return {
    ...state,
    enrollments: {
      ...state.enrollments,
      [program.id]: {
        ...baseRecord,
        completedModuleIndices: nextCompleted,
        lastModuleIndex: moduleIndex,
        status: isCompleted ? 'completed' : 'in_progress',
        updatedAt: nowIso,
      },
    },
    activity: prependActivity(
      state.activity,
      {
        type: 'module',
        titleAr: hasIndex
          ? `تراجع عن إتمام محور في ${program.titleAr}`
          : `إتمام محور "${program.modulesAr[moduleIndex]}"`,
        titleEn: hasIndex
          ? `Unmarked module in ${program.titleEn}`
          : `Completed module "${program.modulesEn[moduleIndex]}"`,
      },
      nowIso
    ),
  };
}

export function createGoalState(
  state: StudentPlatformState,
  input: { title: string; targetDate: string; progress?: number; relatedProgramId?: string },
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  const cleanTitle = input.title.trim();
  if (!cleanTitle) return state;

  const progress = clampProgress(input.progress ?? 0);
  const status: GoalStatus = progress >= 100 ? 'completed' : 'active';
  const goal: LearningGoal = {
    id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: cleanTitle,
    targetDate: input.targetDate,
    progress,
    status,
    relatedProgramId: input.relatedProgramId || undefined,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  return {
    ...state,
    goals: [goal, ...state.goals],
    activity: prependActivity(
      state.activity,
      {
        type: 'goal',
        titleAr: `إضافة هدف تعليمي: ${cleanTitle}`,
        titleEn: `Added learning goal: ${cleanTitle}`,
      },
      nowIso
    ),
  };
}

export function updateGoalState(
  state: StudentPlatformState,
  goalId: string,
  patch: Partial<Pick<LearningGoal, 'title' | 'targetDate' | 'progress' | 'status' | 'relatedProgramId'>>,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  let updatedTitle = '';
  const nextGoals = state.goals.map((goal) => {
    if (goal.id !== goalId) return goal;
    const nextProgress =
      patch.status === 'completed'
        ? 100
        : patch.progress !== undefined
          ? clampProgress(patch.progress)
          : goal.progress;
    const nextStatus: GoalStatus =
      patch.status ?? (nextProgress >= 100 ? 'completed' : 'active');
    const nextTitle = patch.title !== undefined ? patch.title.trim() || goal.title : goal.title;
    updatedTitle = nextTitle;
    return {
      ...goal,
      ...patch,
      title: nextTitle,
      progress: nextProgress,
      status: nextStatus,
      updatedAt: nowIso,
    };
  });

  if (!updatedTitle) return state;

  return {
    ...state,
    goals: nextGoals,
    activity: prependActivity(
      state.activity,
      {
        type: 'goal',
        titleAr: `تحديث الهدف التعليمي: ${updatedTitle}`,
        titleEn: `Updated learning goal: ${updatedTitle}`,
      },
      nowIso
    ),
  };
}

export function deleteGoalState(
  state: StudentPlatformState,
  goalId: string,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  const target = state.goals.find((g) => g.id === goalId);
  if (!target) return state;
  return {
    ...state,
    goals: state.goals.filter((g) => g.id !== goalId),
    activity: prependActivity(
      state.activity,
      {
        type: 'goal',
        titleAr: `حذف الهدف التعليمي: ${target.title}`,
        titleEn: `Deleted learning goal: ${target.title}`,
      },
      nowIso
    ),
  };
}

export function updateProjectStatusState(
  state: StudentPlatformState,
  projectId: string,
  projectTitleAr: string,
  projectTitleEn: string,
  status: ProjectStatus,
  submissionNote: string = '',
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  const prev = state.projectProgress[projectId];
  return {
    ...state,
    projectProgress: {
      ...state.projectProgress,
      [projectId]: {
        projectId,
        status,
        submissionNote: submissionNote || prev?.submissionNote || '',
        updatedAt: nowIso,
      },
    },
    activity: prependActivity(
      state.activity,
      {
        type: 'project',
        titleAr: `تحديث حالة المشروع (${projectTitleAr})`,
        titleEn: `Updated project status (${projectTitleEn})`,
      },
      nowIso
    ),
  };
}

export function toggleGroupMembershipState(
  state: StudentPlatformState,
  groupId: string,
  groupTitleAr: string,
  groupTitleEn: string,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  const isMember = state.joinedGroupIds.includes(groupId);
  const nextGroupIds = isMember
    ? state.joinedGroupIds.filter((id) => id !== groupId)
    : [groupId, ...state.joinedGroupIds];

  return {
    ...state,
    joinedGroupIds: nextGroupIds,
    activity: prependActivity(
      state.activity,
      {
        type: 'group',
        titleAr: isMember
          ? `مغادرة مجموعة: ${groupTitleAr}`
          : `الانضمام إلى مجموعة: ${groupTitleAr}`,
        titleEn: isMember
          ? `Left study group: ${groupTitleEn}`
          : `Joined study group: ${groupTitleEn}`,
      },
      nowIso
    ),
  };
}

export function toggleAssessmentSelfCheckState(
  state: StudentPlatformState,
  assessmentId: string,
  titleAr: string,
  titleEn: string,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  const exists = state.selfCheckDoneIds.includes(assessmentId);
  const nextIds = exists
    ? state.selfCheckDoneIds.filter((id) => id !== assessmentId)
    : [assessmentId, ...state.selfCheckDoneIds];

  return {
    ...state,
    selfCheckDoneIds: nextIds,
    activity: prependActivity(
      state.activity,
      {
        type: 'assessment',
        titleAr: exists
          ? `إلغاء تحديد الجاهزية: ${titleAr}`
          : `إتمام المراجعة الذاتية: ${titleAr}`,
        titleEn: exists
          ? `Unmarked readiness check: ${titleEn}`
          : `Completed self-readiness check: ${titleEn}`,
      },
      nowIso
    ),
  };
}

export function signInStudentState(
  state: StudentPlatformState,
  payload: Partial<Omit<StudentAccount, 'signedIn' | 'avatarId'>>,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  const fullName = (payload.fullName ?? state.account.fullName).trim();
  const email = (payload.email ?? state.account.email).trim();
  return {
    ...state,
    account: {
      ...state.account,
      fullName: fullName || (email ? email.split('@')[0] : ''),
      email,
      phone: (payload.phone ?? state.account.phone).trim(),
      nationalId: (payload.nationalId ?? state.account.nationalId).trim(),
      signedIn: true,
    },
    activity: prependActivity(
      state.activity,
      {
        type: 'account',
        titleAr: `تسجيل دخول حساب الطالب${fullName ? `: ${fullName}` : ''}`,
        titleEn: `Signed in to student account${fullName ? `: ${fullName}` : ''}`,
      },
      nowIso
    ),
  };
}

export function signOutStudentState(
  state: StudentPlatformState,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  return {
    ...state,
    account: {
      ...state.account,
      signedIn: false,
    },
    activity: prependActivity(
      state.activity,
      {
        type: 'account',
        titleAr: 'تسجيل الخروج من جلسة الطالب',
        titleEn: 'Signed out of student session',
      },
      nowIso
    ),
  };
}

export function updateStudentProfileState(
  state: StudentPlatformState,
  accountPatch: Partial<Pick<StudentAccount, 'fullName' | 'email' | 'phone' | 'avatarId'>>,
  preferencesPatch?: Partial<StudentPreferences>,
  nowIso: string = new Date().toISOString()
): StudentPlatformState {
  return {
    ...state,
    account: {
      ...state.account,
      ...accountPatch,
      fullName:
        accountPatch.fullName !== undefined
          ? accountPatch.fullName.trim()
          : state.account.fullName,
      email:
        accountPatch.email !== undefined ? accountPatch.email.trim() : state.account.email,
      phone:
        accountPatch.phone !== undefined ? accountPatch.phone.trim() : state.account.phone,
    },
    preferences: {
      ...state.preferences,
      ...preferencesPatch,
    },
    activity: prependActivity(
      state.activity,
      {
        type: 'account',
        titleAr: 'تحديث إعدادات الملف الشخصي',
        titleEn: 'Updated student profile settings',
      },
      nowIso
    ),
  };
}
