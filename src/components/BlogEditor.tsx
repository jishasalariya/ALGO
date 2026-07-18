"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { 
  Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Link2, Image as ImageIcon, 
  Tv, Quote, Code, RotateCcw, RotateCw, AlignLeft 
} from "lucide-react";

type BlogEditorProps = {
  content: string;
  onChange: (html: string) => void;
};

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400 underline hover:text-blue-300 transition-colors",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg border border-white/10 my-6 mx-auto block",
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: "w-full aspect-video rounded-lg border border-white/10 my-6",
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[300px] p-6 text-white text-sm md:text-base leading-relaxed font-sans",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt("Enter YouTube video URL (or share link):");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);
    
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-zinc-950 font-sans">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-zinc-900/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("bold") ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("italic") ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("heading", { level: 3 }) ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("bulletList") ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("orderedList") ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("link") ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Add Link"
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="Insert Image URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addYoutubeVideo}
          className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="Insert YouTube Video"
        >
          <Tv className="w-4 h-4" />
        </button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("blockquote") ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive("codeBlock") ? "bg-white/10 text-white" : "text-gray-400"}`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <span className="w-px h-6 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Styling Helper */}
      <style jsx global>{`
        .prose h1 { @apply text-2xl md:text-3xl font-bold tracking-tight mb-4 mt-6 text-white; }
        .prose h2 { @apply text-xl md:text-2xl font-semibold tracking-tight mb-3 mt-5 text-white; }
        .prose h3 { @apply text-lg md:text-xl font-medium tracking-tight mb-2 mt-4 text-white; }
        .prose p { @apply mb-4 text-gray-300; }
        .prose ul { @apply list-disc pl-6 mb-4 text-gray-300; }
        .prose ol { @apply list-decimal pl-6 mb-4 text-gray-300; }
        .prose li { @apply mb-1; }
        .prose blockquote { @apply border-l-4 border-white/20 pl-4 italic text-gray-400 my-4; }
        .prose pre { @apply bg-zinc-900 p-4 rounded-lg overflow-x-auto my-4 border border-white/5 font-mono text-sm; }
        .prose code { @apply font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-sm text-red-400; }
      `}</style>
    </div>
  );
}
