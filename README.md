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

New Callbacks API **simplifies working with events** like: **user blocks, user allows, user was subscribed before** and etc.

Currently we have 5 functions or handlers of different events or states. To change default behaviour just rewrite needed function.

```javascript
var callbackProvider = {
    onUnsupported: function() {
        console.log('onUnsupported');
    },
    onSubscribe: function() {
        console.log('onSubscribe');
    },
    onSubscribed: function() {
        console.log('onSubscribed');
    },
    onDefault: function() {
        console.log('onDefault');
    },
    onDenied: function() {
        console.log('onDenied');
    },
    onInit: function(getPermission) {
        document.querySelector('body').addEventListener('click', function() {
            getPermission();
        });
        setTimeout(function() {
            getPermission();
        }, settingsProvider.requestDelay);
    }
};
```

- **onUnsupported** is invoked if user's browser doesn't support serviceWorker;
- **onSubscribe** is invoked when user allows;
- **onSubscribed** is invoked if user **was subscibed previously**;
- **onDefault** is invoked on initial loading to overcome browser behavior when it doesnt show request popup after JS-redirect;
- **onDenied** is invoked when user blocks;

This **documentation is in progress** and will be expanded with usecases of this callbacks to show some tipical stuff like show button if user blocks, or redirect if user allows.

## Event handlers

### Click handler

To add click handler to some html element you need class/id of this element.

for example image with class 'click-me':

```html
<img src="picture.png" class="click-me">
```

to add click handler you need to paste this code:

```javascrip
document.querySelector('.click-me').addEventListener('click', function(e) {
    //do some stuff
    console.log('clicked');
    
    // if element is link
    e.preventDefault();
});
```
