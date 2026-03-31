import { Header } from "@/components/layout/header";
import { AssetEditorView } from "@/views/asset-editor";

export default function AssetEditorPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <AssetEditorView />
    </div>
  );
}
