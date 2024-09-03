# Phenomenon Studio Icons to SVGsprite CLI
---
### Testing Coverage
![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

---

## Stack
- [Clack](https://www.clack.cc/) (for CLI styling)
- [Picocolors](https://github.com/alexeyraspopov/picocolors) (for colorizing terminal texts)
- [SVGSON](https://github.com/elrumordelaluz/svgson) (for converting SVG to JSON and vice versa)
- [SVGO](https://github.com/svg/svgo) (for SVG optimization)  

## Prerequisites
1. Vite + React + Typescript
2. Root of your project must have `public` folder
3. Exported SVGs should be in a separate folder inside `public` folder.
   1. For example: `public/exported-svgs`
4. Your project should have the `<Icon />` component with its separate folder 
   1. For example: `src/ui/Icon`

## Workflow
1. Make sure all [prerequisites](#prerequisites) are met.
2. Open the terminal in root of project
   1. For example: `/Users/John/Developer/pet-project/`
3. run the CLI
   1. NOTE: `NPM package in process of integration`
4. Follow instructions and/or fix validation errors appear in process
5. Wait while generation is finished
   1. `/public/sprite.svg` file will be generated
   2. `/src/components/Icon/types.ts` type would be extended.
6. 🎉 Voila!
   
---

## Technical Details

### SVG File namings
SVG Files should be named applicable to recognize the icon from others.

For example, the icon named `Email.svg` will be set is sprite `symbol` with id attribute like `id="icon-email_18"`

> The icon names should not repeat. It would lead to overwrite ot unexpected logic

### SVG ViewBox

Every SVG has to have the `viewBox` attribute. CLI takes the size from this attribute.
And this value is crucial in icon naming.

`Email.svg` + `viewBox="0 0 18 18"` = `<symbol id="icon-email_18">`

`Arrow Right.svg` + `viewBox="0 0 24 24"` = `<symbol id="icon-arrow-right_24">`

### CurrentColor

The CLI takes all `dark`-ish values to swap them to `currentColor`. CurrentColor is required for icon sprites to be able to change the icon required fill or stroke colors to parent or what was set in CSS for current icon

```svg
<symbol>
    <path fill="currentColor" {...}  />
    <g stroke="currentColor" {...} />
</symbol>
```

```css
.icon {
    color: red;
}
```

> Pay attention! Designers should create the icons with black in perfect scenario or dark values to replace them with `currentColor`.


The `fill` and `stroke` values are ignored inside
- gradients
- masks
- filters
  

### Types code generation

The CLI takes in account every icon and size of them.
If icon has several sizes, they should have same name, but with size postfix for not to overwrite

Typescript types are generated in terms of every available size option.

For every size the next type will be generated:

```ts
export type IconPropsWith[size-token]Size = {
    size: [size-token];
    ids: 'union' | 'of' | 'icons' | 'with' | 'this' | 'size'
}
```

If there are several sizes, the final type includes all sizes and all icon ids will look in such way:

```ts
export type IconProps = IconPropsWith[size-1]Size | IconPropsWith[size-2]Size
```

This way gives developers to select icon firstly and then select available sizes for it. And vice versa.

---

## Visual workflow

### project tree

- `/public`
  - `/<exported-svgs>`
- `/src`
  - `/components`
    - `Icon`
      - `types.ts`

### Sprite final appearance

```svg
<svg xmlns="http://www.w3.org/2000/svg">
    <defs>
    <symbol fill="none" viewBox="0 0 18 18" name="arrow-right" size="18" id="icon-arrow-right_18">
            <path fill="currentColor"
                d="M10.102 6.398a.562.562 0 1 1 .796-.796l3 3c.22.22.22.576 0 .796l-3 3a.563.563 0 0 1-.796-.796l2.04-2.04H4.875a.563.563 0 0 1 0-1.124h7.267z" />
        </symbol>
        <symbol fill="none" viewBox="0 0 18 18" name="arrowtop" size="18" id="icon-arrowtop_18">
            <path fill="currentColor"
                d="M7.994 6.513a.563.563 0 0 1 0-1.125h4.243c.31 0 .562.252.562.563v4.242a.562.562 0 1 1-1.125 0V7.31l-5.138 5.138a.562.562 0 1 1-.796-.795l5.139-5.139z" />
        </symbol>
        {...}
    </defs>
</svg>
```