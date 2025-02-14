(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.o2diff = {}));
})(this, (function (exports) { 'use strict';

    function padLine(line, level) {
        return ' '.repeat(level) + line;
    }
    const isNumber = (value) => {
        return typeof value === 'number';
    };
    const isBoolean = (value) => {
        return typeof value === 'boolean';
    };
    const isArray = (value) => {
        return Array.isArray(value);
    };
    const isPlainObject = (value) => {
        if (typeof value !== 'object' || value === null) {
            return false;
        }
        if (Object.prototype.toString.call(value) !== '[object Object]') {
            return false;
        }
        const proto = Object.getPrototypeOf(value);
        if (proto === null) {
            return true;
        }
        const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
        return (typeof Ctor === 'function' &&
            Ctor instanceof Ctor &&
            Function.prototype.call(Ctor) === Function.prototype.call(value));
    };
    const capitalize = (value) => {
        return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';
    };

    function getLibVersion() {
        return '0.0.1';
    }
    class Converter {
        openApiDoc;
        constructor(openApiDoc) {
            this.openApiDoc = openApiDoc;
        }
        convert() {
            return this._convert(this.openApiDoc, 'root', 0);
        }
        _convert(jsObj, jsObjName, level = 0) {
            const resultBuf = [...this._generateClass(capitalize(jsObjName), level)];
            const jsNestedObjs = [];
            Object.keys(jsObj).forEach(fieldName => {
                const jsFieldTypeOrNestedObj = jsObj[fieldName];
                let javaFieldType;
                if (isArray(jsFieldTypeOrNestedObj)) {
                    const jsArrayFirstItem = jsFieldTypeOrNestedObj[0];
                    if (isPlainObject(jsArrayFirstItem)) {
                        jsNestedObjs.push({
                            objName: fieldName,
                            obj: jsArrayFirstItem,
                        });
                        javaFieldType = `List<${capitalize(fieldName)}>`;
                    }
                    else {
                        javaFieldType = this._jsToJavaType(jsArrayFirstItem);
                        javaFieldType = `List<${capitalize(javaFieldType)}>`;
                    }
                }
                else if (isPlainObject(jsFieldTypeOrNestedObj)) {
                    javaFieldType = fieldName;
                    jsNestedObjs.push({
                        objName: fieldName,
                        obj: jsFieldTypeOrNestedObj,
                    });
                }
                else {
                    javaFieldType = this._jsToJavaType(jsFieldTypeOrNestedObj);
                }
                const generatedLoC = this._generateField(fieldName, javaFieldType, level);
                resultBuf.push(generatedLoC);
            });
            jsNestedObjs.forEach(({ objName, obj }) => {
                const generatedLoC = this._convert(obj, objName, level + 2);
                resultBuf.push('');
                resultBuf.push(generatedLoC);
            });
            resultBuf.push(padLine('}', level));
            return resultBuf.join('\n');
        }
        _generateClass(className, level) {
            return [padLine('@Data', level), padLine(`public class ${className} {`, level)];
        }
        _generateField(fieldName, fieldType, level) {
            return padLine(`${fieldType} ${fieldName};`, level + 2);
        }
        _jsToJavaType(jsType) {
            if (isNumber(jsType)) {
                return 'Integer';
            }
            if (isBoolean(jsType)) {
                return 'Boolean';
            }
            return 'String';
        }
    }

    exports.Converter = Converter;
    exports.getLibVersion = getLibVersion;

}));
