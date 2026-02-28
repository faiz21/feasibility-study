import { BrandLogo } from "./brand-logo";

export function Hero() {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex items-center justify-center">
        <BrandLogo size="hero" priority />
      </div>
      <h1 className="sr-only">Machine Vision Report Portal</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Machine Vision report experience powered by tokenized design and secure access control.
      </p>
      <div className="my-8 w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent p-[1px]" />
    </div>
  );
}
