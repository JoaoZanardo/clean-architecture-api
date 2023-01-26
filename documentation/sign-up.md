# SignUp Route

## Success Cases

✅ Valid **name**, **email**, **password**, **confirmationPassword**
✅ Valid if **email** is a valid e-mail
✅ Valid if **password** and **confirmationPassword** match
✅ **Search** if the email provided already exists
✅ **Hash** the password provided
✅ Create a new **User**
✅ **Search** for the user with email and password provided
✅ Generate an **access-token** with the user id
✅ **Update** the user data with the token
✅ Returns **200** with the **access-token**

## Exceptions Cases

❌ Returns error **400** if name, email, password or confirmationPassword is no provided by the client
❌ Returns error **400** if email is an invalid e-mail
❌ Returns error **400** if passwords do not match
❌ Returns error **403** if email already exists
❌ Returns error **401** if no user is found with the provided data
❌ Returns error **500** if throws when search an user with the email provided
❌ Returns error **500** if throws hashing password
❌ Returns error **500** if throws when comparing the passwords
❌ Returns error **500** if throws when generating token
❌ Returns error **500** if throws when updating the user with the generated token
