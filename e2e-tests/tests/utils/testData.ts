export const testEmployee = {
  firstName: 'Test',
  lastName: 'User',
  email: `testuser_${Date.now()}@skillweaver.test`,
  department: 'Engineering',
  capacityPercentage: 40  // 60% available
};

export const testSkill = {
  name: `TestSkill_${Date.now()}`,
  category: 'Testing'
};

export const testProposal = (skillId: number) => ({
  title: `Test Project ${Date.now()}`,
  description: 'Automated test proposal',
  requiredCommitmentPercentage: 30,
  requiredSkills: [{ skillId, minimumProficiency: 'Beginner' }]
});