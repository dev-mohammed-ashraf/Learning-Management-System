import type { AdminCourse, AdminDataState, AdminUser } from '../types/admin';
import type { DemoCourse, DemoLearningState } from '../types/coursePlayer';
import { getAdminLevelLabel } from './adminData';

/**
 * Bridge between the admin/company course world (`AdminDataState`) and the
 * demo course player. Courses purchased or assigned through the company
 * dashboard are admin-managed courses; this adapter lets students open them
 * with the existing demo learning experience (same player, same localStorage
 * progress system) without duplicating any course content.
 */

/** Map an admin-managed course into the demo course-player model. */
export function adminCourseToDemoCourse(
  course: AdminCourse,
  instructor: AdminUser | undefined
): DemoCourse {
  return {
    id: course.id,
    titleAr: course.titleAr,
    titleEn: course.titleEn,
    descriptionAr: course.descriptionAr,
    descriptionEn: course.descriptionEn,
    instructor: {
      nameAr: instructor?.name ?? '—',
      nameEn: instructor?.name ?? '—',
      roleAr: 'مدرّب الكورس',
      roleEn: 'Course Instructor',
    },
    image: course.image,
    levelAr: getAdminLevelLabel(course.level, 'ar'),
    levelEn: getAdminLevelLabel(course.level, 'en'),
    sections: course.sections,
  };
}

/**
 * Courses the signed-in portal student can access through company purchases
 * (admin-data enrollments attributed to them), mapped into the demo player
 * model. Only company purchases bridge into the student library so the
 * existing library behaviour stays untouched for seeded data.
 */
export function getStudentCompanyPurchasedCourses(
  state: AdminDataState,
  studentId: string | null
): DemoCourse[] {
  if (!studentId) return [];
  const purchasedCourseIds = new Set(
    state.enrollments
      .filter(
        (enrollment) =>
          enrollment.studentId === studentId && enrollment.source === 'company-purchase'
      )
      .map((enrollment) => enrollment.courseId)
  );
  return state.courses
    .filter((course) => purchasedCourseIds.has(course.id))
    .map((course) =>
      adminCourseToDemoCourse(
        course,
        state.users.find((user) => user.id === course.instructorId)
      )
    );
}

/**
 * Effective demo learning view for the signed-in portal student: their own
 * demo enrollments plus every company-purchased course, so purchased courses
 * show up as enrolled without duplicating state.
 */
export function mergeDemoLearningWithPurchases(
  learning: DemoLearningState,
  purchasedCourseIds: string[]
): DemoLearningState {
  if (purchasedCourseIds.length === 0) return learning;
  const merged = new Set(learning.enrolledDemoCourseIds);
  for (const courseId of purchasedCourseIds) merged.add(courseId);
  return { ...learning, enrolledDemoCourseIds: [...merged] };
}