import { Header } from "@/components/layout/header";
import { EditorView } from "@/views/editor";

export default function EditorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EditorView />
    </div>
  );
}
