import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { java } from '@codemirror/lang-java'
import { json } from '@codemirror/lang-json'
import { Compartment, EditorState, Extension } from '@codemirror/state'
import { basicSetup, EditorView } from 'codemirror'
import { Converter, getLibVersion, OpenApiDoc } from 'openapi-to-java'

import { sample } from '@app/sample'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.sass',
  imports: [CommonModule, FormsModule],
})
export class AppComponent implements AfterViewInit {
  cmSrcEditor!: EditorView
  cmDestEditor!: EditorView
  inputSuccess = ''
  inputError = ''
  libVersion = getLibVersion()

  @ViewChild('src', { static: false }) src: any
  @ViewChild('dest', { static: false }) dest: any

  ngAfterViewInit(): void {
    this.cmSrcEditor = this._createCmEditor(this.src.nativeElement, json())
    this.cmDestEditor = this._createCmEditor(this.dest.nativeElement, java(), true)

    this._setCmEditorText(this.cmSrcEditor, this._stringifyJson(sample.doc1))
    this._setCmEditorText(this.cmDestEditor, this._convert(sample.doc1))
  }

  convert(): void {
    this._clearMessages()
    const src = this._getObject(this.cmSrcEditor)
    if (src instanceof Error) {
      this.inputError = src.message
      return
    }

    const conv = new Converter(src)
    const result = conv.convert()

    this.inputSuccess = 'Success'
    this._setCmEditorText(this.cmDestEditor, result)
  }

  private _createCmEditor(nativeElement: any, lang: Extension, isReadonly = false): EditorView {
    const extensions = [basicSetup, lang]
    if (isReadonly) {
      const readonly = new Compartment().of(EditorState.readOnly.of(true))
      extensions.push(readonly)
    }
    return new EditorView({
      parent: nativeElement,
      state: EditorState.create({
        extensions,
      }),
    })
  }

  private _setCmEditorText(cmEditor: EditorView, text: string): void {
    cmEditor.dispatch({
      changes: {
        from: 0,
        to: cmEditor.state.doc.length,
        insert: text,
      },
    })
  }

  private _convert(src: OpenApiDoc): string {
    const conv = new Converter(src)
    return conv.convert()
  }

  private _getObject(cmEditor: EditorView): OpenApiDoc | Error {
    const json = cmEditor.state.doc.toString()
    try {
      const result = JSON.parse(json)
      return result
    } catch (err) {
      return <Error>err
    }
  }

  private _stringifyJson(obj: OpenApiDoc): string {
    return JSON.stringify(obj, null, ' ')
  }

  private _clearMessages(): void {
    this.inputSuccess = ''
    this.inputError = ''
  }
}
