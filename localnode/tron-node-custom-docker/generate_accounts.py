import os
import json
from tronpy.keys import PrivateKey

def generate_accounts(num_accounts, default_balance):
    accounts = []

    for _ in range(num_accounts):
        private_key = PrivateKey.random()
        address = private_key.public_key.to_base58check_address()

        account = {
            'address': address,
            'privateKey': private_key.hex(),
            'balance': default_balance
        }
        accounts.append(account)

    return accounts

if __name__ == '__main__':
    num_accounts = int(os.environ.get('accounts', 20))
    default_balance = int(os.environ.get('defaultBalance', 10000000000000))
    format_json = os.environ.get('formatJson', 'false').lower() == 'true'

    accounts = generate_accounts(num_accounts, default_balance)
    
    if format_json:
        print(json.dumps(accounts, indent=2))
    else:
        print(json.dumps(accounts))

    # Save accounts to a file
    with open('/tron/accounts.json', 'w') as f:
        json.dump(accounts, f, indent=2 if format_json else None)
