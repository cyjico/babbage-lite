import { Problem, ProblemSeverity } from "../model/types";

export default function createProblemOutput(lines: string[], problem: Problem) {
  const location = `line ${problem.ln + 1}, column ${problem.col + 1}`;
  const annoGutter = `${problem.ln + 1} | `;
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
