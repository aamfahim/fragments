# tests/integration/post-fragments-json.hurl
# Authenticated POST to /v1/fragments with a JSON Content-Type
POST http://localhost:8080/v1/fragments
# We're sending a JSON fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request
{"message": "This is a test JSON fragment"}

# We expect to get back an HTTP 201
HTTP/1.1 201

# Assertions about the POST response
[Asserts]
# Check for successful status
jsonpath "$.status" == "ok"
# Check the fragment id for correct syntax
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Check the owner id for correct syntax
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Check if created is string
jsonpath "$.fragment.created" isString
# Check if updated is string
jsonpath "$.fragment.updated" isString
# Check if type is correct
jsonpath "$.fragment.type" == "application/json"
# Check if size is correct type
jsonpath "$.fragment.size" isInteger

[Captures]
url: header "Location"

# Perform a GET request to retrieve the fragment's details
GET {{url}}
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200
# Check that the fragment type is application/json

Content-Type: application/json; charset=utf-8

# Assertions about the GET response
[Asserts]
# Check for successful status
# jsonpath "$.status" == "ok"

# Check for fragment equality
{"message":"This is a test JSON fragment"}

