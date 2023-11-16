# tests/integration/post-fragments-charset.hurl
# Authenticated POST to /v1/fragments with a charset in Content-Type
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment with charset
Content-Type: text/plain; charset=utf-8
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request
`This is a test fragment with charset`

# We expect to get back an HTTP 201
HTTP/1.1 201

# Assertions about the POST response
[Asserts]
# Check for successful status
jsonpath "$.status" == "ok"
# Check the fragment id for correct syntax
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
[Captures]
fragmentId: jsonpath "$.fragment.id"

# Perform a GET request to retrieve the fragment's details
GET http://localhost:8080/v1/fragments/{{fragmentId}}/info
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

# Assertions about the GET response
[Asserts]
# Check for successful status
jsonpath "$.status" == "ok"
# Validate the fragment type includes charset
jsonpath "$.fragment.type" == "text/plain; charset=utf-8"
