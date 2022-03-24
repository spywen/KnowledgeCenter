import { element, by } from 'protractor';

/**
 * Button helper
 */
export class ButtonHelper {

  /**
   * Check if button exists
   * @param selector selector for button
   */
  isExist = async (selector: string): Promise<boolean> => {
    return await element(by.css(selector)).isPresent();
  }

  /**
   * Click on button
   * @param selector selector for button
   */
  click = async (selector: string) => {
    await element(by.css(selector)).click();
  }

  /**
   * Click on bottom right fixed button to add new entity
   */
  clickOnAdd = async () => {
    await element(by.css('.bottom-right-fixed-button')).click();
  }

  /**
   * Click on bottom right fixed "+" button
   */
  new = async () => {
    await element(by.css('.bottom-right-fixed-button')).click();
  }
}
