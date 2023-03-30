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
            exports.setIPFSGatewayUrl(options.ipfsGatewayUrl);
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
define("@scom/scom-countdown/scconfig.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-countdown/scconfig.json.ts'/> 
    exports.default = {
        "name": "@scom-countdown/main",
        "version": "0.1.0",
        "env": "",
        "moduleDir": "src",
        "main": "@scom-countdown/main",
        "modules": {},
        "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/"
    };
});
define("@scom/scom-countdown", ["require", "exports", "@ijstech/components", "@scom/scom-countdown/store.ts", "@scom/scom-countdown/scconfig.json.ts", "@scom/scom-countdown/index.css.ts"], function (require, exports, components_2, store_1, scconfig_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    };
    const defaultDateFormat = 'DD/MM/YYYY';
    const defaultDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';
    const defaultUnits = ['days', 'hours', 'minutes', 'seconds'];
    const defaultTime = '23:59:59';
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
    ];
    let ScomCountDown = class ScomCountDown extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {
                date: '',
                time: ''
            };
            this.oldData = {
                date: '',
                time: ''
            };
            if (scconfig_json_1.default)
                store_1.setDataFromSCConfig(scconfig_json_1.default);
        }
        init() {
            this.isReadyCallbackQueued = true;
            super.init();
            const width = this.getAttribute('width', true);
            const height = this.getAttribute('height', true);
            this.setTag({ width: width ? this.width : 'auto', height: height ? this.height : 'auto' });
            this.data.name = this.getAttribute('name', true);
            this.data.showUTC = this.getAttribute('showUTC', true, false);
            this.data.date = this.getAttribute('date', true, components_2.moment().format(defaultDateFormat));
            this.data.time = this.getAttribute('time', true, defaultTime);
            this.data.units = this.getAttribute('units', true, defaultUnits);
            this.setData(this.data);
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
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
            var _a;
            return (_a = this.data.date) !== null && _a !== void 0 ? _a : '';
        }
        set date(value) {
            this.data.date = value;
        }
        get time() {
            var _a;
            return (_a = this.data.time) !== null && _a !== void 0 ? _a : '';
        }
        set time(value) {
            this.data.time = value;
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
        get units() {
            var _a, _b;
            if ((_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.units) === null || _b === void 0 ? void 0 : _b.length)
                return unitList.filter(unit => this.data.units.includes(unit.value));
            return [...unitList].filter(unit => defaultUnits.includes(unit.value));
        }
        set units(values) {
            this.data.units = (values === null || values === void 0 ? void 0 : values.length) ? values : defaultUnits;
        }
        getConfigSchema() {
            return configSchema;
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.oldData = this.data;
            this.data = value;
            !this.lbName.isConnected && await this.lbName.ready();
            !this.lbUTC.isConnected && await this.lbUTC.ready();
            if (this.lbName) {
                this.lbName.visible = !!this.data.name;
                this.lbName.caption = this.data.name;
            }
            if (this.lbUTC)
                this.lbUTC.visible = this.showUTC;
            this.renderUI();
            this.timer && clearInterval(this.timer);
            this.timer = setInterval(() => this.renderUI(), 1000);
        }
        renderCountItem(unit, value) {
            const itemEl = (this.$render("i-vstack", { verticalAlignment: "center", horizontalAlignment: "center" },
                this.$render("i-label", { caption: `${value < 10 ? '0' + value : value}`, font: { size: '7.688rem' } }),
                this.$render("i-label", { caption: unit.label, font: { size: '1.5rem' } })));
            return itemEl;
        }
        clearCountdown() {
            this.lbUTC.caption = '';
            this.pnlCounter.clearInnerHTML();
            for (let unit of this.units) {
                const value = this.getValue(unit.value, 0);
                const el = this.renderCountItem(unit, value);
                el && this.pnlCounter.appendChild(el);
            }
        }
        isTimeout(duration) {
            return duration <= 0;
        }
        getValue(unit, duration) {
            let value = 0;
            if (duration <= 0)
                return 0;
            switch (unit) {
                case 'seconds':
                    value = this.data.units.includes('minutes') ? duration.seconds() : Math.floor(duration.asSeconds());
                    break;
                case 'minutes':
                    value = this.data.units.includes('hours') ? duration.minutes() : Math.floor(duration.asMinutes());
                    break;
                case 'hours':
                    value = this.data.units.includes('days') ? duration.hours() : Math.floor(duration.asHours());
                    break;
                case 'days':
                    value = this.data.units.includes('weeks') ? duration.days() : Math.floor(duration.asDays());
                    break;
                case 'weeks':
                    value = this.data.units.includes('months') ? duration.weeks() : Math.floor(duration.asWeeks());
                    break;
                case 'months':
                    value = this.data.units.includes('years') ? duration.months() : Math.floor(duration.asMonths());
                    break;
                case 'years':
                    value = duration.years();
                    break;
            }
            return value;
        }
        renderUI() {
            const now = components_2.moment();
            const dateTime = `${this.data.date} ${this.data.time || '00:00:00'}`;
            let end = components_2.moment(dateTime);
            if (!end.isValid())
                end = components_2.moment(dateTime, defaultDateTimeFormat);
            if (end.isValid()) {
                this.lbUTC.caption = components_2.moment.utc(end.format('YYYY-MM-DD HH:mm:ss')).toString();
                const duration = components_2.moment.duration(end.diff(now));
                this.pnlCounter.clearInnerHTML();
                for (let unit of this.units) {
                    const value = this.getValue(unit.value, duration);
                    const el = this.renderCountItem(unit, value);
                    el && this.pnlCounter.appendChild(el);
                    if (this.isTimeout(duration)) {
                        this.timer && clearInterval(this.timer);
                        return;
                    }
                }
            }
            else {
                this.clearCountdown();
            }
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.tag = value;
            this.display = 'block';
            this.width = this.tag.width;
            this.height = this.tag.height;
        }
        getPropertiesSchema() {
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
            const propertiesSchema = this.getPropertiesSchema();
            const themeSchema = {
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
            };
            return this._getActions(propertiesSchema, themeSchema);
        }
        getActions() {
            const propertiesSchema = this.getPropertiesSchema();
            const themeSchema = {
                type: 'object',
                properties: {
                    width: {
                        type: 'string'
                    },
                    height: {
                        type: 'string'
                    }
                }
            };
            return this._getActions(propertiesSchema, themeSchema);
        }
        _getActions(settingSchema, themeSchema) {
            const actions = [
                {
                    name: 'Settings',
                    icon: 'cog',
                    command: (builder, userInputData) => {
                        return {
                            execute: () => {
                                if (userInputData.units) {
                                    const units = [...userInputData.units];
                                    userInputData.units = units.map(unit => unit.units);
                                }
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(userInputData);
                                this.setData(userInputData);
                            },
                            undo: () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.oldData);
                                this.setData(this.oldData);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: settingSchema
                }
            ];
            return actions;
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlWrap", verticalAlignment: "center", horizontalAlignment: "center", gap: "1rem", class: "text-center" },
                this.$render("i-label", { id: "lbName", font: { size: '2rem', bold: true }, width: "100%", margin: { bottom: '1rem' } }),
                this.$render("i-label", { id: "lbUTC", visible: false, width: "100%" }),
                this.$render("i-hstack", { id: "pnlCounter", gap: "3rem", margin: { top: '1rem' }, horizontalAlignment: "center", verticalAlignment: "center" })));
        }
    };
    ScomCountDown = __decorate([
        components_2.customModule,
        components_2.customElements('i-scom-countdown')
    ], ScomCountDown);
    exports.default = ScomCountDown;
});
