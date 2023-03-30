import {
  Module,
  customModule,
  IDataSchema,
  Container,
  ControlElement,
  customElements,
  Panel,
  Label,
  HStack,
  moment,
  IComboItem
} from '@ijstech/components'
import { IData, PageBlock } from './interface'
import { setDataFromSCConfig } from './store'
import './index.css'
import scconfig from './scconfig.json';

const configSchema = {
  type: 'object',
  required: [],
  properties: {
    width: {
      type: 'string',
    },
    height: {
      type: 'string'
    }
  }
}

interface ScomCountDownElement extends ControlElement {
  date?: string;
  time?: string;
  name?: string;
  showUTC?: boolean;
  units?: string[];
}

const defaultDateFormat = 'DD/MM/YYYY';
const defaultDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';
const defaultUnits = ['days', 'hours', 'minutes', 'seconds']
const defaultTime = '23:59:59'
const unitList = [
  {
    value: 'years',
    label: 'years'
  },
  {
    value: 'months',
    label: 'months'
  },
  {
    value: 'weeks',
    label: 'weeks'
  },
  {
    value: 'days',
    label: 'days'
  },
  {
    value: 'hours',
    label: 'hours'
  },
  {
    value: 'minutes',
    label: 'minutes'
  },
  {
    value: 'seconds',
    label: 'seconds'
  }
]

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-countdown"]: ScomCountDownElement;
    }
  }
}

@customModule
@customElements('i-scom-countdown')
export default class ScomCountDown extends Module implements PageBlock {
  private data: IData = {
    date: '',
    time: ''
  };
  private oldData: IData = {
    date: '',
    time: ''
  };

  private pnlWrap: Panel;
  private pnlCounter: HStack;
  private lbName: Label;
  private lbUTC: Label;

  private timer: any;

  tag: any

  readonly onConfirm: () => Promise<void>
  readonly onDiscard: () => Promise<void>
  readonly onEdit: () => Promise<void>

  defaultEdit?: boolean
  validate?: () => boolean
  edit: () => Promise<void>
  confirm: () => Promise<void>
  discard: () => Promise<void>

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    if (scconfig)
      setDataFromSCConfig(scconfig);
  }
  
  init() {
    this.isReadyCallbackQueued = true;
    super.init()
    const width = this.getAttribute('width', true);
    const height = this.getAttribute('height', true);
    this.setTag({width: width ? this.width : 'auto', height: height ? this.height : 'auto'});
    this.data.name = this.getAttribute('name', true);
    this.data.showUTC = this.getAttribute('showUTC', true, false);
    this.data.date = this.getAttribute('date', true, moment().format(defaultDateFormat));
    this.data.time = this.getAttribute('time', true, defaultTime);
    this.data.units = this.getAttribute('units', true, defaultUnits);
    this.setData(this.data);
    this.isReadyCallbackQueued = false;
    this.executeReadyCallback();
  }

  static async create(options?: ScomCountDownElement, parent?: Container){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get name() {
    return this.data.name ?? '';
  }
  set name(value: string) {
    this.data.name = value;
    if (this.lbName) {
      this.lbName.visible = !!this.data.name;
      this.lbName.caption = value;
    }
  }

  get date() {
    return this.data.date ?? '';
  }
  set date(value: string) {
    this.data.date = value;
  }

  get time() {
    return this.data.time ?? '';
  }
  set time(value: string) {
    this.data.time = value;
  }

  get showUTC() {
    return this.data.showUTC ?? false;
  }
  set showUTC(value: boolean) {
    this.data.showUTC = value;
    if (this.lbUTC) this.lbUTC.visible = this.showUTC;
  }

  get units(): any[] {
    if (this.data?.units?.length)
      return unitList.filter(unit => this.data.units.includes(unit.value))
    return [...unitList].filter(unit => defaultUnits.includes(unit.value))
  }
  set units(values: string[]) {
    this.data.units = values?.length ? values : defaultUnits
  }

  getConfigSchema() {
    return configSchema
  }

  getData() {
    return this.data
  }

  async setData(value: IData) {
    this.oldData = this.data
    this.data = value
    !this.lbName.isConnected && await this.lbName.ready();
    !this.lbUTC.isConnected && await this.lbUTC.ready();
    if (this.lbName) {
      this.lbName.visible = !!this.data.name
      this.lbName.caption = this.data.name
    }
    if (this.lbUTC) this.lbUTC.visible = this.showUTC

    this.renderUI()
    this.timer && clearInterval(this.timer)
    this.timer = setInterval(() => this.renderUI(), 1000)
  }

  private renderCountItem(unit: IComboItem, value: number) {
    const itemEl = (
      <i-vstack verticalAlignment="center" horizontalAlignment="center">
        <i-label caption={`${value < 10 ? '0' + value : value}`} font={{size: '7.688rem'}}></i-label>
        <i-label caption={unit.label} font={{size: '1.5rem'}}></i-label>
      </i-vstack>
    )
    return itemEl;
  }

  clearCountdown() {
    this.lbUTC.caption = ''
    this.pnlCounter.clearInnerHTML()
    for (let unit of this.units) {
      const value = this.getValue(unit.value, 0)
      const el = this.renderCountItem(unit, value)
      el && this.pnlCounter.appendChild(el)
    }
  }

  private isTimeout(duration: any) {
    return duration <= 0;
  }

  private getValue(unit: string, duration: any) {
    let value = 0;
    if (duration <= 0) return 0;
    switch (unit) {
      case 'seconds':
        value = this.data.units.includes('minutes') ? duration.seconds() : Math.floor(duration.asSeconds())
        break;
      case 'minutes':
        value = this.data.units.includes('hours') ? duration.minutes() : Math.floor(duration.asMinutes())
        break;
      case 'hours':
        value = this.data.units.includes('days') ? duration.hours() : Math.floor(duration.asHours())
        break;
      case 'days':
        value = this.data.units.includes('weeks') ? duration.days() : Math.floor(duration.asDays())
        break;
      case 'weeks':
        value = this.data.units.includes('months') ? duration.weeks() : Math.floor(duration.asWeeks())
        break;
      case 'months':
        value = this.data.units.includes('years') ? duration.months() : Math.floor(duration.asMonths())
        break;
      case 'years':
        value = duration.years()
        break;
    }
    return value;
  }

  private renderUI() {
    const now = moment()
    const dateTime = `${this.data.date} ${this.data.time || '00:00:00'}`
    let end = moment(dateTime)
    if (!end.isValid()) end = moment(dateTime, defaultDateTimeFormat)
    if (end.isValid()) {
      this.lbUTC.caption = moment.utc(end.format('YYYY-MM-DD HH:mm:ss')).toString()
      const duration = moment.duration(end.diff(now))
      this.pnlCounter.clearInnerHTML();
      for (let unit of this.units) {
        const value = this.getValue(unit.value, duration)
        const el = this.renderCountItem(unit, value)
        el && this.pnlCounter.appendChild(el)
        if (this.isTimeout(duration)) {
          this.timer && clearInterval(this.timer)
          return
        }
      }
    } else {
      this.clearCountdown()
    }
    
  }

  getTag() {
    return this.tag
  }

  async setTag(value: any) {
    this.tag = value;
    this.display = 'block';
    this.width = this.tag.width;
    this.height = this.tag.height;
  }

  private getPropertiesSchema() {
    return {
      "type": "object",
      "properties": {
        "date": {
          type: "string",
          format: 'date'
        },
        "time": {
          type: "string",
          format: 'time'
        },
        "name": {
          type: "string"
        },
        "showUTC": {
          "title": "Show UTC",
          default: false,
          type: "boolean"
        },
        "units": {
          type: "array",
          uniqueItems: true,
          items: {
            type: 'string',
            title: 'Unit',
            enum: unitList.map(item => item.value)
          }
        }
      }
    };
  }

  getEmbedderActions() {
    const propertiesSchema = this.getPropertiesSchema() as IDataSchema

    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        width: {
          type: 'string',
          readOnly: true
        },
        height: {
          type: 'string',
          readOnly: true
        }
      }
    }

    return this._getActions(propertiesSchema, themeSchema);
  }

  getActions() {
    const propertiesSchema = this.getPropertiesSchema() as IDataSchema

    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        width: {
          type: 'string'
        },
        height: {
          type: 'string'
        }
      }
    }

    return this._getActions(propertiesSchema, themeSchema);
  }

  _getActions(settingSchema: IDataSchema, themeSchema: IDataSchema) {
    const actions = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          return {
            execute: () => {
              if (userInputData.units) {
                const units = [...userInputData.units];
                userInputData.units = units.map(unit => unit.units)
              }
              if (builder?.setData) builder.setData(userInputData);
              this.setData(userInputData);
            },
            undo: () => {
              if (builder?.setData) builder.setData(this.oldData);
              this.setData(this.oldData);
            },
            redo: () => {}
          }
        },
        userInputDataSchema: settingSchema as IDataSchema
      }
    ]
    return actions
  }

  render() {
    return (
      <i-vstack
        id="pnlWrap"
        verticalAlignment="center"
        horizontalAlignment="center"
        gap="1rem"
        class="text-center"
      >
        <i-label id="lbName" font={{size: '2rem', bold: true}} width="100%" margin={{bottom: '1rem'}}></i-label>
        <i-label id="lbUTC" visible={false} width="100%"></i-label>
        <i-hstack
          id="pnlCounter"
          gap="3rem"
          margin={{top: '1rem'}}
          horizontalAlignment="center"
          verticalAlignment="center"
        ></i-hstack>
      </i-vstack>
    )
  }
}
