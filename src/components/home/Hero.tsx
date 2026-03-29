export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/assets/img1.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="px-10 py-4 text-primary-foreground">[Ember No 04]</div>
        <div className="px-8 py-3 text-primary-foreground">
          <a href="#">View Collections</a>
        </div>
      </div>
    </section>
  );
}


