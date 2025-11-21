# Product keys and partner keys

SuperAPI features two kinds of API keys to perform actions within the system; it can be a bit confusing to wrap your head around why this is, what the difference is between both the keys, and when you should use them. This explanation guide is designed to help give you an understanding of how these keys work in conjunction with each other.

## What are partners and products?

In SuperAPI, a product is the entity that represents your software product. For example, if your product is called SuperHR and integrates into SuperAPI, the product entity in SuperAPI would be called "SuperHR". On the product entity we store data about how to communicate with your product (i.e. webhook destinations) and various other configuration needed to ensure seamless interactions between the two pieces of software. This product entity is also issued an API key.

### Product API keys

Most of the interactions between your software product and SuperAPI will use this product API key we talked about above. Creating an onboarding session with an employee's details then showing them the embed uses the product API key. For some software partners, all the interactions they might do with SuperAPI will be done using just the product key we have issued them.

Now, not all software is built the same way; depending on how your software product is configured, you may need to _dynamically_ configure your products. A common scenario where this might come up is if you dynamically configure a vanity subdomain for each employer in your system. Or, instead of having a multi-tenanted system, you might run individual instances of your software product. When this situation arises, you'll need to use a partner key to configure the system.

## Partners and partner keys

A partner in SuperAPI represents the business entity that owns a number of products. As mentioned earlier, we quite often just have one partner with a single product belonging to them (or perhaps a production and development product so that developers can work against a product that is in a sandbox)

::: info
Products in a sandbox state do not communicate with external services like the Stapling API or with our direct fund integrations. All products are created in the sandbox state. When you're ready to go live, get in touch with us and we can take your product out of the sandbox.
:::

Now back to our original problem - how do we work with software which requires dynamic configuration? This is where the partner API key comes into play. In short, we can use our partner API key to dynamically provision new products on the fly (you can find out more in our [how-to on dynamically creating a product](/software_partners/how_to_guides/dynamically_create_products/index.html)). As products can be dynamically generated as required, this solves our problem with the need to dynamically configure partner software products.

## In summary

You can think of the product API key as the key used by your software product to do the day-to-day work with SuperAPI. Meanwhile, the partner API key allows you to configure the way SuperAPI itself works. Currently, we only support the dynamic creation of products using the partner key, but we have plans to expand the functionality further in the future.
