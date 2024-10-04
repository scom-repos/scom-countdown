/// <amd-module name="@scom/scom-countdown/index.css.ts" />
declare module "@scom/scom-countdown/index.css.ts" {
    export const textCenterStyle: string;
    export const valueFontStyle: string;
    export const unitFontStyle: string;
}
/// <amd-module name="@scom/scom-countdown/formSchema.json.ts" />
declare module "@scom/scom-countdown/formSchema.json.ts" {
    export const unitOptions: string[];
    const _default: {
        dataSchema: {
            type: string;
            properties: {
                targetTime: {
                    type: string;
                    title: string;
                    tooltip: string;
                    required: boolean;
                };
                name: {
                    type: string;
                };
                showUTC: {
                    title: string;
                    default: boolean;
                    type: string;
                };
                units: {
                    type: string;
                    enum: string[];
                };
                dark: {
                    type: string;
                    properties: {
                        backgroundColor: {
                            type: string;
                            format: string;
                        };
                        fontColor: {
                            type: string;
                            format: string;
                        };
                    };
                };
                light: {
                    type: string;
                    properties: {
                        backgroundColor: {
                            type: string;
                            format: string;
                        };
                        fontColor: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
        };
        uiSchema: {
            type: string;
            elements: ({
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        scope: string;
                    }[];
                }[];
            } | {
                type: string;
                label: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        label: string;
                        scope: string;
                    }[];
                }[];
            })[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-countdown/data.json.ts" />
declare module "@scom/scom-countdown/data.json.ts" {
    const _default_1: {
        defaultBuilderData: {
            name: string;
            showUTC: boolean;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-countdown/model.ts" />
declare module "@scom/scom-countdown/model.ts" {
    import { Module } from '@ijstech/components';
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
        private module;
        private options;
        private _data;
        constructor(module: Module, options: IModelOptions);
        get name(): string;
        get targetTime(): number;
        get showUTC(): boolean;
        get units(): string;
        get unitArray(): string[];
        get showHeader(): boolean;
        get showFooter(): boolean;
        getConfigurators(): ({
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
                userInputDataSchema: {
                    type: string;
                    properties: {
                        targetTime: {
                            type: string;
                            title: string;
                            tooltip: string;
                            required: boolean;
                        };
                        name: {
                            type: string;
                        };
                        showUTC: {
                            title: string;
                            default: boolean;
                            type: string;
                        };
                        units: {
                            type: string;
                            enum: string[];
                        };
                        dark: {
                            type: string;
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                        light: {
                            type: string;
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    } | {
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                label: string;
                                scope: string;
                            }[];
                        }[];
                    })[];
                };
            }[];
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        } | {
            name: string;
            target: string;
            getActions: (category?: string) => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                userInputDataSchema: {
                    type: string;
                    properties: {
                        targetTime: {
                            type: string;
                            title: string;
                            tooltip: string;
                            required: boolean;
                        };
                        name: {
                            type: string;
                        };
                        showUTC: {
                            title: string;
                            default: boolean;
                            type: string;
                        };
                        units: {
                            type: string;
                            enum: string[];
                        };
                        dark: {
                            type: string;
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                        light: {
                            type: string;
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    } | {
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                label: string;
                                scope: string;
                            }[];
                        }[];
                    })[];
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
        })[];
        getData(): ICountDownData;
        setData(value: ICountDownData): Promise<void>;
        getTag(): any;
        setTag(value: any, init?: boolean): void;
        private updateTag;
        private updateStyle;
        private updateTheme;
        private _getActions;
        getValue(unit: string, duration: any): number;
    }
}
/// <amd-module name="@scom/scom-countdown" />
declare module "@scom/scom-countdown" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import "@scom/scom-countdown/index.css.ts";
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
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-countdown']: ScomCountDownElement;
            }
        }
    }
    export default class ScomCountDown extends Module {
        private model;
        private pnlCounter;
        private lbName;
        private lbUTC;
        private dappContainer;
        private timer;
        tag: any;
        defaultEdit?: boolean;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCountDownElement, parent?: Container): Promise<ScomCountDown>;
        get name(): string;
        get targetTime(): number;
        get showUTC(): boolean;
        get unitArray(): string[];
        get units(): string;
        get showFooter(): boolean;
        get showHeader(): boolean;
        getData(): import("@scom/scom-countdown/model.ts").ICountDownData;
        setData(value: IData): Promise<void>;
        getTag(): any;
        setTag(value: any, init?: boolean): Promise<void>;
        getConfigurators(): ({
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
                userInputDataSchema: {
                    type: string;
                    properties: {
                        targetTime: {
                            type: string;
                            title: string;
                            tooltip: string;
                            required: boolean;
                        };
                        name: {
                            type: string;
                        };
                        showUTC: {
                            title: string;
                            default: boolean;
                            type: string;
                        };
                        units: {
                            type: string;
                            enum: string[];
                        };
                        dark: {
                            type: string;
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                        light: {
                            type: string;
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    } | {
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                label: string;
                                scope: string;
                            }[];
                        }[];
                    })[];
                };
            }[];
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        } | {
            name: string;
            target: string;
            getActions: (category?: string) => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                userInputDataSchema: {
                    type: string;
                    properties: {
                        targetTime: {
                            type: string;
                            title: string;
                            tooltip: string;
                            required: boolean;
                        };
                        name: {
                            type: string;
                        };
                        showUTC: {
                            title: string;
                            default: boolean;
                            type: string;
                        };
                        units: {
                            type: string;
                            enum: string[];
                        };
                        dark: {
                            type: string;
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                        light: {
                            type: string;
                            properties: {
                                backgroundColor: {
                                    type: string;
                                    format: string;
                                };
                                fontColor: {
                                    type: string;
                                    format: string;
                                };
                            };
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: ({
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    } | {
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                label: string;
                                scope: string;
                            }[];
                        }[];
                    })[];
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
        })[];
        private setContaiterTag;
        private refreshDappContainer;
        private refreshPage;
        private renderCountItem;
        private clearCountdown;
        private renderUI;
        private updateTimerUI;
        private initModel;
        init(): void;
        render(): any;
    }
}
