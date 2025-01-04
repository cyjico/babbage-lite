import { Problem, ProblemSeverity } from "../model/types";

export default function createProblemOutput(lines: string[], problem: Problem) {
  const location = `line ${problem.ln}, column ${problem.col}`;
  const annoGutter = `${problem.ln} | `;
  const annoLine = lines[problem.ln];
  const anno = `${annoGutter}${annoLine}\n${" ".repeat(
    annoGutter.length + annoLine.slice(0, problem.col).length,
  )}${"~".repeat(annoLine.slice(problem.col, problem.colend).length)}`;

  switch (problem.severity) {
    case ProblemSeverity.Information:
      return `${location} - information ${
        problem.code
      }: ${problem.message}\n\n${anno}`;
    case ProblemSeverity.Warning:
      return `${location} - warning ${
        problem.code
      }: ${problem.message}\n\n${anno}`;
    case ProblemSeverity.Error:
      return `${location} - error ${
        problem.code
      }: ${problem.message}\n\n${anno}`;
  }
}
