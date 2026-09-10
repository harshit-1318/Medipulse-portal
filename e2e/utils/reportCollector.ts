import fs from 'fs';
import path from 'path';

export interface TestCaseResult {
  id: string;
  combination: string;
  input: string;
  expected: string;
  actual: string;
  status: 'PASS' | 'FAIL' | 'BLOCKED';
  failureReason?: string;
  apiVerified?: boolean;
}

class ReportCollector {
  private results: TestCaseResult[] = [];
  private reportFilePath = path.resolve(process.cwd(), 'test-results/qa-test-report.json');

  constructor() {
    // Load existing results if file exists
    try {
      if (fs.existsSync(this.reportFilePath)) {
        this.results = JSON.parse(fs.readFileSync(this.reportFilePath, 'utf-8'));
      }
    } catch {
      this.results = [];
    }
  }

  addResult(result: TestCaseResult) {
    const existingIdx = this.results.findIndex(r => r.id === result.id);
    if (existingIdx !== -1) {
      this.results[existingIdx] = result;
    } else {
      this.results.push(result);
    }
    this.save();
  }

  private save() {
    try {
      const dir = path.dirname(this.reportFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.reportFilePath, JSON.stringify(this.results, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save test report:', e);
    }
  }

  getResults(): TestCaseResult[] {
    return this.results;
  }
}

export const reportCollector = new ReportCollector();
