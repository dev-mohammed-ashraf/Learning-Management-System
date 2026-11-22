import {
  BarChart3,
  BookOpen,
  Eye,
  GraduationCap,
  PencilLine,
  TrendingUp,
  UserCheck,
  UserCog,
  Users,
} from 'lucide-react';
import type { AdminDataState } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  computeAdminStats,
  formatAdminDate,
  getAdminLevelLabel,
  getCategoryEnrollmentDistribution,
  getCourseEnrollmentCounts,
  getMonthlyEnrollmentActivity,
} from '../../utils/adminData';
import { AdminActivityChart, AdminBarChart, AdminDonut } from './AdminCharts';
import { AdminBadge, AdminCard, AdminTd, AdminTh, AdminTableWrap, adminBtnClass } from './AdminUI';

interface AdminOverviewProps {
  locale: Locale;
  state: AdminDataState;
  onOpenCourses: () => void;
}

export function AdminOverview({ locale, state, onOpenCourses }: AdminOverviewProps) {
  const isAr = locale === 'ar';
  const stats = computeAdminStats(state);
  const popularity = getCourseEnrollmentCounts(state);
  const distribution = getCategoryEnrollmentDistribution(state);
  const activity = getMonthlyEnrollmentActivity(state, 6);
  const recentEnrollments = [...state.enrollments]
    .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
    .slice(0, 5);

  const cards: Array<{
    labelAr: string;
    labelEn: string;
    value: number;
    icon: typeof BookOpen;
    tone: string;
  }> = [
    { labelAr: 'إجمالي الكورسات', labelEn: 'Total Courses', value: stats.totalCourses, icon: BookOpen, tone: 'text-[#176B87] dark:text-[#28B5C5]' },
    { labelAr: 'إجمالي الطلاب', labelEn: 'Total Students', value: stats.totalStudents, icon: Users, tone: 'text-[#1F8A5B] dark:text-[#6EE7B7]' },
    { labelAr: 'إجمالي المدرّبين', labelEn: 'Total Instructors', value: stats.totalInstructors, icon: UserCog, tone: 'text-[#7C5CBF] dark:text-[#C4B5FD]' },
    { labelAr: 'إجمالي الاشتراكات', labelEn: 'Total Enrollments', value: stats.totalEnrollments, icon: UserCheck, tone: 'text-[#28B5C5] dark:text-[#DDF3F5]' },
    { labelAr: 'كورسات منشورة', labelEn: 'Published Courses', value: stats.publishedCourses, icon: Eye, tone: 'text-[#176B87] dark:text-[#28B5C5]' },
    { labelAr: 'مسودات', labelEn: 'Draft Courses', value: stats.draftCourses, icon: PencilLine, tone: 'text-[#A05E03] dark:text-[#FCD34D]' },
  ];


  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.labelEn} className="p-4">
              <div
                className={`mb-2 grid h-9 w-9 place-items-center rounded-[10px] bg-[#EAF3F6] dark:bg-[#102238] ${card.tone}`}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </div>
              <div className="num text-[1.45rem] font-extrabold leading-none text-[#142D4E] dark:text-[#F1F5F9]">
                {card.value}
              </div>
              <div className="mt-1 text-[0.76rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? card.labelAr : card.labelEn}
              </div>
            </AdminCard>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-3">
        <AdminCard className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            <h2 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? 'توزيع الاشتراكات حسب التصنيف' : 'Enrollment Distribution by Category'}
            </h2>
          </div>
          <AdminBarChart
            locale={locale}
            items={distribution.map((entry) => ({
              label: (isAr ? entry.category?.nameAr : entry.category?.nameEn) ?? '—',
              value: entry.count,
            }))}
            emptyLabel={isAr ? 'لا توجد اشتراكات بعد' : 'No enrollments yet'}
          />
        </AdminCard>

        <AdminCard className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            <h2 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? 'نشاط الطلاب (اشتراكات شهرية)' : 'Student Activity (Monthly Enrollments)'}
            </h2>
          </div>
          <AdminActivityChart points={activity} />
        </AdminCard>

        <AdminCard className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            <h2 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? 'حالة الكورسات' : 'Course Status'}
            </h2>
          </div>
          <AdminDonut
            centerValue={String(stats.totalCourses)}
            centerLabel={isAr ? 'كورس' : 'courses'}
            legend={[isAr ? 'منشورة' : 'Published', isAr ? 'مسودة' : 'Draft']}
            segments={[
              { value: stats.publishedCourses, color: '#28B5C5' },
              { value: stats.draftCourses, color: '#FCD34D' },
            ]}
          />
        </AdminCard>
      </div>


      {/* Popularity */}
      <AdminCard className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'أكثر الكورسات شيوعًا' : 'Course Popularity'}
          </h2>
          <button type="button" onClick={onOpenCourses} className={adminBtnClass('subtle')}>
            {isAr ? 'إدارة الكورسات' : 'Manage courses'}
          </button>
        </div>
        <AdminBarChart
          locale={locale}
          items={popularity.map((entry) => ({
            label: isAr ? entry.course.titleAr : entry.course.titleEn,
            value: entry.count,
          }))}
          emptyLabel={isAr ? 'لا توجد اشتراكات بعد' : 'No enrollments yet'}
        />
      </AdminCard>

      {/* Recent enrollments */}
      <AdminCard>
        <div className="border-b border-[#DCE7ED] px-5 py-3.5 dark:border-white/12">
          <h2 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'أحدث الاشتراكات' : 'Recent Enrollments'}
          </h2>
        </div>
        <AdminTableWrap>
          <thead>
            <tr>
              <AdminTh>{isAr ? 'الطالب' : 'Student'}</AdminTh>
              <AdminTh>{isAr ? 'الكورس' : 'Course'}</AdminTh>
              <AdminTh>{isAr ? 'التاريخ' : 'Date'}</AdminTh>
              <AdminTh>{isAr ? 'الحالة' : 'Status'}</AdminTh>
            </tr>
          </thead>
          <tbody>
            {recentEnrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <AdminTd className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                  {state.users.find((user) => user.id === enrollment.studentId)?.name ??
                    enrollment.studentId}
                </AdminTd>
                <AdminTd className="text-[0.84rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                  {(() => {
                    const course = state.courses.find((item) => item.id === enrollment.courseId);
                    return course ? (isAr ? course.titleAr : course.titleEn) : enrollment.courseId;
                  })()}
                </AdminTd>
                <AdminTd className="num text-[0.8rem] text-[#64748B] dark:text-[#B8C7D9]">
                  {formatAdminDate(enrollment.enrolledAt, locale)}
                </AdminTd>
                <AdminTd>
                  <AdminBadge tone={enrollment.status === 'completed' ? 'success' : 'cyan'}>
                    {enrollment.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : isAr ? 'نشط' : 'Active'}
                  </AdminBadge>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTableWrap>
      </AdminCard>
    </div>
  );
}

