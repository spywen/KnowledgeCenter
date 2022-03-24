import { element, by } from 'protractor';

/**
 * Tab helper
 */
export class TabHelper {

  /**
   * Open specific tab by index (0 to x)
   */
  openTab = async (index: number) => {
    await element.all(by.css('.mat-tab-label')).get(index).click();
  }
}
