/// <amd-module name="@scom/scom-countdown/interface.ts" />
declare module "@scom/scom-countdown/interface.ts" {
    import { IDataSchema } from "@ijstech/components";
    export interface ICommand {
        execute(): void;
        undo(): void;
        redo(): void;
    }
    export interface IPageBlockAction {
        name: string;
        icon: string;
        command: (builder: any, userInputData: any) => ICommand;
        userInputDataSchema: IDataSchema;
    }
    export interface PageBlock {
        getActions: () => IPageBlockAction[];
        getData: () => any;
        setData: (data: any) => Promise<void>;
        getTag: () => any;
        setTag: (tag: any) => Promise<void>;
        defaultEdit?: boolean;
        tag?: any;
        validate?: () => boolean;
        readonly onEdit: () => Promise<void>;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        edit: () => Promise<void>;
        confirm: () => Promise<void>;
        discard: () => Promise<void>;
    }
    export interface IData {
        date: string;
        name?: string;
        showUTC?: boolean;
        units?: string;
        showHeader?: boolean;
        showFooter?: boolean;
    }
}
/// <amd-module name="@scom/scom-countdown/store.ts" />
declare module "@scom/scom-countdown/store.ts" {
    export const state: {
        ipfsGatewayUrl: string;
    };
    export const setDataFromSCConfig: (options: any) => void;
    export const setIPFSGatewayUrl: (url: string) => void;
    export const getIPFSGatewayUrl: () => string;
}
/// <amd-module name="@scom/scom-countdown/index.css.ts" />
declare module "@scom/scom-countdown/index.css.ts" { }
/// <amd-module name="@scom/scom-countdown/scconfig.json.ts" />
declare module "@scom/scom-countdown/scconfig.json.ts" {
    const _default: {
        name: string;
        version: string;
        env: string;
        moduleDir: string;
        main: string;
        modules: {};
        dependencies: {
            "@scom/scom-dapp-container": string;
        };
        ipfsGatewayUrl: string;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-countdown" />
declare module "@scom/scom-countdown" {
    import { Module, IDataSchema, Container, ControlElement } from '@ijstech/components';
    import "@scom/scom-countdown/index.css.ts";
    interface ScomCountDownElement extends ControlElement {
        date?: string;
        name?: string;
        showUTC?: boolean;
        units?: string;
        showHeader?: boolean;
        showFooter?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-countdown']: ScomCountDownElement;
            }
        }
    }
    export default class ScomCountDown extends Module {
        private data;
        private oldData;
        private pnlCounter;
        private lbName;
        private lbUTC;
        private dappContainer;
        private timer;
        tag: any;
        private oldTag;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        readonly onEdit: () => Promise<void>;
        defaultEdit?: boolean;
        validate?: () => boolean;
        edit: () => Promise<void>;
        confirm: () => Promise<void>;
        discard: () => Promise<void>;
        constructor(parent?: Container, options?: any);
        init(): void;
        static create(options?: ScomCountDownElement, parent?: Container): Promise<ScomCountDown>;
        get name(): string;
        set name(value: string);
        get date(): string;
        set date(value: string);
        get showUTC(): boolean;
        set showUTC(value: boolean);
        get unitArray(): string[];
        get units(): string;
        set units(value: string);
        get showFooter(): boolean;
        set showFooter(value: boolean);
        get showHeader(): boolean;
        set showHeader(value: boolean);
        private getData;
        private setData;
        private renderCountItem;
        private clearCountdown;
        private getValue;
        private renderUI;
        private getTag;
        private updateTag;
        private setTag;
        private updateStyle;
        private updateTheme;
        private getPropertiesSchema;
        private _getActions;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                userInputDataSchema: IDataSchema;
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        render(): any;
    }
}
