# API Doc

====================================================================
For local, http://localhost:3001

- ## Public API

====================

## Client

====================

### Request SMS for register (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/client/register/request-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
}
```

Response: { "status": "OK" }

### Confirm the verification Code and register with the user information (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/client/register/confirm-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
    "code": "63hfkw", // the verification code is 6 digits
    "firstName": "Dilan",
    "lastName": "Nana"
}
```

Response:
{
"user": {
"firstName": "Dilan",
"lastName": "Nana",
"phoneNumber": {
"formatted": "+16502570295",
"nonFormatted": "6502570295"
}
"id": "61133ec454e3e1798a92e2d6"
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTEzM2VjNDU0ZTNlMTc5OGE5MmUyZDYiLCJpYXQiOjE2Mjg2NTEyMDR9.CmgW6H9nSfVCodBCw_wBLROoBxqX3d92myuofjFobtg"
}

### Request SMS for login (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/client/login/request-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
}
```

Response: { "status": "OK" }

### Confirm the verification Code and login with the phone number (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/client/login/confirm-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
    "code": "63hfkw", // the verification code is 6 digits
}
```

Response:
{
"user": {
"firstName": "Dilan",
"lastName": "Nana",
"phoneNumber": {
"formatted": "+16502570295",
"nonFormatted": "6502570295"
}
"id": "61133ec454e3e1798a92e2d6"
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTEzM2VjNDU0ZTNlMTc5OGE5MmUyZDYiLCJpYXQiOjE2Mjg2NTEyMDR9.CmgW6H9nSfVCodBCw_wBLROoBxqX3d92myuofjFobtg"
}

====================

## Owner

====================

### Request SMS for register (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/owner/register/request-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
}
```

Response: { "status": "OK" }

### Confirm the verification Code and register with the user information (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/owner/register/confirm-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
    "code": "63hfkw", // the verification code is 6 digits
    "firstName": "Dilan",
    "lastName": "Nana"
}
```

### Request SMS for login (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/owner/login/request-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
}
```

Response: { "status": "OK" }

### Confirm the verification Code and login with the phone number (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/owner/login/confirm-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
    "code": "63hfkw", // the verification code is 6 digits
}
```

====================

## Stylist

====================

### Request SMS for login (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/stylist/login/request-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
}
```

Response: { "status": "OK" }

### Confirm the verification Code and login with the phone number (Use the phone number into E.164 format)

URL: http://localhost:3001/api/auth/stylist/login/confirm-sms
Method: POST
Body data:

```
{
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    }
    "code": "63hfkw", // the verification code is 6 digits
}
```

=============================================================================

- ## Authenticate API

- Add the following thing in the request header:

```
Authorization: Bearer <your token>
```

==============================

## Client APIs

==============================

### Get all appointments for the signin client

URL: http://localhost:3001/api/client/appointment/list/all
Method: GET
Response:
[{
id: id,
service: <Service>,
stylist: <Stylist>,
salon: <Salon>,
startTime: <Date>,
endTime: <Date>,
status: {
"isCancelled": <Boolean>,
"isConfirmed": <Boolean>,
"isCompleted": <Boolean>
},
statusText: "pending_confirmation" | "active" | "started" | "past" | "cancelled"
}]

### Get all appointments for the signin as provider

URL: http://localhost:3001/api/provider/appointment/list/all
URL: http://localhost:3001/api/provider/appointment/list/<daily|weekly|monthly>/:date // "YYYY-MM-DD"
Method: GET
Response:
{
"YYYY-MM-DD": [{
id: id,
service: <Service>,
stylist: <Stylist>,
client: <Client>,
startTime: <Date>,
endTime: <Date>,
status: {
"isCancelled": <Boolean>,
"isConfirmed": <Boolean>,
"isCompleted": <Boolean>
},
statusText: "pending_confirmation" | "active" | "started" | "past" | "cancelled"
}],
...
}

### Get a special appointment

URL: http://localhost:3001/api/client/appointment/details/<APPOINTMENT_ID>
Method: GET
Response:
{
"scheduledDate": "...",
"startTime": "..."
...
"salon": { ... },
"client": { ... }
}

### Get salon list (Return the max random 50 salons)

URL: http://localhost:3001/api/client/salon/list/
Method: GET

### Add the client's review

URL: http://localhost:3001/api/client/salon/review
Method: POST

```
{
    "salonId": "612fe557bfc4583ef720a714",
    "comment": "This is the best salon.",
    "rating": 5
}
```

### Get all promotions for the salon

URL: http://localhost:3001/api/client/promotion/<Salon_ID>
Method: GET

### Get specific promotion

URL: http://localhost:3001/api/client/promotion/details/<Promotion_ID>
Method: GET

### Create the appointment on client side, send the notification to the stylist and salon

URL: http://localhost:3001/api/client/appointment/create
Method: POST
Body data:

```
{
    "serviceId": "61357de21a0842836f692e0d",
    "stylistId": "6130b66c09e406af6683949b",
    "salonId": "613570f61a0842836f692dff",
    "startTime": "2021-09-20T15:30:00.744Z",
}
```

### Update Profile of client

URL: http://localhost:3001/api/client/profile/update/<Client_ID>
Method: PUT
Body data:

```
{
    "firstName": "Dilan",
    "lastName": "Nana",
    "phoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    },
    "photo": "<base64-code>" // optional (Remove this if photo is not updated)
}
```

==============================

## Provider APIs

==============================

### Add a new promotion

URL: http://localhost:3001/api/provider/promotion
Method: POST
Body data:

```
{
    "salonId": "611db4b9179d927667046ae7",
    "promotionTitle": "50% OFF MENS Haircuts",
    "promotionDescription": "50% off any haircuts on men who come in before 5PM Tuesday",
    "promotionNewPrice": "80",
    "promotionOldPrice": "160",
    "discount": "50",
    "photos": ["<Base64-code>", "<Base64-code>", ....]
}
```

### Delete a promotion

URL: http://localhost:3001/api/provider/promotion/deletePromotion/<Promotion_ID>
Method: POST
Body data:

```
{
    "id":"611db4b917932937667046s97"
    "salonId": "611db4b9179d927667046ae7"
}
```

### Book a new appointment

URL: http://localhost:3001/api/provider/appointment/create
Method: POST
Body data:

```
{
    "serviceId": "6123f1ee45c644663efa4ae7",
    "stylistId": "6123ecf5433ec760aa688353",
    "clientId": "611a87ac2b3d84d49fc39a64",
    "startTime": "2021-08-30T12:30:00.744Z"
}
```

### Get all salon stylist

URL: http://localhost:3001/api/provider/stylist/list/all
Method: GET

### Get Salon Profile

URL: http://localhost:3001/api/provider/businessInformation/getProfile/<Salon_ID>
Method: GET

### Submit Basic Salon Info

URL: http://localhost:3001/api/provider/businessInformation/basicInfo
Method: POST
Body data:

```
{
    "id": "<Owner_ID>",
    "salonName": "Dilan-salon",
    "salonAddress": "Palo Alto, CA",
    "salonPhoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    },
    "salonBio": "This is Dilan salon.",
    "salonURL": "https://www.Dilan-salon.com",
    "timezone": "America/Creston"
}
```

### Update Basic Salon Info

URL: http://localhost:3001/api/provider/businessInformation/basicInfo
Method: POST
Body data:

```
{
    "id": "<Salon_ID>",
    "salonName": "Dilan-salon-new",
    "salonAddress": "Palo Alto, CA",
    "salonPhoneNumber": {
        "formatted": "+16502570295",
        "nonFormatted": "6502570295"
    },
    "salonBio": "This is the new Dilan salon.",
    "salonURL": "https://www.Dilan-salon.com",
    "timezone": "America/Creston"
}
```

### Submit Salon Tags

URL: http://localhost:3001/api/provider/businessInformation/salonTags
Method: POST
Body data:

```
{
    "id": "<Salon_ID>",
    "salonTags": ["tag1", "tag2"]
}
```

### Submit Salon Photos

URL: http://localhost:3001/api/provider/businessInformation/salonPhotos
Method: POST
Body data:

```
{
    "id": "<Salon_ID>",
    "photos": ["<base64 image code>", "<base64 image code>"]
}
```

### Submit Employees

URL: http://localhost:3001/api/provider/businessInformation/salonEmployees
Method: POST
Body data:

```
{
    "id": "<Salon_ID>",
    "salonEmployees": [
        {
            firstName: "",
            lastName: "",
            phoneNumber: {
              formatted: "",
              nonFormatted: "",
            },
        },
        {
            .....
        }
    ]
}
```

### Delete Employee

URL: http://localhost:3001/api/provider/businessInformation/salonEmployees/:stylistId
Method: delete

### Submit Salon Business Hours

URL: http://localhost:3001/api/provider/businessInformation/businessHours
Method: POST
Body data:

```
{
    "id": "<Salon_ID>",
    "operatingHours": [
        {
            day: "",
            start: "",
            end: "",
            breaks: [
                {
                    start: "",
                    end: "",
                }
            ],
            isClosed: false,
        }
    ]
}
```

### Get Employees For Service Dropdown

URL: http://localhost:3001/api/provider/businessInformation/getEmployees/<Salon_ID>
Method: GET

### Create Services For a Salon

URL: http://localhost:3001/api/provider/businessInformation/service
Method: POST
Body data:

```
{
    "id": "<Salon_ID>",
    "service": {
        serviceTitle: "SOLO",
        servicePrice: 100,
        serviceDescription: "MOEl",
        serviceArtists: ["<Stylist_ID>", "<Stylist_ID>"],
        serviceDuration: 5
    }
}
```

### Update Services For a Salon

URL: http://localhost:3001/api/provider/businessInformation/service/<Service_ID>
Method: PUT
Body data:

```
{
    serviceTitle: "SOLO",
    servicePrice: 100,
    serviceDescription: "MOEl",
    serviceArtists: ["<Stylist_ID>", "<Stylist_ID>"],
    serviceDuration: 5
}
```

### Delete Service

URL: http://localhost:3001/api/provider/businessInformation/service/<Service_ID>
Method: DELETE

### Get earnings for provider

URL: http://localhost:3001/api/provider/earnings/<Salon_ID>
Method: GET

==============================

## Owner/Customer/Stylist APIs

==============================

### Search for salons

URL: http://localhost:3001/api/search/salon?str=chen
Method: GET

### Search for services

URL: http://localhost:3001/api/search/service?str=GEL
Method: GET

### Get slots for appointment

URL: http://localhost:3001/api/appointment/slots/<Salon_ID>
Method: POST
Body data (all optional):

```json
{
  "serviceId": "<Service_ID>",
  "stylistId": "<Stylist_ID>",
  "date": "<Date>", // "YYYY-MM-DD"
  "numDays": 7
}
```

### Register the device token for the push notification

URL: http://localhost:3001/api/notification/register
Method: POST
Body data:

```
{
    "token": "asdfawefds3jw38sf",
    "role": "CUSTOMER" // or "OWNER"
    "id": "1658gs8g5s8g5" // customer_id or owner_id
}
```

### Cancel an appointment and send the push notification

URL: http://localhost:3001/api/appointment/update/cancel/<Appointment_ID>
Method: POST

### Confirm an appointment and send the push notification

URL: http://localhost:3001/api/appointment/update/confirm/<Appointment_ID>
Method: POST
