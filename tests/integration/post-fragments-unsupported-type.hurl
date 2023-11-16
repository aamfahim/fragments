# tests/integration/post-fragments-unsupported-type.hurl
# Attempt to POST to /v1/fragments with an unsupported Content-Type
POST http://localhost:8080/v1/fragments
# We're sending a fragment with an unsupported content type
Content-Type: application/unsupported
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is an unsupported content type fragment`

# We expect to get back an HTTP 415 (Unsupported Media Type)
HTTP/1.1 415

# Assertions about the response
[Asserts]
# Check that the status is 'error'
jsonpath "$.status" == "error"
# Check that the error message is about unsupported type
jsonpath "$.error.message" matches ".*Unsupported type.*"
