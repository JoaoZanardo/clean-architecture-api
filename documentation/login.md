# Login Route

## Success Cases

✅ Valid **email** and **password**
✅ Valid if **email** is a valid e-mail
✅ Valid if **password** is correct
✅ **Search** for the user with email and password provided
✅ Generate an **access-token** with the user id
✅ **Update** the user´s data with the token
✅ Returns **200** with the **access-token**

## Exceptions Cases

❌ Returns error **400** if email or password is no provided by the client
❌ Returns error **400** if email is an invalid e-mail
❌ Returns error **401** if no user is found with the provided data
❌ Returns error **500** if throws when comparing the passwords
❌ Returns error **500** if throws when generating token
❌ Returns error **500** if throws when updating the user with the generated token
