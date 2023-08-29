const unitOptions = ['days, hours, minutes, seconds', 'days, hours, minutes'];

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
}

export default {
    dataSchema: {
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
                                scope: '#/properties/date'
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
}