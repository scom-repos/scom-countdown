import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  Label,
  HStack,
  moment,
  Styles
} from '@ijstech/components';
import ScomDappContainer from "@scom/scom-dapp-container";
import './index.css';
import { unitOptions } from './formSchema.json';
import Model from './model';
import { textCenterStyle, unitFontStyle, valueFontStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

interface IData {
  targetTime?: number;
  name?: string;
  showUTC?: boolean;
  units?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}
interface ScomCountDownElement extends ControlElement, IData {
  lazyLoad?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-countdown']: ScomCountDownElement
    }
  }
}

@customModule
@customElements('i-scom-countdown')
export default class ScomCountDown extends Module {
  private model: Model;
  private pnlCounter: HStack;
  private lbName: Label;
  private lbUTC: Label;
  private dappContainer: ScomDappContainer;
  private timer: any;

  tag: any = {};
  defaultEdit?: boolean;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomCountDownElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get name() {
    return this.model.name;
  }

  get targetTime() {
    return this.model.targetTime;
  }

  get showUTC() {
    return this.model.showUTC;
  }

  get unitArray() {
    return this.model.unitArray;
  }

  get units() {
    return this.model.units;
  }

  get showFooter() {
    return this.model.showFooter;
  }

  get showHeader() {
    return this.model.showHeader;
  }

  getData() {
    return this.model.getData();
  }

  async setData(value: IData) {
    this.model.setData(value);
  }

  getTag() {
    return this.tag;
  }

  async setTag(value: any, init?: boolean) {
    this.model.setTag(value, init);
  }

  getConfigurators() {
    this.initModel();
    return this.model.getConfigurators();
  }

  private setContaiterTag(value: any) {
    if (this.dappContainer) this.dappContainer.setTag(value);
  }

  private refreshDappContainer = () => {
    const data = {
      showWalletNetwork: false,
      showFooter: this.showFooter,
      showHeader: this.showHeader
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data);
  }

  private refreshPage() {
    this.renderUI();
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => this.updateTimerUI(), 1000);
  }

  private renderCountItem(unit: string, value: number) {
    const itemEl = (
      <i-vstack gap="0.5rem" verticalAlignment="center" horizontalAlignment="center">
        <i-label
          caption={`${value < 10 ? '0' + value : value}`}
          font={{ color: Theme.text.primary }}
          class={valueFontStyle}
        />
        <i-label
          caption={unit.toUpperCase()}
          font={{ color: Theme.text.primary }}
          class={unitFontStyle}
          opacity={0.6}
        />
      </i-vstack>
    )
    return itemEl;
  }

  private clearCountdown() {
    this.pnlCounter.clearInnerHTML();
    for (let unit of this.unitArray) {
      const el = this.renderCountItem(unit, 0);
      if (el) {
        this.pnlCounter.appendChild(el);
      }
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private renderUI() {
    if (this.lbName) {
      this.lbName.visible = !!this.name;
      this.lbName.caption = this.name;
    }
    if (this.lbUTC) {
      this.lbUTC.visible = this.showUTC;
      this.lbUTC.caption = this.targetTime ? moment.unix(this.targetTime).utc(true).format('MM/DD/YYYY HH:mm:ss [GMT]Z') : '';
    }
    this.updateTimerUI();
  }

  private updateTimerUI() {
    const now = moment();
    const end = moment.unix(this.targetTime);
    const isTimeout = end.diff(now) <= 0;
    if (isTimeout || !end.isValid()) {
      this.clearCountdown();
      return;
    }
    this.pnlCounter.clearInnerHTML();
    const duration = moment.duration(end.diff(now));
    for (let unit of this.unitArray) {
      const value = this.model.getValue(unit, duration);
      const el = this.renderCountItem(unit, value);
      if (el) {
        this.pnlCounter.appendChild(el);
      }
      if (end.diff(now) <= 0) {
        this.clearCountdown();
        return;
      }
    }
  }

  private initModel() {
    if (!this.model) {
      this.model = new Model(this, {
        refreshWidget: this.refreshPage.bind(this),
        refreshDappContainer: this.refreshDappContainer.bind(this),
        setContaiterTag: this.setContaiterTag.bind(this)
      })
    }
  }

  init() {
    this.initModel();
    super.init();
    const width = this.getAttribute('width', true);
    const height = this.getAttribute('height', true);
    this.setTag({
      width: width ? this.width : 'auto',
      height: height ? this.height : 'auto'
    });
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const name = this.getAttribute('name', true);
      const targetTime = this.getAttribute('targetTime', true);
      const showUTC = this.getAttribute('showUTC', true, false);
      const units = this.getAttribute('units', true, unitOptions[0]);
      const showHeader = this.getAttribute('showHeader', true, false);
      const showFooter = this.getAttribute('showFooter', true, false);
      if (targetTime) {
        this.setData({
          name,
          targetTime,
          showUTC,
          units,
          showHeader,
          showFooter
        });
      }
    }
  }

  render() {
    return (
      <i-scom-dapp-container id="dappContainer">
        <i-vstack
          verticalAlignment="center"
          horizontalAlignment="center"
          class={textCenterStyle}
          padding={{ left: '0.5rem', right: '0.5rem', top: '1rem', bottom: '1rem' }}
          background={{ color: Theme.background.main }}
        >
          <i-label
            id="lbName"
            font={{ size: '2rem', bold: true, color: Theme.text.primary }}
            width="100%"
            margin={{ bottom: '1rem' }}
            mediaQueries={[
              {
                maxWidth: '768px',
                properties: {
                  font: { size: '1.25rem' }
                }
              }
            ]}
          />
          <i-label
            id="lbUTC"
            visible={false}
            width="100%"
            font={{ color: Theme.text.primary }}
            margin={{ bottom: '1rem' }}
          />
          <i-hstack
            id="pnlCounter"
            gap="2.5rem"
            horizontalAlignment="center"
            verticalAlignment="center"
            overflow="auto"
            wrap="wrap"
            mediaQueries={[
              {
                maxWidth: '768px',
                properties: {
                  gap: '1.25rem'
                }
              }
            ]}
          />
        </i-vstack>
      </i-scom-dapp-container>
    )
  }
}
