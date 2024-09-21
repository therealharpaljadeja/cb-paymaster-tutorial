# Coinbase Paymaster Tutorial Frontend

[Video Demo](https://youtu.be/hvO0QB2tZhA)

## Usage

1. Install Dependencies

```sh
npm i
```

2. Provide the Paymaster URL

`src > app > page.tsx`

```js
capabilities: {
    paymasterService: {
    // Paymaster Proxy Node url goes here.
        url: "",
    },
},
```

3. Run

```sh
npm run dev
```
