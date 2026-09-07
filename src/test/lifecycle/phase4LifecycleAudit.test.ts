import { describe, it, expect } from 'vitest';
import { runComprehensiveAudit } from '../runners/comprehensiveRoleAudit';

describe('Phase 4: Comprehensive 5-Step Lifecycle Audit Runner', () => {
  it('executes full login -> dashboard -> permissions -> logout -> relogin audit for all 8 roles', async () => {
    const report = await runComprehensiveAudit();
    expect(report.length).toBe(8);
    for (const r of report) {
      expect(r.loginStep1).toBe(true);
      expect(r.dashboardStep2).toBe(true);
      expect(r.permissionsStep3.authorizedRoutesPassed).toBeGreaterThan(0);
      expect(r.permissionsStep3.backendApiGuardPassed).toBe(true);
      expect(r.logoutStep4).toBe(true);
      expect(r.reloginStep5).toBe(true);
    }
  }, 45000);
});
