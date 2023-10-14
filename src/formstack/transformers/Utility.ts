const jsObjectToHtmlFriendlyString = (obj: any): string =>
  `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`;

const Utility = {
  jsObjectToHtmlFriendlyString,
};

export { Utility };
