# SignUp Route

## Success Cases

1.  ✅ Valid **name**, **email**, **password**, **confirmationPassword**
2.  ✅ Valid if **email** is a valid e-mail
3.  ✅ Valid if **password** and **confirmationPassword** match
4.  ✅ **Search** if the email provided already exists
5.  ✅ **Hash** the password provided
6.  ✅ Create a new **User**
7.  ✅ **Search** for the user with email and password provided
8.  ✅ Generate an **access-token** with the user id
9.  ✅ **Update** the user data with the token
10. ✅ Returns **200** with the **access-token**

## Exceptions Cases

1.  ❌ Returns error **400** if name, email, password or confirmationPassword is no provided by the client
2.  ❌ Returns error **400** if email is an invalid e-mail
3.  ❌ Returns error **400** if passwords do not match
4.  ❌ Returns error **403** if email already exists
5.  ❌ Returns error **401** if no user is found with the provided data
6.  ❌ Returns error **500** if throws when search an user with the email provided
7.  ❌ Returns error **500** if throws hashing password
8.  ❌ Returns error **500** if throws when comparing the passwords
9.  ❌ Returns error **500** if throws when generating token
10. ❌ Returns error **500** if throws when updating the user with the generated token
