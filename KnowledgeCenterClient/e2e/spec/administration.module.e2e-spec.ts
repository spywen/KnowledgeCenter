import { browser, logging } from 'protractor';
import { BaseHelpers } from '../helpers/_baseHelpers';

describe('[SPEC] Administration', () => {
  let _: BaseHelpers;

  beforeEach(async () => {
    _ = new BaseHelpers();
    await _.navigation.to();
    await _.dev.resetData();
    await _.coreModuleHelper.login('admin');
  });

  it('agencies crud', async () => {
    await _.navigation.to('administration/agencies');

    await expect(await _.table.rowCount()).toBe(1);

    // Add agency
    await _.button.clickOnAdd();
    const addAgencyForm = _.form('.create-agency');
    await addAgencyForm.writeInsideTextInput(0, 'Ponic');
    await addAgencyForm.writeInsideTextInput(1, '44211');
    await addAgencyForm.submit();
    await expect(await _.table.rowCount()).toBe(2);
    await expect(await _.table.getCellText(0, 0)).toEqual('Ponic');
    await expect(await _.table.getCellText(0, 1)).toEqual('44211');

    // Update agency
    await _.table.editRow(0);
    const updateAgencyForm = _.form('.edit-agency');
    await updateAgencyForm.writeInsideTextInput(0, 'Pornic');
    await updateAgencyForm.writeInsideTextInput(1, '44210');
    await updateAgencyForm.submit();
    await expect(await _.table.rowCount()).toBe(2);
    await expect(await _.table.getCellText(0, 0)).toEqual('Pornic');
    await expect(await _.table.getCellText(0, 1)).toEqual('44210');

    // Delete agency
    await _.table.deleteRow(0);
    await _.button.click('.confirm');
    await browser.sleep(1000); // wait animation
    await expect(await _.table.rowCount()).toBe(1);
  });

  it('service-lines crud', async () => {
    await _.navigation.to('administration/service-lines');

    await expect(await _.table.rowCount()).toBe(1);

    // Add service line
    await _.button.clickOnAdd();
    const addServiceLineForm = _.form('.create-service-line');
    await addServiceLineForm.writeInsideTextInput(0, 'DT');
    await addServiceLineForm.writeInsideTextarea('DT');
    await addServiceLineForm.submit();
    await expect(await _.table.rowCount()).toBe(2);
    await expect(await _.table.getCellText(0, 0)).toEqual('DT');
    await expect(await _.table.getCellText(0, 1)).toEqual('DT');

    // Update service line
    await _.table.editRow(0);
    const editServiceLineForm = _.form('.edit-service-line');
    await editServiceLineForm.writeInsideTextInput(0, 'DIT');
    await editServiceLineForm.writeInsideTextarea('DIT');
    await editServiceLineForm.submit();
    await expect(await _.table.rowCount()).toBe(2);
    await expect(await _.table.getCellText(0, 0)).toEqual('DIT');
    await expect(await _.table.getCellText(0, 1)).toEqual('DIT');

    // Delete service line
    await _.table.deleteRow(0);
    await _.button.click('.confirm');
    await browser.sleep(1000); // wait animation
    await expect(await _.table.rowCount()).toBe(1);
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
