import { Module, customModule, Container, Modal } from '@ijstech/components'
import ScomCountDown from '@scom/scom-countdown';
import ScomWidgetTest from '@scom/scom-widget-test';

const currentDate = new Date();
const futureDate = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days
const targetTime = Math.floor(futureDate.getTime() / 1000);
@customModule
export default class Module1 extends Module {
  private scomCountDown: ScomCountDown;
  private widgetModule: ScomWidgetTest;

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  private async onShowConfig() {
    const editor = this.scomCountDown.getConfigurators().find(v => v.target === 'Editor');
    const widgetData = await editor.getData();
    if (!this.widgetModule) {
      this.widgetModule = await ScomWidgetTest.create({
        widgetName: 'scom-countdown',
        onConfirm: (data: any, tag: any) => {
          editor.setData(data);
          editor.setTag(tag);
          this.widgetModule.closeModal();
        }
      });
    }
    this.widgetModule.openModal({
      width: '90%',
      maxWidth: '90rem',
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      closeOnBackdropClick: true,
      closeIcon: null
    });
    this.widgetModule.show(widgetData);

    setTimeout(() => {
      (this.widgetModule.closest('i-modal') as Modal)?.refresh();
    }, 1);
  }

  init() {
    super.init();
  }

  render() {
    return (
      <i-vstack
        margin={{ top: '1rem', left: '1rem', right: '1rem' }}
        gap="1rem"
      >
        <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
        <i-scom-countdown
          id="scomCountDown"
          name="Countdown to Launch!"
          targetTime={targetTime}
        />
      </i-vstack>
    )
  }
}
