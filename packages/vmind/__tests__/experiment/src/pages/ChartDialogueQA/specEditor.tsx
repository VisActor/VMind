import React, { useState, useRef } from 'react';
import type { Monaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';

interface JSONError {
  line: number;
  message: string;
}

export const JSONEditor = (props: { spec: string; setSpec: (newSpec: string) => void }) => {
  const { spec, setSpec } = props;

  const [errors, setErrors] = useState<JSONError[]>([]);
  const editorRef = useRef<any>(null);

  // 配置 JSON 语言特性
  const configureJSON = (monaco: Monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemaValidation: 'error',
      enableSchemaRequest: true,
      schemas: [
        {
          uri: 'http://example.com/schema.json', // 自定义 schema 的 URI
          fileMatch: ['*'], // 应用到所有 JSON 文件
          schema: {
            type: 'object',
            properties: {
              example: {
                $ref: '#/definitions/Example'
              }
            },
            definitions: {
              Example: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  features: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  version: { type: 'number' }
                },
                required: ['name', 'features']
              }
            }
          }
        }
      ]
    });
  };

  // 处理内容变化
  const handleChange = (value?: string) => {
    setSpec(value || '');
  };

  // 自动格式化
  const autoFormat = () => {
    editorRef.current?.getAction('editor.action.formatDocument').run();
  };

  // 验证错误处理
  const handleValidate = (markers: any[]) => {
    setErrors(
      markers.map(marker => ({
        line: marker.startLineNumber,
        message: `${marker.message} [${marker.code}]`
      }))
    );
  };

  return (
    <div className="editor-container">
      <Editor
        height="95%"
        language="json"
        theme="vs-light"
        value={spec}
        options={{
          minimap: { enabled: false },
          autoClosingBrackets: 'always',
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false
        }}
        beforeMount={configureJSON}
        onMount={editor => {
          editorRef.current = editor;
        }}
        onChange={handleChange}
        onValidate={handleValidate}
      />

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: '#ffe6e6',
            borderRadius: 4,
            maxHeight: 200,
            overflowY: 'auto'
          }}
        >
          {errors.map((error, index) => (
            <div key={index} style={{ color: '#cc0000', fontSize: 14 }}>
              [行 {error.line}] {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
