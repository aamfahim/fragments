# tests/integration/put-fragment.hurl

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

[Captures]
url: header "Location"

# Perform a PUT request to update the fragment's details
PUT {{url}}
[BasicAuth]
user1@email.com:password1
{"message": "This is an updated JSON fragment"}

# We expect to get back an HTTP 200
HTTP/1.1 200

# Check for successful status
# jsonpath "$.status" == "ok"


# Perform a GET request to retrieve the updated fragment's details
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
{"message":"This is an updated JSON fragment"}