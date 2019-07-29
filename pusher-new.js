/*******************************
 * Variables initialisation
 ********************************/
var domainName = "520:-bfd9pONVmb8hP87TzYO8xVlT78",
    domainURL = "de-geschenkstatus2.club",
    offerURL = "https://difice-milton.com/click",
    nextPageURL = "https://de-geschenkstatus3.club",
    requestDelay = 1000;
var publicKey =
    "BJWjSY/hjMmTDlegmhTvH6PYsTbxkM+vPbuyHIQApVUpUZfV74pdZWYJ1qWOrMP0u1p9PScxCypZg0R+qp2ScsU=";

/*******************************
 * Utilities 
 ********************************/
var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),
    serviceWorkerSupport = navigator.serviceWorker;

/*******************************
 * API enter point
 ********************************/
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
    }
};


! function() {

    run();

    /*******************************
     * Main functions
     ********************************/
    function run() {
        /* checks if browser support serviceWorker */
        if (isSafari || !serviceWorkerSupport) {
            return notifyRequest({
                domain: domainName,
                event: "subscriptionDenied",
                reason: "unsupported"
            }, callbackProvider.onUnsupported);
        }

        navigator.serviceWorker.register("/service-worker.js")
            .then(function(registration) {
                if (Notification.permission === 'denied') {
                    notifyRequest({
                        domain: domainName,
                        event: "subscriptionDenied",
                        reason: "denied"
                    }, callbackProvider.onDenied());
                }

                if (Notification.permission === 'granted') {
                    registration.pushManager.getSubscription().
                    then(function(subscription) {
                            if (subscription) {
                                sendSubscription(subscription.toJSON())
                                    .then(callbackProvider.onSubscribed);
                            } else {
                                subscribeWithServiceWorker(callbackProvider.onSubscribe);
                            }
                        })
                        .catch(function(error) {
                            console.log('Push subscription error');
                        });
                }

                if (Notification.permission == 'default') {
                    setTimeout(getNotificationPermission, requestDelay);
                }
            })
            .catch(function(error) { console.log('Error registering SW') });
    }

    function getNotificationPermission() {
        Notification.requestPermission(function(permission) {
            if (permission == 'default') callbackProvider.onDefault();
            if (permission == 'denied') {
                notifyRequest({
                    domain: domainName,
                    event: "subscriptionDenied",
                    reason: "denied"
                }, callbackProvider.onDenied);
            }
            if (permission == 'granted') {
                subscribeWithServiceWorker(callbackProvider.onSubscribe);
            }
        });
    }

    /*******************************
     * Server communication
     ********************************/
    function notifyRequest(info, callback) {
        info["url"] = location.href.split("#")[0];
        if (!window.fetch) {
            if (document.cookie.indexOf("pushcentric_lns=1") != -1) {
                console.log("skip notify due to cookie");
                return;
            }
            document.cookie = "pushcentric_lns=1";
            var form = document.createElement("form");
            var iframe = document.createElement("iframe");
            form.method = "POST";
            form.action =
                "https://api.pushcentric.com/notify?name=" + domainURL;
            iframe.style.opacity = 0;
            iframe.width = iframe.height = 2;
            iframe.name = form.target = "pushcentric-notify-iframe";
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "json";
            input.value = JSON.stringify(info);
            form.appendChild(input);
            document.body.appendChild(form);
            document.body.appendChild(iframe);
            form.submit();
            callback();
        } else {
            return fetch(
                    "https://api.pushcentric.com/notify?name=" + domainURL, {
                        method: "POST",
                        mode: "cors",
                        credentials: "include",
                        body: JSON.stringify(info),
                        headers: { "content-type": "text/json" }
                    }
                ).then(callback)
                .catch(function(error) { console.log(error) });
        }
    }

    function sendSubscription(data) {
        data["url"] = location.href.split("#")[0];
        return fetch(
            "https://api.pushcentric.com/subscribe?domain=" +
            domainName +
            "&name=" +
            domainURL, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                body: JSON.stringify(data),
                headers: { "content-type": "text/json" }
            }
        );
    }


    /*******************************
     * Push API functions
     ********************************/
    function arrayFromBase64(d) {
        var rawData = atob(d);
        var buffer = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            buffer[i] = rawData.charCodeAt(i);
        }
        return buffer;
    }

    function subscribeWithServiceWorker(callback) {
        var publicApplicationKey = arrayFromBase64(publicKey);
        return navigator.serviceWorker
            .getRegistration()
            .then(function(registration) {
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: publicApplicationKey
                });
            })
            .then(function(subscription) {
                sendSubscription(subscription.toJSON()).then(callback);
            });
    }

}();