import { Page, Locator } from '@playwright/test';
import { Navbar } from '../components/Navbar';

export class ProposalFormPage {
  readonly navbar: Navbar;
  readonly heading: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly commitmentInput: Locator;
  readonly skillSelect: Locator;
  readonly proficiencySelect: Locator;
  readonly addSkillButton: Locator;
  readonly submitButton: Locator;
  readonly requiredSkillsList: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.navbar = new Navbar(page);
    this.heading = page.getByRole('heading', { name: 'New Project Proposal', level: 2 });
    // Locators derived from snapshot: labeled textbox and spinbutton, plus data-testid
    this.titleInput = page.getByTestId('proposal-title');
    this.descriptionInput = page.getByLabel('Description (optional)');
    this.commitmentInput = page.getByTestId('commitment-percentage');
    // Snapshot shows two comboboxes — first is skill selector, second is proficiency
    this.skillSelect = page.getByRole('combobox').nth(0);
    this.proficiencySelect = page.getByRole('combobox').nth(1);
    this.addSkillButton = page.getByRole('button', { name: 'Add Skill' });
    this.submitButton = page.getByTestId('submit-proposal');
    this.requiredSkillsList = page.locator('ul li');
    this.errorMessage = page.locator('.error');
  }

  async goto() {
    await this.page.goto('/proposals');
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async fillCommitment(percentage: number) {
    await this.commitmentInput.fill(String(percentage));
  }

  async addRequiredSkill(skillName: string, proficiency: string) {
    await this.skillSelect.selectOption({ label: skillName });
    await this.proficiencySelect.selectOption({ label: proficiency });
    await this.addSkillButton.click();
  }

  async getRequiredSkillCount(): Promise<number> {
    return this.requiredSkillsList.count();
  }

  async submit() {
    await this.submitButton.click();
  }

  async isSubmitDisabled(): Promise<boolean> {
    return this.submitButton.isDisabled();
  }
}
