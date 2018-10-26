# Main soket events.
bot can be controlled via a socket connection.

* Get Wallet info.

request
```json
{
    "type": 9
}
```
response
```json
[
  {
    "address": "0x3dd049618D94d9584f71CA4ED1b81343Dfa538f5",
    "privateKey": "0x2d60fed4f0ba370aa57ddee3b15ae53015f980d431b5e24d0c456ea3e722833d"
  },
  {
    "address": "0x515468D420405BF5fbcf6a2dA1fC8d24117D7Aea",
    "privateKey": "0xc70803a35294ddafc651a36025701ea5561b71b63635aad48da362f523e22b1a"
  }
]
```

* Default value gas limit.

request
```json
{
    "type": 8,
    "body": 21000
}
```
response
```json
{
  "type": 8,
  "code": "done"
}
```

* Default value gas price.

request
```json
{
    "type": 7,
    "body": 300000000
}
```
response
```json
{
  "type": 8,
  "code": "done"
}
```

* Send pool transactions.

request
```json
{
    "type": "SENDPOOLTRANSACTION",
    "body": {
        "address":"0xA98060409a31FdF92754ADD44645d273578185C7", // address to.
        "data":{ // number of addresses of pool tx.
            "take":100,
            "skip":0
        },
        "min":1000000000000000000, // Minimal value.
        "max":1000000000000000000, // Maximal value.
        "gas":{ // Gas Price.
            "max":1000000000,
            "min":1000000000
        },
        "time":{ // Time interval between transactions.
            "max":1,
            "min":100
        }
    }
}
```
response
```json
{
  "type": "ONHASH",
  "body": {
    "tx": {
      "hash": "0x9e6c021ade8805002bfb8ce8036d4933166262f14ba0a6439c49be3da00639d3"
    },
    "timer": 10
  }
}
{
  "type": "ONBLOCK",
  "body": {
    "tx": {
      "block": {
        "blockHash": "0xe70770834bf67f14c1a679b571c4bdb640493c764db5d158c868d58db09302f4",
        "blockNumber": 9169875,
        "contractAddress": null,
        "cumulativeGasUsed": 392831,
        "from": "0xd868890a043b9d0dc8b071361b9bfd658123bd32",
        "gasUsed": 21000,
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "root": null,
        "status": true,
        "to": "0xa98060409a31fdf92754add44645d273578185c7",
        "transactionHash": "0x9e6c021ade8805002bfb8ce8036d4933166262f14ba0a6439c49be3da00639d3",
        "transactionIndex": 3
      }
    },
    "timer": 10
  }
}
```


* Start the synchronization.

request
```json
{ 
  "type": "SYNCHRONIZATION", 
  "body": {
    "address": "0xA98060409a31FdF92754ADD44645d273578185C7" 
  }
}
```
response
```json
{
  "type": 1,
  "body": {
    "hash": "0xad1ed8d45e267176b8f52f129f33c227ead7bee914200d17e3a2e146eed8758d"
  }
}
{
  "type": 1,
  "body": {
    "block": {
      "blockHash": "0x1628b2a5ea1190b3b54e1822030ac5b60b03b986bfa2bb50c582a6d36497c3de",
      "blockNumber": 9169928,
      "contractAddress": null,
      "cumulativeGasUsed": 63000,
      "from": "0x6f2fb0488cc5e7dc6e9b5fbc145eed6c3cbd4f8f",
      "gasUsed": 21000,
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "root": null,
      "status": true,
      "to": "0x1a4c89b598c9d3a1e9b5e7b5545c450edad00f87",
      "transactionHash": "0xc96f2c7729d8670ade0059984c11119f7d0146164990427d6a9ef96bb4c248b6",
      "transactionIndex": 2
    }
  }
}
```


* Send one transaction.

request
```json
{
    "type": 1,
    "body": {
       "from": "0x4D89aBeDA15d4bb433D4E3FF06D10845F2783af0",
       "to": "0xA98060409a31FdF92754ADD44645d273578185C7",
       "value": 100000000000000
    }
}
```
response
```json
{
  "type": 1,
  "body": {
    "hash": "0xad1ed8d45e267176b8f52f129f33c227ead7bee914200d17e3a2e146eed8758d"
  }
}
{
  "type": 1,
  "body": {
    "block": {
      "blockHash": "0x1628b2a5ea1190b3b54e1822030ac5b60b03b986bfa2bb50c582a6d36497c3de",
      "blockNumber": 9169928,
      "contractAddress": null,
      "cumulativeGasUsed": 63000,
      "from": "0x6f2fb0488cc5e7dc6e9b5fbc145eed6c3cbd4f8f",
      "gasUsed": 21000,
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "root": null,
      "status": true,
      "to": "0x1a4c89b598c9d3a1e9b5e7b5545c450edad00f87",
      "transactionHash": "0xc96f2c7729d8670ade0059984c11119f7d0146164990427d6a9ef96bb4c248b6",
      "transactionIndex": 2
    }
  }
}
```


* Get balance an any address.

request
```json
{
    "type": 4,
    "body": "0xA98060409a31FdF92754ADD44645d273578185C7"
}
```
response
```json
{
  "type": 4,
  "body": {
    "address": "0xA98060409a31FdF92754ADD44645d273578185C7",
    "ether": "3.876072118381956337",
    "unit256": "3876072118381956337"
  }
}
```

* Get all balance wallet.

request
```json
{
    "type": 5,
    "body": {
        "take": 100,
        "skip": 0
    }
}
```
response
```json
{
  "type": 5,
  "body": {
    "address": "0xBAe876479A1f16065DA906C10DbC942a35Bb7264",
    "ether": "0.00000189",
    "unit256": "1890000000000"
  }
}
{
  "type": 5,
  "body": {
    "address": "0xe1A22b13408259CF7ce586d4e5B0bDfe3B427265",
    "ether": "0.00000189",
    "unit256": "1890000000000"
  }
}
```
