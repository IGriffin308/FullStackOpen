```mermaid
  sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>browser: text/html charset=utf-8

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>browser: text/css charset=UTF-8

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    server-->>browser: application/javascript charset=UTF-8

    Note right of browser: Returned Javascript makes call to retrieve JSON

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>browser: application/json charset=utf-8

    Note right of browser: Browser renders returned JSON after it receives status 200 from previous request
```