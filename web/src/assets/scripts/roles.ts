import { User } from "@selab-2/groep-1-orm";

export function getRoles(user: User): string[] {
  const roles: string[] = [];
  if (user.student) {
    roles.push("Student");
  }
  if (user.super_student) {
    roles.push("Superstudent");
  }
  // TODO: check syndicus
  roles.push("Syndicus");
  if (user.admin) {
    roles.push("Admin");
  }
  return roles;
}
