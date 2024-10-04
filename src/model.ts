import { Module } from '@ijstech/components';
import formSchema, { unitOptions } from './formSchema.json';
import configData from './data.json';

export interface ICountDownData {
  targetTime?: number;
  name?: string;
  showUTC?: boolean;
  units?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

interface IModelOptions {
  refreshWidget: () => void;
  refreshDappContainer: () => void;
  setContaiterTag: (value: any) => void;
}

export default class Model {
  private module: Module;
  private options: IModelOptions = {
    refreshWidget: () => { },
    refreshDappContainer: () => { },
    setContaiterTag: (value: any) => { }
  };
  private _data: ICountDownData = { targetTime: 0 };

  constructor(module: Module, options: IModelOptions) {
    this.module = module;
    this.options = options;
  }

  get name() {
    return this._data.name ?? '';
  }

  get targetTime() {
    return this._data.targetTime ?? 0;
  }

  get showUTC() {
    return this._data.showUTC ?? false;
  }

  get units(): string {
    return this._data.units || unitOptions[0];
  }

  get unitArray() {
    return this.units.split(',').map(unit => unit.trim());
  }

  get showHeader() {
    return this._data.showHeader ?? false;
  }

  get showFooter() {
    return this._data.showFooter ?? false;
  }

  getConfigurators() {
    const self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          return this._getActions();
        },
        getData: this.getData.bind(this),
        setData: async (value: any) => {
          const defaultData = configData.defaultBuilderData;
          this.setData({ ...defaultData, ...value });
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getActions: () => {
          return this._getActions()
        },
        getLinkParams: () => {
          const data = this._data || {};
          return {
            data: window.btoa(JSON.stringify(data))
          }
        },
        setLinkParams: async (params: any) => {
          if (params.data) {
            const utf8String = decodeURIComponent(params.data);
            const decodedString = window.atob(utf8String);
            const newData = JSON.parse(decodedString);
            let resultingData = {
              ...self._data,
              ...newData
            };
            await this.setData(resultingData);
          }
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Editor',
        target: 'Editor',
        getActions: (category?: string) => {
          const actions = this._getActions();
          const editAction = actions.find(action => action.name === 'Edit');
          return editAction ? [editAction] : [];
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  getData() {
    return this._data;
  }

  async setData(value: ICountDownData) {
    this._data = value;
    this.options.refreshDappContainer();
    this.options.refreshWidget();
  }

  getTag() {
    return this.module.tag;
  }

  setTag(value: any, init?: boolean) {
    const newValue = value || {};
    for (let prop in newValue) {
      if (newValue.hasOwnProperty(prop)) {
        if (prop === 'light' || prop === 'dark')
          this.updateTag(prop, newValue[prop]);
        else
          this.module.tag[prop] = newValue[prop];
      }
    }
    this.updateTheme();
    this.module.display = 'block';
    this.module.width = this.module.tag.width;
    this.module.height = this.module.tag.height;
    if (!init) {
      this.options.setContaiterTag(this.module.tag);
    }
  }

  private updateTag(type: 'light' | 'dark', value: any) {
    this.module.tag[type] = this.module.tag[type] ?? {};
    for (let prop in value) {
      if (value.hasOwnProperty(prop))
        this.module.tag[type][prop] = value[prop];
    }
  }

  private updateStyle(name: string, value: any) {
    if (value) {
      this.module.style.setProperty(name, value);
    } else {
      this.module.style.removeProperty(name);
    }
  }

  private updateTheme() {
    const themeVar = document.body.style.getPropertyValue('--theme') || 'light';
    this.updateStyle('--text-primary', this.module.tag[themeVar]?.fontColor);
    this.updateStyle('--background-main', this.module.tag[themeVar]?.backgroundColor);
  }

  private _getActions() {
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData = { targetTime: 0 }
          let oldTag = {}
          return {
            execute: () => {
              oldData = JSON.parse(JSON.stringify(this._data))
              const {
                targetTime,
                name,
                showUTC,
                units,
                ...themeSettings
              } = userInputData

              const generalSettings = {
                targetTime,
                name,
                showUTC,
                units
              }
              if (generalSettings.targetTime !== undefined) this._data.targetTime = generalSettings.targetTime;
              if (generalSettings.name !== undefined) this._data.name = generalSettings.name;
              if (generalSettings.showUTC !== undefined) this._data.showUTC = generalSettings.showUTC;
              if (generalSettings.units !== undefined) this._data.units = generalSettings.units;
              this.options.refreshWidget();
              if (builder?.setData) builder.setData(this._data);
              this.module.height = 'auto';

              oldTag = JSON.parse(JSON.stringify(this.module.tag));
              if (builder?.setTag) builder.setTag(themeSettings);
              else this.setTag(themeSettings);
              this.options.setContaiterTag(themeSettings);
            },
            undo: () => {
              this._data = JSON.parse(JSON.stringify(oldData));
              this.options.refreshWidget();
              if (builder?.setData) builder.setData(this._data);
              this.module.height = 'auto';

              const tag = JSON.parse(JSON.stringify(oldTag));
              this.module.tag = tag;
              if (builder?.setTag) builder.setTag(tag);
              else this.setTag(tag);
              this.options.setContaiterTag(tag);
            },
            redo: () => { },
          }
        },
        userInputDataSchema: formSchema.dataSchema,
        userInputUISchema: formSchema.uiSchema
      }
    ]
    return actions;
  }

  getValue(unit: string, duration: any) {
    let value = 0;
    switch (unit) {
      case 'seconds':
        value = this.unitArray.includes('minutes')
          ? duration.seconds()
          : Math.floor(duration.asSeconds());
        break;
      case 'minutes':
        value = this.unitArray.includes('hours')
          ? duration.minutes()
          : Math.floor(duration.asMinutes());
        break;
      case 'hours':
        value = this.unitArray.includes('days')
          ? duration.hours()
          : Math.floor(duration.asHours());
        break;
      case 'days':
        value = this.unitArray.includes('weeks')
          ? duration.days()
          : Math.floor(duration.asDays());
        break;
      case 'weeks':
        value = this.unitArray.includes('months')
          ? duration.weeks()
          : Math.floor(duration.asWeeks());
        break;
      case 'months':
        value = this.unitArray.includes('years')
          ? duration.months()
          : Math.floor(duration.asMonths());
        break;
      case 'years':
        value = duration.years();
        break;
    }
    return value;
  }
}
