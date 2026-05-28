const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  const rawPath = event.path || "/";
  const path = rawPath
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\/api/, "") || "/";

  if (path === "/" || path === "/health") {
    return json(200, {
      ok: true,
      runtime: "netlify-functions",
      service: "hermes-web-ui",
      note: "Frontend is deployed on Netlify. Full Hermes Agent APIs require the long-running Node server.",
    });
  }

  return json(501, {
    ok: false,
    error: "This Hermes Web UI API requires the full Node server runtime.",
    path: rawPath,
  });
};
