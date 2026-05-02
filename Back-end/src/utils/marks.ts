export const buildMarkKey = (subjectId: string, examType: string, examName: string, examDate = '') =>
  `${subjectId}:${examType}:${examName.trim().toLowerCase()}:${examDate.trim()}`;

export const normalizeSearchText = (value: string) => value.trim().toLowerCase();
