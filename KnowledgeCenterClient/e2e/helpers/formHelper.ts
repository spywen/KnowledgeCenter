import { $$, element, by, protractor, ElementFinder, browser } from 'protractor';

/**
 * Form helper
 */
export class FormHelper {

  private formElement: ElementFinder;

  public constructor(formSelector: string) {
    this.formElement = element(by.css(formSelector));
  }

  /**
   * Write inside text input
   * @param inputIndex index of the input field
   * @param text text to insert
   */
  writeInsideTextInput = async (inputIndex: number, text: string) => {
    const input = this.formElement.all(by.tagName('input')).get(inputIndex);
    if (input.getText()) {
      await input.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
      await input.sendKeys(protractor.Key.DELETE);
    }
    await input.sendKeys(text);
  }

  /**
   * Write inside textarea
   * @param text text to insert
   */
  writeInsideTextarea = async (text: string) => {
    const input = this.formElement.all(by.tagName('textarea')).get(0);
    if (input.getText()) {
      await input.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
      await input.sendKeys(protractor.Key.DELETE);
    }
    await input.sendKeys(text);
  }

  /**
   * Write inside kc wysiwyg
   * @param text text to insert
   */
  writeInsideKcWysiwyg = async (text: string) => {
    const input = this.formElement.all(by.tagName('div[role="textarea"]')).get(0);
    await input.sendKeys(text);
  }

  /**
   * Select option of select
   * @param selector select selector
   * @param optionValue option value
   */
  selectOptionOfSelect = async (selector: string, optionValue: string) => {
    await this.formElement.all(by.css(selector)).click();
    await element(by.cssContainingText('mat-option .mat-option-text', optionValue)).click();
  }

  /**
   * Select option of multi select
   * @param selector select selector
   * @param optionValue option value
   */
  selectOptionOfMultiSelect = async (selector: string, optionValue: string) => {
    const select = this.formElement.all(by.css(selector));
    await select.click();
    await element(by.cssContainingText('mat-option .mat-option-text', optionValue)).click();
    await select.sendKeys(protractor.Key.ESCAPE);
  }

  /**
   * Select option of autocomplete input
   * @param selector autocomplete input selector
   * @param text text to enter inside automplete input before selecting option
   * @param optionIndex option index to select
   */
  selectOptionOfAutocompleteInput = async (selector: string, text: string, optionIndex: number) => {
    const select = this.formElement.all(by.css(selector));
    if (select.getText()) {
      await select.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
      await select.sendKeys(protractor.Key.DELETE);
    }
    await select.sendKeys(text);
    await $$('mat-option').get(optionIndex).click();
  }

  /**
   * Toggle slide toggle
   * @param index index of toggle to click
   */
  toggleSlide = async (index: number = 0) => {
    await this.formElement.all(by.css('.mat-slide-toggle')).get(index).click();
  }

  /**
   * Submit form <=> click on button to submit form
   */
  submit = async () => {
    await this.formElement.element(by.css('button[type=submit]')).click();
  }
}
