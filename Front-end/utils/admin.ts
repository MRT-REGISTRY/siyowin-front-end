export const buildMarkKey = (subjectId: string, examType: string, examName: string, examDate = '') =>
  `${subjectId}:${examType}:${examName.trim().toLowerCase()}:${examDate.trim()}`;

export const normalizeSearchText = (value: string) => value.trim().toLowerCase();

export const filterStudents = <T extends { grade: string; classId: string; name: string; index: string; enrollments?: Array<{ classId: string }> }>(
  students: T[],
  params: { grade: string; classId: string; query: string },
) => {
  const query = normalizeSearchText(params.query);

  return students.filter((student) => {
    const matchesGrade = !params.grade || student.grade === params.grade;
    const matchesClass =
      !params.classId ||
      student.classId === params.classId ||
      student.enrollments?.some((enrollment) => enrollment.classId === params.classId);
    const matchesQuery =
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.index.toLowerCase().includes(query);

    return matchesGrade && matchesClass && matchesQuery;
  });
};
