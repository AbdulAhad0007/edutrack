export const students = {};

export function getStudentById(id) {
  return students[id] || null;
}


