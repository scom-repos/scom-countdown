var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-countdown/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unitFontStyle = exports.valueFontStyle = exports.textCenterStyle = void 0;
    exports.textCenterStyle = components_1.Styles.style({
        textAlign: 'center'
    });
    exports.valueFontStyle = components_1.Styles.style({
        fontSize: '6rem',
        $nest: {
            '@media only screen and (max-width: 768px)': {
                fontSize: '3rem'
            }
        }
    });
    exports.unitFontStyle = components_1.Styles.style({
        fontSize: '1.5rem',
        $nest: {
            '@media only screen and (max-width: 768px)': {
                fontSize: '1rem'
            }
        }
    });
});
define("@scom/scom-countdown/formSchema.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unitOptions = void 0;
    ///<amd-module name='@scom/scom-countdown/formSchema.json.ts'/> 
    exports.unitOptions = ['days, hours, minutes, seconds', 'days, hours, minutes'];
    const theme = {
        type: 'object',
        properties: {
            backgroundColor: {
                type: 'string',
                format: 'color'
            },
            fontColor: {
                type: 'string',
                format: 'color'
            }
        }
    };
    exports.default = {
        dataSchema: {
            type: 'object',
            properties: {
                targetTime: {
                    type: 'number',
                    title: 'Target Time',
                    tooltip: 'Unix timestamp in second',
                    required: true
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
                    enum: exports.unitOptions,
                },
                dark: theme,
                light: theme
            }
        },
        uiSchema: {
            type: 'Categorization',
            elements: [
                {
                    type: 'Category',
                    label: 'General',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    scope: '#/properties/targetTime'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/name'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/showUTC'
                                },
                                {
                                    type: 'Control',
                                    scope: '#/properties/units'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'Category',
                    label: 'Theme',
                    elements: [
                        {
                            type: 'VerticalLayout',
                            elements: [
                                {
                                    type: 'Control',
                                    label: 'Dark',
                                    scope: '#/properties/dark'
                                },
                                {
                                    type: 'Control',
                                    label: 'Light',
                                    scope: '#/properties/light'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };
});
define("@scom/scom-countdown/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-countdown/data.json.ts'/> 
    exports.default = {
        "defaultBuilderData": {
            name: 'My countdown',
            showUTC: true
        }
    };
});
define("@scom/scom-countdown/model.ts", ["require", "exports", "@scom/scom-countdown/formSchema.json.ts", "@scom/scom-countdown/data.json.ts"], function (require, exports, formSchema_json_1, data_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Model {
        constructor(module, options) {
            this.options = {
                refreshWidget: () => { },
                refreshDappContainer: () => { },
                setContaiterTag: (value) => { }
            };
            this._data = { targetTime: 0 };
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
        get units() {
            return this._data.units || formSchema_json_1.unitOptions[0];
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
                    setData: async (value) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        this.setData({ ...defaultData, ...value });
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    getActions: () => {
                        return this._getActions();
                    },
                    getLinkParams: () => {
                        const data = this._data || {};
                        return {
                            data: window.btoa(JSON.stringify(data))
                        };
                    },
                    setLinkParams: async (params) => {
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
                    getActions: (category) => {
                        const actions = this._getActions();
                        const editAction = actions.find(action => action.name === 'Edit');
                        return editAction ? [editAction] : [];
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        getData() {
            return this._data;
        }
        async setData(value) {
            this._data = value;
            this.options.refreshDappContainer();
            this.options.refreshWidget();
        }
        getTag() {
            return this.module.tag;
        }
        setTag(value, init) {
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
        updateTag(type, value) {
            this.module.tag[type] = this.module.tag[type] ?? {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.module.tag[type][prop] = value[prop];
            }
        }
        updateStyle(name, value) {
            if (value) {
                this.module.style.setProperty(name, value);
            }
            else {
                this.module.style.removeProperty(name);
            }
        }
        updateTheme() {
            const themeVar = document.body.style.getPropertyValue('--theme') || 'light';
            this.updateStyle('--text-primary', this.module.tag[themeVar]?.fontColor);
            this.updateStyle('--background-main', this.module.tag[themeVar]?.backgroundColor);
        }
        _getActions() {
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = { targetTime: 0 };
                        let oldTag = {};
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify(this._data));
                                const { targetTime, name, showUTC, units, ...themeSettings } = userInputData;
                                const generalSettings = {
                                    targetTime,
                                    name,
                                    showUTC,
                                    units
                                };
                                if (generalSettings.targetTime !== undefined)
                                    this._data.targetTime = generalSettings.targetTime;
                                if (generalSettings.name !== undefined)
                                    this._data.name = generalSettings.name;
                                if (generalSettings.showUTC !== undefined)
                                    this._data.showUTC = generalSettings.showUTC;
                                if (generalSettings.units !== undefined)
                                    this._data.units = generalSettings.units;
                                this.options.refreshWidget();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                this.module.height = 'auto';
                                oldTag = JSON.parse(JSON.stringify(this.module.tag));
                                if (builder?.setTag)
                                    builder.setTag(themeSettings);
                                else
                                    this.setTag(themeSettings);
                                this.options.setContaiterTag(themeSettings);
                            },
                            undo: () => {
                                this._data = JSON.parse(JSON.stringify(oldData));
                                this.options.refreshWidget();
                                if (builder?.setData)
                                    builder.setData(this._data);
                                this.module.height = 'auto';
                                const tag = JSON.parse(JSON.stringify(oldTag));
                                this.module.tag = tag;
                                if (builder?.setTag)
                                    builder.setTag(tag);
                                else
                                    this.setTag(tag);
                                this.options.setContaiterTag(tag);
                            },
                            redo: () => { },
                        };
                    },
                    userInputDataSchema: formSchema_json_1.default.dataSchema,
                    userInputUISchema: formSchema_json_1.default.uiSchema
                }
            ];
            return actions;
        }
        getValue(unit, duration) {
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
    exports.default = Model;
});
define("@scom/scom-countdown", ["require", "exports", "@ijstech/components", "@scom/scom-countdown/formSchema.json.ts", "@scom/scom-countdown/model.ts", "@scom/scom-countdown/index.css.ts", "@scom/scom-countdown/index.css.ts"], function (require, exports, components_2, formSchema_json_2, model_1, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomCountDown = class ScomCountDown extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.tag = {};
            this.refreshDappContainer = () => {
                const data = {
                    showWalletNetwork: false,
                    showFooter: this.showFooter,
                    showHeader: this.showHeader
                };
                if (this.dappContainer?.setData)
                    this.dappContainer.setData(data);
            };
        }
        static async create(options, parent) {
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
        async setData(value) {
            this.model.setData(value);
        }
        getTag() {
            return this.tag;
        }
        async setTag(value, init) {
            this.model.setTag(value, init);
        }
        getConfigurators() {
            this.initModel();
            return this.model.getConfigurators();
        }
        setContaiterTag(value) {
            if (this.dappContainer)
                this.dappContainer.setTag(value);
        }
        refreshPage() {
            this.renderUI();
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(() => this.updateTimerUI(), 1000);
        }
        renderCountItem(unit, value) {
            const itemEl = (this.$render("i-vstack", { gap: "0.5rem", verticalAlignment: "center", horizontalAlignment: "center" },
                this.$render("i-label", { caption: `${value < 10 ? '0' + value : value}`, font: { color: Theme.text.primary }, class: index_css_1.valueFontStyle }),
                this.$render("i-label", { caption: unit.toUpperCase(), font: { color: Theme.text.primary }, class: index_css_1.unitFontStyle, opacity: 0.6 })));
            return itemEl;
        }
        clearCountdown() {
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
        renderUI() {
            if (this.lbName) {
                this.lbName.visible = !!this.name;
                this.lbName.caption = this.name;
            }
            if (this.lbUTC) {
                this.lbUTC.visible = this.showUTC;
                this.lbUTC.caption = this.targetTime ? components_2.moment.unix(this.targetTime).utc(true).format('MM/DD/YYYY HH:mm:ss [GMT]Z') : '';
            }
            this.updateTimerUI();
        }
        updateTimerUI() {
            const now = (0, components_2.moment)();
            const end = components_2.moment.unix(this.targetTime);
            const isTimeout = end.diff(now) <= 0;
            if (isTimeout || !end.isValid()) {
                this.clearCountdown();
                return;
            }
            this.pnlCounter.clearInnerHTML();
            const duration = components_2.moment.duration(end.diff(now));
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
        initModel() {
            if (!this.model) {
                this.model = new model_1.default(this, {
                    refreshWidget: this.refreshPage.bind(this),
                    refreshDappContainer: this.refreshDappContainer.bind(this),
                    setContaiterTag: this.setContaiterTag.bind(this)
                });
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
                const units = this.getAttribute('units', true, formSchema_json_2.unitOptions[0]);
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
            return (this.$render("i-scom-dapp-container", { id: "dappContainer" },
                this.$render("i-vstack", { verticalAlignment: "center", horizontalAlignment: "center", class: index_css_1.textCenterStyle, padding: { left: '0.5rem', right: '0.5rem', top: '1rem', bottom: '1rem' }, background: { color: Theme.background.main } },
                    this.$render("i-label", { id: "lbName", font: { size: '2rem', bold: true, color: Theme.text.primary }, width: "100%", margin: { bottom: '1rem' }, mediaQueries: [
                            {
                                maxWidth: '768px',
                                properties: {
                                    font: { size: '1.25rem' }
                                }
                            }
                        ] }),
                    this.$render("i-label", { id: "lbUTC", visible: false, width: "100%", font: { color: Theme.text.primary }, margin: { bottom: '1rem' } }),
                    this.$render("i-hstack", { id: "pnlCounter", gap: "2.5rem", horizontalAlignment: "center", verticalAlignment: "center", overflow: "auto", wrap: "wrap", mediaQueries: [
                            {
                                maxWidth: '768px',
                                properties: {
                                    gap: '1.25rem'
                                }
                            }
                        ] }))));
        }
    };
    ScomCountDown = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-countdown')
    ], ScomCountDown);
    exports.default = ScomCountDown;
});
