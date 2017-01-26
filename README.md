# Spree

https://spree-save.herokuapp.com/

# Bank Authentication
During user signup, if you are uncomfortable entering your own personal banking information,
select a bank and enter the user id : "#BANK_DEMO" with any password. This will set up a mock bank account for you
with fake transactions so you can use the app. $50.00 will also be added to your account so you can go use the app
to explore events and purchase tickets.

# Security
Passwords are hashed and the app does not save any financial information about the user other than what bank
the user uses. Plaid (https://plaid.com) is a 3rd party API that handles all the bank transactions. Paid handles bank transactions fora number of commercial app such as Mint, Robinhood, etc. 
