export const qk = {
  me: ["me"],
  courses: (filters) => ["courses", filters],
  course: (slug) => ["course", slug],
  myEnrollments: ["enrollments", "me"],
  enrollment: (courseId) => ["enrollment", courseId],
  reviews: (courseId) => ["reviews", courseId],
  myCourses: (filters) => ["myCourses", filters],
};