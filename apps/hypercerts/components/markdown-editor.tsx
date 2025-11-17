import { useEffect, useRef } from "react";
import { OverType } from "overtype";
import { useTheme } from "next-themes";

const themes = {
  dark: {
    // Dark theme colors
    bgPrimary: "#25282c", // --background
    bgSecondary: "#373a3e", // --card
    text: "#fcfcfd", // --foreground
    h1: "#ebebec", // --primary
    h2: "#8b5cf6", // --chart-1
    h3: "#06d6a0", // --chart-2
    strong: "#ebebec", // --primary
    em: "#8b5cf6", // --chart-1
    link: "#ebebec", // --primary
    code: "#ebebec", // --primary
    codeBg: "#444649", // --muted
    blockquote: "#a1a1aa", // --muted-foreground
    hr: "rgba(255, 255, 255, 0.1)", // --border
    syntaxMarker: "rgba(161, 161, 170, 0.6)", // --muted-foreground with opacity
    cursor: "#ebebec", // --primary
    selection: "#444649", // --accent
  },
  light: {
    // Light theme colors
    bgPrimary: "#ffffff", // --background
    bgSecondary: "#ffffff", // --card
    text: "#25282c", // --foreground
    h1: "#373a3e", // --primary
    h2: "#dc2626", // --chart-1
    h3: "#0891b2", // --chart-2
    strong: "#373a3e", // --primary
    em: "#dc2626", // --chart-1
    link: "#373a3e", // --primary
    code: "#373a3e", // --primary
    codeBg: "#f8f9fa", // --muted
    blockquote: "#64748b", // --muted-foreground
    hr: "#e2e8f0", // --border
    syntaxMarker: "rgba(100, 116, 139, 0.6)", // --muted-foreground with opacity
    cursor: "#373a3e", // --primary
    selection: "#f8f9fa", // --accent
  },
};
export function MarkdownEditor({
  value,
  placeholder,
  height = 400,
  onChange,
  className,
}: {
  value: string;
  placeholder?: string;
  height?: number;
  onChange: (value: string) => void;
  className?: string;
}) {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<OverType.Instance>(null);

  useEffect(() => {
    const [instance] = OverType.init(ref.current, {
      placeholder,
      value,
      theme: {
        name: "shadcn-theme",
        colors: themes[theme === "dark" ? "dark" : "light"],
      },
      onChange,
      toolbar: true,
    });
    editorRef.current = instance;

    return () => editorRef.current?.destroy();
  }, [theme]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div className={className}>
      <div ref={ref} style={{ height: `${height}px` }} />
    </div>
  );
}
