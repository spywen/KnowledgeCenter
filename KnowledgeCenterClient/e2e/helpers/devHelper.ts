import { element, by } from 'protractor';
import { TabHelper } from './tabHelper';

/**
 * Developer helper
 */
export class DevHelper {

  private tab = new TabHelper();

  /**
   * Reset data for E2E testing in BE
   */
  resetData = async () => {
    await element(by.css('button.dev-config')).click();
    await expect(element(by.css('button.reset-data')).isPresent())
      .toBe(true, 'BE E2E environment issue. Please check if environment is running and correctly configured as E2E environment');
    await element(by.css('button.reset-data')).click();
    await this.closeDevPopup();
  }

  /**
   * Get last activation token for E2E testing in BE
   */
  async getLastActivationToken(): Promise<string> {
    await element(by.css('button.dev-config')).click();
    await this.tab.openTab(2);
    await element(by.css('button.get-last-tokens')).click();
    const token = await element(by.css('.activation-token')).getText();
    await this.closeDevPopup();
    return token;
  }

  /**
   * Get last recovery password token for E2E testing in BE
   */
  async getLastRecoveryPasswordToken(): Promise<string> {
    await element(by.css('button.dev-config')).click();
    await this.tab.openTab(2);
    await element(by.css('button.get-last-tokens')).click();
    const token = await element(by.css('.recover-password-token')).getText();
    await this.closeDevPopup();
    return token;
  }

  /**
   * Check if current user has expected role
   * @param role expected role
   */
  hasUserRole = async (role: string) => {
    await element(by.css('button.dev-config')).click();
    await expect(element(by.css('.user-roles')).getText()).toContain(role);
    await this.closeDevPopup();
  }

  /**
   * Close dev popup
   */
  closeDevPopup = async () => {
    await element(by.css('button.close')).click();
  }
}
