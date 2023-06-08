var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-countdown/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-countdown/store.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getIPFSGatewayUrl = exports.setIPFSGatewayUrl = exports.setDataFromSCConfig = exports.state = void 0;
    ///<amd-module name='@scom/scom-countdown/store.ts'/> 
    exports.state = {
        ipfsGatewayUrl: ""
    };
    const setDataFromSCConfig = (options) => {
        if (options.ipfsGatewayUrl) {
            (0, exports.setIPFSGatewayUrl)(options.ipfsGatewayUrl);
        }
    };
    exports.setDataFromSCConfig = setDataFromSCConfig;
    const setIPFSGatewayUrl = (url) => {
        exports.state.ipfsGatewayUrl = url;
    };
    exports.setIPFSGatewayUrl = setIPFSGatewayUrl;
    const getIPFSGatewayUrl = () => {
        return exports.state.ipfsGatewayUrl;
    };
    exports.getIPFSGatewayUrl = getIPFSGatewayUrl;
});
define("@scom/scom-countdown/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_1.Styles.Theme.ThemeVars;
    components_1.Styles.cssRule('i-scom-countdown', {
        $nest: {
            '.text-center': {
                textAlign: 'center'
            }
        }
    });
});
define("@scom/scom-countdown/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-countdown/data.json.ts'/> 
    exports.default = {
        "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/",
        "defaultBuilderData": {
            name: 'My countdown',
            showUTC: true
        }
    };
});
define("@scom/scom-countdown", ["require", "exports", "@ijstech/components", "@scom/scom-countdown/store.ts", "@scom/scom-countdown/data.json.ts", "@scom/scom-countdown/index.css.ts"], function (require, exports, components_2, store_1, data_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    const defaultDateTimeFormat = 'MM/DD/YYYY HH:mm:ss';
    const unitOptions = ['days, hours, minutes, seconds', 'days, hours, minutes'];
    let ScomCountDown = class ScomCountDown extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {
                date: '',
            };
            this.tag = {};
            if (data_json_1.default)
                (0, store_1.setDataFromSCConfig)(data_json_1.default);
        }
        init() {
            this.isReadyCallbackQueued = true;
            super.init();
            const width = this.getAttribute('width', true);
            const height = this.getAttribute('height', true);
            this.setTag(Object.assign({ width: width ? this.width : 'auto', height: height ? this.height : 'auto' }, this.getInitTag()));
            this.data.name = this.getAttribute('name', true);
            this.data.showUTC = this.getAttribute('showUTC', true, false);
            this.data.date = this.getAttribute('date', true, (0, components_2.moment)().endOf('days').format(defaultDateTimeFormat));
            this.data.units = this.getAttribute('units', true, unitOptions[0]);
            this.data.showHeader = this.getAttribute('showHeader', true, false);
            this.data.showFooter = this.getAttribute('showFooter', true, false);
            this.setData(this.data);
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        getInitTag() {
            const getColors = (vars) => {
                return {
                    "backgroundColor": vars.background.main,
                    "fontColor": '#ffffff'
                };
            };
            return {
                dark: getColors(components_2.Styles.Theme.darkTheme),
                light: getColors(components_2.Styles.Theme.defaultTheme)
            };
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get name() {
            var _a;
            return (_a = this.data.name) !== null && _a !== void 0 ? _a : '';
        }
        set name(value) {
            this.data.name = value;
            if (this.lbName) {
                this.lbName.visible = !!this.data.name;
                this.lbName.caption = value;
            }
        }
        get date() {
            let end = (0, components_2.moment)(this.data.date);
            if (!end.isValid())
                end = (0, components_2.moment)(this.data.date, defaultDateTimeFormat);
            const utcDate = (0, components_2.moment)(this.data.date);
            return end.isValid() ? utcDate.format(defaultDateTimeFormat) : '';
        }
        set date(value) {
            this.data.date = value;
        }
        get showUTC() {
            var _a;
            return (_a = this.data.showUTC) !== null && _a !== void 0 ? _a : false;
        }
        set showUTC(value) {
            this.data.showUTC = value;
            if (this.lbUTC)
                this.lbUTC.visible = this.showUTC;
        }
        get unitArray() {
            return this.units.split(',').map(unit => unit.trim());
        }
        get units() {
            return this.data.units || unitOptions[0];
        }
        set units(value) {
            this.data.units = value || unitOptions[0];
        }
        get showFooter() {
            var _a;
            return (_a = this.data.showFooter) !== null && _a !== void 0 ? _a : false;
        }
        set showFooter(value) {
            this.data.showFooter = value;
            if (this.dappContainer)
                this.dappContainer.showFooter = this.showFooter;
        }
        get showHeader() {
            var _a;
            return (_a = this.data.showHeader) !== null && _a !== void 0 ? _a : false;
        }
        set showHeader(value) {
            this.data.showHeader = value;
            if (this.dappContainer)
                this.dappContainer.showHeader = this.showHeader;
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            var _a;
            this.data = value;
            !this.lbName.isConnected && (await this.lbName.ready());
            !this.lbUTC.isConnected && (await this.lbUTC.ready());
            const data = {
                showWalletNetwork: false,
                showFooter: this.showFooter,
                showHeader: this.showHeader
            };
            if ((_a = this.dappContainer) === null || _a === void 0 ? void 0 : _a.setData)
                this.dappContainer.setData(data);
            this.refreshPage();
        }
        refreshPage() {
            this.renderUI();
            this.timer && clearInterval(this.timer);
            this.timer = setInterval(() => this.renderUI(), 1000);
        }
        renderCountItem(unit, value) {
            const itemEl = (this.$render("i-vstack", { verticalAlignment: 'center', horizontalAlignment: 'center' },
                this.$render("i-label", { caption: `${value < 10 ? '0' + value : value}`, font: { size: '7.688rem', color: Theme.text.primary } }),
                this.$render("i-label", { caption: unit, font: { size: '1.5rem', color: Theme.text.primary } })));
            return itemEl;
        }
        clearCountdown() {
            this.pnlCounter.clearInnerHTML();
            for (let unit of this.unitArray) {
                const el = this.renderCountItem(unit, 0);
                el && this.pnlCounter.appendChild(el);
            }
            this.timer && clearInterval(this.timer);
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
        renderUI() {
            if (this.lbName) {
                this.lbName.visible = !!this.data.name;
                this.lbName.caption = this.data.name;
            }
            if (this.lbUTC) {
                this.lbUTC.visible = this.showUTC;
                this.lbUTC.caption = this.date ? components_2.moment.utc(this.date).toString() : '';
            }
            const now = (0, components_2.moment)();
            let end = (0, components_2.moment)(this.date);
            const isTimeout = end.diff(now) <= 0;
            if (isTimeout || !end.isValid()) {
                this.clearCountdown();
                return;
            }
            this.pnlCounter.clearInnerHTML();
            const duration = components_2.moment.duration(end.diff(now));
            for (let unit of this.unitArray) {
                const value = this.getValue(unit, duration);
                const el = this.renderCountItem(unit, value);
                el && this.pnlCounter.appendChild(el);
                if (end.diff(now) <= 0) {
                    this.clearCountdown();
                    return;
                }
            }
        }
        getTag() {
            return this.tag;
        }
        async setTag(value, init) {
            const newValue = value || {};
            for (let prop in newValue) {
                if (newValue.hasOwnProperty(prop)) {
                    if (prop === 'light' || prop === 'dark')
                        this.updateTag(prop, newValue[prop]);
                    else
                        this.tag[prop] = newValue[prop];
                }
            }
            if (this.dappContainer && !init)
                this.dappContainer.setTag(this.tag);
            this.updateTheme();
            this.display = 'block';
            this.width = this.tag.width;
            this.height = this.tag.height;
        }
        updateTag(type, value) {
            var _a;
            this.tag[type] = (_a = this.tag[type]) !== null && _a !== void 0 ? _a : {};
            for (let prop in value) {
                if (value.hasOwnProperty(prop))
                    this.tag[type][prop] = value[prop];
            }
        }
        updateStyle(name, value) {
            value ?
                this.style.setProperty(name, value) :
                this.style.removeProperty(name);
        }
        updateTheme() {
            var _a, _b, _c;
            const themeVar = ((_a = this.dappContainer) === null || _a === void 0 ? void 0 : _a.theme) || 'light';
            this.updateStyle('--text-primary', (_b = this.tag[themeVar]) === null || _b === void 0 ? void 0 : _b.fontColor);
            this.updateStyle('--background-main', (_c = this.tag[themeVar]) === null || _c === void 0 ? void 0 : _c.backgroundColor);
        }
        getConfigurators() {
            const self = this;
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: () => {
                        const propertiesSchema = this.getPropertiesSchema();
                        const themeSchema = this.getThemeSchema();
                        return this._getActions(propertiesSchema, themeSchema);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        defaultData.date = (0, components_2.moment)().endOf('days').format(defaultDateTimeFormat);
                        await this.setData(Object.assign(Object.assign({}, defaultData), data));
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    getActions: () => {
                        const propertiesSchema = this.getPropertiesSchema();
                        const themeSchema = this.getThemeSchema(true);
                        return this._getActions(propertiesSchema, themeSchema);
                    },
                    getLinkParams: () => {
                        const data = this.data || {};
                        return {
                            data: window.btoa(JSON.stringify(data))
                        };
                    },
                    setLinkParams: async (params) => {
                        if (params.data) {
                            const utf8String = decodeURIComponent(params.data);
                            const decodedString = window.atob(utf8String);
                            const newData = JSON.parse(decodedString);
                            let resultingData = Object.assign(Object.assign({}, self.data), newData);
                            await this.setData(resultingData);
                        }
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        getPropertiesSchema() {
            const schema = {
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
            };
            return schema;
        }
        getThemeSchema(readOnly) {
            const themeSchema = {
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
            };
            return themeSchema;
        }
        _getActions(settingSchema, themeSchema) {
            const actions = [
                {
                    name: 'Settings',
                    icon: 'cog',
                    command: (builder, userInputData) => {
                        let oldData = { date: '' };
                        return {
                            execute: () => {
                                oldData = Object.assign({}, this.data);
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.date) !== undefined)
                                    this.data.date = userInputData.date;
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.name) !== undefined)
                                    this.data.name = userInputData.name;
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.showUTC) !== undefined)
                                    this.data.showUTC = userInputData.showUTC;
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.units) !== undefined)
                                    this.data.units = userInputData.units;
                                this.refreshPage();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.data);
                                this.height = 'auto';
                            },
                            undo: () => {
                                this.data = Object.assign({}, oldData);
                                this.refreshPage();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.data);
                                this.height = 'auto';
                            },
                            redo: () => { },
                        };
                    },
                    userInputDataSchema: settingSchema,
                },
                {
                    name: 'Theme Settings',
                    icon: 'palette',
                    command: (builder, userInputData) => {
                        let oldTag = {};
                        return {
                            execute: async () => {
                                if (!userInputData)
                                    return;
                                oldTag = JSON.parse(JSON.stringify(this.tag));
                                if (builder)
                                    builder.setTag(userInputData);
                                else
                                    this.setTag(userInputData);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(userInputData);
                            },
                            undo: () => {
                                if (!userInputData)
                                    return;
                                this.tag = JSON.parse(JSON.stringify(oldTag));
                                if (builder)
                                    builder.setTag(this.tag);
                                else
                                    this.setTag(this.tag);
                                if (this.dappContainer)
                                    this.dappContainer.setTag(this.tag);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: themeSchema
                }
            ];
            return actions;
        }
        render() {
            return (this.$render("i-scom-dapp-container", { id: "dappContainer" },
                this.$render("i-vstack", { verticalAlignment: 'center', horizontalAlignment: 'center', class: 'text-center', padding: { left: '1rem', right: '1rem', top: '1.5rem', bottom: '1.5rem' }, background: { color: Theme.background.main } },
                    this.$render("i-label", { id: 'lbName', font: { size: '2rem', bold: true, color: Theme.text.primary }, width: '100%', margin: { bottom: '1rem' } }),
                    this.$render("i-label", { id: 'lbUTC', visible: false, width: '100%', font: { color: Theme.text.primary } }),
                    this.$render("i-hstack", { id: 'pnlCounter', gap: '3rem', margin: { top: '1rem' }, horizontalAlignment: 'center', verticalAlignment: 'center' }))));
        }
    };
    ScomCountDown = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-countdown')
    ], ScomCountDown);
    exports.default = ScomCountDown;
});
