# SuperAPI Documentation

The following repo contains the documentation for our SuperAPI product. These docs can be found online at https://docs.superapi.com.au

## How we write documentation

When writing documentation we follow the thinking from the [Diátaxis system of documentation writing](https://diataxis.fr/). In their words, a "systematic approach to technical documentation authoring". In reality, this manifests as organising the sub pages under each of our products into "Tutorials", "How to guides", "Explanations", and "References". Writing documentation in the style of Diátaxis is very much an ongoing ideal that we strive towards but don't impose as a strict rule. In other words, it's better to have _some_ documentation in place rather than _no_ documentation because it doesn't conform to how we like it.

## Contributing to our documentation

We welcome any of our software partners to raise issues, suggestions, or ideas against this site. You are the consumers of this documentation and as such, are in a unique position to tell us what is working and what isn't. By doing so we can then improve the documentation for you and everybody else that's consuming it.

## Contributing

If you would like to contribute directly to the docs, awesome! It could be anything from fixing a spelling mistake through to adding a new guide or tutorial. To make changes we suggest:

1. Fork the repository in GitHub
2. Clone your forked copy to your local machine
3. Run the app on your local machine so you can see your changes (see the instructions below for how to do this)
4. When you're happy with your changes, push them to your forked repo
5. Create a pull request into our repo from your forked repo so we can review the changes.

## Getting things running locally

We've tried to simplify the process as much as possible to run this locally. At a minimum, you will need to ensure that you have the following installed:

- Docker
- Docker Compose
- NodeJS 18

```bash
make install
```

Then to start the server

```bash
make start
```

Instructions on how to connect to the server will be displayed in the console. Any edits you make to the site when running locally will be reflected in real time in the browser.
