import { browser } from 'protractor';

/**
 * Visual comparison helper
 */
export class VisualComparisonHelper {

  /**
   * % mismatch accepted
   */
  private readonly MisMatchPourcentageAccepted = 1;

  /**
   * Compare screen shots
   * @param login user login
   */
  compareScreens = async (screenName: string) => {
    await browser.sleep(500); // wait to ensure stable screen
    await expect(browser.imageComparison.checkScreen(screenName, { }))
      .toBeLessThan(this.MisMatchPourcentageAccepted);
  }
}
