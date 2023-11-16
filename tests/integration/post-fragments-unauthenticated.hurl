# tests/integration/post-fragments-unauthenticated.hurl
# Attempt to POST to /v1/fragments without authentication
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request
`This is a test fragment without authentication`

# We expect to get back an HTTP 401 (Unauthorized)
HTTP/1.1 401

# Assertions about the response
[Asserts]
# Check that the status is 'error'
jsonpath "$.status" == "error"
# Check that the error message is about authentication failure
jsonpath "$.error.message" matches "Unauthorized"
