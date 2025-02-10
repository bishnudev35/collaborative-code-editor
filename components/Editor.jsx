"use client";
import { useEffect, useRef } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { Card } from './ui/card';

export default function Editor() {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
``
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider('monaco-demo-room', ydoc);
    const type = ydoc.getText('monaco');
   
    const binding = new MonacoBinding(
      type,
      editorRef.current,
      new Set([editorRef.current]),
      provider.awareness
    );

    return () => {
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // monaco.languages.register({ id: 'cpp' });
    //
    // monaco.languages.cpp.cppDefaults.setEagerModelSync(true);

    monaco.editor.defineTheme('modern', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1b26',
        'editor.foreground': '#a9b1d6',
        'editor.lineHighlightBackground': '#1f202e',
        'editor.selectionBackground': '#515c7e',
        'editor.inactiveSelectionBackground': '#3b4261',
      },
    });

    monaco.editor.setTheme('modern');
  }

  return (
    <Card className="h-full rounded-none border-0">
      <MonacoEditor
        height="100%"
        defaultLanguage="typescript"
        defaultValue="// Start coding here..."
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          theme: 'modern',
        }}
        onMount={handleEditorDidMount}
      />
    </Card>
  );
}