import { RenderedLine } from "./manuscript.renderer";

// Pure presentational mapping from a rendered line's semantic type to its
// typography — the "this reads like a real manuscript" layer. Novel lines
// lean serif + indented; screenplay lines lean monospace + script-standard
// indentation.
export const ManuscriptLine = ({
  line,
}: {
  line: RenderedLine;
}): JSX.Element => {
  switch (line.type) {
    case "chapterHeading":
      return (
        <h3 className="mb-2 mt-6 text-center font-primary-black text-sm uppercase tracking-wide text-font-subtlest">
          {line.text}
        </h3>
      );
    case "sceneHeading":
      return (
        <p className="font-mono mb-2 mt-6 text-xs font-bold uppercase text-font">
          {line.text}
        </p>
      );
    case "prose":
      return (
        <p className="font-serif mb-3 text-[15px] leading-relaxed text-font first-line:pl-6">
          {line.text}
        </p>
      );
    case "action":
      return (
        <p className="font-mono mb-2 text-xs leading-relaxed text-font">
          {line.text}
        </p>
      );
    case "dialogueSpeaker":
      return (
        <p className="font-mono mt-3 text-center text-xs font-bold text-font">
          {line.text}
        </p>
      );
    case "parenthetical":
      return (
        <p className="font-mono text-center text-2xs italic text-font-subtlest">
          {line.text}
        </p>
      );
    case "dialogueLine":
      return (
        <p className="font-mono mx-auto mb-2 max-w-[70%] text-center text-xs leading-relaxed text-font">
          {line.text}
        </p>
      );
    case "separator":
      return <hr className="my-4 border-border" />;
    case "ghost":
      return (
        <p className="font-serif text-font-subtlest/60 mb-2 text-[13px] italic">
          {line.text}
        </p>
      );
  }
};
