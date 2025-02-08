type OpenApiDoc = Record<string, unknown>;
declare function getLibVersion(): string;
declare class Converter {
    private openApiDoc;
    constructor(openApiDoc: OpenApiDoc);
    convert(): string;
    private _convert;
    private _generateClass;
    private _generateField;
    private _jsToJavaType;
}

export { Converter, type OpenApiDoc, getLibVersion };
