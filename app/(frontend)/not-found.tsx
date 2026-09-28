import { Button } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="wrap error-page">
      <p className="eyebrow">404 / A MOMENTARY DETOUR</p>
      <h1>This one’s off the map.</h1>
      <p>The page may have moved. Let’s get you back to an experience.</p>
      <div className="related-links">
        <Button href="/">Home</Button>
        <Button href="/work" secondary>
          Work
        </Button>
        <Button href="/services" secondary>
          Services
        </Button>
        <Button href="/contact" secondary>
          Contact
        </Button>
      </div>
    </section>
  );
}
