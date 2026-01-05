import { generate } from "@lofi/html";
import { parse } from "@lofi/language";
import React, { useState, useEffect } from "react";

export function LofiPreview({ source }) {
  const [html, setHtml] = useState("<div>Loading...</div>");
  const [error, setError] = useState(null);

  useEffect(() => {
    parse(source)
      .then((doc) => {
        setHtml(generate(doc));
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [source]);

  if (error) {
    return (
      <div style={{ color: "red", fontFamily: "monospace", whiteSpace: "pre" }}>
        {error}
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
