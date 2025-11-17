import { MarkdownEditor } from "./markdown-editor";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "./ui/tabs";
import { Markdown } from "./markdown";

export function MarkdownEditorWithPreview({
  ...props
}: {
  value: string;
  placeholder?: string;
  height?: number;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className="rounded-lg border p-1">
      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <MarkdownEditor {...props}  />
        </TabsContent>
        <TabsContent value="preview">
          <Markdown>{props.value}</Markdown>
        </TabsContent>
      </Tabs>
    </div>
  );
}
