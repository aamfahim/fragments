# POST a new JSON fragment as an authorized user
POST http://localhost:8080/v1/fragments
# We're sending a JSON fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request
{"service": "DynamoDB"}

# We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"
fragment1_ownerId: jsonpath "$.fragment.ownerId"
fragment1_created: jsonpath "$.fragment.created"
fragment1_updated: jsonpath "$.fragment.updated"
fragment1_type: jsonpath "$.fragment.type"
fragment1_size: jsonpath "$.fragment.size"

# GET fragment info for the first fragment
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200
[Asserts]
# Check for fragment equality
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.fragment.ownerId" == {{fragment1_ownerId}}
jsonpath "$.fragment.created" == {{fragment1_created}}
jsonpath "$.fragment.updated" == {{fragment1_updated}}
jsonpath "$.fragment.type" == {{fragment1_type}}
jsonpath "$.fragment.size" == {{fragment1_size}}



# POST a new JSON fragment as an authorized user
POST http://localhost:8080/v1/fragments
# We're sending a JSON fragment
Content-Type: text/markdown
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request
`DynamoDB is **great**.`

# We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"
fragment2_ownerId: jsonpath "$.fragment.ownerId"
fragment2_created: jsonpath "$.fragment.created"
fragment2_updated: jsonpath "$.fragment.updated"
fragment2_type: jsonpath "$.fragment.type"
fragment2_size: jsonpath "$.fragment.size"

# GET fragment info for the second fragment
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200
[Asserts]
# Check for fragment equality
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.ownerId" == {{fragment2_ownerId}}
jsonpath "$.fragment.created" == {{fragment2_created}}
jsonpath "$.fragment.updated" == {{fragment2_updated}}
jsonpath "$.fragment.type" == {{fragment2_type}}
jsonpath "$.fragment.size" == {{fragment2_size}}

# GET all fragments for the same authorized user
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Check if the returned array includes the fragment ids
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}



# DELETE the first fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

# Try to GET the first fragment again
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 404
HTTP/1.1 404

# GET all fragments for the same authorized user
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Check if the returned array includes the fragment ids
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}
