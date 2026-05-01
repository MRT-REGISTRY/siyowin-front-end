export const buildMarkKey = (subjectId: string, examType: string, examName: string) =>
  `${subjectId}:${examType}:${examName.trim().toLowerCase()}`;

export const normalizeSearchText = (value: string) => value.trim().toLowerCase();

export const filterStudents = <T extends { grade: string; classId: string; name: string; index: string }>(
  students: T[],
  params: { grade: string; classId: string; query: string },
) => {
  const query = normalizeSearchText(params.query);

  return students.filter((student) => {
    const matchesGrade = !params.grade || student.grade === params.grade;
    const matchesClass = !params.classId || student.classId === params.classId;
    const matchesQuery =
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.index.toLowerCase().includes(query);

    return matchesGrade && matchesClass && matchesQuery;
  });
};
