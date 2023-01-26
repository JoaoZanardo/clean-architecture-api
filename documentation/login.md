# Login Route

## Success Cases

1. ✅ Valid **email** and **password**
2. ✅ Valid if **email** is a valid e-mail
3. ✅ Valid if **password** is correct
4. ✅ **Search** for the user with email and password provided
5. ✅ Generate an **access-token** with the user id
6. ✅ **Update** the user´s data with the token
7. ✅ Returns **200** with the **access-token**

## Exceptions Cases

1. ❌ Returns error **400** if email or password is no provided by the client
2. ❌ Returns error **400** if email is an invalid e-mail
3. ❌ Returns error **401** if no user is found with the provided data
4. ❌ Returns error **401** if an invalid password is provided
5. ❌ Returns error **500** if throws when comparing the passwords
6. ❌ Returns error **500** if throws when generating token
7. ❌ Returns error **500** if throws when updating the user with the generated token
