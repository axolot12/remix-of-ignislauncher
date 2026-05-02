interface Props {
  text: string;
}
export function AnimatedTitle({ text }: Props) {
  return (
    <h1 className="text-gradient-brand text-center font-black tracking-tight text-5xl sm:text-7xl md:text-8xl leading-none uppercase animate-float-up">
      {text}
    </h1>
  );
}
