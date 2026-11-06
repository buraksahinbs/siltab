export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2.5 leading-none ${className}`}>
      <span className="serif text-[1.65rem] tracking-[0.14em]">SİLTAB</span>{" "}
      <span className="text-[0.5625rem] font-medium tracking-[0.34em] opacity-70">GROUP</span>
    </span>
  );
}
