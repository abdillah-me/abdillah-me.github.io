import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JsonLd } from "./json-ld";

describe("JsonLd", () => {
  it("renders a script tag with the serialized JSON", () => {
    const { container } = render(
      <JsonLd data={{ "@type": "WebSite", name: "Test" }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent!)).toEqual({
      "@type": "WebSite",
      name: "Test",
    });
  });
});
