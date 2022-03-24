import { browser, logging, element, by } from 'protractor';
import { BaseHelpers } from '../helpers/_baseHelpers';

fdescribe('[SPEC] Flux', () => {
  let _: BaseHelpers;

  beforeEach(async () => {
    _ = new BaseHelpers();
    await _.navigation.to();
    await _.dev.resetData();
    await _.coreModuleHelper.login('admin');
    await _.navigation.to('flux');
  });

  it('create new publication', async () => {
    await _.button.new();

    const projectForm = _.form('.create-flux');
    await projectForm.writeInsideKcWysiwyg('My message');
    await projectForm.submit();

    await expect(await element.all(by.css('.publication-card')).count()).toBe(2);
    await expect(await element.all(by.css('.publication-card .meta')).first().getText()).toContain('admin admin');
  });

  fit('create new anonymous publication', async () => {
    await _.button.new();

    const projectForm = _.form('.create-flux');
    await projectForm.writeInsideKcWysiwyg('My anonymous message');
    await projectForm.toggleSlide();
    await projectForm.submit();

    await expect(await element.all(by.css('.publication-card')).count()).toBe(2);
    await expect(await element.all(by.css('.publication-card .meta')).first().getText()).not.toContain('admin admin');
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
