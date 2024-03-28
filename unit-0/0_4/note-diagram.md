```mermaid
  sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: text/html; charset=utf-8
    deactivate server

    Note right of browser: The browser reloads, The server appends new note to JSON

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: text/html; charset=utf-8
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: text/css; charset=UTF-8
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: application/javascript; charset=UTF-8
    deactivate server

    Note right of browser: Returned Javascript makes call to retrieve JSON

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: application/json; charset=utf-8
    deactivate server

    Note right of browser: Browser renders returned JSON after it receives status 200 from previous request
```