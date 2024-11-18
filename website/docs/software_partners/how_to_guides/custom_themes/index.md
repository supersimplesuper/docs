# Using custom themes

You can customise the look and feel of the SuperApi embeds to more closely match your existing product. This is accomplished by creating a custom CSS stylesheet that is loaded into the embed for your users. These stylesheets can be uploaded to SuperApi via its API.

Right now, this process is fairly basic, and has a few limitations. Namely, that each partner has a single custom theme, and that changes to that theme are reflected immediately for all users. Therefore, we encourage our software partners to adjust their custom themes with a non-production / development `Partner` account, and only once confident with the changes to apply them to their production account.

![CSS Injection for custom Styles.css](/superapi-embedded-css-styled.png "Custom CSS Styles")

## Our 'default' theme

Our default theme is designed around our Xonboard product. It's built around a large set of CSS variables that are used throughout the stylesheets, giving partners an easy way to customise the look and feel of the embeds.

### Sizing & Spacing

Spacing and sizing is based on a fluid scale, with a base font size of 16px. The scale is based on the `clamp` function, which allows for a minimum, maximum, and a fluid value in between. This fluid value is based on the viewport width. This allows our embed to look appropriate across a variety of sizes.

Examples of these values are:

```css
:root {
  /* Text Sizes */
  --step--2: clamp(0.5642rem, 0.5224rem + 0.209vw, 0.64rem);
  --step--1: clamp(0.6771rem, 0.6093rem + 0.3391vw, 0.8rem);
  --step-0: clamp(0.8125rem, 0.7091rem + 0.5172vw, 1rem);
  --step-1: clamp(0.975rem, 0.8233rem + 0.7586vw, 1.25rem);
  /* ... */

  /* Spacing */
  --space-3xs: clamp(0.1875rem, 0.153rem + 0.1724vw, 0.25rem);
  --space-2xs: clamp(0.4375rem, 0.403rem + 0.1724vw, 0.5rem);
  --space-xs: clamp(0.625rem, 0.556rem + 0.3448vw, 0.75rem);
  --space-s: clamp(0.8125rem, 0.7091rem + 0.5172vw, 1rem);
  --space-m: clamp(1.25rem, 1.1121rem + 0.6897vw, 1.5rem);
  /* ... */
}
```

### CSS Variables

We use these CSS variables to apply styles across all of our embeds. They define the colours, typography, and spacing of the embed.

Here is a list of the variables that are used in the default theme:

```css
:root {
  --color-primary: var(--color-darkBlue);
  --color-primary-shade: color-mix(in srgb, var(--color-primary), black 8%);
  --color-primary-glare: color-mix(in srgb, var(--color-primary), white 8%);

  --color-secondary: var(--color-lightBlue);
  --color-secondary-shade: color-mix(in srgb, var(--color-secondary), black 8%);
  --color-secondary-glare: color-mix(
    in srgb,
    var(--color-secondary),
    white 20%
  );

  --leading: 1.5;
  --leading-short: 1.3;
  --leading-fine: 1.1;
  --leading-flat: 1;
  --leading-loose: 1.7;

  --kerning: normal;
  --kerning-tight: -0.04ch;
  --kerning-loose: 0.1ch;

  --text-size-base: var(--step-0);
  --text-size-lede: var(--step-1);
  --text-size-meta: var(--step--1);
  --text-size-heading-1: var(--step-4);
  --text-size-heading-2: var(--step-3);
  --text-size-heading-3: var(--step-2);
  --text-size-heading-4: var(--step-1);
  --text-size-prose: var(--text-size-base);

  --space-gutter: var(--space-m);
  --space-gutter-s: var(--space-s);
  --space-gutter-l: var(--space-l);
  --space-regions: var(--space-xl);
  --size-wrapper-max-width: 1135px;

  --color-global-bg: transparent;
  --color-global-text: var(--color-charcoalBlue);
  --color-global-header: var(--color-blueGrey);
  --color-surface-bg: var(--color-secondary);
  --color-surface-bg-interact: var(--color-secondary-glare);
  --color-surface-text: var(--color-darkBlue);
  --color-surface-text-interact: var(--color-blueGrey-glare);

  --color-recessed: var(--color-mid);

  --font-base: "Roboto Flex", -apple-system, BlinkMacSystemFont, avenir next,
    avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto,
    arial, sans-serif;
  --font-display: var(--font-base);
  --font-lede: var(--font-base);
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 600;
  --font-weight-black: 600;

  --focus-ring: 2px solid currentColor;
  --focus-ring-offset: 2px;

  --border-radius-m: 0.5rem;
  --border-radius-s: 0.25rem;
}
```

## Creating a custom theme

Copy our CSS variables into a new CSS file. Using your current design as a guide, start modifying these variables to match. Commonly, this will include things like primary / secondary colors, border radius, typography settings (i.e. kerning / leading / weight), and fonts.

Here is an example of a custom theme:

```css
:root {
  @import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap");

  --font-base: "Nunito Sans", sans-serif;
  --color-primary: #fdaf17;
  --color-primary-shade: color-mix(in srgb, var(--color-primary), black 5%);
  --color-primary-glare: color-mix(in srgb, var(--color-primary), white 10%);

  --color-secondary: #fdaf17;
  --color-secondary-shade: color-mix(in srgb, var(--color-secondary), black 3%);
  --color-secondary-glare: color-mix(
    in srgb,
    var(--color-secondary),
    white 10%
  );

  --color-global-text: #c1192a;
  --color-surface-text: #c1192a;
  --color-global-header: #c1192a;

  --color-global-bg: #fdaf17;
  --color-surface-bg: var(--color-secondary);
  --color-surface-bg-interact: var(--color-secondary-shade);

  --color-recessed: #fdaf17;

  --button-color: #c1192a;

  --border-radius-m: 4px;
  --border-radius-s: 2px;
}
```

::: tip
Don't use this theme
:::

## Uploading a custom theme

To upload your custom theme, make sure you have a Partner API key. Once you're ready, make a post request like so:

```bash
curl -X POST https://api.superapi.com.au/api/v1/partner/custom-css/upload \
    -H "Content-Type: multipart/form-data" \
    -H "x-api-key: superapipartner_partnerKeySgWz2GMFPReIWcJChQZS05aq" \
    -F "file=@./example.css"
```

This will upload your theme. The next time you load an embed for that partner, it will use your custom theme.

To change your theme, simply upload a new theme file and it will override the existing one.

::: tip
To remove the theme, simply upload a blank file.
:::

## Advanced customisation

You can apply more advanced customisations to the embeds by creating rules that target specific 'blocks' within the embed. For example, if you wanted to change all buttons to use uppercase text, you could add the following CSS rule:

```css
.button {
  text-transform: uppercase;
}
```

However, we strongly encourage you to limit these more advanced customisations, and to keep these as generic as possible. By that, we mean applying styles to the 'button' class will be much more stable that applying styles to a specific button or selector.

We strong recommend the first example here over the second:

```css
.button {
  font-weight: var(--font-weight-bold, 700);
}

.fund_block_non_partner .card .button {
  font-weight: var(--font-weight-bold, 700);
}
```

We will continue to refine and improve our embeds, and while we will endeavour to maintian backwards compatibility, we cannot guarantee that advanced customisations will not break in the future.
