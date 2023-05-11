import {
  Module,
  customModule,
  IDataSchema,
  Container,
  ControlElement,
  customElements,
  Label,
  HStack,
  moment,
  Styles
} from '@ijstech/components'
import { } from '@ijstech/eth-contract'
import { } from '@ijstech/eth-wallet'
import { IData } from './interface'
import { setDataFromSCConfig } from './store'
import ScomDappContainer from "@scom/scom-dapp-container"
import './index.css'
import dataJson from './data.json'

const Theme = Styles.Theme.ThemeVars

// const configSchema = {
//   type: 'object',
//   required: [],
//   properties: {
//     width: {
//       type: 'string',
//     },
//     height: {
//       type: 'string',
//     },
//   },
// }

interface ScomCountDownElement extends ControlElement {
  date?: string
  name?: string
  showUTC?: boolean
  units?: string
  showHeader?: boolean;
  showFooter?: boolean;
}

const defaultDateTimeFormat = 'MM/DD/YYYY HH:mm:ss'
const unitOptions = ['days, hours, minutes, seconds', 'days, hours, minutes']

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
  private data: IData = {
    date: '',
  }

  private pnlCounter: HStack
  private lbName: Label
  private lbUTC: Label
  private dappContainer: ScomDappContainer;

  private timer: any

  tag: any = {}

  readonly onConfirm: () => Promise<void>
  readonly onDiscard: () => Promise<void>
  readonly onEdit: () => Promise<void>

  defaultEdit?: boolean
  validate?: () => boolean
  edit: () => Promise<void>
  confirm: () => Promise<void>
  discard: () => Promise<void>

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    if (dataJson) setDataFromSCConfig(dataJson)
  }

  init() {
    this.isReadyCallbackQueued = true
    super.init()
    const width = this.getAttribute('width', true)
    const height = this.getAttribute('height', true)
    this.setTag({
      width: width ? this.width : 'auto',
      height: height ? this.height : 'auto',
    })
    this.data.name = this.getAttribute('name', true)
    this.data.showUTC = this.getAttribute('showUTC', true, false)
    this.data.date = this.getAttribute(
      'date',
      true,
      moment().endOf('days').format(defaultDateTimeFormat)
    )
    this.data.units = this.getAttribute('units', true, unitOptions[0])
    this.data.showHeader = this.getAttribute('showHeader', true, false)
    this.data.showFooter = this.getAttribute('showFooter', true, false)
    this.setData(this.data)
    this.isReadyCallbackQueued = false
    this.executeReadyCallback()
  }

  static async create(options?: ScomCountDownElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get name() {
    return this.data.name ?? ''
  }
  set name(value: string) {
    this.data.name = value
    if (this.lbName) {
      this.lbName.visible = !!this.data.name
      this.lbName.caption = value
    }
  }

  get date() {
    let end = moment(this.data.date)
    if (!end.isValid()) end = moment(this.data.date, defaultDateTimeFormat)
    const utcDate = moment(this.data.date)
    return end.isValid() ? utcDate.format(defaultDateTimeFormat) : ''
  }
  set date(value: string) {
    this.data.date = value
  }

  get showUTC() {
    return this.data.showUTC ?? false
  }
  set showUTC(value: boolean) {
    this.data.showUTC = value
    if (this.lbUTC) this.lbUTC.visible = this.showUTC
  }

  get unitArray() {
    return this.units.split(',').map(unit => unit.trim())
  }

  get units(): string {
    return this.data.units || unitOptions[0]
  }
  set units(value: string) {
    this.data.units = value || unitOptions[0]
  }

  get showFooter() {
    return this.data.showFooter ?? false
  }
  set showFooter(value: boolean) {
    this.data.showFooter = value
    if (this.dappContainer) this.dappContainer.showFooter = this.showFooter;
  }

  get showHeader() {
    return this.data.showHeader ?? false
  }
  set showHeader(value: boolean) {
    this.data.showHeader = value
    if (this.dappContainer) this.dappContainer.showHeader = this.showHeader;
  }

  private getData() {
    return this.data
  }

  private async setData(value: IData) {
    this.data = value
    !this.lbName.isConnected && (await this.lbName.ready())
    !this.lbUTC.isConnected && (await this.lbUTC.ready())
    const data: any = {
      showWalletNetwork: false,
      showFooter: this.showFooter,
      showHeader: this.showHeader
    }
    if (this.dappContainer?.setData) this.dappContainer.setData(data)
    this.refreshPage()
  }

  private refreshPage() {
    this.renderUI()
    this.timer && clearInterval(this.timer)
    this.timer = setInterval(() => this.renderUI(), 1000)
  }

  private renderCountItem(unit: string, value: number) {
    const itemEl = (
      <i-vstack verticalAlignment='center' horizontalAlignment='center'>
        <i-label
          caption={`${value < 10 ? '0' + value : value}`}
          font={{ size: '7.688rem', color: Theme.text.primary }}
        ></i-label>
        <i-label caption={unit} font={{ size: '1.5rem', color: Theme.text.primary }}></i-label>
      </i-vstack>
    )
    return itemEl
  }

  private clearCountdown() {
    this.pnlCounter.clearInnerHTML()
    for (let unit of this.unitArray) {
      const el = this.renderCountItem(unit, 0)
      el && this.pnlCounter.appendChild(el)
    }
    this.timer && clearInterval(this.timer)
  }

  private getValue(unit: string, duration: any) {
    let value = 0
    switch (unit) {
      case 'seconds':
        value = this.unitArray.includes('minutes')
          ? duration.seconds()
          : Math.floor(duration.asSeconds())
        break
      case 'minutes':
        value = this.unitArray.includes('hours')
          ? duration.minutes()
          : Math.floor(duration.asMinutes())
        break
      case 'hours':
        value = this.unitArray.includes('days')
          ? duration.hours()
          : Math.floor(duration.asHours())
        break
      case 'days':
        value = this.unitArray.includes('weeks')
          ? duration.days()
          : Math.floor(duration.asDays())
        break
      case 'weeks':
        value = this.unitArray.includes('months')
          ? duration.weeks()
          : Math.floor(duration.asWeeks())
        break
      case 'months':
        value = this.unitArray.includes('years')
          ? duration.months()
          : Math.floor(duration.asMonths())
        break
      case 'years':
        value = duration.years()
        break
    }
    return value
  }

  private renderUI() {
    if (this.lbName) {
      this.lbName.visible = !!this.data.name
      this.lbName.caption = this.data.name
    }
    if (this.lbUTC) {
      this.lbUTC.visible = this.showUTC
      this.lbUTC.caption = this.date ? moment.utc(this.date).toString() : ''
    }
    const now = moment()
    let end = moment(this.date)
    const isTimeout = end.diff(now) <= 0
    if (isTimeout || !end.isValid()) {
      this.clearCountdown()
      return
    }
    this.pnlCounter.clearInnerHTML()
    const duration = moment.duration(end.diff(now))
    for (let unit of this.unitArray) {
      const value = this.getValue(unit, duration)
      const el = this.renderCountItem(unit, value)
      el && this.pnlCounter.appendChild(el)
      if (end.diff(now) <= 0) {
        this.clearCountdown()
        return
      }
    }
  }

  private getTag() {
    return this.tag
  }

  private async setTag(value: any, init?: boolean) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.tag[prop] = newValue[prop];
      }
    }
    if (this.dappContainer && !init) this.dappContainer.setTag(this.tag);
    this.updateTheme();
    this.display = 'block'
    this.width = this.tag.width
    this.height = this.tag.height
  }

  private updateTag(type: 'light'|'dark', value: any) {
    this.tag[type] = this.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.tag[type][prop] = value[prop];
    }
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }

  private updateTheme() {
    const themeVar = this.dappContainer?.theme || 'light';
    this.updateStyle('--text-primary', this.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.tag[themeVar]?.backgroundColor);
  }

  getConfigurators() {
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          const propertiesSchema = this.getPropertiesSchema()
          const themeSchema = this.getThemeSchema()
          return this._getActions(propertiesSchema, themeSchema)
        },
        getData: this.getData.bind(this),
        setData: async (data: IData) => {
          const defaultData = dataJson.defaultBuilderData as any
          defaultData.date =  moment().endOf('days').format(defaultDateTimeFormat)
          await this.setData({...defaultData, ...data})
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getActions: () => {
          const propertiesSchema = this.getPropertiesSchema()
          const themeSchema = this.getThemeSchema(true)
          return this._getActions(propertiesSchema, themeSchema)
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private getPropertiesSchema() {
    const schema: IDataSchema = {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          format: 'date-time',
        },
        name: {
          type: 'string',
        },
        showUTC: {
          title: 'Show UTC',
          default: false,
          type: 'boolean',
        },
        units: {
          type: 'string',
          enum: unitOptions,
        },
      },
    }
    return schema
  }

  private getThemeSchema(readOnly?: boolean) {
    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        dark: {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color',
              readOnly
            },
            fontColor: {
              type: 'string',
              format: 'color',
              readOnly
            }
          }
        },
        light: {
          type: 'object',
          properties: {
            backgroundColor: {
              type: 'string',
              format: 'color',
              readOnly
            },
            fontColor: {
              type: 'string',
              format: 'color',
              readOnly
            }
          }
        }
      }
    }
    return themeSchema
  }

  private _getActions(settingSchema: IDataSchema, themeSchema: IDataSchema) {
    const actions = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          let oldData = {date: ''}
          return {
            execute: () => {
              oldData = {...this.data}
              if (userInputData?.date !== undefined) this.data.date = userInputData.date
              if (userInputData?.name !== undefined) this.data.name = userInputData.name
              if (userInputData?.showUTC !== undefined) this.data.showUTC = userInputData.showUTC
              if (userInputData?.units !== undefined) this.data.units = userInputData.units
              this.refreshPage()
              if (builder?.setData) builder.setData(this.data)
              this.height = 'auto'
            },
            undo: () => {
              this.data = {...oldData}
              this.refreshPage()
              if (builder?.setData) builder.setData(this.data)
              this.height = 'auto'
            },
            redo: () => {},
          }
        },
        userInputDataSchema: settingSchema as IDataSchema,
      },
      {
        name: 'Theme Settings',
        icon: 'palette',
        command: (builder: any, userInputData: any) => {
          let oldTag = {}
          return {
            execute: async () => {
              if (!userInputData) return;
              oldTag = JSON.parse(JSON.stringify(this.tag));
              if (builder) builder.setTag(userInputData);
              else this.setTag(userInputData);
              if (this.dappContainer) this.dappContainer.setTag(userInputData);

            },
            undo: () => {
              if (!userInputData) return;
              this.tag = JSON.parse(JSON.stringify(oldTag));
              if (builder) builder.setTag(this.tag);
              else this.setTag(this.tag);
              if (this.dappContainer) this.dappContainer.setTag(this.tag);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: themeSchema
      }
    ]
    return actions
  }

  render() {
    return (
      <i-scom-dapp-container id="dappContainer">
        <i-vstack
          verticalAlignment='center'
          horizontalAlignment='center'
          class='text-center'
          padding={{left: '1rem', right: '1rem', top: '1.5rem', bottom: '1.5rem'}}
          background={{color: Theme.background.main}}
        >
          <i-label
            id='lbName'
            font={{ size: '2rem', bold: true, color: Theme.text.primary }}
            width='100%'
            margin={{ bottom: '1rem' }}
          ></i-label>
          <i-label id='lbUTC' visible={false} width='100%' font={{color: Theme.text.primary}}></i-label>
          <i-hstack
            id='pnlCounter'
            gap='3rem'
            margin={{ top: '1rem' }}
            horizontalAlignment='center'
            verticalAlignment='center'
          ></i-hstack>
        </i-vstack>
      </i-scom-dapp-container>
    )
  }
}
