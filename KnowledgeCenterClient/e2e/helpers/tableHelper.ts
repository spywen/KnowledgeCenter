import { element, by, browser } from 'protractor';

/**
 * Table helper
 */
export class TableHelper {

  /**
   * Get text of specific table cell
   * (without considering header)
   * @param rowIndex row index (start at 0)
   * @param cellIndex cell index (start at 0)
   */
  getCellText = async (rowIndex: number, cellIndex: number): Promise<string> => {
    return await element.all(by.tagName('table'))
      .all(by.tagName('tr')).get(rowIndex + 1)
      .all(by.tagName('td')).get(cellIndex)
      .getText();
  }

  /**
   * Return number of row of the table
   * (Without considering header)
   */
  rowCount = async (): Promise<number> => {
    return await element.all(by.tagName('table')).all(by.tagName('tr')).count() - 1;
  }

  /**
   * Edit row
   * (without considering header)
   * @param rowIndex row index (start at 0)
   */
  editRow = async (rowIndex: number) => {
    await element.all(by.tagName('table'))
      .all(by.tagName('tr')).get(rowIndex + 1)
      .all(by.tagName('td')).last()
      .element(by.css('button'))
      .click();
    await browser.sleep(200); // wait animation
    await element(by.cssContainingText('button', 'Edit')).click();
  }

  /**
   * Delete row
   * (without considering header)
   * @param rowIndex row index (start at 0)
   */
  deleteRow = async (rowIndex: number) => {
    await element.all(by.tagName('table'))
      .all(by.tagName('tr')).get(rowIndex + 1)
      .all(by.tagName('td')).last()
      .element(by.css('button'))
      .click();
    await browser.sleep(200); // wait animation
    await element(by.cssContainingText('button', 'Delete')).click();
  }
}
