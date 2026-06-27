import { ArrowUpRight } from "@phosphor-icons/react";

export default function PartnersSection() {
  return (
    <section className="partners-section section-shell" id="partners">
      <div className="partner-card" data-reveal>
        <ArrowUpRight size={42} weight="duotone" />
        <div>
          <p className="kicker">Next collaboration</p>
          <h2>Looking for dream partners.</h2>
        </div>
        <p>
          如果你正在做一个需要技术、视觉、音乐和一点耐心的想法，可以来 CalmTown 坐坐。
        </p>
        <a className="button primary" href="mailto:hello@calmtown.example">
          Say hello
        </a>
      </div>
    </section>
  );
}
