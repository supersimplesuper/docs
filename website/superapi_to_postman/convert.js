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
  if (authLevel === "product_authorization") {
    itemWithMaybeChildren.request.auth.apikey[1].value = "{{productApiKey}}";
    return;
  }
  if (authLevel === "partner_authorization") {
    itemWithMaybeChildren.request.auth.apikey[1].value = "{{partnerApiKey}}";
    return;
  }
}

(async () => {
  const endpoint = "https://api.superapi.com.au/api/openapi";

  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  const schemaAsString = JSON.stringify(json);

  const postmanCollection = await new Promise((resolve, reject) => {
    OpenAPIConverter.convert(
      { type: "json", data: schemaAsString },
      { collapseFolders: false, folderStrategy: "Tags" },
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

        // Controller action determines the authorization level
        const operationPath = method.operationId.split(".");
        const operation = operationPath[operationPath.length - 1];

        const securityEntries = Object.entries(method.security[0]);

        const security =
          securityEntries.length === 1
            ? securityEntries[0][0]
            : securityEntries.flatMap(([auth, operations]) => {
                return operations.find((op) => op === operation) ? [auth] : [];
              })[0];

        return [method.summary, security];
      }),
  );

  const securityLookup = Object.fromEntries(summariesWithSecurity);

  for (const item of postmanCollection.item) {
    recursivelyUpdateApiKeyVars(item, securityLookup);
  }

  postmanCollection.variable.push({
    type: "string",
    value: "Product API key",
    key: "productApiKey",
  });
  postmanCollection.variable.push({
    type: "string",
    value: "Partner API key",
    key: "partnerApiKey",
  });

  process.stdout.write(JSON.stringify(postmanCollection, null, 2));
})();
