export default function LoaderCopy({ text }: { text: string }) {
  return (
    <p className="text-base300 text-2xl text-foreground font-sans z-0">
      {text.split(" ").map((w, i) => (
        <span key={i} className="line inline-block">
          {w}&nbsp;
        </span>
      ))}
    </p>
  );
}
