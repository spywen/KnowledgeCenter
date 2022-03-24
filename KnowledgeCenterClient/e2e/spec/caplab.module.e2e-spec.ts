import { browser, logging, element, by } from 'protractor';
import { BaseHelpers } from '../helpers/_baseHelpers';

describe('[SPEC] Caplab', () => {
  let _: BaseHelpers;

  beforeEach(async () => {
    _ = new BaseHelpers();
    await _.navigation.to();
    await _.dev.resetData();
    await _.coreModuleHelper.login('admin');
    await _.navigation.to('caplab/projects/proposals');
  });

  it('create new project', async () => {
    await _.button.new();

    const projectForm = _.form('.create-project');
    await projectForm.writeInsideTextInput(0, 'My title');
    await projectForm.selectOptionOfMultiSelect('.tags-select', '#Fun');
    await projectForm.writeInsideTextarea('My short description');
    await projectForm.submit();

    await _.navigation.to('caplab/projects/my');
    await expect(await element.all(by.css('.mat-card')).count()).toBe(2);

    await _.navigation.to('caplab/projects/proposals');
    await expect(await element.all(by.css('.mat-card')).count()).toBe(1);
  });

  it('like project', async () => {
    await expect(await element(by.css('.mat-card')).all(by.css('.star.selected')).count()).toBe(3);

    await element(by.css('.like')).click();

    await element.all(by.css('.star')).last().click();
    await _.button.click('.confirm-like');

    await expect(await element(by.css('.mat-card')).all(by.css('.star.selected')).count()).toBe(5);
  });

  afterEach(async () => {
    await _.coreModuleHelper.logout();

    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
