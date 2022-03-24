import { browser, logging } from 'protractor';
import { BaseHelpers } from '../helpers/_baseHelpers';

describe('[VISUAL] Caplab', () => {
  let _: BaseHelpers;

  beforeEach(async () => {
    _ = new BaseHelpers();
    await _.navigation.to();
    await _.dev.resetData();
    await _.coreModuleHelper.login('admin');
  });

  it('Public projects', async () => {
    await _.navigation.to('caplab/projects/proposals');

    await _.visualComparison.compareScreens('caplab.publicProjects');
  });

  it('Waiting approval projects', async () => {
    await _.navigation.to('caplab/projects/my');

    await _.visualComparison.compareScreens('caplab.waitingApprovalProjects');
  });

  it('Creating new project', async () => {
    await _.navigation.to('caplab/projects/my');
    await _.button.new();

    await _.visualComparison.compareScreens('caplab.creatingProject');
    await _.button.click('.cancel');
  });

  it('Open project', async () => {
    await _.navigation.to('caplab/projects/proposals');
    await _.button.click('.open');

    await _.visualComparison.compareScreens('caplab.openProject');
    await _.button.click('.close');
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
