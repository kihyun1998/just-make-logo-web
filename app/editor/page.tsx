import { Header } from "@/components/layout/header";
import { EditorView } from "@/views/editor";

export default function EditorPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <EditorView />
    </div>
  );
}
