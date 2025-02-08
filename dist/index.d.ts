type OpenApiDoc = Record<string, unknown>;
declare class Converter {
    private openApiDoc;
    constructor(openApiDoc: OpenApiDoc);
    convert(): string;
    private _convert;
    private _generateClass;
    private _generateField;
    private _jsToJavaType;
}

export { Converter };
