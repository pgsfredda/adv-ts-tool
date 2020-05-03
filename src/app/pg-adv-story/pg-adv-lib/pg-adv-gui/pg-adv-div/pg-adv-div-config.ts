export class pgAdvDIVConfig {
    copyDIVClasses?        : string;
    loaderDIVClasses?      : string;
    loaderDIVContent?      : string;
    storyDIVClasses?       : string;
    headerDIVClasses?      : string;
    headerDIVLine1Classes? : string;
    headerDIVLine2Classes? : string;
    headerDIVTitleClasses? : string;
    headerDIVScorerClasses?: string;
    headerDIVInfosClasses? : string;
    bodyDIVClasses?        : string;
    bodyDIVHeight?         : string;
    footerDIVClasses?      : string;
    advLinkClasses?        : string;
    inputRowClasses?       : string;
    inputRowPrompt?        : string;
    inputLabelClasses?     : string;
    inputClasses?          : string;
    inputDIVClasses?       : string;
    inputPlaceholder?      : string;
    errorMessage           : string;
    errorClasses           : string;

    constructor(config?: pgAdvDIVConfig) {
        if(config) Object.assign(this, config);
    }
}