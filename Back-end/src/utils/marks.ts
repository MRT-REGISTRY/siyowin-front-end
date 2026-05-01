export const buildMarkKey = (subjectId: string, examType: string, examName: string) =>
  `${subjectId}:${examType}:${examName.trim().toLowerCase()}`;

export const normalizeSearchText = (value: string) => value.trim().toLowerCase();
