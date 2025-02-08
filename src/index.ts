import { capitalize, isArray, isNumber, isPlainObject, padLine } from './utils'

export type OpenApiDoc = Record<string, unknown>

export function getLibVersion(): string {
  return '0.0.1'
}

export class Converter {
  constructor(private openApiDoc: OpenApiDoc) {}

  convert(): string {
    return this._convert(this.openApiDoc, 'root', 0)
  }

  private _convert(jsObj: OpenApiDoc, jsObjName: string, level = 0): string {
    const resultBuf: string[] = [...this._generateClass(capitalize(jsObjName), level)]

    // generate fields section
    const jsNestedObjs: { objName: string; obj: OpenApiDoc }[] = []
    Object.keys(jsObj).forEach(fieldName => {
      const jsFieldTypeOrNestedObj = jsObj[fieldName]
      let javaFieldType: string
      if (isArray(jsFieldTypeOrNestedObj)) {
        const jsArrayFirstItem = (jsFieldTypeOrNestedObj as Array<unknown>)[0]
        if (isPlainObject(jsArrayFirstItem)) {
          jsNestedObjs.push({
            objName: fieldName,
            obj: jsArrayFirstItem as OpenApiDoc,
          })
          javaFieldType = `List<${capitalize(fieldName)}>`
        } else {
          javaFieldType = this._jsToJavaType(jsArrayFirstItem as string)
          javaFieldType = `List<${capitalize(javaFieldType)}>`
        }
      } else if (isPlainObject(jsFieldTypeOrNestedObj)) {
        javaFieldType = fieldName
        jsNestedObjs.push({
          objName: fieldName,
          obj: jsFieldTypeOrNestedObj as OpenApiDoc,
        })
      } else {
        javaFieldType = this._jsToJavaType(jsFieldTypeOrNestedObj as string)
      }
      const generatedLoC = this._generateField(fieldName, javaFieldType, level)
      resultBuf.push(generatedLoC)
    })

    // generate nested classes
    jsNestedObjs.forEach(({ objName, obj }) => {
      const generatedLoC = this._convert(obj, objName, level + 2)
      resultBuf.push('')
      resultBuf.push(generatedLoC)
    })

    resultBuf.push(padLine('}', level))
    return resultBuf.join('\n')
  }

  private _generateClass(className: string, level: number): string[] {
    return [padLine('@Data', level), padLine(`public class ${className} {`, level)]
  }

  private _generateField(fieldName: string, fieldType: string, level: number): string {
    return padLine(`private ${fieldType} ${fieldName};`, level + 2)
  }

  private _jsToJavaType(jsType: string): string {
    if (isNumber(jsType)) {
      return 'Integer'
    }
    return 'String'
  }
}
