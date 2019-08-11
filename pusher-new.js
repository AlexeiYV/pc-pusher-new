! function() {
    var debugMode = !!getURLParameter('debug');
    run();

    /*******************************
     * Main functions
     ********************************/
    function run() {
        var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),
            serviceWorkerSupport = navigator.serviceWorker;

        setDateParam();

        /* checks if browser support serviceWorker */
        if (isSafari || !serviceWorkerSupport) {
            return notifyRequest({
                domain: settingsProvider.domainName,
                event: "subscriptionDenied",
                reason: "unsupported"
            }, callbackProvider.onUnsupported);
        }

        navigator.serviceWorker.register("/service-worker.js")
            .then(function(registration) {
                if (Notification.permission === 'denied') {
                    notifyRequest({
                        domain: settingsProvider.domainName,
                        event: "subscriptionDenied",
                        reason: "denied"
                    }, callbackProvider.onDenied);
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
                    callbackProvider.onInit(getNotificationPermission);
                }
            })
            .catch(function(error) { console.log('Error registering SW: ', error) });
    }

    function getNotificationPermission() {
        Notification.requestPermission(function(permission) {
            if (permission == 'default') callbackProvider.onDefault();
            if (permission == 'denied') {
                notifyRequest({
                    domain: settingsProvider.domainName,
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
        if (debugMode) {
            console.log('notifyRequest', info);
            return callback();
        }
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
                settingsProvider.endpointDomain + "/notify?name=" + settingsProvider.domainURL;
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
                    settingsProvider.endpointDomain + "/notify?name=" + settingsProvider.domainURL, {
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
        console.log(debugMode);
        if (debugMode) {
            return new Promise(function(resolve, reject) {
                console.log('sendSubscription: ', data);
                resolve();
            });
        }
        data["url"] = location.href.split("#")[0];
        return fetch(
            settingsProvider.endpointDomain + "/subscribe?domain=" +
            settingsProvider.domainName +
            "&name=" +
            settingsProvider.domainURL, {
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
        if (debugMode) {
            console.log('subscribeWithServiceWorker');
            return callback();
        }
        var publicApplicationKey = arrayFromBase64(settingsProvider.publicKey);
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

    /*******************************
     * Utilities 
     ********************************/
    function getURLParameter(name) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === name) { return decodeURI(pair[1]); }
        }
        return "";
    }

    function addURLParameter(paramNAme, paramValue) {
        var currentUrl = document.location.href,
            addSign = (currentUrl.indexOf('?') > -1) ? '&' : '?';

        return currentUrl + addSign + paramNAme + '=' + paramValue;
    }

    function setDateParam() {
        if (typeof moment != 'undefined') {
            if (!getURLParameter('date')) {
                var urlDate = addURLParameter('date', moment(new Date()).tz('America/Los_Angeles').format('DDMMYYYY'));
                history.replaceState({}, '', urlDate);
            }
        }
    }

    function setSIDParam() {
        if (!getURLParameter('pushcentric-sid')) {
            var urlSID = addURLParameter('pushcentric-sid', Date.now());
            history.replaceState({}, '', urlSID);
        }
    }
}();