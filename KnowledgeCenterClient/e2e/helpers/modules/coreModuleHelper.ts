import { BaseHelpers } from '../_baseHelpers';
import { browser } from 'protractor';

/**
 * Core module helper
 */
export class CoreModuleHelper {

  public readonly password = 'Test123!';

  public readonly loginSelector = '.log-in';
  public readonly logoutSelector = '.logout';
  public readonly menuSelector = '.user-menu';
  public readonly signInSelector = '.sign-in';
  public readonly forgotSelector = '.forgot';
  public readonly serviceLineSelectSelector = '.service-line';
  public readonly agencyAutocompleteInputSelector = '.agency';
  public readonly sideMenuSelector = '.open-side-menu';

  constructor(private _: BaseHelpers) { }

  /**
   * Login with common password
   * @param login user login
   */
  login = async (login: string) => {
    await this.loginWithPassword(login, this.password);
  }

  /**
   * Login with specific password
   * @param login user login
   * @param password user password
   */
  loginWithPassword = async (login: string, password: string) => {
    await this._.button.click(this.loginSelector);
    const loginForm = this._.form('.login');
    await loginForm.writeInsideTextInput(0, login);
    await loginForm.writeInsideTextInput(1, password);
    await loginForm.submit();
    await expect(await this._.button.isExist(this.loginSelector)).toBeFalsy();
    await expect(await this._.button.isExist(this.menuSelector)).toBeTruthy();
  }

  /**
   * Logout
   */
  logout = async () => {
    await this._.button.click(this.menuSelector);
    await expect(await this._.button.isExist(this.logoutSelector)).toBeTruthy();
    await browser.sleep(200); // wait logout visible after right menu animation
    await this._.button.click(this.logoutSelector);
    await expect(await this._.button.isExist(this.loginSelector)).toBeTruthy();
  }

  /**
   * Open side menu
   */
  openSideMenu = async () => {
    await this._.button.click(this.sideMenuSelector);
    await browser.sleep(200); // wait end of menu animation
  }
}
