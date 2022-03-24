import { FormHelper } from './formHelper';
import { ButtonHelper } from './buttonHelper';
import { NavigationHelper } from './navigationHelper';
import { DevHelper } from './devHelper';
import { VisualComparisonHelper } from './visualComparisonHelper';
import { CoreModuleHelper } from './modules/coreModuleHelper';
import { TableHelper } from './tableHelper';
import { TabHelper } from './tabHelper';

/**
 * Helpers which gather all the helper classes
 */
export class BaseHelpers {
  public button = new ButtonHelper();
  public tab = new TabHelper();
  public table = new TableHelper();
  public navigation = new NavigationHelper();
  public dev = new DevHelper();
  public visualComparison = new VisualComparisonHelper();

  public coreModuleHelper = new CoreModuleHelper(this);

  public form = (formSelector: string): FormHelper => {
    return new FormHelper(formSelector);
  }
}
