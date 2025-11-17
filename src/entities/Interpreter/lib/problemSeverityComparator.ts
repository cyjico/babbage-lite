import { Problem } from "@/shared/model/types";

const problemSeverityComparator = (a: Problem, b: Problem) =>
  a.severity - b.severity;

export default problemSeverityComparator;
