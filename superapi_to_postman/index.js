const OpenAPIConverter = require("openapi-to-postmanv2");
const fs = require("node:fs");

function recursivelyUpdateApiKeyVars(itemWithMaybeChildren, summaries) {
  if (
    Array.isArray(itemWithMaybeChildren.item) &&
    itemWithMaybeChildren.item.length > 0
  ) {
    for (const item of itemWithMaybeChildren.item) {
      recursivelyUpdateApiKeyVars(item, summaries);
    }
  }

  const authLevel = summaries[itemWithMaybeChildren.name];
  if (!authLevel) {
    return;
  }
  const authSet = new Set(authLevel);
  if (authSet.has("product_authorization")) {
    itemWithMaybeChildren.request.auth.apikey[1].value = "{{productApiKey}}";
    return;
  }
  if (authSet.has("partner_authorization")) {
    itemWithMaybeChildren.request.auth.apikey[1].value = "{{partnerApiKey}}";
    return;
  }
}

(async () => {
  // const endpoint = process.env.SUPERAPI_ENDPOINT;
  const endpoint = "http://localhost:4000/api/openapi";

  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  const schemaAsString = JSON.stringify(json);

  fs.writeFileSync("super_api_openapi.json", schemaAsString);

  const postmanCollection = await new Promise((resolve, reject) => {
    OpenAPIConverter.convert(
      { type: "string", data: schemaAsString },
      {},
      (err, conversionResult) => {
        if (err) return reject(err);

        if (!conversionResult.result) {
          return reject(conversionResult.reason);
        }

        return resolve(conversionResult.output[0].data);
      },
    );
  });

  const summariesWithSecurity = Object.entries(json.paths).flatMap(
    ([_, methods]) =>
      Object.values(methods).map((method) => {
        if (!method.security) return [];

        return {
          security: method.security.flatMap((sec) => Object.keys(sec)),
          summary: method.summary,
        };
      }),
  );

  recursivelyUpdateApiKeyVars(
    postmanCollection.item[1],
    Object.fromEntries(
      summariesWithSecurity.map((s) => [s.summary, s.security]),
    ),
  );
})();
