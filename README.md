# New PushCentric frontend script

## list of changes

- fast redirects;
- simple callbacks API;
- simple settings API;
- fixed errors with notifies;
- logical improvements;

## Settings API
With new Settings API there is **no need to edit javaScript files anymore**. The only file that needs to be edited is **index.php**.
All settings are represented by keys in this object:

```javascript
settingsProvider = {
    domainName: "520:-bfd9pONVmb8hP87TzYO8xVlT78",
    domainURL: "de-geschenkstatus2.club",
    publicKey: "BJWjSY/hjMmTDlegmhTvH6PYsTbxkM+vPbuyHIQApVUpUZfV74pdZWYJ1qWOrMP0u1p9PScxCypZg0R+qp2ScsU=",
    requestDelay: 3000
};
```

There are 4 main settings. You can find **first three values in PC**, and last one is delay before request popup occurs.

## Callbacks API

