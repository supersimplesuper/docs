# Working with webhooks locally

Developing against a service like SuperAPI, which expects to send webhooks to a URL that is reachable on the internet, can be tricky. One way of solving this problem is to use a tunneling service like Ngrok to expose a local service on your machine to the internet.

::: Info
If you're not sure what your `webhook_url` is set to, you can retrieve your product settings using your [product API key](/software_partners/how_to_guides/verify_my_product_api_key/index.html).
:::

To configure Ngrok alongside our local services, we use the following entry in our `docker-compose.yml`

```yaml
ngrok:
  image: ngrok/ngrok:latest
  command:
    - "start"
    - "--all"
    - "--config"
    - "/etc/ngrok.yml"
    - "--authtoken"
    - ${NGROK_AUTH_TOKEN}
  volumes:
    - ./ngrok.yml:/etc/ngrok.yml
  ports:
    - 4040:4040
```

The contents of our `ngrok.yml` look like:

```yaml
version: 2

tunnels:
  superapi:
    proto: http
    addr: backend2:4000 # this points to your local service
    domain: REDACTED.ngrok.dev # your custom Ngrok domain name
```

You will need to have an `NGROK_AUTH_TOKEN` environment variable set in the shell which is executing the `docker-compose.yml`

::: info
Ngrok isn't the only tool available that does this, have a look at https://github.com/anderspitman/awesome-tunneling for a full list of services in this space.
:::
