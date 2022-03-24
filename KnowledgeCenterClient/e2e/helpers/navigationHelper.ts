import { browser } from 'protractor';

/**
 * Navigation helper
 */
export class NavigationHelper {

  /**
   * Navigate to base path of the website
   * !!!NO SLASH REQUIRED AT THE BEGINNING!!!
   * Ex:
   * - path = 'login' -> will redirect to localhost:4200/login
   * - path = 'administration/agencies' -> -> will redirect to localhost:4200/administration/agencies
   * @param path relative path
   */
  to = async (path?: string) => {
    if (path) {
      await browser.get(`${browser.baseUrl}/${path}`);
    } else {
      await browser.get(browser.baseUrl);
    }
  }

}
